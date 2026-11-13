import { test } from "node:test";
import assert from "node:assert/strict";
import { parseYouTubeId } from "../src/lib/admin/youtube.ts";
import { isValidPhone, validateContact, sanitizeContact } from "../src/lib/contact-validate.ts";

test("parseYouTubeId", () => {
  const id = "dQw4w9WgXcQ";
  assert.equal(parseYouTubeId(id), id);
  assert.equal(parseYouTubeId(`https://www.youtube.com/watch?v=${id}&t=5`), id);
  assert.equal(parseYouTubeId(`https://youtu.be/${id}`), id);
  assert.equal(parseYouTubeId(`youtube.com/shorts/${id}`), id);
  assert.equal(parseYouTubeId(`https://www.youtube.com/embed/${id}`), id);
  assert.equal(parseYouTubeId("https://evil.com/watch?v=" + id), null);
  assert.equal(parseYouTubeId("not a link"), null);
  assert.equal(parseYouTubeId(""), null);
});

test("isValidPhone", () => {
  assert.ok(isValidPhone("98765 43210"));
  assert.ok(isValidPhone("+91 98765-43210"));
  assert.ok(!isValidPhone("12345"));
  assert.ok(!isValidPhone("abcdefghij"));
  assert.ok(!isValidPhone("1".repeat(16)));
});

const good = { name: "Asha", email: "asha@example.com", message: "Hello there", phone: "9876543210", consent: true, ageDeclaration: "adult" } as const;

test("validateContact", () => {
  assert.equal(validateContact({ ...good }), null);
  assert.ok(validateContact({ ...good, name: "" }));
  assert.ok(validateContact({ ...good, email: "nope" }));
  assert.ok(validateContact({ ...good, message: "x".repeat(3001) }));
  assert.ok(validateContact({ ...good, phone: "12" }));
  assert.ok(validateContact({ ...good, consent: false } as never));
  assert.ok(validateContact({ ...good, ageDeclaration: "child" } as never));
});

test("sanitizeContact trims and drops empty optionals", () => {
  const clean = sanitizeContact({ ...good, name: "  Asha ", city: "  ", budget: " 10L " } as never);
  assert.equal(clean.name, "Asha");
  assert.equal(clean.budget, "10L");
  assert.ok(!("city" in clean));
  assert.equal(clean.consent, true);
});
