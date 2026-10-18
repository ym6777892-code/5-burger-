(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
document.documentElement.classList.add('js');

/* ===== UI strings ===== */
const STR = {
  ar: { title: '5Burger | المنيو', desc: 'منيو 5Burger: برجر سنجل ودبل، كومبو، مقبلات، مشروبات، سلطات وأصناف جانبية.',
        heroTitle: 'برجر بطابع مختلف', heroSub: 'المنيو · الأسعار بالجنيه المصري', all: 'الكل',
        vat: 'الأسعار غير شاملة ضريبة القيمة المضافة', toggle: 'English', toTop: 'للأعلى',
        navLabel: 'أقسام المنيو', filterLabel: 'تصفية قوائم البرجر', skip: 'إلى المنيو', cur: 'ج.م' },
  en: { title: '5Burger | Menu', desc: '5Burger menu: single and double burgers, combos, appetizers, drinks, salads and sides.',
        heroTitle: 'A Better Burger Experience', heroSub: 'Menu · Prices in Egyptian pounds', all: 'All',
        vat: 'Prices do not include VAT', toggle: 'العربية', toTop: 'Back to top',
        navLabel: 'Menu categories', filterLabel: 'Burger filters', skip: 'Skip to menu', cur: 'EGP' }
};

/* ===== Menu data (edit names, prices, descriptions here) =====
   Item shape: { en, ar, p: price, d: { ar, en } }  — empty/missing d.* => nothing rendered.
   Combo descriptions stay empty for now; fill d.ar / d.en later and they will appear automatically. */
const it = (en, ar, p, da = '', de = '') => ({ en, ar, p, d: { ar: da, en: de } });

// [en, ar, ingredients ar, ingredients en, [single, double, single combo, double combo]]
const BURGERS = [
  ['Five Classic',  'فايف كلاسيك', 'بيف بيكون، جبنة، بصل مكرمل', 'beef bacon, cheese, caramelized onions', [145, 190, 195, 240]],
  ['Mushroom Melt', 'ماشروم ميلت', 'مشروم، صوص جبنة',            'mushrooms, cheese sauce',                [190, 240, 240, 290]],
  ['Texas Melt',    'تكساس ميلت',  'صوص تكساس، بصل مكرمل',       'Texas sauce, caramelized onions',        [185, 235, 235, 285]],
  ['Sweet Crunch',  'سويت كرانش',  'بيف بيكون، سويت تشيلي',      'beef bacon, sweet chili',                [205, 255, 255, 305]],
  ['Ranch Bacon',   'رانش بيكون',  'بيف بيكون، صوص رانش',        'beef bacon, ranch sauce',                [195, 245, 245, 295]],
  ['Bavo Bomb',     'بافو بومب',   'صوص بافلو، صوابع جبنة',      'buffalo sauce, cheese sticks',           [230, 280, 280, 330]]
];
const burgers = (enS, arS, i, preAr, preEn, withDesc) =>
  BURGERS.map(([en, ar, ta, te, p]) =>
    it(`${en} ${enS}`, `${ar} ${arS}`, p[i], withDesc ? `${preAr}${ta}.` : '', withDesc ? `${preEn}${te}.` : ''));

const CATS = [
  { id: 'appetizers', ar: 'مقبلات', en: 'Appetizers', v: 'plain', items: [
    it('Mozzarella Sticks - 3 pcs', 'موزاريلا ستيكس - 3 قطع', 75, 'صوابع جبنة مقرمشة، صوص رانش.', 'Crispy cheese sticks, ranch sauce.'),
    it('Onion Rings - 4 pcs', 'أونيون رينجز - 4 قطع', 75, 'حلقات بصل مقرمشة، صوص رانش.', 'Crispy onion rings, ranch sauce.'),
    it('Farm Classic - Small', 'فارم كلاسيك - صغير', 45),
    it('Cheese Fries', 'تشيز فرايز', 85, 'بطاطس، صوص جبنة.', 'Fries, cheese sauce.'),
    it('Five Bacon Fries', 'فايف بيكون فرايز', 125, 'بطاطس، بيكون مقرمش، صوص جبنة.', 'Fries, crispy bacon, cheese sauce.')
  ]},
  { id: 'single', ar: 'برجر سنجل', en: 'Single Burger', v: 'single',
    items: burgers('Single', 'سنجل', 0, 'لحمة، ', 'Beef patty, ', true) },
  { id: 'double', ar: 'برجر دبل', en: 'Double Burger', v: 'double',
    items: burgers('Double', 'دبل', 1, 'قرصين لحمة، ', 'Two beef patties, ', true) },
  { id: 'single-combo', ar: 'سنجل كومبو', en: 'Single Combo', v: 'single-combo',
    items: burgers('Single Combo', 'سنجل كومبو', 2, '', '', false) },
  { id: 'double-combo', ar: 'دبل كومبو', en: 'Double Combo', v: 'double-combo',
    items: burgers('Double Combo', 'دبل كومبو', 3, '', '', false) },
  { id: 'drinks', ar: 'المشروبات', en: 'Drinks', v: 'plain', items: [
    it('Pepsi', 'بيبسي', 30), it('Water', 'مياه', 20)
  ]},
  { id: 'salads', ar: 'السلطات', en: 'Salads', v: 'plain', items: [
    it('Caesar Salad', 'سلطة سيزر', 90),
    it('Chicken Caesar Salad', 'سلطة تشيكن سيزر', 130),
    it('Chef Salad', 'سلطة شيف', 110)
  ]},
  { id: 'sides', ar: 'الأصناف الجانبية', en: 'Sides', v: 'plain', items: [
    it('Sauces', 'صوصات', 40), it('Jalapeño', 'هالابينو', 40), it('Pickles', 'خيار مخلل', 40),
    it('Hot Dog', 'هوت دوج', 60), it('Beef Bacon', 'بيف بيكون', 60), it('Smoked Beef', 'سموك بيف', 60),
    it('Pepperoni', 'بيبروني', 60), it('Salami', 'سلامي', 60), it('Turkey', 'تركي', 60), it('Egg', 'بيض', 25)
  ]}
];
const FILTERS = ['single', 'double', 'single-combo', 'double-combo'];

/* ===== State ===== */
let lang = 'ar', filter = 'all', active = null;
try { const s = localStorage.getItem('5b-lang'); if (s === 'en' || s === 'ar') lang = s; } catch (e) {}
const S = () => STR[lang];
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const hdr = $('#top'), btt = $('#btt'), langBtn = $('#langBtn');
const io = 'IntersectionObserver' in window && !reduce()
  ? new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -5% 0px' })
  : null;

/* ===== Render ===== */
const priceText = p => `${p} ${S().cur}`;
const card = x => `<li class="card"><div class="info"><h3 class="name">${x[lang]}</h3>${
  x.d && x.d[lang] ? `<p class="desc">${x.d[lang]}</p>` : ''}</div><span class="price"><bdi>${priceText(x.p)}</bdi></span></li>`;

function render(animate) {
  $('#catNav').innerHTML = `<ul>${CATS.map(c =>
    `<li><a class="chip" href="#${c.id}" data-id="${c.id}">${c[lang]}</a></li>`).join('')}</ul>`;
  $('#filters').innerHTML =
    `<button type="button" class="chip" data-f="all">${S().all}</button>` +
    FILTERS.map(id => `<button type="button" class="chip" data-f="${id}">${CATS.find(c => c.id === id)[lang]}</button>`).join('');
  $('#sections').innerHTML = CATS.map(c =>
    `<section class="sec v-${c.v}" id="${c.id}" aria-labelledby="h-${c.id}"><h2 id="h-${c.id}">${c[lang]}</h2><ul class="grid">${c.items.map(card).join('')}</ul></section>`).join('');
  $$('.card').forEach(c => (animate && io) ? io.observe(c) : c.classList.add('in'));
  applyFilter();
  markActive();
}

function applyFilter() {
  $$('#filters [data-f]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f === filter)));
  $$('.sec').forEach(s => { s.hidden = FILTERS.includes(s.id) && filter !== 'all' && filter !== s.id; });
}

function setFilter(f) {
  filter = f; applyFilter();
  const r = $('#filters').getBoundingClientRect();
  if (r.top < hdr.offsetHeight) $('#filters').scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
  onScroll();
}

/* ===== Language ===== */
function setLang(l, animate) {
  lang = l;
  try { localStorage.setItem('5b-lang', l); } catch (e) {}
  const h = document.documentElement;
  h.lang = l; h.dir = l === 'ar' ? 'rtl' : 'ltr';
  document.title = S().title;
  $('meta[name=description]').content = S().desc;
  $$('[data-i18n]').forEach(e => { e.textContent = S()[e.dataset.i18n]; });
  $$('[data-i18n-aria]').forEach(e => e.setAttribute('aria-label', S()[e.dataset.i18nAria]));
  langBtn.textContent = S().toggle;
  langBtn.lang = l === 'ar' ? 'en' : 'ar';
  render(animate);
  setSticky();
}

/* ===== Navigation, active category, back-to-top ===== */
const setSticky = () => document.documentElement.style.setProperty('--sticky', hdr.offsetHeight + 'px');

function go(id) {
  if (FILTERS.includes(id) && filter !== 'all' && filter !== id) { filter = 'all'; applyFilter(); }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
}

function markActive() {
  const nav = $('#catNav');
  $$('#catNav .chip').forEach(a => {
    if (a.dataset.id === active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });
  const a = $(`#catNav .chip[aria-current]`);
  if (!a) return;
  const n = nav.getBoundingClientRect(), r = a.getBoundingClientRect();
  if (r.left < n.left + 8 || r.right > n.right - 8) // only move the bar when the chip is clipped
    nav.scrollBy({ left: r.left - n.left - (n.width - r.width) / 2, behavior: reduce() ? 'auto' : 'smooth' });
}

let ticking = false;
function onScroll() {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const line = hdr.offsetHeight + 24;
    const vis = $$('.sec').filter(s => !s.hidden);
    let cur = null;
    vis.forEach(s => { if (s.getBoundingClientRect().top <= line) cur = s.id; });
    if (vis.length && innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = vis[vis.length - 1].id;
    if (cur !== active) { active = cur; markActive(); }
    btt.classList.toggle('show', scrollY > 500);
  });
}

/* ===== Events ===== */
langBtn.addEventListener('click', () => setLang(lang === 'ar' ? 'en' : 'ar', false));
$('#catNav').addEventListener('click', e => {
  const a = e.target.closest('a[data-id]'); if (!a) return;
  e.preventDefault(); go(a.dataset.id);
});
$('#filters').addEventListener('click', e => {
  const b = e.target.closest('[data-f]'); if (b) setFilter(b.dataset.f);
});
btt.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce() ? 'auto' : 'smooth' }));
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', () => { setSticky(); onScroll(); });
if ('ResizeObserver' in window) new ResizeObserver(setSticky).observe(hdr);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(setSticky);

/* ===== Init ===== */
$('#year').textContent = new Date().getFullYear();
setLang(lang, true);
onScroll();
})();
