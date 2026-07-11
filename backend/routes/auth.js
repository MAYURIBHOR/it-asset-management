const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); 

// 🔑 The secret key to stamp your digital ID cards 
const JWT_SECRET = 'super_secret_it_asset_key_123';

// 🆕 1. REGISTER: Create a new user with a hashed password
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Cryptographically hash the password before it ever touches the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save the user with their scrambled password
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'Employee']
    );

    res.status(201).json({ message: 'Secure account created successfully!' });
  } catch (err) {
    // Catch if they try to register with an email that already exists
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email is already registered.' });
    }
    console.error("Registration Error:", err);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

// 🔐 2. LOGIN: Verify credentials and issue a JSON Web Token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Look up the user by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    // If user doesn't exist, fail securely
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 2. Compare the plain-text password typed by the user to the database hash
    const passwordMatches = await bcrypt.compare(password, user.password);
    
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 3. Success! Generate their digital ID card (JWT)
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '2h' } // Boot them out after 2 hours of inactivity
    );

    // Send the token and safe user data back to the frontend
    res.json({
      message: 'Login successful!',
      token: token,
      user: { id: user.id, name: user.name, role: user.role, email: user.email }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: 'Failed to log in.' });
  }
});

module.exports = router;