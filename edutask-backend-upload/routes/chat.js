// Chat Routes
const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../db');

// Auth middleware
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Daxil olmaq tələb olunur' });
    }
    next();
};

// Get messages for a class
router.get('/:classId', requireAuth, (req, res) => {
    try {
        const messages = dbHelpers.getChatMessages(parseInt(req.params.classId));

        // Mark messages as read
        dbHelpers.markMessagesRead(parseInt(req.params.classId), req.session.userId);

        res.json(messages.map(m => ({
            id: m.id,
            author: m.author,
            content: m.content,
            avatar: m.avatar,
            time: m.created_at,
            read: m.is_read === 1,
            userId: m.user_id
        })));
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Send a message (with AI moderation)
router.post('/', requireAuth, async (req, res) => {
    try {
        const { classId, content } = req.body;

        if (!content || !classId) {
            return res.status(400).json({ error: 'Mesaj və sinif ID tələb olunur' });
        }

        // AI Content Moderation
        try {
            const moderationResponse = await fetch('http://localhost:3000/api/ai/moderate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });

            if (moderationResponse.ok) {
                const moderation = await moderationResponse.json();
                if (!moderation.safe) {
                    return res.status(400).json({
                        error: 'Mesaj uyğunsuz məzmun ehtiva edir',
                        reason: moderation.reason || 'Uyğunsuz söz aşkarlandı',
                        blocked: true
                    });
                }
            }
        } catch (moderationError) {
            console.log('Moderation check skipped:', moderationError.message);
            // Continue if moderation service is unavailable
        }

        const result = dbHelpers.insertChatMessage(parseInt(classId), req.session.userId, content);

        res.json({
            success: true,
            messageId: result.lastInsertRowid,
            message: 'Mesaj göndərildi'
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Delete a message
router.delete('/:id', requireAuth, (req, res) => {
    try {
        // Check if user is admin
        const user = dbHelpers.getUserById(req.session.userId);
        let result;

        if (user && user.role === 'admin') {
            // Admin can delete any message
            result = dbHelpers.deleteChatMessageByAdmin(parseInt(req.params.id));
        } else {
            // Regular users can only delete their own messages
            result = dbHelpers.deleteChatMessage(parseInt(req.params.id), req.session.userId);
        }

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Mesaj tapılmadı və ya sizin deyil' });
        }

        res.json({ success: true, message: 'Mesaj silindi' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Wall posts
router.get('/wall/:classId', requireAuth, (req, res) => {
    try {
        const posts = dbHelpers.getWallPosts(parseInt(req.params.classId));
        res.json(posts);
    } catch (error) {
        console.error('Get wall posts error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

router.post('/wall', requireAuth, (req, res) => {
    try {
        const { classId, content, isQuestion } = req.body;

        if (!content || !classId) {
            return res.status(400).json({ error: 'Məzmun və sinif ID tələb olunur' });
        }

        const result = dbHelpers.insertWallPost(parseInt(classId), req.session.userId, content, isQuestion ? 1 : 0);

        res.json({
            success: true,
            postId: result.lastInsertRowid,
            message: 'Post əlavə edildi'
        });
    } catch (error) {
        console.error('Add wall post error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

router.delete('/wall/:id', requireAuth, (req, res) => {
    try {
        const result = dbHelpers.deleteWallPost(parseInt(req.params.id), req.session.userId);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Post tapılmadı' });
        }

        res.json({ success: true, message: 'Post silindi' });
    } catch (error) {
        console.error('Delete wall post error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// ========================================
// MESSAGE REPORTS SYSTEM
// ========================================

// Report a message
router.post('/report/:messageId', requireAuth, (req, res) => {
    try {
        const messageId = parseInt(req.params.messageId);
        const { reason } = req.body;
        const reporterId = req.session.userId;

        if (!reason) {
            return res.status(400).json({ error: 'Şikayət səbəbi tələb olunur' });
        }

        // Check if message exists
        const message = dbHelpers.getChatMessageById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Mesaj tapılmadı' });
        }

        // Can't report own messages
        if (message.user_id === reporterId) {
            return res.status(400).json({ error: 'Öz mesajınızı şikayət edə bilməzsiniz' });
        }

        // Check if already reported by this user
        const existingReport = dbHelpers.getReportByMessageAndUser(messageId, reporterId);
        if (existingReport) {
            return res.status(400).json({ error: 'Bu mesajı artıq şikayət etmisiniz' });
        }

        const result = dbHelpers.insertReport(messageId, reporterId, reason);

        res.json({
            success: true,
            reportId: result.lastInsertRowid,
            message: 'Şikayət göndərildi. Admin tərəfindən yoxlanılacaq.'
        });
    } catch (error) {
        console.error('Report message error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get all reports (admin only)
router.get('/reports/all', requireAuth, (req, res) => {
    try {
        const user = dbHelpers.getUserById(req.session.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'İcazə yoxdur' });
        }

        const reports = dbHelpers.getAllReports();
        res.json(reports);
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get pending reports (admin only)
router.get('/reports/pending', requireAuth, (req, res) => {
    try {
        const user = dbHelpers.getUserById(req.session.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'İcazə yoxdur' });
        }

        const reports = dbHelpers.getPendingReports();
        res.json(reports);
    } catch (error) {
        console.error('Get pending reports error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Update report status (admin only)
router.put('/reports/:id', requireAuth, (req, res) => {
    try {
        const user = dbHelpers.getUserById(req.session.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'İcazə yoxdur' });
        }

        const reportId = parseInt(req.params.id);
        const { status, action } = req.body;

        if (!['reviewed', 'dismissed'].includes(status)) {
            return res.status(400).json({ error: 'Yanlış status' });
        }

        const report = dbHelpers.getReportById(reportId);
        if (!report) {
            return res.status(404).json({ error: 'Report tapılmadı' });
        }

        dbHelpers.updateReportStatus(reportId, status, action || null);

        res.json({ success: true, message: 'Report yeniləndi' });
    } catch (error) {
        console.error('Update report error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Delete reported message and update report (admin only)
router.delete('/reports/:id/message', requireAuth, (req, res) => {
    try {
        const user = dbHelpers.getUserById(req.session.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'İcazə yoxdur' });
        }

        const reportId = parseInt(req.params.id);
        const report = dbHelpers.getReportById(reportId);

        if (!report) {
            return res.status(404).json({ error: 'Report tapılmadı' });
        }

        // Delete the message
        dbHelpers.deleteChatMessageByAdmin(report.message_id);

        // Update report status
        dbHelpers.updateReportStatus(reportId, 'reviewed', 'Mesaj silindi');

        res.json({ success: true, message: 'Mesaj silindi və report bağlandı' });
    } catch (error) {
        console.error('Delete reported message error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

module.exports = router;

