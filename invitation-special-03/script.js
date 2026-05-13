(() => {
    'use strict';

    // ── DOM refs ──────────────────────────────────────────────
    const overlay      = document.getElementById('overlay');
    const btnOpen      = document.getElementById('btn-open');
    const app          = document.getElementById('app');
    const fabGroup     = document.getElementById('fab-group');
    const fabMusic     = document.getElementById('fab-music');
    const wishesBox    = document.getElementById('wishes-container');
    const rsvpForm     = document.getElementById('rsvp-form');
    const guestsMinus  = document.getElementById('guests-minus');
    const guestsPlus   = document.getElementById('guests-plus');
    const guestsVal    = document.getElementById('guests-val');

    let guestsCount = 1;

    // ── Open Invitation ───────────────────────────────────────
    btnOpen.addEventListener('click', () => {
        overlay.classList.add('hidden');
        fabGroup.style.display = 'flex';
        startCountdown();
        spawnBirdsLoop();
    });

    // ── Scroll Reveal (staggered, premium) ───────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger children with .reveal inside the section
                const reveals = entry.target.querySelectorAll
                    ? entry.target.querySelectorAll('.reveal')
                    : [];

                if (entry.target.classList.contains('reveal')) {
                    entry.target.classList.add('visible');
                }

                reveals.forEach((el) => {
                    el.classList.add('visible');
                });

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    // Observe each section (for children inside)
    document.querySelectorAll('section').forEach(sec => {
        revealObserver.observe(sec);
    });

    // Also observe standalone .reveal elements at top level
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ── SVG Birds (pure vector, no background issue) ─────────
    const BIRD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 20" fill="currentColor">
        <path d="M0 10 Q10 0 20 10 Q30 0 40 10 Q30 8 20 12 Q10 8 0 10z"/>
    </svg>`;

    function spawnBird() {
        const bird = document.createElement('div');
        bird.className = 'bird-svg';
        bird.innerHTML = BIRD_SVG;

        const size   = Math.random() * 16 + 10;   // 10–26px
        const top    = Math.random() * 55 + 5;     // 5–60% of section height
        const dur    = Math.random() * 6 + 7;      // 7–13s
        const delay  = Math.random() * 2;

        Object.assign(bird.style, {
            position:   'absolute',
            top:        top + '%',
            left:       '0',
            width:      size + 'px',
            color:      'var(--primary)',
            pointerEvents: 'none',
            zIndex:     5,
            animation:  `bird-fly ${dur}s ${delay}s linear forwards`,
        });

        // Append to hero so they fly within the phone
        const heroSection = document.getElementById('hero');
        heroSection.appendChild(bird);
        setTimeout(() => bird.remove(), (dur + delay + 0.5) * 1000);
    }

    function spawnBirdsLoop() {
        spawnBird();
        setInterval(spawnBird, 2800);
    }

    // ── Countdown ─────────────────────────────────────────────
    function startCountdown() {
        const target = new Date('2026-05-24T08:00:00').getTime();

        function tick() {
            const diff = target - Date.now();
            if (diff <= 0) {
                ['days','hours','mins','secs'].forEach(id => {
                    document.getElementById(id).textContent = '00';
                });
                return;
            }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000)  / 60000);
            const s = Math.floor((diff % 60000)    / 1000);

            document.getElementById('days').textContent  = String(d).padStart(2, '0');
            document.getElementById('hours').textContent = String(h).padStart(2, '0');
            document.getElementById('mins').textContent  = String(m).padStart(2, '0');
            document.getElementById('secs').textContent  = String(s).padStart(2, '0');
        }
        tick();
        setInterval(tick, 1000);
    }

    // ── Music Toggle (cosmetic – attach real audio if needed) ─
    let musicPlaying = false;
    // const audio = new Audio('assets/music.mp3');
    // audio.loop = true;

    fabMusic.addEventListener('click', () => {
        musicPlaying = !musicPlaying;
        fabMusic.classList.toggle('playing', musicPlaying);
        // musicPlaying ? audio.play() : audio.pause();
    });

    // ── Guests Stepper ────────────────────────────────────────
    guestsMinus.addEventListener('click', () => {
        if (guestsCount > 1) {
            guestsCount--;
            guestsVal.textContent = guestsCount;
        }
    });
    guestsPlus.addEventListener('click', () => {
        if (guestsCount < 5) {
            guestsCount++;
            guestsVal.textContent = guestsCount;
        }
    });

    // ── Copy to Clipboard ─────────────────────────────────────
    window.copyText = (text, btnId) => {
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            const orig = btn.innerHTML;
            btn.classList.add('copied');
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Tersalin!`;
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = orig;
            }, 2000);
        });
    };

    // ── RSVP Form Submit ──────────────────────────────────────
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name       = document.getElementById('rsvp-name').value.trim();
        const msg        = document.getElementById('rsvp-msg').value.trim();
        const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Hadir';

        if (!name) {
            document.getElementById('rsvp-name').focus();
            return;
        }

        // Build wish card
        const card = document.createElement('div');
        card.className = 'wish-card';
        card.style.animationDelay = '0s';

        const initial = name.charAt(0).toUpperCase();
        const guests  = guestsCount;

        card.innerHTML = `
            <div class="wish-header">
                <div class="wish-avatar">${initial}</div>
                <div class="wish-meta">
                    <div class="wish-name">${escHtml(name)}</div>
                    <div class="wish-attendance">${attendance === 'Hadir' ? '✓' : '✗'} ${attendance} · ${guests} orang</div>
                </div>
            </div>
            <p class="wish-text">${escHtml(msg || '—')}</p>
        `;

        wishesBox.prepend(card);
        rsvpForm.reset();
        guestsCount = 1;
        guestsVal.textContent = '1';

        // Smooth scroll to wishes
        document.getElementById('wishes').scrollIntoView({ behavior: 'smooth' });
    });

    function escHtml(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // ── Parallax on scroll ────────────────────────────────────
    app.addEventListener('scroll', () => {
        const y = app.scrollTop;

        // Subtle arch zoom
        const arch = document.querySelector('.hero-arch');
        if (arch) {
            arch.style.transform = `scale(${1 + y * 0.0003})`;
        }
    }, { passive: true });

})();
