const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM assets');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, category, status } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO assets (name, category, status) VALUES (?, ?, ?)',
      [name, category, status]
    );
    res.status(201).json({ id: result.insertId, name, category, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, status } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE assets SET name = ?, category = ?, status = ? WHERE id = ?',
      [name, category, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.json({ message: 'Asset updated successfully!' });
  } catch (err) {
    console.error("Database Update Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/assign', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  try {
    const status = user_id ? 'Assigned' : 'Available';
    await db.query(
      'UPDATE assets SET user_id = ?, status = ? WHERE id = ?',
      [user_id, status, id]
    );
    res.json({ message: 'Asset assignment updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM assets WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
       return res.status(404).json({ message: 'Asset not found' });
    }
    res.json({ message: 'Asset deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;