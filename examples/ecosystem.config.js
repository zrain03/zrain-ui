/**
 * Pembangun / Developer: Zrain
 * Dicipta / Created (rekod Git terawal): 2026-10-27
 * Dikemas kini / Last updated: 2026-11-04
 * Fail / File: examples/ecosystem.config.js
 * BM: Contoh navigasi dan footer yang hampir kepada rujukan Zrain Ecosystem.
 * EN: Navigation and footer example closely aligned to the Zrain Ecosystem reference.
 */

// BM: Import API perkongsian header dan footer tanpa framework.
// EN: Import the shared header/footer API without a framework.
import { mountZrainUI } from "../src/zrain-ui.js";
// BM: Pasang Zrain UI tanpa mengubah logik aplikasi.
// EN: Mount Zrain UI without changing application logic.
mountZrainUI({
  // BM: Tetapkan nama produk yang dipaparkan selepas Zrain.
  // EN: Set the product name displayed after Zrain.
  product: "Ecosystem",
  // BM: Gunakan logo rasmi yang dibekalkan bersama pakej.
  // EN: Use the official logo bundled with the package.
  logoSrc: "../assets/zrain-logo.webp",
  // BM: Tentukan halaman utama produk dan bukannya ekosistem.
  // EN: Specify the product homepage rather than the ecosystem.
  productHref: "#top",
  // BM: Hanya contoh ini yang memilih menu diurus library.
  // EN: Only this example opts into library-managed navigation.
  navigation: [
    // BM: Tetapkan pilihan asal untuk halaman tanpa hash.
    // EN: Set the default selection for pages without a hash.
    { label: "Discover", href: "#discover", current: true },
    // BM: Tetapkan label dan destinasi item menu atau footer.
    // EN: Set the label and destination for this menu or footer item.
    { label: "Contact", href: "#contact" },
    // BM: Tetapkan label dan destinasi item menu atau footer.
    // EN: Set the label and destination for this menu or footer item.
    { label: "Community", href: "#community" },
    // BM: Pautan luaran dibuka pada tab baharu dengan perlindungan opener.
    // EN: An external destination opens in a new tab with opener protection.
    { label: "GitHub ↗", href: "https://github.com/zrain03", external: true },
    // BM: Tetapkan label dan destinasi item menu atau footer.
    // EN: Set the label and destination for this menu or footer item.
    { label: "Categories", href: "#categories" }
  ],
  // BM: Aktifkan highlight tanpa delay untuk klik dan peralihan seksyen melalui scroll.
  // EN: Enable instant click highlight and automatic section tracking while scrolling.
  scrollSpy: true,
  // BM: Bekalkan pautan footer tanpa menyentuh authentication.
  // EN: Supply footer links without touching authentication.
  footerLinks: [
    // BM: Tetapkan label dan destinasi item menu atau footer.
    // EN: Set the label and destination for this menu or footer item.
    { label: "Contact", href: "mailto:zrain.dev@gmail.com" },
    // BM: Pautan luaran dibuka pada tab baharu dengan perlindungan opener.
    // EN: An external destination opens in a new tab with opener protection.
    { label: "GitHub", href: "https://github.com/zrain03", external: true }
  ]
});
