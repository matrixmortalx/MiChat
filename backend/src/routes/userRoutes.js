const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get user profile
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.query(
      'SELECT id, email, full_name, phone_number, avatar_url, status, last_seen, created_at FROM users WHERE id = $1',
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, status, avatarUrl } = req.body;

    if (req.user.userId !== id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await db.query(
      'UPDATE users SET full_name = COALESCE($1, full_name), status = COALESCE($2, status), avatar_url = COALESCE($3, avatar_url), updated_at = NOW() WHERE id = $4',
      [fullName, status, avatarUrl, id]
    );

    const updatedUser = await db.query(
      'SELECT id, email, full_name, phone_number, avatar_url, status, last_seen FROM users WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Profile updated',
      data: updatedUser.rows[0],
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Search users
router.get('/search/query', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ success: false, message: 'Query must be at least 2 characters' });
    }

    const users = await db.query(
      'SELECT id, full_name, avatar_url, status FROM users WHERE (full_name ILIKE $1 OR email ILIKE $1) AND id != $2 LIMIT 20',
      [`%${query}%`, req.user.userId]
    );

    res.json({ success: true, data: users.rows });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Block user
router.post('/block/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const blockedById = req.user.userId;

    await db.query(
      'INSERT INTO blocked_users (user_id, blocked_by_user_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
      [userId, blockedById]
    );

    res.json({ success: true, message: 'User blocked successfully' });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
