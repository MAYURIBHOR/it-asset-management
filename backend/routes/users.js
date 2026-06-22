const express = require('express');
const router = express.Router();
const db = require('../db'); // Pulls in our database connection pool

// GET all users
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.json(rows); // Send the users list to the browser
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Add a new user
router.post('/', async (req, res) => {
    // 1. Unbox the incoming data using destructuring
    const { name, email, role } = req.body;

    try {
        // 2. Insert into database using safe placeholders
        const [result] = await db.query(
            'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
            [name, email, role || 'Student']
        );

        // 3. Return success receipt with the new ID
        res.status(201).json({ id: result.insertId, message: 'User added successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an existing user by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params; 
    const { name, email, role } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
            [name, email, role, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;