"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Arrow } from "@/components/Arrow";

const PHOTO_MOUNTAIN =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85";

function Field({
  label,
  name,
  type = "text",
  required,
  area,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  area?: boolean;
  autoComplete?: string;
}) {
  const shared = {
    id: name,
    name,
    required,
    autoComplete,
    style: {
      backgroundColor: "var(--bg-page)",
      borderColor: "var(--text-on-invert-faint)",
      color: "var(--text-primary)",
      fontFamily: "var(--font-inter)",
    },
    className:
      "w-full border px-4 py-3 text-base outline-none transition-colors duration-150 " +
      "placeholder:text-[var(--text-muted)] focus:border-[var(--accent-terracotta)]",
  };
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        style={{ color: "var(--text-on-invert-muted)", fontFamily: "var(--font-inter)" }}
        className="text-[0.8125rem] tracking-[0.12em] uppercase"
      >
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {area ? (
        <textarea {...shared} rows={4} placeholder="A new system, support for one you already run, a partnership…" />
      ) : (
        <input {...shared} type={type} placeholder={label} />
      )}
    </div>
  );
}

export function StartProject() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error ?? "Something went wrong. Email hello@layrus.com instead.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setError("Could not send that. Email hello@layrus.com instead.");
      setStatus("error");
    }
  }

  return (
    <section
      aria-labelledby="start-heading"
      style={{ backgroundColor: "var(--bg-invert-deep)" }}
      className="relative"
    >
      {/* Landscape photo, faded into the green on the right */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-1/2" aria-hidden="true">
        <Image
          src={PHOTO_MOUNTAIN}
          alt=""
          fill
          className="object-cover opacity-25"
          sizes="(max-width:1024px) 100vw, 50vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--bg-invert-deep) 0%, rgba(8,46,30,0.85) 45%, rgba(8,46,30,0.55) 100%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20">

          <div className="flex flex-col gap-5">
            <p
              style={{ color: "var(--accent-terracotta)", fontFamily: "var(--font-inter)" }}
              className="text-[0.8125rem] font-semibold tracking-[0.14em] uppercase"
            >
              // Talk to Layrus
            </p>
            <h2
              id="start-heading"
              style={{ color: "var(--text-on-invert)", fontFamily: "var(--font-playfair)" }}
              className="text-[2.75rem] md:text-[3.5rem] font-bold"
            >
              Tell us what you need
            </h2>
            <p
              style={{ color: "var(--text-on-invert-muted)", fontFamily: "var(--font-inter)" }}
              className="text-base leading-relaxed max-w-sm"
            >
              A new build, a system that needs support, a partnership,
              procurement, or a question about how we work. We&rsquo;ll get back
              to you with the right person and clear next steps.
            </p>

            <dl className="flex flex-col gap-4 mt-4">
              <ContactRow label="Email" value="hello@layrus.com" href="mailto:hello@layrus.com" />
              <ContactRow label="Office" value="Abuja, Nigeria" />
              <ContactRow label="Response time" value="Within 24 hours" />
            </dl>
          </div>

          <form
            className="flex flex-col gap-5"
            aria-label="Enquiry"
            onSubmit={onSubmit}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Your name" name="name" required autoComplete="name" />
              <Field label="Email address" name="email" type="email" required autoComplete="email" />
            </div>
            <Field label="Subject" name="subject" />
            <Field label="How can we help?" name="message" area required />

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary btn-invert disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send enquiry"}
                <Arrow />
              </button>
              <a href="/services" className="btn-outline btn-outline-invert">
                Explore our services
                <Arrow />
              </a>
            </div>
            {status === "sent" && (
              <p
                style={{ color: "var(--text-on-invert)", fontFamily: "var(--font-inter)" }}
                className="text-sm"
              >
                Thank you. We have it, and we reply within 24 hours.
              </p>
            )}
            {status === "error" && (
              <p
                role="alert"
                style={{ color: "var(--warm-terracotta)", fontFamily: "var(--font-inter)" }}
                className="text-sm"
              >
                {error}
              </p>
            )}
          </form>

        </div>
      </div>
    </section>
  );
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <>
      <span
        style={{ color: "var(--text-on-invert-faint)", fontFamily: "var(--font-inter)" }}
        className="text-[0.75rem] tracking-[0.14em] uppercase"
      >
        {label}
      </span>
      <span
        style={{ color: "var(--text-on-invert)", fontFamily: "var(--font-inter)" }}
        className="text-base"
      >
        {value}
      </span>
    </>
  );
  return (
    <div className="flex flex-col gap-0.5">
      {href ? (
        <a href={href} className="flex flex-col gap-0.5 transition-opacity hover:opacity-80">
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  );
}
