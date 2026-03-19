# Bino-Wizard

A small static web app that crafts WhatsApp queries for Bino using an AI backend.

## Project Structure

- `index.html` — UI for input and output
- `style.css` — styling
- `script.js` — front-end logic calling `/api/chat`
- `api/chat.js` — serverless API route (Vercel) that calls Groq API
- `README.md` — this file

## How it works

1. User enters need, city, budget, category.
2. Frontend sends POST to `/api/chat`.
3. API route calls Groq Chat Completions with `process.env.GROQ_API_KEY`.
4. Response text is displayed and also converted to WhatsApp deep link.

## Local setup

### 1) Install dependencies (if using Node for API testing)

This project is static HTML + serverless API. If dependencies exist, run:

```bash
npm install
```

### 2) Set environment variable

For local API route testing, set:

```bash
export GROQ_API_KEY="gsk_..."
```

Then run your dev server (for Vercel local dev or any static server).

### 3) Run locally

If using Vercel CLI:

```bash
vercel dev
```

Open `http://localhost:3000` and test.

### 4) Add API key in Vercel (Production)

Go to Project Settings → Environment Variables:
- Key: `GROQ_API_KEY`
- Value: your Groq API key (starts with `gsk_`)
- Environment: Production (and Preview/Development as needed)

Then redeploy.

## Common issues

- **`Something went wrong` UI error**: Check browser console and network tab. The API response likely failed because `GROQ_API_KEY` is missing.
- **Vercel push rejections**: run `git pull --rebase origin main` then `git push`.

## Deploy to Vercel

1. `vercel` in project root.
2. Choose root directory (`.`).
3. Set `GROQ_API_KEY` in Environment Variables.
4. Deploy.

## API route details

`api/chat.js` expects POST data (currently your front-end sends `userNeed`, `city`, `budget`, `category`) and calls Groq API with:

```js
'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
```

So the key must be set as env var.

## Troubleshooting

- If you changed the frontend to call `/api/chat`, make sure API route exists.
- Check `vercel logs` for runtime errors.
- Add secrets only in Vercel settings, never commit keys.

## Quick usage

1. Open the page.
2. Enter your need.
3. Click “Craft My Bino Message”.
4. Copy or send via WhatsApp.


A simple static HTML project with animated GIF assets.

## Run locally
Open `index.html` in your browser.
