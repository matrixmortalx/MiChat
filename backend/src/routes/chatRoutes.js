const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const router = express.Router();

// Get all chats
router.get('/', authenticateToken, async (req, res) => {
  try {
    const chats = await db.query(
      `SELECT c.id, c.type, c.name, c.avatar_url, c.last_message, c.updated_at
       FROM chats c
       JOIN chat_members cm ON c.id = cm.chat_id
       WHERE cm.user_id = $1
       ORDER BY c.updated_at DESC`,
      [req.user.userId]
    );

    res.json({ success: true, data: chats.rows });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new chat
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, name, participantIds } = req.body;
    const chatId = uuidv4();

    await db.query(
      'INSERT INTO chats (id, type, name, created_by, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [chatId, type, name, req.user.userId]
    );

    // Add members
    const members = [req.user.userId, ...(participantIds || [])];
    for (const memberId of members) {
      await db.query(
        'INSERT INTO chat_members (chat_id, user_id, joined_at) VALUES ($1, $2, NOW())',
        [chatId, memberId]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Chat created',
      data: { id: chatId, type, name },
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get chat details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await db.query(
      'SELECT * FROM chats WHERE id = $1',
      [id]
    );

    if (chat.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const members = await db.query(
      'SELECT u.id, u.full_name, u.avatar_url FROM chat_members cm JOIN users u ON cm.user_id = u.id WHERE cm.chat_id = $1',
      [id]
    );

    res.json({
      success: true,
      data: { ...chat.rows[0], members: members.rows },
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
