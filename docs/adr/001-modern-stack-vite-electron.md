# ADR 001: Modernization of Build System with Electron-Vite and React 19

## Status
Accepted

## Context
The legacy application was built using an outdated Webpack configuration, Electron 22, insecure browser settings (`nodeIntegration: true`), and manual HTML string injection with polling loops. Build times were slow, hot module reloading was broken, and code quality did not meet production standards.

## Decision
We modernized the foundation with:
1. **Electron-Vite:** Provides instant Hot Module Replacement (HMR) for the renderer and fast TypeScript compilation for Main and Preload processes using Rollup/esbuild.
2. **React 19:** Leverages the latest React concurrent features and cleaner component lifecycle.
3. **Tailwind CSS v4:** Modern, zero-runtime styling engine with full support for RTL/LTR layouts.
4. **Vitest:** Ultra-fast native ESM test runner compatible with Vite configuration for Test-Driven Development (TDD).
5. **Strict TypeScript:** Enforces null-safety and strict typing across all layers.

## Consequences
- Significantly faster development and build cycles.
- Clear process separation (Main, Preload, Renderer) with full TypeScript safety.
- Complete security adherence to Electron security recommendations.

