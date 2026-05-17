# Eder Crea Websites - Node.js

Este proyecto ahora se ejecuta con Node.js y Express, sirviendo los archivos estaticos desde `public_html`.

## Requisitos

- Node.js 18 o superior

## Desarrollo local

```bash
npm install
npm start
```

## Publicar ruta /cursos

Para generar y actualizar la seccion de cursos en `https://edercreawebs.com/cursos`:

```bash
npm run build:cursos
```

Ese comando construye la app Next.js ubicada en `courses/` y copia el export estatico a `public_html/cursos/`.

## Switch del home principal

Para activar la landing nueva como home:

```bash
npm run home:activar-nuevo
```

Para regresar al home anterior (rollback rapido):

```bash
npm run home:rollback
```

El archivo de respaldo del home anterior queda en `public_html/index.backup-pre-home-falso.html`.

La app inicia en `http://localhost:3000` (o en el puerto definido por `PORT`).

## Despliegue en Hostinger (Node.js)

1. Sube el proyecto completo (incluyendo `package.json`, `server.js` y `public_html`).
2. En hPanel, entra a **Websites -> Manage -> Advanced -> Node.js**.
3. Crea o edita tu app Node con estos valores:
   - **Application root**: carpeta del proyecto
   - **Application URL**: tu dominio/subdominio
   - **Application startup file**: `server.js`
   - **Node.js version**: 18+
4. Ejecuta instalacion de dependencias (si hPanel no lo hace automaticamente):
   - `npm install`
5. Inicia/reinicia la aplicacion desde hPanel.

## Notas

- El codigo usa `process.env.PORT`, necesario para Hostinger.
- Si una ruta no existe, se muestra `public_html/default.php` como pagina 404.

## Checklist SEO Tecnico

### Estado actual

- `robots.txt` publicado en `https://edercreawebs.com/robots.txt`.
- `sitemap.xml` publicado en `https://edercreawebs.com/sitemap.xml`.
- Landing principal con canonical + Open Graph + Twitter Card + datos estructurados.
- `home-falso.html` marcado como `noindex` para evitar contenido duplicado.
- Hreflang agregado (`es-MX`, `es`, `x-default`) apuntando al home principal.

### Validacion rapida desde terminal

```bash
curl -I https://edercreawebs.com/robots.txt
curl -I https://edercreawebs.com/sitemap.xml
```

### Google Search Console (pasos)

1. Ir a la propiedad del dominio en Search Console.
2. En **Sitemaps**, enviar: `https://edercreawebs.com/sitemap.xml`.
3. Verificar estado `Success` y que no haya URLs excluidas por `robots` no esperado.
4. En **Inspeccion de URL**, probar `https://edercreawebs.com/` y solicitar indexacion si aplica.
5. Revisar reportes de **Core Web Vitals** y **Page indexing** semanalmente.
