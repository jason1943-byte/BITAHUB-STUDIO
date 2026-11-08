<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/cfcd944b-49b6-499a-aea1-ced0a1f8b544

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment

Production builds are deployed automatically from `main`.

- Vercel: https://app-brown-mu-72.vercel.app
- Cloudflare Pages: https://bitahubstudio.pages.dev

Build command: `npm run build`, output directory: `dist`.
