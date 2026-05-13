(() => {
    'use strict';

    // ── DOM refs ──────────────────────────────────────────────
    const overlay      = document.getElementById('overlay');
    const btnOpen      = document.getElementById('btn-open');
    const app          = document.getElementById('app');
    const fabGroup     = document.getElementById('fab-group');
    const fabMusic     = document.getElementById('fab-music');
    let bgMusic        = null;
    let isPlaying      = false;
    let revealObserver = null;

    // Lock app scroll immediately (before user opens invitation)
    app.classList.add('app-locked');

    // ── HELPERS ──────────────────────────────────────────────
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

    // ── Scroll Reveal (staggered, premium) ───────────────────
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('visible');
                if (el.tagName === 'SECTION') {
                    el.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(child => {
                        child.classList.add('visible');
                    });
                }
                revealObserver.unobserve(el);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    // ── DATA OVERRIDE FROM ADMIN ─────────────────────────────
    const loadCustomData = () => {
        const pesanan = JSON.parse(localStorage.getItem('ns_pesanan') || '[]');
        // For demo, we'll just pick the first one or a specific ID if provided in URL
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get('id') || (pesanan.length > 0 ? pesanan[0].id : null);
        
        const data = pesanan.find(p => p.id === orderId);
        if (data) {
            console.log('Loading custom data for:', data.id);
            // Hero
            document.querySelector('.hero-names').textContent = `${data.pria} & ${data.wanita}`;
            const targetDate = data.akadTgl || data.tglnikah;
            if (targetDate) {
                document.querySelector('.hero-date').textContent = targetDate.split('-').reverse().join(' . ');
                // Update Countdown Target if global function exists
                if (window.setCountdownTarget) window.setCountdownTarget(targetDate + (data.akadJam ? ' ' + data.akadJam.split(' ')[0] : ' 08:00'));
            }
            
            // Overlay
            document.querySelector('.overlay h1').textContent = `${data.pria} & ${data.wanita}`;
            
            // Couple Details
            if (document.getElementById('pria-name'))    document.getElementById('pria-name').textContent = data.pria || 'Julian';
            if (document.getElementById('wanita-name'))  document.getElementById('wanita-name').textContent = data.wanita || 'Adeline';
            
            if (data.priaPhoto && document.getElementById('pria-photo'))     document.getElementById('pria-photo').src = data.priaPhoto;
            if (data.wanitaPhoto && document.getElementById('wanita-photo')) document.getElementById('wanita-photo').src = data.wanitaPhoto;
            
            if (document.getElementById('pria-parents')) {
                const father = data.priaFather || '';
                const mother = data.priaMother || '';
                document.getElementById('pria-parents').innerHTML = father || mother ? `Putra dari Bpk. ${father} <br> & Ibu ${mother}` : '';
            }
            if (document.getElementById('wanita-parents')) {
                const father = data.wanitaFather || '';
                const mother = data.wanitaMother || '';
                document.getElementById('wanita-parents').innerHTML = father || mother ? `Putri dari Bpk. ${father} <br> & Ibu ${mother}` : '';
            }
            
            if (data.priaIg && document.getElementById('pria-ig')) {
                document.getElementById('pria-ig').textContent = data.priaIg;
                document.getElementById('pria-ig').href = `https://instagram.com/${data.priaIg.replace('@','')}`;
            }
            if (data.wanitaIg && document.getElementById('wanita-ig')) {
                document.getElementById('wanita-ig').textContent = data.wanitaIg;
                document.getElementById('wanita-ig').href = `https://instagram.com/${data.wanitaIg.replace('@','')}`;
            }

            // Content fields
            if (data.quote) {
                const quoteEl = document.getElementById('quote-text');
                if (quoteEl) quoteEl.textContent = data.quote;
            }
            if (data.quoteRef) {
                const refEl = document.getElementById('quote-ref');
                if (refEl) refEl.textContent = data.quoteRef;
            }
            // Event: Akad Nikah
            if (data.akadTgl) {
                const dt = document.getElementById('akad-datetime');
                if (dt) dt.innerHTML = `${formatDate(data.akadTgl)}${data.akadJam ? '<br>'+data.akadJam : ''}`;
            }
            if (data.akadLokasi && document.getElementById('akad-lokasi')) {
                document.getElementById('akad-lokasi').textContent = data.akadLokasi;
            }
            if (data.akadLink && document.getElementById('akad-map-btn')) {
                document.getElementById('akad-map-btn').onclick = () => window.open(data.akadLink, '_blank');
            }

            // Event: Resepsi
            if (data.resepsiTgl) {
                const dt = document.getElementById('resepsi-datetime');
                if (dt) dt.innerHTML = `${formatDate(data.resepsiTgl)}${data.resepsiJam ? '<br>'+data.resepsiJam : ''}`;
            }
            if (data.resepsiLokasi && document.getElementById('resepsi-lokasi')) {
                document.getElementById('resepsi-lokasi').textContent = data.resepsiLokasi;
            }
            if (data.resepsiLink && document.getElementById('resepsi-map-btn')) {
                document.getElementById('resepsi-map-btn').onclick = () => window.open(data.resepsiLink, '_blank');
            }
            if (data.cover) {
                const heroImg = document.querySelector('.hero-arch img');
                const overlayBg = document.querySelector('.overlay-bg');
                if (heroImg) heroImg.src = data.cover;
                if (overlayBg) overlayBg.style.backgroundImage = `url(${data.cover})`;
            }

            // Love Story
            const storySection = document.getElementById('love-story-section');
            const storyContainer = document.getElementById('love-story-container');
            
            if (data.stories && data.stories.length > 0) {
                if (storySection) storySection.style.display = 'block';
                if (storyContainer) {
                    storyContainer.innerHTML = data.stories.map((s, i) => `
                        <div class="story-item" style="transition-delay: ${i * 0.2}s;">
                            ${(s.photo || s.img) ? `
                            <div class="story-img-wrapper">
                                <img src="${s.photo || s.img}" alt="Story">
                            </div>
                            ` : ''}
                            <div class="story-title">${s.title || ''}</div>
                            <div class="story-desc">${s.desc || ''}</div>
                        </div>
                    `).join('');
                    
                    // Re-observe for reveal animation
                    setTimeout(() => {
                        storyContainer.querySelectorAll('.story-item').forEach(el => {
                            if (window.revealObserver) {
                                window.revealObserver.observe(el);
                            } else {
                                // Fallback if observer not ready
                                el.style.opacity = "1";
                                el.style.transform = "translateY(0)";
                            }
                        });
                    }, 100);
                }
            } else {
                if (storySection) storySection.style.display = 'none';
            }

            // Gallery
            if (data.gallery && data.gallery.length > 0) {
                const gallerySection = document.getElementById('gallery');
                const galleryContainer = document.getElementById('gallery-container');
                if (gallerySection && galleryContainer) {
                    gallerySection.style.display = 'block';
                    const isOdd = data.gallery.length % 2 !== 0;
                    
                    galleryContainer.innerHTML = data.gallery.map((img, i) => {
                        const isLarge = isOdd && i === 0;
                        return `
                            <div class="gallery-item reveal ${isLarge ? 'large' : ''}" onclick="openLightbox('${img}')">
                                <img src="${img}" style="width:100%; height:100%; object-fit:cover; transition: transform 0.5s;" 
                                     onmouseover="this.style.transform='scale(1.1)'" 
                                     onmouseout="this.style.transform='scale(1)'" alt="Gallery ${i+1}">
                            </div>
                        `;
                    }).join('');
                }
            }

            // Music
            if (data.music) {
                try {
                    bgMusic = new Audio();
                    bgMusic.src = data.music;
                    bgMusic.loop = true;
                    bgMusic.volume = 0.5;
                    bgMusic.preload = 'auto';
                    console.log("Music initialized with source:", data.music);
                } catch (err) {
                    console.error("Error creating audio object:", err);
                }
            }

            window.openLightbox = (src) => {
                const lb = document.getElementById('lightbox');
                const lbImg = document.getElementById('lightbox-img');
                if (lb && lbImg) {
                    lbImg.src = src;
                    lb.style.display = 'flex';
                }
            };

            if (document.getElementById('gift-bank-name')) document.getElementById('gift-bank-name').textContent = data.giftBank || 'BCA';
            if (document.getElementById('gift-acc-no'))   document.getElementById('gift-acc-no').textContent = data.giftAcc || '1234 5678 90';
            if (document.getElementById('gift-acc-name')) document.getElementById('gift-acc-name').textContent = `a.n ${data.giftName || data.pria || 'Julian'}`;
            if (document.getElementById('gift-address-text')) document.getElementById('gift-address-text').innerHTML = (data.giftAddress || 'Jl. Melati No. 12<br>Jakarta Selatan').replace(/\n/g, '<br>');
            if (document.getElementById('gift-address-name')) document.getElementById('gift-address-name').textContent = `a.n ${data.pria} & ${data.wanita}`;
        }
    };

    loadCustomData();

    // ── GUEST PERSONALIZATION (?to=NamaTamu) ─────────────────
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        const nameEl = document.querySelector('.overlay-name');
        const toEl   = document.querySelector('.overlay-to');
        if (nameEl) nameEl.textContent = guestName;
        if (toEl)   toEl.textContent   = 'Kepada Bapak/Ibu/Saudara/i,';
        // Set page title
        document.title = `Undangan untuk ${guestName} – ${document.title}`;
    }

    window.copyGiftAcc = function() {
        const accNo = document.getElementById('gift-acc-no').textContent.replace(/\s/g, '');
        navigator.clipboard.writeText(accNo).then(() => {
            const btn = document.getElementById('btn-copy-gift');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Berhasil Disalin!';
            setTimeout(() => { btn.innerHTML = originalText; }, 2000);
        });
    };


    const guestsMinus  = document.getElementById('guests-minus');
    const guestsPlus   = document.getElementById('guests-plus');
    const guestsVal    = document.getElementById('guests-val');
    const wishesBox    = document.getElementById('wishes-container');
    const rsvpForm     = document.getElementById('rsvp-form');

    let guestsCount = 1;

    // ── Open Invitation ───────────────────────────────────────
    btnOpen.addEventListener('click', () => {
        overlay.classList.add('hidden');
        app.classList.remove('app-locked'); // Unlock scroll
        fabGroup.style.display = 'flex';
        
        // Start Music
        if (bgMusic) {
            bgMusic.play().then(() => {
                isPlaying = true;
                fabMusic.classList.add('playing');
            }).catch(e => {
                console.log("Autoplay blocked, waiting for interaction");
                // Fallback: try play on first body click if blocked
                document.body.addEventListener('click', () => {
                    if (!isPlaying) {
                        bgMusic.play();
                        isPlaying = true;
                        fabMusic.classList.add('playing');
                    }
                }, { once: true });
            });
        }

        startCountdown();
        spawnBirdsLoop();
        
        setTimeout(() => {
            overlay.style.display = 'none';
            app.classList.add('active');
        }, 1200);
    });

    // ── Scroll Reveal (staggered, premium) ───────────────────
    // Observer sections
    document.querySelectorAll('section').forEach(sec => {
        revealObserver.observe(sec);
    });

    // Observe all animated elements individually with stagger
    const animatedSelectors = [
        '.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
        '.event-card', '.story-item', '.gift-card', '.rsvp-card'
    ];
    document.querySelectorAll(animatedSelectors.join(',')).forEach((el, index) => {
        // Add stagger delay based on sibling position
        const siblings = el.parentElement ? [...el.parentElement.children].filter(c => c.classList.contains(el.classList[0])) : [];
        const siblingIndex = siblings.indexOf(el);
        if (siblingIndex > 0) {
            el.style.transitionDelay = `${siblingIndex * 0.12}s`;
        }
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

    // ── Music Toggle ──────────────────────────────────────────
    fabMusic.addEventListener('click', () => {
        if (!bgMusic) return;
        if (isPlaying) {
            bgMusic.pause();
            fabMusic.classList.remove('playing');
        } else {
            bgMusic.play();
            fabMusic.classList.add('playing');
        }
        isPlaying = !isPlaying;
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
