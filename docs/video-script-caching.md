# Script — Caching, the first thing that lies to you

**Series:** System Design, episode one of an open pool
**Format:** UI / motion-graphics explainer, character presenter, highlighted captions
**Length:** 60 seconds
**Output:** 1080 × 1920, 30 fps, H.264 + AAC
**Companion post:** LinkedIn, at the end of this file

---

## The four beats

| Time | Beat | What the viewer sees |
|---|---|---|
| 0–3s | The assumption | A product list loading, and a counter that keeps going up |
| 3–15s | The naive solution | The same query hitting the database, over and over |
| 15–32s | The fix | A cache appears in front, the first request misses, the next ones hit |
| 32–50s | Where it breaks | A price changes, the cache does not know, the page is wrong |
| 50–60s | The rule and the name | Expiry and invalidation; then the word "caching" |

---

## Script

### 0–3s — The assumption

**Visual:** Phone frame centred. A product list renders. Behind it, a database
cylinder pulses once per request. A small counter in the corner ticks: 1, 2, 3.

**Voiceover:**
> A user opens your app. The same list of products loads. Then the next user
> opens it, and it loads again.

**On-screen text:** none. Let the counter do the work.

---

### 3–15s — The naive solution

**Visual:** Cut wide. The phone stays; five more phones fade in around it, all
making the same request. Arrows converge on the database. The counter accelerates
past 40. The database cylinder starts to shake; a response-time number climbs.

**Voiceover:**
> For a thousand users, that is a thousand identical questions. And the answer
> has not changed. Nothing was written. Nothing moved. We are paying full price
> for the same answer, over and over.

**On-screen labels:**
- `1,000 requests`
- `1 answer, computed 1,000 times`

---

### 15–32s — The fix

**Visual:** A box slides in between the phones and the database, labelled
`CACHE`. The next request stops at the cache, turns around, and returns. A miss
path runs once to the database and stores the result. The request counter keeps
climbing; the database counter stops at 1.

**Voiceover:**
> So we keep a copy. The first request still goes to the database, and the
> answer is written down on the way back. Every request after that is answered
> from the copy.

**On-screen labels:**
- `MISS → database` (first request)
- `HIT → memory` (the rest)
- `DB queries: 1`

---

### 32–50s — Where it breaks

**Visual:** A back-office screen changes a price: 12,000 → 15,000. The database
updates. The cache still holds 12,000. The phone renders the old price. A
notification slides in: *"Customer: the price at checkout is different."*

**Voiceover:**
> Then someone changes a price. The database knows. The cache does not. The user
> sees the old number, and finds out at checkout. A cache does not remove the
> problem. It moves the problem to the question of how long a copy is allowed to
> be wrong.

**On-screen labels:**
- `DB: 15,000`
- `CACHE: 12,000`
- `STALE`

---

### 50–60s — The rule and the name

**Visual:** Two dials appear beside the cache. The first is labelled
`EXPIRY (TTL)`; the second `INVALIDATION`. The price in the cache updates, and
the phone shows the correct number.

**Voiceover:**
> So every cache decision is really two decisions: how long a copy lives, and
> what makes it wrong. Get those right, and the cache is the cheapest speed-up
> you have.

**Final on-screen text:**

> **Caching**
> A copy with an expiry — and the first thing that lies to you.

---

## Caption cards

These are the words the audience reads, in order. One idea per card, the key
term highlighted in the same accent each time.

1. `A user opens your app.`
2. `The same list loads again.`
3. `1,000 users. 1,000 identical questions.`
4. `Nothing changed. We pay anyway.`
5. `Keep a copy.`
6. `First request: **miss**.`
7. `Every request after: **hit**.`
8. `The database answered **once**.`
9. `Then a price changes.`
10. `The cache **does not know**.`
11. `That is **stale**.`
12. `A cache is a copy allowed to be wrong.`
13. `For how long? What invalidates it?`
14. `**Caching.** The cheapest speed-up.`

---

## Diagram specification

Three elements, built once and reused across the series:

- **Phone frame** — 9:16, rounded, thin outline.
- **Database cylinder** — flat, two tone, with a request counter that can be
  pinned to `1` or allowed to climb.
- **Cache box** — same weight as the database, distinct fill, label in the
  caption type.

Arrows are 2px, animated along their length rather than fading in — travel
carries direction, which is the part the viewer is learning. Nothing else
moves. The counter and one arrow at a time are the only animation in beats 1
and 2.

---

## Accuracy traps

Three ways this script can teach the wrong thing:

- **Do not imply a cache is always faster to write than to compute.** The
  honest claim is that a read from memory beats a database round trip, not that
  caching is free — it costs memory, and an invalidation bug costs more than it
  saves.
- **Do not present invalidation as solved.** Say "what makes it wrong" and leave
  it there. Claiming a clean solution is how people end up with the stale price
  in beat four.
- **Do not imply the database answers only once, ever.** The VO says "the
  database answered once" while the cache is warm; it answers again after the
  TTL expires, which is what the expiry dial in the last beat exists to show.

---

## Companion LinkedIn post

> Your app loads the same list of products a thousand times a day. Nothing in
> that list changed. Nothing was written, nothing moved, and you paid for the
> same answer a thousand times.
>
> A cache fixes that in one move: keep a copy, answer from it, and let the
> database answer once.
>
> Then the price changes, and the cache does not know. Now one customer sees
> 12,000 and the checkout says 15,000. The cache did not remove your problem. It
> moved it to a sharper question: how long is a copy allowed to be wrong?
>
> Every cache is two decisions, not one — the expiry, and what invalidates it.
> Miss either and the cache becomes the bug.
>
> What is the shortest expiry you have ever shipped? I am asking because the
> right answer depends entirely on how much staleness your business can survive.
>
> *(60-second walkthrough in the video.)*

**First line is the takeaway**, as the checklist requires. The question at the
end invites a real answer rather than "thoughts?".
