# Zrain UI v1.0.0

One shared visual identity for independent Zrain websites.

**Tagline:** One ecosystem. A variety of useful tools.

**Main website:** https://zrain.web.app

## What it does

- The official Zrain logo and the word **Zrain** in the header open the main ecosystem website.
- The product label (e.g., **Links**, **Auth Starter**, **Monitor**) links to the product's own homepage.
- The footer logo and **Developed by Zrain** credit open the main ecosystem website.
- Consistent Inter typography, warm background, terracotta accent, padding and footer layout.
- Each app configures its own name, product URL and optionally its menu/footer links.
- Each app's auth, APIs, database and main functionality stay fully independent.

**Release model:** Each product keeps a versioned local copy of `src/brand.css` and `src/zrain-ui.js`. Avoid a runtime request to a single shared server that could break every product. The included `sync.ps1` safely copies only those two files to a target project when you deliberately update its version.

## Current implementations

- `zrain03/zrain-links` branch `feature/links-foundation`: `cloudflare/public/brand.css`, `zrain-ui.js`, `zrain-ui-config.js` and both homepage/admin HTML.
- `zrain03/zrain-auth-starter` branch `main`: `docs/brand.css`, `zrain-ui.js`, `zrain-ui-config.js` and `docs/index.html`.
- Zrain Monitor and Zrain Ecosystem: examples/configs supplied here. Their GitHub source repositories are not connected/available yet, so no existing project was modified for these two.

## Integrate into a new website

1. Copy `src/brand.css` and `src/zrain-ui.js` to your website's public folder.
2. Copy the **official** `zrain-logo.webp` from `zrain-links/cloudflare/public/zrain-logo.webp` to that folder. The official logo is not recreated by this package.
3. Include the shared stylesheet **after** your product CSS, then include your small product config module.
4. Provide `.zrain-header .zrain-brand` and `.zrain-footer .zrain-footer__identity` containers in your HTML. If supplying menu/footer links from config, provide `.main-nav` and `.zrain-footer__links` too.
5. Run `npm test` and manually check mobile/desktop layout. Deploy each app independently.

Example:

```html
<link rel="stylesheet" href="/brand.css?v=zrain-ui-1.0.0">
<script type="module" src="/zrain-ui-config.js?v=1.0.0"></script>
<header class="zrain-header"><div class="zrain-header__inner">
  <div class="zrain-brand"></div><nav class="main-nav"></nav>
</div></header>
<!-- Your app body remains here -->
<footer class="zrain-footer"><div class="zrain-footer__inner">
  <div class="zrain-footer__identity"></div><div class="zrain-footer__links"></div>
</div></footer>
```

`zrain-ui-config.js`:

```js
import { mountZrainUI } from "./zrain-ui.js?v=1.0.0";
mountZrainUI({
  product: "Monitor",
  logoSrc: "/zrain-logo.webp",
  productHref: "/",
  navigation: [
    { label: "Overview", href: "#overview", current: true },
    { label: "Dashboard", href: "#dashboard" }
  ],
  footerLinks: [
    { label: "Contact", href: "mailto:zrain.dev@gmail.com" },
    { label: "GitHub", href: "https://github.com/zrain03", external: true }
  ]
});
```

Existing Links/Auth Starter deliberately **omit** the navigation property to preserve their dynamic auth/admin navigation and existing playground behavior.

## Synchronize code to a project (PowerShell)

From the extracted `zrain-ui` directory:

```powershell
.\scripts\sync.ps1 -TargetPublicDirectory 'C:\path\to\zrain-links\cloudflare\public'
.\scripts\sync.ps1 -TargetPublicDirectory 'C:\path\to\zrain-auth-starter\docs'
```

Run tests and deploy each app after review. Do not overwrite local uncommitted changes without checking `git status` first.

## Create the independent GitHub repository

This bundle is ready to become `zrain03/zrain-ui`. The connected GitHub integration cannot create repositories, so this has **not** been pushed as a separate GitHub repo. In your terminal after extracting the bundle:

```powershell
git init
git add .
git commit -m "feat: create shared Zrain UI v1.0.0"
# Requires GitHub CLI authenticated to your own account:
gh repo create zrain03/zrain-ui --public --source . --remote origin --push
```

If you prefer to keep the repo private, replace `--public` with `--private`. Repository creation requires your GitHub account permissions.

## Tests

Run `npm test` (Node 20+). This package only uses Node's native test runner.

Do not add any auth token, Firebase service-account JSON or private keys to this UI repository.
