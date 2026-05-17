// Authentication Routes with Password Hashing
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { dbHelpers } = require('../db');

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username və password tələb olunur' });
        }

        const user = dbHelpers.getUserByUsername(username.toLowerCase());

        if (!user) {
            return res.status(401).json({ error: 'İstifadəçi tapılmadı' });
        }

        // Check password - support both hashed and plain text for migration
        let isMatch = false;
        if (user.password.startsWith('$2')) {
            // Password is hashed with bcrypt
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Plain text password (legacy)
            isMatch = password === user.password;

            // Auto-hash plain text passwords on successful login
            if (isMatch) {
                const hashedPassword = await bcrypt.hash(password, 10);
                dbHelpers.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
            }
        }

        if (!isMatch) {
            return res.status(401).json({ error: 'Yanlış şifrə' });
        }

        // Check role if provided
        if (role && user.role !== role && !(role === 'teacher' && user.role === 'admin')) {
            return res.status(401).json({ error: 'Bu rol üçün icazəniz yoxdur' });
        }

        // Update last login
        dbHelpers.updateLastLogin(user.id);

        // Set session
        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.username = user.username;

        // Return user data (without password)
        const { password: _, ...userData } = user;
        res.json({
            success: true,
            message: 'Giriş uğurlu!',
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, password, fullName, role, classId } = req.body;

        if (!username || !password || !fullName) {
            return res.status(400).json({ error: 'Bütün sahələr tələb olunur' });
        }

        // Check if username exists
        const existing = dbHelpers.getUserByUsername(username.toLowerCase());
        if (existing) {
            return res.status(400).json({ error: 'Bu istifadəçi adı artıq mövcuddur' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const result = dbHelpers.run(
            'INSERT INTO users (username, password, full_name, role, class_id, avatar, points, xp, level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [username.toLowerCase(), hashedPassword, fullName, role || 'student', classId || null, 0, 0, 0, 1]
        );

        res.json({
            success: true,
            userId: result.lastInsertRowid,
            message: 'Qeydiyyat uğurlu!'
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Çıxış zamanı xəta' });
        }
        res.json({ success: true, message: 'Çıxış uğurlu!' });
    });
});

// Check auth status
router.get('/me', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Daxil olmamısınız' });
    }

    const user = dbHelpers.getUserById(req.session.userId);
    if (!user) {
        return res.status(401).json({ error: 'İstifadəçi tapılmadı' });
    }

    const { password: _, ...userData } = user;
    res.json({ user: userData });
});

// Change password
router.post('/change-password', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Daxil olmalısınız' });
        }

        const { currentPassword, newPassword } = req.body;
        const user = dbHelpers.getUserById(req.session.userId);

        // Verify current password
        let isMatch = false;
        if (user.password.startsWith('$2')) {
            isMatch = await bcrypt.compare(currentPassword, user.password);
        } else {
            isMatch = currentPassword === user.password;
        }

        if (!isMatch) {
            return res.status(401).json({ error: 'Cari şifrə yanlışdır' });
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        dbHelpers.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.session.userId]);

        res.json({ success: true, message: 'Şifrə dəyişdirildi' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

module.exports = router;
