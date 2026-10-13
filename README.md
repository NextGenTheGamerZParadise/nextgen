# NEXTGEN : The GamerZ Paradise

Website for **NEXTGEN : The GamerZ Paradise** — PC Gaming, PS5 Pro, Pool, Racing Simulator and Food.
Pure HTML + CSS + vanilla JavaScript. No build step, no dependencies — ready for GitHub Pages.

## Features (all in `js/main.js`)

- Sticky nav that turns solid on scroll, with scroll-spy highlighting and a mobile hamburger menu
- Scroll-reveal animations for zones, rates, perks and visit cards
- **Booking form → WhatsApp**: validates input, blocks past times, pre-fills a message and opens WhatsApp
- "Book this zone" buttons pre-select the zone in the form
- **PS5 Pro weekday / weekend price toggle** (auto-selects based on today's day)
- Single WhatsApp number used by every button / link / floating button
- Location, hours and Google Maps embed driven by settings (shown only when filled in)
- Remembers the visitor's name, back-to-top button, auto-updating footer year
- Respects `prefers-reduced-motion`, keyboard accessible, fully responsive

## Folder structure

```
├── index.html
├── 404.html
├── .nojekyll
├── css/style.css
├── js/main.js
└── assets/
    ├── banner.jpg
    ├── og-image.jpg
    ├── favicon.png / favicon-32.png
    └── apple-touch-icon.png
```

## ✏️ Things you need to edit

1. **Prices** — placeholder rates are in `index.html` (search for `PLACEHOLDER PRICES`).
   PS5 Pro uses `data-weekday="…"` and `data-weekend="…"` on each `<b>`; the visible `₹…` text is just the fallback.
2. **Location / hours / map** — top of `js/main.js`:
   ```js
   const ADDRESS   = '';   // your address
   const MAP_URL   = '';   // Google Maps share link
   const MAP_EMBED = '';   // Google Maps "Embed a map" src (optional)
   const HOURS     = '';   // e.g. 'Mon–Sun · 11:00 AM – 2:00 AM'
   ```
3. **WhatsApp number** — `WHATSAPP` and `PHONE_LABEL` at the top of `js/main.js` (currently +91 98208 95622).
4. **Social preview** — in `index.html`, change the `og:image` to your full URL after deploying,
   e.g. `https://USERNAME.github.io/REPO/assets/og-image.jpg`.

## Deploy on GitHub Pages

1. Create a new repository on GitHub and upload **all files in this folder** (keep the structure).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. After about a minute your site is live at `https://USERNAME.github.io/REPO/`.

### Run locally

Just open `index.html`, or serve it:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```
