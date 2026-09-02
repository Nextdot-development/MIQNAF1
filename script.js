// ========== NAVBAR & SCROLL ==========
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-links');
    const sections = document.querySelectorAll('section[id]');

    // The link for each section, resolved once instead of on every scroll event.
    const sectionLinks = Array.from(sections).map((section) => ({
        section,
        link: document.querySelector('.nav-links a[href*=' + section.getAttribute('id') + ']'),
    })).filter((entry) => entry.link);

    let activeLink = null;

    function updateActiveLink() {
        const scrollY = window.pageYOffset;
        // Every offsetTop/offsetHeight read is a layout, so they all happen
        // before any class is written — interleaving the two forced a fresh
        // layout per section on every scroll event.
        let found = null;
        for (const entry of sectionLinks) {
            const top = entry.section.offsetTop - 100;
            if (scrollY > top && scrollY <= top + entry.section.offsetHeight) {
                found = entry.link;
                break;
            }
        }
        if (found === activeLink) return;
        activeLink?.classList.remove('active');
        found?.classList.add('active');
        activeLink = found;
    }

    let navTicking = false;

    function onNavScroll() {
        navTicking = false;
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveLink();
        if (window.innerWidth <= 992 && navMenu?.classList.contains('active')) {
            menuToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    }

    window.addEventListener('scroll', () => {
        if (navTicking) return;
        navTicking = true;
        requestAnimationFrame(onNavScroll);
    }, { passive: true });

    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // ---- anchor jumps ----
    // Several sections above the fold grow as their images and reveal
    // animations settle, so the browser's native fragment jump — whose offset
    // is fixed the moment it fires — can land short of the target and leave
    // you staring at the blank run-up to a section. Recomputing the position
    // at click time (layout settled by then) puts the heading where the CSS
    // scroll-margin says it should be.
    function scrollToHash(hash, behavior) {
        let target = null;
        try { target = document.querySelector(hash); } catch (e) { return false; }
        if (!target) return false;

        const offsetFor = (el) => parseFloat(getComputedStyle(el).scrollMarginTop)
                               || (navbar?.offsetHeight || 0) + 18;
        const positionFor = (el) => Math.max(
            0, el.getBoundingClientRect().top + window.pageYOffset - offsetFor(el)
        );

        window.scrollTo({ top: positionFor(target), behavior: behavior || 'smooth' });

        // Images above the target can finish loading mid-scroll and shift it,
        // so re-check once the scroll has settled — unless the reader has
        // taken over in the meantime.
        let takenOver = false;
        const release = () => { takenOver = true; };
        ['wheel', 'touchstart', 'keydown'].forEach(
            (ev) => window.addEventListener(ev, release, { once: true, passive: true })
        );
        setTimeout(() => {
            ['wheel', 'touchstart', 'keydown'].forEach(
                (ev) => window.removeEventListener(ev, release)
            );
            if (takenOver) return;
            const settled = positionFor(target);
            if (Math.abs(settled - window.pageYOffset) > 10) {
                window.scrollTo({ top: settled, behavior: 'auto' });
            }
        }, 700);

        return true;
    }

    document.querySelectorAll('.navbar a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const hash = link.getAttribute('href');
            if (!hash || hash === '#') return;
            if (scrollToHash(hash)) {
                e.preventDefault();
                history.replaceState(null, '', hash);
            }
        });
    });

    // Deep links (/#doctor-video) land before images have reserved their space,
    // so re-apply the same offset once everything has loaded.
    if (window.location.hash) {
        const deepLink = window.location.hash;
        window.addEventListener('load', () => {
            setTimeout(() => scrollToHash(deepLink, 'auto'), 60);
        });
    }
}

// ========== SCROLL ANIMATIONS ==========
function initializeScrollAnimations() {
    const observerOptions = { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-on-scroll, .slide-fade, .reveal-on-scroll').forEach(el => observer.observe(el));

    document.querySelectorAll('.stagger-children').forEach((group) => {
        group.querySelectorAll(':scope > *').forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.12}s`;
        });
    });

    document.querySelectorAll('.slide-fade').forEach((slide, index) => {
        const image = slide.querySelector('.slide-image');
        const text = slide.querySelector('.slide-text');
        if (!image || !text) return;

        if (index % 2 === 1) {
            image.classList.add('reveal-from-right');
            text.classList.add('reveal-from-left');
        } else {
            image.classList.add('reveal-from-left');
            text.classList.add('reveal-from-right');
        }
    });
}

// ========== PAGE LOAD ANIMATIONS ==========
function initializePageAnimations() {
    requestAnimationFrame(() => {
        document.body.classList.add('page-loaded');
    });
}

// ========== DROPDOWN TOGGLE ==========
// Accessible listbox pattern: each .filter-table is a button (.filter-selected)
// that toggles a role="listbox". Fully operable by mouse AND keyboard, with
// aria-expanded / aria-selected kept in sync for screen readers.
function initializeDropdowns() {
    const tables = document.querySelectorAll('#doctor .filter-table');

    // Visible options only — the currently-selected option is hidden via display:none.
    const visibleOptions = (list) =>
        [...list.querySelectorAll('.filter-option')].filter(o => o.style.display !== 'none');

    const openTable = (table) => {
        tables.forEach(t => { if (t !== table) t.classList.remove('is-open'); });
        table.classList.add('is-open');
    };
    const closeTable = (table) => table.classList.remove('is-open');
    const toggleList = (table) => {
        if (table.classList.contains('is-open')) closeTable(table);
        else openTable(table);
    };

    tables.forEach(table => {
        const head = table.querySelector('.filter-head');
        const trigger = table.querySelector('.filter-selected');
        const list = table.querySelector('.filter-list');

        // Keep aria-expanded synced with the .is-open class, whoever toggles it.
        if (trigger) {
            const sync = () => trigger.setAttribute(
                'aria-expanded', table.classList.contains('is-open') ? 'true' : 'false');
            new MutationObserver(sync).observe(table, { attributes: true, attributeFilter: ['class'] });
            sync();
        }

        if (head) head.addEventListener('click', (e) => { e.stopPropagation(); toggleList(table); });
        if (trigger) trigger.addEventListener('click', (e) => { e.stopPropagation(); toggleList(table); });

        // ---- Keyboard: on the trigger button ----
        trigger?.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                case ' ':
                case 'ArrowDown': {
                    e.preventDefault();
                    openTable(table);
                    visibleOptions(list)[0]?.focus();
                    break;
                }
                case 'ArrowUp': {
                    e.preventDefault();
                    openTable(table);
                    const opts = visibleOptions(list);
                    opts[opts.length - 1]?.focus();
                    break;
                }
                case 'Escape':
                    closeTable(table);
                    break;
            }
        });

        // ---- Keyboard: while focus is inside the listbox ----
        list?.addEventListener('keydown', (e) => {
            const opts = visibleOptions(list);
            if (!opts.length) return;
            const current = document.activeElement;
            const i = opts.indexOf(current);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    opts[i < 0 ? 0 : Math.min(i + 1, opts.length - 1)].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    opts[i < 0 ? opts.length - 1 : Math.max(i - 1, 0)].focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    opts[0].focus();
                    break;
                case 'End':
                    e.preventDefault();
                    opts[opts.length - 1].focus();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    current?.click();        // existing handlers select + close
                    trigger?.focus();
                    break;
                case 'Escape':
                    e.preventDefault();
                    closeTable(table);
                    trigger?.focus();
                    break;
                case 'Tab':
                    closeTable(table);       // let focus leave naturally
                    break;
            }
        });
    });

    document.querySelectorAll('#doctor .filter-list').forEach(list => {
        list.addEventListener('click', (e) => {
            const option = e.target.closest('.filter-option');
            if (!option) return;
            e.stopPropagation();
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#doctor .filter-table')) {
            tables.forEach(t => t.classList.remove('is-open'));
        }
    });
}

// ========== DOCTOR SYSTEM ==========
function initializeDoctorSystem() {

    function getVideoUrl(doctorInfo) {
        if (!doctorInfo) return '';
        if (doctorInfo.type === 'gdrive') {
            const base = doctorInfo.video || '';
            const preview = base.includes('/preview') ? base : base.replace('/view', '/preview');
            return preview + (preview.includes('?') ? '&' : '?') + 'autoplay=1';
        }
        if (doctorInfo.type === 'youtube') {
            return 'https://www.youtube.com/embed/' + doctorInfo.videoId
                 + '?autoplay=1&rel=0&enablejsapi=1';
        }
        return doctorInfo.video || '';
    }

    // Doctor data — each entry has a local thumbnail path + video URL.
    // Entries whose video/thumb are not in yet simply omit them; the UI then
    // falls back to a branded "video coming soon" card instead of a broken image.
    const data = {
        mumbai: [
            {
                doctor: 'Dr. Sonam Solanki',
                spec: 'Pulmonologist',
                hospitals: ['INICIO Chest Clinic, Lalbagh'],
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/136k8m5DCus7-WLW-_p7tW2H7bIOGct2I/preview',
                thumb: 'thumbnails/dr-sonam-solanki.jpg'
            },
            {
                doctor: 'Dr. Sameer Garde',
                spec: 'Interventional Pulmonologist',
                hospitals: ['Gleneagles Hospital, Parel', 'S. L. Raheja Hospital, Mahim'],
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/198uucZxoxBuoo5_iNCcReJmi6hub1yAw/preview',
                thumb: 'thumbnails/dr-sameer-garde.jpg'
            },
            {
                doctor: 'Dr. Swami Pawar',
                spec: 'Consultant Pulmonologist & ICU In-Charge',
                hospitals: ['Thunga Hospital, Malad', 'Thunga Hospital, Mira Road'],
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/17dEXA8utX1hWI_WF3ytw94NWPOwZZqWo/preview',
                thumb: 'thumbnails/dr-swami-pawar.jpg'
            }
        ],
        chennai: [
            {
                doctor: 'Dr. Suresh Kanna S',
                spec: 'Consultant Physician & Diabetologist',
                hospitals: ['Sree Balaji Medical College & Hospital, Chromepet'],
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/1SQ-FZVNxu8OxvvxQ599UyW6ekK79DxmZ/preview',
                thumb: 'thumbnails/dr-suresh-kanna.jpg'
            }
        ],
        kolkata: [
            {
                doctor: 'Dr. Indranil Haldar',
                spec: 'Professor & Head of the Department, Pulmonary Medicine',
                hospitals: ['College of Medicine and JNM Hospital, Kalyani, Nadia'],
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/1AHWJVx6kVciOn16FezpDPFX64hIhioqi/preview',
                thumb: 'thumbnails/dr-indranil-haldar.jpg'
            },
            {
                doctor: 'Dr. Raja Dhar',
                spec: 'Head of the Department, Pulmonology',
                hospitals: ['CK Birla Hospital, Kolkata'],
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/1NjwexlkM1IxdVlh1rjB8gB2E_h2IwSda/preview',
                thumb: 'thumbnails/dr-raja-dhar.jpg'
            }
        ],
        delhi: [
            {
                doctor: 'Dr. Randeep Guleria',
                spec: 'Chairman – Internal Medicine, Respiratory & Sleep Medicine',
                hospitals: ['Medanta Hospital, Gurugram'],
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/14JasufTbBaFpZEFLZwKLfm_TFlHNaqOb/preview',
                thumb: 'thumbnails/dr-randeep-guleria.jpg'
            }
        ]
    };

    // Elements
    const cityDropdown = document.getElementById('city-dropdown');
    const docDropdown  = document.getElementById('doc-dropdown');
    const cityText     = document.getElementById('city-selected-text');
    const docText      = document.getElementById('doctor-selected-text');
    const displayName  = document.getElementById('display-name');
    const displaySpec  = document.getElementById('display-spec');
    const displayHosp  = document.getElementById('display-hospital');
    const displayThumb = document.getElementById('display-thumbnail');
    const placeholder  = document.getElementById('display-placeholder');
    const docList      = document.querySelector('.doc-list');
    const videoContainer = document.getElementById('video-container');

    const playBtn      = document.getElementById('display-play-btn');

    let currentCity = 'mumbai';
    let currentDoctorIndex = 0;

    // ---- Display helpers ----
    function getCityTitle(cityKey) {
        return cityKey.charAt(0).toUpperCase() + cityKey.slice(1);
    }

    function updateCityOptions(selectedCity) {
        document.querySelectorAll('.city-option').forEach(opt => {
            const isSelected = opt.getAttribute('data-city') === selectedCity;
            opt.style.display = isSelected ? 'none' : 'block';
            opt.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });
    }

    function renderDoctorOptions(cityKey, selectedIndex) {
        const doctors = data[cityKey] || [];
        if (!docList) return;
        docList.innerHTML = '';
        doctors.forEach((doctor, idx) => {
            const opt = document.createElement('div');
            opt.className = 'filter-option doc-option';
            opt.setAttribute('role', 'option');
            opt.setAttribute('tabindex', '-1');
            opt.setAttribute('aria-selected', idx === selectedIndex ? 'true' : 'false');
            opt.setAttribute('data-city', cityKey);
            opt.setAttribute('data-index', String(idx));
            opt.setAttribute('data-name', doctor.doctor);
            opt.textContent = doctor.doctor;
            if (idx === selectedIndex) opt.style.display = 'none';
            docList.appendChild(opt);
        });
    }

    function clearIframes() {
        videoContainer?.querySelectorAll('iframe').forEach(el => el.remove());
    }

    // A doctor is only playable once both a thumbnail and a video source exist.
    function hasVideo(doctorInfo) {
        if (!doctorInfo) return false;
        return doctorInfo.type === 'youtube' ? Boolean(doctorInfo.videoId) : Boolean(doctorInfo.video);
    }

    // Branded stand-in shown when a doctor's thumbnail/video is not in yet —
    // keeps the card intact instead of rendering a broken image.
    function showPlaceholder(doctorInfo) {
        if (!placeholder) return;
        const nameEl = placeholder.querySelector('.doctor-thumb-placeholder-name');
        if (nameEl) nameEl.textContent = doctorInfo?.doctor || '';
        placeholder.hidden = false;
    }

    function hidePlaceholder() {
        if (placeholder) placeholder.hidden = true;
    }

    function restoreThumbnail(doctorInfo) {
        clearIframes();
        const thumb = doctorInfo && doctorInfo.thumb;
        if (displayThumb) {
            if (thumb) {
                displayThumb.src = thumb;
                displayThumb.alt = doctorInfo.doctor;
                displayThumb.style.display = '';
            } else {
                displayThumb.removeAttribute('src');
                displayThumb.alt = '';
                displayThumb.style.display = 'none';
            }
        }
        if (thumb) hidePlaceholder(); else showPlaceholder(doctorInfo);
        if (playBtn) playBtn.style.display = hasVideo(doctorInfo) ? '' : 'none';
    }

    function updateThumbnailDisplay(doctorInfo) {
        restoreThumbnail(doctorInfo);

        if (!videoContainer) return;

        // No video for this doctor yet — leave the card static rather than
        // opening an empty iframe.
        if (!hasVideo(doctorInfo)) {
            videoContainer.style.cursor = 'default';
            videoContainer.onclick = null;
            return;
        }

        videoContainer.style.cursor = 'pointer';
        videoContainer.onclick = () => {
            hidePlaceholder();
            if (displayThumb) displayThumb.style.display = 'none';
            if (playBtn) playBtn.style.display = 'none';

            const iframe = document.createElement('iframe');
            iframe.src = getVideoUrl(doctorInfo);
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.style.cssText =
                'position:absolute;top:0;left:0;width:100%;height:100%;' +
                'border:0;border-radius:25px;z-index:2;';
            videoContainer.appendChild(iframe);

            if (doctorInfo.type === 'youtube') {
                iframe.addEventListener('load', () => {
                    iframe.contentWindow?.postMessage(
                        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
                    );
                });
            }

            videoContainer.style.cursor = 'default';
            videoContainer.onclick = null;
        };
    }

    function showEmptyCityState(cityKey) {
        currentCity = cityKey;
        currentDoctorIndex = -1;
        cityText.textContent = getCityTitle(cityKey);
        docText.textContent = 'No doctor added yet';
        displayName.textContent = '';
        displaySpec.textContent = '';
        if (displayHosp) displayHosp.innerHTML = '';
        clearIframes();
        if (displayThumb) { displayThumb.removeAttribute('src'); displayThumb.alt = ''; displayThumb.style.display = 'none'; }
        showPlaceholder(null);
        if (playBtn) playBtn.style.display = 'none';
        if (videoContainer) { videoContainer.style.cursor = ''; videoContainer.onclick = null; }
        updateCityOptions(cityKey);
        renderDoctorOptions(cityKey, -1);
    }

    function selectDoctor(cityKey, doctorIndex) {
        const doctors = data[cityKey];
        if (!doctors || !doctors[doctorIndex]) {
            console.error('❌ Unknown doctor for city:', cityKey, doctorIndex);
            return;
        }

        const info = doctors[doctorIndex];
        currentCity = cityKey;
        currentDoctorIndex = doctorIndex;

        const doctorInfoEl = document.querySelector('.doctor-info');
        doctorInfoEl?.classList.remove('is-updating');
        void doctorInfoEl?.offsetWidth;
        doctorInfoEl?.classList.add('is-updating');

        displayName.textContent = info.doctor;
        displaySpec.textContent = info.spec;
        if (displayHosp) {
            // one line per institution — two of the doctors practise at two
            displayHosp.innerHTML = '';
            (info.hospitals || []).forEach((h) => {
                const line = document.createElement('span');
                line.textContent = h;
                displayHosp.appendChild(line);
            });
        }
        docText.textContent = info.doctor;
        cityText.textContent = getCityTitle(cityKey);

        if (displayThumb) {
            displayThumb.classList.remove('thumb-swapping');
            void displayThumb.offsetWidth;
            displayThumb.classList.add('thumb-swapping');
        }
        updateThumbnailDisplay(info);
        updateCityOptions(cityKey);
        renderDoctorOptions(cityKey, doctorIndex);
    }

    function selectCity(cityKey) {
        if (!data[cityKey]) {
            console.error('❌ Unknown city:', cityKey);
            return;
        }

        if (data[cityKey].length === 0) {
            showEmptyCityState(cityKey);
            return;
        }

        selectDoctor(cityKey, 0);
    }

    // Attach city option clicks
    document.querySelectorAll('.city-option').forEach((opt) => {
        opt.addEventListener('click', (e) => {
            const cityKey = opt.getAttribute('data-city');
            e.stopPropagation();
            e.preventDefault();
            selectCity(cityKey);
            cityDropdown.classList.remove('is-open');
        }, false);
    });

    // Attach doctor option clicks via event delegation (supports dynamic doctor list)
    docList?.addEventListener('click', (e) => {
        const option = e.target.closest('.doc-option');
        if (!option) return;

        const cityKey = option.getAttribute('data-city') || currentCity;
        const doctorIndex = Number(option.getAttribute('data-index') || '0');
        e.stopPropagation();
        e.preventDefault();
        selectDoctor(cityKey, doctorIndex);
        docDropdown.classList.remove('is-open');
    });

    // Initial state
    selectDoctor(currentCity, currentDoctorIndex);
}

// ========== BOUNCING TITLE ==========
function initializeBouncingTitles() {
    document.querySelectorAll('.bouncing-title').forEach((el) => {
        const raw = el.dataset.text || el.textContent || '';
        el.textContent = '';

        let charIndex = 0;

        raw.split(/[\n|]/).forEach((line, lineIndex) => {
            if (lineIndex > 0) {
                el.appendChild(document.createElement('br'));
                charIndex = 0;
            }

            line.trim().split(/\s+/).filter(Boolean).forEach((word, wordIndex) => {
                if (wordIndex > 0) {
                    const space = document.createElement('span');
                    space.className = 'bounce-char';
                    space.textContent = '\u00A0';
                    space.style.animationDelay = `${charIndex * 0.03}s`;
                    charIndex += 1;
                    el.appendChild(space);
                }

                const wordWrap = document.createElement('span');
                wordWrap.className = 'bounce-word';

                [...word].forEach((char) => {
                    const span = document.createElement('span');
                    span.className = 'bounce-char';
                    span.textContent = char;
                    span.style.animationDelay = `${charIndex * 0.03}s`;
                    charIndex += 1;
                    wordWrap.appendChild(span);
                });

                el.appendChild(wordWrap);
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                el.classList.add('is-visible');
                observer.disconnect();
            });
        }, { threshold: 0.4 });

        observer.observe(el);
    });
}

// ========== STATS CIRCLE ANIMATION ==========
function initializeStatsCircles() {
    const R = 44;
    const CIRCUMFERENCE = 2 * Math.PI * R;
    const cards = document.querySelectorAll('.stats-circle-card');

    cards.forEach((card) => {
        const prefix = card.dataset.prefix || '';
        const target = Number(card.dataset.target || '0');
        const max = Number(card.dataset.max || '100');
        const suffix = card.dataset.suffix || '';
        const counterEl = card.querySelector('.stats-counter');
        const progressEl = card.querySelector('.stats-ring-progress');
        if (!counterEl || !progressEl) return;

        const arcLength = (target / max) * CIRCUMFERENCE;
        const finalOffset = CIRCUMFERENCE - arcLength;

        function animateCounter() {
            const duration = 1500;
            const start = performance.now();

            function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const count = Math.round(eased * target);
                counterEl.textContent = `${prefix}${count}${suffix}`;
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    // Little pop once the number lands on its final value.
                    counterEl.classList.remove('stats-pop');
                    void counterEl.offsetWidth;
                    counterEl.classList.add('stats-pop');
                }
            }

            requestAnimationFrame(tick);
        }

        function startAnimation() {
            progressEl.classList.add('is-animated');
            progressEl.style.strokeDashoffset = String(finalOffset);
            animateCounter();
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                const delay = Number(card.dataset.delay || '0');
                setTimeout(startAnimation, 1000 + delay);
            });
        }, { threshold: 0.5 });

        observer.observe(card);
    });
}

// ========== EXTRA SCROLL REVEALS ==========
// Adds the existing fade-up motion to sections that previously appeared
// with no animation (timeline entries, stats footer row, copyright).
// Pure motion enhancement — no content, color, or layout changes.
function initializeExtraReveals() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const groups = [
        { selector: '.about-bridge-row', stagger: 0 },
        { selector: '.about-timeline-gif', stagger: 0 },
        { selector: '.about-timeline-entry', stagger: 0.1 },
        { selector: '.about-2025-block, .about-india-block', stagger: 0.12 },
        { selector: '.about-footnote', stagger: 0 },
        { selector: '#video-container', stagger: 0, cls: 'mi-zoom' },
        { selector: '.stats-qr-overlay', stagger: 0 },
        { selector: '.stats-ref-heading, .ref-text', stagger: 0.08 },
        { selector: '.footer-bottom', stagger: 0 }
    ];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });

    groups.forEach((group) => {
        document.querySelectorAll(group.selector).forEach((el, index) => {
            el.classList.add(group.cls || 'mi-rise');
            if (group.stagger) el.style.transitionDelay = `${index * group.stagger}s`;
            observer.observe(el);
        });
    });
}

// ========== SCROLL PROGRESS BAR ==========
// Thin brand-gradient bar at the top that fills as the page is scrolled.
function initializeScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    let ticking = false;

    function update() {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const ratio = max > 0 ? window.pageYOffset / max : 0;
        bar.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
}

// ========== 3D TILT ==========
// Subtle pointer-following 3D tilt on the stats cards and the doctor
// video thumbnail. Desktop pointers only; off under reduced-motion.
function initializeTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const targets = [
        ...document.querySelectorAll('.stats-circle-card'),
        document.getElementById('video-container')
    ].filter(Boolean);

    const MAX = 7; // degrees

    targets.forEach((el) => {
        el.classList.add('mi-tilt');

        // The card cannot move while it is being hovered, so its box is measured
        // once on entry rather than on every mousemove (each of those reads was
        // forcing a synchronous layout), and the transform is written once a frame.
        let rect = null;
        let tiltRaf = null;
        let mx = 0;
        let my = 0;

        function paint() {
            tiltRaf = null;
            if (!rect) return;
            const px = (mx - rect.left) / rect.width - 0.5;
            const py = (my - rect.top) / rect.height - 0.5;
            el.style.transform =
                `perspective(800px) rotateX(${(-py * MAX).toFixed(2)}deg) ` +
                `rotateY(${(px * MAX).toFixed(2)}deg) translateY(-4px)`;
        }

        el.addEventListener('mouseenter', () => { rect = el.getBoundingClientRect(); }, { passive: true });

        el.addEventListener('mousemove', (e) => {
            if (!rect) rect = el.getBoundingClientRect();
            mx = e.clientX;
            my = e.clientY;
            if (tiltRaf == null) tiltRaf = requestAnimationFrame(paint);
        }, { passive: true });

        el.addEventListener('mouseleave', () => {
            if (tiltRaf != null) { cancelAnimationFrame(tiltRaf); tiltRaf = null; }
            rect = null;
            el.style.transform = '';
        });
    });
}

// ========== RIPPLE ==========
// Material-style click ripple on a host element.
function addRipple(el) {
    el.classList.add('mi-ripple-host');
    el.addEventListener('click', (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const r = el.getBoundingClientRect();
        const size = Math.max(r.width, r.height) * 2;
        const span = document.createElement('span');
        span.className = 'mi-ripple';
        span.style.width = span.style.height = `${size}px`;
        span.style.left = `${e.clientX - r.left - size / 2}px`;
        span.style.top = `${e.clientY - r.top - size / 2}px`;
        el.appendChild(span);
        span.addEventListener('animationend', () => span.remove());
    });
}

function initializeRipples() {
    document.querySelectorAll('.filter-head, .filter-selected').forEach(addRipple);
}

// ========== BACK TO TOP ==========
// Floating button that appears after scrolling and smooth-scrolls up.
function initializeBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 14 12 8 18 14"></polyline></svg>';
    document.body.appendChild(btn);

    let ticking = false;
    function update() {
        btn.classList.toggle('is-visible', window.pageYOffset > 500);
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }, { passive: true });

    btn.addEventListener('click', () => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

    // Magnetic: the button leans toward the cursor while hovered.
    const canMagnet = window.matchMedia('(hover: hover) and (pointer: fine)').matches
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (canMagnet) {
        let btnRect = null;
        let magRaf = null;
        let magX = 0;
        let magY = 0;

        function magnet() {
            magRaf = null;
            if (!btnRect) return;
            const mx = magX - (btnRect.left + btnRect.width / 2);
            const my = magY - (btnRect.top + btnRect.height / 2);
            btn.style.transform = `translate(${(mx * 0.35).toFixed(1)}px, ${(my * 0.35).toFixed(1)}px) scale(1.08)`;
        }

        // Measured on entry, untransformed — measuring mid-lean would feed the
        // button's own offset back into the next frame.
        btn.addEventListener('mouseenter', () => { btnRect = btn.getBoundingClientRect(); }, { passive: true });

        btn.addEventListener('mousemove', (e) => {
            if (!btnRect) btnRect = btn.getBoundingClientRect();
            magX = e.clientX;
            magY = e.clientY;
            if (magRaf == null) magRaf = requestAnimationFrame(magnet);
        }, { passive: true });

        btn.addEventListener('mouseleave', () => {
            if (magRaf != null) { cancelAnimationFrame(magRaf); magRaf = null; }
            btnRect = null;
            btn.style.transform = '';
        });
    }

    update();
}

// ========== HERO SCROLL CUE ==========
// A bouncing chevron at the bottom of the hero that scrolls down on
// click and fades away once the user starts scrolling.
function initializeHeroScrollCue() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const cue = document.createElement('button');
    cue.className = 'hero-scroll-cue';
    cue.setAttribute('aria-label', 'Scroll down');
    cue.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    hero.appendChild(cue);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    cue.addEventListener('click', () => {
        window.scrollTo({
            top: Math.round(window.innerHeight * 0.9),
            behavior: reduce ? 'auto' : 'smooth'
        });
    });

    let ticking = false;
    function onScroll() {
        cue.classList.toggle('is-hidden', window.pageYOffset > 120);
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(onScroll);
    }, { passive: true });
    onScroll();
}

// ========== SLIDE IMAGE PARALLAX ==========
// Each clinical-slide image drifts gently as its slide moves through the
// viewport, adding depth. Desktop only; off under reduced-motion.
function initializeScrollParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(min-width: 993px)').matches) return;

    const frames = [...document.querySelectorAll('.content-slides .img-frame')];
    if (!frames.length) return;

    let ticking = false;
    function update() {
        const vh = window.innerHeight;
        frames.forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.bottom < -120 || r.top > vh + 120) return;
            const center = r.top + r.height / 2;
            const delta = (center - vh / 2) / vh;
            el.style.transform = `translate3d(0, ${(delta * -26).toFixed(1)}px, 0)`;
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
}

// ========== HERO PARALLAX ==========
// Subtle depth: the hero text drifts a touch slower than the scroll,
// giving a layered feel against the floating people image. Desktop only,
// and disabled under reduced-motion. No layout/color/content change.
function initializeHeroParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(min-width: 993px)').matches) return;

    const heroText = document.querySelector('.hero-text');
    const hero = document.querySelector('.hero');
    if (!heroText || !hero) return;

    let ticking = false;

    function update() {
        const y = window.pageYOffset;
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        // Only apply while the hero is on/near screen.
        if (y <= heroBottom) {
            heroText.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }, { passive: true });

    update();
}

// ========== HERO POINTER PARALLAX ==========
// The hero people image leans gently toward the cursor, adding depth that
// reacts to the user. Desktop pointers only; off under reduced-motion.
// Writes normalized -0.5..0.5 values into CSS vars the stylesheet consumes,
// so it never fights the existing scroll/float transforms on other layers.
function initializeHeroPointerParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const hero = document.querySelector('.hero');
    const layer = document.querySelector('.hero-people-layer');
    if (!hero || !layer) return;

    document.body.classList.add('mi-hero-parallax-ready');

    let ticking = false;
    let px = 0;
    let py = 0;

    function apply() {
        layer.style.setProperty('--mi-px', px.toFixed(3));
        layer.style.setProperty('--mi-py', py.toFixed(3));
        // Same normalized values on the hero itself so the ambient aurora
        // glows (its ::before / ::after) lean gently with the cursor too.
        hero.style.setProperty('--mi-px', px.toFixed(3));
        hero.style.setProperty('--mi-py', py.toFixed(3));
        ticking = false;
    }

    hero.addEventListener('mousemove', (e) => {
        const r = hero.getBoundingClientRect();
        px = (e.clientX - r.left) / r.width - 0.5;
        py = (e.clientY - r.top) / r.height - 0.5;
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(apply);
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
        px = 0;
        py = 0;
        requestAnimationFrame(apply);
    });
}

// ========== CUSTOM CURSOR ==========
function initializeCustomCursor() {
    const canUseCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canUseCursor) return;

    document.body.classList.add('custom-cursor-enabled');

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');

    document.body.append(dot, ring);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = null;

    const textSelector = 'h1, h2, h3, h4, p, span, li, .hero-headline-wrap, .stats-counter, .stats-value, .patient-body, .ref-text, .about-bridge-text, .about-entry-year, .about-entry-drug, .copyright-text';
    const interactiveSelector = 'a, button, [role="button"], .filter-table, .filter-head, .filter-selected, #video-container, input, select, textarea';

    // Matching those two selector lists means walking the ancestor chain, so it
    // only ever runs on mouseover (i.e. when the pointer actually enters a new
    // element) — never on mousemove, which fires far more often.
    let lastTarget = null;
    let lastState = '';

    function setRingState(target) {
        if (target === lastTarget) return;
        lastTarget = target;

        let state = '';
        if (target && !target.closest('.cursor-dot, .cursor-ring')) {
            if (target.closest(interactiveSelector)) state = 'is-hover';
            else if (target.closest(textSelector)) state = 'is-text';
        }
        if (state === lastState) return;

        if (lastState) ring.classList.remove(lastState);
        if (state) ring.classList.add(state);
        lastState = state;
    }

    function animateRing() {
        // Both the dot and the ring are written here, so a burst of mousemove
        // events collapses into one style write per frame instead of one each.
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        // Stop the loop once the ring has caught up to the pointer — avoids a
        // perpetual 60fps rAF running (and burning CPU) while the mouse is idle.
        if (Math.abs(mouseX - ringX) < 0.1 && Math.abs(mouseY - ringY) < 0.1) {
            rafId = null;
            return;
        }
        rafId = requestAnimationFrame(animateRing);
    }

    function startRing() {
        if (rafId == null) rafId = requestAnimationFrame(animateRing);
    }

    let cursorShown = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!cursorShown) {
            cursorShown = true;
            document.body.classList.add('custom-cursor-active');
        }
        startRing();
    }, { passive: true });

    document.addEventListener('mouseover', (e) => {
        setRingState(e.target);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        cursorShown = false;
        document.body.classList.remove('custom-cursor-active');
    });

    rafId = requestAnimationFrame(animateRing);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cursorShown = false;
            document.body.classList.remove('custom-cursor-active');
        }
    });
}

// ========== MAIN INIT ==========
let hasInitialized = false;

function initializeAll() {
    if (hasInitialized) {
        return;
    }
    hasInitialized = true;

    initializeNavbar();
    initializeCustomCursor();
    initializePageAnimations();
    initializeScrollAnimations();
    initializeDropdowns();
    initializeDoctorSystem();
    initializeBouncingTitles();
    initializeStatsCircles();
    initializeExtraReveals();
    initializeHeroParallax();
    initializeHeroPointerParallax();
    initializeScrollProgress();
    initializeTilt();
    initializeBackToTop();
    initializeScrollParallax();
    initializeHeroScrollCue();
    initializeRipples();
}

// Run when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}

setTimeout(initializeAll, 100);