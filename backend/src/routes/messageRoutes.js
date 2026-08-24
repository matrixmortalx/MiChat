const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const router = express.Router();

// Get messages for a chat
router.get('/chat/:chatId', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await db.query(
      `SELECT m.id, m.chat_id, m.sender_id, m.content, m.type, m.status, m.created_at, u.full_name, u.avatar_url
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.chat_id = $1
       ORDER BY m.created_at DESC
       LIMIT $2 OFFSET $3`,
      [chatId, parseInt(limit), parseInt(offset)]
    );

    res.json({ success: true, data: messages.rows });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Send message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { chatId, content, type = 'text' } = req.body;
    const messageId = uuidv4();

    await db.query(
      'INSERT INTO messages (id, chat_id, sender_id, content, type, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
      [messageId, chatId, req.user.userId, content, type, 'sent']
    );

    // Update chat's last message
    await db.query(
      'UPDATE chats SET last_message = $1, updated_at = NOW() WHERE id = $2',
      [content, chatId]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent',
      data: { id: messageId, chatId, content, type },
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Edit message
router.put('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await db.query(
      'SELECT sender_id FROM messages WHERE id = $1',
      [messageId]
    );

    if (message.rows[0].sender_id !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await db.query(
      'UPDATE messages SET content = $1, edited_at = NOW() WHERE id = $2',
      [content, messageId]
    );

    res.json({ success: true, message: 'Message updated' });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete message
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await db.query(
      'SELECT sender_id FROM messages WHERE id = $1',
      [messageId]
    );

    if (message.rows[0].sender_id !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await db.query('DELETE FROM messages WHERE id = $1', [messageId]);

    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Mark message as read
router.post('/:messageId/read', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;

    await db.query(
      'UPDATE messages SET status = $1 WHERE id = $2',
      ['read', messageId]
    );

    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
