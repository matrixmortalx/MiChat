const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, phoneNumber, fullName } = req.body;

    // Validate input
    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1 OR phone_number = $2',
      [email, phoneNumber]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Create user
    await db.query(
      'INSERT INTO users (id, email, password, phone_number, full_name, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [userId, email, hashedPassword, phoneNumber || null, fullName]
    );

    const accessToken = generateToken(userId, 'access');
    const refreshToken = generateToken(userId, 'refresh');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId,
        email,
        fullName,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const userData = user.rows[0];
    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = generateToken(userData.id, 'access');
    const refreshToken = generateToken(userData.id, 'refresh');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        userId: userData.id,
        email: userData.email,
        fullName: userData.full_name,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Refresh token
router.post('/refresh-token', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const newAccessToken = generateToken(decoded.userId, 'access');

    res.json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

module.exports = router;
