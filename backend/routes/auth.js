const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
  router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
    try {
      const hash = await bcrypt.hash(password, 10);
      const result = await db.run(`INSERT INTO users (username, password_hash) VALUES (?, ?)`, [username, hash]);
      const userId = result.lastID;
      return res.status(201).json({ id: userId, username });
    } catch (err) {
      if (err && err.message && err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Username already exists' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
    try {
      const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};
