// Classes Routes
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

// Get all classes
router.get('/', requireAuth, (req, res) => {
    try {
        const classes = dbHelpers.getAllClasses();
        res.json(classes);
    } catch (error) {
        console.error('Get classes error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get class by ID with students
router.get('/:id', requireAuth, (req, res) => {
    try {
        const classInfo = dbHelpers.getClassById(parseInt(req.params.id));
        if (!classInfo) {
            return res.status(404).json({ error: 'Sinif tapılmadı' });
        }

        const students = dbHelpers.getStudentsByClass(parseInt(req.params.id), 'student');

        res.json({
            ...classInfo,
            students: students.map(s => {
                const { password: _, ...data } = s;
                return data;
            })
        });
    } catch (error) {
        console.error('Get class error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get resources for a class
router.get('/:id/resources', requireAuth, (req, res) => {
    try {
        const resources = dbHelpers.getResourcesByClass(parseInt(req.params.id));
        res.json(resources);
    } catch (error) {
        console.error('Get resources error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Add resource (teacher only)
router.post('/:id/resources', requireAuth, (req, res) => {
    try {
        if (req.session.userRole !== 'teacher' && req.session.userRole !== 'admin') {
            return res.status(403).json({ error: 'Müəllim icazəsi tələb olunur' });
        }

        const { title, description, filePath, link, category } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Başlıq tələb olunur' });
        }

        const result = dbHelpers.insertResource(
            title,
            description,
            filePath,
            link,
            parseInt(req.params.id),
            req.session.userId,
            category
        );

        res.json({
            success: true,
            resourceId: result.lastInsertRowid,
            message: 'Resurs əlavə edildi'
        });
    } catch (error) {
        console.error('Add resource error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get quizzes for a class
router.get('/:id/quizzes', requireAuth, (req, res) => {
    try {
        const quizzes = dbHelpers.getQuizzesByClass(parseInt(req.params.id));
        res.json(quizzes);
    } catch (error) {
        console.error('Get quizzes error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get quiz questions
router.get('/quizzes/:quizId/questions', requireAuth, (req, res) => {
    try {
        const questions = dbHelpers.getQuizQuestions(parseInt(req.params.quizId));
        res.json(questions.map(q => ({
            ...q,
            options: q.options ? JSON.parse(q.options) : []
        })));
    } catch (error) {
        console.error('Get quiz questions error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Submit quiz result
router.post('/quizzes/:quizId/submit', requireAuth, (req, res) => {
    try {
        const { score, answers } = req.body;

        const result = dbHelpers.insertQuizResult(
            parseInt(req.params.quizId),
            req.session.userId,
            score,
            JSON.stringify(answers)
        );

        res.json({
            success: true,
            resultId: result.lastInsertRowid,
            message: 'Test nəticəsi qeyd edildi'
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});
// Get all quiz results (teacher only)
router.get('/quiz-results/all', requireAuth, (req, res) => {
    try {
        if (req.session.userRole !== 'teacher' && req.session.userRole !== 'admin') {
            return res.status(403).json({ error: 'Müəllim icazəsi tələb olunur' });
        }

        const results = dbHelpers.getAllQuizResults();
        res.json(results);
    } catch (error) {
        console.error('Get all quiz results error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get quiz results by quiz ID (teacher only)
router.get('/quizzes/:quizId/results', requireAuth, (req, res) => {
    try {
        if (req.session.userRole !== 'teacher' && req.session.userRole !== 'admin') {
            return res.status(403).json({ error: 'Müəllim icazəsi tələb olunur' });
        }

        const results = dbHelpers.getQuizResultsByQuiz(parseInt(req.params.quizId));
        res.json(results);
    } catch (error) {
        console.error('Get quiz results error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

module.exports = router;

