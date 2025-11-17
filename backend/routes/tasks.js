const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // GET /tasks
  router.get('/', async (req, res) => {
    try {
      const tasks = await db.all(`SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC`, [req.userId]);
      res.json({ tasks });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // POST /tasks
  router.post('/', async (req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    try {
      const result = await db.run(
        `INSERT INTO tasks (userId, title, description) VALUES (?, ?, ?)`,
        [req.userId, title, description || null]
      );
      const task = await db.get(`SELECT * FROM tasks WHERE id = ?`, [result.lastID]);
      res.status(201).json({ task });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // PUT /tasks/:id
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    try {
      const task = await db.get(`SELECT * FROM tasks WHERE id = ? AND userId = ?`, [id, req.userId]);
      if (!task) return res.status(404).json({ error: 'Task not found' });

      await db.run(
        `UPDATE tasks SET title = ?, description = ?, completed = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [title ?? task.title, description ?? task.description, completed ? 1 : 0, id]
      );
      const updated = await db.get(`SELECT * FROM tasks WHERE id = ?`, [id]);
      res.json({ task: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // DELETE /tasks/:id
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const task = await db.get(`SELECT * FROM tasks WHERE id = ? AND userId = ?`, [id, req.userId]);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      await db.run(`DELETE FROM tasks WHERE id = ?`, [id]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};
