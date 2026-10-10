"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { LoaderCircle, CircleCheckBig, CircleAlert } from "lucide-react";
import Button from "@/components/ui/Button";
import { submitContact } from "@/lib/firebase/contact";
import type { ContactMessage } from "@/lib/content/types";

const PROJECT_TYPES = ["Interior", "Architecture & Interior", "Renovation", "Not sure yet"];
const BUDGETS = ["Under ₹20L", "₹20L – ₹50L", "₹50L – ₹1Cr", "Above ₹1Cr", "Prefer not to say"];
const TIMELINES = ["Within 3 months", "3–6 months", "6–12 months", "Just exploring"];
const SOURCES = ["Instagram", "Referral", "Google", "Other"];

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const inputClasses =
  "min-h-12 w-full rounded-none border-0 border-b border-hairline bg-transparent py-3 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-teal focus-visible:outline-none";
const errorTextClass = "mt-2 text-sm text-[#9B2C1F]";

/** Label + control with an underline that grows in on focus (via :focus-within). */
function Field({ id, label, className, error, children }: { id: string; label: string; className?: string; error?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label mb-1 block">
        {label}
      </label>
      <div className="group relative">
        {children}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-marigold transition-transform duration-300 group-focus-within:scale-x-100" />
      </div>
      {error && (
        <p id={`${id}-error`} className={errorTextClass}>
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({ id, label, placeholder, options, className }: { id: string; label: string; placeholder: string; options: string[]; className?: string }) {
  return (
    <Field id={id} label={label} className={className}>
      <select id={id} name={id} defaultValue="" className={inputClasses}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function validate(data: ContactMessage): Errors {
  const next: Errors = {};
  if (!data.name.trim()) next.name = "Please share your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = "Enter a valid email address.";
  if (data.message.trim().length < 10) next.message = "Tell us a little more about your project (10+ characters).";
  return next;
}

/** Enquiry form. Name, email and message are required; the rest help the
 * studio prepare a first reply. Submits through `submitContact`. */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const text = (key: string) => String(form.get(key) ?? "").trim() || undefined;
    const data: ContactMessage = {
      name: text("name") ?? "",
      email: text("email") ?? "",
      phone: text("phone"),
      projectType: text("projectType"),
      city: text("city"),
      area: text("area"),
      budget: text("budget"),
      timeline: text("timeline"),
      hearAbout: text("hearAbout"),
      message: text("message") ?? "",
    };

    const validationErrors = validate(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      const result = await submitContact(data);
      if (result.ok) {
        setStatus("success");
        formEl.reset();
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
      <div className="flex flex-col items-start gap-4 border border-hairline bg-paper-2 p-6 sm:p-8" role="status">
        <CircleCheckBig className="text-teal" size={32} aria-hidden="true" />
        <div>
          <p className="font-display text-2xl text-ink">Message sent</p>
          <p className="mt-2 text-base text-muted">Thank you for reaching out. We&apos;ll reply within a couple of working days.</p>
        </div>
        <button type="button" onClick={() => setStatus("idle")} className="label min-h-11 text-teal hover:text-teal-deep">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <Field id="name" label="Name*" error={errors.name}>
          <input id="name" name="name" type="text" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} className={inputClasses} />
        </Field>
        <Field id="email" label="Email*" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className={inputClasses} />
        </Field>
        <Field id="phone" label="Phone">
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClasses} />
        </Field>
        <SelectField id="projectType" label="Project type" placeholder="Select one" options={PROJECT_TYPES} />
        <Field id="city" label="City">
          <input id="city" name="city" type="text" autoComplete="address-level2" className={inputClasses} />
        </Field>
        <Field id="area" label="Area (approx. sq ft)">
          <input id="area" name="area" type="text" inputMode="numeric" className={inputClasses} />
        </Field>
        <SelectField id="budget" label="Estimated budget" placeholder="Select a range" options={BUDGETS} />
        <SelectField id="timeline" label="Timeline" placeholder="Select one" options={TIMELINES} />
        <SelectField id="hearAbout" label="How did you hear about us?" placeholder="Select one" options={SOURCES} className="sm:col-span-2" />
      </div>

      <Field id="message" label="Tell us about your project*" error={errors.message}>
        <textarea id="message" name="message" rows={5} required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} className={`${inputClasses} resize-none`} />
      </Field>

      {status === "error" && (
        <p className="flex items-center gap-2 text-base text-[#9B2C1F]" role="alert">
          <CircleAlert size={16} aria-hidden="true" /> {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? (
          <>
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> Sending
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  );
}
