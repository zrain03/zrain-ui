/**
 * Pembangun / Developer: Zrain
 * Dicipta / Created (rekod Git terawal): 2026-10-27
 * Dikemas kini / Last updated: 2026-11-04
 * Fail / File: test/ui.test.js
 * BM: Pengujian regresi untuk identiti rasmi, route aktif dan pemasangan berulang.
 * EN: Regression tests for official branding, active routes and repeated mounting.
 */

// BM: Gunakan ujian native Node.js tanpa dependency tambahan.
// EN: Use the native Node.js test runner with no additional dependency.
import test from 'node:test';
// BM: Gunakan assertion strict supaya kegagalan jelas.
// EN: Use strict assertions so failures are unambiguous.
import assert from 'node:assert/strict';
// BM: Baca sumber CSS sebenar untuk mengunci gaya Discover tanpa dependency parsing CSS.
// EN: Read the real CSS source to lock Discover styling without a CSS parsing dependency.
import {readFileSync} from 'node:fs';
// BM: Uji API awam dan nilai jenama terus daripada modul sebenar.
// EN: Test the public API and brand constants directly from the real module.
import {mountZrainUI,ZRAIN_HOME,ZRAIN_TAGLINE} from '../src/zrain-ui.js';
// BM: Pastikan tagline rasmi tidak berubah walaupun CSS atau produk berkembang.
// EN: Guard the official tagline against accidental changes.
test('official Zrain tagline stays exact',()=>{assert.equal(ZRAIN_TAGLINE,'Made for people. Built with purpose.')});
// BM: Sediakan DOM palsu ringkas agar ujian boleh dijalankan tanpa browser.
// EN: Provide a lightweight DOM test double so tests run without a browser.
function node(tag){return {tag,children:[],attributes:{},setAttribute(k,v){this.attributes[k]=v},append(...n){this.children.push(...n)},replaceChildren(...n){this.children=n}}}
// BM: Sahkan logo/nama header, identiti produk dan kredit footer tanpa mengganti menu produk.
// EN: Verify header branding, product identity and footer credit without replacing app-owned menus.
test('main brand navigation and footer stay consistent',()=>{
 // BM: Bina bekas DOM ujian dan letakkan pautan yang perlu kekal tidak disentuh.
 // EN: Build DOM test containers and insert a link that must remain untouched.
 const header=node('div'),footer=node('div'),nav=node('nav'); nav.append(node('a'));
 // BM: Simulasikan querySelector untuk lokasi mount yang disokong.
 // EN: Simulate querySelector for the supported mount points.
 const doc={createElement:node,querySelector(s){if(s==='.zrain-header .zrain-brand')return header;if(s==='.zrain-footer .zrain-footer__identity')return footer;if(s.includes('.main-nav'))return nav;return null}};
 // BM: Pasang UI dan periksa nilai pulangan serta perubahan DOM.
 // EN: Mount the UI and inspect its return value and DOM changes.
 const result=mountZrainUI({product:'Monitor',logoSrc:'/zrain-logo.webp',productHref:'/monitor',document:doc});
 // BM: Logo utama mesti membawa pengguna ke ekosistem pusat.
 // EN: The primary brand link must lead to the main ecosystem.
 assert.equal(header.children[0].href,ZRAIN_HOME);
 // BM: Nama jenama yang boleh dibaca mesti Zrain.
 // EN: The readable brand label must be Zrain.
 assert.equal(header.children[0].children[1].textContent,'Zrain');
 // BM: Tiada tagline tambahan dibenarkan dalam header.
 // EN: No additional tagline may appear in the header.
 assert.equal(header.children[0].children.length,2,'Header contains logo and name only');
 // BM: Nama produk yang dipasang mestilah tepat.
 // EN: The mounted product name must match configuration.
 assert.equal(header.children[1].textContent,'Monitor');
 // BM: Nama produk mesti menuju homepage khusus produk.
 // EN: Product label must link to the product’s own homepage.
 assert.equal(header.children[1].href,'/monitor');
 // BM: Logo footer mesti menuju ke laman utama Zrain.
 // EN: Footer logo must link to the Zrain homepage.
 assert.equal(footer.children[0].href,ZRAIN_HOME);
 // BM: Footer mesti menunjukkan kredit rasmi pembangun.
 // EN: Footer must display the official developer credit.
 assert.equal(footer.children[0].children[1].children[0].textContent,'Developed by Zrain');
 // BM: Footer mesti menggunakan tagline rasmi.
 // EN: Footer must use the official tagline.
 assert.equal(footer.children[0].children[1].children[1].textContent,ZRAIN_TAGLINE);
 // BM: Pautan navigasi produk kekal kerana menu terurus tidak diminta.
 // EN: The product menu remains untouched because managed navigation was not requested.
 assert.equal(nav.children.length,1);
 // BM: API memulangkan URL ekosistem rasmi.
 // EN: The API returns the official ecosystem URL.
 assert.equal(result.homeHref,ZRAIN_HOME);
});
// BM: Sahkan pilihan navigation dan footerLinks menghasilkan pautan DOM yang dijangka.
// EN: Verify optional navigation and footerLinks produce the expected DOM links.
test('optional navigation renders for a new project',()=>{
 // BM: Bina bekas bagi header/footer/menu terurus.
 // EN: Create containers for a managed header/footer/menu.
 const header=node('div'),footer=node('div'),nav=node('nav'),footerLinks=node('div');
 // BM: Sediakan pemetaan selector bagi semua bekas yang relevan.
 // EN: Provide selector mappings for all relevant containers.
 const doc={createElement:node,querySelector(s){if(s==='.zrain-header .zrain-brand')return header;if(s==='.zrain-footer .zrain-footer__identity')return footer;if(s.includes('.main-nav'))return nav;if(s.includes('.zrain-footer__links'))return footerLinks;return null}};
 // BM: Pasang menu konfigurasi dengan pilihan aktif dan pautan Contact.
 // EN: Mount configured navigation with a current item and Contact link.
 mountZrainUI({product:'Ecosystem',logoSrc:'/zrain-logo.webp',document:doc,navigation:[{label:'Products',href:'#products',current:true}],footerLinks:[{label:'Contact',href:'mailto:zrain.dev@gmail.com'}]});
 // BM: Pastikan label menu dipaparkan tepat.
 // EN: Verify menu labels are rendered exactly.
 assert.equal(nav.children[0].textContent,'Products');
 // BM: Pastikan active menu juga boleh dikenali pembaca skrin.
 // EN: Verify assistive technology can identify the active item.
 assert.equal(nav.children[0].attributes['aria-current'],'page');
 // BM: Pastikan pautan footer mengekalkan URL yang dibekalkan.
 // EN: Verify the footer link preserves its configured URL.
 assert.equal(footerLinks.children[0].href,'mailto:zrain.dev@gmail.com');
});
// BM: Input tidak lengkap mesti menghasilkan TypeError yang mudah difahami.
// EN: Incomplete configuration must raise a predictable TypeError.
test('reject missing required configuration',()=>{assert.throws(()=>mountZrainUI({product:'Monitor'}),TypeError)});

// BM: Sediakan dokumen ujian berkeadaan yang menyokong perubahan URL dan event browser.
// EN: Provide a stateful test document supporting URL changes and browser events.
function routeDocument(startUrl) {
  // BM: Simpan callback mengikut nama event supaya kebocoran listener boleh diperiksa.
  // EN: Track callbacks by event name so listener leaks can be checked.
  const listeners = new Map();
  // BM: Bina elemen utama untuk pemeriksaan selepas mount.
  // EN: Create the key elements for inspecting mount results.
  const header = node('div'), footer = node('div'), nav = node('nav');
  const win = {
    location: { href: startUrl },
    // BM: Simulasikan pemasangan pendengar route browser.
    // EN: Simulate registering browser route listeners.
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    // BM: Simulasikan pembuangan callback yang telah didaftarkan.
    // EN: Simulate removing a previously registered callback.
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
    // BM: Cetuskan event ujian secara manual tanpa browser sebenar.
    // EN: Dispatch test events manually without a real browser.
    dispatch(name) { for (const callback of listeners.get(name) || []) callback(); }
  };
  // BM: Bina dokumen palsu yang mempunyai baseURI serta window berkeadaan.
  // EN: Create a fake document with baseURI and stateful window.
  const doc = {
    baseURI: startUrl,
    defaultView: win,
    // BM: Sediakan penciptaan elemen dengan sokongan removeAttribute.
    // EN: Provide element creation supporting removeAttribute.
    createElement(tag) {
      const el = node(tag);
      // BM: Pastikan pembantu ujian boleh menghapus aria-current apabila halaman berubah.
      // EN: Ensure test helpers can remove aria-current after navigation.
      el.removeAttribute = name => { delete el.attributes[name]; };
      return el;
    },
    // BM: Sediakan lookup untuk bekas UI yang dijangka oleh library.
    // EN: Provide lookups for the expected library mount points.
    querySelector(selector) {
      if (selector === '.zrain-header .zrain-brand') return header;
      if (selector === '.zrain-footer .zrain-footer__identity') return footer;
      if (selector.includes('.main-nav')) return nav;
      return null;
    }
  };
  // BM: Pulangkan semua state ujian untuk assertion selepas event.
  // EN: Return all test state for assertions after events.
  return { doc, win, header, footer, nav, listeners };
}

// BM: Uji penanda aktif ketika hash berubah dan tiada padanan.
// EN: Test active indicators when hashes change and have no match.
test('active navigation updates on hashchange and clears stale labels', () => {
  // BM: Mulakan pada homepage supaya default dapat diuji.
  // EN: Start at the homepage to test the default selection.
  const { doc, win, nav } = routeDocument('https://example.com/');
  // BM: Sediakan beberapa tab termasuk pautan luaran yang tidak boleh aktif untuk route setempat.
  // EN: Configure multiple tabs including an external link that must not match local routes.
  mountZrainUI({product:'Ecosystem',logoSrc:'/zrain.webp',document:doc,navigation:[
    {label:'Discover',href:'#discover',current:true},
    {label:'Contact',href:'#contact'},
    {label:'GitHub',href:'https://github.com/zrain03',external:true}
  ]});
  // BM: Tab default pada homepage mesti ditandakan aktif.
  // EN: The default tab must be active on the homepage.
  assert.equal(nav.children[0].attributes['aria-current'],'page');
  // BM: Pautan luaran mesti dibuka di tab baharu.
  // EN: External links must open in a new tab.
  assert.equal(nav.children[2].target,'_blank');
  // BM: Pautan luaran mesti menggunakan rel yang selamat.
  // EN: External links must use safe rel attributes.
  assert.equal(nav.children[2].rel,'noopener noreferrer');
  // BM: Simulasikan navigasi pengguna ke seksyen Contact.
  // EN: Simulate navigation to the Contact section.
  win.location.href = 'https://example.com/#contact';
  // BM: Hashchange mesti menyegerakkan active state tanpa refresh halaman.
  // EN: Hashchange must synchronize active state without reloading.
  win.dispatch('hashchange');
  // BM: Buang active state daripada tab lama.
  // EN: Clear active state from the previous tab.
  assert.equal(nav.children[0].attributes['aria-current'],undefined);
  // BM: Buang class visual daripada tab lama.
  // EN: Clear the visual class from the previous tab.
  assert.equal(nav.children[0].className,'');
  // BM: Aktifkan tab Contact secara tepat.
  // EN: Activate the Contact tab exactly.
  assert.equal(nav.children[1].attributes['aria-current'],'page');
  // BM: Simulasikan hash yang tidak disenaraikan.
  // EN: Simulate an unlisted hash.
  win.location.href = 'https://example.com/#unlisted';
  // BM: Pastikan event baru diproses.
  // EN: Ensure the new event is processed.
  win.dispatch('hashchange');
  // BM: Jangan kekalkan aria-current yang lapuk.
  // EN: Never keep a stale aria-current attribute.
  assert.equal(nav.children[1].attributes['aria-current'],undefined);
  // BM: Tiada tab aktif apabila tiada hash yang sepadan.
  // EN: No tabs are active for an unmatched hash.
  assert.equal(nav.children.every(a => !a.className),true);
  // BM: Kembalikan URL kepada seksyen Discover.
  // EN: Restore the URL to the Discover section.
  win.location.href = 'https://example.com/#discover';
  // BM: Simulasikan browser Back/Forward menggunakan popstate.
  // EN: Simulate browser Back/Forward using popstate.
  win.dispatch('popstate');
  // BM: Pastikan active indicator pulih selepas history berubah.
  // EN: Ensure the active indicator recovers after history changes.
  assert.equal(nav.children[0].attributes['aria-current'],'page');
});

// BM: Uji perbandingan tepat origin, pathname dan query terhadap item default.
// EN: Test strict origin, pathname and query comparison against default items.
test('route selection respects pathname and query rather than a stale default', () => {
  // BM: Gunakan halaman Reports dengan parameter query.
  // EN: Use a Reports page with a query parameter.
  const { doc, win, nav } = routeDocument('https://example.com/app/?view=reports');
  // BM: Bina tab Home, Reports dan aplikasi luaran.
  // EN: Build Home, Reports and external app tabs.
  const ui = mountZrainUI({product:'Links',logoSrc:'/zrain.webp',document:doc,navigation:[
    {label:'Home',href:'/app/',current:true},
    {label:'Reports',href:'/app/?view=reports'},
    {label:'Other app',href:'https://other.example/app/?view=reports'}
  ]});
  // BM: Reports mesti menang berbanding default Home apabila query sepadan.
  // EN: Reports must win over the default Home when the query matches.
  assert.equal(nav.children[1].attributes['aria-current'],'page');
  // BM: Simulasikan perubahan route tanpa event browser automatik.
  // EN: Simulate a route change without automatic browser events.
  win.location.href = 'https://example.com/app/';
  // BM: SPA perlu memanggil refreshNavigation selepas pushState/replaceState.
  // EN: SPAs must call refreshNavigation after pushState/replaceState.
  ui.refreshNavigation();
  // BM: Home mesti kembali aktif selepas refresh.
  // EN: Home must become active after the refresh.
  assert.equal(nav.children[0].attributes['aria-current'],'page');
  // BM: Reports mesti dinyahaktifkan apabila bukan lagi route semasa.
  // EN: Reports must be inactive once it is no longer the current route.
  assert.equal(nav.children[1].attributes['aria-current'],undefined);
  // BM: Simulasikan URL yang tidak dikenali.
  // EN: Simulate an unknown URL.
  win.location.href = 'https://example.com/unknown';
  // BM: Gunakan popstate untuk memaklumkan perubahan route.
  // EN: Dispatch popstate to announce the route change.
  win.dispatch('popstate');
  // BM: Tiada tab patut aktif untuk pathname yang tidak sepadan.
  // EN: No tab should remain active for an unmatched pathname.
  assert.equal(nav.children.every(a => a.attributes['aria-current'] === undefined),true);
});

// BM: Pastikan pemasangan berulang tidak menambah listener pendua.
// EN: Ensure remounting does not accumulate duplicate listeners.
test('remounting navigation does not accumulate global route listeners', () => {
  // BM: Sediakan state pendengar dan DOM sebelum dua kali mount.
  // EN: Prepare listener and DOM state before mounting twice.
  const { doc, listeners, nav } = routeDocument('https://example.com/');
  // BM: Gunakan konfigurasi yang sama untuk menguji remount idempotent.
  // EN: Reuse the same configuration to test idempotent remounting.
  const config = {product:'Monitor',logoSrc:'/zrain.webp',document:doc,navigation:[{label:'Home',href:'/',current:true}]};
  // BM: Pasang komponen kali pertama.
  // EN: Mount the component for the first time.
  mountZrainUI(config);
  // BM: Pasang semula tanpa memadam dokumen yang sama.
  // EN: Remount against the same document.
  mountZrainUI(config);
  // BM: Semak tiga jenis event route yang ditangani oleh library.
  // EN: Check the three supported route event types.
  for (const name of ['hashchange','popstate','pageshow']) {
    // BM: Hanya satu callback bagi setiap jenis event boleh kekal.
    // EN: Only one callback per event type may remain.
    assert.equal(listeners.get(name)?.size,1,name);
  }
  // BM: Jangan gandakan pautan DOM semasa pemasangan berulang.
  // EN: Do not duplicate DOM links across repeated mounts.
  assert.equal(nav.children.length,1);
});

// BM: Pastikan Zrain UI menggunakan nilai asal Discover, bukan variasi Quickstart yang besar.
// EN: Ensure Zrain UI uses the original Discover values, not the oversized Quickstart variant.
test('shared active navigation matches Zrain Ecosystem Discover Golden Reference', () => {
  // BM: Baca CSS sebenar dan buang komen sebelum menyemak deklarasi komponen.
  // EN: Read the actual CSS and strip comments before verifying component declarations.
  const css = readFileSync(new URL('../src/brand.css', import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  // BM: Semak kedua-dua bentuk menu termasuk aria-current=location bagi seksyen yang discroll.
  // EN: Check both nav forms including aria-current=location for scroll-driven sections.
  for (const nav of ['topnav', 'main-nav']) {
    // BM: Class .current dan aria-current mesti berkongsi selector rasmi yang sama.
    // EN: The .current class and aria-current must share the same official selector.
    assert.ok(css.includes(`.zrain-header .${nav} a:is(.current, .active, [aria-current="page"], [aria-current="location"])`));
  }
  // BM: Pastikan CSS aktif mempunyai tepat warna, berat, padding, radius dan jalur bawah Discover.
  // EN: Require Discover's exact color, weight, padding, radius and bottom indicator.
  const active = css.match(/\.zrain-header \.main-nav a:is\([^)]*\)\s*\{([^}]*)\}/)?.[1];
  assert.ok(active, 'active navigation rule exists');
  for (const declaration of [
    'color: #a64930;', 'font-weight: 850;', 'background: #fff1e9;',
    'border-radius: 9px;', 'padding: 8px 10px;',
    'box-shadow: inset 0 -2px 0 #b95136;',
    'transition: background .22s ease, color .22s ease, box-shadow .22s ease;'
  ]) assert.ok(active.includes(declaration), `Golden Reference: ${declaration}`);
  // BM: Tiada ketinggian minimum besar untuk menu lama yang mencipta kotak Quickstart.
  // EN: Avoid the old oversized minimum height that caused the Quickstart box.
  assert.match(css, /\.zrain-header \.main-nav a\s*\{[^}]*min-height:\s*0;[^}]*border:\s*0;/);
});

/**
 * BM: Bina browser palsu yang boleh menguji kedudukan seksyen, klik dan lifecycle scrollSpy.
 * EN: Build a fake browser capable of testing section positions, clicks and scrollSpy lifecycle.
 */
function sectionDocument() {
  // BM: Simpan semua listener dan frame untuk memastikan event tidak berganda.
  // EN: Track all listeners and frames to ensure events never accumulate.
  const listeners = new Map(), frames = new Map();
  let nextFrame = 1;
  function makeNode(tag) {
    const result = node(tag);
    const names = new Set();
    const events = new Map();
    result.classList = {
      add: name => names.add(name),
      remove: name => names.delete(name),
      contains: name => names.has(name),
      toggle: (name, enabled) => enabled ? names.add(name) : names.delete(name)
    };
    result.addEventListener = (name, callback) => {
      if (!events.has(name)) events.set(name, new Set());
      events.get(name).add(callback);
    };
    result.removeEventListener = (name, callback) => events.get(name)?.delete(callback);
    result.dispatch = (name, details = {}) => {
      for (const callback of events.get(name) || []) callback({defaultPrevented:false,button:0,...details});
    };
    result.removeAttribute = name => { delete result.attributes[name]; };
    result.closest = () => null;
    result.listenerCount = name => events.get(name)?.size || 0;
    return result;
  }
  // BM: Susun seksyen pada koordinat mutlak supaya posisi viewport berubah apabila scrollY berubah.
  // EN: Place sections at absolute coordinates so viewport geometry changes with scrollY.
  const positions = {discover:500,contact:1200,community:1900,categories:2600};
  const sections = Object.fromEntries(Object.entries(positions).map(([id,top]) => {
    const element = makeNode('section');
    element.getBoundingClientRect = () => ({top:top - win.scrollY,bottom:top + 650 - win.scrollY});
    return [id,element];
  }));
  const header = makeNode('header'), nav = makeNode('nav'), root = makeNode('html');
  header.getBoundingClientRect = () => ({top:0,bottom:76,height:76});
  root.scrollHeight = 3600;
  const css = new Map();
  root.style = {
    setProperty(name,value) { css.set(name,value); },
    getPropertyValue(name) { return css.get(name) || ''; },
    removeProperty(name) { css.delete(name); }
  };
  // BM: Simulasi requestAnimationFrame membolehkan ujian memaksa satu frame demi satu.
  // EN: A controllable requestAnimationFrame allows tests to advance one frame at a time.
  const win = {
    location:{href:'https://zrain.example/'},scrollY:0,innerHeight:760,
    requestAnimationFrame(callback) { const id=nextFrame++; frames.set(id,callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    addEventListener(name,callback) {
      if (!listeners.has(name)) listeners.set(name,new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener(name,callback) { listeners.get(name)?.delete(callback); },
    dispatch(name,details={}) {for(const callback of listeners.get(name)||[])callback(details);},
    flush() {for(const [id,cb] of [...frames]){frames.delete(id);cb();}}
  };
  const doc = {
    defaultView:win,baseURI:win.location.href,documentElement:root,
    createElement:makeNode,getElementById:id=>sections[id]||null,
    querySelector(selector) {
      if(selector === '.zrain-header')return header;
      if(selector.includes('.main-nav'))return nav;
      return null;
    }
  };
  return {doc,win,nav,root,sections,listeners,frames};
}

// BM: Bezakan klik serta-merta daripada scroll manual tanpa menukar pautan luaran.
// EN: Verify immediate click selection and manual scrolling without altering external links.
test('scrollSpy updates instantly on click and tracks scroll without intermediate highlight', () => {
  const {doc,win,nav,root} = sectionDocument();
  mountZrainUI({product:'Ecosystem',logoSrc:'/logo.webp',document:doc,scrollSpy:true,navigation:[
    {label:'Discover',href:'#discover',current:true},
    {label:'Contact',href:'#contact'},
    {label:'Community',href:'#community'},
    {label:'GitHub',href:'https://github.com/zrain03',external:true},
    {label:'Categories',href:'#categories'}
  ]});
  win.flush();
  assert.equal(nav.children[0].attributes['aria-current'],'location');
  assert.equal(root.classList.contains('zrain-scrollspy--smooth'),true);
  assert.equal(root.style.getPropertyValue('--zrain-scrollspy-offset'),'88px');
  // BM: Klik Community tanpa scroll dahulu mesti segera menandakan Community.
  // EN: Clicking Community must select it immediately, before any scrolling occurs.
  nav.children[2].dispatch('click');
  assert.equal(nav.children[2].attributes['aria-current'],'location');
  assert.equal(nav.children[0].attributes['aria-current'],undefined);
  // BM: Semasa scroll animasi melewati Contact, Community kekal sebagai destinasi klik.
  // EN: During smooth travel past Contact, Community remains the clicked destination.
  win.scrollY=1000;
  win.dispatch('scroll');win.flush();
  assert.equal(nav.children[2].attributes['aria-current'],'location');
  // BM: Lepaskan kunci setelah destinasi sejajar dengan header sticky.
  // EN: Release the click lock when the destination aligns with the sticky header.
  win.scrollY=1900-88;
  win.dispatch('scroll');win.flush();
  assert.equal(nav.children[2].attributes['aria-current'],'location');
  // BM: Scroll manual naik ke Contact terus memilih Contact walaupun URL hash lama tidak berubah.
  // EN: Manual scroll back to Contact selects Contact even if the URL hash remains unchanged.
  win.dispatch('wheel');
  win.scrollY=1200-260;
  win.dispatch('scroll');win.flush();
  assert.equal(nav.children[1].attributes['aria-current'],'location');
  assert.equal(nav.children.filter(a=>a.attributes['aria-current']!==undefined).length,1);
  // BM: Sampai ke footer harus mengaktifkan seksyen terakhir, bukan meninggalkan status lama.
  // EN: At the footer, select the final section instead of retaining a stale selection.
  win.scrollY=2840;
  win.dispatch('scroll');win.flush();
  assert.equal(nav.children[4].attributes['aria-current'],'location');
  assert.equal(nav.children[3].attributes['aria-current'],undefined);
  // BM: Back/Forward semasa perjalanan klik tidak boleh mengekalkan destinasi lama.
  // EN: Back/Forward during click travel must cancel a stale pending destination.
  nav.children[2].dispatch('click');
  win.location.href='https://zrain.example/#contact';
  win.scrollY=1200-260;
  win.dispatch('popstate');win.flush();
  assert.equal(nav.children[1].attributes['aria-current'],'location');
});

// BM: scrollSpy ialah pilihan, dan mesti membersihkan semua listener serta kelas selepas remount.
// EN: scrollSpy is opt-in and must clean up every listener and class after remounting.
test('scrollSpy opt-in preserves legacy menus and cleans listeners on remount', () => {
  const {doc,win,nav,root,listeners,frames} = sectionDocument();
  const config={product:'Ecosystem',logoSrc:'/logo.webp',document:doc,navigation:[
    {label:'Discover',href:'#discover',current:true},
    {label:'Contact',href:'#contact'}
  ]};
  mountZrainUI(config);
  assert.equal(listeners.get('scroll')?.size || 0,0);
  assert.equal(root.classList.contains('zrain-scrollspy--smooth'),false);
  mountZrainUI({...config,scrollSpy:true});
  assert.equal(listeners.get('scroll')?.size,1);
  assert.equal(root.classList.contains('zrain-scrollspy--smooth'),true);
  const oldLink=nav.children[1];
  mountZrainUI({...config,scrollSpy:true});
  assert.equal(listeners.get('scroll')?.size,1);
  assert.equal(oldLink.listenerCount('click'),0);
  assert.equal(nav.children[1].listenerCount('click'),1);
  assert.equal(listeners.get('wheel')?.size,1);
  assert.equal(listeners.get('keydown')?.size,1);
  // BM: Remount ke navigation tanpa scrollSpy tidak meninggalkan class atau pendengar terdahulu.
  // EN: Remounting without scrollSpy must leave neither its classes nor its listeners behind.
  mountZrainUI(config);
  assert.equal(listeners.get('scroll')?.size,0);
  assert.equal(listeners.get('wheel')?.size,0);
  assert.equal(listeners.get('keydown')?.size,0);
  assert.equal(root.classList.contains('zrain-scrollspy--smooth'),false);
  assert.equal(root.style.getPropertyValue('--zrain-scrollspy-offset'),'');
  assert.equal(frames.size,0);
});

// BM: Uji CSS opt-in smooth scroll dan perlindungan pilihan reduced motion.
// EN: Test the opt-in smooth-scroll styling and reduced-motion protection.
test('scrollSpy CSS respects user motion preference and keeps Discover styling unchanged', () => {
  const css=readFileSync(new URL('../src/brand.css',import.meta.url),'utf8');
  assert.match(css,/html\.zrain-scrollspy--smooth\s*\{\s*scroll-behavior:\s*smooth;/);
  assert.match(css,/\.zrain-scrollspy-target\s*\{\s*scroll-margin-top:\s*var\(--zrain-scrollspy-offset/);
  assert.match(css,/@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*html\.zrain-scrollspy--smooth\s*\{\s*scroll-behavior:\s*auto;/);
  assert.match(css,/background:\s*#fff1e9;/);
  assert.match(css,/box-shadow:\s*inset 0 -2px 0 #b95136;/);
});

// BM: Kekalkan English walaupun pilihan lama atau API meminta BM.
// EN: Keep English despite legacy preferences or API requests.
test('shared experience ignores legacy Malay preferences and requests', () => {
  const source = readFileSync(new URL('../shared/runtime.mjs', import.meta.url), 'utf8');
  const initial = source.match(/let language=[^;]+;/)?.[0];
  const setter = source.match(/function setLanguage\(value\)\{[\s\S]*?\n  \}(?=\r?\n  function setTheme)/)?.[0];
  assert.ok(initial && setter, 'language initialization and setter are available');
  let callbackLanguage, storedValue, dispatchedLanguage;
  const actions = {querySelector(){return null}};
  const communityButton = {querySelector(){return {textContent:''}}};
  const soundButton = {querySelector(){return {textContent:''}}, setAttribute(){}};
  const doc = {body:{dataset:{sound:'off'}},dispatchEvent(event){dispatchedLanguage=event.detail.lang}};
  const win = {CustomEvent: class {constructor(type,options){this.detail=options.detail}}};
  const make = new Function('safeRead','safeWrite','actions','communityButton','soundButton','doc','win','options', initial + "\nlet theme='night'; const t=(en,bm)=>language==='bm'?bm:en;\n" + setter + '\nreturn {setLanguage,getLanguage:()=>language};');
  const api = make(()=> 'bm', (key,value)=>{storedValue=value}, actions,communityButton,soundButton,doc,win,{onLanguageChange(value){callbackLanguage=value}});
  assert.equal(api.getLanguage(),'en', 'stored preference must not change initial language');
  api.setLanguage('bm');
  assert.equal(api.getLanguage(),'en');
  assert.equal(storedValue,'en');
  assert.equal(callbackLanguage,'en');
  assert.equal(dispatchedLanguage,'en');
});
