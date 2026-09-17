"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle, CircleCheckBig, CircleAlert } from "lucide-react";
import { submitContact } from "@/lib/contact";
import type { ContactMessage } from "@/lib/types";

const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Hospitality",
  "Art & Installation",
  "Not sure yet",
];

const BUDGETS = ["Under ₹20L", "₹20L – ₹50L", "₹50L – ₹1Cr", "Above ₹1Cr", "Prefer not to say"];

type Status = "idle" | "submitting" | "success" | "error";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const inputClasses =
  "w-full border-b border-hairline bg-transparent py-3 text-fg placeholder:text-muted/70 focus:border-brass focus:outline-none transition-colors";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [errorMessage, setErrorMessage] = useState("");

  function validate(data: ContactMessage): Errors {
    const next: Errors = {};
    if (!data.name.trim()) next.name = "Please share your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!data.message.trim() || data.message.trim().length < 10) {
      next.message = "Tell us a little more about your project (10+ characters).";
    }
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data: ContactMessage = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim() || undefined,
      projectType: String(form.get("projectType") ?? "") || undefined,
      budget: String(form.get("budget") ?? "") || undefined,
      message: String(form.get("message") ?? "").trim(),
    };

    const validationErrors = validate(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      const result = await submitContact(data);
      if (result.ok) {
        setStatus("success");
        e.currentTarget.reset();
      } else {
        setStatus("error");
        setErrorMessage(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-4 border border-hairline p-8">
        <CircleCheckBig className="text-brass" size={32} />
        <div>
          <p className="font-display text-2xl text-fg">Message sent</p>
          <p className="mt-2 text-sm text-muted">
            Thank you for reaching out. We&apos;ll be in touch within 1–2 business days.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="eyebrow mt-2 text-brass hover:text-fg"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow mb-2 block">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={inputClasses}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-xs text-brass">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="eyebrow mb-2 block">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClasses}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-xs text-brass">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="eyebrow mb-2 block">
            Phone (optional)
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClasses} />
        </div>

        <div>
          <label htmlFor="projectType" className="eyebrow mb-2 block">
            Project type
          </label>
          <select id="projectType" name="projectType" defaultValue="" className={inputClasses}>
            <option value="" disabled>
              Select one
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t} className="bg-surface">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="budget" className="eyebrow mb-2 block">
            Estimated budget
          </label>
          <select id="budget" name="budget" defaultValue="" className={inputClasses}>
            <option value="" disabled>
              Select a range
            </option>
            {BUDGETS.map((b) => (
              <option key={b} value={b} className="bg-surface">
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="eyebrow mb-2 block">
          Tell us about your project
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={`${inputClasses} resize-none`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-xs text-brass">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p className="flex items-center gap-2 text-sm text-brass" role="alert">
          <CircleAlert size={16} /> {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex items-center gap-3 border border-fg px-8 py-3.5 text-sm uppercase tracking-[0.18em] text-fg transition-colors hover:bg-fg hover:text-ink disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <LoaderCircle size={16} className="animate-spin" /> Sending
          </>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}
