/**
 * Pembangun / Developer: Zrain
 * Dicipta / Created (rekod Git terawal): 2026-10-27
 * Dikemas kini / Last updated: 2026-11-04
 * Fail / File: examples/auth-starter.config.js
 * BM: Contoh integrasi Auth Starter yang mengekalkan menu dan playground asal milik aplikasi.
 * EN: Auth Starter integration example preserving its original app-owned menu and playground.
 */

// BM: Import fungsi pemasangan identiti visual tanpa mengimport sistem authentication produk.
// EN: Import the visual identity mount function without importing product authentication.
import { mountZrainUI } from "../src/zrain-ui.js";

// BM: Pasang hanya header/footer rasmi; property navigation sengaja tidak dibekalkan.
// EN: Mount only official header/footer branding; the navigation property is deliberately omitted.
mountZrainUI({
  // BM: Label produk dipaparkan bersebelahan nama Zrain.
  // EN: The product label is displayed beside the Zrain name.
  product: "Auth Starter",

  // BM: Gunakan aset logo rasmi tempatan dan bukannya logo baharu.
  // EN: Use the local official logo asset instead of a replacement.
  logoSrc: "../assets/zrain-logo.webp",

  // BM: Halaman utama contoh ialah anchor top dalam produk sendiri.
  // EN: This example's product homepage is its own top anchor.
  productHref: "#top"
});
