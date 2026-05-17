// EduTask Express Server with WebSocket & File Upload
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const multer = require('multer');
const { initializeDatabase, dbHelpers, saveDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'edutask-secret-key-2024';

// Create HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients by class
const classClients = new Map();

// WebSocket connection handler
wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'join') {
                // Join a class chat room
                ws.classId = data.classId;
                ws.userId = data.userId;
                ws.username = data.username;

                if (!classClients.has(data.classId)) {
                    classClients.set(data.classId, new Set());
                }
                classClients.get(data.classId).add(ws);
                console.log(`User ${data.username} joined class ${data.classId}`);
            }

            if (data.type === 'message') {
                // Broadcast message to all clients in the same class
                const clients = classClients.get(ws.classId);
                if (clients) {
                    const broadcastData = JSON.stringify({
                        type: 'message',
                        id: Date.now(),
                        author: ws.username,
                        content: data.content,
                        time: new Date().toISOString(),
                        userId: ws.userId
                    });

                    clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(broadcastData);
                        }
                    });

                    // Save to database
                    dbHelpers.insertChatMessage(ws.classId, ws.userId, data.content);
                }
            }

            if (data.type === 'typing') {
                // Broadcast typing indicator
                const clients = classClients.get(ws.classId);
                if (clients) {
                    clients.forEach(client => {
                        if (client !== ws && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: 'typing',
                                username: ws.username
                            }));
                        }
                    });
                }
            }
        } catch (e) {
            console.error('WebSocket message error:', e);
        }
    });

    ws.on('close', () => {
        if (ws.classId && classClients.has(ws.classId)) {
            classClients.get(ws.classId).delete(ws);
        }
    });
});

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp4|mp3/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Yalnız şəkil, PDF, Word, və media faylları icazəlidir'));
    }
});

// Make upload middleware available
app.locals.upload = upload;

// Middleware
app.use(cors({
    origin: true, // Allow all origins
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const sessionMiddleware = session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
});
app.use(sessionMiddleware);

// Serve static files
app.use(express.static(path.join(__dirname, '..')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Daxil olmalısınız' });
    }
    if (!req.file) {
        return res.status(400).json({ error: 'Fayl tapılmadı' });
    }
    res.json({
        success: true,
        filename: req.file.filename,
        path: '/uploads/' + req.file.filename,
        originalName: req.file.originalname
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'EduTask API is running!', websocket: 'enabled' });
});

// Start server after database is ready
async function startServer() {
    try {
        await initializeDatabase();
        console.log('✅ Database ready');

        // Import routes
        const authRoutes = require('./routes/auth');
        const usersRoutes = require('./routes/users');
        const chatRoutes = require('./routes/chat');
        const assignmentsRoutes = require('./routes/assignments');
        const classesRoutes = require('./routes/classes');
        const aiRoutes = require('./routes/ai');
        const newsRoutes = require('./routes/news');

        // API Routes
        app.use('/api/auth', authRoutes);
        app.use('/api/users', usersRoutes);
        app.use('/api/chat', chatRoutes);
        app.use('/api/assignments', assignmentsRoutes);
        app.use('/api/classes', classesRoutes);
        app.use('/api/ai', aiRoutes);
        app.use('/api/news', newsRoutes);

        // Serve frontend
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'index.html'));
        });

        // Error handling
        app.use((err, req, res, next) => {
            console.error('Error:', err);
            res.status(500).json({ error: 'Server error', message: err.message });
        });

        // Start listening
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`
🚀 EduTask Server is running!
📍 LOCAL:   http://localhost:${PORT}
📍 NETWORK: http://10.10.40.26:${PORT}
📊 API:     http://localhost:${PORT}/api/health
🔌 WS:      ws://10.10.40.26:${PORT}
📁 Uploads: /uploads
🗄️ Database: SQLite3
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
