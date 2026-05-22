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

    // Multi-doctor data by city
    const data = {
        mumbai: [
            {
                doctor: 'Dr. Sonam Solanki',
                spec: 'Pulmonologist',
                type: 'youtube',
                video: 'https://www.youtube.com/embed/FF3wlitEUNg?autoplay=1&mute=1&loop=1&playlist=FF3wlitEUNg'
            },
            {
                doctor: 'Dr. Sameer Garde',
                spec: 'Chest Physician',
                type: 'youtube',
                video: 'https://www.youtube.com/embed/gT3PUzvlQ_0?autoplay=1&mute=1&loop=1&playlist=gT3PUzvlQ_0'
            },
            {
                doctor: 'Dr. Swami Pawar',
                spec: 'Chest Physician',
                type: 'youtube',
                video: 'https://www.youtube.com/embed/gLCQwXNmJPU?autoplay=1&mute=1&loop=1&playlist=gLCQwXNmJPU'
            },
            {
                doctor: 'Dr. Harshal Shah',
                spec: 'Chest Physician',
                type: 'youtube',
                video: 'https://www.youtube.com/embed/aCgRBnfue6o?autoplay=1&mute=1&loop=1&playlist=aCgRBnfue6o'
            },
            {
                doctor: 'Dr. Pankaj Bang',
                spec: 'Chest Physician',
                type: 'youtube',
                video: 'https://www.youtube.com/embed/Fk-NmlGfqE4?autoplay=1&mute=1&loop=1&playlist=Fk-NmlGfqE4'
            },
            {
                doctor: 'Dr. Satyey G. Tayade',
                spec: 'Chest Physician',
                type: 'youtube',
                video: 'https://www.youtube.com/embed/fZbT5g0hFTQ?autoplay=1&mute=1&loop=1&playlist=fZbT5g0hFTQ'
            },
            {
                doctor: 'Dr. Parag Mehta',
                spec: 'Chest specialist',
                type: 'youtube',
                video: 'https://www.youtube.com/embed/64zcRFUmGDM?autoplay=1&mute=1&loop=1&playlist=64zcRFUmGDM'
            }
        ],
        chennai: [
            {
                doctor: 'Dr. Suresh Kanna S',
                spec: 'Chest Physician',
                type: 'youtube',
                video: 'https://www.youtube.com/embed/lhhNOGOuf0A?autoplay=1&mute=1&loop=1&playlist=lhhNOGOuf0A'
            }
        ],
        punjab: [
            {
                doctor: 'Dr. Ajaypal Singh',
                spec: 'Chest Physician',
                type: 'youtube',
                video: 'https://www.youtube.com/embed/vwEUY4pp9ok?autoplay=1&mute=1&loop=1&playlist=vwEUY4pp9ok'
            },
            {
                doctor: 'Dr. Mohit Kaushal',
                spec: 'Consultant Pulmonology & Critical Care',
                type: 'youtube',
                video: 'https://www.youtube.com/embed/5Xg_E1EMlxI?autoplay=1&mute=1&loop=1&playlist=5Xg_E1EMlxI'
            }
        ]
    };

    // Elements
    const cityDropdown = document.getElementById('city-dropdown');
    const docDropdown = document.getElementById('doc-dropdown');
    const cityText = document.getElementById('city-selected-text');
    const docText = document.getElementById('doctor-selected-text');
    const displayName = document.getElementById('display-name');
    const displaySpec = document.getElementById('display-spec');
    const displayIframe = document.getElementById('display-iframe');
    const displayVideo = document.getElementById('display-video');
    const videoSrc = document.getElementById('video-src');
    const docList = document.querySelector('.doc-list');

    let currentCity = 'mumbai';
    let currentDoctorIndex = 0;

    console.log('✓ Elements loaded:', { cityDropdown: !!cityDropdown, docDropdown: !!docDropdown, displayName: !!displayName });

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
            if (idx === selectedIndex) {
                opt.style.display = 'none';
            }
            docList.appendChild(opt);
        });
    }

    function updateVideoDisplay(doctorInfo) {
        if (doctorInfo.type === 'youtube') {
            console.log('🎥 YouTube video');
            displayVideo.pause();
            displayVideo.style.display = 'none';
            displayIframe.src = doctorInfo.video;
            displayIframe.style.display = 'block';
            return;
        }

        console.log('🎬 Local video');
        displayIframe.src = '';
        displayIframe.style.display = 'none';
        videoSrc.src = doctorInfo.video;
        displayVideo.load();
        displayVideo.style.display = 'block';
        displayVideo.play().catch(() => {});
    }

    function showEmptyCityState(cityKey) {
        currentCity = cityKey;
        currentDoctorIndex = -1;

        cityText.textContent = getCityTitle(cityKey);
        docText.textContent = 'No doctor added yet';
        displayName.textContent = '';
        displaySpec.textContent = '';
        displayIframe.src = '';
        displayIframe.style.display = 'none';
        displayVideo.pause();
        displayVideo.style.display = 'none';
        if (videoSrc) {
            videoSrc.src = '';
        }

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
        updateVideoDisplay(info);
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

    console.log('⏳ Initializing all systems');
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