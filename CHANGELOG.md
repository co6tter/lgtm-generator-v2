# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation (README, CONTRIBUTING, LICENSE, CHANGELOG)

## [0.1.0] - 2025-11-10

### Added
- Initial release of LGTM Generator v2
- Multi-source image search (Unsplash, Pexels, Pixabay)
- LGTM text overlay generation using Canvas API
- Markdown copy functionality for GitHub/GitLab
- Image download feature
- Responsive design with Tailwind CSS
- Next.js 16 with App Router
- TypeScript support
- Comprehensive test suite (Vitest + Playwright)
- CI/CD with GitHub Actions
- Vercel deployment configuration
- Toast notifications for user feedback
- Lefthook git hooks for code quality
- Biome linter and formatter
- WCAG 2.1 Level A accessibility compliance

### Features

#### Image Search
- Search from multiple sources with tab-based interface
- Support for Unsplash (high-quality photos)
- Support for Pexels (high-quality photos)
- Support for Pixabay (photos + illustrations)
- Pagination support
- Error handling and retry logic
- Rate limiting protection

#### LGTM Generation
- Canvas-based image processing
- Automatic text overlay with optimal positioning
- High-quality output
- Preview before copy/download
- Fast generation (< 1 second)

#### User Experience
- Clean, modern UI
- Mobile-responsive design
- Loading states and animations
- Error messages with retry options
- Toast notifications for actions
- Keyboard navigation support
- Screen reader friendly

#### Developer Experience
- TypeScript for type safety
- Biome for fast linting/formatting
- Pre-commit hooks with Lefthook
- Comprehensive test coverage (>80%)
- E2E tests with Playwright
- GitHub Actions CI/CD
- Vercel deployment ready

### Technical Details

#### Frontend
- Next.js 16.0.1 with App Router
- React 19.2.0
- TypeScript 5
- Tailwind CSS 4
- SWR 2.3.6 for data fetching
- Zod 4.1.12 for validation

#### Testing
- Vitest 4.0.8 for unit/integration tests
- Playwright 1.56.1 for E2E tests
- React Testing Library 16.3.0
- Coverage reporting with V8

#### Deployment
- Vercel platform
- Serverless API routes
- Edge functions
- Environment variable management

## [0.0.1] - 2025-11-08

### Added
- Project initialization
- Basic Next.js setup
- Tailwind CSS configuration
- Custom global styles
- Project documentation structure

---

## Release Notes

### Version 0.1.0

This is the first production-ready release of LGTM Generator v2. The application provides a complete solution for generating LGTM images with the following highlights:

**Key Features:**
- Three image sources (Unsplash, Pexels, Pixabay) for diverse image selection
- Instant LGTM text overlay with optimized positioning
- One-click markdown copy for easy use in GitHub/GitLab
- Download functionality for offline use
- Fast, responsive, and accessible

**Quality Assurance:**
- 80%+ test coverage
- E2E tests covering critical user flows
- CI/CD pipeline with automated testing
- Performance optimizations (FCP < 1.5s, LCP < 2.5s)

**Developer-Friendly:**
- Clear documentation and contribution guidelines
- Modern tooling (Biome, Lefthook, Vitest, Playwright)
- Type-safe with TypeScript
- Easy local development setup

### Breaking Changes

None - Initial release

### Migration Guide

N/A - Initial release

### Known Issues

- Demo GIF and screenshots to be added
- Live demo URL to be configured

### Upcoming Features (Phase 2)

- Custom text input
- Text customization (size, color, position)
- Favorites feature
- History feature
- Google Image Search integration
- SNS sharing capabilities

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for information on how to contribute to this changelog and the project.

## Links

- [Homepage](https://github.com/co6tter/lgtm-generator-v2)
- [Issue Tracker](https://github.com/co6tter/lgtm-generator-v2/issues)
- [Documentation](docs/)

---

**Legend:**
- `Added` - New features
- `Changed` - Changes in existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Vulnerability fixes
