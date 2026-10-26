"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

/** A random id per conversation, so the server can group its turns into one
 *  row. Not a cookie and not tied to a person: a new one on every page load. */
function randomId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  );
}

/**
 * A stable id for this browser, kept in localStorage.
 *
 * The conversation id is new on every page load, so without this a returning
 * visitor is an unrelated row and their earlier questions are invisible. This
 * is not an identity: clearing site data, using a private window or opening
 * the site on another device all start a new one, and it is never linked to a
 * name or an email by the site.
 */
function loadVisitorId(): string {
  const KEY = "lyra-visitor";
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return saved;
    const id = randomId();
    localStorage.setItem(KEY, id);
    return id;
  } catch {
    return randomId(); // storage blocked — this visit simply stands alone
  }
}

/* The first thing anyone reads here. It was written as a description of the
   assistant — what it is, what it knows, what it does when it fails — which
   reads like a bot introducing its feature set. Someone opening a chat wants
   to be greeted and helped, so this does that and gets out of the way. The
   disclosure that this is an AI lives in the header, where it belongs,
   rather than in the first sentence a person hears. */
const OPENING =
  "Hi, I’m Lyra. Happy to help. Tell me what you’re working on, or ask anything about working with us. If I can’t answer something, I’ll point you to someone who can.";

/**
 * When the nudge fires, and the rules around it.
 *
 * The published guidance on proactive chat is unusually consistent for a
 * marketing practice, and it disagrees with the obvious implementation:
 *
 * - Do not fire on a plain timer. Behaviour beats timers — scroll depth, time
 *   read, exit intent — because a timer fires while someone is still reading
 *   the top of the page.
 * - Cap it at once per session, and never re-show one that was dismissed. The
 *   number that matters is the annoyance rate, not the impression count.
 * - Let it retire on its own if ignored, and pause that clock while the
 *   pointer is on it.
 * - Keep the copy a *question*. A question gives someone something to answer;
 *   a statement gives them something to dismiss.
 */
const TEASER_FLOOR_MS = 6000; // never before the page has settled
const TEASER_AFTER_MS = 14000; // or this long on the page, unscrolled
const TEASER_AT_SCROLL = 0.15; // …or a fifth of the way down, whichever first
const TEASER_LIFETIME_MS = 22000; // retire if ignored
const TEASER_KEY = "lyra-teaser";

/**
 * The assistant, as a panel in the corner.
 *
 * The conversation lives in this component's state, and a finished copy of it
 * is written to the database so a question can be picked up by a person
 * afterwards (see lib/transcripts.ts). Closing the panel ends the session in
 * the browser; the stored copy stays until someone deletes it, which /privacy
 * says plainly.
 *
 * Replies arrive as SSE from /api/chat and are appended a delta at a time, so
 * the first words land immediately rather than after the whole answer is
 * written.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teaser, setTeaser] = useState(false);
  const [teaserHeld, setTeaserHeld] = useState(false);

  /** Fire the nudge, once, and record that it has been seen this session. */
  const showTeaser = () => {
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      /* storage blocked — treat this session as already nudged */
    }
    setTeaser(true);
  };

  const sessionRef = useRef<string | null>(null); // one per page load
  const visitorRef = useRef<string | null>(null); // one per browser
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Keep the newest message in view as it streams in.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setTeaser(false); // opening the panel is itself the answer to the nudge
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // The nudge itself. See the constants above for why it is shaped this way.
  useEffect(() => {
    // Anything other than "never shown this session" — including storage being
    // unavailable in a private window — means stay quiet. Erring toward silence
    // is the whole point of the rules.
    try {
      if (sessionStorage.getItem(TEASER_KEY)) return;
    } catch {
      return;
    }

    const start = Date.now();
    // One timer checks both conditions rather than a timer plus a scroll
    // listener. A listener only fires while scrolling, so a reader who scrolls
    // early and then settles would never be re-evaluated once the floor has
    // passed — they would sit there until the long fallback.
    const poll = window.setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= TEASER_AFTER_MS) {
        window.clearInterval(poll);
        showTeaser();
        return;
      }
      if (elapsed < TEASER_FLOOR_MS) return;
      const readTo =
        window.scrollY /
        Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (readTo >= TEASER_AT_SCROLL) {
        window.clearInterval(poll);
        showTeaser();
      }
    }, 1000);

    return () => window.clearInterval(poll);
  }, []);

  // Retire it if it is ignored — but not while someone is reading it or
  // reaching for it.
  useEffect(() => {
    if (!teaser || teaserHeld) return;
    const t = window.setTimeout(() => setTeaser(false), TEASER_LIFETIME_MS);
    return () => window.clearTimeout(t);
  }, [teaser, teaserHeld]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setError(null);

    // Append to the empty assistant turn rather than replacing it, so the
    // streamed deltas land in the bubble that is already on screen.
    const appendToReply = (chunk: string) =>
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        copy[copy.length - 1] = { ...last, content: last.content + chunk };
        return copy;
      });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next,
          sessionId: (sessionRef.current ??= randomId()),
          visitorId: (visitorRef.current ??= loadVisitorId()),
        }),
      });

      if (!res.ok || !res.body) {
        // The route answers failures with JSON before it starts streaming, so
        // there is a message to show rather than a guess.
        const body = await res.json().catch(() => null);
        setError(
          res.status === 429
            ? "That was a lot of messages at once. Give it a moment and try again."
            : (body?.error ??
              "Something went wrong on our end. You can email hello@layrus.com instead."),
        );
        setMessages(next);
        return;
      }

      // Plain text deltas, appended as they arrive.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let received = false;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          received = true;
          appendToReply(chunk);
        }
      }

      // A reply that arrives empty means the stream died after the headers went
      // out, where no status code was left to fail with. Say so rather than
      // leaving an empty bubble sitting there.
      if (!received) {
        setError("I could not answer that just now. Email hello@layrus.com and we will pick it up.");
        setMessages(next);
      }
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setMessages(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="layrus-chat"
        onMouseEnter={() => setTeaserHeld(true)}
        onMouseLeave={() => setTeaserHeld(false)}
        onFocusCapture={() => setTeaserHeld(true)}
        onBlurCapture={() => setTeaserHeld(false)}
        aria-label={open ? "Close the assistant" : "Ask Lyra, the Layrus Labs assistant"}
        style={{ backgroundColor: "var(--accent-green)", color: "var(--bg-page)" }}
        className="fixed bottom-5 right-5 z-50 flex h-12 items-center gap-2.5 px-4
                   text-sm font-semibold whitespace-nowrap shadow-lg
                   transition-transform duration-150 hover:scale-[1.03] motion-reduce:transition-none"
      >
        {/* The nudge, inside the button. It grows leftwards because the
            button is anchored right, so nothing has to be positioned — and
            because it is the button, it covers no content. The copy is a
            question: a question is something to answer, a statement is
            something to dismiss. */}
        {teaser && !open && (
          <>
            <span className="lyra-nudge">Not sure which service fits?</span>
            <span
              aria-hidden="true"
              className="lyra-nudge h-5 w-px shrink-0"
              style={{ backgroundColor: "currentColor", opacity: 0.3 }}
            />
          </>
        )}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.3-.7L3 21l1.9-5.1A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z" />
        </svg>
        {open ? "Close" : "Ask Lyra"}
      </button>

      {open && (
        <section
          id="layrus-chat"
          role="dialog"
          aria-label="Chat with Lyra, the Layrus Labs assistant"
          style={{ backgroundColor: "var(--bg-raised)", borderColor: "var(--border-card)" }}
          className="fixed bottom-20 right-5 z-50 flex h-[min(30rem,70vh)] w-[min(24rem,calc(100vw-2.5rem))]
                     flex-col border shadow-xl"
        >
          <header
            style={{ borderBottomColor: "var(--border-subtle)" }}
            className="flex items-center justify-between gap-3 border-b px-4 py-3"
          >
            <span className="flex flex-col">
              <span
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
                className="text-base font-bold leading-tight"
              >
                Lyra
              </span>
              <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }} className="text-[0.6875rem]">
                Layrus Labs · AI assistant
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
              aria-label="Close the assistant"
              style={{ color: "var(--text-muted)" }}
              className="p-1 text-lg leading-none transition-colors hover:text-[var(--text-primary)]"
            >
              &times;
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
            <p
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
              className="text-sm leading-relaxed"
            >
              {OPENING}
            </p>

            {messages.map((m, i) => (
              <div key={i} className={`mt-4 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  style={{
                    backgroundColor: m.role === "user" ? "var(--accent-green)" : "var(--bg-surface)",
                    color: m.role === "user" ? "var(--bg-page)" : "var(--text-primary)",
                    fontFamily: "var(--font-inter)",
                  }}
                  className="max-w-[85%] whitespace-pre-wrap px-3 py-2 text-sm leading-relaxed"
                >
                  {m.content || (busy && i === messages.length - 1 ? "…" : "")}
                </p>
              </div>
            ))}

            {error && (
              <p
                style={{ color: "var(--accent-terracotta)", fontFamily: "var(--font-inter)" }}
                className="mt-4 text-sm leading-relaxed"
              >
                {error}
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            style={{ borderTopColor: "var(--border-subtle)" }}
            className="flex items-center gap-2 border-t p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What are you trying to build?"
              aria-label="Your message"
              maxLength={2000}
              style={{
                backgroundColor: "var(--bg-page)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-inter)",
              }}
              className="min-w-0 flex-1 border px-3 py-2 text-sm outline-none
                         focus:border-[var(--accent-green)]"
            />
            <button
              type="submit"
              disabled={busy || input.trim() === ""}
              aria-label="Send"
              style={{ backgroundColor: "var(--accent-green)", color: "var(--bg-page)" }}
              className="shrink-0 px-3 py-2 text-sm font-semibold
                         transition-opacity duration-150 disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </section>
      )}
    </>
  );
}
