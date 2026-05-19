# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] — 2026-05-19

### Added
- Initial release.
- `tldsList` — pre-bundled array of all IANA-registered TLDs in lowercase.
- `lastUpdated` — ISO 8601 timestamp of the IANA source file bundled in this release.
- `validateEmail(email)` — synchronous validation with a discriminated union result.
- `isValidEmail(email)` — boolean convenience wrapper.
- TypeScript strict mode with full type declarations (ESM + CJS dual build).
- Automated daily sync pipeline via GitLab CI/CD.

[Unreleased]: https://gitlab.com/yarigai/packages/iana-tlds/-/compare/v1.0.0...HEAD
[1.0.0]: https://gitlab.com/yarigai/packages/iana-tlds/-/tags/v1.0.0
