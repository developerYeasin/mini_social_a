# Mobile

Expo (React Native) app with file-based routing via `expo-router`.

## Setup

```bash
npm install
npm start
```

Then press `a` (Android), `i` (iOS), or `w` (web). To test on a physical device, scan the QR code with the Expo Go app.

## Backend

The app talks to the backend in `../backend` (runs on port `5000`).
Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` if needed
(use your machine's LAN IP instead of `localhost` when running on a real device).

Import the client anywhere with:

```ts
import { api } from '@/lib/api';
```

## Structure

```
src/
  app/            file-based routes (index.tsx = home screen)
    _layout.tsx   root layout + providers
    index.tsx     home screen
  components/     ThemedText, ThemedView (reusable UI primitives)
  constants/      theme.ts — Colors, Fonts, Spacing
  hooks/          color-scheme / theme hooks
  lib/            api.ts — axios client
```

Add a screen by creating a new file in `src/app/` — e.g. `src/app/profile.tsx`
becomes the `/profile` route automatically.

`@/` is an alias for `src/`.
