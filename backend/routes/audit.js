const express = require('express');
const router = express.Router();
const db = require('../db'); 

// 📖 READ: Get the 50 most recent activity logs
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✍️ WRITE: Add a new entry to the historical log
router.post('/', async (req, res) => {
  const { admin_name, action } = req.body;
  
  try {
    await db.query(
      'INSERT INTO audit_logs (admin_name, action) VALUES (?, ?)', 
      [admin_name, action]
    );
    res.status(201).json({ message: 'Action securely logged.' });
  } catch (err) {
    console.error("Audit Log Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;