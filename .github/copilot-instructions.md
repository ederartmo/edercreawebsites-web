# Project Guidelines

## Architecture
- El repositorio combina dos capas:
  - Servidor Express en [server.js](server.js) que sirve estaticos desde [public_html](public_html).
  - Aplicacion Next.js (App Router) en [courses/src/app](courses/src/app), exportada de forma estatica para publicacion en [public_html/cursos](public_html/cursos).
- Edita codigo fuente en [courses/src](courses/src). Trata [public_html/cursos](public_html/cursos) y [courses/out](courses/out) como artefactos generados.
- Para rutas dinamicas de cursos, conserva la estrategia de generacion estatica existente (por ejemplo en [courses/src/app/[slug]/page.tsx](courses/src/app/[slug]/page.tsx)).

## Build And Run
- Sitio raiz (Express): npm run dev o npm start desde la raiz.
- Cursos (Next en modo desarrollo): npm run dev dentro de [courses](courses).
- Publicar cursos en estatico: npm run build:cursos desde la raiz.
- No hay scripts de test automatizados definidos actualmente.

## Conventions
- Usa TypeScript y alias @/* segun [courses/tsconfig.json](courses/tsconfig.json).
- Mantener estructura App Router con page.tsx y layout.tsx dentro de [courses/src/app](courses/src/app).
- Componentes en PascalCase dentro de [courses/src/components](courses/src/components); utilidades en [courses/src/lib](courses/src/lib); tipos compartidos en [courses/src/types/index.ts](courses/src/types/index.ts).
- Preferir Tailwind para estilos de componentes y dejar estilos globales en [courses/src/app/globals.css](courses/src/app/globals.css).

## Data And Access
- El catalogo de cursos fuente esta en [courses/src/data/courses.ts](courses/src/data/courses.ts).
- El acceso admin depende de Supabase (tabla authorized_users) y logica de cliente en [courses/src/components/AccessGate.tsx](courses/src/components/AccessGate.tsx).
- No asumir que ocultar UI es seguridad suficiente: mantener politicas de base de datos consistentes (RLS/politicas en Supabase).

## Pitfalls
- No editar manualmente [public_html/cursos](public_html/cursos): se sobrescribe en cada npm run build:cursos.
- Cuidado con rutas absolutas por basePath /cursos en Next (ver [courses/next.config.mjs](courses/next.config.mjs)).
- Evita levantar al mismo tiempo el servidor raiz y Next dev en el mismo puerto sin reconfigurar.

## References
- Fuente operativa principal: [README.md](README.md).