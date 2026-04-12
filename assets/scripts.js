(() => {
    'use strict';
    const $ = (s,r=document) => r.querySelector(s);
    const $$ = (s,r=document) => [...r.querySelectorAll(s)];

    /* Year */
    const yr = $('#year'); if(yr) yr.textContent = new Date().getFullYear();

    /* Feature 4: Theme with radial wipe */
    const TKEY = 'psw-theme-v2';
    const themeBtn  = $('#themeBtn');
    const themeIcon = $('#themeIcon');
    const wipeEl    = $('#theme-wipe');
    function applyTheme(t) {
        document.body.dataset.theme = t;
        localStorage.setItem(TKEY, t);
        if(themeIcon) themeIcon.className = t==='dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    applyTheme(localStorage.getItem(TKEY) || (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'));
    themeBtn?.addEventListener('click', e => {
        const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        if(wipeEl) {
        const r = themeBtn.getBoundingClientRect();
        wipeEl.style.setProperty('--wx', (r.left + r.width/2) + 'px');
        wipeEl.style.setProperty('--wy', (r.top  + r.height/2) + 'px');
        wipeEl.style.background = next === 'dark' ? '#141210' : '#faf7f2';
        wipeEl.classList.add('wiping');
        setTimeout(() => { applyTheme(next); wipeEl.classList.remove('wiping'); }, 560);
        } else { applyTheme(next); }
    });

    /* Custom cursor */
    const cur = $('#cursor');
    if(cur && window.matchMedia('(pointer:fine)').matches) {
        let cx=innerWidth/2, cy=innerHeight/2, tx=cx, ty=cy;
        document.addEventListener('mousemove', e => { tx=e.clientX; ty=e.clientY; });
        (function loop(){ cx+=(tx-cx)*0.13; cy+=(ty-cy)*0.13; cur.style.left=cx+'px'; cur.style.top=cy+'px'; requestAnimationFrame(loop); })();
        $$('a,button,.cert-card,.toc-link,.value-item,.goal-card,.ref-card,.dot-nav-item').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
        });
        document.addEventListener('mousedown', () => document.body.classList.add('c-press'));
        document.addEventListener('mouseup',   () => document.body.classList.remove('c-press'));
    }

    /* Toast */
    const toastEl = $('#toast');
    let toastTm;
    function toast(msg) {
        if(!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTm);
        toastTm = setTimeout(() => toastEl.classList.remove('show'), 3500);
    }

    /* Feature 5: Scroll progress bar */
    const progressBar = $('#scroll-progress');
    window.addEventListener('scroll', () => {
        if(!progressBar) return;
        const max = document.documentElement.scrollHeight - innerHeight;
        progressBar.style.width = (max > 0 ? (scrollY/max)*100 : 0) + '%';
    }, {passive:true});

    /* IntersectionObserver helper */
    function observe(els, fn, opts={}) {
        if(!('IntersectionObserver' in window)) { els.forEach(fn); return; }
        const io = new IntersectionObserver((entries,obs) => {
        entries.forEach(e => { if(e.isIntersecting) { fn(e.target); obs.unobserve(e.target); } });
        }, {threshold:0.08,...opts});
        els.forEach(el => io.observe(el));
    }

    /* Section reveals */
    observe($$('.reveal'), el => el.classList.add('in'));
    observe($$('.stagger'), el => el.classList.add('in'), {threshold:0.06});

    /* Counters */
    const counted = new WeakSet();
    observe($$('[data-counter]'), el => {
        if(counted.has(el)) return; counted.add(el);
        const target = Number(el.dataset.target||0);
        const t0 = performance.now();
        const dur = Math.max(600, Math.min(1600, target*4));
        const ease = t => 1-Math.pow(1-t,3);
        (function frame(now){ const p=Math.min(1,(now-t0)/dur); el.textContent=Math.round(ease(p)*target); if(p<1) requestAnimationFrame(frame); })(performance.now());
    });

    /* Language bars */
    observe($$('.lang-fill'), el => { el.style.width=(el.dataset.fill||'100')+'%'; el.classList.add('go'); }, {threshold:0.3});

    /* Back to top */
    const btt = $('#backToTop');
    window.addEventListener('scroll', () => btt?.classList.toggle('show', scrollY>500), {passive:true});
    btt?.addEventListener('click', () => scrollTo({top:0,behavior:'smooth'}));

    /* Nav active */
    const secs = $$('section[id]');
    const nls  = $$('.nav-links a');
    function syncNav() {
        let cur=''; secs.forEach(s => { if(scrollY >= s.offsetTop-90) cur=s.id; });
        nls.forEach(a => a.classList.toggle('active', a.getAttribute('href')==='#'+cur));
    }
    window.addEventListener('scroll', syncNav, {passive:true});

    /* Feature 6: Floating dot-nav */
    const dots = $$('.dot-nav-item[data-nav]');
    function syncDots() {
        let cur=''; secs.forEach(s => { if(scrollY >= s.offsetTop-120) cur=s.id; });
        dots.forEach(d => d.classList.toggle('active', d.dataset.nav===cur));
    }
    dots.forEach(d => d.addEventListener('click', () => {
        const t = $('#'+d.dataset.nav); if(t) t.scrollIntoView({behavior:'smooth'});
    }));
    window.addEventListener('scroll', syncDots, {passive:true});
    syncDots();

    /* Feature 2: Typewriter */
    const twEl = $('#typewriter-target');
    if(twEl) {
        const text = 'Personal Support Worker Student \u2014 Cohort 2025\u20132026';
        let i=0;
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        twEl.appendChild(cursor);
        function type() {
        if(i < text.length) { twEl.insertBefore(document.createTextNode(text[i++]), cursor); setTimeout(type, 38); }
        else { setTimeout(() => cursor.style.display='none', 1800); }
        }
        setTimeout(type, 900);
    }

    /* Feature 3: PDF modal */
    const pdfModal  = $('#pdf-modal');
    const pdfFrame  = $('#pdf-modal-frame');
    const pdfTitle  = $('#pdf-modal-title');
    const pdfClose  = $('#pdf-modal-close');
    window.openPdfModal = function(link) {
        if(!pdfModal) return;
        if(pdfFrame) pdfFrame.src = link.getAttribute('href');
        if(pdfTitle) pdfTitle.textContent = link.dataset.pdfTitle || 'Document Preview';
        pdfModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    function closePdfModal() {
        if(!pdfModal) return;
        pdfModal.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => { if(pdfFrame) pdfFrame.src=''; }, 300);
    }
    pdfClose?.addEventListener('click', closePdfModal);
    pdfModal?.addEventListener('click', e => { if(e.target===pdfModal) closePdfModal(); });
    document.addEventListener('keydown', e => { if(e.key==='Escape') closePdfModal(); });

    /* Certificate availability */
    async function fileOk(url) {
        try { const r=await fetch(url,{method:'HEAD',cache:'no-store'}); return r.ok; } catch { return false; }
    }
    function disableLink(a, msg) {
        if(!a) return;
        a.classList.add('is-disabled'); a.setAttribute('aria-disabled','true'); a.setAttribute('tabindex','-1');
        a.addEventListener('click', e => { e.preventDefault(); toast(msg); });
    }
    $$('[data-cert][data-cert-file]').forEach(async card => {
        const file=card.dataset.certFile;
        const status=$('[data-role="status"]',card);
        const dl=$('[data-role="download"]',card);
        const pv=$('[data-role="preview"]',card);
        if(!file) return;
        const ok=await fileOk(file);
        if(ok) { if(status){status.textContent='✓ PDF available';status.style.color='var(--teal)';} }
        else {
        if(status) status.textContent='Upload "'+file.split('/').pop()+'" to enable';
        disableLink(dl,'Upload the PDF to enable downloads.');
        disableLink(pv,'Upload the PDF to enable preview.');
        }
    });

    /* Contact form validation → mailto */
    const CONTACT_EMAIL = 'Sajjangautam28@gmail.com';
    const contactForm = $('form.contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const nameVal  = ($('#c-name')?.value  || '').trim();
        const emailVal = ($('#c-email')?.value || '').trim();
        const msgVal   = ($('#c-msg')?.value   || '').trim();
        if(nameVal.split(/\s+/).filter(Boolean).length < 2) { toast('Please enter your full name — first and last name.'); $('#c-name')?.focus(); return; }
        if(!emailVal.includes('@') || emailVal.length < 5) { toast('Please enter a valid email address (must contain @).'); $('#c-email')?.focus(); return; }
        if(msgVal.split(/\s+/).filter(Boolean).length < 5) { toast('Please write a bit more in your message.'); $('#c-msg')?.focus(); return; }
        const subject = encodeURIComponent('Portfolio Enquiry from '+nameVal);
        const body    = encodeURIComponent('Name: '+nameVal+'\nEmail: '+emailVal+'\n\n'+msgVal);
        window.location.href = 'mailto:'+CONTACT_EMAIL+'?subject='+subject+'&body='+body;
        toast('\u2713 Opening your email client — message will go to '+CONTACT_EMAIL);
        });
    }

    /* Magnetic buttons */
    $$('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
        const r=btn.getBoundingClientRect();
        btn.style.transform='translate('+(e.clientX-r.left-r.width/2)*0.1+'px,'+(e.clientY-r.top-r.height/2)*0.1+'px) translateY(-2px)';
        });
        btn.addEventListener('mouseleave', () => btn.style.transform='');
    });

    /* Parallax hero */
    const coverInner = $('.cover-inner');
    window.addEventListener('scroll', () => {
        if(!coverInner || scrollY >= innerHeight) return;
        coverInner.style.transform = 'translateY('+(scrollY*0.14)+'px)';
        coverInner.style.opacity   = String(Math.max(0, 1-scrollY/(innerHeight*0.75)));
    }, {passive:true});

    })();