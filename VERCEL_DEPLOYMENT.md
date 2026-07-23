# Vercel Deployment Guide

## Prerequisites

- Vercel account
- Project connected to a Git repository (GitHub, GitLab, or Bitbucket)
- Bun installed locally for testing builds

## Environment Variables

Configure these in your Vercel project settings under **Settings > Environment Variables**:

### Required Variables

- `VITE_API_URL` - Your backend API URL (e.g., `https://your-backend.vercel.app/api`)
- `VITE_APP_NAME` - Application name (e.g., `Agorix`)
- `VITE_APP_VERSION` - Application version (e.g., `1.0.0`)

### Optional Variables

- `VITE_GOOGLE_SCRIPT_URL` - Google Apps Script deployment URL for demo form submissions
- `VITE_ENABLE_ANALYTICS` - Enable analytics tracking (`true` or `false`)
- `VITE_ENABLE_SENTRY` - Enable Sentry error tracking (`true` or `false`)

## Deployment Steps

### 1. Push Code to Git

```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push
```

### 2. Import Project in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Select the `frontend` directory as root directory

### 3. Configure Project Settings

Vercel should auto-detect most settings. Verify:

- **Framework Preset**: Other
- **Build Command**: `bun run build`
- **Output Directory**: `dist`
- **Install Command**: `bun install`

### 4. Add Environment Variables

In the Vercel project dashboard:

1. Go to **Settings > Environment Variables**
2. Add all the variables listed above
3. Select appropriate environments (Production, Preview, Development)

### 5. Deploy

Click "Deploy" to deploy your application.

## Post-Deployment

### Update Backend CORS

Ensure your backend allows requests from your new Vercel domain:

- Add your Vercel domain to CORS allowed origins
- Example: `https://your-project.vercel.app`

### Test the Deployment

1. Visit your deployed URL
2. Test API connectivity
3. Verify all features work correctly

## Troubleshooting

### Build Fails

- Ensure `bun` is specified as the package manager in Vercel settings
- Check that all dependencies are in `package.json`

### SSR Issues

- The `nitro: { preset: "vercel" }` in `vite.config.ts` handles SSR for Vercel
- If issues persist, check server logs in Vercel dashboard

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_` for client-side access
- Verify variables are set for the correct environment (Production vs Preview)
