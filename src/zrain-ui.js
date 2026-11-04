/**
 * Pembangun / Developer: Zrain
 * Dicipta / Created (rekod Git terawal): 2026-10-27
 * Dikemas kini / Last updated: 2026-11-04
 * Fail / File: src/zrain-ui.js
 * BM: Identiti visual yang bebas framework; semua API dan tingkah laku asal dipelihara.
 * EN: Framework-free visual identity; preserve existing APIs and behavior.
 */

// BM: Eksport alamat rasmi ekosistem untuk digunakan oleh header dan footer.
// EN: Export the official ecosystem address for header and footer links.
export const ZRAIN_HOME = "https://zrain.web.app";
// BM: Eksport tagline rasmi untuk footer sahaja; jangan paparkan dalam header.
// EN: Export the official tagline for the footer only; never display it in the header.
export const ZRAIN_TAGLINE = "Made for people. Built with purpose.";

// BM: Simpan fungsi pembersihan pendengar untuk setiap elemen menu tanpa menghalang garbage collection.
// EN: Store listener cleanup callbacks per menu element without preventing garbage collection.
const navCleanups = new WeakMap();

// BM: Cipta elemen DOM dengan kelas dan kandungan teks pilihan; menggunakan textContent mengelakkan suntikan HTML.
// EN: Create a DOM element with optional classes and plain text; textContent avoids HTML injection.
function element(doc, tag, classes, content) {
  // BM: Cipta elemen mengikut jenis HTML yang diminta menggunakan dokumen yang diberikan.
  // EN: Create the requested HTML element using the supplied document.
  const el = doc.createElement(tag);
  // BM: Tambahkan kelas CSS hanya apabila pemanggil membekalkannya.
  // EN: Assign CSS classes only when the caller supplies them.
  if (classes) el.className = classes;
  // BM: Bezakan teks kosong daripada nilai undefined supaya kandungan sah tidak diabaikan.
  // EN: Distinguish empty text from undefined so valid content is retained.
  if (content !== undefined) el.textContent = content;
  // BM: Pulangkan elemen yang siap dikonfigurasi kepada pemanggil.
  // EN: Return the configured element to its caller.
  return el;
}

// BM: Bangunkan imej logo rasmi daripada URL yang dibekalkan tanpa mengubah aset asal.
// EN: Build an official logo image from the supplied URL without changing its asset.
function brandLogo(doc, src, className, size) {
  // BM: Gunakan pembantu elemen untuk memastikan penciptaan imej konsisten.
  // EN: Reuse the element helper for consistent image creation.
  const img = element(doc, "img", className);
  // BM: Tetapkan sumber imej yang dipilih oleh aplikasi pengguna library.
  // EN: Set the image source selected by the consuming application.
  img.src = src;
  // BM: Kosongkan teks alternatif untuk logo hiasan yang bersebelahan nama Zrain yang boleh dibaca.
  // EN: Use empty alternative text for a decorative logo beside readable Zrain text.
  img.alt = "";
  // BM: Kunci lebar imej supaya susun atur tidak melompat ketika logo dimuatkan.
  // EN: Set image width to reduce layout movement while the logo loads.
  img.width = size;
  // BM: Kunci tinggi imej supaya ruang logo konsisten.
  // EN: Set image height to keep the logo space consistent.
  img.height = size;
  // BM: Benarkan penyahkodan imej secara asynchronous bagi mengurangkan gangguan rendering.
  // EN: Permit asynchronous image decoding to reduce rendering interruptions.
  img.decoding = "async";
  // BM: Pulangkan imej logo untuk dimasukkan dalam identiti header atau footer.
  // EN: Return the logo image for insertion into the header or footer identity.
  return img;
}

// BM: Cipta pautan teks berstruktur dengan URL yang ditentukan oleh aplikasi.
// EN: Create a structured text link using a destination supplied by the application.
function link(doc, href, classes, text) {
  // BM: Gunakan textContent melalui pembantu elemen supaya label pautan selamat.
  // EN: Use the element helper and textContent to keep link labels safe.
  const a = element(doc, "a", classes, text);
  // BM: Tetapkan URL destinasi navigasi.
  // EN: Set the navigation destination URL.
  a.href = href;
  // BM: Pulangkan pautan yang boleh dimasukkan ke DOM.
  // EN: Return the link ready for insertion into the DOM.
  return a;
}

// BM: Cari indeks menu aktif berdasarkan URL sebenar, termasuk path, query dan hash; pulangkan -1 jika tiada padanan.
// EN: Find the active menu index from the actual URL, including path, query and hash; return -1 when unmatched.
function selectedNavigationIndex(items, doc) {
  // BM: Utamakan location pada window; gunakan document.location jika window tidak tersedia.
  // EN: Prefer the window location; fall back to document.location when needed.
  const location = doc.defaultView?.location || doc.location;
  // BM: Kenal pasti item current sebagai fallback hanya apabila routing semasa tidak boleh memberi padanan yang lebih tepat.
  // EN: Identify the explicit current item as a fallback when route detection cannot find a better match.
  const fallback = items.findIndex(item => item.current === true);
  // BM: Periksa URL hanya apabila location menyediakan href.
  // EN: Inspect the URL only if the location contains an href.
  if (location?.href) {
    // BM: Tangkap ralat URL supaya input yang tidak sah tidak mematahkan header.
    // EN: Catch malformed URLs so invalid input cannot break the header.
    try {
      // BM: Parse URL semasa untuk perbandingan yang tidak ambigu.
      // EN: Parse the current URL for unambiguous comparisons.
      const page = new URL(location.href);
      // BM: Gunakan baseURI dokumen bagi menyelesaikan URL relatif seperti #contact.
      // EN: Use document.baseURI to resolve relative destinations such as #contact.
      const base = doc.baseURI || page.href;
      // BM: Semak setiap destinasi menu secara teratur dan pilih padanan pertama.
      // EN: Check destinations in order and select the first matching item.
      const match = items.findIndex(item => {
        // BM: Tukar href relatif atau mutlak kepada URL penuh sebelum dibandingkan.
        // EN: Resolve each relative or absolute href into a full URL before comparing.
        const target = new URL(item.href, base);
        // BM: Hanya anggap pautan HTTP atau HTTPS pada origin serta pathname yang sama sebagai navigasi halaman ini.
        // EN: Only consider HTTP(S) links with the same origin and pathname as navigation for this page.
        return (target.protocol === "https:" || target.protocol === "http:") &&
          target.origin === page.origin && target.pathname === page.pathname &&
          // BM: Periksa query dan hash juga supaya menu seksyen yang berlainan tidak tersalah aktif.
          // EN: Compare query and hash as well so distinct sections cannot receive the wrong highlight.
          target.search === page.search && target.hash === page.hash;
      });
      // BM: Pilih padanan tepat lebih dahulu sebelum mempertimbangkan default.
      // EN: Prefer an exact match before considering any default.
      if (match !== -1) return match;
      // BM: Gunakan fallback pada halaman tanpa hash; hash tidak dikenal pasti tidak boleh mengekalkan highlight yang lapuk.
      // EN: Use fallback only without a hash; an unknown hash must not keep a stale highlight.
      if (fallback !== -1 && !page.hash) {
        // BM: Selesaikan URL bagi item default untuk memastikan ia milik halaman yang sama.
        // EN: Resolve the fallback URL to check that it belongs to the current page.
        const target = new URL(items[fallback].href, base);
        // BM: Sahkan origin, pathname dan query sebelum mengaktifkan fallback.
        // EN: Validate origin, pathname and query before activating the fallback.
        if (target.origin === page.origin && target.pathname === page.pathname &&
            target.search === page.search) return fallback;
      }
      // BM: Kembalikan -1 apabila URL sah tetapi tiada item menu yang sepadan.
      // EN: Return -1 when the URL is valid yet no navigation item matches.
      return -1;
    // BM: Jika parsing URL gagal, gunakan fallback eksplisit tanpa meneka route.
    // EN: If URL parsing fails, rely on the explicit fallback rather than guessing a route.
    } catch {
    }
  }
  // BM: Pulangkan pilihan default apabila location tiada atau parsing gagal.
  // EN: Return the configured default if location is absent or parsing fails.
  return fallback;
}

/**
 * BM: Kontrak API awam mountZrainUI; semua parameter kekal serasi dengan versi asal.
 * EN: Public mountZrainUI API contract; all parameters remain backwards compatible.
 * BM: Objek konfigurasi aplikasi; tidak diwajibkan mengurus menu produk.
 * @param {object} config
 * BM: Nama produk yang tertera selepas label Zrain.
 * @param {string} config.product - Product name after "Zrain".
 * BM: URL logo rasmi yang berada bersama aplikasi.
 * @param {string} config.logoSrc - Local official Zrain logo URL.
 * BM: Pautan homepage produk sendiri; pilihan.
 * @param {string} [config.productHref] - Product home URL.
 * BM: Pautan utama ekosistem; pilihan.
 * @param {string} [config.homeHref] - Ecosystem home URL.
 * BM: Tagline footer sahaja; pilihan.
 * @param {string} [config.tagline] - Footer tagline only.
 * BM: Senarai menu terurus pilihan; abaikan untuk mengekalkan menu sedia ada.
 * @param {{label:string,href:string,current?:boolean,external?:boolean}[]} [config.navigation]
 *   Optional: omit to retain a product's existing, state-driven menu and auth controls.
 *   `current` is the landing-page fallback; URL path, query and hash take precedence.
 * BM: Senarai pautan footer pilihan.
 * @param {{label:string,href:string,external?:boolean}[]} [config.footerLinks]
 * BM: Objek document pilihan untuk testing dan simulasi DOM.
 * @param {Document} [config.document] - Optional test document.
 *
 * Changes only brand/footer identity and explicitly supplied navigation/footer links.
 * Returns refreshNavigation() for SPAs after history.pushState/replaceState.
 */
// BM: Pasang identiti header/footer dan menu pilihan tanpa mengurus authentication atau business logic produk.
// EN: Mount header/footer branding and optional menus without controlling product authentication or business logic.
export function mountZrainUI(config) {
  // BM: Wajibkan nama produk dan URL logo berupa string tidak kosong sebelum menyentuh DOM.
  // EN: Require nonempty product name and logo URL strings before touching the DOM.
  if (!config || typeof config.product !== "string" || !config.product.trim() ||
      typeof config.logoSrc !== "string" || !config.logoSrc.trim()) {
    // BM: Gagalkan konfigurasi tidak lengkap secara jelas dan awal.
    // EN: Fail incomplete configuration early and explicitly.
    throw new TypeError("Zrain UI requires product and logoSrc.");
  }
  // BM: Sokong dokumen yang dibekalkan untuk ujian; gunakan document browser secara lalai.
  // EN: Support an injected document for tests; otherwise use the browser document.
  const doc = config.document || document;
  // BM: Buang ruang tidak perlu daripada nama produk yang akan dipaparkan.
  // EN: Trim unnecessary whitespace from the displayed product name.
  const product = config.product.trim();
  // BM: Gunakan logo yang dibekalkan tanpa mengubah URL atau imejnya.
  // EN: Use the provided logo without rewriting its URL or image.
  const logoSrc = config.logoSrc;
  // BM: Gunakan URL utama rasmi kecuali aplikasi menetapkan pengganti.
  // EN: Use the official ecosystem URL unless the product supplies an override.
  const homeHref = config.homeHref || ZRAIN_HOME;
  // BM: Gunakan halaman semasa sebagai homepage produk jika URL khas tidak dibekalkan.
  // EN: Use a relative homepage when no specific product URL is supplied.
  const productHref = config.productHref || "./";
  // BM: Kekalkan tagline rasmi sebagai nilai asal untuk footer.
  // EN: Keep the official footer tagline as the default value.
  const tagline = config.tagline || ZRAIN_TAGLINE;
  // BM: Sediakan fungsi refresh kosong yang selamat untuk aplikasi tanpa menu terurus.
  // EN: Initialize a safe no-op refresh method for applications without managed navigation.
  let refreshNavigation = () => {};

  // BM: Cari bekas identiti header; jangan mengubah DOM jika bekas tiada.
  // EN: Locate the header identity container; do not modify the DOM if it is absent.
  const headerBrand = doc.querySelector(".zrain-header .zrain-brand");
  if (headerBrand) {
    // BM: Bina pautan yang membawa pengguna kepada laman utama Zrain.
    // EN: Create the link leading users to the Zrain ecosystem homepage.
    const home = link(doc, homeHref, "zrain-brand__home");
    // BM: Berikan label aksesibiliti jelas untuk pembaca skrin.
    // EN: Provide a clear accessibility label for screen readers.
    home.setAttribute("aria-label", "Zrain ecosystem home");
    // BM: Masukkan logo dan nama Zrain ke dalam pautan ekosistem yang sama.
    // EN: Place the logo and Zrain name together inside the ecosystem link.
    home.append(
      // BM: Gunakan logo berukuran 42px yang boleh digayakan melalui kelas rasmi.
      // EN: Use a 42px logo with the official styling classes.
      brandLogo(doc, logoSrc, "brand-logo-image zrain-brand__logo", 42),
      // BM: Paparkan perkataan Zrain sebagai teks sebenar, bukan sebahagian daripada imej.
      // EN: Render Zrain as real text rather than baking the brand name into an image.
      element(doc, "strong", "zrain-brand__name", "Zrain")
    );
    // BM: Cipta pautan homepage khusus produk di sebelah identiti Zrain.
    // EN: Create the product-specific homepage link beside the Zrain identity.
    const productLink = link(doc, productHref, "zrain-brand__product", product);
    // BM: Terangkan destinasi produk secara eksplisit kepada teknologi bantuan.
    // EN: Describe the product destination explicitly for assistive technology.
    productLink.setAttribute("aria-label", "Zrain " + product + " home");
    // BM: Gantikan hanya kandungan identiti header, bukan keseluruhan header aplikasi.
    // EN: Replace only the header identity content, not the application header itself.
    headerBrand.replaceChildren(home, productLink);
  }

  // BM: Cari bekas identiti footer yang telah disediakan aplikasi.
  // EN: Find the footer identity container supplied by the application.
  const footerBrand = doc.querySelector(".zrain-footer .zrain-footer__identity");
  if (footerBrand) {
    // BM: Pautkan identiti footer kepada ekosistem pusat.
    // EN: Link the footer identity to the main ecosystem.
    const home = link(doc, homeHref, "zrain-footer__home");
    // BM: Terangkan kredit pembangun dan destinasi pautan kepada pembaca skrin.
    // EN: Describe developer attribution and link destination for screen readers.
    home.setAttribute("aria-label", "Developed by Zrain. Open Zrain ecosystem home");
    // BM: Cipta bekas teks bagi nama developer dan tagline.
    // EN: Create the text wrapper for developer credit and tagline.
    const copy = element(doc, "span", "zrain-footer__copy");
    // BM: Tambahkan developer credit dan tagline dalam susunan yang ditetapkan.
    // EN: Append developer credit and tagline in the prescribed order.
    copy.append(
      // BM: Paparkan kredit rasmi yang tidak boleh diubah oleh produk pengguna.
      // EN: Display the official developer credit, which consumers should not alter.
      element(doc, "strong", null, "Developed by Zrain"),
      // BM: Paparkan tagline yang dipilih di footer sahaja.
      // EN: Display the configured tagline in the footer only.
      element(doc, "small", null, tagline)
    );
    // BM: Susun logo bersama kredit teks sebagai satu pautan footer.
    // EN: Group the logo and credit text into one footer link.
    home.append(
      // BM: Gunakan logo footer 38px agar sepadan dengan gaya rujukan.
      // EN: Use the 38px footer logo aligned with the reference style.
      brandLogo(doc, logoSrc, "brand-logo-image zrain-footer__logo", 38),
      copy
    );
    // BM: Gantikan kandungan identiti footer sahaja; kekalkan footer produk yang lain.
    // EN: Replace only the footer identity content; keep the rest of the product footer.
    footerBrand.replaceChildren(home);
  }

  // BM: Urus menu hanya apabila aplikasi menyatakan navigation secara eksplisit.
  // EN: Manage navigation only when the application explicitly supplies a navigation array.
  if (Array.isArray(config.navigation)) {
    // BM: Cari menu yang serasi tanpa mengganti menu pemilik aplikasi secara paksa.
    // EN: Find a compatible menu without forcibly replacing app-owned navigation.
    const nav = doc.querySelector(".zrain-header .topnav, .zrain-header .main-nav");
    if (nav) {
      // BM: Bersihkan listener terdahulu sebelum pemasangan berulang supaya tiada pendua.
      // EN: Remove previous listeners before remounting to avoid duplicates.
      navCleanups.get(nav)?.();
      // BM: Tandakan menu terurus supaya peraturan responsif hanya terpakai kepada menu ini.
      // EN: Mark managed navigation so responsive CSS applies only to this menu.
      nav.classList?.add("zrain-nav--managed");
      // BM: Tandakan header induk untuk membenarkan menu dua baris pada telefon.
      // EN: Mark the parent header to allow a two-row mobile layout.
      nav.closest?.(".zrain-header__inner")?.classList.add("zrain-header__inner--managed");
      // BM: Tukar item konfigurasi kepada elemen pautan yang boleh diakses.
      // EN: Convert configured entries into accessible link elements.
      const items = config.navigation.map(item => {
        // BM: Cipta teks dan destinasi pautan navigasi.
        // EN: Create navigation label text and its destination.
        const a = link(doc, item.href, "", item.label);
        // BM: Bezakan pautan luaran daripada navigasi dalam aplikasi.
        // EN: Distinguish external links from application-local navigation.
        if (item.external) {
          // BM: Buka pautan luaran pada tab baharu hanya apabila dinyatakan.
          // EN: Open explicitly marked external links in a new tab.
          a.target = "_blank";
          // BM: Halang tab baharu daripada mendapat akses window.opener untuk keselamatan.
          // EN: Prevent a new tab from accessing window.opener for safety.
          a.rel = "noopener noreferrer";
        }
        // BM: Pulangkan item pautan yang telah siap.
        // EN: Return the completed link item.
        return a;
      });
      // BM: Gantikan hanya item menu apabila aplikasi memilih menu terurus.
      // EN: Replace only menu items when the app opts into managed navigation.
      nav.replaceChildren(...items);
      // BM: Berikan kaedah refresh kepada aplikasi SPA yang mengubah route tanpa event browser.
      // EN: Expose a refresh method for SPAs that change routes without browser events.
      refreshNavigation = () => {
        // BM: Dapatkan indeks aktif berdasarkan URL terkini, bukan state klik lama.
        // EN: Calculate the active index from the latest URL, not stale click state.
        const selected = selectedNavigationIndex(config.navigation, doc);
        // BM: Segerakkan setiap item menu supaya hanya satu mempunyai status aktif.
        // EN: Synchronize every menu item so only one can be active.
        items.forEach((a, i) => {
          // BM: Toggle kelas current untuk visual highlight pada browser sebenar.
          // EN: Toggle the current class for visual highlighting in real browsers.
          a.classList?.toggle("current", i === selected);
          // BM: Sokong objek DOM ujian yang tiada classList.
          // EN: Support simple test doubles that do not implement classList.
          if (!a.classList) a.className = i === selected ? "current" : "";
          // BM: Tetapkan aria-current untuk membantu pengguna pembaca skrin mengenal pasti lokasi mereka.
          // EN: Set aria-current so screen-reader users know their current location.
          if (i === selected) a.setAttribute("aria-current", "page");
          // BM: Buang aria-current daripada item yang tidak lagi aktif.
          // EN: Remove aria-current from items that are no longer active.
          else a.removeAttribute?.("aria-current");
        });
      };
      // BM: Kemaskan status menu sebaik sahaja komponen dipasang.
      // EN: Synchronize the menu immediately after mounting.
      refreshNavigation();
      // BM: Akses window melalui dokumen untuk memasang pendengar route.
      // EN: Access the window through the document to register route listeners.
      const win = doc.defaultView;
      // BM: Jangan memasang pendengar apabila objek window tidak menyokongnya.
      // EN: Skip listeners when the window object does not support them.
      if (win?.addEventListener) {
        // BM: Pantau hash, history Back/Forward dan restore halaman secara bersama.
        // EN: Observe hash changes, Back/Forward history and page restore events.
        for (const event of ["hashchange", "popstate", "pageshow"]) {
          // BM: Daftarkan fungsi refresh yang sama untuk semua perubahan route yang disokong.
          // EN: Register the same refresh callback for every supported route event.
          win.addEventListener(event, refreshNavigation);
        }
        // BM: Rekod kaedah pembersihan pendengar supaya remount tidak menyebabkan kebocoran.
        // EN: Store listener cleanup logic to prevent leaks on subsequent mounts.
        navCleanups.set(nav, () => {
          for (const event of ["hashchange", "popstate", "pageshow"]) {
            // BM: Buang callback lama apabila menu dipasang semula.
            // EN: Remove old callbacks when the menu is remounted.
            win.removeEventListener(event, refreshNavigation);
          }
        });
      }
    }
  }
  // BM: Urus pautan footer hanya jika pengguna library membekalkan senarai pautan.
  // EN: Manage footer links only when the consuming app supplies a link list.
  if (Array.isArray(config.footerLinks)) {
    // BM: Cari ruang pautan footer tanpa mengganti keseluruhan footer.
    // EN: Find the footer links slot without replacing the whole footer.
    const footerLinks = doc.querySelector(".zrain-footer .zrain-footer__links");
    if (footerLinks) {
      // BM: Bina setiap pautan footer daripada label dan URL yang dibekalkan.
      // EN: Build each footer link from its configured label and URL.
      const items = config.footerLinks.map(item => {
        // BM: Cipta elemen anchor yang menggunakan teks selamat.
        // EN: Create an anchor element with safe text content.
        const a = link(doc, item.href, "", item.label);
        // BM: Buka tab baharu hanya bagi pautan footer yang ditanda external.
        // EN: Open a new tab only for footer links marked external.
        if (item.external) {
          // BM: Tetapkan target dengan jelas bagi pautan luaran.
          // EN: Set the target explicitly for an external link.
          a.target = "_blank";
          // BM: Lindungi tab asal dengan atribut rel yang selamat.
          // EN: Protect the original tab with safe rel attributes.
          a.rel = "noopener noreferrer";
        }
        // BM: Pulangkan pautan footer yang disediakan.
        // EN: Return the prepared footer link.
        return a;
      });
      // BM: Gantikan hanya pautan footer yang diurus oleh library.
      // EN: Replace only footer links controlled by the library.
      footerLinks.replaceChildren(...items);
    }
  }
  // BM: Pulangkan konfigurasi efektif dan fungsi refresh supaya SPA boleh menyegerakkan menu.
  // EN: Return effective configuration and refresh function so SPAs can synchronize their menus.
  return { product, homeHref, productHref, tagline, refreshNavigation };
}
