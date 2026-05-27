import { tlds as rawTlds, lastUpdated as rawLastUpdated } from "./data/tlds.js";

/** Reason a TLD validation failed. */
export type EmailValidationReason = "invalid_format" | "unknown_tld";

/**
 * Result returned by {@link validateEmail}.
 *
 * Discriminate on `valid`:
 * - `valid: true`  → `tld` is the matched IANA TLD string.
 * - `valid: false` → `reason` explains the failure; `tld` is `null` when the
 *   TLD could not be parsed, or a string when it was parsed but not recognised.
 */
export type EmailValidation =
  | { valid: true; email: string; tld: string }
  | { valid: false; email: string; tld: string | null; reason: EmailValidationReason };

/** All valid TLDs registered with IANA, in lowercase. */
export const tldsList: string[] = rawTlds;

/** ISO 8601 timestamp of the IANA source file bundled in this release. */
export const lastUpdated: string = rawLastUpdated;

const tldsSet = new Set(rawTlds);

/**
 * Validates whether an email address has a valid IANA-registered TLD.
 *
 * Only the TLD portion of the domain is checked — local-part syntax and DNS
 * resolution are outside the scope of this function.
 */
export function validateEmail(email: string): EmailValidation {
  const lastAt = email.lastIndexOf("@");
  if (lastAt <= 0 || lastAt === email.length - 1) {
    return { valid: false, email, tld: null, reason: "invalid_format" };
  }
  const domain = email.slice(lastAt + 1);
  const lastDot = domain.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === domain.length - 1) {
    return { valid: false, email, tld: null, reason: "invalid_format" };
  }
  const tld = domain.slice(lastDot + 1).toLowerCase();
  return tldsSet.has(tld)
    ? { valid: true, email, tld }
    : { valid: false, email, tld, reason: "unknown_tld" };
}

/**
 * Returns `true` if the email address has a valid IANA-registered TLD,
 * `false` otherwise.
 */
export function isValidEmail(email: string): boolean {
  return validateEmail(email).valid;
}
