# Electron App Starter

This repository is a reusable starter kit for building future desktop apps with Electron, React, TypeScript, Bun, and Turborepo.

It is not intended to represent one specific finished app. Treat it as a foundation that can be renamed, rebranded, and extended for each new product.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) or [Cursor](https://cursor.com/) with the [Oxlint](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) extension.

## Tech Stack

- [Electron](https://www.electronjs.org/) for the desktop runtime.
- [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/) for the app UI.
- [Electron Vite](https://electron-vite.org/) and [Vite](https://vite.dev/) for development and production builds.
- [Bun](https://bun.sh/) workspaces and [Turborepo](https://turbo.build/repo) for monorepo management.
- [Tailwind CSS](https://tailwindcss.com/), [Base UI](https://base-ui.com/), and [shadcn](https://ui.shadcn.com/) for UI foundations.
- [TanStack Router](https://tanstack.com/router/latest) for type-safe routing.
- [Electron Builder](https://www.electron.build/) and [electron-updater](https://www.electron.build/auto-update) for packaging and updates.
- [Ultracite](https://www.ultracite.ai/) with Oxlint and Oxfmt for linting and formatting.

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

### Release

Releases are tag-based. Run the release helper from the repository root:

```bash
$ bun run release
```

The script prints the current desktop app version from `apps/desktop/package.json` and asks for the next version or a bump type:

```text
Current version: 0.0.1
New version or bump (major/minor/patch):
```

You can enter an exact version such as `0.0.2`, or a bump type such as `major`, `minor`, or `patch`. The script updates the desktop package version, runs checks, commits the version change, creates a matching `vX.Y.Z` tag, and pushes the commit and tag.

For non-interactive usage:

```bash
$ bun run release patch
$ bun run release 0.0.2
```

Pushing the tag triggers `.github/workflows/release.yml`, which builds macOS, Windows, and Linux packages, then publishes the GitHub release assets and `latest*.yml` updater metadata.

`electron-updater` compares the installed app version with the version in the published `latest*.yml` files. To test updates, install one packaged version, then publish a higher version.
