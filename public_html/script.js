/* =========================================================
   MASTER SCRIPT: EDER CREA WEBS (Chatbot Híbrido + VSL)
   Lógica: Pre-calificación por botones -> IA Agent para dudas
   ========================================================= */

/* ---- HAMBURGER MENU + DARK MODE ---- */
(function () {
  var hamburger = document.getElementById('navHamburger');
  var menu = document.getElementById('navMenu');
  var toggle = document.getElementById('darkToggle');

  function openMenu() {
    if (!menu) return;
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger && hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  document.addEventListener('click', function (e) {
    if (menu && menu.classList.contains('open')) {
      if (!menu.contains(e.target) && e.target !== hamburger && !hamburger.contains(e.target)) {
        closeMenu();
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  function setDarkMode(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    if (toggle) toggle.setAttribute('aria-checked', enabled ? 'true' : 'false');
    try { localStorage.setItem('ew_dark', enabled ? '1' : '0'); } catch (ex) {}
  }

  toggle && toggle.addEventListener('click', function () {
    setDarkMode(!document.body.classList.contains('dark-mode'));
  });

  // Restaurar preferencia guardada (o preferencia del sistema)
  try {
    var saved = localStorage.getItem('ew_dark');
    if (saved !== null) {
      setDarkMode(saved === '1');
    } else {
      setDarkMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  } catch (ex) {}
}());
/* ---- FIN HAMBURGER/DARK MODE ---- */

/* ---- VIDEO CAROUSEL / SLIDER ---- */
(function() {
  var videoTrack = document.getElementById('videoTrack');
  var prevBtn = document.getElementById('videoPrev');
  var nextBtn = document.getElementById('videoNext');
  
  if (!videoTrack || !prevBtn || !nextBtn) return;

  function scrollToCard(index) {
    var cards = videoTrack.querySelectorAll('.social-video-card');
    if (cards.length === 0) return;
    
    // Clamp index between 0 and total cards
    index = Math.max(0, Math.min(index, cards.length - 1));
    var card = cards[index];
    
    // Scroll to the card
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  function getCurrentCardIndex() {
    var cards = videoTrack.querySelectorAll('.social-video-card');
    if (cards.length === 0) return 0;
    
    var scrollLeft = videoTrack.scrollLeft;
    var scrollWidth = videoTrack.scrollWidth;
    var cardWidth = cards[0].offsetWidth;
    var estimatedIndex = Math.round(scrollLeft / (cardWidth + 18)); // 18 is gap
    
    return Math.min(estimatedIndex, cards.length - 1);
  }

  prevBtn.addEventListener('click', function() {
    var currentIndex = getCurrentCardIndex();
    var newIndex = currentIndex - 1;
    
    // Loop: if at first card, go to last card
    if (newIndex < 0) {
      newIndex = videoTrack.querySelectorAll('.social-video-card').length - 1;
    }
    
    scrollToCard(newIndex);
  });

  nextBtn.addEventListener('click', function() {
    var cards = videoTrack.querySelectorAll('.social-video-card');
    var currentIndex = getCurrentCardIndex();
    var newIndex = currentIndex + 1;
    
    // Loop: if at last card, go to first card
    if (newIndex >= cards.length) {
      newIndex = 0;
    }
    
    scrollToCard(newIndex);
  });
}());
/* ---- FIN VIDEO CAROUSEL ---- */


  // ⚠️ CONFIGURACIÓN
  const WEBHOOK_URL = "https://n8n.edercreawebs.com/webhook/webchat";
  const CHAT_ID_KEY = "ew_chat_id_v5";
  const SESSION_ID_KEY = "ew_session_id_v1";

  // --- 1. DEFINICIÓN GLOBAL DE SUGERENCIAS (FAQ) ---
  // Se define aquí afuera para que sea accesible por todas las funciones
  // Al inicio de tu script.js
const faqSuggestions = [
  { 
    id: "pagos", // ID para identificar la duda
    label: "💳 ¿Cómo son los pagos?", 
    onClick: (targetBody) => handleUserText({ value: "¿Cómo funcionan los pagos?" }, targetBody, "pagos") 
  },
  { 
    id: "mantenimiento",
    label: "🛠️ ¿Qué mantenimiento manejas?", 
    onClick: (targetBody) => handleUserText({ value: "¿Qué incluye el mantenimiento mensual?" }, targetBody, "mantenimiento") 
  },
  { 
    id: "agenda",
    label: "🗓️ Agendar llamada", 
    onClick: (targetBody) => showCalendly(targetBody) 
  }
];

// Creamos un Set para guardar las dudas ya respondidas
let answeredFAQs = new Set();

  // --- 2. REFERENCIAS AL DOM ---
  const video = document.getElementById('vslVideo');
  const overlay = document.getElementById('vslOverlay');
  const btnPlay = document.getElementById('vslStartAudio');
  const btnDemo = document.getElementById('btnDemoOverlay');
  const flipCard = document.getElementById('flipCard');
  const btnFlipBack = document.getElementById('btnFlipBack');
  const progress = document.getElementById('vslProgress');
  const btnWatchCase = document.getElementById('btnWatchCase');
  const vslSection = document.getElementById('vslSection');
  const heroPretag = document.querySelector('.pretag');
  const heroStars = document.querySelector('.stars');
  const heroCredTag = document.querySelector('.credTag');
  const btnVideoPlayPause = document.getElementById('vslPlayPause');
  const btnVideoRestart = document.getElementById('vslRestart');
  const btnVideoMute = document.getElementById('vslMute');
  const clientTabs = Array.from(document.querySelectorAll('.clientTab'));
  const clientPanels = Array.from(document.querySelectorAll('.clientPanel'));

  const panelFloat = document.getElementById('ewPanel');
  const btnFloatOpen = document.getElementById('ewOpen');
  const btnFloatClose = document.getElementById('ewClose');
  const bodyFloat = document.getElementById('ewBody');
  const inputFloat = document.getElementById('ewInput');
  const sendFloat = document.getElementById('ewSend');

  const panelEmbedded = document.getElementById('ewEmbedded');
  const bodyEmbedded = document.getElementById('ewBodyEmbedded');
  const inputEmbedded = document.getElementById('ewInputEmbedded');
  const sendEmbedded = document.getElementById('ewSendEmbedded');

  // --- 3. ESTADO ---
  let chatState = {
    currentState: "idle", 
    activeInstance: "none",
    data: { interest: "", ads: "", niche: "", phone: "", budget_ok: "" }
  };

  function toggleSolution(solutionNumber){
    const targetId = `sol-${solutionNumber}`;
    const allSolutions = Array.from(document.querySelectorAll('.solucion-content'));

    allSolutions.forEach((solution) => {
      const isTarget = solution.id === targetId;
      solution.classList.toggle('active', isTarget ? !solution.classList.contains('active') : false);
    });

    const allButtons = Array.from(document.querySelectorAll('.btn-solucion'));
    allButtons.forEach((button, index) => {
      const btnNumber = index + 1;
      const currentSolution = document.getElementById(`sol-${btnNumber}`);
      const isOpen = currentSolution?.classList.contains('active');
      button.textContent = isOpen ? `Ocultar Solución #${btnNumber}` : `Ver Solución #${btnNumber}`;
    });
  }

  window.toggleSolution = toggleSolution;

  function initClientTabs(){
    if (!clientTabs.length || !clientPanels.length) return;

    function activateClient(clientId){
      clientTabs.forEach((tab) => {
        const isActive = tab.dataset.client === clientId;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      clientPanels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.clientPanel === clientId);
      });
    }

    clientTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateClient(tab.dataset.client));

      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const step = e.key === 'ArrowRight' ? 1 : -1;
        const nextIndex = (index + step + clientTabs.length) % clientTabs.length;
        const nextTab = clientTabs[nextIndex];
        nextTab.focus();
        activateClient(nextTab.dataset.client);
      });
    });
  }

  initClientTabs();

  function initReviewsCarousel(){
    const track = document.getElementById('reviewsTrack');
    const prev = document.getElementById('reviewsPrev');
    const next = document.getElementById('reviewsNext');
    if (!track || !prev || !next) return;

    const getScrollAmount = () => {
      const firstCard = track.querySelector('.review-card');
      if (!firstCard) return track.clientWidth * 0.9;
      const gap = 18;
      return firstCard.getBoundingClientRect().width + gap;
    };

    const getMaxScrollLeft = () => Math.max(0, track.scrollWidth - track.clientWidth);
    const edgeTolerance = 12;

    prev.addEventListener('click', () => {
      const current = track.scrollLeft;
      if (current <= edgeTolerance) {
        track.scrollTo({ left: getMaxScrollLeft(), behavior: 'smooth' });
        return;
      }

      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    next.addEventListener('click', () => {
      const current = track.scrollLeft;
      const maxScrollLeft = getMaxScrollLeft();
      if (current + getScrollAmount() >= maxScrollLeft - edgeTolerance) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }

  initReviewsCarousel();

    // --- HERRAMIENTAS GRID ---
    function initHerramientas() {
      const tiles = document.querySelectorAll('.herr-tile');
      const iframe = document.getElementById('herrIframe');
      const placeholder = document.getElementById('herrPlaceholder');
      const titleEl = document.getElementById('herrTitle');
      const playerCard = document.querySelector('.herr-player-card');

      if (!tiles.length) return;

      tiles.forEach(function(tile) {
        tile.addEventListener('click', function() {
          tiles.forEach(function(t) { t.classList.remove('is-active'); });
          tile.classList.add('is-active');

          var label = tile.dataset.label;
          var videoId = tile.dataset.video;

          if (titleEl) titleEl.textContent = label;

          if (playerCard) {
            playerCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }

          if (videoId) {
            iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
            iframe.style.display = 'block';
            placeholder.style.display = 'none';
          } else {
            iframe.src = '';
            iframe.style.display = 'none';
            placeholder.style.display = 'flex';
            placeholder.innerHTML = '<div class="herr-placeholder-play">🔜</div><p>Video próximamente</p>';
          }
        });
      });
    }

    initHerramientas();

  function initSocialVideos() {
    const nativeVideos = Array.from(document.querySelectorAll('.social-video'));
    const iframeVideos = Array.from(document.querySelectorAll('.social-video-iframe'));

    nativeVideos.forEach((clip) => {
      const shell = clip.closest('.social-video-shell');
      if (!shell) return;

      clip.muted = true;
      clip.playsInline = true;
    });

    if (!iframeVideos.length || typeof window.Stream !== 'function') return;

    const playerEntries = iframeVideos.map((iframe) => {
      const shell = iframe.closest('.social-video-shell');
      if (!shell) return null;

      const player = window.Stream(iframe);
      shell.setAttribute('role', 'button');
      shell.setAttribute('tabindex', '0');
      shell.setAttribute('aria-label', 'Reproducir o pausar video');

      const entry = {
        iframe,
        shell,
        player,
        hasStartedWithAudio: false,
        ignoreClick: (target) => Boolean(
          target.closest('.social-watermark-link') ||
          target.closest('.social-video-details') ||
          target.closest('summary') ||
          target.closest('.social-video-copy')
        )
      };

      return entry;
    }).filter(Boolean);

    const pauseOtherAudioPlayers = (activeEntry) => {
      playerEntries.forEach((entry) => {
        if (entry === activeEntry) return;
        try {
          entry.player.muted = true;
          if (entry.hasStartedWithAudio && !entry.player.paused) {
            entry.player.pause();
          }
          entry.shell.classList.remove('is-playing');
        } catch (_) {}
      });
    };

    playerEntries.forEach((entry) => {
      const { shell, player, ignoreClick } = entry;

      const togglePlayback = async () => {
        try {
          const isPaused = Boolean(player.paused);

          if (!entry.hasStartedWithAudio) {
            pauseOtherAudioPlayers(entry);
            player.currentTime = 0;
            player.muted = false;
            await player.play();
            entry.hasStartedWithAudio = true;
            shell.classList.add('is-playing');
            return;
          }

          if (isPaused) {
            pauseOtherAudioPlayers(entry);
            player.muted = false;
            await player.play();
            shell.classList.add('is-playing');
            return;
          }

          player.pause();
          shell.classList.remove('is-playing');
        } catch (_) {}
      };

      shell.addEventListener('click', (event) => {
        if (ignoreClick(event.target)) return;
        togglePlayback();
      });

      shell.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        if (ignoreClick(event.target)) return;
        event.preventDefault();
        togglePlayback();
      });

      player.addEventListener('play', () => {
        shell.classList.add('is-playing');
      });

      player.addEventListener('pause', () => {
        shell.classList.remove('is-playing');
      });

      player.addEventListener('ended', () => {
        shell.classList.remove('is-playing');
      });
    });
  }

  initSocialVideos();

  // --- 4. LÓGICA VSL (VIDEO) ---
  if(video) {
    let hasShownButton = false;
    video.muted = true;
    if (btnVideoMute) btnVideoMute.textContent = '🔇';
    video.play().catch(()=>{});

    function startVideo(){
      video.muted = false;
      video.currentTime = 0;
      video.play();
      if(overlay) overlay.style.display = 'none';
    }

    function openCaseVideo(){
      const isMobile = window.matchMedia('(max-width: 900px)').matches;
      if (isMobile) {
        vslSection?.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(startVideo, 500);
    }

    btnPlay?.addEventListener('click', startVideo);
    btnWatchCase?.addEventListener('click', openCaseVideo);
    heroPretag?.addEventListener('click', openCaseVideo);
    heroStars?.addEventListener('click', openCaseVideo);
    heroCredTag?.addEventListener('click', openCaseVideo);

    video.addEventListener('timeupdate', () => {
      const pct = (video.currentTime / video.duration) * 100;
      if(progress) progress.style.width = pct + '%';
      if(pct > 20 && !hasShownButton && btnDemo){
        btnDemo.classList.add('visible');
        hasShownButton = true;
      }
    });

    btnDemo?.addEventListener('click', (e) => {
      e.stopPropagation();
      video.pause();
      flipCard.classList.add('is-flipped');
      if(!bodyEmbedded.hasChildNodes()) initChatbot(bodyEmbedded, 'embedded');
    });

    btnFlipBack?.addEventListener('click', () => flipCard.classList.remove('is-flipped'));

    btnVideoPlayPause?.addEventListener('click', async () => {
      if (video.paused) {
        try {
          await video.play();
          btnVideoPlayPause.textContent = '⏸';
        } catch (_) {}
      } else {
        video.pause();
        btnVideoPlayPause.textContent = '▶';
      }
    });

    btnVideoRestart?.addEventListener('click', async () => {
      video.currentTime = 0;
      try {
        await video.play();
        btnVideoPlayPause && (btnVideoPlayPause.textContent = '⏸');
      } catch (_) {}
    });

    btnVideoMute?.addEventListener('click', () => {
      video.muted = !video.muted;
      btnVideoMute.textContent = video.muted ? '🔇' : '🔊';
    });

    video.addEventListener('play', () => {
      btnVideoPlayPause && (btnVideoPlayPause.textContent = '⏸');
    });

    video.addEventListener('pause', () => {
      btnVideoPlayPause && (btnVideoPlayPause.textContent = '▶');
    });
  }

  // --- 5. FUNCIONES CORE DEL CHATBOT ---
  function getChatId(){
    let id = localStorage.getItem(CHAT_ID_KEY);
    if (!id){ id = Math.random().toString(36).substring(7); localStorage.setItem(CHAT_ID_KEY, id); }
    return id;
  }

function renderMessage(targetBody, role, text, chips){
    const row = document.createElement("div");
    row.className = "ew-row " + (role === "user" ? "user" : "bot");
    const bubble = document.createElement("div");
    bubble.className = "ew-bubble";
    bubble.innerHTML = text.replace(/\n/g, "<br>");
    row.appendChild(bubble);
    targetBody.appendChild(row);

    if (chips && chips.length){
      const wrap = document.createElement("div");
      wrap.className = "ew-chips";
      
      // Mantenemos el filtro solo para las sugerencias de FAQ respondidas
      const filteredChips = chips.filter(c => !c.id || !answeredFAQs.has(c.id));

      filteredChips.forEach(c => {
        const b = document.createElement("button");
        b.className = "ew-chip";
        b.textContent = c.label;
        b.onclick = () => {
          wrap.remove();
          // IMPORTANTE: Esta línea es la que hace que tu elección 
          // se vea del lado derecho antes de ejecutar la acción
          renderMessage(targetBody, "user", c.label); 
          c.onClick(targetBody);
        };
        wrap.appendChild(b);
      });
      
      if(filteredChips.length > 0) targetBody.appendChild(wrap);
    }
    targetBody.scrollTop = targetBody.scrollHeight;
}

  function initChatbot(targetBody, instanceType){
    targetBody.innerHTML = "";
    chatState.activeInstance = instanceType;
    chatState.currentState = "idle";

    renderMessage(targetBody, "bot", 
      "👋 Hola. Ayudo a dueños de negocio a llenar su agenda con sistemas automáticos.\n\n¿Qué te gustaría ver primero?",
      [
        { label: "📦 Ver Paquete (Web + Chatbot)", onClick: () => handleFlow(targetBody, "show_package") },
        { label: "💰 Cotizar Precio", onClick: () => handleFlow(targetBody, "show_package") },
        { label: "❓ Dudas frecuentes", onClick: () => handleFlow(targetBody, "faq") }
      ]
    );
  }

  function handleFlow(targetBody, step){
    // PASO: Detalle del Paquete y Filtro de Presupuesto
    if (step === "show_package") {
      renderMessage(targetBody, "bot", 
        "Claro, el Paquete incluye:\n" +
        "- **Sitio Web o Landing Page**\n" +
        "- **Hosting y Dominio** por 1 año\n" +
        "- **Mantenimiento** de 3 meses\n" +
        "- **ChatBot Ai + Agenda**\n\n" +
        "Por **$12,000 MXN**. ¿Este monto se ajusta a tu presupuesto actual?",
        [
          { label: "✅ Sí, es viable", onClick: () => { chatState.data.budget_ok = "Si"; handleFlow(targetBody, "ask_niche"); } },
          { label: "⏳ Quizás luego", onClick: () => renderMessage(targetBody, "bot", "¡Sin problema! Te espero cuando estés listo. 👋") }
        ]
      );
    }

    // PASO: Pregunta de Nicho
    if(step === "ask_niche"){
      chatState.currentState = "qualifying";
      renderMessage(targetBody, "bot", 
        "Perfecto. Para darte ejemplos reales, ¿en qué nicho está tu negocio?",
        [
          { label: "Salud / Clínicas", onClick: () => { chatState.data.niche = "Salud"; handleFlow(targetBody, "ask_ads"); } },
          { label: "Servicios / Consultoría", onClick: () => { chatState.data.niche = "Servicios"; handleFlow(targetBody, "ask_ads"); } },
          { label: "Otro (Escribir)", onClick: () => { chatState.currentState = "waiting_niche"; renderMessage(targetBody, "bot", "¿A qué te dedicas?"); } }
        ]
      );
    }

    // PASO: Dudas Frecuentes (FAQ)
    if(step === "faq"){
      chatState.currentState = "ai_chat"; 
      renderMessage(targetBody, "bot", 
        "Elige de las Preguntas Frecuentes, si no ves tu duda puedes escribirla, mi IA te responderá.",
        faqSuggestions 
      );
    }

    // PASO: Inversión en Publicidad
    if(step === "ask_ads"){
      renderMessage(targetBody, "bot", 
        "¿Actualmente ya inviertes en publicidad (Ads) o dependes de recomendaciones?",
        [
          { label: "🚀 Sí, ya hago Ads", onClick: () => { chatState.data.ads = "Si"; handleFlow(targetBody, "final"); } },
          { label: "📢 Solo orgánico", onClick: () => { chatState.data.ads = "No"; handleFlow(targetBody, "final"); } }
        ]
      );
    }

    // PASO: Cierre / Conversión
    if(step === "final"){
      renderMessage(targetBody, "bot", 
        "¡Excelente! Parece que encaja perfecto contigo. ¿Quieres ver mi agenda para una llamada de 15 min o tienes dudas?",
        [
          { label: "🗓️ Ver Agenda", onClick: () => showCalendly(targetBody) },
          { label: "✍️ Tengo dudas", onClick: () => { chatState.currentState = "ai_chat"; renderMessage(targetBody, "bot", "Dime, ¿qué duda tienes? Elige una opción o escribe tu pregunta y mi IA te responde:", 
                faqSuggestions 
              ); } }
        ]
      );
    }
  }

// Agregamos faqId como tercer parámetro
async function handleUserText(inputEl, targetBody, faqId = null){
    const txt = inputEl.value?.trim() || inputEl.trim();
    if(!txt) return;
    
    if(faqId) answeredFAQs.add(faqId); // Guardamos que esta duda ya se respondió

    if(typeof inputEl !== 'string') inputEl.value = "";
    renderMessage(targetBody, "user", txt);

    // ... (resto de tu lógica de nichos)

    await sendToN8N(targetBody, txt);
}

  async function sendToN8N(targetBody, msg){
    const loading = document.createElement("div");
    loading.className = "ew-row bot";
    loading.innerHTML = '<div class="ew-bubble">...</div>';
    targetBody.appendChild(loading);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          chat_id: getChatId(),
          data: chatState.data
        })
      });

      const data = await res.json();
      loading.remove();

      let rawText = "";
      if (Array.isArray(data)) {
        rawText = data[0]?.output || (data[0]?.kwargs ? data[0].kwargs.content : "");
      } else {
        rawText = data.output || data.reply || (data.kwargs ? data.kwargs.content : "");
      }

      if (!rawText && data.message === "Workflow was started") {
        rawText = "La IA está pensando... por favor revisa la configuración del nodo Webhook en n8n.";
      }

      const botReply = rawText || "No pude procesar eso.";
      renderMessage(targetBody, "bot", botReply, faqSuggestions);

    } catch (e) {
      console.error("ERROR DE CONEXIÓN:", e);
      loading.remove();
      renderMessage(targetBody, "bot", "Error de conexión.");
    }
  }

  function showCalendly(targetBody) {
    if (chatState.activeInstance === 'embedded') {
        panelEmbedded.classList.add('show-calendly');
    } else {
        const calendlyButton = [
            { 
                label: "🗓️ Abrir Agenda de Eder", 
                onClick: () => window.open("https://calendly.com/ederarmo/30min", "_blank") 
            }
        ];
        renderMessage(targetBody, "bot", "Excelente. Elige el mejor horario para nuestra llamada de 15 min aquí:", calendlyButton);
    }
  }

  // --- 6. EVENT LISTENERS ---
  btnFloatOpen?.addEventListener("click", () => {
    panelFloat.classList.add("open");
    if (!bodyFloat.hasChildNodes()) initChatbot(bodyFloat, 'floating');
  });
  btnFloatClose?.addEventListener("click", () => panelFloat.classList.remove("open"));
  sendFloat?.addEventListener("click", () => handleUserText(inputFloat, bodyFloat));
  inputFloat?.addEventListener("keydown", (e) => e.key === "Enter" && handleUserText(inputFloat, bodyFloat));
  
  sendEmbedded?.addEventListener("click", () => handleUserText(inputEmbedded, bodyEmbedded));
  inputEmbedded?.addEventListener("keydown", (e) => e.key === "Enter" && handleUserText(inputEmbedded, bodyEmbedded));
