import { describe, it, expect } from "vitest";
import tldsList, {
  lastUpdated,
  tldsList as namedTldsList,
  validateEmail,
  isValidEmail,
  type EmailValidation,
  type EmailValidationReason,
} from "./index.js";

// ─── tldsList ────────────────────────────────────────────────────────────────

describe("tldsList", () => {
  it("is an array", () => {
    expect(Array.isArray(tldsList)).toBe(true);
  });

  it("contains at least 1000 entries", () => {
    expect(tldsList.length).toBeGreaterThan(1000);
  });

  it("contains common TLDs", () => {
    expect(tldsList).toContain("com");
    expect(tldsList).toContain("org");
    expect(tldsList).toContain("net");
    expect(tldsList).toContain("edu");
    expect(tldsList).toContain("gov");
  });

  it("all entries are lowercase", () => {
    expect(tldsList.every((t) => t === t.toLowerCase())).toBe(true);
  });

  it("has no duplicates", () => {
    expect(new Set(tldsList).size).toBe(tldsList.length);
  });

  it("default export is the same reference as the named tldsList export", () => {
    expect(tldsList).toBe(namedTldsList);
  });
});

// ─── lastUpdated ─────────────────────────────────────────────────────────────

describe("lastUpdated", () => {
  it("is a non-empty string", () => {
    expect(typeof lastUpdated).toBe("string");
    expect(lastUpdated.length).toBeGreaterThan(0);
  });

  it("round-trips as a valid ISO 8601 date", () => {
    expect(new Date(lastUpdated).toISOString()).toBe(lastUpdated);
  });

  it("is year 2024 or later", () => {
    expect(new Date(lastUpdated).getFullYear()).toBeGreaterThanOrEqual(2024);
  });
});

// ─── validateEmail ───────────────────────────────────────────────────────────

describe("validateEmail — valid cases", () => {
  it("recognises a standard .com address", () => {
    expect(validateEmail("user@example.com")).toEqual<EmailValidation>({
      valid: true,
      email: "user@example.com",
      tld: "com",
    });
  });

  it("recognises .org", () => {
    expect(validateEmail("contact@nonprofit.org")).toMatchObject({ valid: true, tld: "org" });
  });

  it("recognises a ccTLD", () => {
    expect(validateEmail("joel@yarigai.mx")).toMatchObject({ valid: true, tld: "mx" });
  });

  it("normalises uppercase TLD to lowercase", () => {
    expect(validateEmail("user@example.COM")).toMatchObject({ valid: true, tld: "com" });
  });

  it("handles subdomains correctly", () => {
    expect(validateEmail("user@mail.subdomain.example.co.uk")).toMatchObject({
      valid: true,
      tld: "uk",
    });
  });

  it("uses the last @ sign as the boundary (RFC 5321)", () => {
    // local part may contain quoted @
    expect(validateEmail("user@host@example.com")).toMatchObject({ valid: true, tld: "com" });
  });

  it("recognises an IDN TLD (xn--p1ai)", () => {
    // .рф (Russia) is in IANA as xn--p1ai
    expect(validateEmail("user@example.xn--p1ai")).toMatchObject({ valid: true });
  });
});

describe("validateEmail — unknown_tld", () => {
  it("rejects a made-up TLD", () => {
    expect(validateEmail("user@example.xyzzy")).toEqual<EmailValidation>({
      valid: false,
      email: "user@example.xyzzy",
      tld: "xyzzy",
      reason: "unknown_tld",
    });
  });

  it("includes the parsed TLD in the result", () => {
    const result = validateEmail("a@b.notreal");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.tld).toBe("notreal");
      expect(result.reason).toBe<EmailValidationReason>("unknown_tld");
    }
  });
});

describe("validateEmail — invalid_format", () => {
  it("rejects a plain string without @", () => {
    expect(validateEmail("not-an-email")).toMatchObject({
      valid: false,
      tld: null,
      reason: "invalid_format",
    });
  });

  it("rejects an address that starts with @", () => {
    expect(validateEmail("@domain.com")).toMatchObject({ valid: false, reason: "invalid_format" });
  });

  it("rejects an address that ends with @", () => {
    expect(validateEmail("user@")).toMatchObject({ valid: false, reason: "invalid_format" });
  });

  it("rejects a domain with no dot", () => {
    expect(validateEmail("user@localhost")).toMatchObject({
      valid: false,
      reason: "invalid_format",
    });
  });

  it("rejects a domain that starts with a dot", () => {
    expect(validateEmail("user@.com")).toMatchObject({ valid: false, reason: "invalid_format" });
  });

  it("rejects a domain that ends with a dot", () => {
    expect(validateEmail("user@example.")).toMatchObject({
      valid: false,
      reason: "invalid_format",
    });
  });

  it("echoes the original email in the result", () => {
    const input = "bad-input";
    const result = validateEmail(input);
    expect(result.email).toBe(input);
  });
});

// ─── isValidEmail ─────────────────────────────────────────────────────────────

describe("isValidEmail", () => {
  it("returns true for a valid address", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  it("returns false for an unknown TLD", () => {
    expect(isValidEmail("user@example.xyzzy")).toBe(false);
  });

  it("returns false for an invalid format", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("@")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });

  it("is consistent with validateEmail", () => {
    const emails = ["user@example.com", "bad@fake.xyzzy", "notanemail", "user@EXAMPLE.ORG", "a@b."];
    for (const email of emails) {
      expect(isValidEmail(email)).toBe(validateEmail(email).valid);
    }
  });
});
