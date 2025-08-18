# PapillonCast

A modern web application for reading and managing BlueSky content, built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Features

- Built with Next.js 15.4 and React 19
- TypeScript for type safety
- Tailwind CSS v4 for styling
- shadcn/ui components
- ESLint for code quality
- Fully responsive design

## 🛠️ Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3600](http://localhost:3600) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3600

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Vercel KV (if using)
KV_URL=your-kv-url-here
KV_REST_API_URL=your-kv-rest-api-url-here
KV_REST_API_TOKEN=your-kv-rest-api-token-here
KV_REST_API_READ_ONLY_TOKEN=your-kv-read-only-token-here
```

### Setting up Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URI to: `http://localhost:3600/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local` file

## 📝 Available Scripts

- `npm run dev` - Starts the development server with Turbopack
- `npm run build` - Creates an optimized production build
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to check for code quality issues

## 🏗️ Project Structure

```
├── src/
│   ├── app/          # Next.js app router pages
│   └── lib/          # Utility functions
├── public/           # Static assets
├── components.json   # shadcn/ui configuration
└── ...config files
```

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.