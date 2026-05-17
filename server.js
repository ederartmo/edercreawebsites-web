const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public_html');

function readEnvValue(filePath, key) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const line = content
      .split(/\r?\n/)
      .find((entry) => entry.trim().startsWith(`${key}=`));
    return line ? line.slice(key.length + 1).trim() : '';
  } catch {
    return '';
  }
}

const fallbackEnvFile = path.join(__dirname, 'courses', '.env.local');
const fallbackSupabaseUrl = readEnvValue(fallbackEnvFile, 'NEXT_PUBLIC_SUPABASE_URL');
const fallbackSupabaseAnonKey = readEnvValue(fallbackEnvFile, 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY');

app.disable('x-powered-by');

app.get('/landing-config.js', (req, res) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackSupabaseUrl || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || fallbackSupabaseAnonKey || '';

  res.type('application/javascript').send(
    `window.__SUPABASE_URL__ = ${JSON.stringify(supabaseUrl)};\nwindow.__SUPABASE_ANON_KEY__ = ${JSON.stringify(supabaseAnonKey)};\n`
  );
});

app.use(express.static(publicDir, {
  extensions: ['html']
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.use((req, res) => {
  res.status(404).type('html').sendFile(path.join(publicDir, 'default.php'), (err) => {
    if (err) {
      res.status(404).send('404 - Pagina no encontrada');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
