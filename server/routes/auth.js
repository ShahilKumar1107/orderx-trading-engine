const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── REGISTER ────────────────────────────────────
// POST /auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password — never store plain text passwords
    const hashed = await bcrypt.hash(password, 10);
    // 10 = salt rounds (how many times it scrambles)

    const user = await User.create({ name, email, password: hashed });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // token expires in 7 days
    );

    res.status(201).json({ message: 'Registered!', token, user: { name, email } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── LOGIN ───────────────────────────────────────
// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare password with hashed version
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Logged in!', token, user: { name: user.name, email: user.email } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;