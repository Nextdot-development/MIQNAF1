console.log('🔴 SCRIPT.JS LOADED');

// ========== NAVBAR & SCROLL ==========
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-links');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveLink();
        if (window.innerWidth <= 992 && navMenu?.classList.contains('active')) {
            menuToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    });

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
function initializeDropdowns() {
    const toggleList = (table) => {
        const isOpen = table.classList.contains('is-open');
        document.querySelectorAll('#doctor .filter-table').forEach(t => t.classList.remove('is-open'));
        if (!isOpen) table.classList.add('is-open');
    };

    document.querySelectorAll('#doctor .filter-table').forEach(table => {
        const head = table.querySelector('.filter-head');
        const sel = table.querySelector('.filter-selected');
        if (head) head.addEventListener('click', (e) => { e.stopPropagation(); toggleList(table); });
        if (sel) sel.addEventListener('click', (e) => { e.stopPropagation(); toggleList(table); });
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
            document.querySelectorAll('#doctor .filter-table').forEach(t => t.classList.remove('is-open'));
        }
    });
}

// ========== DOCTOR SYSTEM ==========
function initializeDoctorSystem() {
    console.log('🔧 Doctor System Initializing');

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

    // Doctor data — each entry has a local thumbnail path + video URL
    const data = {
        mumbai: [
            {
                doctor: 'Dr. Sonam Solanki',
                spec: 'Pulmonologist',
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/136k8m5DCus7-WLW-_p7tW2H7bIOGct2I/preview',
                thumb: 'thumbnails/dr-sonam-solanki.jpg'
            },
            {
                doctor: 'Dr. Sameer Garde',
                spec: 'Chest Physician',
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/198uucZxoxBuoo5_iNCcReJmi6hub1yAw/preview',
                thumb: 'thumbnails/dr-sameer-garde.jpg'
            },
            {
                doctor: 'Dr. Swami Pawar',
                spec: 'Chest Physician',
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/17dEXA8utX1hWI_WF3ytw94NWPOwZZqWo/preview',
                thumb: 'thumbnails/dr-swami-pawar.jpg'
            },
            {
                doctor: 'Dr. Harshal Shah',
                spec: 'Chest Physician',
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/1GNjlgCpFlLtvmcj35WTAhfI2DZjoOU_s/preview',
                thumb: 'thumbnails/dr-harshal-shah.jpg'
            },
            {
                doctor: 'Dr. Pankaj Bang',
                spec: 'Chest Physician',
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/1-vrNNm2iyvpHAOhktKApy7LFI4a5hKvk/preview',
                thumb: 'thumbnails/dr-pankaj-bang.jpg'
            },
            {
                doctor: 'Dr. Satyey G. Tayade',
                spec: 'Chest Physician',
                type: 'youtube',
                videoId: 'fZbT5g0hFTQ',
                thumb: 'thumbnails/dr-satyey-tayade.jpg'
            },
            {
                doctor: 'Dr. Parag Mehta',
                spec: 'Chest specialist',
                type: 'youtube',
                videoId: '64zcRFUmGDM',
                thumb: 'thumbnails/dr-parag-mehta.jpg'
            }
        ],
        chennai: [
            {
                doctor: 'Dr. Suresh Kanna S',
                spec: 'Chest Physician',
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/1SQ-FZVNxu8OxvvxQ599UyW6ekK79DxmZ/preview',
                thumb: 'thumbnails/dr-suresh-kanna.jpg'
            }
        ],
        punjab: [
            {
                doctor: 'Dr. Ajaypal Singh',
                spec: 'Chest Physician',
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/12JIsAz0wY59hSZEa_zdwBwrNfr957qVI/preview',
                thumb: 'thumbnails/dr-ajaypal-singh.jpg'
            },
            {
                doctor: 'Dr. Mohit Kaushal',
                spec: 'Consultant Pulmonology & Critical Care',
                type: 'gdrive',
                video: 'https://drive.google.com/file/d/1v-w3BlPxFEUZ9pXjhIxcQvop53Bow1lg/preview',
                thumb: 'thumbnails/dr-mohit-kaushal.jpg'
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
    const displayThumb = document.getElementById('display-thumbnail');
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
            opt.style.display = (opt.getAttribute('data-city') === selectedCity) ? 'none' : 'block';
        });
    }

    function renderDoctorOptions(cityKey, selectedIndex) {
        const doctors = data[cityKey] || [];
        if (!docList) return;
        docList.innerHTML = '';
        doctors.forEach((doctor, idx) => {
            const opt = document.createElement('div');
            opt.className = 'filter-option doc-option';
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

    function restoreThumbnail(doctorInfo) {
        clearIframes();
        if (displayThumb) {
            displayThumb.src    = doctorInfo.thumb || '';
            displayThumb.alt    = doctorInfo.doctor;
            displayThumb.style.display = '';
        }
        if (playBtn) playBtn.style.display = '';
    }

    function updateThumbnailDisplay(doctorInfo) {
        restoreThumbnail(doctorInfo);

        if (!videoContainer) return;

        videoContainer.style.cursor = 'pointer';
        videoContainer.onclick = () => {
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
        clearIframes();
        if (displayThumb) { displayThumb.src = ''; displayThumb.style.display = ''; }
        if (playBtn) playBtn.style.display = '';
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
        docText.textContent = info.doctor;
        cityText.textContent = getCityTitle(cityKey);

        console.log('📝 Updated:', info.doctor);
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
            console.log('ℹ️ City has no doctors yet:', cityKey);
            showEmptyCityState(cityKey);
            return;
        }

        selectDoctor(cityKey, 0);
    }

    // Attach city option clicks
    console.log('📌 Attaching city option clicks');
    document.querySelectorAll('.city-option').forEach((opt) => {
        opt.addEventListener('click', (e) => {
            const cityKey = opt.getAttribute('data-city');
            console.log('🏙️ City clicked:', cityKey);
            e.stopPropagation();
            e.preventDefault();
            selectCity(cityKey);
            cityDropdown.classList.remove('is-open');
        }, false);
    });

    // Attach doctor option clicks via event delegation (supports dynamic doctor list)
    console.log('📌 Attaching doctor option clicks');
    docList?.addEventListener('click', (e) => {
        const option = e.target.closest('.doc-option');
        if (!option) return;

        const cityKey = option.getAttribute('data-city') || currentCity;
        const doctorIndex = Number(option.getAttribute('data-index') || '0');
        console.log('👨‍⚕️ Doctor clicked:', cityKey, doctorIndex);
        e.stopPropagation();
        e.preventDefault();
        selectDoctor(cityKey, doctorIndex);
        docDropdown.classList.remove('is-open');
    });

    // Initial state
    console.log('🚀 Initializing with Mumbai');
    selectDoctor(currentCity, currentDoctorIndex);
    console.log('✨ Doctor System Ready');
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
                if (progress < 1) requestAnimationFrame(tick);
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

// ========== MAIN INIT ==========
let hasInitialized = false;

function initializeAll() {
    if (hasInitialized) {
        return;
    }
    hasInitialized = true;

    initializeNavbar();
    initializePageAnimations();
    initializeScrollAnimations();
    initializeDropdowns();
    initializeDoctorSystem();
    initializeBouncingTitles();
    initializeStatsCircles();
    console.log('✅ ALL SYSTEMS GO');
}

// Run when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}

setTimeout(initializeAll, 100);