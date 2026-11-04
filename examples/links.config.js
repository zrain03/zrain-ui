/**
 * Pembangun / Developer: Zrain
 * Dicipta / Created (rekod Git terawal): 2026-10-27
 * Dikemas kini / Last updated: 2026-11-04
 * Fail / File: examples/links.config.js
 * BM: Contoh integrasi Links yang tidak menggantikan menu dinamik, sign-in atau halaman admin.
 * EN: Links integration example that does not replace dynamic menus, sign-in or admin pages.
 */

// BM: Import API untuk identiti visual bersama, bukan routing atau pengesahan produk.
// EN: Import the shared identity API, not product routing or authentication.
import { mountZrainUI } from "../src/zrain-ui.js";

// BM: Ketiadaan property navigation disengajakan supaya menu milik Links tidak diubah.
// EN: Omitting the navigation property intentionally preserves Links-owned menus.
mountZrainUI({
  // BM: Tunjukkan nama produk Links selepas Zrain.
  // EN: Display the Links product name after Zrain.
  product: "Links",

  // BM: Gunakan imej jenama Zrain yang rasmi.
  // EN: Use the official Zrain brand image.
  logoSrc: "../assets/zrain-logo.webp",

  // BM: Nama produk membawa pengguna kepada root aplikasi Links sendiri.
  // EN: The product name points to the Links application's own root.
  productHref: "/"
});
