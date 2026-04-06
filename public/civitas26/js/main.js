/* ============================================================
   CIVITAS'26 — Main Orchestrator (main.js)

   GSAP ScrollTrigger bindings, camera keyframes, lighting
   transitions, content-section reveals, preloader, nav.
   ============================================================ */
(function () {
    'use strict';

    var C         = window.CIVITAS;
    var camera    = C.camera;
    var buildings = C.buildings;
    var particles = C.particles;
    var isMobile  = C.isMobile;

    /* Mobile camera offset adjustment */
    var CAM_Z_OFFSET = isMobile ? 8 : 0;  // mobile starts 8 units further back
    
    /* Handle mobile state changes on resize */
    C.onMobileChange = function(newIsMobile) {
        isMobile = newIsMobile;
        CAM_Z_OFFSET = isMobile ? 8 : 0;
        // Update camera keyframes with new offset
        camKF = [
            { p: 0.00, pos: [0,   0.5,  8 + CAM_Z_OFFSET], tgt: [0, 0,   0 ] },
            { p: 0.15, pos: [0,   1.0, 10 + CAM_Z_OFFSET], tgt: [0, 0.3, 0 ] },
            { p: 0.35, pos: [3,   3.5, 18 + CAM_Z_OFFSET], tgt: [0, 1.0, 0 ] },
            { p: 0.60, pos: [5,   7.0, 25 + CAM_Z_OFFSET], tgt: [0, 2.0, 0 ] },
            { p: 0.80, pos: [2,  10.0, 30 + CAM_Z_OFFSET], tgt: [0, 2.0, 0 ] },
            { p: 1.00, pos: [0,  14.0, 38 + CAM_Z_OFFSET], tgt: [0, 2.5, 0 ] }
        ];
        ScrollTrigger.refresh();
    };

    /* ═══════════════════════════════════════════════════════════
       PRELOADER
       ═══════════════════════════════════════════════════════════ */
    var preloader     = document.getElementById('preloader');
    var preloaderFill = document.getElementById('preloaderFill');
    var preloaderPct  = document.getElementById('preloaderPct');
    var loadProg = 0;
    var loadTimer = setInterval(function () {
        loadProg += Math.random() * 14 + 5;
        if (loadProg >= 100) {
            loadProg = 100;
            preloaderFill.style.width = '100%';
            if (preloaderPct) preloaderPct.textContent = '100%';
            clearInterval(loadTimer);
            setTimeout(function () { preloader.classList.add('hidden'); }, 500);
        } else {
            preloaderFill.style.width = loadProg + '%';
            if (preloaderPct) preloaderPct.textContent = Math.floor(loadProg) + '%';
        }
    }, 180);

    /* ═══════════════════════════════════════════════════════════
       GSAP  SCROLLTRIGGER
       ═══════════════════════════════════════════════════════════ */
    gsap.registerPlugin(ScrollTrigger);

    var scrollProgress = 0;

    ScrollTrigger.create({
        trigger: '#scroll-spacer',
        start:   'top top',
        end:     'bottom bottom',
        scrub:   1.5,
        markers: false,  // disable debug markers
        onUpdate: function (self) {
            scrollProgress = self.progress;
        }
    });

    /* ═══════════════════════════════════════════════════════════
       CAMERA  KEYFRAMES
       ═══════════════════════════════════════════════════════════ */
    var camKF = [
        { p: 0.00, pos: [0,   0.5,  8 + CAM_Z_OFFSET], tgt: [0, 0,   0 ] },
        { p: 0.15, pos: [0,   1.0, 10 + CAM_Z_OFFSET], tgt: [0, 0.3, 0 ] },
        { p: 0.35, pos: [3,   3.5, 18 + CAM_Z_OFFSET], tgt: [0, 1.0, 0 ] },
        { p: 0.60, pos: [5,   7.0, 25 + CAM_Z_OFFSET], tgt: [0, 2.0, 0 ] },
        { p: 0.80, pos: [2,  10.0, 30 + CAM_Z_OFFSET], tgt: [0, 2.0, 0 ] },
        { p: 1.00, pos: [0,  14.0, 38 + CAM_Z_OFFSET], tgt: [0, 2.5, 0 ] }
    ];

    function lerpCam(p) {
        // find bounding keyframes
        var k0 = camKF[0], k1 = camKF[camKF.length - 1];
        for (var i = 0; i < camKF.length - 1; i++) {
            if (p >= camKF[i].p && p <= camKF[i + 1].p) {
                k0 = camKF[i];
                k1 = camKF[i + 1];
                break;
            }
        }
        var range = (k1.p - k0.p) || 0.001;
        var t = (p - k0.p) / range;
        // power3.inOut easing
        t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        camera.position.set(
            k0.pos[0] + (k1.pos[0] - k0.pos[0]) * t,
            k0.pos[1] + (k1.pos[1] - k0.pos[1]) * t,
            k0.pos[2] + (k1.pos[2] - k0.pos[2]) * t
        );

        var lx = k0.tgt[0] + (k1.tgt[0] - k0.tgt[0]) * t;
        var ly = k0.tgt[1] + (k1.tgt[1] - k0.tgt[1]) * t;
        var lz = k0.tgt[2] + (k1.tgt[2] - k0.tgt[2]) * t;
        camera.lookAt(lx, ly, lz);
    }

    /* ═══════════════════════════════════════════════════════════
       LIGHTING  TRANSITIONS  (dark void → cool blue daylight)
       ═══════════════════════════════════════════════════════════ */
    function updateLighting(p) {
        C.ambientLight.intensity        = 0.15 + p * 0.75;
        C.dirLight.intensity            = 0.25 + p * 1.35;
        C.renderer.toneMappingExposure  = 0.55 + p * 0.70;
        C.rimLight.intensity            = 0.25 * (1 - p);

        if (C.fog) { C.fog.density = 0.012 - p * 0.008; }

        // Background & fog colour — deep navy → muted blue-grey sky
        // From #050a14 → #1a2842
        var r = 0x05 / 255 + p * (0x1a / 255 - 0x05 / 255);
        var g = 0x0a / 255 + p * (0x28 / 255 - 0x0a / 255);
        var b = 0x14 / 255 + p * (0x42 / 255 - 0x14 / 255);
        C.scene.background.setRGB(r, g, b);
        if (C.fog) C.fog.color.setRGB(r, g, b);
    }

    /* ═══════════════════════════════════════════════════════════
       HERO  INFO  OVERLAY
       ═══════════════════════════════════════════════════════════ */
    var heroInfo    = document.getElementById('hero-info');
    var scrollHint   = document.getElementById('scroll-hint');
    var heroReady  = false;                               // gate until preloader is gone

    // Show hero info 800 ms after preloader fades
    (function waitForPreloader() {
        var check = setInterval(function () {
            if (preloader.classList.contains('hidden')) {
                clearInterval(check);
                setTimeout(function () {
                    heroReady = true;
                    heroInfo.classList.add('visible');
                    if (scrollHint) scrollHint.classList.add('visible');
                }, 800);
            }
        }, 100);
    })();

    function updateHero(p) {
        if (!heroReady) return;
        var heroHideThreshold = isMobile ? 0.14 : 0.12;
        var heroFadeStart = heroHideThreshold - 0.06;
        
        if (p > heroHideThreshold) {
            heroInfo.classList.remove('visible');
            heroInfo.style.opacity = '0';
        } else if (p > heroFadeStart) {
            heroInfo.classList.add('visible');
            heroInfo.style.opacity = String(Math.max(0, 1 - (p - heroFadeStart) / 0.06));
        } else {
            heroInfo.classList.add('visible');
            heroInfo.style.opacity = '';
        }

        // scroll hint stays visible longer
        if (scrollHint) {
            var scrollHideThreshold = isMobile ? 0.68 : 0.66;
            var scrollFadeStart = scrollHideThreshold - 0.10;
            if (p > scrollHideThreshold) {
                scrollHint.classList.remove('visible');
                scrollHint.style.opacity = '0';
            } else if (p > scrollFadeStart) {
                scrollHint.classList.add('visible');
                scrollHint.style.opacity = String(Math.max(0, 1 - (p - scrollFadeStart) / 0.10));
            } else {
                if (heroReady) scrollHint.classList.add('visible');
                scrollHint.style.opacity = '';
            }
        }
    }

    /* ═══════════════════════════════════════════════════════════
       PARTICLES  OPACITY
       ═══════════════════════════════════════════════════════════ */
    function updateParticles(p) {
        particles.setOpacity(p < 0.5 ? 0.35 * (1 - p / 0.5) : 0);
    }

    /* ═══════════════════════════════════════════════════════════
       DOM  ELEMENTS
       ═══════════════════════════════════════════════════════════ */
    var canvasOverlay  = document.getElementById('canvas-overlay');
    var bgGrid         = document.getElementById('bg-grid');
    var progressBar    = document.getElementById('progress-bar');
    var navBar         = document.getElementById('nav-bar');
    var navToggle      = document.getElementById('navToggle');
    var navLinks       = document.getElementById('navLinksDesktop');
    var mobileMenu     = document.getElementById('mobileMenu');
    var navLogo        = document.querySelector('.nav-logo');

    // ── Mobile nav ────────────────────────────────────────────
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = mobileMenu.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
        });

        // Close mobile menu when a link is clicked
        mobileMenu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                mobileMenu.classList.remove('open');
                navToggle.classList.remove('active');
                if (!href || href.startsWith('http')) return;
                e.preventDefault();
                if (href === '#home' || href === '#') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                var target = document.querySelector(href);
                if (target) {
                    var y = target.getBoundingClientRect().top + window.scrollY - 72;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (mobileMenu.classList.contains('open') && 
                !mobileMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                mobileMenu.classList.remove('open');
                navToggle.classList.remove('active');
            }
        });

        // Prevent clicks inside menu from closing it
        mobileMenu.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // Desktop nav links — smooth scroll
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (!href || href.startsWith('http')) return;
                e.preventDefault();
                if (href === '#home' || href === '#') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                var target = document.querySelector(href);
                if (target) {
                    var y = target.getBoundingClientRect().top + window.scrollY - 72;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            });
        });
    }

    // Logo click scrolls to top
    if (navLogo) {
        navLogo.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Hero section CTA buttons
    document.querySelectorAll('.hero-btn[href^="#"]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                var y = target.getBoundingClientRect().top + window.scrollY - 72;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    /* ═══════════════════════════════════════════════════════════
       CONTENT-SECTION  REVEAL  (Intersection Observer)
       ═══════════════════════════════════════════════════════════ */
    var csInners = document.querySelectorAll('.cs-inner');

    // ── Stat counter animation ────────────────────────────────
    function animateCounter(el, target, duration) {
        var start = 0, startTime = null;
        var step = function (ts) {
            if (!startTime) startTime = ts;
            var elapsed = ts - startTime;
            var progress = Math.min(elapsed / duration, 1);
            // ease out
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString();
        };
        requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    // Trigger stat counters when reach section visible
                    var statNums = e.target.querySelectorAll('.cs-stat-num[data-target]');
                    statNums.forEach(function (numEl) {
                        var target = parseInt(numEl.getAttribute('data-target'), 10);
                        animateCounter(numEl, target, 1800);
                    });
                }
            });
        }, { threshold: 0.12 });
        csInners.forEach(function (el) { io.observe(el); });
    } else {
        csInners.forEach(function (el) {
            el.classList.add('visible');
            el.querySelectorAll('.cs-stat-num[data-target]').forEach(function (numEl) {
                numEl.textContent = parseInt(numEl.getAttribute('data-target'), 10).toLocaleString();
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════
       CACHED  LAYOUT  VALUES
       ═══════════════════════════════════════════════════════════ */
    var spacerBottom = 0;
    function cacheLayout() {
        var sp = document.getElementById('scroll-spacer');
        spacerBottom = sp.offsetTop + sp.offsetHeight;
    }
    window.addEventListener('resize', cacheLayout);
    setTimeout(cacheLayout, 60);

    /* ═══════════════════════════════════════════════════════════
       MAIN  RENDER  CALLBACK
       ═══════════════════════════════════════════════════════════ */
    var lastProg = -1;

    function mainLoop(dt, elapsed) {
        var p = scrollProgress;

        // ── Camera (always runs for Phase-1 drift) ────────────
        lerpCam(p);
        if (p < 0.15) {
            camera.position.x += Math.sin(elapsed * 0.30) * 0.12;
            camera.position.y += Math.cos(elapsed * 0.22) * 0.08;
        }

        // ── Progress-dependent updates (skip if unchanged) ───
        if (Math.abs(p - lastProg) > 0.0001) {
            buildings.updateMorph(p);
            buildings.updateVisibility(p);
            updateLighting(p);
            updateParticles(p);
            updateHero(p);

            // Nav visibility
            if (p > 0.35)  navBar.classList.add('visible');
            else           navBar.classList.remove('visible');

            lastProg = p;
        }

        // ── Progress bar (total page scroll) ──────────────────
        var totalH = document.documentElement.scrollHeight - window.innerHeight;
        var pct    = totalH > 0 ? (window.scrollY / totalH) * 100 : 0;
        progressBar.style.width = pct + '%';

        // ── Canvas overlay for content readability ────────────
        var scrollY = window.scrollY || window.pageYOffset;
        if (scrollY > spacerBottom - window.innerHeight * 0.6) {
            canvasOverlay.classList.add('active');
        } else {
            canvasOverlay.classList.remove('active');
        }

        // ── Background grid visibility (only on home section) ──
        if (bgGrid) {
            if (scrollY > spacerBottom - window.innerHeight * 0.3) {
                var fadeOutProgress = (scrollY - (spacerBottom - window.innerHeight * 0.3)) / (window.innerHeight * 0.5);
                bgGrid.style.opacity = Math.max(0, 1 - fadeOutProgress);
            } else {
                bgGrid.style.opacity = '1';
            }
        }
    }

    C.addRenderCallback(mainLoop);
})();
