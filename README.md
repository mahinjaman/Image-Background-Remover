# 🖼️ ClipCanvas — On-device AI Background Remover

> Free, private, browser-based background removal. Your images never leave your device.

ClipCanvas is a privacy-first background remover that runs **entirely in your browser**. No uploads, no servers, no accounts, no watermarks. The AI model loads directly into the browser via WebAssembly and does everything on-device — meaning your images are *literally* never sent anywhere.

![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- 🔒 **100% Private** — images never leave your browser
- ⚡ **Fast** — first run downloads the model (~50 MB), subsequent runs are instant
- 🎨 **Pixel-perfect cutouts** — powered by IMG.LY's transformer model
- 🖱️ **Drag & drop** support with real-time progress
- 📥 **Transparent PNG** download
- 🌙 **Modern dark UI** with animated gradient background
- 💸 **Free forever** — no signup, no watermark, no limits

---

## 🛠️ Tech Stack

| Layer        | Technology                                                                |
| ------------ | ------------------------------------------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org) (App Router)                             |
| UI           | [React 19](https://react.dev) + [Tailwind CSS v4](https://tailwindcss.com) |
| AI Model     | [@imgly/background-removal](https://github.com/imgly/background-removal-js) (WebAssembly) |
| Language     | TypeScript                                                                |
| Deployment   | [Vercel](https://vercel.com)                                              |

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18.18+** (or 20+ recommended)
- npm / pnpm / yarn / bun

### Installation

```bash
# Clone the repo
git clone https://github.com/<your-username>/bg-remover-local.git
cd bg-remover-local

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start removing backgrounds.

### Build for production

```bash
npm run build
npm start
```

---

## ☁️ Deploy to Vercel

The fastest way to deploy:

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — just click **Deploy**.

That's it. No environment variables, no database, no backend.

---

## 📁 Project Structure

```
bg-remover-local/
├── app/
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Main UI (upload, progress, result)
│   └── globals.css      # Tailwind v4 styles
├── public/              # Static assets
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🧠 How It Works

1. The user drops an image into the browser.
2. `@imgly/background-removal` loads a transformer-based segmentation model into a Web Worker.
3. The model runs inference via **WebAssembly + WebGPU/WebGL** — no network calls.
4. The output mask is composited and returned as a transparent PNG `Blob`.
5. The browser creates a local object URL for preview & download.

The first run pulls the model from the IMG.LY CDN (~50 MB) and caches it. After that, everything is instant and offline-capable.

---

## 🤝 Contributing

Contributions are welcome! Open an issue or PR for:

- New features (batch processing, edge refinement, etc.)
- UI/UX improvements
- Performance tweaks
- Bug fixes

---

## 📜 License

MIT — feel free to use, modify, and ship.

---

## 💖 Credits

- [IMG.LY](https://img.ly) for the open-source background removal model
- [Vercel](https://vercel.com) for Next.js & hosting
- [Tailwind Labs](https://tailwindcss.com) for Tailwind v4

---

<p align="center">
  Built with ❤️ — runs entirely in your browser.
</p>
