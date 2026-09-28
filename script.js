document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('mobile-active');
        });
    }

    // --- Interactive Calculator Logic ---
    const areaRange = document.getElementById('areaRange');
    const areaVal = document.getElementById('areaVal');
    const calcTotalPrice = document.getElementById('calcTotalPrice');
    const typeBtns = document.querySelectorAll('[data-type]');
    const wallBtns = document.querySelectorAll('[data-wall]');
    
    let currentCoef = 1;
    let currentWallCoef = 1.2;

    // Type option buttons
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCoef = parseFloat(btn.dataset.coef);
            
            // Adjust slider defaults based on type
            const type = btn.dataset.type;
            if (type === '1k') areaRange.value = 40;
            else if (type === '2k') areaRange.value = 60;
            else if (type === '3k') areaRange.value = 85;
            else if (type === 'house') areaRange.value = 140;
            else if (type === 'room') areaRange.value = 20;
            else if (type === 'partial') areaRange.value = 15;
            
            updateCalculator();
        });
    });

    // Wall option buttons
    wallBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            wallBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentWallCoef = parseFloat(btn.dataset.wallcoef);
            updateCalculator();
        });
    });

    // Area slider
    if (areaRange && areaVal) {
        areaRange.addEventListener('input', () => {
            areaVal.textContent = `${areaRange.value} м²`;
            updateCalculator();
        });
    }

    // Checkboxes
    const optShield = document.getElementById('optShield');
    const optDemount = document.getElementById('optDemount');
    const optLed = document.getElementById('optLed');
    const optFloor = document.getElementById('optFloor');

    [optShield, optDemount, optLed, optFloor].forEach(cb => {
        if (cb) cb.addEventListener('change', updateCalculator);
    });

    function updateCalculator() {
        if (!calcTotalPrice || !areaRange) return;
        
        const area = parseInt(areaRange.value, 10);
        areaVal.textContent = `${area} м²`;

        // Base price calculation per sq. m (base ~1000 RUB/m²)
        let baseSquareRate = 950 * currentWallCoef * currentCoef;
        let total = area * baseSquareRate;

        // Add options
        if (optShield && optShield.checked) total += 6000;
        if (optDemount && optDemount.checked) total += area * 180;
        if (optLed && optLed.checked) total += 5000;
        if (optFloor && optFloor.checked) total += 4000;

        const minEst = Math.round(total * 0.9 / 500) * 500;
        const maxEst = Math.round(total * 1.15 / 500) * 500;

        calcTotalPrice.textContent = `${minEst.toLocaleString('ru-RU')} – ${maxEst.toLocaleString('ru-RU')} ₽`;
    }

    // Initialize calculator
    updateCalculator();

    // Scroll & prefill from Calc button
    const calcOrderBtn = document.getElementById('calcOrderBtn');
    if (calcOrderBtn) {
        calcOrderBtn.addEventListener('click', () => {
            const contactsSec = document.getElementById('contacts');
            if (contactsSec) {
                contactsSec.scrollIntoView({ behavior: 'smooth' });
                const commentField = document.getElementById('cComment');
                if (commentField) {
                    commentField.value = `Расчитал в калькуляторе: площадь ${areaRange.value} м², примерная сумма ${calcTotalPrice.textContent}`;
                }
            }
        });
    }

    // --- Search in Price List ---
    const priceSearch = document.getElementById('priceSearch');
    const searchClear = document.getElementById('searchClear');
    const priceRows = document.querySelectorAll('.price-table tbody tr');

    if (priceSearch) {
        priceSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length > 0) {
                searchClear.style.display = 'block';
            } else {
                searchClear.style.display = 'none';
            }

            priceRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });

        searchClear.addEventListener('click', () => {
            priceSearch.value = '';
            searchClear.style.display = 'none';
            priceRows.forEach(row => row.style.display = '');
        });
    }

    // --- Price Category Tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const priceBlocks = document.querySelectorAll('.price-block');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetTab = btn.dataset.tab;
            priceBlocks.forEach(block => {
                if (targetTab === 'all' || block.dataset.category === targetTab) {
                    block.style.display = 'block';
                } else {
                    block.style.display = 'none';
                }
            });
        });
    });

    // --- Portfolio Filter Tabs ---
    const portTabBtns = document.querySelectorAll('.port-tab-btn');
    const portCardItems = document.querySelectorAll('.port-card-item');

    portTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            portTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.port;
            portCardItems.forEach(card => {
                const cat = card.dataset.category || '';
                if (filter === 'all' || cat.includes(filter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- Lightbox Viewer ---
    const lightboxModal = document.getElementById('lightboxModal');
    const lbImg = document.getElementById('lbImg');
    const lbTitle = document.getElementById('lbTitle');
    const lbDesc = document.getElementById('lbDesc');
    const lbClose = document.getElementById('lbClose');

    const portImgWraps = document.querySelectorAll('.port-img-wrap');
    portImgWraps.forEach(wrap => {
        wrap.addEventListener('click', () => {
            const bgUrl = wrap.style.backgroundImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
            const title = wrap.querySelector('h4') ? wrap.querySelector('h4').textContent : 'Просмотр объекта';
            const desc = wrap.querySelector('p') ? wrap.querySelector('p').textContent : '';

            if (lbImg) lbImg.src = bgUrl;
            if (lbTitle) lbTitle.textContent = title;
            if (lbDesc) lbDesc.textContent = desc;
            if (lightboxModal) lightboxModal.style.display = 'flex';
        });
    });

    if (lbClose) {
        lbClose.addEventListener('click', () => {
            if (lightboxModal) lightboxModal.style.display = 'none';
        });
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.style.display = 'none';
            }
        });
    }

    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            item.classList.toggle('active');
        });
    });

    // --- Lead Form Submissions & Modal ---
    const heroForm = document.getElementById('heroForm');
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const modalClose = document.getElementById('modalClose');
    const modalOkBtn = document.getElementById('modalOkBtn');
    const modalMessage = document.getElementById('modalMessage');

    function handleFormSubmit(e, formType) {
        e.preventDefault();
        
        let name = '', phone = '', service = '', comment = '';

        if (formType === 'hero') {
            name = document.getElementById('heroName').value;
            phone = document.getElementById('heroPhone').value;
            service = document.getElementById('heroService').value;
        } else {
            name = document.getElementById('cName').value;
            phone = document.getElementById('cPhone').value;
            comment = document.getElementById('cComment').value;
        }

        fetch('/api/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, service, comment })
        })
        .then(res => res.json())
        .then(data => {
            if (modalMessage) modalMessage.textContent = data.message;
            if (successModal) successModal.style.display = 'flex';
            e.target.reset();
        })
        .catch(err => {
            if (modalMessage) modalMessage.textContent = `Спасибо, ${name}! Ваша заявка принята. Свяжемся с вами в рабочее время (Пн–Пт с 8:00 до 18:00) по номеру ${phone}.`;
            if (successModal) successModal.style.display = 'flex';
            e.target.reset();
        });
    }

    if (heroForm) heroForm.addEventListener('submit', (e) => handleFormSubmit(e, 'hero'));
    if (contactForm) contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'contact'));

    if (modalClose) modalClose.addEventListener('click', () => successModal.style.display = 'none');
    if (modalOkBtn) modalOkBtn.addEventListener('click', () => successModal.style.display = 'none');

    window.addEventListener('click', (e) => {
        if (e.target === successModal) successModal.style.display = 'none';
    });

});
