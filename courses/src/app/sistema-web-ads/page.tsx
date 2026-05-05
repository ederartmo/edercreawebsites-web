import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "EderCreaWebs | Sistema Web + Ads",
	description:
		"Sistema Web + Ads para atraer interesados, llevarlos a una web clara y convertirlos en citas, mensajes o pagos.",
};

export default function SistemaWebAdsPage() {
	return (
		<>
			<main className="page">
				<div className="top-offer-bar">
					<div className="container top-offer-inner">
						<span>Sistema Web + Ads</span>
						<span>Atrae interesados, llevalos a una web clara y conviertelos en citas, mensajes o pagos</span>
						<span>
							<a className="tiny-pill" href="#lead-form">
								Solicitar diagnostico
							</a>
						</span>
					</div>
				</div>

				<section className="hero">
					<div className="container">
						<div className="hero-heading">
							<p className="pretitle">Para negocios de servicios que quieren vender mas claro</p>
							<h1>Deja de improvisar tu venta digital y convierte anuncios en clientes reales</h1>
							<div className="green-line">Con web, agenda, pagos, anuncios y contenido trabajando juntos.</div>
							<p className="hero-sub">
								Un sistema mensual para atraer interesados, explicar tu oferta, generar confianza y convertirlos en
								mensajes, citas o pagos. Sin que tu WhatsApp parezca central de emergencias.
							</p>
						</div>

						<div className="hero-grid">
							<div className="hero-left">
								<div className="video-card">
									<div className="video-title">LA WEB QUE SI EXPLICA Y LOS ADS QUE SI EMPUJAN</div>
								</div>
								<div className="author-card">
									<div className="author-avatar" />
									<div>
										<strong>EderCreaWebs</strong>
										<span>Sitios web, anuncios, contenido y embudos simples.</span>
									</div>
								</div>
								<div className="hero-bio">
									<h3>Quien es Eder?</h3>
									<p>
										Creador de sitios web y sistemas comerciales simples para negocios que quieren convertir trafico
										en conversaciones, citas o ventas.
									</p>
								</div>
							</div>

							<div className="hero-right">
								<div className="offer-card">
									<div className="offer-mockup">
										<div className="offer-stack">
											<div className="offer-word">
												<small>Sitio</small>
												<strong>WEB</strong>
											</div>
											<div className="offer-plus">+</div>
											<div className="offer-word">
												<small>Meta</small>
												<strong>ADS</strong>
											</div>
											<div className="offer-plus">+</div>
											<div className="offer-word">
												<small>Terminal de</small>
												<strong>PAGOS</strong>
											</div>
										</div>
									</div>
									<div className="price">
										Setup desde <del>$20,000</del> <strong>$15,000 MXN</strong>
									</div>
									<div className="monthly">Mensualidad desde $10,000 MXN · Inversion publicitaria por separado</div>

									<div className="hero-form" id="lead-form">
										<div className="hero-form-title">
											Recibe una propuesta para tu <strong>Sistema Web + Ads</strong>
										</div>
										<div className="form-steps">
											<div className="form-step">
												<strong>#1: Solicita Diagnostico</strong>
												<span>Ingresa tu informacion</span>
											</div>
											<div className="form-step">
												<strong>#2: Te Contacto</strong>
												<span>Revisamos tu caso</span>
											</div>
										</div>

										<form className="lead-form" action="#" method="post">
											<input type="text" name="nombre" placeholder="Tu Nombre Completo" autoComplete="name" required />
											<input type="email" name="email" placeholder="Tu Email" autoComplete="email" required />
											<div className="phone-row">
												<div className="country-code">🇲🇽 <span>⌄</span></div>
												<input
													type="tel"
													name="whatsapp"
													placeholder="Tu Numero de Whatsapp"
													autoComplete="tel"
													required
												/>
											</div>
											<button className="form-submit" type="submit">
												<strong>Quiero mi Sistema Web + Ads</strong>
												<span>Solicitar diagnostico</span>
											</button>
										</form>

										<div className="hero-trust">
											<div className="seal-mini">SIN<br />PREGUNTAS</div>
											<p>Si no hace sentido para tu negocio, te lo digo antes de venderte.</p>
										</div>

										<div className="payment-logos hero-payments" aria-label="Metodos de pago">
											<span className="pay-logo">VISA</span>
											<span className="pay-logo">Mastercard</span>
											<span className="pay-logo">AMEX</span>
											<span className="pay-logo">Transferencia</span>
											<span className="pay-logo">Apple Pay</span>
										</div>
										<div className="hero-encrypted">🔒 Formulario seguro · Tus datos se usan solo para contactarte</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="section proof-section">
					<div className="container">
						<div className="section-title">
							<h2>Esto dicen de mi forma de trabajar</h2>
							<p>Clientes, campanas, mensajes y pruebas reales de embudos mas claros.</p>
						</div>
						<div className="proof-grid">
							<div className="screenshot">
								<div className="screen-head" />
								<div className="screen-line" />
								<div className="screen-line mid" />
								<div className="screen-line short" />
							</div>
							<div className="screenshot dark">
								<div className="screen-head" />
								<div className="screen-line" />
								<div className="screen-line mid" />
								<div className="screen-line short" />
							</div>
							<div className="screenshot dark">
								<div className="screen-head" />
								<div className="screen-line" />
								<div className="screen-line mid" />
								<div className="screen-line" />
							</div>
							<div className="screenshot">
								<div className="screen-head" />
								<div className="screen-line" />
								<div className="screen-line mid" />
								<div className="screen-line short" />
							</div>
							<div className="screenshot tall dark">
								<div className="screen-head" />
								<div className="screen-line" />
								<div className="screen-line" />
								<div className="screen-line mid" />
								<div className="screen-line short" />
								<div className="screen-line" />
							</div>
							<div className="screenshot tall">
								<div className="screen-head" />
								<div className="screen-line" />
								<div className="screen-line mid" />
								<div className="screen-line" />
								<div className="screen-line short" />
								<div className="screen-line" />
							</div>
							<div className="screenshot">
								<div className="screen-head" />
								<div className="screen-line" />
								<div className="screen-line mid" />
								<div className="screen-line short" />
							</div>
							<div className="screenshot dark">
								<div className="screen-head" />
								<div className="screen-line" />
								<div className="screen-line mid" />
								<div className="screen-line short" />
							</div>
						</div>
						<a className="blue-cta" href="#lead-form">
							Quiero un embudo que tambien traiga trafico
						</a>
					</div>
				</section>

				<section className="problem-section">
					<div className="narrow">
						<h2>
							El problema no es solo tu web.
							<br />
							Es que tu embudo completo no esta conectado.
						</h2>
						<div className="problem-copy">
							<p>
								Puedes tener buen servicio, buen contenido y hasta anuncios corriendo. Pero si cada pieza comunica
								algo diferente, el cliente se pierde antes de comprar.
							</p>
							<ul>
								<li>El anuncio promete una cosa y la web explica otra.</li>
								<li>El cliente llega interesado, pero no sabe si debe escribir, agendar o pagar.</li>
								<li>WhatsApp se llena de conversaciones frias y repetidas.</li>
								<li>No hay creativos nuevos para probar cada mes.</li>
								<li>No se revisa que mensaje si esta generando prospectos.</li>
							</ul>
							<p>
								Por eso no basta con tener una pagina bonita. Necesitas una ruta mensual: anuncio, landing, video,
								WhatsApp, agenda y seguimiento.
							</p>
						</div>
					</div>
				</section>

				<section className="system-intro center">
					<div className="narrow">
						<h2>Sistema Web + Ads</h2>
						<p>
							Una estructura mensual para atraer interesados, llevarlos a una landing clara y convertirlos en
							mensajes, citas o pagos.
						</p>
					</div>
				</section>

				<section className="modules-section">
					<div className="container">
						<article className="module-card">
							<div className="module-topbar">
								<div className="module-price-row">
									<span className="value-badge">
										VALOR: <del>$10,000 MXN</del>
									</span>
									<span className="included-price">Incluido en $15,000</span>
								</div>
								<h3>Landing + embudo estrategico</h3>
							</div>
							<div className="module-content">
								<div className="module-text">
									<p>
										Pagina disenada para conectar tu anuncio con una oferta clara: que vendes, por que confiar, que
										incluye y cual es el siguiente paso.
									</p>
									<a className="small-button" href="#lead-form">
										Lo quiero
									</a>
								</div>
								<div className="module-visual">🌐</div>
							</div>
						</article>

						<article className="module-card">
							<div className="module-topbar">
								<div className="module-price-row">
									<span className="value-badge">
										VALOR: <del>$3,000 MXN</del>
									</span>
									<span className="included-price">Incluido en $15,000</span>
								</div>
								<h3>Agenda, WhatsApp y pagos</h3>
							</div>
							<div className="module-content">
								<div className="module-text">
									<p>
										Para que el cliente pueda escribirte con contexto, agendar, dejar sus datos o pagar en linea
										cuando tu modelo lo permita.
									</p>
									<a className="small-button" href="#lead-form">
										Lo quiero
									</a>
								</div>
								<div className="module-visual">💳</div>
							</div>
						</article>

						<article className="module-card">
							<div className="module-topbar">
								<div className="module-price-row">
									<span className="value-badge">
										VALOR: <del>$5,000 MXN</del>
									</span>
									<span className="included-price">Incluido en $15,000</span>
								</div>
								<h3>Meta Ads + instalacion de Pixel</h3>
							</div>
							<div className="module-content">
								<div className="module-text">
									<p>
										Configuracion, instalacion de Meta Pixel, monitoreo y optimizacion de campanas para atraer
										interesados hacia una ruta clara, no solo mandar trafico a ver que pasa.
									</p>
									<a className="small-button" href="#lead-form">
										Lo quiero
									</a>
								</div>
								<div className="module-visual">📣</div>
							</div>
						</article>

						<article className="module-card">
							<div className="module-topbar">
								<div className="module-price-row">
									<span className="value-badge">
										VALOR: <del>$6,000 MXN</del>
									</span>
									<span className="included-price">Incluido en $15,000</span>
								</div>
								<h3>4 creativos publicitarios al mes</h3>
							</div>
							<div className="module-content">
								<div className="module-text">
									<p>
										Ideas, guiones y edicion de hasta 4 anuncios mensuales usando material del cliente. Para clientes
										locales, puede incluir sesion de grabacion mensual en paquete avanzado.
									</p>
									<a className="small-button" href="#lead-form">
										Lo quiero
									</a>
								</div>
								<div className="module-visual">▶️</div>
							</div>
						</article>
					</div>
				</section>

				<section className="work-section">
					<div className="container">
						<div className="section-title">
							<h2>
								Primero construimos.
								<br />
								Despues optimizamos.
							</h2>
							<p>
								Tu sistema se divide en una base inicial y una gestion mensual para que el embudo no se quede
								abandonado.
							</p>
						</div>

						<div className="work-grid">
							<article className="work-card">
								<div className="work-label">Paso 1</div>
								<h3>Setup inicial</h3>
								<div className="work-price">Desde $15,000 MXN</div>
								<p>Construimos la base completa para que tu trafico llegue a una ruta clara.</p>
								<ul className="work-list">
									<li>Landing de conversion</li>
									<li>WhatsApp, agenda y formulario</li>
									<li>Terminal de pagos si aplica</li>
									<li>Instalacion de Meta Pixel</li>
									<li>Publicacion y revision final</li>
								</ul>
							</article>

							<article className="work-card">
								<div className="work-label">Plan mensual</div>
								<h3>Gestion mensual</h3>
								<div className="work-price">Desde $10,000 MXN/mes</div>
								<p>Manejamos campanas, revisamos metricas y ajustamos el embudo para no desperdiciar trafico.</p>
								<ul className="work-list">
									<li>Manejo de Meta Ads</li>
									<li>Optimizacion del embudo</li>
									<li>Ajustes menores en la landing</li>
									<li>4 creativos con material del cliente</li>
									<li>Reporte mensual simple</li>
								</ul>
							</article>

							<article className="work-card">
								<div className="work-label">Opcion local</div>
								<h3>Contenido local</h3>
								<div className="work-price">Desde $15,000 MXN/mes</div>
								<p>Para negocios locales que necesitan anuncios grabados y editados cada mes.</p>
								<ul className="work-list">
									<li>1 sesion de grabacion mensual</li>
									<li>Ideas y guiones base</li>
									<li>Hasta 4 anuncios editados</li>
									<li>Adaptaciones para campanas</li>
									<li>Disponible local o bajo cotizacion</li>
								</ul>
							</article>
						</div>

						<a className="work-cta" href="#lead-form">
							Quiero mi diagnostico para elegir el plan correcto
						</a>

						<div className="work-note">
							Inversion publicitaria <span>por separado</span>. Cupos limitados a <span>3 clientes activos</span> de
							gestion mensual.
						</div>
					</div>
				</section>

				<section className="guarantee">
					<div className="container">
						<h2>Si el sistema no tiene sentido para tu negocio... te lo digo antes de venderte</h2>
						<div className="seal">CLARO</div>
						<p>
							Antes de construir, revisamos tu oferta, tus margenes, tu capacidad de atender clientes y si tiene
							sentido invertir en ads.
						</p>
						<p>
							No me interesa venderte ads por vender ads. Me interesa que el anuncio, la web, el video y el
							seguimiento trabajen como un solo sistema.
						</p>
					</div>
				</section>

				<section className="section faq-section">
					<div className="narrow">
						<div className="section-title">
							<h2>FAQ</h2>
						</div>
						<div className="faq-list">
							<div className="faq-item">
								<button className="faq-question" type="button">
									Esto sirve si apenas estoy empezando? <span>⌄</span>
								</button>
							</div>
							<div className="faq-item">
								<button className="faq-question" type="button">
									Puedo usar mi dominio actual? <span>⌄</span>
								</button>
							</div>
							<div className="faq-item">
								<button className="faq-question" type="button">
									Incluye hosting? <span>⌄</span>
								</button>
							</div>
							<div className="faq-item">
								<button className="faq-question" type="button">
									Tambien configuras WhatsApp, agenda y pagos? <span>⌄</span>
								</button>
							</div>
							<div className="faq-item">
								<button className="faq-question" type="button">
									La inversion en anuncios va incluida? <span>⌄</span>
								</button>
							</div>
							<div className="faq-item">
								<button className="faq-question" type="button">
									Incluye instalacion de Meta Pixel? <span>⌄</span>
								</button>
							</div>
							<div className="faq-item">
								<button className="faq-question" type="button">
									Cuanto tarda? <span>⌄</span>
								</button>
							</div>
							<div className="faq-item">
								<button className="faq-question" type="button">
									Que necesito para empezar? <span>⌄</span>
								</button>
							</div>
						</div>
					</div>
				</section>

				<section className="options" id="contacto">
					<div className="container">
						<div className="section-title">
							<h2>
								Ahora tienes
								<br />
								dos opciones
							</h2>
						</div>
						<div className="options-grid">
							<div className="option-card option-bad">
								<span className="option-label">OPCION 1</span>
								<h3>Seguir improvisando</h3>
								<p>
									Subir posts sueltos, contestar mensajes frios, depender de recomendaciones y esperar que el
									cliente entienda solo.
								</p>
							</div>
							<div className="option-card option-good">
								<span className="option-label">OPCION 2</span>
								<h3>Instalar tu Sistema Web + Ads</h3>
								<p>
									Crear un sistema donde anuncio, landing, video, WhatsApp, agenda y pagos esten conectados para
									convertir mejor.
								</p>
							</div>
						</div>
						<div className="options-copy">
							<p>Si ya vas a invertir en anuncios, necesitas una estructura que no desperdicie ese trafico.</p>
							<small>
								Dejame tus datos y vemos si te conviene el plan de $10,000/mes o el plan local con contenido
								desde $15,000/mes.
							</small>
						</div>

						<div className="lead-form-card" id="bottom-lead-form">
							<div className="form-steps">
								<div className="form-step">
									<strong>#1: Solicita Diagnostico</strong>
									<span>Ingresa tu informacion</span>
								</div>
								<div className="form-step">
									<strong>#2: Te Contacto</strong>
									<span>Revisamos tu caso</span>
								</div>
							</div>

							<form className="lead-form" action="#" method="post">
								<input type="text" name="nombre" placeholder="Tu Nombre Completo" autoComplete="name" required />
								<input type="email" name="email" placeholder="Tu Email" autoComplete="email" required />
								<div className="phone-row">
									<div className="country-code">🇲🇽 <span>⌄</span></div>
									<input
										type="tel"
										name="whatsapp"
										placeholder="Tu Numero de Whatsapp"
										autoComplete="tel"
										required
									/>
								</div>
								<button className="form-submit" type="submit">
									<strong>Quiero mi Sistema Web + Ads</strong>
									<span>Solicitar diagnostico</span>
								</button>
							</form>

							<div className="trust-row">
								<div className="guarantee-mini">
									<div className="seal-mini">SIN<br />PREGUNTAS</div>
									<p>Si no hace sentido para tu negocio, te lo digo antes de venderte.</p>
								</div>
							</div>

							<div className="payment-logos" aria-label="Metodos de pago">
								<span className="pay-logo">VISA</span>
								<span className="pay-logo">Mastercard</span>
								<span className="pay-logo">AMEX</span>
								<span className="pay-logo">Transferencia</span>
								<span className="pay-logo">Apple Pay</span>
							</div>
							<div className="encrypted">🔒 Formulario seguro · Tus datos se usan solo para contactarte</div>
						</div>
					</div>
				</section>

				<footer className="legal-footer">
					<div className="narrow">
						<p>
							Este sitio no promete resultados garantizados. Los resultados dependen de tu oferta, mercado,
							trafico, seguimiento comercial y claridad de comunicacion.
						</p>
						<p>
							EderCreaWebs desarrolla landings, embudos, contenido publicitario y sistemas de apoyo comercial para
							negocios de servicios.
						</p>
						<div className="footer-links">
							<a href="#">Privacidad</a>
							<a href="#">Terminos</a>
							<a href="#lead-form">Contacto</a>
						</div>
					</div>
				</footer>
			</main>

			<style>{`
				:global(html) {
					scroll-behavior: smooth;
				}

				.page {
					--orange: #ff5a1f;
					--black: #050505;
					--white: #ffffff;
					--blue: #155cff;
					--blue-dark: #071c89;
					--cyan: #5ef0ff;
					--green: #18c75a;
					--text: #111827;
					--muted: #5f6675;
					--soft: #f4f7fb;
					--line: #dbe3ef;
					--pink: #ff477e;
					--red: #ff5166;
					--shadow: 0 14px 35px rgba(15, 23, 42, 0.16);
					font-family: Arial, Helvetica, sans-serif;
					color: var(--text);
					background: #fff;
					line-height: 1.45;
				}

				.page * {
					box-sizing: border-box;
					margin: 0;
					padding: 0;
				}

				.page a {
					text-decoration: none;
					color: inherit;
				}

				.container {
					width: min(1080px, calc(100% - 32px));
					margin: 0 auto;
				}

				.narrow {
					width: min(760px, calc(100% - 32px));
					margin: 0 auto;
				}

				.center {
					text-align: center;
				}

				.top-offer-bar {
					background: linear-gradient(90deg, #ef3f0a, #ff8a1d, #111);
					color: #fff;
					font-size: 12px;
					font-weight: 800;
					letter-spacing: 0.02em;
				}

				.top-offer-inner {
					min-height: 34px;
					display: grid;
					grid-template-columns: 1fr auto 1fr;
					align-items: center;
					gap: 12px;
					padding: 6px 0;
				}

				.top-offer-inner span:nth-child(2) {
					text-align: center;
				}

				.top-offer-inner span:last-child {
					text-align: right;
				}

				.tiny-pill {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					padding: 5px 10px;
					background: #111;
					border: 1px solid rgba(255, 255, 255, 0.4);
					border-radius: 999px;
					color: #fff;
				}

				.hero {
					background: #020202;
					color: #fff;
					padding: 28px 0 74px;
				}

				.hero-heading {
					text-align: center;
					max-width: 920px;
					margin: 0 auto 34px;
				}

				.pretitle {
					font-size: 13px;
					color: #d7d7d7;
					font-weight: 800;
					margin-bottom: 8px;
				}

				.hero h1 {
					font-size: clamp(34px, 5.8vw, 64px);
					line-height: 0.95;
					letter-spacing: -0.055em;
					max-width: 900px;
					margin: 0 auto 12px;
					font-weight: 950;
				}

				.green-line {
					color: #43ff77;
					font-weight: 900;
					font-size: clamp(18px, 3vw, 28px);
				}

				.hero-sub {
					font-size: 15px;
					color: #c7c7c7;
					max-width: 760px;
					margin: 10px auto 0;
				}

				.hero-grid {
					display: grid;
					grid-template-columns: 1.1fr 0.9fr;
					gap: 28px;
					align-items: start;
				}

				.video-card {
					min-height: 330px;
					border-radius: 10px;
					background:
						linear-gradient(135deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.7)),
						radial-gradient(circle at 25% 35%, #fb7d50, transparent 25%),
						linear-gradient(135deg, #123b78, #0f1730 55%, #090909);
					border: 1px solid #2d2d2d;
					box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
					position: relative;
					overflow: hidden;
					display: flex;
					align-items: end;
					padding: 26px;
				}

				.video-card::before {
					content: "▶";
					position: absolute;
					width: 70px;
					height: 70px;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.92);
					color: #155cff;
					display: grid;
					place-items: center;
					font-size: 30px;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
					box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
				}

				.video-title {
					position: relative;
					z-index: 2;
					font-size: 32px;
					line-height: 0.9;
					font-weight: 950;
					letter-spacing: -0.04em;
					max-width: 330px;
				}

				.author-card {
					background: #fff;
					color: #121212;
					border-radius: 8px;
					margin-top: 12px;
					padding: 12px 14px;
					display: flex;
					gap: 10px;
					align-items: center;
					font-size: 12px;
				}

				.author-avatar {
					width: 38px;
					height: 38px;
					border-radius: 50%;
					background: linear-gradient(135deg, #ffb076, #155cff);
					flex: 0 0 auto;
				}

				.author-card strong {
					display: block;
					font-size: 13px;
				}

				.hero-bio {
					text-align: center;
					margin-top: 22px;
					color: #fff;
				}

				.hero-bio h3 {
					font-size: 23px;
					line-height: 1;
					font-weight: 950;
					margin-bottom: 8px;
				}

				.hero-bio p {
					font-size: 14px;
					color: #cfcfcf;
					max-width: 560px;
					margin: 0 auto;
				}

				.offer-card {
					background: #fff;
					color: #111;
					border-radius: 12px;
					padding: 18px;
					box-shadow: 0 16px 50px rgba(255, 255, 255, 0.12);
				}

				.offer-mockup {
					min-height: 160px;
					border-radius: 10px;
					background:
						radial-gradient(circle at 30% 20%, #69f0ff, transparent 20%),
						linear-gradient(135deg, #071c89, #111 60%);
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					text-align: center;
					margin-bottom: 14px;
					padding: 18px;
				}

				.offer-stack {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 12px;
					flex-wrap: wrap;
					width: 100%;
				}

				.offer-word {
					display: flex;
					flex-direction: column;
					align-items: center;
					line-height: 0.9;
				}

				.offer-word small {
					font-size: 11px;
					font-weight: 800;
					letter-spacing: 0.08em;
					text-transform: uppercase;
					color: #8ef6ff;
					margin-bottom: 6px;
				}

				.offer-word strong {
					font-size: clamp(30px, 4vw, 42px);
					font-weight: 950;
					letter-spacing: -0.06em;
				}

				.offer-plus {
					font-size: 32px;
					font-weight: 950;
					color: #43ff77;
					transform: translateY(8px);
				}

				.price {
					text-align: center;
					margin: 8px 0 12px;
					font-weight: 800;
				}

				.price del {
					color: #ff3b3b;
					margin: 0 4px;
				}

				.price strong {
					font-size: 22px;
					color: #18a04c;
				}

				.monthly {
					background: #eafff2;
					border: 1px solid #a7f3c4;
					border-radius: 7px;
					padding: 10px;
					text-align: center;
					font-weight: 900;
					color: #0d7a37;
					margin-bottom: 12px;
					font-size: 14px;
				}

				.hero-form-title {
					text-align: center;
					font-size: 18px;
					font-weight: 800;
					margin: 12px 0;
					color: #111;
				}

				.hero-form-title strong {
					color: #155cff;
				}

				.form-steps {
					display: grid;
					grid-template-columns: 1fr 1fr;
					align-items: end;
					text-align: center;
					border-bottom: 8px solid #1675ad;
					margin-bottom: 26px;
					position: relative;
				}

				.form-steps::after {
					content: "";
					position: absolute;
					bottom: -18px;
					left: 25%;
					transform: translateX(-50%);
					border-left: 16px solid transparent;
					border-right: 16px solid transparent;
					border-bottom: 16px solid transparent;
					border-top: 16px solid #1675ad;
				}

				.form-step {
					padding: 6px 8px 14px;
				}

				.form-step strong {
					display: block;
					color: #1675ad;
					font-size: 24px;
					line-height: 1;
					font-weight: 950;
				}

				.form-step span {
					display: block;
					color: #667580;
					font-size: 20px;
					line-height: 1.1;
				}

				.hero-form .form-steps {
					margin-bottom: 18px;
					border-bottom-width: 6px;
				}

				.hero-form .form-steps::after {
					bottom: -14px;
					border-left-width: 12px;
					border-right-width: 12px;
					border-top-width: 12px;
				}

				.hero-form .form-step {
					padding: 4px 6px 10px;
				}

				.hero-form .form-step strong {
					font-size: 16px;
				}

				.hero-form .form-step span {
					font-size: 13px;
				}

				.lead-form {
					display: grid;
					gap: 18px;
					padding: 0 18px 10px;
				}

				.hero-form .lead-form {
					gap: 10px;
					padding: 0;
				}

				.lead-form input {
					width: 100%;
					height: 68px;
					border: 2px solid #cfd6df;
					border-radius: 9px;
					padding: 0 22px;
					font-size: 22px;
					color: #111;
					outline: none;
				}

				.hero-form .lead-form input,
				.hero-form .country-code {
					height: 48px;
					font-size: 15px;
					border-width: 1.5px;
					border-radius: 6px;
				}

				.hero-form .lead-form input {
					padding: 0 13px;
				}

				.lead-form input:focus {
					border-color: #1675ad;
					box-shadow: 0 0 0 4px rgba(22, 117, 173, 0.12);
				}

				.phone-row {
					display: grid;
					grid-template-columns: 92px 1fr;
					gap: 10px;
				}

				.hero-form .phone-row {
					grid-template-columns: 68px 1fr;
					gap: 8px;
				}

				.country-code {
					height: 68px;
					border: 2px solid #cfd6df;
					border-radius: 9px;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 8px;
					font-size: 24px;
					background: #fff;
				}

				.hero-form .country-code {
					font-size: 18px;
				}

				.country-code span:last-child {
					font-size: 16px;
					color: #555;
				}

				.form-submit {
					border: 0;
					width: 100%;
					min-height: 96px;
					border-radius: 8px;
					background: #20c63a;
					color: #fff;
					font-weight: 950;
					cursor: pointer;
					box-shadow:
						inset 0 2px 0 rgba(255, 255, 255, 0.25),
						0 12px 28px rgba(32, 198, 58, 0.22);
				}

				.hero-form .form-submit {
					min-height: 70px;
					margin-top: 2px;
				}

				.form-submit strong {
					display: block;
					font-size: 44px;
					line-height: 1;
				}

				.hero-form .form-submit strong {
					font-size: 28px;
					line-height: 1.05;
				}

				.form-submit span {
					display: block;
					font-size: 22px;
					font-weight: 500;
				}

				.hero-form .form-submit span {
					font-size: 15px;
				}

				.trust-row {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 22px;
					margin: 22px 0 12px;
					color: #111;
					flex-wrap: wrap;
				}

				.guarantee-mini {
					display: flex;
					align-items: center;
					gap: 14px;
					text-align: left;
					max-width: 620px;
				}

				.hero-trust {
					display: flex;
					gap: 12px;
					align-items: center;
					justify-content: center;
					margin: 16px 0 8px;
					color: #111;
				}

				.hero-trust p {
					font-size: 15px;
					line-height: 1.15;
					margin: 0;
					max-width: 280px;
				}

				.seal-mini {
					width: 82px;
					height: 82px;
					border-radius: 50%;
					background: radial-gradient(circle, #ffe367, #b77b00);
					display: grid;
					place-items: center;
					color: #111;
					font-weight: 950;
					font-size: 10px;
					text-align: center;
					border: 4px solid #6b4b04;
					box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
					flex: 0 0 auto;
				}

				.hero-trust .seal-mini {
					width: 58px;
					height: 58px;
					font-size: 8px;
					border-width: 3px;
				}

				.guarantee-mini p {
					font-size: 22px !important;
					color: #111 !important;
					margin: 0 !important;
					line-height: 1.15;
				}

				.payment-logos {
					display: flex;
					gap: 10px;
					align-items: center;
					justify-content: center;
					margin: 20px 0 8px;
					flex-wrap: wrap;
				}

				.hero-payments {
					margin-top: 12px;
				}

				.pay-logo {
					background: #f3f6fb;
					border: 1px solid #e0e6ef;
					border-radius: 8px;
					padding: 8px 12px;
					font-weight: 950;
					color: #1f3b72;
					font-size: 13px;
				}

				.hero-payments .pay-logo {
					font-size: 10px;
					padding: 6px 8px;
				}

				.encrypted {
					text-align: center;
					color: #111;
					font-size: 15px;
					margin-top: 8px;
				}

				.hero-encrypted {
					font-size: 12px;
					color: #111;
					text-align: center;
					margin-top: 8px;
				}

				.section {
					padding: 66px 0;
				}

				.section-title {
					text-align: center;
					margin-bottom: 28px;
				}

				.section-title h2 {
					font-size: clamp(26px, 4vw, 42px);
					line-height: 1.05;
					letter-spacing: -0.045em;
					font-weight: 950;
					color: #09266e;
				}

				.section-title p {
					margin-top: 8px;
					color: var(--muted);
					font-size: 15px;
				}

				.proof-grid {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 16px;
					margin-top: 22px;
				}

				.screenshot {
					border: 4px solid #e5eef8;
					background: #fff;
					min-height: 112px;
					border-radius: 3px;
					padding: 12px;
					box-shadow: 0 8px 20px rgba(8, 32, 92, 0.08);
				}

				.screenshot.dark {
					background: #0a0f19;
					color: #fff;
					border-color: #5aa7ff;
				}

				.screenshot.tall {
					min-height: 180px;
				}

				.screen-head {
					height: 8px;
					width: 45%;
					background: #d6e4f3;
					border-radius: 99px;
					margin-bottom: 10px;
				}

				.dark .screen-head {
					background: #1c7cf2;
				}

				.screen-line {
					height: 7px;
					background: #e8edf4;
					border-radius: 99px;
					margin: 7px 0;
				}

				.dark .screen-line {
					background: #253346;
				}

				.screen-line.short {
					width: 70%;
				}

				.screen-line.mid {
					width: 85%;
				}

				.blue-cta {
					display: flex;
					align-items: center;
					justify-content: center;
					background: #155cff;
					color: #fff;
					border-radius: 4px;
					padding: 14px 20px;
					font-weight: 900;
					margin: 28px auto 0;
					max-width: 920px;
					font-size: 14px;
				}

				.problem-section {
					padding: 76px 0;
					background: #fff;
				}

				.problem-section h2 {
					font-size: clamp(24px, 3.6vw, 36px);
					line-height: 1.08;
					color: #061c65;
					font-weight: 950;
					text-align: center;
					margin-bottom: 22px;
					letter-spacing: -0.035em;
				}

				.problem-copy {
					font-size: 15px;
					color: #1f2937;
				}

				.problem-copy p {
					margin-bottom: 16px;
				}

				.problem-copy ul {
					display: grid;
					gap: 9px;
					margin: 18px 0 18px 20px;
				}

				.problem-copy li::marker {
					color: #155cff;
				}

				.system-intro {
					padding: 20px 0 34px;
				}

				.system-intro h2 {
					color: #061c65;
					font-size: 32px;
					font-weight: 950;
					letter-spacing: -0.04em;
				}

				.system-intro p {
					color: #5f6675;
					margin-top: 8px;
				}

				.modules-section {
					padding: 18px 0 72px;
				}

				.module-card {
					border-radius: 8px;
					background: #fff;
					box-shadow: var(--shadow);
					overflow: hidden;
					margin-bottom: 26px;
					border: 1px solid #d9e1ee;
				}

				.module-topbar {
					min-height: 96px;
					background: linear-gradient(90deg, #050505 0%, #050505 24%, #1237dc 64%, #050505 100%);
					color: #fff;
					position: relative;
					padding: 18px 24px;
				}

				.module-price-row {
					display: flex;
					align-items: center;
					gap: 10px;
					flex-wrap: wrap;
					margin-bottom: 14px;
				}

				.value-badge {
					display: inline-flex;
					align-items: center;
					background: #6cf6ff;
					color: #061018;
					font-weight: 950;
					font-size: 12px;
					padding: 7px 13px;
					border-radius: 3px;
				}

				.value-badge del {
					text-decoration-thickness: 2px;
					text-decoration-color: #061018;
				}

				.included-price {
					display: inline-flex;
					align-items: center;
					background: #18c75a;
					color: #fff;
					font-weight: 950;
					font-size: 12px;
					padding: 7px 13px;
					border-radius: 3px;
					box-shadow: 0 10px 20px rgba(24, 199, 90, 0.24);
				}

				.module-topbar h3 {
					font-size: 23px;
					font-weight: 950;
					letter-spacing: -0.03em;
				}

				.module-content {
					display: grid;
					grid-template-columns: 1.25fr 0.75fr;
					gap: 24px;
					align-items: center;
					padding: 28px;
					min-height: 210px;
				}

				.module-text p {
					font-size: 15px;
					color: #344054;
					margin-bottom: 18px;
				}

				.small-button {
					display: inline-flex;
					background: #155cff;
					color: #fff;
					border-radius: 3px;
					padding: 10px 22px;
					font-weight: 950;
					font-size: 13px;
					box-shadow: 0 10px 22px rgba(21, 92, 255, 0.22);
					transition: 0.2s ease;
				}

				.small-button:hover {
					transform: translateY(-2px);
					background: #0b49db;
				}

				.module-visual {
					height: 150px;
					border-radius: 8px;
					background: linear-gradient(135deg, #f8fbff, #dbeafe);
					border: 1px solid #d7e2f1;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 42px;
					box-shadow: inset 0 0 0 8px rgba(255, 255, 255, 0.6);
				}

				.work-section {
					padding: 70px 0;
					background: #f7f9ff;
				}

				.work-grid {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 18px;
					margin-top: 26px;
				}

				.work-card {
					background: #fff;
					border: 1px solid #d9e1ee;
					border-radius: 12px;
					box-shadow: 0 14px 35px rgba(15, 23, 42, 0.1);
					padding: 24px;
					position: relative;
					overflow: hidden;
				}

				.work-card::before {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					height: 8px;
					background: linear-gradient(90deg, #050505, #155cff);
				}

				.work-label {
					font-size: 12px;
					font-weight: 950;
					color: #155cff;
					text-transform: uppercase;
					letter-spacing: 0.08em;
					margin-bottom: 8px;
				}

				.work-card h3 {
					font-size: 24px;
					line-height: 1.05;
					letter-spacing: -0.04em;
					margin-bottom: 8px;
					color: #061c65;
				}

				.work-price {
					font-size: 18px;
					font-weight: 950;
					color: #18a04c;
					margin-bottom: 14px;
				}

				.work-card p {
					color: #344054;
					font-size: 14px;
					margin-bottom: 14px;
				}

				.work-list {
					display: grid;
					gap: 8px;
					font-size: 14px;
					color: #1f2937;
				}

				.work-list li {
					list-style: none;
					display: flex;
					gap: 8px;
				}

				.work-list li::before {
					content: "✓";
					color: #18c75a;
					font-weight: 950;
				}

				.work-cta {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					margin: 24px 0 0;
					background: #18c75a;
					color: #fff;
					border-radius: 10px;
					padding: 18px 22px;
					text-align: center;
					font-weight: 950;
					font-size: 22px;
					box-shadow: 0 14px 30px rgba(24, 199, 90, 0.24);
					transition: 0.2s ease;
				}

				.work-cta:hover {
					transform: translateY(-2px);
					background: #12ad4c;
				}

				.work-note {
					margin-top: 14px;
					background: #061c65;
					color: #fff;
					border-radius: 10px;
					padding: 16px 18px;
					text-align: center;
					font-weight: 800;
				}

				.work-note span {
					color: #6cf6ff;
				}

				.guarantee {
					background: linear-gradient(180deg, #315dff, #071a83);
					color: #fff;
					padding: 70px 0;
					text-align: center;
				}

				.guarantee h2 {
					font-size: clamp(25px, 3.8vw, 38px);
					line-height: 1.1;
					font-weight: 950;
					letter-spacing: -0.04em;
					margin-bottom: 20px;
				}

				.seal {
					width: 96px;
					height: 96px;
					border-radius: 50%;
					margin: 0 auto 22px;
					background: radial-gradient(circle, #ffe367, #c88700);
					display: grid;
					place-items: center;
					color: #10205e;
					font-weight: 950;
					box-shadow: 0 20px 35px rgba(0, 0, 0, 0.25);
					border: 5px solid rgba(255, 255, 255, 0.5);
				}

				.guarantee p {
					max-width: 780px;
					margin: 10px auto;
					color: rgba(255, 255, 255, 0.86);
					font-size: 15px;
				}

				.faq-list {
					display: grid;
					gap: 8px;
				}

				.faq-item {
					background: #f2f2f2;
					border: 1px solid #e3e3e3;
					border-radius: 4px;
					overflow: hidden;
				}

				.faq-question {
					width: 100%;
					border: 0;
					background: transparent;
					padding: 14px 16px;
					text-align: left;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-weight: 800;
					font-size: 14px;
					cursor: pointer;
					color: #111;
				}

				.options {
					background: linear-gradient(180deg, #315dff, #071a83);
					color: #fff;
					padding: 72px 0;
				}

				.options .section-title {
					text-align: left;
				}

				.options .section-title h2 {
					color: #fff;
				}

				.options-grid {
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					gap: 22px;
				}

				.option-card {
					padding: 25px;
					border: 1px solid rgba(255, 255, 255, 0.28);
					min-height: 180px;
					background: rgba(255, 255, 255, 0.05);
				}

				.option-bad {
					border-color: #ff6b8f;
				}

				.option-good {
					border-color: #60d9ff;
				}

				.option-label {
					font-size: 12px;
					font-weight: 950;
					color: #ff8aa5;
				}

				.option-good .option-label {
					color: #60d9ff;
				}

				.option-card h3 {
					font-size: 23px;
					margin: 8px 0 10px;
					letter-spacing: -0.03em;
				}

				.option-card p {
					font-size: 14px;
					color: rgba(255, 255, 255, 0.82);
				}

				.options-copy {
					text-align: center;
					max-width: 800px;
					margin: 26px auto 0;
				}

				.options-copy p {
					font-size: 14px;
					color: rgba(255, 255, 255, 0.82);
					margin-bottom: 14px;
				}

				.options-copy small {
					display: block;
					margin-top: 10px;
					color: rgba(255, 255, 255, 0.62);
				}

				.lead-form-card {
					background: #fff;
					color: #111;
					border-radius: 12px;
					box-shadow: 0 22px 60px rgba(0, 0, 0, 0.24);
					padding: 18px;
					margin: 30px auto 0;
					max-width: 840px;
				}

				.legal-footer {
					background: #111;
					color: #b8b8b8;
					padding: 38px 0;
					font-size: 11px;
					line-height: 1.6;
					text-align: center;
				}

				.legal-footer p {
					margin-bottom: 12px;
				}

				.footer-links {
					display: flex;
					gap: 16px;
					justify-content: center;
					color: #fff;
					font-weight: 800;
					margin-top: 16px;
				}

				@media (max-width: 800px) {
					.top-offer-inner {
						grid-template-columns: 1fr;
						text-align: center;
						height: auto;
						padding: 8px 0;
					}

					.top-offer-inner span:last-child {
						text-align: center;
					}

					.hero-grid,
					.module-content,
					.options-grid,
					.work-grid,
					.proof-grid {
						grid-template-columns: 1fr;
					}

					.hero {
						padding-bottom: 48px;
					}

					.module-content {
						padding: 22px;
					}

					.module-topbar {
						height: auto;
						min-height: 96px;
					}

					.module-price-row {
						gap: 8px;
					}

					.value-badge,
					.included-price {
						font-size: 11px;
						padding: 6px 10px;
					}

					.container,
					.narrow {
						width: min(100% - 24px, 1080px);
					}

					.offer-stack {
						gap: 8px;
					}

					.offer-word strong {
						font-size: 28px;
					}

					.offer-word small {
						font-size: 10px;
					}

					.offer-plus {
						font-size: 24px;
						transform: translateY(6px);
					}

					.form-steps {
						grid-template-columns: 1fr;
					}

					.form-steps::after {
						left: 50%;
					}

					.form-step strong {
						font-size: 21px;
					}

					.form-step span {
						font-size: 16px;
					}

					.lead-form {
						padding: 0;
						gap: 12px;
					}

					.lead-form input,
					.country-code {
						height: 58px;
						font-size: 18px;
					}

					.phone-row {
						grid-template-columns: 78px 1fr;
					}

					.form-submit {
						min-height: 78px;
					}

					.form-submit strong {
						font-size: 34px;
					}

					.form-submit span {
						font-size: 17px;
					}

					.guarantee-mini {
						justify-content: center;
					}

					.guarantee-mini p {
						font-size: 18px !important;
					}

					.seal-mini {
						width: 66px;
						height: 66px;
					}

					.payment-logos {
						gap: 6px;
					}

					.pay-logo {
						font-size: 11px;
						padding: 6px 8px;
					}

					.work-cta {
						font-size: 18px;
						padding: 16px 14px;
					}
				}
			`}</style>
		</>
	);
}
