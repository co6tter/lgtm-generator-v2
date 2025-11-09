# Contributing to LGTM Generator v2

First off, thank you for considering contributing to LGTM Generator v2! It's people like you that make this tool better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to fostering an open and welcoming environment. We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, browser, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed enhancement**
- **Explain why this enhancement would be useful**
- **List any examples of similar features in other applications**

### Your First Code Contribution

Unsure where to begin? You can start by looking through issues labeled:
- `good first issue` - Issues that should only require a few lines of code
- `help wanted` - Issues that need attention

## Development Setup

### Prerequisites

- Node.js 20 or later
- npm or pnpm
- Git

### Setup Steps

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lgtm-generator-v2.git
   cd lgtm-generator-v2
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/co6tter/lgtm-generator-v2.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your API keys:
   - Get Unsplash API key: https://unsplash.com/developers
   - Get Pexels API key: https://www.pexels.com/api/
   - Get Pixabay API key: https://pixabay.com/api/docs/

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Run tests to verify setup**
   ```bash
   npm test
   npm run test:e2e
   ```

## Development Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write clean, maintainable code
   - Follow the coding guidelines
   - Add tests for new features
   - Update documentation as needed

3. **Run tests**
   ```bash
   npm test                # Unit/Integration tests
   npm run test:coverage   # Coverage report
   npm run test:e2e       # E2E tests
   ```

4. **Run linter and formatter**
   ```bash
   npm run lint           # Check for issues
   npm run format         # Format code
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Keep your branch up to date**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

7. **Push to your fork**
   ```bash
   git push origin feat/your-feature-name
   ```

8. **Create a Pull Request**

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Avoid using `any` type - use proper typing
- Define interfaces/types in `types/` directory
- Use strict mode settings

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Avoid unnecessary re-renders
- Use React Server Components where appropriate

### File Organization

```
src/
  app/                    # Next.js App Router
    api/                 # API routes
      health/            # Health check endpoint
      search/            # Image search endpoints (unsplash, pexels, pixabay)
    search/              # Search results page
    layout.tsx           # Root layout
    page.tsx             # Home page
    globals.css          # Global styles
  components/            # React components
    image/               # Image-related components (ImageCard, ImageGrid, etc.)
    layout/              # Layout components (Header, Footer, etc.)
    modal/               # Modal components (PreviewModal, etc.)
    search/              # Search-related components (SearchBar, TabSelector, etc.)
    ui/                  # Reusable UI components (Button, LoadingSpinner, etc.)
    index.ts             # Component exports
  hooks/                 # Custom React hooks (useSearch, useLGTM, etc.)
  lib/                   # Utility functions and libraries
    api/                 # API clients, validators, transformers, error handlers
    api-client.ts        # Main API client
    cache.ts             # Cache management
    image-processor.ts   # Canvas-based image processing
  types/                 # TypeScript type definitions
e2e/                     # E2E tests (Playwright)
  search.spec.ts
  lgtm-generation.spec.ts
  error-handling.spec.ts

Note: Unit and integration tests are co-located with their source files (*.test.ts, *.test.tsx)
```

### Naming Conventions

- **Components**: PascalCase (e.g., `SearchBar.tsx`)
- **Functions**: camelCase (e.g., `fetchImages`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINT`)
- **Types/Interfaces**: PascalCase (e.g., `ImageResult`)
- **Files**: kebab-case for utilities, PascalCase for components

### Code Style

- Use Biome for linting and formatting
- Follow the existing code style
- Write self-documenting code with clear variable names
- Add comments for complex logic
- Keep functions small and focused (single responsibility)
- Avoid deep nesting (max 3 levels)

### Performance

- Optimize images using Next.js Image component
- Use dynamic imports for code splitting
- Implement proper caching strategies
- Avoid unnecessary API calls
- Use React.memo, useMemo, useCallback where appropriate

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
feat: add Pixabay image search support

fix: resolve markdown copy issue on Safari

docs: update API integration guide

test: add unit tests for image processing

refactor: simplify search result mapping logic
```

### Commit Message Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- First line should be 50 characters or less
- Reference issues and PRs in the footer
- Use the body to explain what and why vs. how

## Pull Request Process

1. **Update documentation** - README, JSDoc comments, etc.
2. **Add tests** - Ensure your changes are covered by tests
3. **Run all tests** - Make sure everything passes
4. **Update CHANGELOG.md** if applicable
5. **Fill out the PR template completely**
6. **Link related issues** using keywords (e.g., "Closes #123")
7. **Request review** from maintainers
8. **Address review feedback** promptly
9. **Squash commits** if requested
10. **Wait for approval** - At least one maintainer must approve

### PR Title Format

Follow the same format as commit messages:
```
feat: add custom text input feature
fix: resolve image download issue on mobile
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Motivation
Why are these changes necessary?

## Changes Made
- Change 1
- Change 2

## Screenshots (if applicable)
[Add screenshots]

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] Accessible (WCAG 2.1 Level A)
```

## Testing Guidelines

### Unit Tests

- Test individual functions and components
- Use Vitest and React Testing Library
- Aim for 80%+ code coverage
- Mock external dependencies
- Test edge cases and error handling

```typescript
// Example unit test
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });
});
```

### Integration Tests

- Test component interactions
- Test API route handlers
- Use real implementations where possible
- Mock only external services

### E2E Tests

- Test complete user flows
- Use Playwright
- Cover critical paths (search, generate, copy, download)
- Test on multiple browsers

```typescript
// Example E2E test
import { test, expect } from '@playwright/test';

test('user can search and generate LGTM', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[name="search"]', 'cat');
  await page.click('button[type="submit"]');
  await expect(page.locator('.image-grid')).toBeVisible();
});
```

### Test Coverage Requirements

- Minimum 80% overall coverage
- 100% coverage for critical paths
- All new features must include tests
- Bug fixes should include regression tests

## Questions?

Feel free to:
- Open an issue for discussion
- Ask questions in pull request comments
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to LGTM Generator v2!
