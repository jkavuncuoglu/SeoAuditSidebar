# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning as indicated by the version in package.json.

## [0.1.4] - 2025-09-07
### Security
- Addressed dependency vulnerabilities by updating indirect dependencies via fresh lockfile generation and using npm ci.
- Workflow hardening: pinned official actions to major versions and least-privilege permissions; Node auth uses repository secret `NPM_TOKEN`.

## [0.1.3] - 2025-09-07
### Added
- GitHub Actions workflow to publish the package to npm automatically on GitHub Release publish.
- Prepublish checks: type checking and build via `prepublishOnly` script.

### Changed
- README improvements: side-by-side image previews, fixed code fence language, added quick install and usage snippets.

### Notes
- Package name: `@jkavuncuoglu/audit-sidebar`.
- Library targets Vue 3 and ships ES and UMD builds with types.

## [0.1.2] - 2025-09-05
### Added
- Styling polish and minor documentation tweaks.

## [0.1.1] - 2025-09-03
### Fixed
- Minor internal adjustments while preparing the package for publishing.

## [0.1.0] - 2025-09-01
### Added
- Initial release of the SEO & UX Audit Sidebar components for Vue 3.
- Components: `SidebarAudit`, `AuditChecklist`, `AuditItem`.
- Audits: SEO and UX heuristic checks with local persistence.
