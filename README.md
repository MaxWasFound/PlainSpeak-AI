# PlainSpeak AI

**Understand more. Struggle less.**

An independent project built by **Max**. The site footer displays: `© 2026 PlainSpeak AI. All rights reserved. Built by Max.` Update the year if you reuse this project in a later year.

A small, responsive AI clarity tool with three modes:
- **Make it simpler** — rewrite in clear English.
- **Summarise it** — get 3–6 concise bullet points.
- **Explain difficult words** — define technical or unfamiliar terms.

## Stack
HTML, CSS, vanilla JavaScript, Cloudflare Workers, and Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct-fp8`).

The browser calls a same-origin Worker endpoint. No AI API key is exposed in frontend JavaScript.

## Run locally
1. Install a current Node.js LTS version: https://nodejs.org/
2. Open a terminal in this folder and run `npm install`.
3. Run `npx wrangler login` and follow the browser sign-in steps.
4. Run `npx wrangler dev`.
5. Open the local URL printed in the terminal.

Workers AI availability, quotas, and pricing depend on current Cloudflare account terms. Check your dashboard before public launch. If AI is not available to your account, the app returns a setup error instead of exposing a key.

## Deploy
From this folder run `npx wrangler login` and then `npx wrangler deploy`. The `wrangler.jsonc` file configures the static assets and Workers AI binding. Follow any current Cloudflare prompts to enable or approve Workers AI.

## Structure
```text
plainspeak-ai/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── src/index.js
├── package.json
├── wrangler.jsonc
└── README.md
```

## Responsible use and next steps
- The Worker limits input to 8,000 characters; output is inserted as text, not HTML.
- Don't submit passwords, personal records, or sensitive information.
- AI may change nuance or make mistakes. Verify important details against the original.
- This starter has no login, saved history, abuse throttling, or analytics. Before sharing widely, add rate limiting and abuse controls and review current AI usage terms.
- Test with passages containing names, numbers, dates, technical vocabulary, and caveats. Keep a small evaluation set and document mistakes honestly.
- Add Bengali only after the English version is reliable.

## Ownership and third-party notices
The PlainSpeak AI name, original branding, page copy, and original project code are presented as the work of Max, unless a file or component states otherwise. Third-party libraries, fonts, AI models, and platform services remain subject to their own licenses and terms; this copyright notice does not claim ownership of those materials. Review the relevant licenses and service terms before public release.

No formal open-source license is included by default. If you make the repository public and want others to reuse the code, choose and add a license explicitly. A copyright notice alone does not grant an open-source reuse license.
