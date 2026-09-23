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
      className={`flex items-center justify-between gap-4 rounded-xl border border-[#EDE8E0]/10 bg-[#EDE8E0]/[0.03] px-4 py-3.5 transition-colors ${
        disabled ? "opacity-50" : "cursor-pointer hover:border-[#EDE8E0]/20"
      }`}
    >
      <span>
        <span className="block text-sm text-[#EDE8E0]">{label}</span>
        {hint && <span className="block text-xs text-[#EDE8E0]/45 mt-0.5">{hint}</span>}
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
            checked ? "bg-[#5E9AA3]" : "bg-[#EDE8E0]/15"
          } peer-focus-visible:ring-2 peer-focus-visible:ring-[#5E9AA3]/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0B0C0C]`}
        />
        <span
          className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-[#0B0C0C] transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </label>
  );
}
