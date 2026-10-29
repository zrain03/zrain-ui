# Zrain UI v1.0.0

One shared visual identity for independent Zrain websites.

**Official tagline:** Made for people. Built with purpose.

**Supporting line:** Explore the Zrain Ecosystem.

**Main website:** https://zrain.web.app

## What it does

- The official Zrain logo and the word **Zrain** in the header open the main ecosystem website.
- The product label (e.g., **Links**, **Auth Starter**, **Monitor**) links to the product's own homepage.
- The footer logo and **Developed by Zrain** credit open the main ecosystem website.
- Consistent Inter typography, warm background, terracotta accent, padding and footer layout.
- Each app configures its own name, product URL and optionally its menu/footer links.
- Each app's auth, APIs, database and main functionality stay fully independent.

**Release model:** Zrain UI is now a real **GitHub-pinned npm dependency**, installed from `zrain03/zrain-ui` at a specific commit. Each product has a small build-time sync step that copies the exact `src/brand.css`, `src/zrain-ui.js` and official `assets/zrain-logo.webp` from `node_modules/@zrain/ui` to its public folder. The code is version-pinned and stays local when served, so websites do not depend on another server at runtime. CI and pre-test checks fail if published assets drift from the pinned source.

## Current implementations

- `zrain03/zrain-links` branch `feature/links-foundation`: `cloudflare/public/brand.css`, `zrain-ui.js`, `zrain-ui-config.js` and both homepage/admin HTML.
- `zrain03/zrain-auth-starter` branch `main`: `docs/brand.css`, `zrain-ui.js`, `zrain-ui-config.js` and `docs/index.html`.
- Zrain Monitor and Zrain Ecosystem: examples/configs supplied here. Their GitHub source repositories are not connected/available yet, so no existing project was modified for these two.

## Integrate into a new website

1. Add `"@zrain/ui": "github:zrain03/zrain-ui#af77e6782bdfa168296c1fe14061d72a1e400c55"` under `dependencies` in the website's `package.json`.
2. Run `npm install`. The exact pinned GitHub commit will be installed locally under `node_modules/@zrain/ui`. Commit `package-lock.json` for reproducibility.
3. Copy a **sync script**, such as `cloudflare/scripts/sync-zrain-ui.mjs` from Zrain Links, to the new app's scripts directory. Configure `"zrainUi": {"publicDir": "public"}` in `package.json` and add an `ui:sync` command. Run `npm run ui:sync` to install the official `brand.css`, `zrain-ui.js` and logo into the hosting folder. Run `npm run ui:check` to verify parity.
4. Include the shared stylesheet **after** the product CSS and load a small product-specific `zrain-ui-config.js`. Add `.zrain-header .zrain-brand` and `.zrain-footer .zrain-footer__identity` containers. Product navigation and authentication remain independent.
5. Test and deploy each product independently. When upgrading the shared design, deliberately update the pinned Git commit, run install and sync, review changes, test, commit and deploy. **Pushing this repo alone does not automatically redeploy dependent websites.**

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

## Git dependency integration and releases

Both Zrain Links and Auth Starter now declare the same pinned GitHub package reference. Links uses `cloudflare/package.json` and copies into `cloudflare/public`; Auth Starter has an optional root `package.json` and copies into `docs`. Their UI sync scripts are identical. This does not add Node.js as a requirement for the Auth Starter Java server; Node.js is only used for its optional public website.

Each consumer runs:

```powershell
npm install
npm run ui:sync
npm run ui:check
```

Zrain Links additionally has `deploy-zrain-links.ps1` to run install, sync, tests, Worker deployment and Firebase Hosting deployment in that order. Auth Starter's static website still needs changed `docs/` assets committed and pushed to its own repository so GitHub Pages can publish them.

A new Zrain UI release should be reviewed before changing a consumer's GitHub dependency SHA. CI checks catch stale copies, while the package commit SHA prevents unreviewed breaking updates.

## Synchronize code to a project (PowerShell, legacy manual option)

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
