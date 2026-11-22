// Pages other than the home page: the language switch, the download link, and the navigation
// bar taking on the theme of the section under it.
import { mountLangSwitch } from './i18n.js';
import { APP_STORE_URL } from './config.js';

document.documentElement.classList.add('js');
document.querySelectorAll('[data-appstore]').forEach((a) => { a.href = APP_STORE_URL; });
mountLangSwitch();

const nav = document.getElementById('nav');
let tick = false;
function update() {
  tick = false;
  nav.classList.toggle('scrolled', window.scrollY > 8);
  for (const el of document.querySelectorAll('main [data-theme], footer[data-theme]')) {
    if (el.offsetParent === null) continue;
    const r = el.getBoundingClientRect();
    if (r.top <= 32 && r.bottom > 32) {
      nav.dataset.on = el.dataset.theme;
      break;
    }
  }
}
window.addEventListener('scroll', () => {
  if (!tick) {
    tick = true;
    requestAnimationFrame(update);
  }
}, { passive: true });
document.addEventListener('neiro:lang', update);
update();
