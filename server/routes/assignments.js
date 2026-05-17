// Assignments Routes
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

// Teacher only middleware
const requireTeacher = (req, res, next) => {
    if (req.session.userRole !== 'teacher' && req.session.userRole !== 'admin') {
        return res.status(403).json({ error: 'Müəllim icazəsi tələb olunur' });
    }
    next();
};

// Get assignments by class
router.get('/class/:classId', requireAuth, (req, res) => {
    try {
        const assignments = dbHelpers.getAssignmentsByClass(parseInt(req.params.classId));
        res.json(assignments);
    } catch (error) {
        console.error('Get assignments error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get assignments by teacher (teacher only)
router.get('/teacher', requireAuth, requireTeacher, (req, res) => {
    try {
        const assignments = dbHelpers.getAssignmentsByTeacher(req.session.userId);
        res.json(assignments);
    } catch (error) {
        console.error('Get teacher assignments error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get single assignment
router.get('/:id', requireAuth, (req, res) => {
    try {
        const assignment = dbHelpers.getAssignmentById(parseInt(req.params.id));
        if (!assignment) {
            return res.status(404).json({ error: 'Tapşırıq tapılmadı' });
        }
        res.json(assignment);
    } catch (error) {
        console.error('Get assignment error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Create assignment (teacher only)
router.post('/', requireAuth, requireTeacher, (req, res) => {
    try {
        const { title, description, classId, deadline, sdgGoal } = req.body;

        if (!title || !classId) {
            return res.status(400).json({ error: 'Başlıq və sinif tələb olunur' });
        }

        const result = dbHelpers.insertAssignment(
            title,
            description || null,
            parseInt(classId),
            req.session.userId,
            deadline || null,
            sdgGoal || null
        );

        res.json({
            success: true,
            assignmentId: result.lastInsertRowid,
            message: 'Tapşırıq yaradıldı'
        });
    } catch (error) {
        console.error('Create assignment error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get submissions for an assignment (teacher only)
router.get('/:id/submissions', requireAuth, requireTeacher, (req, res) => {
    try {
        const submissions = dbHelpers.getSubmissionsByAssignment(parseInt(req.params.id));
        res.json(submissions);
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Submit assignment (student)
router.post('/:id/submit', requireAuth, (req, res) => {
    try {
        const { content, filePath } = req.body;

        // Check if already submitted
        const existing = dbHelpers.getSubmissionByStudent(parseInt(req.params.id), req.session.userId);
        if (existing) {
            return res.status(400).json({ error: 'Artıq təhvil vermisiz' });
        }

        const result = dbHelpers.insertSubmission(
            parseInt(req.params.id),
            req.session.userId,
            content,
            filePath
        );

        res.json({
            success: true,
            submissionId: result.lastInsertRowid,
            message: 'Tapşırıq təhvil verildi'
        });
    } catch (error) {
        console.error('Submit assignment error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Grade submission (teacher only)
router.put('/submissions/:id/grade', requireAuth, requireTeacher, (req, res) => {
    try {
        const { grade, feedback, status } = req.body;

        dbHelpers.gradeSubmission(grade, feedback, status || 'graded', parseInt(req.params.id));

        res.json({ success: true, message: 'Qiymət verildi' });
    } catch (error) {
        console.error('Grade submission error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Get all submissions for the current student
router.get('/my-submissions', requireAuth, (req, res) => {
    try {
        const submissions = dbHelpers.getSubmissionsByStudent(req.session.userId);
        res.json(submissions);
    } catch (error) {
        console.error('Get my submissions error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

module.exports = router;

