(function() {
  'use strict';

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const primaryMenu = document.getElementById('primaryMenu');
  if (navToggle && primaryMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Simple form validation + fake submit
  const form = document.getElementById('quoteForm');
  const formStatus = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      formStatus.textContent = '';

      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const address = (data.get('address') || '').toString().trim();
      const service = (data.get('service') || '').toString().trim();

      if (!name || !email || !address || !service) {
        formStatus.textContent = 'Please fill in required fields.';
        formStatus.style.color = '#b42318';
        return;
      }

      try {
        formStatus.textContent = 'Sending…';
        formStatus.style.color = '';
        // Demo: emulate sending
        await new Promise((res) => setTimeout(res, 800));
        formStatus.textContent = 'Thanks! We\'ll contact you shortly.';
      } catch (err) {
        formStatus.textContent = 'Something went wrong. Please try again.';
        formStatus.style.color = '#b42318';
      }
    });
  }

  // Newark weather snippet using open-meteo (no key needed)
  const weatherEl = document.getElementById('weather');
  async function loadWeather() {
    if (!weatherEl) return;
    try {
      const lat = 40.7357;
      const lon = -74.1724;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation&hourly=precipitation_probability`;
      const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
      if (!res.ok) throw new Error('Weather request failed');
      const json = await res.json();
      const t = json?.current?.temperature_2m;
      const p = json?.current?.precipitation;
      const prob = json?.hourly?.precipitation_probability?.[0];
      const parts = [];
      if (typeof t === 'number') parts.push(`Temp: ${Math.round(t)}°C`);
      if (typeof p === 'number') parts.push(`Precip: ${p}mm`);
      if (typeof prob === 'number') parts.push(`Snow chance: ${prob}%`);
      weatherEl.textContent = parts.length ? `Newark now — ${parts.join(' · ')}` : 'Weather unavailable';
      weatherEl.setAttribute('aria-busy', 'false');
    } catch (e) {
      weatherEl.textContent = 'Weather unavailable';
      weatherEl.setAttribute('aria-busy', 'false');
    }
  }
  loadWeather();
})();
