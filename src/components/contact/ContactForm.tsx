"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LoaderCircle, CircleCheckBig, CircleAlert, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { submitContact } from "@/lib/firebase/contact";
import type { ContactMessage } from "@/lib/content/types";
import { fieldError, type ContactField } from "@/lib/contact-validate";

type Intent = "new" | "redo" | "commercial" | "question";
type StepId = "intent" | "detail" | "scope" | "timeline" | "city" | "contact";
type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<"name" | "phone" | "email" | "message", string>>;

interface Choice {
  value: string;
  label: string;
}

const INTENTS: (Choice & { value: Intent })[] = [
  { value: "new", label: "I'm planning a new home or apartment" },
  { value: "redo", label: "I want to redo a space I already own" },
  { value: "commercial", label: "I have a commercial space" },
  { value: "question", label: "I just have a question" },
];

/** The second question depends on the first answer. */
const DETAIL: Record<Exclude<Intent, "question">, { question: string; summaryLabel: string; options: string[] }> = {
  new: {
    question: "Where are you in the process?",
    summaryLabel: "Stage",
    options: ["Still on plans", "Keys in hand, space is empty", "Under construction"],
  },
  redo: {
    question: "How much are you changing?",
    summaryLabel: "Scope of change",
    options: ["A full makeover", "A few rooms", "A refresh (furnishing and décor)"],
  },
  commercial: {
    question: "What kind of space is it?",
    summaryLabel: "Space type",
    options: ["Office", "Retail or showroom", "Café, restaurant or hospitality", "Something else"],
  },
};

const PROJECT_TYPE: Record<Intent, string> = {
  new: "New home",
  redo: "Redo existing space",
  commercial: "Commercial",
  question: "Question",
};

const SCOPES = ["Architecture and interiors together", "Interior design only", "Furnishing and styling only", "Not sure yet, I'd like advice"];
const TIMELINES = ["Within 3 months", "3 to 6 months", "6 to 12 months", "Just exploring"];
const CITIES = ["Bangalore", "Other"];
const SOURCES = ["Instagram", "Referral", "Google", "Other"];

const PATHS: Record<Intent, StepId[]> = {
  new: ["intent", "detail", "scope", "timeline", "city", "contact"],
  redo: ["intent", "detail", "scope", "timeline", "city", "contact"],
  commercial: ["intent", "detail", "scope", "timeline", "city", "contact"],
  question: ["intent", "contact"],
};

const inputClasses =
  "min-h-12 w-full rounded-xl border border-hairline bg-white/60 px-4 py-3 text-base text-ink placeholder:text-muted/70 transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15 focus-visible:outline-none";
const errorTextClass = "mt-2 text-sm text-[#9B2C1F]";
const pillClasses =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-8 text-base font-medium text-white transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60";

interface Answers {
  intent?: Intent;
  detail?: string;
  scope?: string;
  timeline?: string;
  city?: string;
}

/** Choices as an iOS-style grouped list: picking a row moves to the next question. */
function Options({ label, options, selected, onPick }: { label: string; options: readonly string[]; selected?: string; onPick: (value: string) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-white/60">
      {options.map((option) => {
        const active = selected === option;
        return (
          <button key={option} type="button" role="radio" aria-checked={active} onClick={() => onPick(option)} className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left text-[17px] leading-snug text-ink transition-colors hover:bg-white focus-visible:bg-white focus-visible:outline-none">
            <span>{option}</span>
            {active ? <Check size={18} className="shrink-0 text-brand" aria-hidden="true" /> : <ChevronRight size={18} className="shrink-0 text-muted/50" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}

/** Enquiry as a short guided conversation. A few taps (project, scope, timing,
 * city), then name, phone and email. Answers are folded into the existing
 * ContactMessage shape (projectType, timeline, city, message), so the inbox,
 * the email and the Firestore rules are unchanged. */
export default function ContactForm() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState<StepId>("intent");
  const [directMessage, setDirectMessage] = useState(false);
  const [otherCity, setOtherCity] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Move focus to the new question so keyboard and screen reader users follow along.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, status]);

  const path = directMessage ? (["contact"] as StepId[]) : PATHS[answers.intent ?? "new"];
  const stepIndex = Math.max(path.indexOf(step), 0);
  const stepCount = path.length;

  function goTo(next: StepId) {
    setErrors({});
    setStep(next);
  }

  function advance(nextAnswers: Answers) {
    const p = PATHS[nextAnswers.intent ?? "new"];
    goTo(p[p.indexOf(step) + 1] ?? "contact");
  }

  function pick(key: keyof Answers, value: string) {
    const next = { ...answers, [key]: value } as Answers;
    // Changing the first answer invalidates the follow-ups.
    if (key === "intent") {
      next.detail = undefined;
      if (value === "question") {
        next.scope = next.timeline = next.city = undefined;
      }
    }
    setAnswers(next);
    advance(next);
  }

  function back() {
    if (directMessage) {
      setDirectMessage(false);
      goTo("intent");
      return;
    }
    const prev = path[path.indexOf(step) - 1];
    if (prev) goTo(prev);
  }

  function writeDirectly() {
    setDirectMessage(true);
    setAnswers({ intent: "question" });
    goTo("contact");
  }

  /** Validate a field as the user leaves it; once it shows an error, re-check on every keystroke. */
  function checkField(target: EventTarget, live: boolean) {
    const el = target as HTMLInputElement;
    const field = el.name as ContactField;
    if (!["name", "phone", "email", "message"].includes(field)) return;
    if (live && !errors[field]) return;
    const err = fieldError(field, el.value, { messageRequired: answers.intent === "question" });
    setErrors((prev) => ({ ...prev, [field]: err }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const form = new FormData(e.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "").trim();
    const name = text("name");
    const phone = text("phone");
    const email = text("email");
    const note = text("message");
    const hearAbout = text("hearAbout");
    const isQuestion = answers.intent === "question";

    const next: Errors = {};
    (["name", "phone", "email", "message"] as const).forEach((field) => {
      const err = fieldError(field, { name, phone, email, message: note }[field], { messageRequired: isQuestion });
      if (err) next[field] = err;
    });
    setErrors(next);
    const firstInvalid = (["message", "name", "phone", "email"] as const).find((f) => next[f]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    const intent = answers.intent ?? "question";
    const city = answers.city === "Other" ? otherCity.trim() || "Other" : answers.city;
    const summary: string[] = [];
    if (intent !== "question") {
      const detail = DETAIL[intent];
      summary.push(`Project: ${PROJECT_TYPE[intent]}`);
      if (answers.detail) summary.push(`${detail.summaryLabel}: ${answers.detail}`);
      if (answers.scope) summary.push(`Looking for: ${answers.scope}`);
      if (answers.timeline) summary.push(`Timeline: ${answers.timeline}`);
      if (city) summary.push(`City: ${city}`);
    }
    if (note) summary.push(intent === "question" ? note : `Note: ${note}`);

    const data: ContactMessage = {
      name,
      email,
      phone,
      projectType: PROJECT_TYPE[intent],
      city,
      timeline: answers.timeline,
      hearAbout: hearAbout || undefined,
      message: summary.join("\n") || "Enquiry from the website.",
    };

    setStatus("submitting");
    try {
      const result = await submitContact(data);
      if (result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  function restart() {
    setAnswers({});
    setOtherCity("");
    setDirectMessage(false);
    setErrors({});
    setStatus("idle");
    setStep("intent");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-hairline bg-white/70 p-8 sm:p-10" role="status">
        <CircleCheckBig className="text-brand" size={32} aria-hidden="true" />
        <div>
          <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-medium tracking-tight text-ink focus:outline-none">
            Thank you, we have your message
          </h3>
          <p className="mt-2 text-base text-muted">We&apos;ll be in touch within a couple of working days.</p>
        </div>
        <button type="button" onClick={restart} className="min-h-11 text-sm font-medium text-brand hover:text-brand-deep">
          Send another message
        </button>
      </div>
    );
  }

  const intent = answers.intent;
  let question = "";
  let body: React.ReactNode = null;

  if (step === "intent") {
    question = "Hello, we're glad you're here. What brings you to Studio Envelope?";
    body = <Options label={question} options={INTENTS.map((i) => i.label)} selected={INTENTS.find((i) => i.value === intent)?.label} onPick={(label) => pick("intent", INTENTS.find((i) => i.label === label)!.value)} />;
  } else if (step === "detail" && intent && intent !== "question") {
    question = DETAIL[intent].question;
    body = <Options label={question} options={DETAIL[intent].options} selected={answers.detail} onPick={(v) => pick("detail", v)} />;
  } else if (step === "scope") {
    question = "What would you like from us?";
    body = <Options label={question} options={SCOPES} selected={answers.scope} onPick={(v) => pick("scope", v)} />;
  } else if (step === "timeline") {
    question = "Roughly when are you hoping to start?";
    body = <Options label={question} options={TIMELINES} selected={answers.timeline} onPick={(v) => pick("timeline", v)} />;
  } else if (step === "city") {
    question = "Where is the project?";
    body = (
      <div className="space-y-5">
        <Options
          label={question}
          options={CITIES}
          selected={answers.city}
          onPick={(v) => {
            if (v === "Other") {
              setAnswers({ ...answers, city: v });
            } else {
              pick("city", v);
            }
          }}
        />
        {answers.city === "Other" && (
          <div className="space-y-5">
            <div>
              <label htmlFor="otherCity" className="mb-1.5 block text-sm text-muted">
                Which city? (optional)
              </label>
              <input id="otherCity" type="text" autoComplete="address-level2" value={otherCity} onChange={(e) => setOtherCity(e.target.value)} className={inputClasses} />
            </div>
            <button type="button" onClick={() => advance(answers)} className={pillClasses}>
              Continue
            </button>
          </div>
        )}
      </div>
    );
  } else {
    const isQuestion = intent === "question";
    question = isQuestion ? "What would you like to ask?" : "Lovely. How can we reach you?";
    body = (
      <form onSubmit={handleSubmit} onBlur={(e) => checkField(e.target, false)} onChange={(e) => checkField(e.target, true)} noValidate className="space-y-6">
        {isQuestion && (
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm text-muted">
              Your question*
            </label>
            <textarea id="message" name="message" rows={4} maxLength={2000} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} className={`${inputClasses} resize-none`} />
            {errors.message && (
              <p id="message-error" className={errorTextClass}>
                {errors.message}
              </p>
            )}
          </div>
        )}
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
              Name*
            </label>
            <input id="name" name="name" type="text" autoComplete="name" maxLength={100} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} className={inputClasses} />
            {errors.name && (
              <p id="name-error" className={errorTextClass}>
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm text-muted">
              Phone*
            </label>
            <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} className={inputClasses} />
            {errors.phone && (
              <p id="phone-error" className={errorTextClass}>
                {errors.phone}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
              Email*
            </label>
            <input id="email" name="email" type="email" autoComplete="email" maxLength={200} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className={inputClasses} />
            {errors.email && (
              <p id="email-error" className={errorTextClass}>
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {!isQuestion && (
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm text-muted">
              Anything else we should know? (optional)
            </label>
            <textarea id="message" name="message" rows={3} maxLength={2000} className={`${inputClasses} resize-none`} />
          </div>
        )}

        <div>
          <label htmlFor="hearAbout" className="mb-1.5 block text-sm text-muted">
            How did you hear about us? (optional)
          </label>
          <select id="hearAbout" name="hearAbout" defaultValue="" className={inputClasses}>
            <option value="">Select one</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {status === "error" && (
          <p className="flex items-center gap-2 text-base text-[#9B2C1F]" role="alert">
            <CircleAlert size={16} aria-hidden="true" /> {errorMessage}
          </p>
        )}

        <button type="submit" disabled={status === "submitting"} className={`${pillClasses} w-full sm:w-auto`}>
          {status === "submitting" ? (
            <>
              <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> Sending
            </>
          ) : (
            "Send"
          )}
        </button>
      </form>
    );
  }

  return (
    <div>
      <div className="mb-8 flex h-10 items-center gap-4">
        {stepIndex > 0 || directMessage ? (
          <button type="button" onClick={back} aria-label="Back" className="grid size-10 shrink-0 place-items-center rounded-full bg-white/70 text-ink transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-brand">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
        ) : null}
        {!directMessage && (
          <div className="flex flex-1 gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={stepCount} aria-valuenow={stepIndex + 1} aria-label={`Step ${stepIndex + 1} of ${stepCount}`}>
            {path.map((id, i) => (
              <span key={id} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= stepIndex ? "bg-brand" : "bg-ink/10"}`} />
            ))}
          </div>
        )}
      </div>

      <div key={step} className="step-in">
        <h3 ref={headingRef} tabIndex={-1} className="mb-8 text-3xl font-medium leading-tight tracking-tight text-ink focus:outline-none sm:text-4xl">
          {question}
        </h3>
        {body}
      </div>

      {step === "intent" && (
        <button type="button" onClick={writeDirectly} className="mt-8 min-h-11 text-[15px] text-brand hover:text-brand-deep">
          Prefer to write? Send a message directly
        </button>
      )}
    </div>
  );
}
