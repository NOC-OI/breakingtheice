# Breaking the Ice: 3D Modeling Decades of Change

Breaking the Ice is an interactive science exhibit designed for pupils, teachers, and the public. It combines:

1. A 3D visualization showing the evolution of Arctic sea ice thickness over time.
2. A 2D quiz game with scientific questions related to sea ice and climate change.

The stand is designed for touch interaction (tablets, iPads, or touchscreen laptops), supported by a pull-up banner and live facilitators.

**Live demo:** [https://breakingtheice.space](https://breakingtheice.space)

### Learning Goals

Visitors should leave with:

1. Better awareness of climate change and its impact on oceans.
2. Stronger scientific inquiry skills through scenario-based questioning.
3. Better understanding of human impact on marine ecosystems.

## Project Overview

This repository contains the frontend for the interactive experience, built with Next.js and exported as a static site for GitHub Pages.

## Run Locally

### Prerequisites

1. Node.js 20+
2. npm

### Install dependencies

```bash
npm ci
```

### Start development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Build, Format, and Lint

### Build

```bash
npm run build
```

Build generates a production-ready static export in the out folder.

### Format

```bash
npm run format
```

Use this to normalize style and reduce noisy diffs.

### Format check (CI-friendly)

```bash
npm run format:check
```

### Lint

```bash
npm run lint
```

Lint catches potential bugs, accessibility issues, and consistency problems.

### Why these checks matter before pushing to GitHub

Running build, format checks, and lint before push helps you:

1. Catch failures early (before CI fails on main).
2. Keep code consistent and easier to review.
3. Reduce risk of broken deployments to GitHub Pages.

Recommended pre-push sequence:

```bash
npm run format:check
npm run lint
npm run build
```

## CI and Deployment

This project deploys through GitHub Actions using:

1. Workflow: .github/workflows/nextjs.yml
2. Trigger: push to main (and manual workflow_dispatch)
3. Build output: out
4. Deployment target: GitHub Pages

## Images and Assets

Assets are managed in two layers:

1. Static files live in the public folder (png, svg, etc.).
2. Application references use a centralized map in app/components/assets.ts.

The assets map prepends NEXT_PUBLIC_BASE_PATH so paths continue to work in static export/deployment contexts.

Example pattern:

1. Add file to public/
2. Register it in app/components/assets.ts
3. Use it from components via ASSETS.<name>

This keeps paths consistent and avoids hardcoding strings across multiple components.
