# @yarigai/iana-tlds

[![npm version](https://img.shields.io/npm/v/@yarigai/iana-tlds.svg)](https://www.npmjs.com/package/@yarigai/iana-tlds)
[![License: MIT](https://img.shields.io/npm/l/@yarigai/iana-tlds.svg)](LICENSE)
[![CI](https://github.com/yarigai/iana-tlds/actions/workflows/ci.yml/badge.svg)](https://github.com/yarigai/iana-tlds/actions/workflows/ci.yml)
[![IANA sync](https://img.shields.io/badge/IANA_sync-daily-blue.svg)](https://data.iana.org/TLD/tlds-alpha-by-domain.txt)

Always up-to-date IANA TLD list for domain validation in production systems.

Data is sourced directly from the [IANA root zone database](https://data.iana.org/TLD/tlds-alpha-by-domain.txt) and bundled at publish time. Zero runtime dependencies — all validation calls are synchronous.

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

// Detailed result — discriminate on `valid`
const result = validateEmail("user@example.com");
if (result.valid) {
  console.log(result.tld); // "com"
} else {
  console.log(result.reason); // "invalid_format" | "unknown_tld"
  console.log(result.tld); // string if parsed, null if format was invalid
}

// Boolean shorthand
console.log(isValidEmail("user@example.com")); // true
console.log(isValidEmail("user@example.xyzzy")); // false
console.log(isValidEmail("not-an-email")); // false
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
TLD portion of the domain is checked — local-part syntax and DNS resolution
are outside the scope of this function.

Returns an `EmailValidation` discriminated union:

| Shape                                                                  | When                            |
| ---------------------------------------------------------------------- | ------------------------------- |
| `{ valid: true; email: string; tld: string }`                          | TLD is recognised by IANA       |
| `{ valid: false; email: string; tld: string; reason: "unknown_tld" }`  | TLD parsed but not in IANA list |
| `{ valid: false; email: string; tld: null; reason: "invalid_format" }` | No TLD could be extracted       |

```ts
validateEmail("user@example.com");
// { valid: true, email: "user@example.com", tld: "com" }

validateEmail("user@example.xyzzy");
// { valid: false, email: "user@example.xyzzy", tld: "xyzzy", reason: "unknown_tld" }

validateEmail("not-an-email");
// { valid: false, email: "not-an-email", tld: null, reason: "invalid_format" }
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
[gitlab.com/yarigai/packages/iana-tlds](https://gitlab.com/yarigai/packages/iana-tlds).

Please open an issue first for non-trivial changes.

## License

MIT — see [LICENSE](LICENSE).

---

Maintained by [Yarigai](https://yarigai.mx) — Enterprise Technology Architecture & Strategic IT Consulting.
