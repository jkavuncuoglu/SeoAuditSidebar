# SEO & UX Audit Sidebar (Vue 3)

![npm version](https://img.shields.io/npm/v/@jkavuncuoglu/seo-ux-audit-sidebar)
![npm downloads](https://img.shields.io/npm/dm/@jkavuncuoglu/seo-ux-audit-sidebar)
![license](https://img.shields.io/npm/l/@jkavuncuoglu/seo-ux-audit-sidebar)
![vue](https://img.shields.io/badge/vue-3.x-brightgreen)

A modular Vue 3 sidebar for quick **Content SEO** and **User Experience (UX)** audits.  
It runs safe, client-side heuristics and shows **pass / warn / fail** statuses with actionable guidance.

👉 Perfect for developers who want lightweight, in-browser SEO & UX checks during development.

---

## 👀 Preview

![SEO & UX Audit Sidebar Preview](https://raw.githubusercontent.com/jkavuncuoglu/seo-audit-sidebar/main/preview.png)  
*Example of the sidebar auditing SEO & UX issues directly inside your app.*

---

## 📦 Installation

**NPM**
```bash
# NPM
npm install @jkavuncuoglu/audit-sidebar

#Yarn
yarn add @jkavuncuoglu/audit-sidebar

#PNPM
pnpm add @jkavuncuoglu/audit-sidebar
```

🚀 Basic Usage
```aiignore
import { createApp } from 'vue'
import AuditSidebarPlugin, { SidebarAudit } from '@jkavuncuoglu/audit-sidebar'
import '@jkavuncuoglu/audit-sidebar/style.css' // optional minimal styles

import App from './App.vue'

const app = createApp(App)

// Install the plugin globally
app.use(AuditSidebarPlugin)

// Mount your app
app.mount('#app')

// OR: use <SidebarAudit /> locally inside your components

```

🧩 Features
- ✅ Content SEO checks: meta title, meta description, H1s, image alts, canonical tag
- ✅ UX checks: viewport tag, mobile-friendliness heuristic, broken links, large images, contrast hints
- ✅ One-click auditing: run all checks at once or trigger individually
- ✅ Local persistence: remembers sidebar state, active tab, and suppressed items via localStorage
- ✅ Lightweight & client-safe: runs entirely in the browser without external calls

🎨 Styling
If you use Tailwind, the components will automatically pick up utility classes.
Without Tailwind, you can import the included fallback CSS:

⚠️ Notes & Limitations
- 🔍 Link checks are heuristic-only (no cross-origin fetches in browser).
- 📑 Duplicate meta detection works per-page; cross-page analysis is out of scope.
- 🌐 Contrast & mobile-friendly checks use basic heuristics; for production audits, pair with Lighthouse or dedicated SEO tools.

🛠️ Troubleshooting
- Sidebar not styled? Ensure you’ve imported style.css or have Tailwind set up.
- Vue version mismatch? Requires Vue 3 (Composition API).
- State not saving? Check if browser storage (localStorage) is enabled.

📄 License

MIT © Jeremy Kavuncuoglu

## Release Notes
See the full changelog in [CHANGELOG.md](./CHANGELOG.md).

---