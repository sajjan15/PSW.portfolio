(() => {
    'use strict';
    const $ = (s,r=document) => r.querySelector(s);
    const $$ = (s,r=document) => [...r.querySelectorAll(s)];

    // Year
    const yr = $('#year'); if(yr) yr.textContent = new Date().getFullYear();

    // Theme
    const TKEY = 'psw-theme-v2';
    const themeBtn = $('#themeBtn');
    const themeIcon = $('#themeIcon');
    function applyTheme(t) {
        document.body.dataset.theme = t;
        localStorage.setItem(TKEY,t);
        if(themeIcon) themeIcon.className = t==='dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    const saved = localStorage.getItem(TKEY);
    const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(saved || sys);
    themeBtn?.addEventListener('click', () => applyTheme(document.body.dataset.theme==='dark' ? 'light' : 'dark'));

    // Cursor
    const cur = $('#cursor');
    if(cur && window.matchMedia('(pointer:fine)').matches) {
        let cx=innerWidth/2, cy=innerHeight/2, tx=cx, ty=cy;
        document.addEventListener('mousemove', e => { tx=e.clientX; ty=e.clientY; });
        (function loop() {
        cx += (tx-cx)*0.13; cy += (ty-cy)*0.13;
        cur.style.left = cx+'px'; cur.style.top = cy+'px';
        requestAnimationFrame(loop);
        })();
        $$('a,button,[role="button"],.cert-card,.toc-link,.value-item,.goal-card,.ref-card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
        });
        document.addEventListener('mousedown', () => document.body.classList.add('c-press'));
        document.addEventListener('mouseup', () => document.body.classList.remove('c-press'));
    }

    // Toast
    const toastEl = $('#toast');
    let toastTm;
    function toast(msg) {
        if(!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTm);
        toastTm = setTimeout(() => toastEl.classList.remove('show'), 3200);
    }

    // Intersection observer helper
    function observe(els, fn, opts={}) {
        if(!('IntersectionObserver' in window)) { els.forEach(fn); return; }
        const io = new IntersectionObserver((entries,obs) => {
        entries.forEach(e => { if(e.isIntersecting) { fn(e.target); obs.unobserve(e.target); } });
        }, {threshold:0.08,...opts});
        els.forEach(el => io.observe(el));
    }

    // Section reveals
    observe($$('.reveal'), el => el.classList.add('in'));

    // Stagger grids
    observe($$('.stagger'), el => el.classList.add('in'), {threshold:0.06});

    // Counters
    const counted = new WeakSet();
    observe($$('[data-counter]'), el => {
        if(counted.has(el)) return; counted.add(el);
        const target = Number(el.dataset.target||0);
        const t0 = performance.now();
        const dur = Math.max(600, Math.min(1600, target * 4));
        const ease = t => 1 - Math.pow(1-t, 3);
        (function frame(now) {
        const p = Math.min(1,(now-t0)/dur);
        el.textContent = Math.round(ease(p)*target);
        if(p<1) requestAnimationFrame(frame);
        })(t0);
    });

    // Language bars
    observe($$('.lang-fill'), el => {
        const w = el.dataset.fill || '100';
        el.style.width = w + '%';
        el.classList.add('go');
    }, {threshold:0.3});

    // Back to top
    const btt = $('#backToTop');
    window.addEventListener('scroll', () => btt?.classList.toggle('show', scrollY>500), {passive:true});
    btt?.addEventListener('click', () => scrollTo({top:0,behavior:'smooth'}));

    // Nav active section
    const secs = $$('section[id]');
    const nls = $$('.nav-links a');
    window.addEventListener('scroll', () => {
        let cur='';
        secs.forEach(s => { if(scrollY >= s.offsetTop-90) cur=s.id; });
        nls.forEach(a => a.classList.toggle('active', a.getAttribute('href')==='#'+cur));
    }, {passive:true});

    // Cert availability
    async function fileOk(url) {
        try { const r = await fetch(url,{method:'HEAD',cache:'no-store'}); return r.ok; }
        catch { return false; }
    }
    function disableLink(a, msg) {
        if(!a) return;
        a.classList.add('is-disabled');
        a.setAttribute('aria-disabled','true');
        a.setAttribute('tabindex','-1');
        a.addEventListener('click', e => { e.preventDefault(); toast(msg); });
    }
    $$('[data-cert][data-cert-file]').forEach(async card => {
        const file = card.dataset.certFile;
        const status = $('[data-role="status"]', card);
        const dl = $('[data-role="download"]', card);
        const pv = $('[data-role="preview"]', card);
        if(!file) return;
        const ok = await fileOk(file);
        if(ok) {
        if(status) { status.textContent = '✓ PDF available'; status.style.color = 'var(--teal)'; }
        } else {
        if(status) status.textContent = `Upload "${file.split('/').pop()}" to enable`;
        disableLink(dl, `Upload the PDF to enable downloads.`);
        disableLink(pv, `Upload the PDF to enable preview.`);
        }
    });

    // Magnetic buttons
    $$('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX-r.left-r.width/2)*0.1;
        const y = (e.clientY-r.top-r.height/2)*0.1;
        btn.style.transform = `translate(${x}px,${y}px) translateY(-2px)`;
        });
        btn.addEventListener('mouseleave', () => btn.style.transform = '');
    });

    // Parallax hero name
    const coverInner = $('.cover-inner');
    window.addEventListener('scroll', () => {
        if(!coverInner) return;
        const y = scrollY;
        if(y < innerHeight) {
        coverInner.style.transform = `translateY(${y*0.14}px)`;
        coverInner.style.opacity = String(Math.max(0, 1 - y/(innerHeight*0.75)));
        }
    }, {passive:true});

    })();