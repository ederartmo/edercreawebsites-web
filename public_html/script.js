/* =========================================================
   MASTER SCRIPT: EDER CREA WEBS (Chatbot Híbrido + VSL)
   Lógica: Pre-calificación por botones -> IA Agent para dudas
   ========================================================= */

(function(){
  // ⚠️ CONFIGURACIÓN
  const WEBHOOK_URL = "https://n8n.edercreawebs.com/webhook/webchat";
  const CHAT_ID_KEY = "ew_chat_id_v5";
  const SESSION_ID_KEY = "ew_session_id_v1";

  // --- 1. REFERENCIAS AL DOM (VIDEO VSL) ---
  const video = document.getElementById('vslVideo');
  const overlay = document.getElementById('vslOverlay');
  const btnPlay = document.getElementById('vslStartAudio');
  const btnDemo = document.getElementById('btnDemoOverlay');
  const flipCard = document.getElementById('flipCard');
  const btnFlipBack = document.getElementById('btnFlipBack');
  const progress = document.getElementById('vslProgress');
  const playPause = document.getElementById('vslPlayPause');
  const restart = document.getElementById('vslRestart');
  const mute = document.getElementById('vslMute');
  const btnWatchCase = document.getElementById('btnWatchCase');
  const vslSection = document.getElementById('vslSection');

  // --- 2. REFERENCIAS AL DOM (CHATBOT) ---
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
  const calendlyContainer = document.getElementById('calendlyContainer');

  // --- ESTADO ---
  let chatState = {
    currentState: "idle", // idle | qualifying | ai_chat | waiting_phone | finished
    activeInstance: "none",
    data: {
      interest: "",
      ads: "",
      niche: "",
      phone: "",
      budget_ok: ""
    }
  };

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
      chips.forEach(c => {
        const b = document.createElement("button");
        b.className = "ew-chip";
        b.textContent = c.label;
        b.onclick = () => {
          wrap.remove();
          renderMessage(targetBody, "user", c.label);
          c.onClick();
        };
        wrap.appendChild(b);
      });
      targetBody.appendChild(wrap);
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
        { label: "📦 Ver Paquete (Web + Chatbot)", onClick: () => handleFlow(targetBody, "ask_niche") },
        { label: "💰 Cotizar Precio", onClick: () => handleFlow(targetBody, "show_price") },
        { label: "❓ Dudas frecuentes", onClick: () => handleFlow(targetBody, "faq") }
      ]
    );
  }

  function handleFlow(targetBody, step){
    if(step === "show_price"){
      renderMessage(targetBody, "bot", 
        "El sistema completo tiene una inversión de **$12,000 MXN**.\n\n¿Este monto se ajusta a tu presupuesto actual?",
        [
          { label: "✅ Sí, es viable", onClick: () => { chatState.data.budget_ok = "Si"; handleFlow(targetBody, "ask_niche"); } },
          { label: "⏳ Quizás luego", onClick: () => renderMessage(targetBody, "bot", "¡Sin problema! Te espero cuando estés listo. 👋") }
        ]
      );
    }

    if(step === "faq"){
      renderMessage(targetBody, "bot", 
        "El sistema reduce ausencias confirmando por WhatsApp y liberando espacios no pagados. ¿Te gustaría ver si aplica a tu negocio?",
        [{ label: "Sí, cuéntame", onClick: () => handleFlow(targetBody, "ask_niche") }]
      );
    }

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

    if(step === "ask_ads"){
      renderMessage(targetBody, "bot", 
        "¿Actualmente ya inviertes en publicidad (Ads) o dependes de recomendaciones?",
        [
          { label: "🚀 Sí, ya hago Ads", onClick: () => { chatState.data.ads = "Si"; handleFlow(targetBody, "final"); } },
          { label: "📢 Solo orgánico", onClick: () => { chatState.data.ads = "No"; handleFlow(targetBody, "final"); } }
        ]
      );
    }

    if(step === "final"){
      renderMessage(targetBody, "bot", 
        "¡Excelente! Parece que encaja perfecto contigo. ¿Quieres ver mi agenda para una llamada de 15 min o tienes dudas?",
        [
          { label: "🗓️ Ver Agenda", onClick: () => showCalendly(targetBody) },
          { label: "✍️ Tengo dudas", onClick: () => { chatState.currentState = "ai_chat"; renderMessage(targetBody, "bot", "Dime, ¿qué duda tienes? Mi IA te responde:"); } }
        ]
      );
    }
  }

  async function handleUserText(inputEl, targetBody){
    const txt = inputEl.value.trim();
    if(!txt) return;
    inputEl.value = "";
    renderMessage(targetBody, "user", txt);

    if(chatState.currentState === "waiting_niche"){
      chatState.data.niche = txt;
      handleFlow(targetBody, "ask_ads");
      return;
    }

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
      console.log("DEPURACIÓN: Datos recibidos de n8n:", data);
      loading.remove();

      // 1. Extraer el texto de la respuesta (maneja todos los formatos de n8n/LangChain)
      let rawText = "";
      if (Array.isArray(data)) {
        rawText = data[0]?.output || (data[0]?.kwargs ? data[0].kwargs.content : "");
      } else {
        rawText = data.output || data.reply || (data.kwargs ? data.kwargs.content : "");
      }

      // 2. Manejo de error si n8n responde con mensaje genérico
      if (!rawText && data.message === "Workflow was started") {
        rawText = "La IA está pensando... por favor revisa que en el nodo Webhook de n8n la opción 'Respond' sea 'When Last Node Finishes'.";
      }

      const botReply = rawText || "No pude procesar eso.";

      // 3. Definición de las 3 opciones de preguntas frecuentes (Sugerencias)
      const faqSuggestions = [
        { 
          label: "💳 ¿Cómo son los pagos?", 
          onClick: () => handleUserText({ value: "¿Cómo funcionan los pagos y reembolsos?" }, targetBody) 
        },
        { 
          label: "🛠️ ¿Qué mantenimiento tiene?", 
          onClick: () => handleUserText({ value: "¿Qué incluye el mantenimiento mensual?" }, targetBody) 
        },
        { 
          label: "🗓️ Agendar llamada", 
          onClick: () => showCalendly(targetBody) 
        }
      ];

      // 4. Renderizar el mensaje con los botones de sugerencia integrados
      renderMessage(targetBody, "bot", botReply, faqSuggestions);

    } catch (e) {
      console.error("ERROR DE CONEXIÓN:", e);
      loading.remove();
      renderMessage(targetBody, "bot", "Error de conexión.");
    }
  }

  function showCalendly(targetBody){
    if(chatState.activeInstance === 'embedded'){
      panelEmbedded.classList.add('show-calendly');
    } else {
      renderMessage(targetBody, "bot", "Agenda aquí: [Link a Calendly]");
    }
  }

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
