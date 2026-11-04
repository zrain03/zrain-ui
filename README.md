<!--
Pembangun / Developer: Zrain
Dicipta / Created (rekod Git terawal): 2026-10-27
Dikemas kini / Last updated: 2026-11-04
Fail / File: README.md
BM: Panduan utama Zrain UI, integrasi, pengujian dan disiplin dokumentasi dwibahasa.
EN: Main Zrain UI guide covering integration, verification and bilingual documentation discipline.
-->

# Zrain UI v1.0.0

**BM:** Library visual bersama bagi header, navigation dan footer produk Zrain. Setiap produk kekal mempunyai authentication, API, hosting dan business logic tersendiri.

**EN:** Shared visual library for Zrain product headers, navigation and footers. Every product retains independent authentication, APIs, hosting and business logic.

- **Developer / Pembangun:** Zrain
- **Official tagline / Tagline rasmi:** Made for people. Built with purpose.
- **Supporting line / Ayat sokongan:** Explore the Zrain Ecosystem.
- **Ecosystem:** https://zrain.web.app
- **Source date / Tarikh sumber:** 2026-10-27 (first Git evidence / rekod Git terawal)
- **Last documented update / Kemas kini dokumentasi:** 2026-11-04

## 1. Folder structure / Struktur folder

```text
zrain-ui/
├── assets/                      # Official Zrain logo / Logo rasmi
├── docs/                        # Reusable engineering rules / Panduan kejuruteraan
├── examples/                    # Product-specific integration demos / Contoh integrasi
├── scripts/                     # Explicit manual sync / Skrip sync manual
├── src/                         # Public library implementation / Kod library
├── test/                         # Native Node.js regressions / Ujian regresi
├── .gitignore                   # Ignore generated files / Abaikan fail sementara
├── FILE_PROVENANCE.json         # Metadata all files / Metadata semua fail
├── README.md                    # Primary handoff / Panduan utama
└── package.json                 # Node package and public exports / Manifest Node
```

**BM:** Setiap folder mempunyai tanggungjawab tunggal yang jelas. Nama `test/` dikekalkan daripada projek asal untuk mengelakkan perubahan yang tidak perlu. Tidak ada folder kosong atau abstraction tambahan.

**EN:** Each folder has a clear single responsibility. The existing `test/` name is preserved to avoid unnecessary churn. No empty folders or unnecessary abstractions are introduced.

## 2. Behavior / Tingkah laku

**BM:** Logo dan teks **Zrain** pada header membuka laman ekosistem. Nama produk membuka homepage produk. Tagline rasmi muncul dalam footer sahaja. Kredit footer **Developed by Zrain** membawa pengguna kepada ekosistem.

**EN:** The header Zrain logo and label open the ecosystem. The product name opens its own homepage. The official tagline belongs in the footer only. The footer **Developed by Zrain** credit links to the ecosystem.

**BM:** Navigasi terurus ialah pilihan sahaja. Apabila `navigation` tidak diberi, library tidak menggantikan menu dinamik produk, termasuk UI account dan admin. Pilihan aktif ditentukan menggunakan pathname, query dan hash URL sebenar; event `hashchange`, `popstate` dan `pageshow` mengemaskinikannya. SPA yang menggunakan `history.pushState` atau `replaceState` mesti memanggil `refreshNavigation()` selepas perubahan route.

**EN:** Managed navigation is opt-in. Without `navigation`, the library does not replace product-owned dynamic menus, including account and admin UI. Active selection follows the real URL path, query and hash, updated on `hashchange`, `popstate` and `pageshow`. SPAs using `history.pushState` or `replaceState` must call `refreshNavigation()` after changing routes.

**BM:** Visual Golden Reference ialah header dan footer Zrain Ecosystem yang telah dipersetujui. Penanda aktif ialah highlight terracotta lembut, bukan hanya warna teks. Fokus keyboard dan menu mobile yang boleh discroll juga termasuk dalam standard. CSS menu mobile terurus tidak semestinya sesuai secara terus kepada hamburger menu produk lain.

**EN:** The approved Golden Reference is the Zrain Ecosystem header and footer. The active indicator is a soft terracotta highlight, not merely a text color change. Visible keyboard focus and scrollable managed mobile navigation are also part of the standard. Managed-mobile CSS should not be imposed blindly on another product's hamburger menu.

**BM:** Penanda `Discover` yang diluluskan menggunakan teks `#a64930`, berat `850`, latar `#fff1e9`, radius `9px`, padding `8px 10px` dan jalur bawah `inset 0 -2px 0 #b95136`. `current`, `active`, `aria-current="page"` dan `aria-current="location"` disokong. Saiz tab tidak dipaksa kepada 38px. Ini menyalin gaya aktif sebenar daripada `public/ecosystem-unified.css` dalam ZIP Ecosystem rujukan, tanpa menyalin layout atau fungsi produk lain.

**EN:** The approved `Discover` indicator uses text `#a64930`, weight `850`, background `#fff1e9`, radius `9px`, padding `8px 10px` and bottom inset `0 -2px 0 #b95136`. `current`, `active`, `aria-current="page"` and `aria-current="location"` are supported. Tabs are not forced to 38px height. This reproduces the actual active style from the reference Ecosystem ZIP's `public/ecosystem-unified.css` without copying other product layouts or behavior.

### ScrollSpy pilihan / Optional scrollSpy

**BM:** Tambahkan `scrollSpy: true` bersama `navigation` jika laman mempunyai pautan seksyen pada halaman yang sama, contohnya `#discover`, `#contact`, `#community`. ID seksyen mesti benar-benar wujud. Klik menukar highlight terus kepada destinasi, sementara browser melakukan smooth native anchor scrolling. Scroll manual mengemas kini highlight berdasarkan seksyen pada garis bacaan viewport. Hanya satu tab aktif pada satu masa. Pengesanan scroll dihadkan kepada satu bacaan setiap animation frame, tanpa timer. Pautan luaran, aplikasi tanpa navigation terurus, dan aplikasi yang tidak memilih `scrollSpy` tidak berubah. Gunakan `scrollSpy` hanya selepas memastikan tiada scroll-spy milik aplikasi yang berkonflik. `prefers-reduced-motion` dihormati.

**EN:** Add `scrollSpy: true` beside `navigation` for same-page section links such as `#discover`, `#contact`, `#community`. The target IDs must exist. Clicking immediately selects the destination while the browser performs smooth native anchor scrolling. Manual scrolling updates the active item from the section at the viewport reading line. Only one tab is active. Scroll calculations run at most once per animation frame, without timers. External links, product-owned menus, and applications without `scrollSpy` retain their original behavior. Opt in only after checking for conflicting app-owned scroll-spy logic. The user's `prefers-reduced-motion` setting is respected.

```javascript
// BM: Hanya halaman yang mempunyai seksyen sebenar memilih scrollSpy.
// EN: Only pages with actual sections opt into scrollSpy.
mountZrainUI({
  product: 'Ecosystem',
  logoSrc: '/zrain-logo.webp',
  navigation: [
    { label: 'Discover', href: '#discover', current: true },
    { label: 'Contact', href: '#contact' },
    { label: 'Community', href: '#community' }
  ],
  scrollSpy: true
});
```

## 3. Public API / API awam

**BM:** `src/zrain-ui.js` mengeksport `mountZrainUI(config)`, `ZRAIN_HOME` dan `ZRAIN_TAGLINE`. `mountZrainUI` memerlukan `product` dan `logoSrc` (string tidak kosong). Ia menerima `productHref`, `homeHref`, `tagline`, `navigation`, `footerLinks` dan `document` sebagai pilihan. Panggilan mengembalikan `product`, `homeHref`, `productHref`, `tagline` dan `refreshNavigation`.

**EN:** `src/zrain-ui.js` exports `mountZrainUI(config)`, `ZRAIN_HOME`, and `ZRAIN_TAGLINE`. `mountZrainUI` requires nonempty `product` and `logoSrc` strings. Optional fields are `productHref`, `homeHref`, `tagline`, `navigation`, `footerLinks`, and `document`. The return value includes `product`, `homeHref`, `productHref`, `tagline`, and `refreshNavigation`.

```javascript
/**
 * Pembangun / Developer: Zrain
 * Dicipta / Created: 2026-11-04
 * Dikemas kini / Last updated: 2026-11-04
 * BM: Contoh penggunaan untuk produk baharu; sesuaikan URL, nama dan item menu.
 * EN: Example for a new product; adapt URLs, product name and navigation labels.
 */
import { mountZrainUI } from './zrain-ui.js';

// BM: Pasang UI rasmi menggunakan logo tempatan produk.
// EN: Mount the official UI with the product-local logo.
const ui = mountZrainUI({
  product: 'Monitor',
  logoSrc: '/zrain-logo.webp',
  productHref: '/',
  navigation: [
    { label: 'Overview', href: '#overview', current: true },
    { label: 'Dashboard', href: '#dashboard' }
  ],
  footerLinks: [
    { label: 'Contact', href: 'mailto:zrain.dev@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/zrain03', external: true }
  ]
});

// BM: Panggil selepas SPA menukar URL menggunakan history.pushState/replaceState.
// EN: Call after an SPA updates its URL using history.pushState/replaceState.
// ui.refreshNavigation();
```

**BM:** Halaman HTML menyediakan bekas `.zrain-header .zrain-brand`, `.zrain-header .main-nav` atau `.topnav`, `.zrain-footer .zrain-footer__identity` dan `.zrain-footer .zrain-footer__links`. Sertakan `src/brand.css` selepas CSS produk jika memang mahu gaya bersama menjadi sumber utama; semak percanggahan CSS produk sebelum mengubah urutan.

**EN:** Consumer HTML provides `.zrain-header .zrain-brand`, `.zrain-header .main-nav` or `.topnav`, `.zrain-footer .zrain-footer__identity`, and `.zrain-footer .zrain-footer__links`. Load `src/brand.css` after product CSS when shared styling is meant to take precedence; review CSS conflicts before changing order.

## 4. Installation and release / Pemasangan dan release

**BM:** Produk yang telah mengintegrasikan `@zrain/ui` menggunakan dependency GitHub yang dipin kepada commit tertentu, bukan versi yang berubah sendiri. Contoh reference dalam dokumentasi lama ialah `github:zrain03/zrain-ui#af77e6782bdfa168296c1fe14061d72a1e400c55`. Commit ini **bukan** bukti perubahan Golden Reference dalam ZIP ini sudah diterbitkan. Jangan kemas kini pin tanpa menyemak SHA release sebenar.

**EN:** Existing consumers integrate `@zrain/ui` using a GitHub dependency pinned to a specific commit rather than automatically floating. An older documented reference is `github:zrain03/zrain-ui#af77e6782bdfa168296c1fe14061d72a1e400c55`. That commit **does not** prove the Golden Reference changes in this ZIP have been published. Do not change consumer pins without verifying the actual release commit SHA.

**BM:** Aliran kerja integrasi yang selamat: semak source Git, lakukan commit/push secara sengaja, update pin pada setiap produk, jalankan `npm install`, salin aset ke public folder melalui script sedia ada, jalankan ujian, uji visual desktop/mobile dan deploy setiap aplikasi secara berasingan. Mengemas kini library ini sahaja tidak mengemas kini production apps.

**EN:** Safe integration: review source in Git, deliberately commit/push, update each consumer pin, run `npm install`, synchronize assets to the public folder using the existing consumer script, run tests, inspect desktop/mobile visuals, and deploy each app independently. Updating this library alone does not update production apps.

```powershell
# BM: Jalankan ujian library tanpa dependency tambahan.
# EN: Run native library tests with no additional dependencies.
npm test

# BM: Pilihan legasi untuk menyalin aset ke public folder yang telah wujud.
# EN: Legacy option for copying assets into an existing public directory.
.\scripts\sync.ps1 -TargetPublicDirectory 'C:\path\to\product\public'
```

**BM:** Contoh integrasi terletak dalam `examples/`. Fail `scripts/sync.ps1` menyalin `brand.css` dan `zrain-ui.js`, serta logo hanya jika `-LogoSource` dibekalkan. Ia **tidak** menjalankan tests, commit atau deployment. Jika produk mempunyai script `ui:sync` dan `ui:check` sendiri, gunakan kedua-duanya selepas dependency dipin.

**EN:** Integration demos live in `examples/`. `scripts/sync.ps1` copies `brand.css` and `zrain-ui.js`, plus the logo only when `-LogoSource` is provided. It does **not** run tests, commit or deploy. If the consumer has its own `ui:sync` and `ui:check`, use those after pinning the dependency.

## 5. Bilingual documentation rules / Peraturan dokumentasi dwibahasa

**BM:** Semua source tekstual yang menyokong komen mesti mempunyai header: `Developer: Zrain`, `Created`, `Last updated`, lokasi fail, tujuan dalam BM dan EN. Jelaskan setiap fungsi, keputusan bersyarat, state, input/output, kesan sampingan, risiko dan baris kod bermakna. Utamakan BM dahulu dan EN di bawah. Komen boleh panjang, tetapi jangan cipta penjelasan palsu atau menduplikasi ayat tanpa maklumat tambahan.

**EN:** Every commentable source file must carry `Developer: Zrain`, `Created`, `Last updated`, its path, and purpose in Malay followed by English. Explain each function, conditional decision, state, inputs/outputs, side effects, risks and meaningful operation. Put Malay first and English below. Comments may be detailed, but should not invent behavior or repeat text without adding understanding.

**BM:** `package.json` ialah JSON strict dan tidak menerima komen. WebP juga tidak menerima komen sumber. Sebab itu `package.json` menggunakan medan metadata tersendiri, manakala `FILE_PROVENANCE.json` merekodkan **setiap** fail termasuk aset binary dan dirinya sendiri. Jangan menyisip komen ke dalam JSON atau mengubah bytes logo untuk memenuhi standard ini.

**EN:** `package.json` is strict JSON and cannot accept comments. WebP likewise cannot hold source comments. Therefore `package.json` includes a metadata field and `FILE_PROVENANCE.json` records **every** file, including binary assets and itself. Never insert comments into JSON or alter logo bytes just to meet this standard.

**BM:** Tarikh `Created` bagi fail asal ialah tarikh bukti penambahan terawal dalam Git (`2026-10-27`), bukan dakwaan tarikh ciptaan sebenar. `Last updated` menunjukkan tarikh perubahan kandungan terbaharu dalam pakej ini. Apabila mana-mana fail diedit, update header fail itu dan rekod provenance. Jangan kemas kini tarikh seluruh projek secara membuta tuli.

**EN:** For original files, `Created` is their earliest evidenced Git-addition date (`2026-10-27`), not a claim of the actual authoring date. `Last updated` represents the latest content change in this package. When editing a file, update that file's header and provenance entry. Do not blindly refresh dates for every file in the repository.

**BM:** Standard boleh digunakan semula pada projek lain, tetapi ikut bahasa, framework dan format fail masing-masing. Jangan paksa React, Spring Boot, Flutter atau static HTML memakai tree yang sama. Lihat `docs/ENGINEERING_STANDARD.md` untuk peraturan dan pengecualian secara terperinci.

**EN:** Reuse the principles across projects, but follow each language, framework and file format. Do not force React, Spring Boot, Flutter, or static HTML into identical folder trees. See `docs/ENGINEERING_STANDARD.md` for detailed rules and exceptions.

## 6. Testing and safety / Pengujian dan keselamatan

**BM:** Jalankan `npm test` menggunakan Node.js 20+ sebelum release. Ujian melindungi nilai tagline, destinasi header/footer, menu opt-in, accessibility, pautan luaran, URL path/query/hash dan listener remount. Semak juga visual secara manual pada browser desktop/mobile bagi setiap produk kerana ujian unit library bukan bukti semua aplikasi production sepadan pixel.

**EN:** Run `npm test` using Node.js 20+ before releasing. Tests cover tagline, header/footer links, opt-in menus, accessibility, external links, URL path/query/hash and remount listeners. Also verify visuals manually in desktop/mobile browsers for each consumer, because library unit tests do not prove pixel-perfect parity for every deployed app.

**BM:** Jangan masukkan password, API token, Firebase service-account JSON atau private key. Jangan tukar navigation milik produk secara senyap, jangan tambahkan dependency berbayar dan jangan keluarkan dakwaan `Verified` tanpa bukti ujian.

**EN:** Never commit passwords, API tokens, Firebase service-account JSON, or private keys. Do not silently replace product-owned navigation, introduce paid dependencies or claim a `Verified` status without test evidence.

## 7. Existing consumers / Aplikasi yang pernah menggunakan library

**BM:** Rujukan integrasi terdahulu menunjukkan Zrain Links pada branch `feature/links-foundation`, dengan fail publik di `cloudflare/public/` dan script sync dalam `cloudflare/scripts/`; Zrain Auth Starter pada branch `main`, dengan aset website di `docs/`. Ini ialah maklumat handoff daripada projek terdahulu, bukan pengesahan GitHub terkini. Semak status branch, commit dan path sebenar sebelum apply.

**EN:** Earlier integration records list Zrain Links on `feature/links-foundation`, with public files in `cloudflare/public/` and a sync script under `cloudflare/scripts/`; Zrain Auth Starter on `main`, with website assets under `docs/`. These are prior project handoff details, not fresh GitHub verification. Inspect actual branches, commits and paths before applying updates.

**BM:** Zrain Monitor dan Zrain Ecosystem diberikan contoh dalam folder `examples/`, tetapi contoh tidak bermaksud aplikasi production telah mengimport versi ini. Setiap consumer memerlukan audit CSS, navigation, testing dan deployment sendiri.

**EN:** Zrain Monitor and Zrain Ecosystem are represented in `examples/`, but a demo does not mean their production sites use this version. Every consumer requires its own CSS, navigation, testing and deployment audit.
