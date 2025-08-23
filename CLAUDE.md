# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Sommwhere marketing landing page - a Next.js 15 application for an AI-powered wine sommelier app. The project uses v0.dev for development and is deployed on Vercel.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm start

# Run linting
pnpm lint
```

## Architecture & Key Components

### Tech Stack
- **Framework**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with custom wine-themed color palette
- **UI Components**: Radix UI primitives wrapped with shadcn/ui components in `/components/ui/`
- **Theme**: Light mode only with custom wine branding colors
- **Fonts**: Marcellus (headings) and PT Serif (body text)

### Color System
- `off-white`: #E5E3DC (main background)
- `primary-dark`: #303636 (text)
- `wine-red`: #732435 (CTAs and accents)

### Project Structure
- `/app/` - Next.js App Router pages and layouts
- `/components/ui/` - Reusable shadcn/ui components
- `/lib/utils.ts` - Utility functions including `cn()` for className merging
- `/public/images/` - Static assets including wine background image

### Key Implementation Patterns
- Use Radix UI primitives through shadcn/ui components
- Apply Tailwind classes directly; custom CSS classes are defined in `globals.css`
- Components use `class-variance-authority` for variant management
- Form handling with `react-hook-form` and `zod` validation

### External Integrations
- Typeform survey link: https://chrisramesh.typeform.com/to/aFzznCNs (used for waitlist)
- Vercel deployment connected to v0.dev

## Important Notes
- This is a v0.dev synced repository - changes made in v0.dev are automatically pushed here
- The project is currently on branch `tasting-game-v1` with `main` as the default branch