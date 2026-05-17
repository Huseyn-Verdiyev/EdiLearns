// EduTask Database Connection (using sql.js)
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// Use current directory for database in production
const dbDir = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, 'data')
    : path.join(__dirname, '..', 'database');

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'edutask.db');
const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.sql');

let db = null;

function isSqliteFileValid(buffer) {
    if (!buffer || buffer.length < 16) {
        return false;
    }
    return buffer.slice(0, 16).toString('utf8') === 'SQLite format 3\u0000';
}

function backupCorruptDatabase() {
    try {
        if (fs.existsSync(dbPath)) {
            const backupPath = `${dbPath}.corrupt.${Date.now()}`;
            fs.renameSync(dbPath, backupPath);
            console.warn(`Database file looked invalid. Backed up to ${backupPath}`);
        }
    } catch (error) {
        console.warn('Failed to back up invalid database file:', error);
    }
}

function initializeNewDatabase(SQL) {
    db = new SQL.Database();
    console.log('Creating new database...');

    // Run schema
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.run(schema);
    console.log('Schema created');

    // Run seed data
    const seed = fs.readFileSync(seedPath, 'utf8');
    db.run(seed);
    console.log('Seed data inserted');

    // Save to file
    saveDatabase();
    console.log('Database initialized successfully!');
}

// Initialize database
async function initializeDatabase() {
    const SQL = await initSqlJs();

    if (fs.existsSync(dbPath)) {
        const buffer = fs.readFileSync(dbPath);
        if (!isSqliteFileValid(buffer)) {
            backupCorruptDatabase();
            initializeNewDatabase(SQL);
            return db;
        }

        try {
            db = new SQL.Database(buffer);
            console.log('Database loaded from file');
            return db;
        } catch (error) {
            console.error('Database load error:', error);
            backupCorruptDatabase();
            initializeNewDatabase(SQL);
            return db;
        }
    }

    initializeNewDatabase(SQL);
    return db;
}

// Save database to file
function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
}

// Auto-save every 30 seconds
setInterval(saveDatabase, 30000);

// Create backup every hour
setInterval(() => {
    try {
        const fs = require('fs');
        const path = require('path');
        const backupPath = path.join(__dirname, '..', 'database', `edutask-backup-${Date.now()}.db`);
        if (fs.existsSync(dbPath)) {
            fs.copyFileSync(dbPath, backupPath);
            console.log(`Database backup created: ${backupPath}`);

            // Keep only last 5 backups
            const backupDir = path.join(__dirname, '..', 'database');
            const backups = fs.readdirSync(backupDir)
                .filter(file => file.startsWith('edutask-backup-') && file.endsWith('.db'))
                .sort()
                .reverse();

            if (backups.length > 5) {
                backups.slice(5).forEach(backup => {
                    fs.unlinkSync(path.join(backupDir, backup));
                });
            }
        }
    } catch (error) {
        console.warn('Failed to create database backup:', error);
    }
}, 60 * 60 * 1000); // Every hour

// Save database on process exit
process.on('exit', () => {
    console.log('Saving database before exit...');
    saveDatabase();
});

process.on('SIGINT', () => {
    console.log('Saving database before exit...');
    saveDatabase();
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('Saving database before exit...');
    saveDatabase();
    process.exit();
});

// Helper functions (wrapping sql.js API)
const dbHelpers = {
    // Run single query and get result
    get: (sql, params = []) => {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            return row;
        }
        stmt.free();
        return null;
    },

    // Run query and get all results
    all: (sql, params = []) => {
        const results = [];
        const stmt = db.prepare(sql);
        stmt.bind(params);
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    },

    // Run query (insert/update/delete)
    run: (sql, params = []) => {
        db.run(sql, params);
        saveDatabase();
        return { lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0], changes: db.getRowsModified() };
    },

    // User operations
    getUserByUsername: (username) => dbHelpers.get('SELECT * FROM users WHERE username = ?', [username]),
    getUserById: (id) => dbHelpers.get('SELECT * FROM users WHERE id = ?', [id]),
    getStudentsByClass: (classId, role) => dbHelpers.all('SELECT * FROM users WHERE class_id = ? AND role = ?', [classId, role]),
    updateUserPoints: (points, xp, level, id) => dbHelpers.run('UPDATE users SET points = ?, xp = ?, level = ? WHERE id = ?', [points, xp, level, id]),
    updateLastLogin: (id) => dbHelpers.run('UPDATE users SET last_login = datetime("now") WHERE id = ?', [id]),

    // Class operations
    getAllClasses: () => dbHelpers.all('SELECT * FROM classes'),
    getClassById: (id) => dbHelpers.get('SELECT * FROM classes WHERE id = ?', [id]),

    // Chat operations
    getChatMessages: (classId) => dbHelpers.all('SELECT m.*, u.full_name as author, u.avatar FROM chat_messages m JOIN users u ON m.user_id = u.id WHERE m.class_id = ? ORDER BY m.created_at ASC', [classId]),
    insertChatMessage: (classId, userId, content) => dbHelpers.run('INSERT INTO chat_messages (class_id, user_id, content) VALUES (?, ?, ?)', [classId, userId, content]),
    deleteChatMessage: (id, userId) => dbHelpers.run('DELETE FROM chat_messages WHERE id = ? AND user_id = ?', [id, userId]),
    deleteChatMessageByAdmin: (id) => dbHelpers.run('DELETE FROM chat_messages WHERE id = ?', [id]),
    markMessagesRead: (classId, userId) => dbHelpers.run('UPDATE chat_messages SET is_read = 1 WHERE class_id = ? AND user_id != ?', [classId, userId]),

    // Wall operations
    getWallPosts: (classId) => dbHelpers.all('SELECT p.*, u.full_name as author, u.avatar FROM wall_posts p JOIN users u ON p.user_id = u.id WHERE p.class_id = ? ORDER BY p.created_at DESC', [classId]),
    insertWallPost: (classId, userId, content, isQuestion) => dbHelpers.run('INSERT INTO wall_posts (class_id, user_id, content, is_question) VALUES (?, ?, ?, ?)', [classId, userId, content, isQuestion]),
    deleteWallPost: (id, userId) => dbHelpers.run('DELETE FROM wall_posts WHERE id = ? AND user_id = ?', [id, userId]),

    // Assignment operations
    getAssignmentsByClass: (classId) => dbHelpers.all('SELECT * FROM assignments WHERE class_id = ? ORDER BY deadline ASC', [classId]),
    getAssignmentsByTeacher: (teacherId) => dbHelpers.all('SELECT * FROM assignments WHERE teacher_id = ? ORDER BY deadline ASC', [teacherId]),
    getAssignmentById: (id) => dbHelpers.get('SELECT * FROM assignments WHERE id = ?', [id]),
    insertAssignment: (title, desc, classId, teacherId, deadline, sdg) => dbHelpers.run('INSERT INTO assignments (title, description, class_id, teacher_id, deadline, sdg_goal) VALUES (?, ?, ?, ?, ?, ?)', [title, desc, classId, teacherId, deadline, sdg]),

    // Submission operations
    getSubmissionsByAssignment: (assignmentId) => dbHelpers.all('SELECT s.*, u.full_name as student_name FROM submissions s JOIN users u ON s.student_id = u.id WHERE s.assignment_id = ?', [assignmentId]),
    getSubmissionByStudent: (assignmentId, studentId) => dbHelpers.get('SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?', [assignmentId, studentId]),
    insertSubmission: (assignmentId, studentId, content, filePath) => dbHelpers.run('INSERT INTO submissions (assignment_id, student_id, content, file_path) VALUES (?, ?, ?, ?)', [assignmentId, studentId, content, filePath]),
    gradeSubmission: (grade, feedback, status, id) => dbHelpers.run('UPDATE submissions SET grade = ?, feedback = ?, status = ?, graded_at = datetime("now") WHERE id = ?', [grade, feedback, status, id]),
    getSubmissionsByStudent: (studentId) => dbHelpers.all('SELECT s.*, a.title as assignment_title FROM submissions s JOIN assignments a ON s.assignment_id = a.id WHERE s.student_id = ?', [studentId]),

    // Leaderboard
    getLeaderboard: () => dbHelpers.all("SELECT id, full_name as name, points, avatar, class_id FROM users WHERE role = 'student' ORDER BY points DESC LIMIT 20"),

    // Notifications
    getUserNotifications: (userId) => dbHelpers.all('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [userId]),
    insertNotification: (userId, message, type) => dbHelpers.run('INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)', [userId, message, type]),

    // Resources
    getResourcesByClass: (classId) => dbHelpers.all('SELECT * FROM resources WHERE class_id = ? OR class_id IS NULL ORDER BY created_at DESC', [classId]),
    insertResource: (title, desc, filePath, link, classId, teacherId, category) => dbHelpers.run('INSERT INTO resources (title, description, file_path, link, class_id, teacher_id, category) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, desc, filePath, link, classId, teacherId, category]),

    // Quizzes
    getQuizzesByClass: (classId) => dbHelpers.all('SELECT * FROM quizzes WHERE class_id = ?', [classId]),
    getQuizQuestions: (quizId) => dbHelpers.all('SELECT * FROM quiz_questions WHERE quiz_id = ?', [quizId]),
    insertQuizResult: (quizId, studentId, score, answers) => dbHelpers.run('INSERT INTO quiz_results (quiz_id, student_id, score, answers) VALUES (?, ?, ?, ?)', [quizId, studentId, score, answers]),
    getQuizResultsByQuiz: (quizId) => dbHelpers.all(`
        SELECT qr.*, u.full_name as student_name, u.class_id 
        FROM quiz_results qr 
        JOIN users u ON qr.student_id = u.id 
        WHERE qr.quiz_id = ? 
        ORDER BY qr.completed_at DESC
    `, [quizId]),
    getAllQuizResults: () => dbHelpers.all(`
        SELECT qr.*, u.full_name as student_name, q.title as quiz_title, c.name as class_name
        FROM quiz_results qr 
        JOIN users u ON qr.student_id = u.id 
        JOIN quizzes q ON qr.quiz_id = q.id
        JOIN classes c ON u.class_id = c.id
        ORDER BY qr.completed_at DESC
    `),

    // Chat Reports
    getAllReports: () => dbHelpers.all(`
        SELECT r.*, 
               m.content as message_content, 
               m.user_id as message_author_id,
               reporter.full_name as reporter_name,
               author.full_name as author_name
        FROM chat_reports r 
        JOIN chat_messages m ON r.message_id = m.id 
        JOIN users reporter ON r.reporter_id = reporter.id
        JOIN users author ON m.user_id = author.id
        ORDER BY r.created_at DESC
    `),
    getPendingReports: () => dbHelpers.all(`
        SELECT r.*, 
               m.content as message_content, 
               m.user_id as message_author_id,
               reporter.full_name as reporter_name,
               author.full_name as author_name
        FROM chat_reports r 
        JOIN chat_messages m ON r.message_id = m.id 
        JOIN users reporter ON r.reporter_id = reporter.id
        JOIN users author ON m.user_id = author.id
        WHERE r.status = 'pending'
        ORDER BY r.created_at DESC
    `),
    getReportById: (id) => dbHelpers.get('SELECT * FROM chat_reports WHERE id = ?', [id]),
    insertReport: (messageId, reporterId, reason) => dbHelpers.run('INSERT INTO chat_reports (message_id, reporter_id, reason) VALUES (?, ?, ?)', [messageId, reporterId, reason]),
    updateReportStatus: (id, status, action) => dbHelpers.run('UPDATE chat_reports SET status = ?, admin_action = ?, reviewed_at = datetime("now") WHERE id = ?', [status, action, id]),
    getReportByMessageAndUser: (messageId, userId) => dbHelpers.get('SELECT * FROM chat_reports WHERE message_id = ? AND reporter_id = ?', [messageId, userId]),
    getChatMessageById: (id) => dbHelpers.get('SELECT * FROM chat_messages WHERE id = ?', [id]),

    // Blacklist
    getBlacklist: () => dbHelpers.all('SELECT * FROM blacklist ORDER BY created_at DESC'),
    addBlacklistWord: (word, adminId) => dbHelpers.run('INSERT INTO blacklist (word, added_by) VALUES (?, ?)', [word.toLowerCase(), adminId]),
    removeBlacklistWord: (id) => dbHelpers.run('DELETE FROM blacklist WHERE id = ?', [id]),
    checkBlacklist: (content) => {
        // Need to get all words first
        // This is a bit inefficient for very large lists, but fine for now
        // Ideally handled in application logic, but putting helper here is consistent
        return dbHelpers.all('SELECT word FROM blacklist');
    },

    // News operations
    getAllNews: () => dbHelpers.all('SELECT n.*, u.full_name as author_name FROM news n JOIN users u ON n.author_id = u.id ORDER BY n.created_at DESC'),
    getNewsByCategory: (category) => dbHelpers.all('SELECT n.*, u.full_name as author_name FROM news n JOIN users u ON n.author_id = u.id WHERE n.category = ? ORDER BY n.created_at DESC', [category]),
    insertNews: (title, category, content, image_url, author_id) => dbHelpers.run('INSERT INTO news (title, category, content, image_url, author_id) VALUES (?, ?, ?, ?, ?)', [title, category, content, image_url, author_id]),
    deleteNews: (id) => dbHelpers.run('DELETE FROM news WHERE id = ?', [id])
};

module.exports = { initializeDatabase, dbHelpers, saveDatabase };
