/* =========================================================
   MASTER SCRIPT: EDER CREA WEBS (Chatbot Híbrido + VSL)
   Lógica: Pre-calificación por botones -> IA Agent para dudas
   ========================================================= */

(function(){
  // ⚠️ CONFIGURACIÓN
  const WEBHOOK_URL = "https://n8n.edercreawebs.com/webhook/webchat";
  const CHAT_ID_KEY = "ew_chat_id_v5";
  const SESSION_ID_KEY = "ew_session_id_v1";

  function getCurrentLang() {
    return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'es';
  }

  const chatbotI18n = {
    es: {
      welcome: "👋 Hola. Ayudo a dueños de negocio a llenar su agenda con sistemas automáticos.\n\n¿Qué te gustaría ver primero?",
      btnPackage: "📦 Ver Paquete (Web + Chatbot)",
      btnQuote: "💰 Cotizar Precio",
      btnFaq: "❓ Dudas frecuentes",
      packageDetails:
        "Claro, el Paquete incluye:\n" +
        "- **Sitio Web o Landing Page**\n" +
        "- **Hosting y Dominio** por 1 año\n" +
        "- **Mantenimiento** de 3 meses\n" +
        "- **ChatBot Ai + Agenda**\n\n" +
        "Por **$12,000 MXN**. ¿Este monto se ajusta a tu presupuesto actual?",
      btnBudgetYes: "✅ Sí, es viable",
      btnBudgetLater: "⏳ Quizás luego",
      budgetLaterReply: "¡Sin problema! Te espero cuando estés listo. 👋",
      askNiche: "Perfecto. Para darte ejemplos reales, ¿en qué nicho está tu negocio?",
      nicheHealth: "Salud / Clínicas",
      nicheServices: "Servicios / Consultoría",
      nicheOther: "Otro (Escribir)",
      askNicheOther: "¿A qué te dedicas?",
      faqIntro: "Elige de las Preguntas Frecuentes, si no ves tu duda puedes escribirla, mi IA te responderá.",
      askAds: "¿Actualmente ya inviertes en publicidad (Ads) o dependes de recomendaciones?",
      btnAdsYes: "🚀 Sí, ya hago Ads",
      btnAdsNo: "📢 Solo orgánico",
      finalPitch: "¡Excelente! Parece que encaja perfecto contigo. ¿Quieres ver mi agenda para una llamada de 15 min o tienes dudas?",
      btnViewAgenda: "🗓️ Ver Agenda",
      btnHaveQuestions: "✍️ Tengo dudas",
      askCustomQuestion: "Dime, ¿qué duda tienes? Elige una opción o escribe tu pregunta y mi IA te responde:",
      faqPaymentsLabel: "💳 ¿Cómo son los pagos?",
      faqPaymentsPrompt: "¿Cómo funcionan los pagos?",
      faqMaintenanceLabel: "🛠️ ¿Qué mantenimiento manejas?",
      faqMaintenancePrompt: "¿Qué incluye el mantenimiento mensual?",
      faqCallLabel: "🗓️ Agendar llamada",
      loadingFallback: "La IA está pensando... por favor revisa la configuración del nodo Webhook en n8n.",
      genericFallback: "No pude procesar eso.",
      connectionError: "Error de conexión.",
      calendlyOpenBtn: "🗓️ Abrir Agenda de Eder",
      calendlyMessage: "Excelente. Elige el mejor horario para nuestra llamada de 15 min aquí:"
    },
    en: {
      welcome: "👋 Hi. I help business owners fill their schedule with automated systems.\n\nWhat would you like to see first?",
      btnPackage: "📦 View Package (Web + Chatbot)",
      btnQuote: "💰 Get a Quote",
      btnFaq: "❓ Frequently Asked Questions",
      packageDetails:
        "Great, the package includes:\n" +
        "- **Website or Landing Page**\n" +
        "- **Hosting and Domain** for 1 year\n" +
        "- **Maintenance** for 3 months\n" +
        "- **AI Chatbot + Booking**\n\n" +
        "For **$12,000 MXN**. Does this fit your current budget?",
      btnBudgetYes: "✅ Yes, it works",
      btnBudgetLater: "⏳ Maybe later",
      budgetLaterReply: "No problem. I will be here when you are ready. 👋",
      askNiche: "Perfect. To show you real examples, what niche is your business in?",
      nicheHealth: "Health / Clinics",
      nicheServices: "Services / Consulting",
      nicheOther: "Other (Type)",
      askNicheOther: "What do you do?",
      faqIntro: "Choose from the FAQs. If you do not see your question, type it and my AI will answer.",
      askAds: "Are you currently investing in ads, or relying on referrals?",
      btnAdsYes: "🚀 Yes, I run ads",
      btnAdsNo: "📢 Organic only",
      finalPitch: "Excellent. It looks like this is a great fit for you. Do you want to see my calendar for a 15-minute call, or do you have questions?",
      btnViewAgenda: "🗓️ View Calendar",
      btnHaveQuestions: "✍️ I have questions",
      askCustomQuestion: "Tell me your question. Pick an option or type your own and my AI will reply:",
      faqPaymentsLabel: "💳 How do payments work?",
      faqPaymentsPrompt: "How do payments work?",
      faqMaintenanceLabel: "🛠️ What maintenance do you offer?",
      faqMaintenancePrompt: "What does monthly maintenance include?",
      faqCallLabel: "🗓️ Schedule a call",
      loadingFallback: "AI is thinking... please check the n8n Webhook node configuration.",
      genericFallback: "I could not process that.",
      connectionError: "Connection error.",
      calendlyOpenBtn: "🗓️ Open Eder's Calendar",
      calendlyMessage: "Great. Choose the best time for our 15-minute call here:"
    }
  };

  function t(key) {
    const lang = getCurrentLang();
    return chatbotI18n[lang]?.[key] || chatbotI18n.es[key] || key;
  }

  function getFaqSuggestions() {
    return [
      {
        id: "pagos",
        label: t('faqPaymentsLabel'),
        onClick: (targetBody) => handleUserText({ value: t('faqPaymentsPrompt') }, targetBody, "pagos")
      },
      {
        id: "mantenimiento",
        label: t('faqMaintenanceLabel'),
        onClick: (targetBody) => handleUserText({ value: t('faqMaintenancePrompt') }, targetBody, "mantenimiento")
      },
      {
        id: "agenda",
        label: t('faqCallLabel'),
        onClick: (targetBody) => showCalendly(targetBody)
      }
    ];
  }

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
  const navHamburger = document.getElementById('navHamburger');
  const navMenu = document.getElementById('navMenu');
  const toggleBwModeBtn = document.getElementById('toggleBwMode');
  const langEsBtn = document.getElementById('langEs');
  const langEnBtn = document.getElementById('langEn');

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

  const textNodeRegistry = [];

  const languageMap = {
    en: {
      "Iniciar sesión": "Log in",
      "Ver cursos": "View courses",
      "Hablar con Eder": "Talk to Eder",
      "Black and White Mode": "Black and White Mode",
      "Español": "Spanish",
      "English": "English",
      "Sitios web para Psicólogos": "Websites for Psychologists",
      "Deja de": "Stop",
      "perder pacientes": "losing patients",
      "mientras estás en consulta": "while you are in session",
      "-65% Menos Ausencias": "-65% Fewer No-Shows",
      "+32% Citas Agendadas": "+32% Booked Appointments",
      "Sitio web + Agenda automática y recordatorios por WhatsApp que": "Website + automatic booking and WhatsApp reminders that",
      "reducen ausencias y cancelaciones": "reduce no-shows and cancellations",
      "Ver el caso real (30 seg)": "Watch the real case (30 sec)",
      "Lo entiendo, hablar con Eder.": "I get it, talk to Eder.",
      "Experto en las mejores plataformas": "Expert in top platforms",
      "Lo que puedo integrar en tu web": "What I can integrate into your website",
      "Haz clic en cualquier herramienta para ver el demo.": "Click any tool to view the demo.",
      "Selecciona una herramienta del grid": "Select a tool from the grid",
      "Video próximamente": "Video coming soon",
      "Los problemas que YO resuelvo": "Problems that I solve",
      "Pierdes clientes porque no contestas": "You lose clients because you do not reply",
      "Venta lenta y desgastante": "Slow and exhausting sales",
      "No confían en ti": "They do not trust you",
      "Ver Solución #1": "View Solution #1",
      "Ver Solución #2": "View Solution #2",
      "Ver Solución #3": "View Solution #3",
      "Ocultar Solución #1": "Hide Solution #1",
      "Ocultar Solución #2": "Hide Solution #2",
      "Ocultar Solución #3": "Hide Solution #3",
      "Lo que dicen mis clientes": "What my clients say",
      "Cursos y videos gratuitos": "Free courses and videos",
      "Aprende a tu ritmo diseno web, creacion de contenido y mentalidad creativa.": "Learn web design, content creation and creative mindset at your own pace.",
      "Para cotizarte, te preguntaré:": "To quote your project, I will ask:",
      "¿Qué vendes?": "What do you sell?",
      "Producto o servicio.": "Product or service.",
      "¿Qué esperas recibir?": "What do you expect to get?",
      "Resultados, referencias o ejemplos que te gusten.": "Results, references or examples you like.",
      "Si construyes el camino, ellos vendrán.": "If you build the path, they will come.",
      "Agendar": "Book",
      "Condiciones": "Terms",
      "Privacidad": "Privacy",
      "Todos los derechos reservados.": "All rights reserved.",
      "Hablar conmigo": "Talk with me",
      "Asistente de Eder": "Eder Assistant",
      "Precalificación y Agenda": "Pre-qualification and Booking",
      "Agenda tu Estrategia": "Book your Strategy",
      "Escribe aquí...": "Type here...",
      "Enviar": "Send",
      "Abrir menu": "Open menu",
      "Curso destacado": "Featured course",
      "Aprende a crear una web que te consiga clientes": "Learn to build a website that gets you clients",
      "Entra hoy y aplica el sistema paso a paso para vender con tu web.": "Join today and apply the step-by-step system to sell with your website.",
      "De": "From",
      "Hoy": "Today",
      "Tomar el curso": "Take the course"
    }
  };

  function registerTextNodes() {
    textNodeRegistry.length = 0;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parentTag = node.parentElement?.tagName;
      if (!parentTag || parentTag === 'SCRIPT' || parentTag === 'STYLE') continue;
      const original = node.nodeValue;
      if (!original || !original.trim()) continue;
      textNodeRegistry.push({ node, original });
    }
  }

  function translateText(original, lang) {
    if (lang !== 'en') return original;
    let translated = original;
    const map = languageMap.en;
    Object.keys(map).forEach((key) => {
      translated = translated.replaceAll(key, map[key]);
    });
    return translated;
  }

  function translateAttributes(lang) {
    const attrTargets = document.querySelectorAll('[placeholder], [title], [aria-label]');
    attrTargets.forEach((el) => {
      ['placeholder', 'title', 'aria-label'].forEach((attr) => {
        const value = el.getAttribute(attr);
        if (!value) return;
        const dataKey = `original${attr.charAt(0).toUpperCase()}${attr.slice(1).replace('-', '')}`;
        if (!el.dataset[dataKey]) el.dataset[dataKey] = value;
        const source = el.dataset[dataKey];
        el.setAttribute(attr, translateText(source, lang));
      });
    });
  }

  function setLanguage(lang) {
    const normalized = lang === 'en' ? 'en' : 'es';
    document.documentElement.setAttribute('lang', normalized);
    textNodeRegistry.forEach((item) => {
      item.node.nodeValue = translateText(item.original, normalized);
    });
    translateAttributes(normalized);

    langEsBtn?.classList.toggle('is-active', normalized === 'es');
    langEnBtn?.classList.toggle('is-active', normalized === 'en');

    localStorage.setItem('ew_lang_mode', normalized);
  }

  function setBwMode(enabled) {
    document.body.classList.toggle('bw-mode', !!enabled);
    localStorage.setItem('ew_bw_mode', enabled ? '1' : '0');
  }

  // --- 3. ESTADO ---
  let chatState = {
    currentState: "idle", 
    activeInstance: "none",
    data: { interest: "", ads: "", niche: "", phone: "", budget_ok: "" }
  };

  function toggleSolution(solutionNumber){
    const targetId = `sol-${solutionNumber}`;
    const allSolutions = Array.from(document.querySelectorAll('.solucion-content'));
    const isEnglish = document.documentElement.getAttribute('lang') === 'en';

    allSolutions.forEach((solution) => {
      const isTarget = solution.id === targetId;
      solution.classList.toggle('active', isTarget ? !solution.classList.contains('active') : false);
    });

    const allButtons = Array.from(document.querySelectorAll('.btn-solucion'));
    allButtons.forEach((button, index) => {
      const btnNumber = index + 1;
      const currentSolution = document.getElementById(`sol-${btnNumber}`);
      const isOpen = currentSolution?.classList.contains('active');
      button.textContent = isOpen
        ? (isEnglish ? `Hide Solution #${btnNumber}` : `Ocultar Solución #${btnNumber}`)
        : (isEnglish ? `View Solution #${btnNumber}` : `Ver Solución #${btnNumber}`);
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
    const socialVideos = Array.from(document.querySelectorAll('.social-video'));
    if (!socialVideos.length) return;

    socialVideos.forEach((clip) => {
      const shell = clip.closest('.social-video-shell');
      if (!shell) return;

      clip.muted = true;
      clip.playsInline = true;

      const playClip = () => {
        const playAttempt = clip.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
          playAttempt.catch(() => {});
        }
      };

      const resetClip = () => {
        clip.pause();
        clip.currentTime = 0;
      };

      shell.addEventListener('mouseenter', playClip);
      shell.addEventListener('mouseleave', resetClip);
      shell.addEventListener('focusin', playClip);
      shell.addEventListener('focusout', resetClip);
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
      t('welcome'),
      [
        { label: t('btnPackage'), onClick: () => handleFlow(targetBody, "show_package") },
        { label: t('btnQuote'), onClick: () => handleFlow(targetBody, "show_package") },
        { label: t('btnFaq'), onClick: () => handleFlow(targetBody, "faq") }
      ]
    );
  }

  function handleFlow(targetBody, step){
    // PASO: Detalle del Paquete y Filtro de Presupuesto
    if (step === "show_package") {
      renderMessage(targetBody, "bot", 
        t('packageDetails'),
        [
          { label: t('btnBudgetYes'), onClick: () => { chatState.data.budget_ok = getCurrentLang() === 'en' ? "Yes" : "Si"; handleFlow(targetBody, "ask_niche"); } },
          { label: t('btnBudgetLater'), onClick: () => renderMessage(targetBody, "bot", t('budgetLaterReply')) }
        ]
      );
    }

    // PASO: Pregunta de Nicho
    if(step === "ask_niche"){
      chatState.currentState = "qualifying";
      renderMessage(targetBody, "bot", 
        t('askNiche'),
        [
          { label: t('nicheHealth'), onClick: () => { chatState.data.niche = t('nicheHealth'); handleFlow(targetBody, "ask_ads"); } },
          { label: t('nicheServices'), onClick: () => { chatState.data.niche = t('nicheServices'); handleFlow(targetBody, "ask_ads"); } },
          { label: t('nicheOther'), onClick: () => { chatState.currentState = "waiting_niche"; renderMessage(targetBody, "bot", t('askNicheOther')); } }
        ]
      );
    }

    // PASO: Dudas Frecuentes (FAQ)
    if(step === "faq"){
      chatState.currentState = "ai_chat"; 
      renderMessage(targetBody, "bot", 
        t('faqIntro'),
        getFaqSuggestions() 
      );
    }

    // PASO: Inversión en Publicidad
    if(step === "ask_ads"){
      renderMessage(targetBody, "bot", 
        t('askAds'),
        [
          { label: t('btnAdsYes'), onClick: () => { chatState.data.ads = getCurrentLang() === 'en' ? "Yes" : "Si"; handleFlow(targetBody, "final"); } },
          { label: t('btnAdsNo'), onClick: () => { chatState.data.ads = getCurrentLang() === 'en' ? "No" : "No"; handleFlow(targetBody, "final"); } }
        ]
      );
    }

    // PASO: Cierre / Conversión
    if(step === "final"){
      renderMessage(targetBody, "bot", 
        t('finalPitch'),
        [
          { label: t('btnViewAgenda'), onClick: () => showCalendly(targetBody) },
          { label: t('btnHaveQuestions'), onClick: () => { chatState.currentState = "ai_chat"; renderMessage(targetBody, "bot", t('askCustomQuestion'), 
                getFaqSuggestions() 
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
        rawText = t('loadingFallback');
      }

      const botReply = rawText || t('genericFallback');
      renderMessage(targetBody, "bot", botReply, getFaqSuggestions());

    } catch (e) {
      console.error("ERROR DE CONEXIÓN:", e);
      loading.remove();
      renderMessage(targetBody, "bot", t('connectionError'));
    }
  }

  function showCalendly(targetBody) {
    if (chatState.activeInstance === 'embedded') {
        panelEmbedded.classList.add('show-calendly');
    } else {
        const calendlyButton = [
            { 
          label: t('calendlyOpenBtn'), 
                onClick: () => window.open("https://calendly.com/ederarmo/30min", "_blank") 
            }
        ];
      renderMessage(targetBody, "bot", t('calendlyMessage'), calendlyButton);
    }
  }

  // --- 6. EVENT LISTENERS ---
  registerTextNodes();

  const savedLang = localStorage.getItem('ew_lang_mode') || 'es';
  const savedBwMode = localStorage.getItem('ew_bw_mode') === '1';
  setLanguage(savedLang);
  setBwMode(savedBwMode);

  navHamburger?.addEventListener('click', () => {
    const willOpen = !navMenu?.classList.contains('open');
    navMenu?.classList.toggle('open', willOpen);
    navHamburger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    navMenu?.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
  });

  document.addEventListener('click', (e) => {
    if (!navMenu || !navHamburger) return;
    if (navMenu.contains(e.target) || navHamburger.contains(e.target)) return;
    navMenu.classList.remove('open');
    navHamburger.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !navMenu || !navHamburger) return;
    navMenu.classList.remove('open');
    navHamburger.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
  });

  langEsBtn?.addEventListener('click', () => setLanguage('es'));
  langEnBtn?.addEventListener('click', () => setLanguage('en'));
  toggleBwModeBtn?.addEventListener('click', () => setBwMode(!document.body.classList.contains('bw-mode')));

  navMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navHamburger?.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
    });
  });

  btnFloatOpen?.addEventListener("click", () => {
    panelFloat.classList.add("open");
    if (!bodyFloat.hasChildNodes()) initChatbot(bodyFloat, 'floating');
  });
  btnFloatClose?.addEventListener("click", () => panelFloat.classList.remove("open"));
  sendFloat?.addEventListener("click", () => handleUserText(inputFloat, bodyFloat));
  inputFloat?.addEventListener("keydown", (e) => e.key === "Enter" && handleUserText(inputFloat, bodyFloat));
  
  sendEmbedded?.addEventListener("click", () => handleUserText(inputEmbedded, bodyEmbedded));
  inputEmbedded?.addEventListener("keydown", (e) => e.key === "Enter" && handleUserText(inputEmbedded, bodyEmbedded));

})();
