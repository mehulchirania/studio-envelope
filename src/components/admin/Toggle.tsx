"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
}

/** Labeled switch used in place of raw checkboxes throughout the admin panel. */
export default function Toggle({ checked, onChange, label, hint, disabled }: ToggleProps) {
  return (
    <label
      className={`flex items-center justify-between gap-4 rounded-xl border border-hairline bg-ink/[0.05] px-4 py-3.5 transition-colors ${
        disabled ? "opacity-50" : "cursor-pointer hover:border-ink/50"
      }`}
    >
      <span>
        <span className="block text-sm text-ink">{label}</span>
        {hint && <span className="block text-xs text-muted mt-0.5">{hint}</span>}
      </span>
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={`h-6 w-11 rounded-full transition-colors ${
            checked ? "bg-night" : "bg-ink/20"
          } peer-focus-visible:ring-2 peer-focus-visible:ring-teal peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bone`}
        />
        <span
          className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-bone transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </label>
  );
}
