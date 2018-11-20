const express = require('express');
const app = express();
const { port } = require('./config');
const gameRoutes = require('./games/api/gameRoutes');

app.use('/api/games', gameRoutes);

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => console.log(`now listening on port: ${port}`));
