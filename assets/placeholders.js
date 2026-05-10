// Load collection images from Supabase themes table
(function () {
  const SUPABASE_URL = 'https://bqnawfnkukcbqkujsskr.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxbmF3Zm5rdWtjYnFrdWpzc2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODQ5NDAsImV4cCI6MjA4NzE2MDk0MH0.VeSr_1gEnsn3P0_cmQBcOkJNDpUe1rbIAD8E7nSbxQM';

  async function loadImages() {
    let imageMap = {};
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/themes?select=slug,image_url&is_active=eq.true`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY } }
      );
      const themes = await res.json();
      themes.forEach(t => {
        if (t.image_url) {
          imageMap[t.slug] = t.image_url;
          imageMap[t.slug + '-feature'] = t.image_url;
          imageMap[t.slug + '-hero'] = t.image_url;
        }
      });
    } catch (e) {
      console.warn('Could not load theme images from Supabase:', e);
    }

    // hero fallback
    if (!imageMap['hero-watch']) {
      imageMap['hero-watch'] = imageMap['rolex'] || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80';
    }

    document.querySelectorAll('[data-placeholder]').forEach(el => {
      const key = el.getAttribute('data-key') || el.getAttribute('data-placeholder');
      const url = imageMap[key];
      if (!url) return;
      const img = document.createElement('img');
      img.src = url;
      img.alt = el.getAttribute('data-placeholder');
      img.loading = 'lazy';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      el.innerHTML = '';
      el.appendChild(img);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadImages);
  } else {
    loadImages();
  }

  window.HQ = window.HQ || {};
  window.HQ.getThemeImages = () => fetch(
    `${SUPABASE_URL}/rest/v1/themes?select=slug,image_url&is_active=eq.true`,
    { headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY } }
  ).then(r => r.json());
})();
