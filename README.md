# LGTM Generator v2

A modern web application for generating "LGTM" (Looks Good To Me) images from various sources.

## Features

- Search images from multiple sources (Unsplash, Pexels, Pixabay)
- Generate LGTM text overlay on images
- Copy as Markdown format
- Responsive design
- Fast performance with Next.js 15

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Testing**: Vitest, Playwright
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm or pnpm

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
- `UNSPLASH_ACCESS_KEY`: Get from [Unsplash Developers](https://unsplash.com/developers)
- `PEXELS_API_KEY`: Get from [Pexels API](https://www.pexels.com/api/)
- `PIXABAY_API_KEY`: Get from [Pixabay API](https://pixabay.com/api/docs/)

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run lint` - Run linter

## Deployment

This project is configured for deployment on Vercel.

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fco6tter%2Flgtm-generator-v2)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
