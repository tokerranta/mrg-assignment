const express = require('express');
const app = express();
const port = 3000;
const gameRoutes = require('./games/gameRoutes');

app.use('/api/games', gameRoutes);

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => console.log(`now listening on port: ${port}`));
