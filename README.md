# @yarigai/iana-tlds

[![npm version](https://img.shields.io/npm/v/@yarigai/iana-tlds.svg)](https://www.npmjs.com/package/@yarigai/iana-tlds)
[![CI](https://github.com/yarigai/iana-tlds/actions/workflows/ci.yml/badge.svg)](https://github.com/yarigai/iana-tlds/actions/workflows/ci.yml)
[![Bundle size](https://deno.bundlejs.com/badge?q=@yarigai/iana-tlds)](https://bundlejs.com/?q=@yarigai/iana-tlds)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](package.json)
[![TLD list updated](https://img.shields.io/github/last-commit/yarigai/iana-tlds/main?path=src%2Fdata%2Ftlds.ts&label=TLD%20list%20updated)](https://github.com/yarigai/iana-tlds/commits/main/src/data/tlds.ts)
[![License: MIT](https://img.shields.io/npm/l/@yarigai/iana-tlds.svg)](LICENSE)

Validate email and domain TLDs against the official IANA list, checked daily. Zero dependencies, fully typed, ESM + CJS.

## Why

Most email and domain validators decide what a TLD is with a regex or a list someone copied years ago. Both fail in production. A pattern like `\.[a-z]{2,6}$` rejects real TLDs such as `.photography` or the internationalized `.xn--p1ai` (Russian `.рф`), and happily accepts typos like `.con` or `.comm`. Hardcoded lists go stale: IANA added `.web` in 2026, and it retires TLDs too (`.goo` is gone). This package checks the TLD against IANA's [root zone list](https://data.iana.org/TLD/tlds-alpha-by-domain.txt), bundled at build time, with no network call at runtime.

```ts
import { isValidEmail } from "@yarigai/iana-tlds";

isValidEmail("ana@studio.photography"); // true
isValidEmail("ana@example.xn--p1ai"); // true
isValidEmail("ana@example.con"); // false, unknown_tld
```

### How it compares

Results from running each package's latest npm release on 2026-09-28.

|                        | `@yarigai/iana-tlds` | [`tlds`][tlds]      | [`validator`][validator] `isEmail` | [`email-validator`][email-validator] | [`is-valid-domain`][is-valid-domain] |
| ---------------------- | -------------------- | ------------------- | ---------------------------------- | ------------------------------------ | ------------------------------------ |
| Rejects `.con`         | yes                  | yes                 | no                                 | no                                   | no                                   |
| Accepts `.photography` | yes                  | yes                 | yes                                | yes                                  | yes                                  |
| Accepts `.xn--p1ai`    | yes                  | Unicode only (`рф`) | yes                                | no                                   | yes                                  |
| Includes `.web`        | yes                  | no                  | n/a (no TLD list)                  | n/a (no TLD list)                    | n/a (no TLD list)                    |
| Last npm release       | on IANA list change  | 2025-10-22          | 2026-04-02                         | 2018-05-27                           | 2022-02-22                           |
| Runtime dependencies   | 0                    | 0                   | 0                                  | 0                                    | 1 (`punycode`)                       |
| TypeScript types       | bundled              | bundled             | via `@types/validator`             | bundled                              | bundled                              |

`tlds` exports the list only, with no validation function. `validator` and `email-validator` check syntax well and can be combined with this package, which only answers "is this TLD real?". IDN TLDs are matched in Punycode form (`xn--p1ai`), so convert Unicode domains with `domainToASCII` from `node:url` first.

[tlds]: https://www.npmjs.com/package/tlds
[validator]: https://www.npmjs.com/package/validator
[email-validator]: https://www.npmjs.com/package/email-validator
[is-valid-domain]: https://www.npmjs.com/package/is-valid-domain

## Installation

```bash
npm install @yarigai/iana-tlds
# or
yarn add @yarigai/iana-tlds
# or
pnpm add @yarigai/iana-tlds
```

## Usage

### Validate an email's TLD

```ts
import { validateEmail, isValidEmail } from "@yarigai/iana-tlds";

// Detailed result - discriminate on `valid`
const result = validateEmail(email);
if (result.valid) {
  console.log(result.tld); // e.g. "com", "mx", "org"
} else {
  console.log(result.reason); // "invalid_format" | "unknown_tld"
  console.log(result.tld); // string if parsed, null if format was invalid
}

// Boolean shorthand
isValidEmail(email); // true  - TLD is IANA-registered
isValidEmail(unknownTldEmail); // false - TLD not in IANA list
isValidEmail("not-an-email"); // false - invalid format
```

### Work with the raw TLD list

```ts
import { tldsList, lastUpdated } from "@yarigai/iana-tlds";

// tldsList → string[] of lowercase TLDs, e.g. ["aaa", "aarp", ..., "zw"]
// lastUpdated → ISO 8601 timestamp of the IANA source file bundled in this release

console.log(tldsList.includes("com")); // true
console.log(lastUpdated); // "2026-05-19T07:07:02.000Z"
```

### Named imports

```ts
import { tldsList, lastUpdated, validateEmail, isValidEmail } from "@yarigai/iana-tlds";
```

## API Reference

### `validateEmail(email: string): EmailValidation`

Validates whether an email address has a valid IANA-registered TLD. Only the
TLD portion of the domain is checked - local-part syntax and DNS resolution
are outside the scope of this function.

Returns an `EmailValidation` discriminated union:

| Shape                                                                  | When                            |
| ---------------------------------------------------------------------- | ------------------------------- |
| `{ valid: true; email: string; tld: string }`                          | TLD is recognised by IANA       |
| `{ valid: false; email: string; tld: string; reason: "unknown_tld" }`  | TLD parsed but not in IANA list |
| `{ valid: false; email: string; tld: null; reason: "invalid_format" }` | No TLD could be extracted       |

```ts
// valid IANA TLD → { valid: true, email, tld: "com" }
validateEmail(email);

// unrecognised TLD → { valid: false, email, tld: "xyzzy", reason: "unknown_tld" }
validateEmail(unknownTldEmail);

// no TLD found → { valid: false, email: "not-an-email", tld: null, reason: "invalid_format" }
validateEmail("not-an-email");
```

### `isValidEmail(email: string): boolean`

Convenience wrapper around `validateEmail` that returns `true` when the
email has a valid IANA TLD, `false` otherwise.

### Types

```ts
type EmailValidationReason = "invalid_format" | "unknown_tld";

type EmailValidation =
  | { valid: true; email: string; tld: string }
  | { valid: false; email: string; tld: string | null; reason: EmailValidationReason };
```

### Data exports

| Export        | Type       | Description                             |
| ------------- | ---------- | --------------------------------------- |
| `tldsList`    | `string[]` | Array of all valid TLDs in lowercase    |
| `lastUpdated` | `string`   | ISO 8601 timestamp from the IANA source |

## Data source & sync

The TLD list is sourced directly from IANA's root zone database:
`https://data.iana.org/TLD/tlds-alpha-by-domain.txt`

A scheduled CI/CD pipeline runs daily. If IANA publishes an updated list, the
pipeline automatically:

1. Fetches the new list and compares it against the bundled version.
2. Rebuilds and tests the package.
3. Bumps the patch version, commits, tags, and pushes back to the repository.
4. Publishes the new release to npm.

To sync locally:

```bash
pnpm run update-tlds
pnpm run build
```

## Contributing

Bug reports and pull requests are welcome at
[github.com/yarigai/iana-tlds](https://github.com/yarigai/iana-tlds).

Please open an issue first for non-trivial changes.

## License

MIT - see [LICENSE](LICENSE).

---

Maintained by [Yarigai](https://yarigai.mx) - Enterprise Technology Architecture & Strategic IT Consulting.
