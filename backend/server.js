require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { init } = require('./db');
const authRoutesFactory = require('./routes/auth');
const tasksRoutesFactory = require('./routes/tasks');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

(async () => {
  const db = await init();

  app.use('/auth', authRoutesFactory(db));
  app.use('/tasks', authMiddleware, tasksRoutesFactory(db));

  app.get('/', (req, res) => res.json({ ok: true }));

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})();
