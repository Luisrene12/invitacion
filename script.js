/* ==========================================================================
   CUMPLEAÑOS MÁGICO - PRINCESA JAZMÍN (SCRIPT ENGINE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DEFAULT DATA & INITIALIZATION ---
    const defaultData = {
        name: "ANA PAULA",
        eventDate: "2026-09-04T18:00:00",
        heroMsg: "Te invito a celebrar junto a mí una noche llena de magia, encantos y momentos que guardaremos por siempre en el corazón.",
        scrollText: "CON LA BENDICIÓN DE DIOS Y EL AMOR QUE MI FAMILIA ME HA DADO, ME SIENTO FELIZ DE LLEGAR A ESTE MOMENTO DE MI VIDA; EL DÍA QUE DEJARÉ ATRÁS MI INFANCIA Y COMENZARÉ UN NUEVO VIAJE. PORQUE SON PARTE DE MI VIDA ES MI DESEO QUE COMPARTAN CONMIGO LA ALEGRÍA DE MIS QUINCE AÑOS..",
        madreName: "Guadalupe Rodríguez Juache",
        padreName: "José Rodríguez Martínez",
        churchName: "Salon de Eventos Mimin,",
        churchAddress: "#1005 B/Centro Azul.",
        hallName: "Gran Salón de Eventos Mimin",
        hallAddress: "B/ Centro Azul #456",
        bankName: "BANCO UNIÓN S.A.",
        bankOwner: "Daisy Herbas",
        bankCbu: "10000003682726",
        whatsappNum: "5215551234567",
        photos: [
            { url: "assets/hero_bg.jpg", caption: "Noche Mágica ✨" },
            { url: "assets/magic_lamp.jpg", caption: "Lámpara de Deseos 🧞" },
            { url: "assets/ballroom.jpg", caption: "Gran Salón del Palacio 👑" }
        ],
        wishes: [
            { author: "Familia Rodríguez", text: "¡Muchas felicidades Jazmín! Deseamos que esta noche de XV años sea tan mágica como en los cuentos de hadas.", rotate: -2 },
            { author: "Tía Sofía", text: "Brilla siempre con luz propia. ¡Te queremos infinitamente!", rotate: 3 }
        ]
    };

    // Clear old conflicting localStorage state from previous version
    const savedVersion = localStorage.getItem('jazmin_xv_version');
    if (savedVersion !== '8') {
        localStorage.removeItem('jazmin_xv_state');
        localStorage.setItem('jazmin_xv_version', '8');
    }

    let appState = loadStateFromURL() || loadStateFromLocalStorage() || defaultData;

    // --- DOM ELEMENTS ---
    const bdayNameEl = document.getElementById('bday-name');
    const bdayMsgEl = document.getElementById('bday-message');
    const churchNameEl = document.getElementById('church-name');
    const churchAddressEl = document.getElementById('church-address');
    const hallNameEl = document.getElementById('hall-name');
    const hallAddressEl = document.getElementById('hall-address');
    const bankNameEl = document.getElementById('bank-name');
    const bankOwnerEl = document.getElementById('bank-owner');
    const bankCbuEl = document.getElementById('bank-cbu');
    const polaroidContainer = document.getElementById('polaroid-container');
    const wishesBoard = document.getElementById('wishes-board');
    const wishForm = document.getElementById('wish-form');
    const rsvpForm = document.getElementById('rsvp-form');

    // Controls & Modals
    const musicBtn = document.getElementById('music-btn');
    const shareBtn = document.getElementById('share-btn');
    const editBtn = document.getElementById('edit-btn');
    const rubLampBtn = document.getElementById('rub-lamp-btn');
    const genieWishBox = document.getElementById('genie-wish-box');
    const magicLampImg = document.getElementById('magic-lamp-img');
    const copyCbuBtn = document.getElementById('copy-cbu-btn');

    // Cake Controls
    const candlesGroupEl = document.getElementById('candles-group');
    const celebrationBanner = document.getElementById('celebration-banner');
    const micBtn = document.getElementById('mic-btn');
    const relightBtn = document.getElementById('relight-btn');
    const fireworksTrigger = document.getElementById('fireworks-trigger');

    // Customizer Modal
    const customizerModal = document.getElementById('customizer-modal');
    const closeCustomizerBtn = document.getElementById('close-customizer-btn');
    const saveCustomizerBtn = document.getElementById('save-customizer-btn');
    const copyShareUrlBtn = document.getElementById('copy-share-url-btn');

    // Toast
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    // Inputs
    const editNameInput = document.getElementById('edit-name');
    const editDateInput = document.getElementById('edit-date');
    const editHeroMsgInput = document.getElementById('edit-hero-msg');
    const editChurchInput = document.getElementById('edit-church');
    const editHallInput = document.getElementById('edit-hall');
    const editBankInput = document.getElementById('edit-bank');
    const editWhatsappInput = document.getElementById('edit-whatsapp');
    const editScrollTextInput = document.getElementById('edit-scroll-text');
    const editMadreInput = document.getElementById('edit-madre');
    const editPadreInput = document.getElementById('edit-padre');

    // --- INITIAL RENDER ---
    applyStateToUI();
    startCountdown();
    initHomeAudioAutoplay();

    // Welcome burst of fireworks and confetti after 1 second
    setTimeout(() => {
        spawnConfetti(width / 2, height / 2, 80);
    }, 1200);
    setTimeout(() => {
        spawnFireworks(width * 0.25, height * 0.3);
        spawnFireworks(width * 0.75, height * 0.25);
    }, 1800);

    function initHomeAudioAutoplay() {
        const audio = document.getElementById('bg-audio') ||
                      document.querySelector('.home-audio-card audio') ||
                      document.querySelector('audio');
        if (!audio) return;

        audio.loop = true;
        audio.volume = 0.85;

        // 1) Intentar reproducir inmediatamente al cargar
        const tryPlay = () => {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Autoplay bloqueado por políticas del navegador, esperará al primer toque
                });
            }
        };

        tryPlay();
        window.addEventListener('load', tryPlay, { once: true });

        // 2) Desbloqueo garantizado al primer toque, scroll, clic o interacción en cualquier parte
        const events = ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'click', 'scroll', 'keydown'];
        const unlockAudio = () => {
            if (audio.paused) {
                audio.play().catch(() => {});
            }
            // Si ya está reproduciendo, quitamos los listeners
            if (!audio.paused) {
                events.forEach(evt => {
                    window.removeEventListener(evt, unlockAudio, true);
                    document.removeEventListener(evt, unlockAudio, true);
                });
            }
        };

        events.forEach(evt => {
            window.addEventListener(evt, unlockAudio, { capture: true, passive: true });
            document.addEventListener(evt, unlockAudio, { capture: true, passive: true });
        });

        // 3) Reanudar automáticamente si el usuario regresa a la pestaña
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && audio.paused) {
                audio.play().catch(() => {});
            }
        });
    }

    // --- 2. PERSISTENCE HELPERS ---
    function loadStateFromURL() {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('name')) return null;

        const state = JSON.parse(JSON.stringify(defaultData));
        state.name = params.get('name') || state.name;
        if (params.has('date')) state.eventDate = params.get('date');
        if (params.has('msg')) state.heroMsg = params.get('msg');
        if (params.has('church')) state.churchName = params.get('church');
        if (params.has('hall')) state.hallName = params.get('hall');
        if (params.has('bank')) state.bankCbu = params.get('bank');
        if (params.has('wa')) state.whatsappNum = params.get('wa');
        return state;
    }

    function loadStateFromLocalStorage() {
        try {
            const saved = localStorage.getItem('jazmin_xv_state');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    }

    function saveStateToLocalStorage() {
        localStorage.setItem('jazmin_xv_state', JSON.stringify(appState));
    }

    function applyStateToUI() {
        bdayNameEl.textContent = appState.name;
        if (bdayMsgEl) {
            bdayMsgEl.textContent = appState.heroMsg;
        }
        churchNameEl.textContent = appState.churchName;
        churchAddressEl.textContent = appState.churchAddress;
        hallNameEl.textContent = appState.hallName;
        hallAddressEl.textContent = appState.hallAddress;
        if (bankNameEl) bankNameEl.textContent = appState.bankName || defaultData.bankName || "BBVA / Banco Central";
        if (bankOwnerEl) bankOwnerEl.textContent = appState.bankOwner || defaultData.bankOwner || "Familia de la Quinceañera";
        if (bankCbuEl) bankCbuEl.textContent = appState.bankCbu || defaultData.bankCbu || "JAZMIN.XV.ALADDIN";

        // Update scroll pergamino text
        const scrollEl = document.getElementById('scroll-invitation-text');
        if (scrollEl) scrollEl.textContent = appState.scrollText || defaultData.scrollText;

        // Update name in royal cartouche plaque
        const cartoucheNameEl = document.getElementById('bday-name-cartouche');
        if (cartoucheNameEl) cartoucheNameEl.textContent = appState.name || "ANA PAULA";

        // Update family name cards
        const madreEl = document.getElementById('madre-nombre');
        const padreEl = document.getElementById('padre-nombre');
        if (madreEl) madreEl.textContent = appState.madreName || defaultData.madreName;
        if (padreEl) padreEl.textContent = appState.padreName || defaultData.padreName;

        renderCandles(5);
        renderGallery();
        renderWishes();

        // Modal Input Binds
        editNameInput.value = appState.name;
        editDateInput.value = (appState.eventDate || '').split('T')[0];
        editHeroMsgInput.value = appState.heroMsg;
        editChurchInput.value = `${appState.churchName} - ${appState.churchAddress}`;
        editHallInput.value = `${appState.hallName} - ${appState.hallAddress}`;
        editBankInput.value = appState.bankCbu;
        editWhatsappInput.value = appState.whatsappNum;
        if (editScrollTextInput) editScrollTextInput.value = appState.scrollText || defaultData.scrollText;
        if (editMadreInput) editMadreInput.value = appState.madreName || defaultData.madreName;
        if (editPadreInput) editPadreInput.value = appState.padreName || defaultData.padreName;

    }

    function startCountdown() {
        const daysEl = document.getElementById('count-days');
        const hoursEl = document.getElementById('count-hours');
        const minsEl = document.getElementById('count-mins');
        const secsEl = document.getElementById('count-secs');

        function pad(n) { return n < 10 ? '0' + n : '' + n; }

        function update() {
            const rawDate = appState.eventDate || defaultData.eventDate;
            const target = new Date(rawDate).getTime();
            const now = new Date().getTime();
            const diff = target - now;

            if (isNaN(diff) || diff <= 0) {
                daysEl.textContent = "00";
                hoursEl.textContent = "00";
                minsEl.textContent = "00";
                secsEl.textContent = "00";
                return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            daysEl.textContent = pad(d);
            hoursEl.textContent = pad(h);
            minsEl.textContent = pad(m);
            secsEl.textContent = pad(s);
        }

        update();
        setInterval(update, 1000);
    }

    // --- 4. WEB AUDIO SYNTHESIZER ---
    let audioCtx = null;
    let isPlayingMusic = false;

    function initAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function playNote(freq, duration, type = 'sine', gainVal = 0.15) {
        if (!audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) { }
    }

    function playPopSFX() {
        initAudio();
        playNote(523.25, 0.1, 'sine', 0.2);
        setTimeout(() => playNote(659.25, 0.12, 'sine', 0.15), 60);
    }

    function playFanfareSFX() {
        initAudio();
        const melody = [523.25, 659.25, 783.99, 1046.50];
        melody.forEach((note, idx) => {
            setTimeout(() => playNote(note, 0.4, 'triangle', 0.2), idx * 140);
        });
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            initAudio();
            if (isPlayingMusic) {
                isPlayingMusic = false;
                musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
                showToast('Música pausada');
            } else {
                isPlayingMusic = true;
                musicBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                showToast('🎶 Música Mágica Real Activada');
                playFanfareSFX();
            }
        });
    }

    // --- 5. CANVAS PARTICLE ENGINE ---
    const canvas = document.getElementById('fx-canvas');
    const ctx = canvas.getContext('2d');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvasFrameInterval = window.matchMedia('(max-width: 768px)').matches ? 50 : 16;
    let width = 0;
    let height = 0;
    let canvasScale = 1;
    let animationFrameId = 0;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvasScale = Math.min(window.devicePixelRatio || 1, window.innerWidth <= 768 ? 1.25 : 1.5);
        canvas.width = Math.floor(width * canvasScale);
        canvas.height = Math.floor(height * canvasScale);
        ctx.setTransform(canvasScale, 0, 0, canvasScale, 0, 0);
    }

    resizeCanvas();

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    let stars = [];
    let confetti = [];
    let fireworks = [];

    for (let i = 0; i < 80; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2,
            alpha: Math.random(),
            vAlpha: (Math.random() - 0.5) * 0.02
        });
    }

    function spawnConfetti(x = width / 2, y = height / 3, count = 100) {
        const colors = ['#ffd700', '#00f2fe', '#00c6ff', '#ffffff', '#e2e8f0'];
        for (let i = 0; i < count; i++) {
            confetti.push({
                x: x + (Math.random() - 0.5) * 60,
                y: y + (Math.random() - 0.5) * 60,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12 - 4,
                size: 6 + Math.random() * 8,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 10,
                opacity: 1
            });
        }
    }

    function spawnFireworks(x = Math.random() * width, y = Math.random() * (height / 2)) {
        const colors = ['#ffd700', '#00f2fe', '#ffffff', '#ff9f1a'];
        for (let i = 0; i < 50; i++) {
            const angle = (Math.PI * 2 / 50) * i;
            const speed = 3 + Math.random() * 5;
            fireworks.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                radius: 2.5 + Math.random() * 2,
                alpha: 1,
                decay: 0.02
            });
        }
    }

    let lastCanvasFrame = 0;

    function animateCanvas(timestamp = 0) {
        if (document.hidden || reduceMotion) {
            animationFrameId = 0;
            return;
        }
        animationFrameId = requestAnimationFrame(animateCanvas);
        if (timestamp - lastCanvasFrame < canvasFrameInterval) return;
        lastCanvasFrame = timestamp;
        ctx.clearRect(0, 0, width, height);

        // Draw Twinkling Stars
        stars.forEach(s => {
            s.alpha += s.vAlpha;
            if (s.alpha <= 0.1 || s.alpha >= 1) s.vAlpha *= -1;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = s.alpha;
            ctx.fill();
        });

        // Draw Confetti
        for (let i = confetti.length - 1; i >= 0; i--) {
            const p = confetti[i];
            p.x += p.vx; p.y += p.vy;
            p.vy += 0.15;
            p.opacity -= 0.005;
            if (p.opacity <= 0 || p.y > height) { confetti.splice(i, 1); continue; }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        }

        // Draw Fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const f = fireworks[i];
            f.x += f.vx; f.y += f.vy;
            f.vy += 0.05; f.alpha -= f.decay;
            if (f.alpha <= 0) { fireworks.splice(i, 1); continue; }

            ctx.beginPath();
            ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
            ctx.fillStyle = f.color;
            ctx.globalAlpha = f.alpha;
            ctx.fill();
        }
        ctx.globalAlpha = 1;

    }

    if (!reduceMotion) animateCanvas();
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !reduceMotion && !animationFrameId) {
            lastCanvasFrame = 0;
            animateCanvas();
        }
    });

    // --- 6. MAGIC LAMP LOGIC ---
    if (rubLampBtn) {
        rubLampBtn.addEventListener('click', () => {
            playFanfareSFX();
            spawnConfetti(width / 2, height / 3, 150);
            if (magicLampImg) {
                magicLampImg.style.transform = 'scale(1.15) rotate(5deg)';
                setTimeout(() => magicLampImg.style.transform = 'scale(1) rotate(0deg)', 400);
            }

            if (genieWishBox) {
                genieWishBox.classList.remove('hidden');
                genieWishBox.scrollIntoView({ behavior: 'smooth' });
            }
            showToast('✨ ¡El Genio de la Lámpara ha aparecido!');
        });
    }

    // --- 7. CAKE CANDLES LOGIC ---
    function renderCandles(num) {
        if (!candlesGroupEl) return;
        candlesGroupEl.innerHTML = '';
        for (let i = 0; i < num; i++) {
            const candle = document.createElement('div');
            candle.className = 'candle';
            candle.innerHTML = `<div class="wick"></div><div class="flame"></div>`;
            candle.addEventListener('click', () => blowOutCandle(candle));
            candlesGroupEl.appendChild(candle);
        }
    }

    function blowOutCandle(candle) {
        if (!candlesGroupEl || !candle) return;
        if (candle.classList.contains('blown-out')) return;
        candle.classList.add('blown-out');
        playPopSFX();
        spawnConfetti(candle.getBoundingClientRect().x, candle.getBoundingClientRect().y, 20);

        const unblown = candlesGroupEl.querySelectorAll('.candle:not(.blown-out)');
        if (unblown.length === 0) {
            playFanfareSFX();
            if (celebrationBanner) celebrationBanner.classList.remove('hidden');
            for (let i = 0; i < 5; i++) {
                setTimeout(() => spawnFireworks(), i * 300);
            }
            showToast('🎉 ¡Felicidades! Se han apagado todas las velas');
        }
    }

    if (relightBtn) {
        relightBtn.addEventListener('click', () => {
            renderCandles(5);
            if (celebrationBanner) celebrationBanner.classList.add('hidden');
            showToast('Velas encendidas 🕯️');
        });
    }

    if (fireworksTrigger) {
        fireworksTrigger.addEventListener('click', () => {
            for (let i = 0; i < 8; i++) setTimeout(() => spawnFireworks(), i * 200);
        });
    }

    // --- 8. RSVP FORM TO WHATSAPP ---
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameField = document.getElementById('rsvp-name');
            const passesField = document.getElementById('rsvp-passes');
            const statusField = document.getElementById('rsvp-status');
            const msgField = document.getElementById('rsvp-msg');

            if (!nameField || !passesField || !statusField || !msgField) return;

            const name = nameField.value.trim();
            const passes = passesField.value;
            const status = statusField.value;
            const msg = msgField.value.trim();

            const text = `¡Hola! Confirmo mi asistencia para los XV Años de ${appState.name}.\n\n*Nombre:* ${name}\n*Pases:* ${passes}\n*Asistencia:* ${status}\n*Mensaje:* ${msg}`;
            const waUrl = `https://wa.me/${appState.whatsappNum}?text=${encodeURIComponent(text)}`;

            window.open(waUrl, '_blank');
            showToast('¡Abriendo WhatsApp para confirmar! 📲');
        });
    }

    // --- 9. BANK COPY CBU ---
    if (copyCbuBtn) {
        copyCbuBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(appState.bankCbu).then(() => {
                showToast('¡Datos bancarios copiados! 📋');
            }).catch(() => {
                prompt('Copia estos datos bancarios:', appState.bankCbu);
            });
        });
    }

    // --- 10. GALLERY & WISHES ---
    function renderGallery() {
        polaroidContainer.innerHTML = '';
        appState.photos.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'polaroid-card';
            card.innerHTML = `
                <div class="polaroid-img-wrapper"><img src="${photo.url}" alt="${photo.caption}"></div>
                <div class="polaroid-caption">${photo.caption}</div>
            `;
            card.addEventListener('click', () => {
                lightboxImg.src = photo.url;
                lightboxCaption.textContent = photo.caption;
                lightbox.classList.remove('hidden');
            });
            polaroidContainer.appendChild(card);
        });
    }

    // QR Lightbox
    const qrCard = document.querySelector('.gift-qr-card');
    if (qrCard && lightbox) {
        qrCard.addEventListener('click', () => {
            lightboxImg.src = 'assets/qr_banco.jpg';
            lightboxCaption.textContent = 'QR Banco Unión S.A. - Daisy Herbas';
            lightbox.classList.remove('hidden');
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => lightbox.classList.add('hidden'));
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.add('hidden');
        });
    }

    function renderWishes() {
        wishesBoard.innerHTML = '';
        appState.wishes.forEach(w => {
            const card = document.createElement('div');
            card.className = 'wish-card';
            card.style.transform = `rotate(${w.rotate || 0}deg)`;
            card.innerHTML = `
                <p class="wish-text">"${w.text}"</p>
                <div class="wish-author">- ${w.author}</div>
            `;
            wishesBoard.appendChild(card);
        });
    }

    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = document.getElementById('author-input').value.trim();
        const text = document.getElementById('msg-input').value.trim();

        if (author && text) {
            appState.wishes.unshift({ author, text, rotate: Math.floor(Math.random() * 6 - 3) });
            saveStateToLocalStorage();
            renderWishes();
            wishForm.reset();
            playPopSFX();
            showToast('¡Felicitación agregada al muro! 🌟');
        }
    });

    // --- 11. CUSTOMIZER MODAL ---
    if (editBtn) {
        editBtn.addEventListener('click', () => customizerModal && customizerModal.classList.remove('hidden'));
    }
    if (closeCustomizerBtn) {
        closeCustomizerBtn.addEventListener('click', () => customizerModal && customizerModal.classList.add('hidden'));
    }

    if (saveCustomizerBtn) {
        saveCustomizerBtn.addEventListener('click', () => {
            appState.name = editNameInput.value.trim() || defaultData.name;
            appState.eventDate = editDateInput.value ? editDateInput.value + "T18:00:00" : defaultData.eventDate;
            appState.heroMsg = editHeroMsgInput.value.trim() || defaultData.heroMsg;
            appState.scrollText = editScrollTextInput ? (editScrollTextInput.value.trim() || defaultData.scrollText) : defaultData.scrollText;
            appState.madreName = editMadreInput ? (editMadreInput.value.trim() || defaultData.madreName) : defaultData.madreName;
            appState.padreName = editPadreInput ? (editPadreInput.value.trim() || defaultData.padreName) : defaultData.padreName;

            const churchParts = editChurchInput.value.split('-');
            appState.churchName = churchParts[0] ? churchParts[0].trim() : defaultData.churchName;
            appState.churchAddress = churchParts[1] ? churchParts[1].trim() : defaultData.churchAddress;

            const hallParts = editHallInput.value.split('-');
            appState.hallName = hallParts[0] ? hallParts[0].trim() : defaultData.hallName;
            appState.hallAddress = hallParts[1] ? hallParts[1].trim() : defaultData.hallAddress;

            appState.bankCbu = editBankInput.value.trim() || defaultData.bankCbu;
            appState.whatsappNum = editWhatsappInput.value.trim().replace(/[^0-9]/g, '') || defaultData.whatsappNum;

            saveStateToLocalStorage();
            applyStateToUI();
            if (customizerModal) customizerModal.classList.add('hidden');
            spawnConfetti();
            showToast('¡Invitación actualizada! ✨');
        });
    }

    if (copyShareUrlBtn) {
        copyShareUrlBtn.addEventListener('click', () => {
            const baseUrl = window.location.origin + window.location.pathname;
            const params = new URLSearchParams({
                name: appState.name,
                date: appState.eventDate,
                msg: appState.heroMsg,
                church: appState.churchName,
                hall: appState.hallName,
                bank: appState.bankCbu,
                wa: appState.whatsappNum
            });
            const shareUrl = `${baseUrl}?${params.toString()}`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                showToast('¡Enlace de invitación copiado! 🔗');
            });
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const baseUrl = window.location.origin + window.location.pathname;
            const shareUrl = `${baseUrl}?name=${encodeURIComponent(appState.name)}`;
            if (navigator.share) {
                navigator.share({
                    title: `Invitación Mis XV Años - ${appState.name}`,
                    text: `¡Estás invitado/a a celebrar los XV Años de ${appState.name}!`,
                    url: shareUrl
                }).catch(() => { });
            } else {
                navigator.clipboard.writeText(shareUrl).then(() => showToast('Enlace copiado al portapapeles 🔗'));
            }
        });
    }

    function showToast(msg) {
        toastMsg.textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    // --- 12. 3D DEPTH CAROUSEL LOGIC ---
    function initDepthCarousel() {
        const stage = document.getElementById('quince-depth-stage');
        if (!stage) return;

        const cards = Array.from(stage.querySelectorAll('.depth-card-item'));
        const dotsContainer = document.getElementById('quince-depth-dots');
        const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.depth-dot')) : [];
        const prevBtn = document.getElementById('quince-depth-prev');
        const nextBtn = document.getElementById('quince-depth-next');

        let currentIndex = 0;
        const total = cards.length;

        function updateCarousel() {
            cards.forEach((card, i) => {
                card.className = 'depth-card-item';
                let diff = i - currentIndex;

                // Handle wrap around indexing
                if (diff > total / 2) diff -= total;
                if (diff < -total / 2) diff += total;

                if (diff === 0) {
                    card.classList.add('pos-active');
                } else if (diff === 1) {
                    card.classList.add('pos-next-1');
                } else if (diff === 2) {
                    card.classList.add('pos-next-2');
                } else if (diff === -1) {
                    card.classList.add('pos-prev-1');
                } else if (diff === -2) {
                    card.classList.add('pos-prev-2');
                } else {
                    card.classList.add('pos-hidden');
                }
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        cards.forEach((card, i) => {
            card.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + total) % total;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % total;
                updateCarousel();
            });
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
        });

        // Swipe touch gesture support
        let startX = 0;
        stage.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
        stage.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 40) {
                currentIndex = (currentIndex + 1) % total;
                updateCarousel();
            } else if (endX - startX > 40) {
                currentIndex = (currentIndex - 1 + total) % total;
                updateCarousel();
            }
        }, { passive: true });

        const rotateCarousel = () => {
            currentIndex = (currentIndex + 1) % total;
            updateCarousel();
        };

        // Auto rotate while the page is visible.
        let autoTimer = setInterval(rotateCarousel, 2000);

        stage.addEventListener('mouseenter', () => clearInterval(autoTimer));
        stage.addEventListener('mouseleave', () => {
            clearInterval(autoTimer);
            autoTimer = setInterval(rotateCarousel, 2000);
        });

        document.addEventListener('visibilitychange', () => {
            clearInterval(autoTimer);
            if (!document.hidden) autoTimer = setInterval(rotateCarousel, 2000);
        });

        updateCarousel();
    }

    initDepthCarousel();

});
