"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LoaderCircle, CircleCheckBig, CircleAlert } from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";
import { submitContact } from "@/lib/contact";
import type { ContactMessage } from "@/lib/types";

/** Wraps an input/select/textarea with an animated marigold underline that
 * grows in on focus (via :focus-within, so it works with any field type
 * without per-field JS state). */
function Field({ children }: { children: ReactNode }) {
  return (
    <div className="group relative">
      {children}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-marigold transition-transform duration-300 ease-out group-focus-within:scale-x-100" />
    </div>
  );
}

const PROJECT_TYPES = ["Interior", "Architecture & Interior", "Renovation", "Not sure yet"];

const BUDGETS = ["Under ₹20L", "₹20L – ₹50L", "₹50L – ₹1Cr", "Above ₹1Cr", "Prefer not to say"];

const TIMELINES = ["Within 3 months", "3–6 months", "6–12 months", "Just exploring"];

const SOURCES = ["Instagram", "Referral", "Google", "Other"];

type Status = "idle" | "submitting" | "success" | "error";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const inputClasses =
  "w-full border-0 border-b border-hairline bg-transparent py-3 text-ink placeholder:text-muted/70 focus-visible:outline-none focus:border-teal transition-colors";

const errorTextClass = "mt-2 text-sm text-[#9B2C1F]";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const reduced = useReducedMotion();

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
    if (status === "submitting") return;
    const form = new FormData(e.currentTarget);
    const data: ContactMessage = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim() || undefined,
      projectType: String(form.get("projectType") ?? "") || undefined,
      city: String(form.get("city") ?? "").trim() || undefined,
      area: String(form.get("area") ?? "").trim() || undefined,
      budget: String(form.get("budget") ?? "") || undefined,
      timeline: String(form.get("timeline") ?? "") || undefined,
      hearAbout: String(form.get("hearAbout") ?? "") || undefined,
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
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-start gap-4 border border-hairline bg-paper-2 p-8"
      >
        <motion.span
          initial={reduced ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <CircleCheckBig className="text-teal" size={32} />
        </motion.span>
        <div>
          <p className="font-display text-2xl text-ink">Message sent</p>
          <p className="mt-2 text-base text-muted">
            Thank you for reaching out. We&apos;ll reply within a couple of working days.
          </p>
        </div>
        <button type="button" onClick={() => setStatus("idle")} className="label mt-2 text-teal hover:text-teal-deep">
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label mb-2 block">
            Name*
          </label>
          <Field>
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
          </Field>
          {errors.name && (
            <p id="name-error" className={errorTextClass}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="label mb-2 block">
            Email*
          </label>
          <Field>
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
          </Field>
          {errors.email && (
            <p id="email-error" className={errorTextClass}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="label mb-2 block">
            Phone
          </label>
          <Field>
            <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClasses} />
          </Field>
        </div>

        <div>
          <label htmlFor="projectType" className="label mb-2 block">
            Project type
          </label>
          <Field>
            <select id="projectType" name="projectType" defaultValue="" className={inputClasses}>
              <option value="" disabled>
                Select one
              </option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div>
          <label htmlFor="city" className="label mb-2 block">
            City
          </label>
          <Field>
            <input id="city" name="city" type="text" autoComplete="address-level2" className={inputClasses} />
          </Field>
        </div>

        <div>
          <label htmlFor="area" className="label mb-2 block">
            Area (approx. sq ft)
          </label>
          <Field>
            <input id="area" name="area" type="text" inputMode="numeric" className={inputClasses} />
          </Field>
        </div>

        <div>
          <label htmlFor="budget" className="label mb-2 block">
            Estimated budget
          </label>
          <Field>
            <select id="budget" name="budget" defaultValue="" className={inputClasses}>
              <option value="" disabled>
                Select a range
              </option>
              {BUDGETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div>
          <label htmlFor="timeline" className="label mb-2 block">
            Timeline
          </label>
          <Field>
            <select id="timeline" name="timeline" defaultValue="" className={inputClasses}>
              <option value="" disabled>
                Select one
              </option>
              {TIMELINES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="hearAbout" className="label mb-2 block">
            How did you hear about us?
          </label>
          <Field>
            <select id="hearAbout" name="hearAbout" defaultValue="" className={inputClasses}>
              <option value="" disabled>
                Select one
              </option>
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="label mb-2 block">
          Tell us about your project*
        </label>
        <Field>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className={`${inputClasses} resize-none`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
        </Field>
        {errors.message && (
          <p id="message-error" className={errorTextClass}>
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p className="flex items-center gap-2 text-base text-[#9B2C1F]" role="alert">
          <CircleAlert size={16} /> {errorMessage}
        </p>
      )}

      <MagneticButton
        strength={10}
        className={`!w-fit !flex-row gap-3 !rounded-none !bg-teal px-8 py-3.5 text-sm uppercase tracking-[0.16em] !text-bone hover:!bg-teal-deep ${
          status === "submitting" ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {status === "submitting" ? (
          <>
            <LoaderCircle size={16} className="animate-spin" /> Sending
          </>
        ) : (
          "Send message"
        )}
      </MagneticButton>
    </form>
  );
}
