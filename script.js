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
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-on-scroll').forEach(el => observer.observe(el));
}

// ========== DROPDOWN TOGGLE ==========
function initializeDropdowns() {
    const toggleList = (table) => {
        const isOpen = table.classList.contains('is-open');
        document.querySelectorAll('.filter-table').forEach(t => t.classList.remove('is-open'));
        if (!isOpen) table.classList.add('is-open');
    };

    document.querySelectorAll('.filter-table').forEach(table => {
        const head = table.querySelector('.filter-head');
        const sel = table.querySelector('.filter-selected');
        if (head) head.addEventListener('click', (e) => { e.stopPropagation(); toggleList(table); });
        if (sel) sel.addEventListener('click', (e) => { e.stopPropagation(); toggleList(table); });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-table')) {
            document.querySelectorAll('.filter-table').forEach(t => t.classList.remove('is-open'));
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

        // ── Preload the iframe now, hidden, so it's ready before the click ──
        const iframe = document.createElement('iframe');
        iframe.src = getVideoUrl(doctorInfo);
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.cssText =
            'position:absolute;top:0;left:0;width:100%;height:100%;' +
            'border:0;border-radius:25px;z-index:1;' +
            'visibility:hidden;pointer-events:none;';
        videoContainer.appendChild(iframe);

        videoContainer.style.cursor = 'pointer';
        videoContainer.onclick = () => {
            // Hide thumbnail and play button
            if (displayThumb) displayThumb.style.display = 'none';
            if (playBtn)      playBtn.style.display      = 'none';
            // Reveal preloaded iframe instantly
            iframe.style.visibility   = 'visible';
            iframe.style.pointerEvents = '';
            iframe.style.zIndex       = '2';
            // YouTube: ensure play via JS API in case autoplay was blocked
            if (doctorInfo.type === 'youtube') {
                iframe.contentWindow?.postMessage(
                    JSON.stringify({event:'command', func:'playVideo', args:[]}), '*'
                );
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

        displayName.textContent = info.doctor;
        displaySpec.textContent = info.spec;
        docText.textContent = info.doctor;
        cityText.textContent = getCityTitle(cityKey);

        console.log('📝 Updated:', info.doctor);
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

// ========== MAIN INIT ==========
let hasInitialized = false;

function initializeAll() {
    if (hasInitialized) {
        return;
    }
    hasInitialized = true;

    initializeNavbar();
    initializeScrollAnimations();
    initializeDropdowns();
    initializeDoctorSystem();
    console.log('✅ ALL SYSTEMS GO');
}

// Run when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}

setTimeout(initializeAll, 100);