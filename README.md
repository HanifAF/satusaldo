# SatuSaldo

I started SatuSaldo because I kept losing track of money that technically never disappeared — it just moved. A transfer from my bank to an e-wallet, a cash withdrawal at an ATM, a top-up through a minimarket — each one chips away a small admin fee, and none of the finance apps I'd tried actually accounted for that. So the balance on screen never quite matched what was really in my pocket.

That's the whole premise here: three wallets — Bank, E-Wallet, and Cash — treated as one connected system, where every transfer between them logs its admin fee automatically instead of quietly disappearing.

This repo is still very much in progress. It's based on a PRD written under the working name "Dompetku," and covers both the landing page (what you're looking at right now) and, eventually, the full app.

## 💡 What it does

Beyond the three-wallet system, SatuSaldo handles a few other things that tend to get lost in spreadsheets: debts and receivables (money borrowed from or lent to someone, tracked until it's settled), and recurring monthly bills — rent, subscriptions, internet quota — with due-date reminders and a one-tap "pay" action that deducts straight from a chosen wallet.

The cash wallet gets its own quick-entry interface, since the whole point of tracking small cash expenses (parking, snacks, tolls) is that people give up on it the moment it feels like a chore.

## 🛠️ Stack

The frontend is built with Vue 3 and Tailwind CSS, with @vueuse/motion handling the small interface animations. The build tooling is Vite. Backend work with Supabase (Postgres, Row Level Security, Google Auth) is planned but not yet implemented — right now this repo is frontend-only.

UI screens are designed first in Google Stitch before being implemented in code, following a custom design system called Frosty Mint: a green-and-lime glassmorphism aesthetic with an intentionally asymmetric, bento-box layout. The full spec lives in `satusaldo-design-final.md`.

## 🗺️ Roadmap

**Landing page**
- [x] Hero section
- [x] How it works section
- [ ] Remaining sections

**Core app**
- [ ] Onboarding & Auth
- [ ] Dashboard
- [ ] Transaksi
- [ ] Transfer
- [ ] Utang
- [ ] Tagihan
- [ ] Detail Dompet (template)

## Project structure

```
Satu-Saldo/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── views/
│   ├── router/
│   ├── App.vue
│   └── main.js
├── PRD.md
└── satusaldo-design-final.md
```

## Running it locally

```bash
git clone https://github.com/HanifAF/satusaldo.git
cd satusaldo
npm install
npm run dev
```

## License

MIT.
