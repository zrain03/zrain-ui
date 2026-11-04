/**
 * Pembangun / Developer: Zrain
 * Dicipta / Created: 2026-11-04
 * Dikemas kini / Last updated: 2026-11-04
 * Fail / File: test/provenance.test.js
 * BM: Uji liputan metadata supaya setiap fail sumber baharu direkodkan secara konsisten.
 * EN: Test metadata coverage so every new source file is consistently registered.
 */

// BM: Gunakan API standard Node untuk mengelakkan dependency baharu.
// EN: Use standard Node APIs to avoid adding any new dependency.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

// BM: Cari root projek berdasarkan lokasi fail ujian, bukan direktori terminal.
// EN: Derive the project root from this test file, not the terminal working directory.
const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

/**
 * BM: Senaraikan semua fail sumber secara rekursif dan abaikan direktori yang dihasilkan oleh tools.
 * EN: Recursively list source files while skipping tool-generated directories.
 * @param {string} directory - Folder yang sedang disemak / Directory currently inspected.
 * @returns {Promise<string[]>} Senarai laluan relatif / List of relative paths.
 */
async function sourceFiles(directory) {
  // BM: Bacaan direktori dengan withFileTypes membezakan subfolder dan fail tanpa panggilan stat tambahan.
  // EN: withFileTypes distinguishes directories and files without extra stat calls.
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];

  // BM: Rekursi dibuat hanya pada folder yang memang menjadi sebahagian source projek.
  // EN: Recurse only into directories that are part of the actual project source.
  for (const entry of entries) {
    if (entry.isDirectory()) {
      // BM: Abaikan .git serta dependency/build/cache kerana ia bukan fail source projek.
      // EN: Skip .git and dependency/build/cache directories because they are not project source.
      if (['.git', 'node_modules', 'coverage', 'dist', 'build'].includes(entry.name)) continue;
      results.push(...await sourceFiles(join(directory, entry.name)));
    } else if (entry.isFile()) {
      // BM: Gunakan pemisah path seragam agar ujian berfungsi pada Windows dan Linux.
      // EN: Normalize path separators so tests behave the same on Windows and Linux.
      results.push(relative(projectRoot, join(directory, entry.name)).split('\\').join('/'));
    }
  }

  // BM: Susun keputusan untuk perbandingan deterministic pada CI.
  // EN: Sort results for deterministic comparisons in CI.
  return results.sort();
}

// BM: Takrif format ISO supaya kedua-dua tarikh dapat diperiksa secara automatik.
// EN: Define the ISO date pattern so both metadata dates can be validated automatically.
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

/**
 * BM: Pastikan manifest merangkumi setiap fail tanpa terkecuali, termasuk fail manifest itu sendiri.
 * EN: Ensure the manifest covers every file without exception, including the manifest itself.
 */
test('provenance inventory covers every shipped source file', async () => {
  // BM: Baca manifest sebagai JSON strict; tiada komen disisipkan ke dalam JSON.
  // EN: Read the manifest as strict JSON; no comments are inserted into JSON.
  const registry = JSON.parse(await readFile(join(projectRoot, 'FILE_PROVENANCE.json'), 'utf8'));

  // BM: Pembangun rasmi mesti Zrain dan tidak boleh terpadam oleh perubahan lain.
  // EN: The official developer must remain Zrain after future changes.
  assert.equal(registry.developer, 'Zrain');

  // BM: Pastikan senarai fail berpadanan tepat dengan sumber di atas disk.
  // EN: Require the recorded file list to match the on-disk source exactly.
  assert.deepEqual(registry.files.map(item => item.path).sort(), await sourceFiles(projectRoot));

  // BM: Setiap fail mesti mempunyai developer dan dua tarikh dalam format yang konsisten.
  // EN: Each file must have developer attribution and two consistently formatted dates.
  for (const file of registry.files) {
    assert.equal(file.developer, 'Zrain', file.path);
    assert.match(file.created, isoDate, `${file.path} created`);
    assert.match(file.updated, isoDate, `${file.path} updated`);
    assert.ok(file.purposeMs && file.purposeEn, `${file.path} bilingual purpose`);
  }
});

/**
 * BM: Semak header setiap fail teks yang menyokong komen, kecuali JSON dan binary.
 * EN: Check headers on every commentable text file, excluding JSON and binary assets.
 */
test('commentable source files have Zrain bilingual dated headers', async () => {
  // BM: Baca senarai yang sama untuk mengelakkan senarai fail manual berasingan.
  // EN: Reuse the same inventory instead of keeping a second manual file list.
  const registry = JSON.parse(await readFile(join(projectRoot, 'FILE_PROVENANCE.json'), 'utf8'));

  // BM: TXT tidak mempunyai sintaks komen formal tetapi metadata teks masih boleh dibaca.
  // EN: TXT has no formal comment syntax but can still contain readable text metadata.
  const commentable = new Set(['.js', '.css', '.html', '.ps1', '.md', '.txt', '.gitignore']);

  // BM: Semak kandungan header, bukan sekadar kewujudan rekod dalam manifest.
  // EN: Inspect the actual file header, not just its entry in the manifest.
  for (const file of registry.files) {
    const extension = file.path === '.gitignore' ? '.gitignore' : extname(file.path);
    if (!commentable.has(extension)) continue;

    // BM: Hadkan pemeriksaan kepada bahagian atas fail, tempat metadata sepatutnya disimpan.
    // EN: Restrict the check to the top of each file where metadata should reside.
    const content = await readFile(join(projectRoot, file.path), 'utf8');
    const header = content.slice(0, 1100);

    // BM: Semak pembangun, tarikh dan kedua-dua bahasa secara berasingan.
    // EN: Check developer, dates and both languages independently.
    assert.match(header, /Developer:\s*Zrain/, `${file.path} developer`);
    assert.ok(header.includes(file.created), `${file.path} created`);
    assert.ok(header.includes(file.updated), `${file.path} updated`);
    assert.match(header, /BM:/, `${file.path} Malay explanation`);
    assert.match(header, /EN:/, `${file.path} English explanation`);
  }
});
