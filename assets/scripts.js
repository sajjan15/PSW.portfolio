(() => {
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  // Year in footer
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Enable focus outlines once keyboard is used (Tab)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('focus-outline');
  }, { passive: true });

  // Toast helper
  const toastEl = $('#toast');
  let toastTimer = null;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('toast--show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('toast--show'), 3200);
  }

  // Theme toggle (saved preference > system preference)
  const root = document.documentElement;
  const themeToggle = $('#themeToggle');
  const themeIcon = $('#themeIcon');
  const STORAGE_KEY = 'psw-portfolio-theme';

  function systemPrefersDark() {
    // Works by matching prefers-color-scheme in JS
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function setTheme(theme) {
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, theme);

    if (themeIcon) {
      themeIcon.className = isDark
        ? 'fa-solid fa-moon text-slate-200'
        : 'fa-solid fa-sun text-yellow-500';
    }
  }

  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return systemPrefersDark() ? 'dark' : 'light';
  }

  setTheme(getInitialTheme());

  themeToggle?.addEventListener('click', () => {
    setTheme(root.classList.contains('dark') ? 'light' : 'dark');
  });

  // Animated counters
  function animateNumber(el, target, durationMs = 900) {
    const start = 0;
    const startTime = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - startTime) / durationMs);
      const value = Math.floor(start + (target - start) * t);
      el.textContent = String(value);
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counterEls = $$('[data-counter]');
  const alreadyAnimated = new WeakSet();

  function handleCounter(el) {
    if (alreadyAnimated.has(el)) return;
    const target = Number(el.getAttribute('data-target') || '0');
    alreadyAnimated.add(el);
    animateNumber(el, target);
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          handleCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    counterEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: animate immediately
    counterEls.forEach(handleCounter);
  }

  // Back to top button
  const backBtn = $('#backToTop');
  function toggleBackButton() {
    if (!backBtn) return;
    if (window.scrollY > 520) backBtn.classList.remove('hidden');
    else backBtn.classList.add('hidden');
  }

  window.addEventListener('scroll', toggleBackButton, { passive: true });
  toggleBackButton();

  backBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Certificate availability check (placeholders by default)
  async function fileExists(url) {
    try {
      const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      if (res.ok) return true;
      // Some hosts may not support HEAD well; fallback to GET
      const res2 = await fetch(url, { method: 'GET', cache: 'no-store' });
      return res2.ok;
    } catch {
      return false;
    }
  }

  function disableLink(a, message) {
    if (!a) return;
    a.classList.add('is-disabled');
    a.setAttribute('aria-disabled', 'true');
    a.setAttribute('tabindex', '-1');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      toast(message);
    });
  }

      // Particle background
    const particleHost = document.getElementById("particles");
    if(particleHost){

    const canvas=document.createElement("canvas");
    particleHost.appendChild(canvas);
    const ctx=canvas.getContext("2d");

    let w,h,particles=[];

    function resize(){
    w=canvas.width=window.innerWidth;
    h=canvas.height=window.innerHeight;
    }
    window.addEventListener("resize",resize);
    resize();

    particles=Array.from({length:60},()=>({
    x:Math.random()*w,
    y:Math.random()*h,
    r:Math.random()*2+1,
    dx:(Math.random()-.5)*.4,
    dy:(Math.random()-.5)*.4
    }));

    function draw(){
    ctx.clearRect(0,0,w,h);

    particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle="rgba(255,255,255,.35)";
    ctx.fill();

    p.x+=p.dx;
    p.y+=p.dy;

    if(p.x<0||p.x>w)p.dx*=-1;
    if(p.y<0||p.y>h)p.dy*=-1;
    });

    requestAnimationFrame(draw);
    }
    draw();
    }

    // Scroll animations
  if(window.gsap){
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray("section").forEach(sec=>{
  gsap.from(sec,{
  opacity:0,
  y:40,
  duration:.8,
  ease:"power3.out",
  scrollTrigger:{
  trigger:sec,
  start:"top 85%"
  }
  });
  });
  }

  // For each certificate card, disable buttons if the PDF isn't uploaded yet
  const certCards = $$('[data-cert][data-cert-file]');
  certCards.forEach(async (card) => {
    const file = card.getAttribute('data-cert-file');
    const status = $('[data-role="status"]', card);
    const downloadA = $('[data-role="download"]', card);
    const previewA = $('[data-role="preview"]', card);

    if (!file) return;

    const ok = await fileExists(file);

    if (ok) {
      if (status) status.textContent = 'PDF available.';
    } else {
      if (status) status.textContent = `Missing PDF: upload "${file}" to enable.`;
      disableLink(downloadA, `Upload the PDF at ${file} to enable downloads.`);
      disableLink(previewA, `Upload the PDF at ${file} to enable preview.`);
    }
  });
})();
