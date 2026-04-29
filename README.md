# Electron App Starter

This repository is a reusable starter kit for building future desktop apps with Electron, React, TypeScript, Bun, and Turborepo.

It is not intended to represent one specific finished app. Treat it as a foundation that can be renamed, rebranded, and extended for each new product.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) or [Cursor](https://cursor.com/) with the [Oxlint](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) extension.

## Project Setup

The desktop app lives in `apps/desktop` as the `@repo/desktop` workspace package.

Before starting a new app from this template, update app-specific values such as the package names, Electron Builder `appId`, product name, icons, metadata, and release configuration.

### Install

```bash
$ bun install
```

### Development

```bash
$ bun run dev
```

### Build

```bash
# For windows
$ bun run build:win

# For macOS
$ bun run build:mac

# For Linux
$ bun run build:linux
```
