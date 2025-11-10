# LGTM Generator v2

A modern web application for generating "LGTM" (Looks Good To Me) images to use in Pull Request reviews. Search high-quality images from multiple sources and overlay LGTM text instantly.

## Features

- **Multi-Source Image Search**: Search from Unsplash, Pexels, and Pixabay
- **Instant LGTM Generation**: Add LGTM text overlay to any image
- **Markdown Copy**: One-click copy in GitHub/GitLab compatible markdown format
- **Image Download**: Save generated LGTM images locally
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Full dark mode support for comfortable viewing
- **Fast Performance**: Optimized with Next.js 16 and modern web technologies
- **Accessible**: WCAG 2.1 Level A compliant

## Demo

<!-- TODO: Add demo GIF or screenshot -->
Live Demo: [Coming Soon]

## Screenshots

<!-- TODO: Add screenshots -->

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) 16 with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5
- **UI Library**: [React](https://react.dev/) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **Validation**: [Zod](https://zod.dev/)

### Backend
- **API Routes**: Next.js API Routes (Serverless)
- **Image Processing**: Canvas API

### External APIs
- **Unsplash API**: High-quality photos (50 req/hour)
- **Pexels API**: High-quality photos (200 req/hour)
- **Pixabay API**: Photos + illustrations (5,000 req/hour)

### Development Tools
- **Linter/Formatter**: [Biome](https://biomejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/) (Unit/Integration), [Playwright](https://playwright.dev/) (E2E)
- **Git Hooks**: [Lefthook](https://github.com/evilmartians/lefthook)
- **CI/CD**: GitHub Actions

### Deployment
- **Platform**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm or pnpm
- API keys for image search services (free)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/co6tter/lgtm-generator-v2.git
cd lgtm-generator-v2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:

```env
UNSPLASH_ACCESS_KEY=your_unsplash_key_here
PEXELS_API_KEY=your_pexels_key_here
PIXABAY_API_KEY=your_pixabay_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Get API Keys (Free):
- **Unsplash**: [Unsplash Developers](https://unsplash.com/developers)
- **Pexels**: [Pexels API](https://www.pexels.com/api/)
- **Pixabay**: [Pixabay API](https://pixabay.com/api/docs/)

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run unit tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:e2e:ui` | Run E2E tests with UI |
| `npm run lint` | Run Biome linter |
| `npm run format` | Format code with Biome |

## Usage

1. **Search Images**: Enter a keyword (e.g., "cat", "success") and select a source
2. **Select Image**: Click on an image from the search results
3. **Preview**: The LGTM text will be automatically overlaid
4. **Copy or Download**:
   - Click "Copy Markdown" to copy `![LGTM](image_url)` format
   - Click "Download" to save the image locally

## Project Structure

```
lgtm-generator-v2/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/           # API Routes
│   │   │   ├── health/    # Health check endpoint
│   │   │   └── search/    # Image search endpoints (unsplash, pexels, pixabay)
│   │   ├── search/        # Search results page
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   └── globals.css    # Global styles
│   ├── components/        # React components
│   │   ├── image/         # Image-related components (ImageCard, ImageGrid, etc.)
│   │   ├── layout/        # Layout components (Header, Footer, etc.)
│   │   ├── modal/         # Modal components (PreviewModal, etc.)
│   │   ├── search/        # Search-related components (SearchBar, TabSelector, etc.)
│   │   ├── ui/            # Reusable UI components (Button, LoadingSpinner, etc.)
│   │   └── index.ts       # Component exports
│   ├── hooks/             # Custom React hooks (useSearch, useLGTM, etc.)
│   ├── lib/               # Utility functions and libraries
│   │   ├── api/           # API clients, validators, transformers, error handlers
│   │   ├── api-client.ts  # Main API client
│   │   ├── cache.ts       # Cache management
│   │   └── image-processor.ts  # Canvas-based image processing
│   └── types/             # TypeScript type definitions
├── e2e/                   # E2E tests (Playwright)
│   ├── search.spec.ts
│   ├── lgtm-generation.spec.ts
│   └── error-handling.spec.ts
├── docs/                  # Documentation
│   ├── 01_requirements.md
│   └── 05_architecture.md
├── public/                # Static assets
├── .github/
│   └── workflows/         # GitHub Actions CI/CD
│       ├── deploy.yml
│       └── test.yml
├── README.md              # This file
├── CONTRIBUTING.md        # Contribution guidelines
├── CHANGELOG.md           # Version history
└── LICENSE                # MIT License
```

**Note:** Unit and integration tests are co-located with their source files (e.g., `*.test.ts`, `*.test.tsx`)

## Testing

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# View test report
npm run test:e2e:report
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project to [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel dashboard:
   - `UNSPLASH_ACCESS_KEY`
   - `PEXELS_API_KEY`
   - `PIXABAY_API_KEY`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy!

Or use the Vercel button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fco6tter%2Flgtm-generator-v2)

For detailed deployment instructions, see [Deployment Guide](docs/DEPLOYMENT.md).

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes
4. Run tests (`npm test && npm run test:e2e`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feat/amazing-feature`)
7. Open a Pull Request

## Documentation

- [Requirements](docs/01_requirements.md)
- [Architecture](docs/05_architecture.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guide](CONTRIBUTING.md)

## Roadmap

### Phase 1 (Current)
- [x] Multi-source image search (Unsplash, Pexels, Pixabay)
- [x] LGTM text overlay
- [x] Markdown copy
- [x] Image download
- [x] Responsive design
- [x] Dark mode support
- [x] Comprehensive testing

### Phase 2 (Future)
- [ ] Custom text input
- [ ] Text customization (size, color, position)
- [ ] Favorites feature
- [ ] History feature
- [ ] Google Image Search integration
- [ ] SNS sharing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.0s

## Security

- HTTPS only
- API keys protected via environment variables
- XSS protection with React automatic escaping
- CSP (Content Security Policy) headers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Images provided by [Unsplash](https://unsplash.com/), [Pexels](https://www.pexels.com/), and [Pixabay](https://pixabay.com/)
- Built with [Next.js](https://nextjs.org/) and [Vercel](https://vercel.com/)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/co6tter/lgtm-generator-v2/issues/new).

---

Made with ❤️ by [@co6tter](https://github.com/co6tter)
