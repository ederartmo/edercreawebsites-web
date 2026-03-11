const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public_html');

app.disable('x-powered-by');

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
