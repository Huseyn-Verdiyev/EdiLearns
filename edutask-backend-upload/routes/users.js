// Users Routes
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

// Get all students (for leaderboard)
router.get('/leaderboard', (req, res) => {
    try {
        const leaderboard = dbHelpers.getLeaderboard();
        res.json(leaderboard);
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Admin: Create new student
const bcrypt = require('bcryptjs');

router.post('/admin/create-student', requireAuth, async (req, res) => {
    try {
        // Check if current user is admin
        const currentUser = dbHelpers.getUserById(req.session.userId);
        if (!currentUser || currentUser.role !== 'admin') {
            return res.status(403).json({ error: 'Yalnız admin şagird əlavə edə bilər' });
        }

        const { firstName, lastName, username, password, birthday, classId } = req.body;

        // Validation
        if (!firstName || !lastName || !username || !password) {
            return res.status(400).json({ error: 'Bütün sahələr tələb olunur' });
        }

        if (password.length < 4) {
            return res.status(400).json({ error: 'Şifrə ən azı 4 simvol olmalıdır' });
        }

        // Check if username exists
        const existing = dbHelpers.getUserByUsername(username.toLowerCase());
        if (existing) {
            return res.status(400).json({ error: 'Bu istifadəçi adı artıq mövcuddur' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const fullName = `${firstName} ${lastName}`;

        // Insert user
        const result = dbHelpers.run(
            'INSERT INTO users (username, password, full_name, role, class_id, avatar, points, xp, level, birthday) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [username.toLowerCase(), hashedPassword, fullName, 'student', classId || null, 0, 0, 0, 1, birthday || null]
        );

        res.json({
            success: true,
            userId: result.lastInsertRowid,
            message: `${fullName} uğurla əlavə edildi!`
        });

    } catch (error) {
        console.error('Admin create student error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get students by class
router.get('/class/:classId', requireAuth, (req, res) => {
    try {
        const students = dbHelpers.getStudentsByClass(parseInt(req.params.classId), 'student');
        res.json(students.map(s => {
            const { password: _, ...data } = s;
            return data;
        }));
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get user profile
router.get('/:id', requireAuth, (req, res) => {
    try {
        const user = dbHelpers.getUserById(parseInt(req.params.id));
        if (!user) {
            return res.status(404).json({ error: 'İstifadəçi tapılmadı' });
        }
        const { password: _, ...userData } = user;
        res.json(userData);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Update user points
router.put('/:id/points', requireAuth, (req, res) => {
    try {
        const { points, xp, level } = req.body;
        dbHelpers.updateUserPoints(points, xp, level, parseInt(req.params.id));
        res.json({ success: true, message: 'Xallar yeniləndi' });
    } catch (error) {
        console.error('Update points error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get user notifications
router.get('/:id/notifications', requireAuth, (req, res) => {
    try {
        if (parseInt(req.params.id) !== req.session.userId) {
            return res.status(403).json({ error: 'İcazə yoxdur' });
        }
        const notifications = dbHelpers.getUserNotifications(parseInt(req.params.id));
        res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Admin: Set student password
// bcrypt already required above

router.put('/:id/password', requireAuth, async (req, res) => {
    try {
        // Check if current user is admin
        const currentUser = dbHelpers.getUserById(req.session.userId);
        if (!currentUser || currentUser.role !== 'admin') {
            return res.status(403).json({ error: 'Yalnız admin bu əməliyyatı edə bilər' });
        }

        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 4) {
            return res.status(400).json({ error: 'Şifrə ən azı 4 simvol olmalıdır' });
        }

        // Check if target user exists
        const targetUser = dbHelpers.getUserById(parseInt(req.params.id));
        if (!targetUser) {
            return res.status(404).json({ error: 'İstifadəçi tapılmadı' });
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        dbHelpers.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, parseInt(req.params.id)]);

        res.json({ success: true, message: `${targetUser.full_name} üçün şifrə dəyişdirildi` });
    } catch (error) {
        console.error('Admin set password error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

module.exports = router;
