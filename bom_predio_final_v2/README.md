# Bom Prédio - Frontend (Vite + React)

This is a frontend scaffold for the Bom Prédio marketplace (Vite + React).

## Quick start

1. Install deps
```bash
npm install
```

2. Create `.env.local` (optional)
```
VITE_SUPABASE_URL=https://your-supabase-url
VITE_SUPABASE_ANON_KEY=public-anon-key
```

3. Run dev server
```bash
npm run dev
```

4. Build
```bash
npm run build
```

## Notes
- Uses CSS Modules for component styles and a tokens file in `src/styles/tokens.css`.
- Supabase integration is optional — fallback behaviour present when env vars are missing.
