# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Docs and package metadata only (PATCH).

### Changed

- README: new intro explaining the problem with regex and hardcoded TLD lists, a comparison table against `tlds`, `validator`, `email-validator` and `is-valid-domain`, and badges for bundle size, zero dependencies and last TLD list update.
- `package.json`: clearer `description` and expanded `keywords` for npm search (`email-validation`, `domain-validation`, `validator`, `typescript`, `idn`, `punycode`).
- `package.json`: `repository.url` uses the `git+https` form recommended by npm.

## [1.0.0] - 2026-05-19

### Added

- Initial release.
- `tldsList` - pre-bundled array of all IANA-registered TLDs in lowercase.
- `lastUpdated` - ISO 8601 timestamp of the IANA source file bundled in this release.
- `validateEmail(email)` - synchronous validation with a discriminated union result.
- `isValidEmail(email)` - boolean convenience wrapper.
- TypeScript strict mode with full type declarations (ESM + CJS dual build).
- Automated daily sync pipeline via GitHub Actions.

[Unreleased]: https://github.com/yarigai/iana-tlds/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yarigai/iana-tlds/releases/tag/v1.0.0
