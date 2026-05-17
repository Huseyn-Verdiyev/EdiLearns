const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../db');

// Get all news
router.get('/', (req, res) => {
    try {
        const category = req.query.category;
        let news;
        if (category && category !== 'all') {
            news = dbHelpers.getNewsByCategory(category);
        } else {
            news = dbHelpers.getAllNews();
        }
        res.json(news);
    } catch (error) {
        console.error('Failed to get news:', error);
        res.status(500).json({ error: 'Xəberlər yüklənərkən xəta baş verdi' });
    }
});

// Create news (Admin only)
router.post('/', (req, res) => {
    if (!req.session.userId || req.session.userRole !== 'admin') {
        return res.status(403).json({ error: 'Yalnız adminlər xəbər əlavə edə bilər' });
    }

    const { title, category, content, image_url } = req.body;
    if (!title || !category || !content) {
        return res.status(400).json({ error: 'Başlıq, kateqoriya və məzmun daxil edilməlidir' });
    }

    try {
        const result = dbHelpers.insertNews(title, category, content, image_url, req.session.userId);
        res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        console.error('Failed to create news:', error);
        res.status(500).json({ error: 'Xəbər əlavə edilərkən xəta baş verdi' });
    }
});

// Delete news (Admin only)
router.delete('/:id', (req, res) => {
    if (!req.session.userId || req.session.userRole !== 'admin') {
        return res.status(403).json({ error: 'Yalnız adminlər xəbər silə bilər' });
    }

    try {
        dbHelpers.deleteNews(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Failed to delete news:', error);
        res.status(500).json({ error: 'Xəber silinərkən xəta baş verdi' });
    }
});

module.exports = router;
