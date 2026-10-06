# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.2] - 2026-10-06

### Added

- Official Go port: [`github.com/yarigai/iana-tlds-go`](https://github.com/yarigai/iana-tlds-go) v1.0.0, linked from the README.
- Tests that pin the JSON shape of `validateEmail` results (the contract shared with the Go port) and the empty-string case.

## [1.1.0] - 2026-09-28

Docs, package metadata and sync pipeline.

### Fixed

- The daily sync no longer publishes a release when only IANA's `Last Updated` timestamp changes. A new version is published only when a TLD is added or removed. Before this fix, 96 of 97 automated releases contained no change to the list.

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

[Unreleased]: https://github.com/yarigai/iana-tlds/compare/v1.1.2...HEAD
[1.1.2]: https://github.com/yarigai/iana-tlds/compare/v1.1.1...v1.1.2
[1.1.0]: https://github.com/yarigai/iana-tlds/compare/v1.0.102...v1.1.0
[1.0.0]: https://github.com/yarigai/iana-tlds/releases/tag/v1.0.0
