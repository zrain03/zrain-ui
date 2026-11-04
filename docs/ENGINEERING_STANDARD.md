<!--
Pembangun / Developer: Zrain
Dicipta / Created: 2026-11-04
Dikemas kini / Last updated: 2026-11-04
Fail / File: docs/ENGINEERING_STANDARD.md
BM: Panduan contoh untuk penstrukturan dan dokumentasi semua projek Zrain yang sesuai secara teknologi.
EN: Reference for technology-appropriate structure and documentation across Zrain projects.
-->

# Zrain Adaptive Project Structure and Bilingual Code Documentation

**BM:** Standard ini ialah panduan engineering Zrain untuk projek seterusnya. Ia menetapkan tanggungjawab setiap folder dan cara menerangkan kod, bukan memaksa semua projek menyalin tree yang sama. Ia masih tertakluk kepada pengesahan setiap perubahan projek sebenar.

**EN:** This is Zrain's engineering reference for future projects. It defines folder responsibilities and code explanation practices rather than forcing identical trees. Changes to actual consumer repositories still require verification.

## Folder ownership / Tanggungjawab folder

| Folder | Tanggungjawab (BM) | Responsibility (EN) |
|---|---|---|
| `src/` | Implementasi library atau app, apabila sesuai dengan stack | Library/app implementation where the stack expects it |
| `assets/` | Aset sumber rasmi yang perlu disimpan bersama projek | Official source assets distributed with the project |
| `examples/` | Contoh integrasi yang boleh dicuba tanpa dependency produk lain | Integration demos runnable independently of consumers |
| `test/` | Ujian regresi Node native (nama asal projek dikekalkan) | Native Node regression tests (original project convention preserved) |
| `scripts/` | Automasi yang benar-benar digunakan, bukan arahan manual tidak berkaitan | Actual automation scripts, not unrelated manual notes |
| `docs/` | Panduan khusus yang tidak sesuai dimasukkan semua dalam README | Dedicated guides too detailed for the main README |

**BM:** Hanya cipta folder apabila ada kandungan atau kegunaan sebenar. Dalam Java/Spring Boot, ikut struktur Maven/Gradle; dalam Flutter, ikut `lib/`, `test/` dan direktori platform; dalam static website kecil, lebih sedikit folder mungkin lebih mudah. Simpan API, frontend, backend dan migrasi database di tempat yang sesuai dengan seni bina produk, bukan membina layer kosong.

**EN:** Create directories only when they have real content or purpose. For Java/Spring Boot, follow Maven/Gradle layouts; for Flutter, follow `lib/`, `test/` and platform directories; for a small static site, fewer folders may be clearer. Keep APIs, frontend, backend and database migrations where product architecture demands them rather than introducing empty layers.

## File header / Metadata setiap fail

**BM:** Setiap fail sumber yang menyokong komen mesti mempunyai enam maklumat pada header: developer, created date, last updated date, path, tujuan BM dan tujuan EN. Tarikh perlu dinyatakan sebagai ISO `YYYY-MM-DD`. Jangan reka tarikh penciptaan; guna Git evidence atau tanda `unknown` apabila tiada bukti.

**EN:** Every commentable source file must have six header fields: developer, created date, last updated date, path, Malay purpose and English purpose. Dates use ISO `YYYY-MM-DD`. Never invent a creation date; use Git evidence or mark `unknown` if unverified.

```javascript
/**
 * Pembangun / Developer: Zrain
 * Dicipta / Created: 2026-11-04
 * Dikemas kini / Last updated: 2026-11-04
 * Fail / File: src/example.js
 * BM: Contoh format komen dan metadata bagi fail JavaScript.
 * EN: Example of comments and metadata for JavaScript files.
 */

/**
 * BM: Semak input sebelum mengembalikan hasil; fungsi ini tidak mengubah state luar.
 * EN: Validate the input before returning a result; this function has no external side effects.
 * @param {string} value - Input yang hendak dipaparkan / Value to display.
 * @returns {string} Input yang telah dibuang ruang / Trimmed input.
 */
function cleanLabel(value) {
  // BM: Tolak input bukan string supaya error berlaku awal dan jelas.
  // EN: Reject non-string input for an early, predictable error.
  if (typeof value !== 'string') throw new TypeError('Expected string');

  // BM: Pulangkan string tanpa ruang tambahan pada awal atau akhir.
  // EN: Return the string without leading or trailing spaces.
  return value.trim();
}
```

## Meaningful bilingual comments / Komen bermakna dwibahasa

**BM:** Gunakan urutan BM atas, EN bawah pada setiap fungsi, kumpulan logik, keputusan bersyarat dan operasi yang perlu difahami. Dalam core file Zrain UI, setiap baris operasi penting diterangkan secara langsung. Komen pada penutup `{}` yang hanya mengulangi tatabahasa bahasa pengaturcaraan tidak membantu dan tidak diwajibkan. Terangkan sebab `fallback` digunakan dan mengapa URL diuji, bukan sekadar "buat if".

**EN:** Use Malay above English for every function, logical group, conditional decision and operation requiring understanding. In Zrain UI core files, every meaningful operation is documented directly. Comments on closing `{}` braces that merely repeat language syntax add no value and are not required. Explain why a fallback is selected and why a URL is checked, rather than merely saying "do an if".

**BM:** Komen boleh lebih panjang daripada production code. Kekalkan kod yang berjalan ringkas dan mudah diuji. Apabila implementasi berubah, ubah komen bersama pada commit yang sama. Komen yang salah lebih berbahaya daripada komen yang tiada.

**EN:** Comments may be much longer than production code. Keep executable code concise and testable. Update comments in the same commit as behavior changes. An incorrect comment is more harmful than no comment.

## Non-commentable files / Fail tanpa sokongan komen

**BM:** JSON standard tidak menerima komen; WebP ialah fail binary. Simpan metadata dalam format rasmi yang diterima atau dalam `FILE_PROVENANCE.json`. Jangan ubah format, tambah `.jsonc` tanpa sebab, atau menyunting byte imej hanya untuk memasukkan komen.

**EN:** Strict JSON cannot contain comments; WebP is binary. Use supported native metadata fields or the `FILE_PROVENANCE.json` registry. Do not break file formats, silently switch to `.jsonc`, or mutate image bytes solely to inject documentation.

## Change policy / Polisi perubahan

**BM:** Baca dan audit sebelum mengubah, lindungi public API, jangan sentuh authentication produk, jangan tambah dependencies hanya kerana standard kelihatan canggih, jalankan tests dan bezakan status `Verified`, `Partially Verified` serta `Not Verified`. `Created` tidak berubah apabila fungsi dikemaskini; `Last updated` berubah hanya apabila kandungan fail itu berubah.

**EN:** Read and audit before changing, protect public APIs, do not touch product authentication, avoid dependencies added for appearances, run tests and distinguish `Verified`, `Partially Verified` and `Not Verified`. `Created` does not change on refactoring; `Last updated` changes only when that file's content changes.
