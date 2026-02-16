/* =========================================================
   MASTER SCRIPT: EDER CREA WEBS (Chatbot Híbrido + VSL)
   Lógica: Pre-calificación por botones -> IA Agent para dudas
   ========================================================= */

(function(){
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

  // --- 4. LÓGICA VSL (VIDEO) ---
  if(video) {
    let hasShownButton = false;
    video.muted = true;
    video.play().catch(()=>{});

    function startVideo(){
      video.muted = false;
      video.currentTime = 0;
      video.play();
      if(overlay) overlay.style.display = 'none';
    }

    btnPlay?.addEventListener('click', startVideo);
    btnWatchCase?.addEventListener('click', () => {
      vslSection?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(startVideo, 500);
    });

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

})();
