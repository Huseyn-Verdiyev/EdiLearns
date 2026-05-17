// --- BÜTÜN DƏYİŞƏNLƏR ---

// API Base URL - Production (Render) or Local Development
let apiBaseUrl = 'https://edutask-server-bu-uje-200-faiz-duzdue.onrender.com/api'; // Production Default

if (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('10.') ||
    window.location.hostname.startsWith('192.') ||
    window.location.protocol === 'file:') {

    // Use localhost if opened as file, otherwise use the detected hostname
    const host = window.location.hostname || 'localhost';
    apiBaseUrl = `http://${host}:3001/api`;
}

const API_BASE = apiBaseUrl;
console.log('📌 API URL:', API_BASE);

// Current user data from API
let currentUser = null;

// --- LOGIN HANDLER (API Based) ---
async function handleLogin(event) {
    event.preventDefault();
    const form = document.getElementById('login-form');
    const role = form.role.value;
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const errorMessage = document.getElementById('error-message');

    try {
        let data, isOk;
        if (window.location.protocol === 'file:') {
            data = {
                success: true,
                user: { id: 1, username: username, full_name: username, role: role, avatar: 0, class_id: 1, class_name: "10A" }
            };
            isOk = true;
        } else {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password, role })
            });
            data = await response.json();
            isOk = response.ok;
        }

        if (!isOk) {
            errorMessage.textContent = data.error || 'Giriş uğursuz!';
            errorMessage.classList.remove('hidden');
            return;
        }

        // Save user data
        currentUser = data.user;
        currentUserRole = currentUser.role;
        currentUsername = currentUser.full_name || currentUser.username;

        // Play sound for teacher login
        if (currentUserRole === 'teacher') {
            playNotificationSound();
        }

        // Hide login, show panel
        document.body.classList.remove('login-body');
        document.body.classList.add('panel-body');
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('panel-wrapper').classList.remove('hidden');

        // Get all navigation elements
        const navElements = {
            main: document.getElementById('nav-main'),
            res: document.getElementById('nav-res'),
            points: document.getElementById('nav-points'),
            leaderboard: document.getElementById('nav-leaderboard'),
            wall: document.getElementById('nav-wall'),
            classes: document.getElementById('nav-classes'),
            quiz: document.getElementById('nav-quiz'),
            selfTest: document.getElementById('nav-self-test'),
            shop: document.getElementById('nav-shop'),
            chests: document.getElementById('nav-chests'),
            skills: document.getElementById('nav-skills'),
            recommendations: document.getElementById('nav-recommendations'),
            liveClass: document.getElementById('nav-live-class'),
            edubot: document.getElementById('nav-edubot'),
            admin: document.getElementById('nav-admin'),
            news: document.getElementById('nav-news'),
            friends: document.getElementById('nav-friends'),
            chat: document.getElementById('nav-chat'),
            competitions: document.getElementById('nav-competitions')
        };

        const streakContainer = document.getElementById('streak-container');

        // Hide/show based on role
        if (currentUserRole === 'student') {
            const studentPanel = document.getElementById('student-panel');
            const teacherPanel = document.getElementById('teacher-panel');
            const teacherDashboard = document.getElementById('teacher-dashboard');
            const adminStudentSection = document.getElementById('admin-add-student-section');
            const adminBookForm = document.getElementById('admin-book-form');
            if (studentPanel) studentPanel.classList.remove('hidden');
            if (teacherPanel) teacherPanel.classList.add('hidden');
            if (teacherDashboard) teacherDashboard.classList.add('hidden');
            if (adminStudentSection) adminStudentSection.classList.add('hidden');
            if (adminBookForm) adminBookForm.classList.add('hidden');

            // Show student navigation
            if (navElements.main) navElements.main.style.display = 'inline';
            if (navElements.res) navElements.res.style.display = 'inline';
            if (navElements.points) navElements.points.style.display = 'inline';
            if (navElements.leaderboard) navElements.leaderboard.style.display = 'inline';
            if (navElements.wall) navElements.wall.style.display = 'inline';
            if (navElements.classes) navElements.classes.style.display = 'none';
            if (navElements.quiz) navElements.quiz.style.display = 'inline';
            if (navElements.selfTest) navElements.selfTest.style.display = 'inline';
            if (navElements.shop) navElements.shop.style.display = 'inline';
            if (navElements.chests) navElements.chests.style.display = 'inline';
            if (navElements.skills) navElements.skills.style.display = 'inline';
            if (navElements.recommendations) navElements.recommendations.style.display = 'inline';
            if (navElements.liveClass) navElements.liveClass.style.display = 'none';
            if (navElements.edubot) navElements.edubot.style.display = 'inline';
            if (navElements.admin) navElements.admin.style.display = 'none';
            if (navElements.news) navElements.news.style.display = 'inline';
            if (navElements.friends) navElements.friends.style.display = 'inline';
            if (navElements.chat) navElements.chat.style.display = 'inline';
            if (navElements.competitions) navElements.competitions.style.display = 'inline';

            if (streakContainer) streakContainer.classList.remove('hidden');

            // Load User Specific Data
            loadUserData();
            if (typeof renderQuestBoard === 'function') renderQuestBoard();
            updateNotificationBadge();

        } else if (currentUserRole === 'teacher') {
            const studentPanel = document.getElementById('student-panel');
            const teacherPanel = document.getElementById('teacher-panel');
            const teacherDashboard = document.getElementById('teacher-dashboard');
            const adminStudentSection = document.getElementById('admin-add-student-section');
            const adminBookForm = document.getElementById('admin-book-form');
            if (studentPanel) studentPanel.classList.add('hidden');
            if (teacherPanel) teacherPanel.classList.add('hidden');
            if (teacherDashboard) teacherDashboard.classList.remove('hidden');
            if (adminStudentSection) adminStudentSection.classList.add('hidden');
            if (adminBookForm) adminBookForm.classList.add('hidden');

            // Teacher navigation
            if (navElements.main) navElements.main.style.display = 'inline';
            if (navElements.res) navElements.res.style.display = 'none';
            if (navElements.points) navElements.points.style.display = 'none';
            if (navElements.leaderboard) navElements.leaderboard.style.display = 'inline';
            if (navElements.wall) navElements.wall.style.display = 'inline';
            if (navElements.classes) navElements.classes.style.display = 'inline';
            if (navElements.quiz) navElements.quiz.style.display = 'inline';
            if (navElements.selfTest) navElements.selfTest.style.display = 'none';
            if (navElements.shop) navElements.shop.style.display = 'none';
            if (navElements.skills) navElements.skills.style.display = 'none';
            if (navElements.recommendations) navElements.recommendations.style.display = 'none';
            if (navElements.liveClass) navElements.liveClass.style.display = 'none';
            if (navElements.edubot) navElements.edubot.style.display = 'none';
            if (navElements.admin) navElements.admin.style.display = 'none';
            if (navElements.news) navElements.news.style.display = 'inline';
            if (navElements.friends) navElements.friends.style.display = 'none';
            if (navElements.chat) navElements.chat.style.display = 'none';
            if (navElements.competitions) navElements.competitions.style.display = 'none';

            if (streakContainer) streakContainer.classList.add('hidden');

        } else if (currentUserRole === 'admin') {
            const studentPanel = document.getElementById('student-panel');
            const teacherPanel = document.getElementById('teacher-panel');
            const teacherDashboard = document.getElementById('teacher-dashboard');
            const adminStudentSection = document.getElementById('admin-add-student-section');

            if (studentPanel) studentPanel.classList.add('hidden');
            if (teacherPanel) teacherPanel.classList.add('hidden');
            if (teacherDashboard) teacherDashboard.classList.remove('hidden'); // Show dashboard for admin
            if (adminStudentSection) adminStudentSection.classList.remove('hidden'); // Show student form

            // Admin sees everything
            Object.values(navElements).forEach(nav => {
                if (nav) nav.style.display = 'inline';
            });

            if (streakContainer) streakContainer.classList.add('hidden');

            // Load classes for the student selector
            if (typeof loadAdminClassSelector === 'function') loadAdminClassSelector();
        }

        // Control navigation visibility based on user role
        updateNavigationVisibility();

        // Try to call full setup if available
        if (typeof showMainPanel === 'function') showMainPanel();
        if (typeof renderAll === 'function') renderAll();
        if (typeof updateNotificationBadge === 'function') updateNotificationBadge();
        if (typeof updateClassSelectors === 'function') updateClassSelectors();
        if (typeof checkStreak === 'function') checkStreak();
        if (typeof updateStreakDisplay === 'function') updateStreakDisplay();

        // CRITICAL: Render dashboard and tasks
        if (typeof updateDashboard === 'function') updateDashboard(currentUserRole, currentUsername);
        // Load assignments from API based on role
        if (currentUserRole === 'student' && typeof loadAssignmentsFromAPI === 'function') {
            await loadAssignmentsFromAPI();
        }
        if (currentUserRole === 'teacher' && typeof loadTeacherAssignmentsFromAPI === 'function') {
            await loadTeacherAssignmentsFromAPI();
        }
        if (typeof renderStudentTasks === 'function' && currentUserRole === 'student') renderStudentTasks();
        if (typeof renderTeacherTasks === 'function' && currentUserRole === 'teacher') renderTeacherTasks();

        // Load chat messages from API
        if (typeof loadChatFromAPI === 'function') loadChatFromAPI();

        showToast('Giriş uğurlu! Xoş gəldiniz, ' + currentUsername + '!', 'success');

        // Show Edi welcome message for students (after a short delay)
        if (currentUserRole === 'student' && typeof ediSystem !== 'undefined' && ediSystem.showWelcomeMessage) {
            setTimeout(() => {
                ediSystem.showWelcomeMessage(currentUsername);
            }, 1000); // 1 second delay for better UX
        }

        // Load and check Secret Achievements for students
        if (currentUserRole === 'student') {
            if (typeof loadSecretAchievements === 'function') loadSecretAchievements();
            if (typeof checkSecretAchievements === 'function') {
                setTimeout(() => checkSecretAchievements(), 2000); // Delay to allow page to load
            }
        }

        // Initialize Mythic Shop rotation system
        if (typeof initMythicShop === 'function') initMythicShop();


    } catch (error) {
        console.error('Login error:', error);
        
        errorMessage.innerHTML = '⚠️ <b>SƏHV:</b> Sistemə giriş zamanı xəta baş verdi.';
        errorMessage.classList.remove('hidden');
    }
}

// Show login form for role - DUPLICATE REMOVED
// Using the more complete version below

// Back to role selection
function backToRoleSelection() {
    const roleScreen = document.getElementById('role-selection-screen');
    const loginScreen = document.getElementById('login-screen');

    if (loginScreen) loginScreen.classList.add('hidden');
    if (roleScreen) roleScreen.classList.remove('hidden');
}

let currentUserRole = '';
let currentUsername = '';

const loginSection = document.getElementById('login-section');
const roleScreen = document.getElementById('role-selection-screen');
const loginScreen = document.getElementById('login-screen');

// Function to control navigation visibility based on user role
function updateNavigationVisibility() {
    // Navigation items to hide for admin and teacher users
    const adminTeacherHiddenNavs = [
        'nav-points',      // 💎 Xallar
        'nav-books',       // 📖 Kitablar
        'nav-friends',     // 👥 Dostlar
        'nav-recommendations', // 💡 Tövsiyələr
        'nav-shop',        // 🏪 Mağaza
        'nav-chests',      // 🎁 Sandıqlar
        'nav-skills',      // 🌳 Bəcəriklər
        'nav-self-test'    // ✅ Özünü Yoxla
    ];

    // Hide navigation items for admin and teacher users
    if (currentUserRole === 'admin' || currentUserRole === 'teacher') {
        adminTeacherHiddenNavs.forEach(navId => {
            const navElement = document.getElementById(navId);
            if (navElement) {
                navElement.style.display = 'none';
            }
        });
    } else if (currentUserRole === 'student') {
        // Show navigation items for students
        adminTeacherHiddenNavs.forEach(navId => {
            const navElement = document.getElementById(navId);
            if (navElement) {
                navElement.style.display = 'inline';
            }
        });
    }
}
const panelWrapper = document.getElementById('panel-wrapper');
const mainHeader = document.getElementById('main-header');
const teacherPanel = document.getElementById('teacher-panel');
const teacherDashboard = document.getElementById('teacher-dashboard');
const studentPanel = document.getElementById('student-panel');
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const teacherTaskForm = document.getElementById('teacher-task-form');
const studentTaskList = document.getElementById('student-task-list');
const teacherSubmissionList = document.getElementById('teacher-submission-list');
const userInfoHeader = document.getElementById('user-info-header');
const welcomeBanner = document.getElementById('welcome-banner');
const statsGrid = document.getElementById('stats-grid');
const body = document.body;
const profileModalWrapper = document.getElementById('profile-modal-wrapper');
const avatarGrid = document.getElementById('avatar-grid');
const headerAvatar = document.querySelector('#user-profile-clickable .avatar');
const mainContentArea = document.getElementById('main-content-area');
const resourcesPanel = document.getElementById('resources-panel');
const pointsPanel = document.getElementById('points-panel');
const leaderboardPanel = document.getElementById('leaderboard-panel');
const classWallPanel = document.getElementById('class-wall-panel');
const classManagementPanel = document.getElementById('class-management-panel');
const quizPanel = document.getElementById('quiz-panel');
const selfTestPanel = document.getElementById('self-test-panel');
const adminPanel = document.getElementById('admin-panel');
const shopPanel = document.getElementById('shop-panel');
const chestsPanel = document.getElementById('chests-panel');
const recommendationsPanel = document.getElementById('recommendations-panel');
const liveClassPanel = document.getElementById('live-class-panel');
const navMain = document.getElementById('nav-main');
const navChests = document.getElementById('nav-chests');
const navRes = document.getElementById('nav-res');
const navPoints = document.getElementById('nav-points');
const navLeaderboard = document.getElementById('nav-leaderboard');
const navWall = document.getElementById('nav-wall');
const navClasses = document.getElementById('nav-classes');
const navQuiz = document.getElementById('nav-quiz');
const navSelfTest = document.getElementById('nav-self-test');
const navShop = document.getElementById('nav-shop');
const navRecommendations = document.getElementById('nav-recommendations');
const navLiveClass = document.getElementById('nav-live-class');
const navAdmin = document.getElementById('nav-admin');
const addResourceSection = document.getElementById('add-resource-section');
const addResourceForm = document.getElementById('add-resource-form');
const resourcesListSection = document.getElementById('resources-list-section');
const teacherQuestionsList = document.getElementById('teacher-questions-list');
const edubotPanel = document.getElementById('edubot-panel');
const navEduBot = document.getElementById('nav-edubot');
const edubotChatWindow = document.getElementById('edubot-chat-window');
const edubotInputForm = document.getElementById('edubot-input-form');
const edubotUserInput = document.getElementById('edubot-user-input');
const notificationBadge = document.getElementById('notification-badge');
const notificationDropdown = document.getElementById('notification-dropdown');
const toastContainer = document.getElementById('toast-container');
const eportfolioModal = document.getElementById('eportfolio-modal');
const inventoryGrid = document.getElementById('inventory-grid');

// --- VERİLƏNLƏR BAZASI (Prototip) ---
let assignments = [
    {
        id: 1,
        title: "Tarix",
        description: "Səfəvilər dövlətinin qurulması haqqında esse yazın.",
        status: 'new',
        submittedFile: null,
        submittedText: null,
        grade: null,
        feedback: '',
        questions: [],
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        class: '10F',
        points: 50,
        aiAnalysis: null,
        sdg: '4',
        lastReviewed: null
    },
    {
        id: 2,
        title: "Ədəbiyyat",
        description: "M.F.Axundzadənin həyat və yaradıcılığı.",
        status: 'submitted',
        submittedFile: 'axundzade_heyati.pdf',
        submittedText: "Mirzə Fətəli Axundzadə 1812-ci ildə Şəkidə anadan olmuşdur. O, Azərbaycan ədəbiyyatının böyük nümayəndəsi idi. Onun əsərləri arasında 'Aldanmış kəvakib', 'Müsyö Jordan və dərviş Məstəli şah' kimi komediyalar var. Axundzadə həm də maarifçi idi və xalqın maarifləndirməsi üçün çox işlər görmüşdür.",
        grade: 5,
        feedback: 'Əla işdir, faktları doğru qeyd etmisən.',
        questions: [{ student: 'Ferid', text: 'Müəllim, neçə səhifə olmalıdır?' }],
        deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        class: '10F',
        points: 50,
        aiAnalysis: {
            plagiarism: "Mətnin 2-ci cümləsi Vikipediyadakı 'M.F.Axundzadə' məqaləsi ilə 78% oxşardır.",
            mainPoints: "Şagird əsasən Axundzadənin doğum yeri və əsərlərini qeyd edib, lakin onun təhsil fəaliyyətinə az toxunub.",
            suggestion: "Rəy olaraq təklif: 'Yaxşı başlanğıcdır, lakin Axundzadənin təhsil sahəsindəki fəaliyyətini də əlavə etsən, inşan daha dolğun olar.'"
        },
        sdg: '4',
        lastReviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
        id: 3,
        title: "Riyaziyyat",
        description: "Kvadrat tənliklər mövzusunda 10 məsələ həll edin.",
        status: 'submitted',
        submittedFile: null,
        submittedText: "1. x² + 5x + 6 = 0, cavab: x₁ = -2, x₂ = -3\n2. x² - 4x + 4 = 0, cavab: x = 2\n3. x² + 3x - 4 = 0, cavab: x₁ = 1, x₂ = -4",
        grade: 4,
        feedback: 'Yaxşı işdir, lakin 3 məsələ az idi.',
        questions: [],
        deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        class: '10F',
        points: 40,
        aiAnalysis: null,
        sdg: null,
        lastReviewed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
        id: 4,
        title: "Biologiya",
        description: "Bitki hüceyrəsinin quruluşunu cədvəldə izah edin və 5 fərqi yazın.",
        status: 'new',
        submittedFile: null,
        submittedText: null,
        grade: null,
        feedback: '',
        questions: [],
        deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        class: '10F',
        points: 45,
        aiAnalysis: null,
        sdg: '3',
        lastReviewed: null
    },
    {
        id: 5,
        title: "İngilis dili",
        description: "Daily routine mövzusunda 120-150 sözlük esse yazın.",
        status: 'new',
        submittedFile: null,
        submittedText: null,
        grade: null,
        feedback: '',
        questions: [],
        deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        class: '10F',
        points: 35,
        aiAnalysis: null,
        sdg: '4',
        lastReviewed: null
    }
];

let resources = [
    { id: 1, title: 'Azərbaycan Tarixi Dərslik (PDF)', link: '#', description: '7-ci sinif üçün dərslik.' }
];

let globalOERResources = [
    { id: 1, title: 'Khan Academy - Riyaziyyat', link: 'https://www.khanacademy.org/math', description: 'Pulsuz riyaziyyat dərsləri', source: 'Khan Academy' },
    { id: 2, title: 'MIT OpenCourseWare - Fizika', link: 'https://ocw.mit.edu/courses/physics/', description: 'MIT-dən pulsuz fizika kursları', source: 'MIT' },
    { id: 3, title: 'Coursera - Tarix', link: 'https://www.coursera.org/browse/arts-and-humanities/history', description: 'Dünya universitetlərindən tarix kursları', source: 'Coursera' }
];

let booksData = [
    {
        id: 1,
        title: '1984',
        author: 'George Orwell',
        category: 'siyasi',
        icon: '📘',
        description: 'Totalitar cəmiyyətdə nəzarət və azadlıq mövzuları.',
        summary: 'Dövlətin hər şeyi izlədiyi dünyada fərdin azadlıq axtarışı və həqiqətin manipulyasiyası təsvir olunur.',
        status: 'available'
    },
    {
        id: 2,
        title: 'Alkimyager',
        author: 'Paulo Coelho',
        category: 'fəlsəfə',
        icon: '📗',
        description: 'Arzuların arxasınca getmək haqqında motivasiya hekayəsi.',
        summary: 'Santiago öz xəzinəsini tapmaq üçün səfərə çıxır və yol boyunca öz məqsədini kəşf edir.',
        status: 'available'
    },
    {
        id: 3,
        title: 'Xəmsə',
        author: 'Nizami Gəncəvi',
        category: 'klassik',
        icon: '📙',
        description: 'Azərbaycan klassik ədəbiyyatının zirvəsi.',
        summary: 'Beş poemadan ibarət klassik toplusu; sevgi, ədalət və hikmət mövzularını işləyir.',
        status: 'available'
    },
    {
        id: 4,
        title: 'Qısa Zaman Tarixi',
        author: 'Stephen Hawking',
        category: 'elm',
        icon: '📕',
        description: 'Kainatın quruluşu və zamanın təbiəti.',
        summary: 'Böyük partlayış, qara dəliklər və kosmologiya haqqında aydın izahlar.',
        status: 'available'
    },
    {
        id: 5,
        title: 'Şərq Ekspressində Qətl',
        author: 'Agatha Christie',
        category: 'klassik',
        icon: '📓',
        description: 'Hercule Poirotun ən məşhur istintaqlarından biri.',
        summary: 'Qarlı dağlarda dayanan qatarda baş verən qətlin həlli üçün Poirot ipuclarını birləşdirir.',
        status: 'available'
    },
    {
        id: 6,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        category: 'elm',
        icon: '📘',
        description: 'İnsanlığın tarixi və inkişaf mərhələləri.',
        summary: 'İbtidai icmalardan müasir cəmiyyətə qədər insanın sosial və mədəni təkamülü izah olunur.',
        status: 'available'
    }
];

let currentBookCategory = 'all';
let currentBookSearch = '';
let currentBookId = null;

let currentOERTab = 'local';
let userPoints = 5000; // Dev Mode: Start with points for testing
let mentorAnswers = 0;

// Load assignments from API based on user's class
async function loadAssignmentsFromAPI() {
    if (!currentUser || !currentUser.class_id) return;

    try {
        // First, get the student's existing submissions
        let mySubmissions = [];
        try {
            const submissionsResponse = await fetch(`${API_BASE}/assignments/my-submissions`, {
                credentials: 'include'
            });
            if (submissionsResponse.ok) {
                mySubmissions = await submissionsResponse.json();
            }
        } catch (e) {
            console.warn('Could not load submissions:', e);
        }

        // Create a map of assignment_id to submission for quick lookup
        const submissionMap = new Map();
        mySubmissions.forEach(sub => {
            submissionMap.set(sub.assignment_id, sub);
        });

        const response = await fetch(`${API_BASE}/assignments/class/${currentUser.class_id}`, {
            credentials: 'include'
        });

        if (response.ok) {
            const apiAssignments = await response.json();

            // Convert API format to local format with correct status
            const formattedAssignments = apiAssignments.map(a => {
                const submission = submissionMap.get(a.id);
                let status = 'new';
                let submittedText = null;
                let submittedFile = null;
                let grade = null;
                let feedback = '';

                if (submission) {
                    submittedText = submission.content;
                    submittedFile = submission.file_path;
                    grade = submission.grade;
                    feedback = submission.feedback || '';

                    if (submission.status === 'graded' || submission.grade !== null) {
                        status = 'graded';
                    } else {
                        status = 'submitted';
                    }
                }

                return {
                    id: a.id,
                    title: a.title,
                    description: a.description,
                    status: status,
                    submittedFile: submittedFile,
                    submittedText: submittedText,
                    grade: grade,
                    feedback: feedback,
                    questions: [],
                    deadline: a.deadline,
                    class: currentUser.class_name || 'Sinif',
                    points: 50,
                    aiAnalysis: null,
                    sdg: a.sdg_goal,
                    lastReviewed: null
                };
            });

            // Replace assignments with API data (not merge, to avoid stale local data)
            // First remove any assignments that came from API (by checking if id exists in formattedAssignments)
            const apiIds = new Set(formattedAssignments.map(a => a.id));

            // Keep only local demo assignments that don't conflict with API
            const localAssignments = assignments.filter(a => !apiIds.has(a.id));

            // Set assignments to be API assignments + non-conflicting local ones
            assignments.length = 0;
            formattedAssignments.forEach(a => assignments.push(a));
            localAssignments.forEach(a => assignments.push(a));

            console.log('Loaded', formattedAssignments.length, 'assignments from API with submission status');
        }
    } catch (error) {
        console.error('Failed to load assignments from API:', error);
    }
}

// Load assignments from API for teacher
async function loadTeacherAssignmentsFromAPI() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE}/assignments/teacher`, {
            credentials: 'include'
        });

        if (!response.ok) {
            console.warn('Could not load teacher assignments:', response.status);
            return;
        }

        const apiAssignments = await response.json();
        const formattedAssignments = apiAssignments.map(a => {
            const className = document.querySelector(`#task-class option[value="${a.class_id}"]`)?.textContent || a.class_id;

            return {
                id: a.id,
                title: a.title,
                description: a.description,
                status: 'new',
                submittedFile: null,
                submittedText: null,
                grade: null,
                feedback: '',
                questions: [],
                deadline: a.deadline,
                class: className,
                points: 50,
                aiAnalysis: null,
                sdg: a.sdg_goal,
                lastReviewed: null
            };
        });

        assignments.length = 0;
        formattedAssignments.forEach(a => assignments.push(a));
        console.log('Loaded', formattedAssignments.length, 'teacher assignments from API');
    } catch (error) {
        console.error('Failed to load teacher assignments from API:', error);
    }
}

// --- DATA ISOLATION & STORAGE ---
function loadUserData() {
    if (!currentUser) return;

    // XP & Level
    const storedXP = parseInt(localStorage.getItem(`userXP_${currentUser.id}`) || '1250');
    const storedPoints = parseInt(localStorage.getItem(`userPoints_${currentUser.id}`) || '150');
    const storedLevel = parseInt(localStorage.getItem(`userLevel_${currentUser.id}`) || '1');
    const serverXP = Number.isFinite(Number(currentUser.xp)) ? Number(currentUser.xp) : null;
    const serverPoints = Number.isFinite(Number(currentUser.points)) ? Number(currentUser.points) : null;
    const serverLevel = Number.isFinite(Number(currentUser.level)) ? Number(currentUser.level) : null;

    userXP = serverXP !== null ? serverXP : storedXP;
    userPoints = serverPoints !== null ? serverPoints : storedPoints;
    userLevel = serverLevel !== null ? serverLevel : storedLevel;

    if (serverXP !== null) {
        localStorage.setItem(`userXP_${currentUser.id}`, userXP.toString());
    }
    if (serverPoints !== null) {
        localStorage.setItem(`userPoints_${currentUser.id}`, userPoints.toString());
    }
    if (serverLevel !== null) {
        localStorage.setItem(`userLevel_${currentUser.id}`, userLevel.toString());
    }

    // Badges (Merge with default structure to get new badges if added)
    const savedBadges = JSON.parse(localStorage.getItem(`badges_${currentUser.id}`) || 'null');
    if (savedBadges) {
        badges.forEach(b => {
            const saved = savedBadges.find(sb => sb.id === b.id);
            if (saved) b.earned = saved.earned;
        });
    }

    // Notifications
    notifications = JSON.parse(localStorage.getItem(`notifications_${currentUser.id}`) || JSON.stringify([
        { id: 1, message: 'Salam! EduTask-a xoş gəldiniz.', timestamp: new Date(), read: false, type: 'info' }
    ])); // Default notification for new user

    // Inventory
    if (typeof userInventory !== 'undefined') { // Check if defined
        const savedInventory = JSON.parse(localStorage.getItem(`userInventory_${currentUser.id}`) || '[]');
        userInventory.length = 0;
        if (Array.isArray(savedInventory)) {
            if (savedInventory.length > 0 && typeof savedInventory[0] === 'object') {
                savedInventory.forEach(item => {
                    const id = Number(item && item.id);
                    if (Number.isFinite(id)) userInventory.push(id);
                });
            } else {
                savedInventory.forEach(id => {
                    const numericId = Number(id);
                    if (Number.isFinite(numericId)) userInventory.push(numericId);
                });
            }
        }
    }

    const savedEquipped = JSON.parse(localStorage.getItem(`equippedItems_${currentUser.id}`) || 'null');
    if (savedEquipped && typeof savedEquipped === 'object' && typeof equippedItems !== 'undefined') {
        Object.keys(equippedItems).forEach(slot => {
            const storedValue = savedEquipped[slot];
            equippedItems[slot] = Number.isFinite(Number(storedValue)) ? Number(storedValue) : null;
        });
    }

    updateLeaderboard();
}

function saveUserData() {
    if (!currentUser) return;
    localStorage.setItem(`userXP_${currentUser.id}`, userXP);
    localStorage.setItem(`userPoints_${currentUser.id}`, userPoints);
    localStorage.setItem(`userLevel_${currentUser.id}`, userLevel);
    localStorage.setItem(`badges_${currentUser.id}`, JSON.stringify(badges));
    localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(notifications));
    if (typeof userInventory !== 'undefined') {
        localStorage.setItem(`userInventory_${currentUser.id}`, JSON.stringify(userInventory));
    }
    if (typeof equippedItems !== 'undefined') {
        localStorage.setItem(`equippedItems_${currentUser.id}`, JSON.stringify(equippedItems));
    }
}

// ========================================
// QUEST BOARD
// ========================================
const questPool = [
    {
        id: 'xp-boost',
        title: 'XP Partlayışı',
        description: 'Bugün 200 XP topla.',
        icon: '⚡',
        metric: 'xp',
        target: 200
    },
    {
        id: 'points-sprint',
        title: 'Xal Sprinti',
        description: '50 xal yığ və yeni səviyyə aç.',
        icon: '🏆',
        metric: 'points',
        target: 50
    },
    {
        id: 'streak-guard',
        title: 'Streak Qoruyucusu',
        description: '3 günlük seriyanı qoruyub saxla.',
        icon: '🔥',
        metric: 'streak',
        target: 3
    },
    {
        id: 'daily-check',
        title: 'Günlük Start',
        description: 'Bu gün EduTask-a daxil ol.',
        icon: '✅',
        metric: 'login',
        target: 1
    },
    {
        id: 'focus-charge',
        title: 'Fokus Enerjisi',
        description: 'Pomodoro taymerini 1 dəfə işlət.',
        icon: '⏱️',
        metric: 'pomodoro',
        target: 1
    }
];

function getDailyQuestKey() {
    if (!currentUser) return null;
    return `dailyQuests_${currentUser.id}`;
}

function hashSeed(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = ((hash << 5) - hash) + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function getDailyQuests() {
    if (!currentUser) return [];
    const todayKey = new Date().toISOString().slice(0, 10);
    const storageKey = getDailyQuestKey();
    const stored = storageKey ? JSON.parse(localStorage.getItem(storageKey) || 'null') : null;

    if (stored && stored.date === todayKey) {
        return stored.quests.map(id => questPool.find(q => q.id === id)).filter(Boolean);
    }

    const seed = `${todayKey}-${currentUser.id}`;
    const shuffled = [...questPool].sort((a, b) => hashSeed(seed + a.id) - hashSeed(seed + b.id));
    const selected = shuffled.slice(0, 3).map(q => q.id);

    if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify({ date: todayKey, quests: selected }));
    }

    return selected.map(id => questPool.find(q => q.id === id)).filter(Boolean);
}

function getQuestProgress(quest) {
    if (!currentUser) return { current: 0, target: quest.target };
    if (typeof loadUserStreak === 'function') loadUserStreak();

    switch (quest.metric) {
        case 'xp':
            return { current: Math.min(userXP, quest.target), target: quest.target };
        case 'points':
            return { current: Math.min(userPoints, quest.target), target: quest.target };
        case 'streak':
            return { current: Math.min(userStreak, quest.target), target: quest.target };
        case 'login': {
            const today = new Date().toDateString();
            const loggedIn = lastStreakDate === today ? 1 : 0;
            return { current: loggedIn, target: quest.target };
        }
        case 'pomodoro': {
            const sessionKey = `pomodoroSessions_${currentUser.id}`;
            const dateKey = `pomodoroSessionsDate_${currentUser.id}`;
            const todayKey = new Date().toISOString().slice(0, 10);
            const storedDate = localStorage.getItem(dateKey);
            if (storedDate !== todayKey) {
                localStorage.setItem(dateKey, todayKey);
                localStorage.setItem(sessionKey, '0');
            }
            const sessions = parseInt(localStorage.getItem(sessionKey) || '0');
            return { current: Math.min(sessions, quest.target), target: quest.target };
        }
        default:
            return { current: 0, target: quest.target };
    }
}

function renderQuestBoard() {
    const container = document.getElementById('quest-grid');
    if (!container || !currentUser || currentUserRole !== 'student') return;

    const quests = getDailyQuests();
    if (quests.length === 0) {
        container.innerHTML = '<div class="quest-card"><div class="quest-card-content">Yeni macəralar tezliklə gələcək.</div></div>';
        return;
    }

    container.innerHTML = quests.map(quest => {
        const progress = getQuestProgress(quest);
        const percent = Math.min(100, Math.round((progress.current / quest.target) * 100));
        return `
            <div class="quest-card">
                <div class="quest-card-content">
                    <div class="quest-icon">${quest.icon}</div>
                    <h3 class="quest-title">${quest.title}</h3>
                    <p class="quest-desc">${quest.description}</p>
                    <div class="quest-progress">
                        <span>${progress.current}/${quest.target}</span>
                        <span>${percent}%</span>
                    </div>
                    <div class="quest-progress-bar">
                        <div class="quest-progress-fill" style="width:${percent}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// --- NOTIFICATION SYSTEM ---
function updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    if (!badge) return;

    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function toggleNotifications() {
    const dropdown = document.getElementById('notification-dropdown');
    if (!dropdown) return;

    if (dropdown.classList.contains('hidden')) {
        renderNotifications();
        dropdown.classList.remove('hidden');
    } else {
        dropdown.classList.add('hidden');
    }
}

function renderNotifications() {
    const container = document.getElementById('notification-list'); // Assuming this ID exists inside dropdown
    if (!container) return; // Need to create structure if missing?

    // Check if dropdown has list container, if not create it
    const dropdown = document.getElementById('notification-dropdown');
    if (!dropdown.querySelector('#notification-list')) {
        dropdown.innerHTML = `
            <div style="padding:10px; border-bottom:1px solid #eee; font-weight:bold;">Bildirişlər</div>
            <div id="notification-list" style="max-height:300px; overflow-y:auto;"></div>
            <div style="padding:10px; text-align:center; border-top:1px solid #eee;">
                <button onclick="markAllNotificationsRead()" style="background:none; border:none; color:var(--primary-color); cursor:pointer;">Hamısını oxunmuş et</button>
            </div>
        `;
    }

    const listContainer = document.getElementById('notification-list');
    listContainer.innerHTML = '';

    if (notifications.length === 0) {
        listContainer.innerHTML = '<div style="padding:20px; text-align:center; color:#999;">Bildiriş yoxdur</div>';
        return;
    }

    // Sort by newest
    const sortedDetails = [...notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedDetails.forEach(n => {
        listContainer.innerHTML += `
            <div class="notification-item ${n.read ? 'read' : 'unread'}" style="padding:10px; border-bottom:1px solid #f0f0f0; background:${n.read ? '#fff' : '#f0f7ff'};">
                <div style="font-size:0.9em;">${n.message}</div>
                <div style="font-size:0.75em; color:#888; margin-top:5px;">${new Date(n.timestamp).toLocaleString('az-AZ')}</div>
            </div>
        `;
    });
}

function markAllNotificationsRead() {
    notifications.forEach(n => n.read = true);
    saveUserData();
    updateNotificationBadge();
    renderNotifications();
}

function addNotification(message, type = 'info') {
    notifications.push({
        id: Date.now(),
        message: message,
        timestamp: new Date(),
        read: false,
        type: type
    });
    saveUserData();
    updateNotificationBadge();
    showToast('Yeni bildiriş: ' + message, 'info');
}

// ========================================
// STREAK SYSTEM
// ========================================
let userStreak = 0;
let lastStreakDate = null;

function loadUserStreak() {
    if (!currentUser) return;
    userStreak = parseInt(localStorage.getItem(`eduTaskStreak_${currentUser.id}`) || '0');
    lastStreakDate = localStorage.getItem(`eduTaskLastStreakDate_${currentUser.id}`) || null;
}

function checkStreak() {
    if (!currentUser) return;
    loadUserStreak(); // Ensure we have the latest for this user

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastStreakDate === today) {
        // Already logged today
        return;
    } else if (lastStreakDate === yesterday) {
        // Streak continues! Increment
        userStreak++;
        lastStreakDate = today;
        saveStreak();
        updateStreakDisplay();

        if (userStreak >= 7) {
            showToast('🔥 ' + userStreak + ' günlük seriya! Möhtəşəm!', 'success');
        }
    } else if (lastStreakDate !== null) {
        // Streak broken
        if (userStreak > 0) {
            showToast('😢 Seriya qırıldı! Yenidən başla!', 'warning');
            if (typeof ediSystem !== 'undefined' && ediSystem.onStreakRisk) {
                ediSystem.speak("Streak qırıldı... Amma yenidən başlamaq hər zaman mümkündür.", 'worried');
            }
        }
        userStreak = 1;
        lastStreakDate = today;
        saveStreak();
        updateStreakDisplay();
    } else {
        // First time user
        userStreak = 1;
        lastStreakDate = today;
        saveStreak();
        updateStreakDisplay();
    }
}

function recordDailyActivity() {
    if (!currentUser) return;
    loadUserStreak();

    const today = new Date().toDateString();

    if (lastStreakDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (lastStreakDate === yesterday) {
            userStreak++;
        } else {
            userStreak = 1;
        }

        lastStreakDate = today;
        saveStreak();
        updateStreakDisplay();

        if (userStreak > 1) {
            showToast('🔥 Günlük seriya: ' + userStreak + ' gün!', 'success');
            triggerConfetti();
        }
    }
}

function saveStreak() {
    if (!currentUser) return;
    localStorage.setItem(`eduTaskStreak_${currentUser.id}`, userStreak.toString());
    localStorage.setItem(`eduTaskLastStreakDate_${currentUser.id}`, lastStreakDate);
}

function updateStreakDisplay() {
    const streakContainer = document.getElementById('streak-container');
    const streakCount = document.getElementById('streak-count');

    if (streakContainer && streakCount) {
        streakContainer.classList.remove('hidden');
        streakCount.textContent = userStreak;

        // Add fire animation for high streaks
        if (userStreak >= 7) {
            streakContainer.classList.add('streak-fire');
        } else {
            streakContainer.classList.remove('streak-fire');
        }
    }
}

function checkStreakRisk() {
    // Check if user might lose streak (call at 20:00 or so)
    const today = new Date().toDateString();

    if (lastStreakDate !== today && userStreak > 0) {
        if (typeof ediSystem !== 'undefined' && ediSystem.onStreakRisk) {
            ediSystem.onStreakRisk();
        }
    }
}

// Check streak every hour
setInterval(checkStreakRisk, 3600000);

let badges = [
    { id: 1, name: 'Sürətli Təhvil', description: 'İlk tapşırığı vaxtında təhvil ver', icon: '⚡', earned: true, certificationId: 'CERT-001', points: 10 },
    { id: 2, name: 'Zəhmətkeş Arı', description: '5 tapşırığı ardıcıl təhvil ver', icon: '🐝', earned: false, certificationId: 'CERT-002', points: 25 },
    { id: 3, name: 'Həftənin Ulduzu', description: 'Həftənin ən yüksək xalını topla', icon: '⭐', earned: true, certificationId: 'CERT-003', points: 30 },
    { id: 4, name: 'Mükəmməl Qiymət', description: 'Ardıcıl 3 tapşırıqdan 5 al', icon: '🏆', earned: false, certificationId: 'CERT-004', points: 50 },
    { id: 5, name: 'Mentor I', description: '5 sual cavablandır', icon: '🎓', earned: false, certificationId: 'CERT-005', points: 20 },
    { id: 6, name: 'Mentor II', description: '20 sual cavablandır', icon: '👨‍🏫', earned: false, certificationId: 'CERT-006', points: 40 },
    { id: 7, name: 'Mentor III', description: '40 sual cavablandır', icon: '🧙‍♂️', earned: false, certificationId: 'CERT-007', points: 60 },
    { id: 8, name: 'Mentor IV', description: '60 sual cavablandır', icon: '🦉', earned: false, certificationId: 'CERT-008', points: 80 },
    { id: 9, name: 'Mentor V', description: '80 sual cavablandır', icon: '🌟', earned: false, certificationId: 'CERT-009', points: 100 },
    { id: 10, name: 'Kvadrat Tənlik Ustası I', description: 'Riyaziyyat tapşırığını tamamla', icon: '🔢', earned: false, certificationId: 'CERT-010', points: 15 },
    { id: 11, name: 'Tarix Bilicisi I', description: 'Tarix tapşırığını tamamla', icon: '📜', earned: true, certificationId: 'CERT-011', points: 15 },
    { id: 12, name: 'Ədəbiyyat Həvəskarı I', description: 'Ədəbiyyat tapşırığını tamamla', icon: '📚', earned: true, certificationId: 'CERT-012', points: 15 }
];

// Mythic Shop Timer System (uses new shopItems from shop section)
let mythicShopEndTime = null;
let mythicShopActive = false;

// ========================================
// SECRET ACHIEVEMENTS SYSTEM
// Hidden badges discovered through special behaviors
// ========================================

let secretAchievements = [
    {
        id: 'night-owl',
        name: 'Night Owl 🦉',
        description: 'Gecə saatlarında (00:00-04:00) 5 gün ardıcıl tapşırıq tamamladınız',
        icon: '🦉',
        trigger: 'nightActivity',
        earned: false,
        earnedDate: null,
        ediMessage: 'Sən gizli bir kəşf etdin! Gecə saatlarında çalışmaq... çox az adam bunu bacarır. 🌙',
        rarity: 'epic',
        bonusPoints: 75
    },
    {
        id: 'comeback-kid',
        name: 'Comeback Kid 🔥',
        description: '7 gün ərzində aktiv olmadınız, amma geri qayıdıb streak qırmadınız',
        icon: '🔥',
        trigger: 'comebackStreak',
        earned: false,
        earnedDate: null,
        ediMessage: 'Vay! Sən geri qayıtdın və streak-i qorudun. Bu çox nadir hallarda baş verir... 💪',
        rarity: 'legendary',
        bonusPoints: 100
    },
    {
        id: 'explain-master',
        name: 'Explain Master 🧠',
        description: '3 dəfə sinif yoldaşlarına izah edib XP qazandınız',
        icon: '🧠',
        trigger: 'explainToOthers',
        earned: false,
        earnedDate: null,
        ediMessage: 'İzah etmək - ən yaxşı öyrənmə yoludur. Sən bunu mənimsəmisən! 🎓',
        rarity: 'rare',
        bonusPoints: 50
    },
    {
        id: 'no-help-needed',
        name: 'No Help Needed 🤐',
        description: 'AI köməyi almadan 10 çətin tapşırıq tamamladınız',
        icon: '🤐',
        trigger: 'noAIHelp',
        earned: false,
        earnedDate: null,
        ediMessage: 'Sən köməksiz bacardın! Bu çox güclü göstəricidir. Müstəqilliyin zirvəsidir! 💎',
        rarity: 'epic',
        bonusPoints: 75
    },
    {
        id: 'curious-fox',
        name: 'Curious Fox 🦊',
        description: 'EduBot ilə 50-dən çox sual-cavab etdiniz',
        icon: '🦊',
        trigger: 'edubotQuestions',
        earned: false,
        earnedDate: null,
        ediMessage: 'Maraq - biliyin açarıdır! Sən həqiqi bir kəşfiyyatçısan! 🔍',
        rarity: 'rare',
        bonusPoints: 50
    },
    {
        id: 'perfectionist',
        name: 'Perfectionist 🎯',
        description: 'Bir testdə 100% nəticə + heç bir ipucu istifadə etmədən',
        icon: '🎯',
        trigger: 'perfectTest',
        earned: false,
        earnedDate: null,
        ediMessage: 'Mükəmməllik... Bu çox nadir haldır. Sən bunu bacardın! 👑',
        rarity: 'legendary',
        bonusPoints: 100
    },
    {
        id: 'silent-grinder',
        name: 'Silent Grinder 😶',
        description: 'Chat istifadə etmədən 1 həftə tam aktivlik göstərdiniz',
        icon: '😶',
        trigger: 'silentWeek',
        earned: false,
        earnedDate: null,
        ediMessage: 'Səssiz işləyən... amma güclü nəticələr! Fokus ustasısan! 🧘',
        rarity: 'epic',
        bonusPoints: 75
    },
    {
        id: 'explorer',
        name: 'Explorer 🗺️',
        description: 'Platformadakı bütün modullara daxil olan ilk 1% istifadəçidən birisiniz',
        icon: '🗺️',
        trigger: 'allModules',
        earned: false,
        earnedDate: null,
        ediMessage: 'Sən hər yeri kəşf etdin! Həqiqi bir kəşfiyyatçısan! 🌟',
        rarity: 'mythic',
        bonusPoints: 200
    },
    {
        id: 'phoenix',
        name: 'Phoenix 🔥',
        description: 'Streak itirdiniz, amma 3 gün içində yenidən maksimum fokusla geri döndünüz',
        icon: '🔥',
        trigger: 'phoenixRise',
        earned: false,
        earnedDate: null,
        ediMessage: 'Külündən yenidən doğuldun! Bu ruh gücü çox dəyərlidir! 🌅',
        rarity: 'rare',
        bonusPoints: 50
    },
    {
        id: 'legend',
        name: 'Legend 👑',
        description: '3 fərqli Secret Achievement açan ilk istifadəçilərdən birisiniz',
        icon: '👑',
        trigger: 'threeSecrets',
        earned: false,
        earnedDate: null,
        ediMessage: 'SƏN ƏFSANƏ OLDUN! Bunu çox az adam bacarır... Təbrik edirəm! 🏆',
        rarity: 'mythic',
        bonusPoints: 200
    }
];

// Secret Achievement Tracking Functions
function getSecretTrackingData() {
    if (!currentUser) return {};
    const key = `secretTracking_${currentUser.id}`;
    return JSON.parse(localStorage.getItem(key) || '{}');
}

function saveSecretTrackingData(data) {
    if (!currentUser) return;
    const key = `secretTracking_${currentUser.id}`;
    localStorage.setItem(key, JSON.stringify(data));
}

function loadSecretAchievements() {
    if (!currentUser) return;
    const key = `secretAchievements_${currentUser.id}`;
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if (saved) {
        secretAchievements.forEach(sa => {
            const savedItem = saved.find(s => s.id === sa.id);
            if (savedItem) {
                sa.earned = savedItem.earned;
                sa.earnedDate = savedItem.earnedDate;
            }
        });
    }
}

function saveSecretAchievements() {
    if (!currentUser) return;
    const key = `secretAchievements_${currentUser.id}`;
    localStorage.setItem(key, JSON.stringify(secretAchievements.map(sa => ({
        id: sa.id,
        earned: sa.earned,
        earnedDate: sa.earnedDate
    }))));
}

// Check all secret achievement triggers
function checkSecretAchievements() {
    if (!currentUser || currentUserRole !== 'student') return;

    checkNightOwl();
    checkComebackKid();
    checkCuriousFox();
    checkExplorer();
    checkPhoenix();
    checkLegend();
}

// Night Owl - Late night activity tracking (00:00-04:00)
function checkNightOwl() {
    const achievement = secretAchievements.find(a => a.id === 'night-owl');
    if (achievement.earned) return;

    const hour = new Date().getHours();
    if (hour >= 4) return; // Only check between 00:00-03:59

    const tracking = getSecretTrackingData();
    const today = new Date().toDateString();

    if (!tracking.nightOwl) tracking.nightOwl = { days: [], lastDate: null };

    if (tracking.nightOwl.lastDate !== today) {
        tracking.nightOwl.days.push(today);
        tracking.nightOwl.lastDate = today;

        // Keep only last 5 days
        if (tracking.nightOwl.days.length > 5) {
            tracking.nightOwl.days = tracking.nightOwl.days.slice(-5);
        }

        // Check for 5 consecutive days
        if (tracking.nightOwl.days.length >= 5) {
            unlockSecretAchievement('night-owl');
        }

        saveSecretTrackingData(tracking);
    }
}

// Comeback Kid - Return after 7 days of inactivity
function checkComebackKid() {
    const achievement = secretAchievements.find(a => a.id === 'comeback-kid');
    if (achievement.earned) return;

    const tracking = getSecretTrackingData();
    const today = new Date();

    if (tracking.lastActiveDate) {
        const lastActive = new Date(tracking.lastActiveDate);
        const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

        // If 7+ days inactive and came back with streak intact
        if (daysDiff >= 7 && userStreak > 0) {
            unlockSecretAchievement('comeback-kid');
        }
    }

    tracking.lastActiveDate = today.toISOString();
    saveSecretTrackingData(tracking);
}

// Curious Fox - 50+ EduBot questions
function checkCuriousFox() {
    const achievement = secretAchievements.find(a => a.id === 'curious-fox');
    if (achievement.earned) return;

    const tracking = getSecretTrackingData();
    if ((tracking.edubotQuestions || 0) >= 50) {
        unlockSecretAchievement('curious-fox');
    }
}

// Track EduBot question (call this when user asks EduBot)
function trackEdubotQuestion() {
    if (!currentUser || currentUserRole !== 'student') return;

    const tracking = getSecretTrackingData();
    tracking.edubotQuestions = (tracking.edubotQuestions || 0) + 1;
    saveSecretTrackingData(tracking);

    checkCuriousFox();
}

// Perfectionist - 100% test without hints
function trackPerfectTest(score, totalQuestions, usedHints) {
    if (!currentUser || currentUserRole !== 'student') return;

    const achievement = secretAchievements.find(a => a.id === 'perfectionist');
    if (achievement.earned) return;

    if (score === totalQuestions && !usedHints) {
        unlockSecretAchievement('perfectionist');
    }
}

// Silent Grinder - 1 week active without chat
function trackChatUsage() {
    if (!currentUser || currentUserRole !== 'student') return;

    const tracking = getSecretTrackingData();
    tracking.lastChatDate = new Date().toISOString();
    saveSecretTrackingData(tracking);
}

function checkSilentGrinder() {
    const achievement = secretAchievements.find(a => a.id === 'silent-grinder');
    if (achievement.earned) return;

    const tracking = getSecretTrackingData();
    if (!tracking.lastChatDate && tracking.activeDaysWithoutChat >= 7) {
        unlockSecretAchievement('silent-grinder');
    }
}

// Explorer - Visit all modules
function trackModuleVisit(moduleName) {
    if (!currentUser || currentUserRole !== 'student') return;

    const tracking = getSecretTrackingData();
    if (!tracking.visitedModules) tracking.visitedModules = [];

    if (!tracking.visitedModules.includes(moduleName)) {
        tracking.visitedModules.push(moduleName);
        saveSecretTrackingData(tracking);
        checkExplorer();
    }
}

const allModules = [
    'main', 'resources', 'books', 'points', 'leaderboard',
    'class-wall', 'class-management', 'quiz', 'self-test',
    'shop', 'skills', 'recommendations', 'edubot', 'news',
    'friends', 'competitions', 'chat'
];

function checkExplorer() {
    const achievement = secretAchievements.find(a => a.id === 'explorer');
    if (achievement.earned) return;

    const tracking = getSecretTrackingData();
    const visited = tracking.visitedModules || [];

    if (allModules.every(m => visited.includes(m))) {
        unlockSecretAchievement('explorer');
    }
}

// Phoenix - Recover from lost streak within 3 days
function trackStreakLoss() {
    if (!currentUser || currentUserRole !== 'student') return;

    const tracking = getSecretTrackingData();
    tracking.streakLostDate = new Date().toISOString();
    tracking.streakWhenLost = userStreak;
    saveSecretTrackingData(tracking);
}

function checkPhoenix() {
    const achievement = secretAchievements.find(a => a.id === 'phoenix');
    if (achievement.earned) return;

    const tracking = getSecretTrackingData();
    if (tracking.streakLostDate) {
        const lostDate = new Date(tracking.streakLostDate);
        const now = new Date();
        const daysSinceLoss = Math.floor((now - lostDate) / (1000 * 60 * 60 * 24));

        // If rebuilt streak within 3 days and streak is now >= 3
        if (daysSinceLoss <= 3 && userStreak >= 3) {
            unlockSecretAchievement('phoenix');
            tracking.streakLostDate = null;
            saveSecretTrackingData(tracking);
        }
    }
}

// Legend - Earn 3 different secret achievements
function checkLegend() {
    const achievement = secretAchievements.find(a => a.id === 'legend');
    if (achievement.earned) return;

    const earnedCount = secretAchievements.filter(a => a.earned && a.id !== 'legend').length;
    if (earnedCount >= 3) {
        unlockSecretAchievement('legend');
    }
}

// No Help Needed - Track AI help usage
function trackTaskWithoutAI() {
    if (!currentUser || currentUserRole !== 'student') return;

    const tracking = getSecretTrackingData();
    tracking.tasksWithoutAI = (tracking.tasksWithoutAI || 0) + 1;
    saveSecretTrackingData(tracking);

    const achievement = secretAchievements.find(a => a.id === 'no-help-needed');
    if (!achievement.earned && tracking.tasksWithoutAI >= 10) {
        unlockSecretAchievement('no-help-needed');
    }
}

// Main unlock function
function unlockSecretAchievement(achievementId) {
    const achievement = secretAchievements.find(a => a.id === achievementId);
    if (!achievement || achievement.earned) return;

    // Mark as earned
    achievement.earned = true;
    achievement.earnedDate = new Date().toISOString();

    // Save to localStorage
    saveSecretAchievements();

    // Show dramatic reveal
    showSecretAchievementReveal(achievement);

    // Award bonus points
    userPoints += achievement.bonusPoints;
    saveUserData();

    // Add notification
    addNotification(`🕵️ Gizli achievment kəşf etdiniz: ${achievement.name}!`, 'achievement');

    // Check for Legend achievement
    if (achievementId !== 'legend') {
        checkLegend();
    }
}

// Secret Achievement Reveal UI
function showSecretAchievementReveal(achievement) {
    // Create dramatic reveal modal
    const modal = document.createElement('div');
    modal.className = 'secret-reveal-modal';
    modal.id = 'secret-reveal-modal';
    modal.innerHTML = `
        <div class="secret-reveal-content ${achievement.rarity}">
            <div class="secret-reveal-glow"></div>
            <div class="secret-reveal-icon">${achievement.icon}</div>
            <div class="secret-reveal-badge">🕵️ GİZLİ KƏŞF!</div>
            <h2 class="secret-reveal-title">${achievement.name}</h2>
            <p class="secret-reveal-desc">${achievement.description}</p>
            <div class="secret-reveal-edi">
                <div class="edi-avatar-placeholder">🦊</div>
                <div class="edi-bubble">"${achievement.ediMessage}"</div>
            </div>
            <div class="secret-reveal-rarity ${achievement.rarity}">
                ${achievement.rarity.toUpperCase()} BADGE · +${achievement.bonusPoints} XAL
            </div>
            <button onclick="closeSecretReveal()" class="secret-reveal-btn">
                Möhtəşəm! ✨
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Play reveal animation
    requestAnimationFrame(() => {
        modal.classList.add('visible');
        triggerSecretConfetti();
    });
}

function closeSecretReveal() {
    const modal = document.getElementById('secret-reveal-modal');
    if (modal) {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 500);
    }
}

function triggerSecretConfetti() {
    // Special golden confetti for secret achievements
    const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#A855F7', '#3B82F6'];
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'secret-confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 8 + 6) + 'px';
        confetti.style.height = confetti.style.width;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3500);
    }
}

// Get count of earned secret achievements (for display purposes if needed)
function getEarnedSecretAchievementsCount() {
    return secretAchievements.filter(a => a.earned).length;
}



let leaderboard = [
    { name: 'Ferid', points: 150, avatar: 0, class: '10F' },
    { name: 'Aysel', points: 130, avatar: 1, class: '10F' },
    { name: 'Rəşad', points: 120, avatar: 0, class: '10F' }
];

let wallPosts = [
    { id: 1, author: 'Ferid', content: 'Bu linkdə Səfəvilər haqqında əla məlumat var: https://example.com/safeviler', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), avatar: 0, isQuestion: false, answers: [] }
];

let classes = {
    '10A': [
        { name: 'Əli', avatar: 0, points: 95 },
        { name: 'Fatimə', avatar: 1, points: 110 }
    ],
    '10F': [
        { name: 'Ferid', avatar: 0, points: 150 },
        { name: 'Aysel', avatar: 1, points: 130 },
        { name: 'Rəşad', avatar: 0, points: 120 },
        { name: 'Ayaz', avatar: 0, points: 50 }
    ],
    '11A': [
        { name: 'Nigar', avatar: 1, points: 85 },
        { name: 'Tural', avatar: 0, points: 75 }
    ]
};

let quizzes = [
    {
        id: 1,
        title: 'Azərbaycan Tarixi - Səfəvilər',
        class: '10F',
        questions: [
            { question: 'Səfəvi dövləti hansı ildə qurulmuşdur?', type: 'multiple', options: ['1501', '1502', '1503', '1504'], correct: 0 },
            { question: 'Şah İsmayılın atasının adı nə idi?', type: 'multiple', options: ['Şeyx Həydar', 'Şeyx Səfi', 'Şah Təhmasib', 'Şah Abbas'], correct: 0 }
        ],
        completed: false,
        score: null
    }
];

let meetings = [];
let notifications = [
    { id: 1, message: 'Yeni tapşırıq əlavə edildi: Tarix', timestamp: new Date(Date.now() - 30 * 60 * 1000), read: false, type: 'assignment' },
    { id: 2, message: 'Ədəbiyyat tapşırığınız qiymətləndirildi', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: false, type: 'grade' }
];

// currentUserRole is already declared at line 62
let currentClass = '10A';
let selectedDifficulty = '';
let currentSelfTest = null;

// Olimpiada certificates
let certificates = [
    { id: 1, name: 'Riyaziyyat Olimpiadası', level: 'Rayon', year: 2024, position: 'I yer', icon: '🥇' },
    { id: 2, name: 'Tarix Olimpiadası', level: 'Şəhər', year: 2024, position: 'II yer', icon: '🥈' },
    { id: 3, name: 'Fizika Olimpiadası', level: 'Respublika', year: 2023, position: 'III yer', icon: '🥉' }
];

// Gamification Variables
let userXP = 1250; // Demo value
let userLevel = 1;
// userStreak is defined in STREAK SYSTEM section above
let lastLoginDate = localStorage.getItem('lastLoginDate');

// Pomodoro Variables
let pomodoroInterval;
let pomodoroTime = 25 * 60;
let isPomodoroActive = false;

// --- AVATAR MƏLUMATLARI VƏ FUNKSİYALARI ---
// Using image-based avatars (female on left, male on right from avatars.png)
const avatars = [
    // Male avatar (right half of image)
    `<div class="avatar-img" style="width:40px;height:40px;border-radius:50%;overflow:hidden;display:inline-block;">
        <img src="avatars.png" alt="Kişi" style="width:80px;height:40px;object-fit:cover;margin-left:-40px;">
    </div>`,
    // Female avatar (left half of image)
    `<div class="avatar-img" style="width:40px;height:40px;border-radius:50%;overflow:hidden;display:inline-block;">
        <img src="avatars.png" alt="Qadın" style="width:80px;height:40px;object-fit:cover;margin-left:0;">
    </div>`
];

let currentUserAvatar = avatars[0];

const welcomeIllustrations = {
    student: `<div class="illustration"><svg viewBox="0 0 200 150"><path d="M10,130 Q10,80 50,80 T90,80" fill="none" stroke="#fff" stroke-width="3"/><path d="M20,130 L80,130" stroke="#fff" stroke-width="3"/><rect x="40" y="60" width="20" height="20" fill="#ffc107"/><circle cx="150" cy="50" r="40" fill="rgba(255,255,255,0.1)"/><g transform="translate(130, 80)"><path d="M0,0 L40,0 L40,40 L0,40 Z" fill="#fff"/><path d="M5,5 L35,5" stroke="#a1adff" stroke-width="2"/><path d="M5,15 L35,15" stroke="#a1adff" stroke-width="2"/><path d="M5,25 L25,25" stroke="#a1adff" stroke-width="2"/></g></svg></div>`,
    teacher: `<div class="illustration"><svg viewBox="0 0 200 150"><rect x="10" y="30" width="120" height="90" rx="5" fill="#fff" /><path d="M15,40 L120,40" stroke="#a1adff" stroke-width="2"/><path d="M15,55 L120,55" stroke="#a1adff" stroke-width="2"/><path d="M15,70 L80,70" stroke="#a1adff" stroke-width="2"/><circle cx="160" cy="90" r="30" fill="#ffc107"/><path d="M150,85 L170,95 M170,85 L150,95" stroke="#fff" stroke-width="3"/></svg></div>`,
    admin: `<div class="illustration"><svg viewBox="0 0 200 150"><rect x="20" y="40" width="160" height="80" rx="8" fill="#fff"/><circle cx="60" cy="70" r="15" fill="#9c27b0"/><circle cx="100" cy="70" r="15" fill="#9c27b0"/><circle cx="140" cy="70" r="15" fill="#9c27b0"/><path d="M30,100 L170,100" stroke="#9c27b0" stroke-width="3"/><path d="M50,110 L150,110" stroke="#9c27b0" stroke-width="2"/></svg></div>`
};

// Google Gemini API Key
const API_KEY = 'AIzaSyBZOmor1ELOJdL7S6Pm5ci_TNPhSVIW7Eg';

// --- TOAST NOTIFICATION SYSTEM ---
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${getToastIcon(type)}</span>
                <span>${message}</span>
            </div>
        `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    return icons[type] || '✅';
}

// --- ACCESSIBILITY FUNCTIONS ---
function toggleContrast() {
    const toggle = document.getElementById('contrast-toggle');
    toggle.classList.toggle('active');
    body.classList.toggle('high-contrast');
}

function toggleFontSize() {
    const toggle = document.getElementById('font-toggle');
    toggle.classList.toggle('active');
    body.classList.toggle('large-font');
}

// --- E-PORTFOLIO FUNCTIONS ---
function openEPortfolioModal() {
    renderEPortfolio();
    eportfolioModal.classList.add('visible');
}

function closeEPortfolioModal() {
    eportfolioModal.classList.remove('visible');
}

function renderEPortfolio() {
    // Update portfolio stats
    document.getElementById('portfolio-points').textContent = userPoints;
    document.getElementById('portfolio-badges').textContent = badges.filter(b => b.earned).length;
    document.getElementById('portfolio-assignments').textContent = assignments.filter(a => a.status === 'submitted').length;
    document.getElementById('portfolio-average').textContent = calculateGradeAverage();

    // Set portfolio avatar
    document.getElementById('portfolio-avatar').innerHTML = currentUserAvatar;

    // Render certificates
    const certificatesContainer = document.getElementById('portfolio-certificates');
    certificatesContainer.innerHTML = '';

    if (certificates.length === 0) {
        certificatesContainer.innerHTML = '<p>Hələ olimpiada sertifikatı yoxdur.</p>';
    } else {
        certificates.forEach(cert => {
            certificatesContainer.innerHTML += `
                    <div class="achievement-item">
                        <h4>${cert.icon} ${cert.name}</h4>
                        <p><strong>Səviyyə:</strong> ${cert.level}</p>
                        <p><strong>İl:</strong> ${cert.year}</p>
                        <p><strong>Nəticə:</strong> ${cert.position}</p>
                    </div>
                `;
        });
    }

    // Render achievements
    const achievementsContainer = document.getElementById('portfolio-achievements');
    const earnedBadges = badges.filter(b => b.earned);

    achievementsContainer.innerHTML = '';
    earnedBadges.forEach(badge => {
        achievementsContainer.innerHTML += `
                <div class="achievement-item">
                    <h4>${badge.icon} ${badge.name}</h4>
                    <p>${badge.description}</p>
                    <small>Sertifikat ID: ${badge.certificationId}</small>
                </div>
            `;
    });
}

// --- INVENTORY FUNCTIONS ---
function renderProfileInventory() {
    const inventorySection = document.getElementById('inventory-section');

    if (currentUserRole !== 'student') {
        inventorySection.style.display = 'none';
        return;
    }

    inventorySection.style.display = 'block';
    inventoryGrid.innerHTML = '';

    const ownedItems = shopItems.filter(item => userInventory.includes(item.id));

    if (ownedItems.length === 0) {
        inventoryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">Hələ əşya almamısınız. Mağazadan əşya alın!</p>';
        return;
    }

    ownedItems.forEach(item => {
        const isEquipped = equippedItems[item.slot] === item.id;
        inventoryGrid.innerHTML += `
                <div class="inventory-item ${isEquipped ? 'equipped' : ''}" onclick="equipItem(${item.id})">
                    <div class="item-icon">${item.icon}</div>
                    <h5>${item.name}</h5>
                    <small>${isEquipped ? 'Taxılıb' : 'Tax'}</small>
                </div>
            `;
    });
}

function toggleEquipItem(itemId) {
    equipItem(itemId);
    renderProfileInventory();
}

// --- UTILITY FUNKSİYALARI ---
function formatTimeRemaining(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;

    if (diff <= 0) return { text: 'Vaxt bitib', class: 'urgent' };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 1) return { text: `${days} gün qalıb`, class: 'safe' };
    if (days === 1) return { text: `1 gün ${hours} saat qalıb`, class: 'warning' };
    if (hours > 0) return { text: `${hours} saat qalıb`, class: 'urgent' };

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { text: `${minutes} dəqiqə qalıb`, class: 'urgent' };
}

function calculateGradeAverage() {
    const gradedAssignments = assignments.filter(a => a.grade !== null);
    if (gradedAssignments.length === 0) return 0;
    const total = gradedAssignments.reduce((sum, a) => sum + a.grade, 0);
    return (total / gradedAssignments.length).toFixed(1);
}

function generateEduBotReport() {
    const gradeAverage = parseFloat(calculateGradeAverage());
    const submittedCount = assignments.filter(a => a.status === 'submitted').length;
    const lateSubmissions = assignments.filter(a => a.status === 'submitted' && new Date(a.deadline) < new Date()).length;

    let report = "";

    if (gradeAverage >= 4.5) {
        report += "Əla performans göstərirsən! ";
    } else if (gradeAverage >= 3.5) {
        report += "Yaxşı gedirsən, daha da yaxşı ola bilər! ";
    } else if (gradeAverage > 0) {
        report += "Çalışmalısan, potensialın var! ";
    }

    if (lateSubmissions > 0) {
        report += "Amma tapşırıqları son günə saxlama vərdişin var. ";
    } else {
        report += "Vaxtında təhvil vermə vərdişin əladır! ";
    }

    // Subject-specific feedback
    const mathGrades = assignments.filter(a => a.title.toLowerCase().includes('riyaziyyat') && a.grade).map(a => a.grade);
    const historyGrades = assignments.filter(a => a.title.toLowerCase().includes('tarix') && a.grade).map(a => a.grade);

    if (mathGrades.length > 0) {
        const mathAvg = mathGrades.reduce((a, b) => a + b) / mathGrades.length;
        if (mathAvg >= 4) {
            report += "Riyaziyyatda çox yaxşısan! ";
        } else {
            report += "Riyaziyyata daha çox diqqət yetir. ";
        }
    }

    if (historyGrades.length > 0) {
        const historyAvg = historyGrades.reduce((a, b) => a + b) / historyGrades.length;
        if (historyAvg >= 4) {
            report += "Tarixdə də əlasən! ";
        }
    }

    report += "Davam et, uğurların olacaq! 🚀";
    return report;
}

// --- FORGETTING CURVE IMPLEMENTATION ---
function calculateForgettingCurve() {
    const reviewReminders = [];
    const now = new Date();

    assignments.forEach(assignment => {
        if (assignment.status === 'submitted' && assignment.lastReviewed) {
            const lastReviewed = new Date(assignment.lastReviewed);
            const daysSinceReview = Math.floor((now - lastReviewed) / (1000 * 60 * 60 * 24));

            // Ebbinghaus forgetting curve intervals: 1, 3, 7, 14, 30 days
            let nextReviewDay = 1;
            if (daysSinceReview >= 30) nextReviewDay = 1; // Reset cycle
            else if (daysSinceReview >= 14) nextReviewDay = 30;
            else if (daysSinceReview >= 7) nextReviewDay = 14;
            else if (daysSinceReview >= 3) nextReviewDay = 7;
            else if (daysSinceReview >= 1) nextReviewDay = 3;

            const daysUntilReview = nextReviewDay - daysSinceReview;
            let urgency = 'ok';
            if (daysUntilReview <= 0) urgency = 'urgent';
            else if (daysUntilReview <= 2) urgency = 'soon';

            reviewReminders.push({
                subject: assignment.title,
                daysUntilReview: daysUntilReview,
                urgency: urgency
            });
        }
    });

    return reviewReminders.sort((a, b) => a.daysUntilReview - b.daysUntilReview);
}

function renderForgettingCurve() {
    const reviewReminders = calculateForgettingCurve();
    const reviewContainer = document.getElementById('review-reminders');

    if (reviewReminders.length === 0) {
        reviewContainer.innerHTML = '<p>Təkrarlama lazım olan mövzu yoxdur.</p>';
        return;
    }

    reviewContainer.innerHTML = '';
    reviewReminders.forEach(reminder => {
        const urgencyText = {
            urgent: 'İndi təkrarla!',
            soon: `${reminder.daysUntilReview} gün sonra`,
            ok: `${reminder.daysUntilReview} gün sonra`
        };

        reviewContainer.innerHTML += `
                <div class="review-item review-${reminder.urgency}">
                    <strong>${reminder.subject}</strong> - ${urgencyText[reminder.urgency]}
                </div>
            `;
    });
}

function awardPoints(points, reason) {
    userPoints += points;

    // XP and Level Logic
    userXP += points;
    const newLevel = Math.floor(userXP / 1000) + 1;
    if (newLevel > userLevel) {
        userLevel = newLevel;
        showToast(`Təbrik edirik! Səviyyə ${userLevel} oldunuz! 🎉`, 'success');
        addNotification(`Səviyyə ${userLevel}-ə yüksəldiniz!`, 'badge');
    }

    checkBadges();
    updateLeaderboard();
    addNotification(`+${points} xal qazandınız! Səbəb: ${reason}`, 'points');
    showToast(`+${points} xal qazandınız!`, 'success');
    saveUserData();
    if (typeof renderQuestBoard === 'function') renderQuestBoard();
}

function checkBadges() {
    const submittedCount = assignments.filter(a => a.status === 'submitted').length;
    const perfectGrades = assignments.filter(a => a.grade === 5).length;
    const mathCompleted = assignments.filter(a => a.title.toLowerCase().includes('riyaziyyat') && a.status === 'submitted').length;
    const historyCompleted = assignments.filter(a => a.title.toLowerCase().includes('tarix') && a.status === 'submitted').length;
    const literatureCompleted = assignments.filter(a => a.title.toLowerCase().includes('ədəbiyyat') && a.status === 'submitted').length;

    // Check existing badges
    if (submittedCount >= 1 && !badges[0].earned) {
        badges[0].earned = true;
        awardPoints(badges[0].points, 'Yeni nişan: Sürətli Təhvil');
        addNotification('🎉 Yeni nişan qazandınız: Sürətli Təhvil!', 'badge');
    }

    if (submittedCount >= 5 && !badges[1].earned) {
        badges[1].earned = true;
        awardPoints(badges[1].points, 'Yeni nişan: Zəhmətkeş Arı');
        addNotification('🎉 Yeni nişan qazandınız: Zəhmətkeş Arı!', 'badge');
    }

    if (perfectGrades >= 3 && !badges[3].earned) {
        badges[3].earned = true;
        awardPoints(badges[3].points, 'Yeni nişan: Mükəmməl Qiymət');
        addNotification('🎉 Yeni nişan qazandınız: Mükəmməl Qiymət!', 'badge');
    }

    // Check mentor badges
    if (mentorAnswers >= 5 && !badges[4].earned) {
        badges[4].earned = true;
        awardPoints(badges[4].points, 'Yeni nişan: Mentor I');
        addNotification('🎉 Yeni nişan qazandınız: Mentor I!', 'badge');
    }

    if (mentorAnswers >= 20 && !badges[5].earned) {
        badges[5].earned = true;
        awardPoints(badges[5].points, 'Yeni nişan: Mentor II');
        addNotification('🎉 Yeni nişan qazandınız: Mentor II!', 'badge');
    }

    if (mentorAnswers >= 40 && !badges[6].earned) {
        badges[6].earned = true;
        awardPoints(badges[6].points, 'Yeni nişan: Mentor III');
        addNotification('🎉 Yeni nişan qazandınız: Mentor III!', 'badge');
    }

    if (mentorAnswers >= 60 && !badges[7].earned) {
        badges[7].earned = true;
        awardPoints(badges[7].points, 'Yeni nişan: Mentor IV');
        addNotification('🎉 Yeni nişan qazandınız: Mentor IV!', 'badge');
    }

    if (mentorAnswers >= 80 && !badges[8].earned) {
        badges[8].earned = true;
        awardPoints(badges[8].points, 'Yeni nişan: Mentor V');
        addNotification('🎉 Yeni nişan qazandınız: Mentor V!', 'badge');
    }

    // Subject-specific badges
    if (mathCompleted >= 1 && !badges[9].earned) {
        badges[9].earned = true;
        awardPoints(badges[9].points, 'Yeni nişan: Kvadrat Tənlik Ustası I');
        addNotification('🎉 Yeni nişan qazandınız: Kvadrat Tənlik Ustası I!', 'badge');
    }

    if (historyCompleted >= 1 && !badges[10].earned) {
        badges[10].earned = true;
        awardPoints(badges[10].points, 'Yeni nişan: Tarix Bilicisi I');
        addNotification('🎉 Yeni nişan qazandınız: Tarix Bilicisi I!', 'badge');
    }

    if (literatureCompleted >= 1 && !badges[11].earned) {
        badges[11].earned = true;
        awardPoints(badges[11].points, 'Yeni nişan: Ədəbiyyat Həvəskarı I');
        addNotification('🎉 Yeni nişan qazandınız: Ədəbiyyat Həvəskarı I!', 'badge');
    }
}

function updateLeaderboard() {
    if (!currentUser) return;
    const displayName = currentUser.full_name || currentUser.username || currentUsername;
    if (!displayName) return;

    const classLabel = currentUser.class_name
        || (currentUser.class_id === 1 ? '10F' : currentUser.class_id === 2 ? '11A' : currentUser.class_id ? '10A' : '');
    const avatarIndex = Number.isInteger(currentUser.avatar) ? currentUser.avatar : 0;
    const userIndex = leaderboard.findIndex(u => (u.name || '').toLowerCase() === displayName.toLowerCase());

    if (userIndex === -1) {
        leaderboard.push({
            name: displayName,
            points: userPoints,
            avatar: avatarIndex,
            class: classLabel
        });
    } else {
        leaderboard[userIndex] = {
            ...leaderboard[userIndex],
            name: displayName,
            points: userPoints,
            avatar: avatarIndex,
            class: classLabel || leaderboard[userIndex].class
        };
    }

    leaderboard.sort((a, b) => b.points - a.points);
}

// ========================================
// CHEST SYSTEM - Sandıqlar
// ========================================

// Chest Data Structure
const chestTypes = {
    basic: {
        id: 'basic',
        name: 'Basic Sandıq',
        icon: '📦',
        price: 100,
        color: '#22C55E',
        limit: Infinity,
        period: null,
        animDuration: 0.4,
        drops: { common: 80, rare: 17, epic: 2.8, legendary: 0.19, mythic: 0.01 }
    },
    advanced: {
        id: 'advanced',
        name: 'Advanced Sandıq',
        icon: '🎁',
        price: 350,
        color: '#3B82F6',
        limit: 3,
        period: 'day',
        animDuration: 0.6,
        drops: { common: 70, rare: 22, epic: 7, legendary: 0.9, mythic: 0.1 }
    },
    elite: {
        id: 'elite',
        name: 'Elite Sandıq',
        icon: '💜',
        price: 900,
        color: '#8B5CF6',
        limit: 1,
        period: 'day',
        animDuration: 0.9,
        drops: { common: 55, rare: 30, epic: 12, legendary: 2.5, mythic: 0.5 }
    },
    master: {
        id: 'master',
        name: 'Master Sandıq',
        icon: '👑',
        price: 2500,
        color: '#F59E0B',
        limit: 1,
        period: 'week',
        animDuration: 1.2,
        drops: { common: 35, rare: 35, epic: 22, legendary: 7, mythic: 1 }
    },
    ascended: {
        id: 'ascended',
        name: 'Ascended Sandıq',
        icon: '🔮',
        price: null, // Not for sale
        color: '#EF4444',
        limit: 0,
        period: null,
        animDuration: 1.8,
        drops: { common: 10, rare: 25, epic: 40, legendary: 20, mythic: 5 }
    }
};

// Possible rewards for each rarity
const chestRewards = {
    common: [
        { type: 'coin', icon: '🪙', name: 'Qızıl Coin', amount: [10, 50], desc: 'coin qazandın!' },
        { type: 'xp', icon: '⭐', name: 'XP', amount: [5, 20], desc: 'XP qazandın!' }
    ],
    rare: [
        { type: 'coin', icon: '💰', name: 'Qızıl Paket', amount: [50, 150], desc: 'coin qazandın!' },
        { type: 'avatar', icon: '🎭', name: 'Avatar Aksesuar', items: ['🎭', '🎪', '🎨', '🎬'], desc: 'Yeni aksesuar!' },
        { type: 'xp_boost', icon: '⚡', name: 'XP Boost', duration: 30, desc: '30 dəqiqəlik XP boost!' }
    ],
    epic: [
        { type: 'coin', icon: '💎', name: 'Almaz Paket', amount: [150, 400], desc: 'coin qazandın!' },
        { type: 'avatar', icon: '🦊', name: 'Premium Avatar', items: ['🦊', '🐺', '🦁', '🐯'], desc: 'Premium avatar!' },
        { type: 'xp_boost', icon: '🚀', name: 'Mega XP Boost', duration: 60, desc: '60 dəqiqəlik XP boost!' }
    ],
    legendary: [
        { type: 'coin', icon: '👑', name: 'Kral Sərvəti', amount: [400, 1000], desc: 'coin qazandın!' },
        { type: 'badge', icon: '🏅', name: 'Nişan', items: ['⭐', '🏅', '🎖️', '💫'], desc: 'Nadir nişan!' },
        { type: 'special_avatar', icon: '🌟', name: 'Legendary Avatar', items: ['🌟', '💝', '🔥'], desc: 'Legendary avatar!' }
    ],
    mythic: [
        { type: 'mythic_token', icon: '🔮', name: 'Mythic Token', amount: 1, desc: 'Çox nadir token!' },
        { type: 'mythic_avatar', icon: '👑', name: 'Mythic Avatar', items: ['👑', '🔮', '🌈'], desc: 'Mythic avatar!' }
    ]
};

// Track purchase limits
let chestPurchaseLimits = JSON.parse(localStorage.getItem('chestPurchaseLimits') || '{}');
let currentChestReward = null;

// Initialize chest limits
function initChestLimits() {
    const now = new Date();
    const today = now.toDateString();
    const weekNum = getWeekNumber(now);

    if (chestPurchaseLimits.date !== today) {
        chestPurchaseLimits = { date: today, week: weekNum, daily: {}, weekly: {} };
    }
    if (chestPurchaseLimits.week !== weekNum) {
        chestPurchaseLimits.weekly = {};
        chestPurchaseLimits.week = weekNum;
    }
    localStorage.setItem('chestPurchaseLimits', JSON.stringify(chestPurchaseLimits));
}

function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Check if user can purchase a chest
function canPurchaseChest(chestId) {
    const chest = chestTypes[chestId];
    if (!chest) return { canBuy: false, reason: 'Belə sandıq yoxdur' };
    if (chest.price === null) return { canBuy: false, reason: 'Satılmır' };
    if (userPoints < chest.price) return { canBuy: false, reason: 'Kifayət qədər coin yoxdur' };

    initChestLimits();

    if (chest.period === 'day') {
        const bought = chestPurchaseLimits.daily[chestId] || 0;
        if (bought >= chest.limit) return { canBuy: false, reason: `Gündəlik limit (${chest.limit})` };
    } else if (chest.period === 'week') {
        const bought = chestPurchaseLimits.weekly[chestId] || 0;
        if (bought >= chest.limit) return { canBuy: false, reason: `Həftəlik limit (${chest.limit})` };
    }

    return { canBuy: true };
}

// Get remaining purchases
function getRemainingPurchases(chestId) {
    const chest = chestTypes[chestId];
    if (!chest || chest.limit === Infinity) return '∞';
    if (chest.price === null) return '0';

    initChestLimits();

    if (chest.period === 'day') {
        return Math.max(0, chest.limit - (chestPurchaseLimits.daily[chestId] || 0));
    } else if (chest.period === 'week') {
        return Math.max(0, chest.limit - (chestPurchaseLimits.weekly[chestId] || 0));
    }
    return chest.limit;
}

// Render chest grid in shop
function renderChestGrid() {
    const grid = document.getElementById('chest-grid');
    if (!grid) return;

    let html = '';
    Object.values(chestTypes).forEach(chest => {
        const check = canPurchaseChest(chest.id);
        const remaining = getRemainingPurchases(chest.id);
        const limitText = chest.period === 'day' ? `${remaining}/${chest.limit} bu gün`
            : chest.period === 'week' ? `${remaining}/${chest.limit} bu həftə`
                : chest.limit === Infinity ? 'Limitsiz' : 'Yalnız Event';

        html += `
            <div class="chest-card ${chest.id}" onclick="purchaseChest('${chest.id}')" 
                 style="--chest-color: ${chest.color}">
                <span class="chest-tier-badge">${chest.id.toUpperCase()}</span>
                <div class="chest-icon">${chest.icon}</div>
                <div class="chest-name">${chest.name}</div>
                <div class="chest-price ${chest.price === null ? 'unavailable' : ''}">
                    ${chest.price !== null ? chest.price + ' 🪙' : '❌ Satılmır'}
                </div>
                <div class="chest-limit">${limitText}</div>
                <button class="chest-buy-btn" ${!check.canBuy ? 'disabled' : ''}>
                    ${check.canBuy ? 'Aç!' : check.reason}
                </button>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// Purchase and open chest
function purchaseChest(chestId) {
    const chest = chestTypes[chestId];
    const check = canPurchaseChest(chestId);

    if (!check.canBuy) {
        showToast(check.reason, 'error');
        return;
    }

    // Deduct coins
    userPoints -= chest.price;

    // Track purchase
    if (chest.period === 'day') {
        chestPurchaseLimits.daily[chestId] = (chestPurchaseLimits.daily[chestId] || 0) + 1;
    } else if (chest.period === 'week') {
        chestPurchaseLimits.weekly[chestId] = (chestPurchaseLimits.weekly[chestId] || 0) + 1;
    }
    localStorage.setItem('chestPurchaseLimits', JSON.stringify(chestPurchaseLimits));

    // Roll for reward
    currentChestReward = rollChestReward(chest);

    // Open modal and play animation
    openChestModal(chest);

    // Update shop UI
    renderChestGrid();
    document.getElementById('shop-user-points').textContent = userPoints;
}

// Roll reward based on drop rates
function rollChestReward(chest) {
    const roll = Math.random() * 100;
    let cumulative = 0;
    let rarity = 'common';

    for (const [rar, chance] of Object.entries(chest.drops)) {
        cumulative += chance;
        if (roll <= cumulative) {
            rarity = rar;
            break;
        }
    }

    // Pick random reward from rarity pool
    const pool = chestRewards[rarity];
    const reward = { ...pool[Math.floor(Math.random() * pool.length)] };
    reward.rarity = rarity;

    // Calculate amount if applicable
    if (reward.amount && Array.isArray(reward.amount)) {
        reward.actualAmount = Math.floor(Math.random() * (reward.amount[1] - reward.amount[0] + 1)) + reward.amount[0];
    } else if (reward.items) {
        reward.actualItem = reward.items[Math.floor(Math.random() * reward.items.length)];
    }

    return reward;
}

// Open chest modal
function openChestModal(chest) {
    const modal = document.getElementById('chest-modal');
    const chestBox = document.getElementById('chest-box');
    const chestLight = document.getElementById('chest-light');
    const chestStage = document.getElementById('chest-stage');
    const chestRewardEl = document.getElementById('chest-reward');

    modal.classList.remove('hidden');
    chestBox.className = 'chest-box';
    chestBox.style.setProperty('--chest-color', chest.color);
    chestLight.classList.add('hidden');
    chestStage.classList.remove('hidden');
    chestRewardEl.classList.add('hidden');

    // Animation sequence
    setTimeout(() => chestBox.classList.add('shaking'), 100);
    setTimeout(() => {
        chestBox.classList.remove('shaking');
        chestBox.classList.add('glowing');
    }, 600);
    setTimeout(() => {
        chestBox.classList.add('opening');
        chestLight.classList.remove('hidden');
        chestLight.style.setProperty('--chest-color', chest.color);
    }, 1100);
    setTimeout(() => {
        chestStage.classList.add('hidden');
        showChestReward();
    }, 1100 + (chest.animDuration * 1000));
}

// Show reward
function showChestReward() {
    const rewardEl = document.getElementById('chest-reward');
    const iconEl = document.getElementById('reward-icon');
    const rarityEl = document.getElementById('reward-rarity');
    const nameEl = document.getElementById('reward-name');
    const descEl = document.getElementById('reward-desc');

    const reward = currentChestReward;
    rewardEl.setAttribute('data-rarity', reward.rarity);
    rewardEl.classList.remove('hidden');

    iconEl.textContent = reward.actualItem || reward.icon;
    rarityEl.textContent = reward.rarity.toUpperCase();
    nameEl.textContent = reward.name;

    if (reward.actualAmount) {
        descEl.textContent = `+${reward.actualAmount} ${reward.desc}`;
    } else {
        descEl.textContent = reward.desc;
    }
}

// Claim reward
function claimChestReward() {
    const reward = currentChestReward;

    // Apply reward
    if (reward.type === 'coin') {
        userPoints += reward.actualAmount;
    } else if (reward.type === 'xp') {
        // Add XP
        const messages = ['Əla!', 'Super!', 'Bravo!'];
        showToast(`${messages[Math.floor(Math.random() * messages.length)]} +${reward.actualAmount} XP`, 'success');
    } else if (reward.type === 'xp_boost') {
        showToast(`🚀 ${reward.duration} dəqiqəlik XP Boost aktivləşdirildi!`, 'success');
    } else if (reward.type === 'mythic_token') {
        showToast('🔮 Mythic Token qazandın! Çox nadir!', 'success');
    }

    closeChestModal();
    renderShop();
    showToast(`${reward.icon} ${reward.name} əldə edildi!`, 'success');
}

// Close modal
function closeChestModal() {
    document.getElementById('chest-modal').classList.add('hidden');
    currentChestReward = null;
}

// --- SHOP FUNCTIONS ---
function renderShop() {
    const shopItemsContainer = document.getElementById('shop-items');
    document.getElementById('shop-user-points').textContent = userPoints;
    shopItemsContainer.innerHTML = '';

    // Render chest grid
    renderChestGrid();

    // Check for mythic item availability (weekly rotation)
    const currentWeek = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
    shopItems.forEach(item => {
        if (item.rarity === 'mythic') {
            item.available = currentWeek % 2 === 0; // Available every other week
        }
    });

    shopItems.forEach(item => {
        if (item.rarity === 'mythic' && !item.available) return;

        const canAfford = userPoints >= item.price;
        const owned = userInventory.some(inv => inv.id === item.id);

        shopItemsContainer.innerHTML += `
                <div class="shop-item ${item.rarity}">
                    <div class="rarity-badge">${item.rarity.toUpperCase()}</div>
                    <div class="item-icon">${item.icon}</div>
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <div class="price">${item.price} xal</div>
                    <button class="action-btn" style="background:${canAfford && !owned ? 'var(--primary-color)' : '#ccc'};width:auto;padding:8px 15px;font-size:0.9em;" onclick="buyItem(${item.id})" ${!canAfford || owned ? 'disabled' : ''}>
                        ${owned ? 'Alınıb' : canAfford ? 'Al' : 'Kifayət deyil'}
                    </button>
                </div>
            `;
    });
}

function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (!item || userPoints < item.price) return;

    userPoints -= item.price;
    userInventory.push(item);
    showToast(`${item.name} alındı!`, 'success');
    renderShop();
    renderProfileInventory();
    updateLeaderboard();
}

// --- OER FUNCTIONS ---
function switchOERTab(tab, element) {
    currentOERTab = tab;
    document.querySelectorAll('.oer-tab').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
    renderResources();
}

// --- RECOMMENDATIONS SYSTEM ---
function generateRecommendations() {
    const recommendations = [];
    const gradeAverage = parseFloat(calculateGradeAverage());

    // Weak subjects
    const mathGrades = assignments.filter(a => a.title.toLowerCase().includes('riyaziyyat') && a.grade).map(a => a.grade);
    const historyGrades = assignments.filter(a => a.title.toLowerCase().includes('tarix') && a.grade).map(a => a.grade);

    if (mathGrades.length > 0) {
        const mathAvg = mathGrades.reduce((a, b) => a + b) / mathGrades.length;
        if (mathAvg < 4) {
            recommendations.push({
                title: 'Riyaziyyat Təkmilləşdirmə',
                description: 'Riyaziyyat qiymətləriniz ortalaması aşağıdır. Əlavə məşq tapşırıqları təklif edirik.',
                action: 'Kvadrat tənliklər mövzusunda əlavə məsələlər həll edin',
                type: 'weak_subject'
            });
        }
    }

    if (historyGrades.length > 0) {
        const historyAvg = historyGrades.reduce((a, b) => a + b) / historyGrades.length;
        if (historyAvg < 4) {
            recommendations.push({
                title: 'Tarix Dərinləşdirmə',
                description: 'Tarix fənnində performansınızı artırmaq üçün əlavə oxu materialları.',
                action: 'Səfəvilər dövləti haqqında əlavə araşdırma edin',
                type: 'weak_subject'
            });
        }
    }

    // Late submission pattern
    const lateSubmissions = assignments.filter(a => a.status === 'submitted' && new Date(a.deadline) < new Date()).length;
    if (lateSubmissions > 0) {
        recommendations.push({
            title: 'Vaxt İdarəçiliyi',
            description: 'Tapşırıqları son günə saxlama vərdişiniz var. Vaxt planlaması üçün tövsiyələr.',
            action: 'Hər tapşırıq üçün xatırlatma quraşdırın',
            type: 'time_management'
        });
    }

    // Positive reinforcement
    if (gradeAverage >= 4.5) {
        recommendations.push({
            title: 'Çətin Tapşırıqlar',
            description: 'Əla performansınız var! Daha çətin tapşırıqlarla özünüzü sınayın.',
            action: 'Olimpiada səviyyəsində məsələlər həll edin',
            type: 'challenge'
        });
    }

    return recommendations;
}

function renderRecommendations() {
    const recommendationsList = document.getElementById('recommendations-list');
    const recommendations = generateRecommendations();

    recommendationsList.innerHTML = '';
    if (recommendations.length === 0) {
        recommendationsList.innerHTML = '<div class="card"><p>Hal-hazırda tövsiyə yoxdur. Əla gedirsən! 🎉</p></div>';
        return;
    }

    recommendations.forEach(rec => {
        recommendationsList.innerHTML += `
                <div class="recommendation-card">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                    <p><strong>Tövsiyə:</strong> ${rec.action}</p>
                </div>
            `;
    });
}

// --- NAVİQASİYA FUNKSİYALARI ---
function clearActiveNav() {
    document.querySelectorAll('.header-nav a').forEach(nav => nav.classList.remove('active'));
}

function hideAllPanels() {
    mainContentArea.classList.add('hidden');
    resourcesPanel.classList.add('hidden');
    pointsPanel.classList.add('hidden');
    leaderboardPanel.classList.add('hidden');
    classWallPanel.classList.add('hidden');
    classManagementPanel.classList.add('hidden');
    quizPanel.classList.add('hidden');
    selfTestPanel.classList.add('hidden');
    adminPanel.classList.add('hidden');
    edubotPanel.classList.add('hidden');
    shopPanel.classList.add('hidden');
    if (chestsPanel) chestsPanel.classList.add('hidden');
    recommendationsPanel.classList.add('hidden');
    liveClassPanel.classList.add('hidden');
    // Fix: Also hide additional panels
    const skillTreePanel = document.getElementById('skill-tree-panel');
    if (skillTreePanel) skillTreePanel.classList.add('hidden');
    const newsPanel = document.getElementById('news-panel');
    if (newsPanel) newsPanel.classList.add('hidden');
    const friendsPanel = document.getElementById('friends-panel');
    if (friendsPanel) friendsPanel.classList.add('hidden');
    const competitionsPanel = document.getElementById('competitions-panel');
    if (competitionsPanel) competitionsPanel.classList.add('hidden');
    const chatPanel = document.getElementById('chat-panel');
    if (chatPanel) chatPanel.classList.add('hidden');
    const booksPanel = document.getElementById('books-panel');
    if (booksPanel) booksPanel.classList.add('hidden');
    const bookDetailModal = document.getElementById('book-detail-modal');
    if (bookDetailModal) bookDetailModal.classList.add('hidden');

    // Performance cleanup when switching panels
    cleanupPerformance();
}

function showMainPanel() {
    hideAllPanels();
    mainContentArea.classList.remove('hidden');
    clearActiveNav();
    navMain.classList.add('active');
    notificationDropdown.classList.add('hidden');
    if (currentUserRole === 'student' && typeof renderQuestBoard === 'function') {
        renderQuestBoard();
    }
}

function showResourcesPanel() {
    hideAllPanels();
    resourcesPanel.classList.remove('hidden');
    clearActiveNav();
    navRes.classList.add('active');
    renderResources();
    notificationDropdown.classList.add('hidden');
}

function showPointsPanel() {
    hideAllPanels();
    pointsPanel.classList.remove('hidden');
    clearActiveNav();
    navPoints.classList.add('active');
    renderPoints();
    notificationDropdown.classList.add('hidden');
}

// ========================================
// PROFESSIONAL SHOP & INVENTORY SYSTEM
// ========================================

let userInventory = [];
let equippedItems = {
    head: null,      // Tac, şapka
    face: null,      // Eynək, maska
    frame: null,     // Çərçivə (avatar ətrafı)
    background: null, // Arxa plan
    effect: null,    // Effekt (parıltı, aura)
    badge: null      // Xüsusi nişan
};

const shopItems = [
    // COMMON ITEMS
    { id: 6, name: 'Nerd Eynəyi', price: 60, icon: '🤓', rarity: 'common', slot: 'face', desc: 'Ağıllı görünüş' },
    { id: 21, name: 'Ulduz Nişanı', price: 70, icon: '⭐', rarity: 'common', slot: 'badge', desc: 'Başlanğıc nişanı' },

    // UNCOMMON ITEMS
    { id: 2, name: 'Sehrli Şapka', price: 110, icon: '🎩', rarity: 'uncommon', slot: 'head', desc: 'Klassik zəriflik' },
    { id: 5, name: 'Günəş Eynəyi', price: 80, icon: '😎', rarity: 'uncommon', slot: 'face', desc: 'Cool görünüş' },
    { id: 9, name: 'Qızıl Çərçivə', price: 110, icon: '🖼️', rarity: 'uncommon', slot: 'frame', desc: 'Qızıl haşiyə' },
    { id: 18, name: 'Qəlb Aura', price: 110, icon: '💖', rarity: 'uncommon', slot: 'effect', desc: 'Sevgi aurası' },

    // RARE ITEMS
    { id: 1, name: 'Qızıl Tac', price: 140, icon: '👑', rarity: 'rare', slot: 'head', desc: 'Kral kimi parlayın!' },
    { id: 7, name: 'Alim Eynəyi', price: 170, icon: '🧐', rarity: 'rare', slot: 'face', desc: 'Professor stili' },
    { id: 8, name: 'Ninja Maskası', price: 210, icon: '🥷', rarity: 'rare', slot: 'face', desc: 'Sirli görünüş' },
    { id: 13, name: 'Kosmik Fon', price: 210, icon: '🌌', rarity: 'rare', slot: 'background', desc: 'Ulduzlu səma' },
    { id: 14, name: 'Okean Dalğası', price: 170, icon: '🌊', rarity: 'rare', slot: 'background', desc: 'Sakit dalğalar' },
    { id: 17, name: 'Ulduz Tozu', price: 140, icon: '✨', rarity: 'rare', slot: 'effect', desc: 'Parıldama effekti' },
    { id: 22, name: 'Şimşək Nişanı', price: 140, icon: '⚡', rarity: 'rare', slot: 'badge', desc: 'Sürət simvolu' },

    // EPIC ITEMS
    { id: 3, name: 'Unicorn Buynuzu', price: 280, icon: '🦄', rarity: 'epic', slot: 'head', desc: 'Sehrli güc!' },
    { id: 10, name: 'Almaz Çərçivə', price: 350, icon: '💎', rarity: 'epic', slot: 'frame', desc: 'Parıldayan haşiyə' },
    { id: 11, name: 'Alov Çərçivəsi', price: 420, icon: '🔥', rarity: 'epic', slot: 'frame', desc: 'Odlu effekt' },
    { id: 15, name: 'Qızıl Günəş', price: 250, icon: '🌅', rarity: 'epic', slot: 'background', desc: 'Gün batımı' },
    { id: 19, name: 'Elektrik', price: 280, icon: '⚡', rarity: 'epic', slot: 'effect', desc: 'Enerji effekti' },
    { id: 23, name: 'Almaz Nişanı', price: 420, icon: '💎', rarity: 'epic', slot: 'badge', desc: 'Premium nişan' },
    { id: 25, name: 'Neon Kometa Nişanı', price: 520, icon: '☄️', rarity: 'epic', slot: 'badge', desc: 'Parlaq kometa izi' },

    // LEGENDARY ITEMS
    { id: 4, name: 'Ejder Tacı', price: 700, icon: '🐲', rarity: 'legendary', slot: 'head', desc: 'Əfsanəvi güc simvolu' },
    { id: 12, name: 'Göy qurşağı', price: 560, icon: '🌈', rarity: 'legendary', slot: 'frame', desc: 'RGB effekti' },
    { id: 16, name: 'Aurora', price: 490, icon: '🌌', rarity: 'legendary', slot: 'background', desc: 'Şimal işığı' },
    { id: 20, name: 'Ejder Alovları', price: 840, icon: '🔥', rarity: 'legendary', slot: 'effect', desc: 'Alov aurası' },
    { id: 24, name: 'Kral Nişanı', price: 700, icon: '👑', rarity: 'legendary', slot: 'badge', desc: 'Əfsanəvi status' },
    { id: 26, name: 'Feniks Qığılcımı', price: 820, icon: '🔥', rarity: 'legendary', slot: 'badge', desc: 'Yenidən doğuluş nişanı' },
    { id: 27, name: 'Ulduz Tozu İmzası', price: 460, icon: '🌠', rarity: 'epic', slot: 'badge', desc: 'Kosmik parıltı izi' },
    { id: 28, name: 'Orbit Parçası', price: 880, icon: '🛸', rarity: 'legendary', slot: 'badge', desc: 'Sirrli orbit nişanı' },

    // MYTHIC ITEMS - Weekly Rotation
    { id: 100, name: 'Əfsanə Tacı', price: 1500, icon: '👑', rarity: 'mythic', slot: 'head', desc: 'Yalnız seçilmişlər üçün', dropType: 'weekly', available: false },
    { id: 101, name: 'Kosmik Aura', price: 1800, icon: '🌌', rarity: 'mythic', slot: 'effect', desc: 'Kainatın enerjisi', dropType: 'weekly', available: false },
    { id: 102, name: 'Zaman Çərçivəsi', price: 2000, icon: '⏳', rarity: 'mythic', slot: 'frame', desc: 'Zamanı dayandırır', dropType: 'weekly', available: false },

    // MYTHIC ITEMS - Monthly Rotation
    { id: 110, name: 'Fövqəladə Ejder', price: 3000, icon: '🐉', rarity: 'mythic', slot: 'head', desc: 'Əsl əfsanə', dropType: 'monthly', available: false },
    { id: 111, name: 'Galaktika Nişanı', price: 2500, icon: '🌠', rarity: 'mythic', slot: 'badge', desc: 'Ulduzların seçimi', dropType: 'monthly', available: false },
    { id: 112, name: 'Feniks Külləri', price: 2800, icon: '🔥', rarity: 'mythic', slot: 'effect', desc: 'Külündən doğulur', dropType: 'monthly', available: false }
];

let currentShopTab = 'all';

// ========================================
// MYTHIC SHOP ROTATION SYSTEM
// ========================================

let mythicDropData = {
    weeklyEndTime: null,
    monthlyEndTime: null,
    currentWeeklyMythic: null,
    currentMonthlyMythic: null,
    weeklyHistory: [],
    monthlyHistory: []
};

let mythicCountdownInterval = null;

function initMythicShop() {
    const now = new Date();
    const saved = localStorage.getItem('mythicDropData');

    if (saved) {
        mythicDropData = JSON.parse(saved);
        // Restore available status for current mythics
        if (mythicDropData.currentWeeklyMythic) {
            const item = shopItems.find(i => i.id === mythicDropData.currentWeeklyMythic);
            if (item) item.available = true;
        }
        if (mythicDropData.currentMonthlyMythic) {
            const item = shopItems.find(i => i.id === mythicDropData.currentMonthlyMythic);
            if (item) item.available = true;
        }
    }

    // Check if weekly reset needed (every Sunday midnight)
    const nextSunday = getNextSunday();
    if (!mythicDropData.weeklyEndTime || new Date(mythicDropData.weeklyEndTime) < now) {
        rotateMythicWeekly();
        mythicDropData.weeklyEndTime = nextSunday.toISOString();
    }

    // Check if monthly reset needed (1st of each month)
    const nextMonth = getNextMonthStart();
    if (!mythicDropData.monthlyEndTime || new Date(mythicDropData.monthlyEndTime) < now) {
        rotateMythicMonthly();
        mythicDropData.monthlyEndTime = nextMonth.toISOString();
    }

    saveMythicData();
    startMythicCountdown();
}

function getNextSunday() {
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(0, 0, 0, 0);
    return nextSunday;
}

function getNextMonthStart() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
}

function rotateMythicWeekly() {
    const weeklyItems = shopItems.filter(i => i.rarity === 'mythic' && i.dropType === 'weekly');

    // Deactivate current
    if (mythicDropData.currentWeeklyMythic) {
        const prev = shopItems.find(i => i.id === mythicDropData.currentWeeklyMythic);
        if (prev) prev.available = false;

        // Add to history
        mythicDropData.weeklyHistory.unshift(mythicDropData.currentWeeklyMythic);
        if (mythicDropData.weeklyHistory.length > 3) {
            mythicDropData.weeklyHistory = mythicDropData.weeklyHistory.slice(0, 3);
        }
    }

    // Pick new random one (not in last 3)
    const availableForPick = weeklyItems.filter(i => !mythicDropData.weeklyHistory.includes(i.id));
    const selected = availableForPick[Math.floor(Math.random() * availableForPick.length)] || weeklyItems[0];

    if (selected) {
        selected.available = true;
        mythicDropData.currentWeeklyMythic = selected.id;
    }
}

function rotateMythicMonthly() {
    const monthlyItems = shopItems.filter(i => i.rarity === 'mythic' && i.dropType === 'monthly');

    if (mythicDropData.currentMonthlyMythic) {
        const prev = shopItems.find(i => i.id === mythicDropData.currentMonthlyMythic);
        if (prev) prev.available = false;

        mythicDropData.monthlyHistory.unshift(mythicDropData.currentMonthlyMythic);
        if (mythicDropData.monthlyHistory.length > 3) {
            mythicDropData.monthlyHistory = mythicDropData.monthlyHistory.slice(0, 3);
        }
    }

    const availableForPick = monthlyItems.filter(i => !mythicDropData.monthlyHistory.includes(i.id));
    const selected = availableForPick[Math.floor(Math.random() * availableForPick.length)] || monthlyItems[0];

    if (selected) {
        selected.available = true;
        mythicDropData.currentMonthlyMythic = selected.id;
    }
}

function saveMythicData() {
    localStorage.setItem('mythicDropData', JSON.stringify(mythicDropData));
}

function startMythicCountdown() {
    if (mythicCountdownInterval) clearInterval(mythicCountdownInterval);

    mythicCountdownInterval = setInterval(() => {
        updateMythicCountdownDisplay();
    }, 1000);

    updateMythicCountdownDisplay();
}

function updateMythicCountdownDisplay() {
    const countdownEl = document.getElementById('mythic-countdown');
    const countdownEl2 = document.getElementById('mythic-countdown-footer');

    if (!countdownEl && !countdownEl2) return;

    const weeklyEnd = new Date(mythicDropData.weeklyEndTime);
    const now = new Date();
    const diff = weeklyEnd - now;

    if (diff <= 0) {
        initMythicShop();
        if (typeof renderShop === 'function') renderShop();
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const timeStr = days > 0
        ? `${days}g ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (countdownEl) countdownEl.textContent = timeStr;
    if (countdownEl2) countdownEl2.textContent = timeStr;
}

function getMythicTimeRemaining() {
    if (!mythicDropData.weeklyEndTime) return '00:00:00';

    const weeklyEnd = new Date(mythicDropData.weeklyEndTime);
    const now = new Date();
    const diff = weeklyEnd - now;

    if (diff <= 0) return '00:00:00';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return days > 0
        ? `${days}g ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function getMythicHistory() {
    const allHistory = [...(mythicDropData.weeklyHistory || []), ...(mythicDropData.monthlyHistory || [])];
    return allHistory.slice(0, 3).map(id => shopItems.find(i => i.id === id)).filter(Boolean);
}

function getActiveMythicItems() {
    return shopItems.filter(i => i.rarity === 'mythic' && i.available);
}

// Mythic Purchase with Celebration
function buyMythicItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (!item || item.rarity !== 'mythic' || !item.available) return;

    if (userInventory.includes(itemId)) {
        showToast('Bu əşya artıq sizdə var!', 'info');
        return;
    }

    if (userPoints < item.price) {
        showToast('❌ Kifayət qədər xalınız yoxdur!', 'error');
        return;
    }

    userPoints -= item.price;
    userInventory.push(item.id);
    saveUserData();

    // Show Mythic purchase celebration
    showMythicPurchaseCelebration(item);

    renderShop();
}

function showMythicPurchaseCelebration(item) {
    const modal = document.createElement('div');
    modal.className = 'mythic-purchase-modal';
    modal.id = 'mythic-purchase-modal';
    modal.innerHTML = `
        <div class="mythic-purchase-content">
            <div class="mythic-rays"></div>
            <div class="mythic-icon-reveal">${item.icon}</div>
            <div class="mythic-congrats">🎊 MYTHIC ƏLDƏ EDİLDİ!</div>
            <h2>${item.name}</h2>
            <p>${item.desc}</p>
            <div class="mythic-edi-message">
                <div class="edi-avatar">🦊</div>
                <div class="edi-speech">"Bu dropu qaçırmadın... Əfsanələr arasındasan!" 🏆</div>
            </div>
            <button onclick="closeMythicModal()" class="mythic-close-btn">Möhtəşəm! ✨</button>
        </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => {
        modal.classList.add('visible');
        triggerMythicConfetti();
    });
}

function closeMythicModal() {
    const modal = document.getElementById('mythic-purchase-modal');
    if (modal) {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 500);
    }
}

function triggerMythicConfetti() {
    const colors = ['#FF4444', '#FFD700', '#FF6B6B', '#FF8C00', '#DC143C'];
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'mythic-confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.8 + 's';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 10 + 8) + 'px';
        confetti.style.height = confetti.style.width;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}



function showShopPanel() {
    hideAllPanels();
    shopPanel.classList.remove('hidden');
    clearActiveNav();
    navShop.classList.add('active');
    notificationDropdown.classList.add('hidden');
    renderShop();
    // if (typeof renderChests === 'function') renderChests(); // Moved to separate panel
}

function showChestsPanel() {
    hideAllPanels();
    if (chestsPanel) chestsPanel.classList.remove('hidden');
    clearActiveNav();
    if (navChests) navChests.classList.add('active');
    notificationDropdown.classList.add('hidden');
    if (typeof renderChests === 'function') renderChests();

    // Update balance display in chests panel
    const balanceEl = document.getElementById('chest-user-points');
    if (balanceEl && typeof userPoints !== 'undefined') {
        balanceEl.textContent = userPoints.toLocaleString();
    }
}

function renderShop() {
    const tabs = [
        { id: 'all', name: '🛒 Hamısı' },
        { id: 'head', name: '👑 Baş' },
        { id: 'face', name: '😎 Üz' },
        { id: 'frame', name: '🖼️ Çərçivə' },
        { id: 'background', name: '🌌 Arxa plan' },
        { id: 'effect', name: '✨ Effekt' },
        { id: 'badge', name: '⭐ Nişan' },
        { id: 'inventory', name: '🎒 İnventar' }
    ];

    const isInventoryView = currentShopTab === 'inventory';
    // Filter out mythic items from regular display - they go in special section
    const filteredItems = currentShopTab === 'all'
        ? shopItems.filter(i => i.rarity !== 'mythic')
        : isInventoryView
            ? []
            : shopItems.filter(i => i.slot === currentShopTab && i.rarity !== 'mythic');

    const rarityLabels = {
        common: 'Adi',
        uncommon: 'Nadir',
        rare: 'Seçkin',
        epic: 'Epik',
        legendary: 'Əfsanəvi',
        mythic: 'Mifik'
    };

    // Get active mythic items
    const activeMythics = getActiveMythicItems();
    const mythicHistory = getMythicHistory();

    const featuredBadges = shopItems.filter(item => item.slot === 'badge').slice(0, 3);
    const sampleBadgeOne = getItemIcon(22) || '⚡';
    const sampleBadgeTwo = getItemIcon(25) || '☄️';
    const sampleBadgeThree = getItemIcon(27) || '🌠';
    const sampleBadgeFour = getItemIcon(28) || '🛸';

    shopPanel.innerHTML = `
        <div class="shop-v2">
            <div class="shop-hero">
                <div class="shop-hero-text">
                    <span class="shop-kicker">Nişan studiyası</span>
                    <h2>Mağaza yenidən quruldu</h2>
                    <p>Nişanları al, aktiv et və sinif divarında, sinif chatında adının yanında görün.</p>
                    <div class="shop-hero-metrics">
                        <div class="shop-metric">
                            <span class="shop-metric-value">${userInventory.length}</span>
                            <span class="shop-metric-label">Əşya</span>
                        </div>
                        <div class="shop-metric">
                            <span class="shop-metric-value">${shopItems.filter(item => item.slot === 'badge').length}</span>
                            <span class="shop-metric-label">Nişan</span>
                        </div>
                        <div class="shop-metric">
                            <span class="shop-metric-value">${equippedItems.badge ? 'Aktiv' : 'Boş'}</span>
                            <span class="shop-metric-label">Status</span>
                        </div>
                    </div>
                </div>
                <div class="shop-hero-card">
                    <div class="shop-wallet">
                        <span class="wallet-label">Balans</span>
                        <span class="wallet-amount">${userPoints}</span>
                        <span class="wallet-unit">xal</span>
                    </div>
                    <div class="shop-avatar-preview">
                        <div class="avatar-base ${equippedItems.background ? 'has-bg' : ''} ${equippedItems.frame ? 'has-frame' : ''}">
                            ${equippedItems.head ? `<span class="avatar-item is-head">${getItemIcon(equippedItems.head)}</span>` : ''}
                            <span class="avatar-core">👤</span>
                            ${equippedItems.face ? `<span class="avatar-item is-face">${getItemIcon(equippedItems.face)}</span>` : ''}
                            ${equippedItems.effect ? `<span class="avatar-item is-effect">${getItemIcon(equippedItems.effect)}</span>` : ''}
                            ${equippedItems.badge ? `<span class="avatar-item is-badge">${getItemIcon(equippedItems.badge)}</span>` : ''}
                        </div>
                        <div class="avatar-caption">Avatar önizləmə</div>
                    </div>
                </div>
            </div>

            <div class="shop-tabs">
                ${tabs.map(tab => `
                    <button class="shop-tab ${currentShopTab === tab.id ? 'is-active' : ''}" onclick="switchShopTab('${tab.id}')">
                        ${tab.name}
                    </button>
                `).join('')}
            </div>

            ${isInventoryView ? renderInventory() : `
            <div class="shop-spotlight">
                <div class="shop-spotlight-info">
                    <h3>Sinifdə görünən nişanlar</h3>
                    <p>Seçilən nişanlar həm sinif divarında, həm də sinif chatında adının yanında görünür.</p>
                    <div class="shop-mini-grid">
                        ${featuredBadges.map(item => `
                            <div class="shop-mini-card">
                                <span class="shop-mini-icon">${item.icon}</span>
                                <div>
                                    <div class="shop-mini-title">${item.name}</div>
                                    <div class="shop-mini-sub">${item.price} xal</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                    <div class="shop-samples">
                        <div class="sample-card is-chat">
                            <div class="sample-tag">Chat</div>
                            <div class="sample-title">Sinif chat nümunəsi</div>
                            <div class="sample-name">Aysel <span class="name-badge">${sampleBadgeOne}</span></div>
                            <div class="sample-text">"Tapşırığı göndərdim, baxa bilərsiniz."</div>
                        </div>
                        <div class="sample-card is-wall">
                            <div class="sample-tag">Divar</div>
                            <div class="sample-title">Sinif divarı nümunəsi</div>
                            <div class="sample-name">Murad <span class="name-badge">${sampleBadgeTwo}</span></div>
                            <div class="sample-text">"Bu gün layihə təqdimatını tamamladım!"</div>
                        </div>
                        <div class="sample-card is-chat">
                            <div class="sample-tag">Chat</div>
                            <div class="sample-title">Sürətli cavab</div>
                            <div class="sample-name">Ləman <span class="name-badge">${sampleBadgeThree}</span></div>
                            <div class="sample-text">"Riyaziyyat sualını həll etdim, izah edirəm."</div>
                        </div>
                        <div class="sample-card is-wall">
                            <div class="sample-tag">Divar</div>
                            <div class="sample-title">Layihə vitrinı</div>
                            <div class="sample-name">Kamal <span class="name-badge">${sampleBadgeFour}</span></div>
                            <div class="sample-text">"Robotika layihəmin videosunu paylaşdım."</div>
                        </div>
                    </div>
            </div>

            <div class="shop-grid-v2">
                ${filteredItems.map(item => {
        const owned = userInventory.includes(item.id);
        const equipped = Object.values(equippedItems).includes(item.id);
        const actionLabel = owned ? (equipped ? 'Çıxar' : 'Tax') : 'Al';
        const actionHandler = owned ? `equipItem(${item.id})` : `buyItem(${item.id})`;
        return `
                        <div class="shop-card rarity-${item.rarity} ${owned ? 'is-owned' : ''} ${equipped ? 'is-equipped' : ''}">
                            <div class="shop-card-top">
                                <span class="shop-card-rarity">${rarityLabels[item.rarity] || item.rarity}</span>
                                ${item.slot === 'badge' ? '<span class="shop-card-chip">Sinif nişanı</span>' : ''}
                            </div>
                            <div class="shop-card-icon">${item.icon}</div>
                            <h4>${item.name}</h4>
                            <p>${item.desc}</p>
                            <div class="shop-card-footer">
                                <div class="shop-price">${item.price} xal</div>
                                <button class="shop-action-btn ${owned ? 'is-owned' : ''}" onclick="${actionHandler}">
                                    ${actionLabel}
                                </button>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>

            <!-- MYTHIC DROP SECTION -->
            ${activeMythics.length > 0 ? `
            <div class="shop-mythic-section">
                <div class="mythic-header">
                    <div class="mythic-header-left">
                        <span class="mythic-flame">🔥</span>
                        <h3>Mythic Drop</h3>
                        <span class="mythic-badge">LIMITED</span>
                    </div>
                    <div class="mythic-header-right">
                        <span class="mythic-timer-label">Növbəti drop:</span>
                        <span class="mythic-timer" id="mythic-countdown">${getMythicTimeRemaining()}</span>
                    </div>
                </div>
                
                <div class="mythic-items-grid">
                    ${activeMythics.map(item => {
        const owned = userInventory.includes(item.id);
        const equipped = Object.values(equippedItems).includes(item.id);
        return `
                        <div class="shop-card rarity-mythic mythic-glow ${owned ? 'is-owned' : ''} ${equipped ? 'is-equipped' : ''}">
                            <div class="mythic-limited-tag">Məhdud müddət</div>
                            <div class="shop-card-top">
                                <span class="shop-card-rarity mythic">MYTHIC</span>
                                <span class="mythic-drop-type">${item.dropType === 'weekly' ? 'Həftəlik' : 'Aylıq'}</span>
                            </div>
                            <div class="shop-card-icon mythic-icon">${item.icon}</div>
                            <h4>${item.name}</h4>
                            <p>${item.desc}</p>
                            <div class="mythic-edi-tip">
                                <span>🦊</span>
                                <span>"Bu çox nadirdir… indi gəldi."</span>
                            </div>
                            <div class="shop-card-footer">
                                <div class="shop-price mythic-price">${item.price} xal</div>
                                ${owned
                ? `<button class="shop-action-btn mythic-btn is-owned" onclick="equipItem(${item.id})">${equipped ? 'Çıxar' : 'Tax'}</button>`
                : `<button class="shop-action-btn mythic-btn" onclick="buyMythicItem(${item.id})">Al</button>`
            }
                            </div>
                        </div>
                    `;
    }).join('')}
                </div>
                
                ${mythicHistory.length > 0 ? `
                <div class="mythic-history">
                    <h4>Son Mythic Droplar</h4>
                    <div class="mythic-history-items">
                        ${mythicHistory.map(item => `
                            <div class="mythic-history-item">
                                <span>${item.icon}</span>
                                <span>${item.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            ` : ''}

            <!-- MYTHIC COUNTDOWN FOOTER -->
            <div class="shop-mythic-footer">
                <div class="mythic-countdown-bar">
                    <span class="mythic-countdown-label">Mythic itemlərə:</span>
                    <span class="mythic-countdown-time" id="mythic-countdown-footer">${getMythicTimeRemaining()}</span>
                    <span class="mythic-countdown-suffix">qalıb</span>
                </div>
                <p class="mythic-info-text">Bəzi Mythic itemlər həftəlik, bəziləri aylıq yenilənir.</p>
            </div>
            `}
        </div>
    `;
}

function renderInventory() {
    const ownedItems = shopItems.filter(i => userInventory.includes(i.id));
    const slots = ['head', 'face', 'frame', 'background', 'effect', 'badge'];
    const slotNames = { head: '👑 Baş', face: '😎 Üz', frame: '🖼️ Çərçivə', background: '🌌 Arxa plan', effect: '✨ Effekt', badge: '⭐ Nişan' };

    if (ownedItems.length === 0) {
        return `<div class="shop-empty">
            <span class="shop-empty-icon">🎒</span>
            <h3>İnventarınız boşdur</h3>
            <p>Mağazadan nişan və aksesuarları alın.</p>
        </div>`;
    }

    return `
        <div class="shop-inventory-grid">
            ${slots.map(slot => `
                <div class="shop-inventory-card">
                    <h4>${slotNames[slot]}</h4>
                    <div class="shop-inventory-items">
                        ${ownedItems.filter(i => i.slot === slot).map(item => `
                            <div onclick="equipItem(${item.id})" class="shop-inventory-item ${equippedItems[slot] === item.id ? 'is-equipped' : ''}">
                                <div class="shop-inventory-icon">${item.icon}</div>
                                <small>${item.name}</small>
                            </div>
                        `).join('') || '<span style="color:#888;font-size:12px;">Boş</span>'}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function switchShopTab(tab) {
    currentShopTab = tab;
    renderShop();
}

function getItemIcon(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    return item ? item.icon : '';
}

function persistEquippedItems() {
    if (!currentUser || typeof equippedItems === 'undefined') return;
    localStorage.setItem(`equippedItems_${currentUser.id}`, JSON.stringify(equippedItems));
}

function getUserEquippedBadgeId(userId) {
    if (!userId) return null;
    if (currentUser && userId === currentUser.id) return equippedItems.badge;
    const stored = JSON.parse(localStorage.getItem(`equippedItems_${userId}`) || 'null');
    if (stored && Number.isFinite(Number(stored.badge))) return Number(stored.badge);
    return null;
}

function renderUserBadge(userId) {
    const badgeId = getUserEquippedBadgeId(userId);
    const item = badgeId ? shopItems.find(i => i.id === badgeId) : null;
    const icon = item ? item.icon : '';
    const title = item ? item.name : 'Nişan';
    return icon ? `<span class="name-badge" title="${title}">${icon}</span>` : '';
}

function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    if (userInventory.includes(itemId)) {
        showToast('Bu əşya artıq sizdə var!', 'info');
        return;
    }

    if (userPoints >= item.price) {
        userPoints -= item.price;
        userInventory.push(itemId);
        showToast('🎉 ' + item.name + ' alındı!', 'success');
        triggerConfetti();
        saveUserData();
        renderShop();
    } else {
        showToast('❌ Kifayət qədər xalınız yoxdur!', 'error');
    }
}

function equipItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (!item || !userInventory.includes(itemId)) return;

    if (equippedItems[item.slot] === itemId) {
        equippedItems[item.slot] = null;
        showToast('🔓 ' + item.name + ' çıxarıldı', 'info');
    } else {
        equippedItems[item.slot] = itemId;
        showToast('🎭 ' + item.name + ' taxıldı!', 'success');
    }
    persistEquippedItems();
    applyEquippedItemsToHeaderAvatar();
    renderProfileInventory();
    if (document.getElementById('chat-messages')) renderChat();
    if (document.getElementById('wall-posts')) renderClassWall();
    renderShop();
}

// ========================================
// SKILL TREE SYSTEM (RPG-style)
// ========================================

const skillTreeData = {
    riyaziyyat: {
        name: '📐 Riyaziyyat',
        icon: '📐',
        color: '#3498db',
        skills: [
            { id: 'math_1', name: 'Cəbr', level: 1, xpRequired: 0, emoji: '🌱', unlocked: true, progress: 75 },
            { id: 'math_2', name: 'Funksiyalar', level: 2, xpRequired: 500, emoji: '🌿', unlocked: true, progress: 40 },
            { id: 'math_3', name: 'Trigonometriya', level: 3, xpRequired: 1000, emoji: '🌳', unlocked: false, progress: 0 },
            { id: 'math_4', name: 'Diferensial', level: 4, xpRequired: 2000, emoji: '🌲', unlocked: false, progress: 0 }
        ]
    },
    tarix: {
        name: '📜 Tarix',
        icon: '📜',
        color: '#e67e22',
        skills: [
            { id: 'hist_1', name: 'Qədim Tarix', level: 1, xpRequired: 0, emoji: '🏛️', unlocked: true, progress: 90 },
            { id: 'hist_2', name: 'Orta Əsrlər', level: 2, xpRequired: 500, emoji: '⚔️', unlocked: true, progress: 60 },
            { id: 'hist_3', name: 'Yeni Dövr', level: 3, xpRequired: 1000, emoji: '🏰', unlocked: true, progress: 30 },
            { id: 'hist_4', name: 'Müasir Tarix', level: 4, xpRequired: 2000, emoji: '🌍', unlocked: false, progress: 0 }
        ]
    },
    edebiyyat: {
        name: '📚 Ədəbiyyat',
        icon: '📚',
        color: '#9b59b6',
        skills: [
            { id: 'lit_1', name: 'Klassik Ədəbiyyat', level: 1, xpRequired: 0, emoji: '📖', unlocked: true, progress: 100 },
            { id: 'lit_2', name: 'Romantizm', level: 2, xpRequired: 500, emoji: '💕', unlocked: true, progress: 50 },
            { id: 'lit_3', name: 'Realizm', level: 3, xpRequired: 1000, emoji: '🎭', unlocked: false, progress: 0 },
            { id: 'lit_4', name: 'Modernizm', level: 4, xpRequired: 2000, emoji: '🎨', unlocked: false, progress: 0 }
        ]
    },
    fizika: {
        name: '⚡ Fizika',
        icon: '⚡',
        color: '#1abc9c',
        skills: [
            { id: 'phys_1', name: 'Mexanika', level: 1, xpRequired: 0, emoji: '⚙️', unlocked: true, progress: 65 },
            { id: 'phys_2', name: 'Termodinamika', level: 2, xpRequired: 500, emoji: '🔥', unlocked: false, progress: 0 },
            { id: 'phys_3', name: 'Elektrik', level: 3, xpRequired: 1000, emoji: '⚡', unlocked: false, progress: 0 },
            { id: 'phys_4', name: 'Kvant Fizikası', level: 4, xpRequired: 2000, emoji: '🔬', unlocked: false, progress: 0 }
        ]
    }
};

let skillsPanel = null;

function showSkillTreePanel() {
    hideAllPanels();

    // Create skills panel if it doesn't exist
    if (!skillsPanel) {
        skillsPanel = document.createElement('main');
        skillsPanel.id = 'skills-panel';
        skillsPanel.className = 'main-content-area';
        document.getElementById('main-content-area').parentNode.appendChild(skillsPanel);
    }

    skillsPanel.classList.remove('hidden');
    clearActiveNav();
    const navSkills = document.getElementById('nav-skills');
    if (navSkills) navSkills.classList.add('active');
    notificationDropdown.classList.add('hidden');

    renderSkillTree();
}

function renderSkillTree() {
    if (!skillsPanel) return;

    const totalSkills = Object.values(skillTreeData).reduce((acc, subject) => acc + subject.skills.length, 0);
    const unlockedSkills = Object.values(skillTreeData).reduce((acc, subject) =>
        acc + subject.skills.filter(s => s.unlocked).length, 0);

    skillsPanel.innerHTML = `
        <h2 class="content-section-header">🌳 Bəcərilər Ağacı</h2>
        
        <!-- Overview Card -->
        <div class="card" style="margin-bottom:20px;padding:20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px;">
                <div>
                    <h3 style="margin:0;color:var(--primary-color);">Səviyyə ${userLevel}</h3>
                    <p style="margin:5px 0;color:#888;">${userXP} XP toplam</p>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:2em;">🔓 ${unlockedSkills}/${totalSkills}</div>
                    <small style="color:#888;">Açılmış bəcəriklər</small>
                </div>
                <div style="min-width:200px;">
                    <small style="color:#888;">Ümumi progress</small>
                    <div style="background:#eee;height:20px;border-radius:10px;overflow:hidden;margin-top:5px;">
                        <div style="background:linear-gradient(135deg,var(--primary-color),var(--secondary-color));height:100%;width:${(unlockedSkills / totalSkills) * 100}%;transition:width 0.5s;"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Skill Trees Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">
            ${Object.entries(skillTreeData).map(([key, subject]) => `
                <div class="card" style="padding:0;overflow:hidden;">
                    <div style="background:${subject.color};color:white;padding:15px;text-align:center;">
                        <span style="font-size:2em;">${subject.icon}</span>
                        <h3 style="margin:10px 0 0;">${subject.name}</h3>
                    </div>
                    <div style="padding:15px;">
                        ${subject.skills.map((skill, i) => `
                            <div style="display:flex;align-items:center;gap:10px;padding:12px;margin-bottom:8px;background:${skill.unlocked ? '#f8f9fa' : '#f0f0f0'};border-radius:10px;border-left:4px solid ${skill.unlocked ? subject.color : '#ccc'};opacity:${skill.unlocked ? 1 : 0.6};">
                                <span style="font-size:1.5em;">${skill.emoji}</span>
                                <div style="flex:1;">
                                    <div style="display:flex;justify-content:space-between;align-items:center;">
                                        <strong>${skill.name}</strong>
                                        <span style="font-size:0.8em;color:#888;">Lv.${skill.level}</span>
                                    </div>
                                    ${skill.unlocked ? `
                                        <div style="background:#ddd;height:6px;border-radius:3px;margin-top:5px;overflow:hidden;">
                                            <div style="background:${subject.color};height:100%;width:${skill.progress}%;"></div>
                                        </div>
                                        <small style="color:#888;">${skill.progress}% tamamlanıb</small>
                                    ` : `
                                        <small style="color:#999;">🔒 ${skill.xpRequired} XP lazımdır</small>
                                    `}
                                </div>
                            </div>
                            ${i < subject.skills.length - 1 ? `<div style="text-align:center;margin:5px 0;color:#ccc;">↓</div>` : ''}
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- Tips Card -->
        <div class="card" style="margin-top:20px;background:linear-gradient(135deg,#667eea15,#764ba215);border:1px dashed var(--primary-color);">
            <h4 style="color:var(--primary-color);margin-top:0;">💡 Bəcərikləri necə açmaq olar?</h4>
            <ul style="margin:0;padding-left:20px;color:#666;">
                <li>Tapşırıqları tamamlayaraq XP qazanın</li>
                <li>Testlərdən yaxşı nəticə alın</li>
                <li>Günlük seriyalarınızı qoruyun</li>
                <li>EduBot ilə mövzuları araşdırın</li>
            </ul>
        </div>
    `;
}

function showRecommendationsPanel() {
    hideAllPanels();
    recommendationsPanel.classList.remove('hidden');
    clearActiveNav();
    navRecommendations.classList.add('active');
    renderRecommendations();
    notificationDropdown.classList.add('hidden');
}

function showLeaderboardPanel() {
    hideAllPanels();
    leaderboardPanel.classList.remove('hidden');
    clearActiveNav();
    navLeaderboard.classList.add('active');
    renderLeaderboard();
    notificationDropdown.classList.add('hidden');
}

function showClassWallPanel() {
    hideAllPanels();
    const classWallPanel = document.getElementById('class-wall-panel');
    if (classWallPanel) classWallPanel.classList.remove('hidden');
    clearActiveNav();
    const navWall = document.getElementById('nav-wall');
    if (navWall) navWall.classList.add('active');

    // Update class wall header with user's class name
    const classWallHeader = document.querySelector('#class-wall-panel .class-wall-header h2');
    if (classWallHeader && currentUser) {
        classWallHeader.textContent = (currentUser.class_name || 'Sinif') + ' Sinif Divarı';
    }

    // Load from API
    loadWallFromAPI();

    // Show/hide post form based on role
    const postFormSection = document.getElementById('post-form-section');
    if (postFormSection) {
        if (currentUserRole === 'student' || currentUserRole === 'teacher' || currentUserRole === 'admin') {
            postFormSection.classList.remove('hidden');
        } else {
            postFormSection.classList.add('hidden');
        }
    }

    const notificationDropdown = document.getElementById('notification-dropdown');
    if (notificationDropdown) notificationDropdown.classList.add('hidden');
}


function showClassManagementPanel() {
    hideAllPanels();
    classManagementPanel.classList.remove('hidden');
    clearActiveNav();
    navClasses.classList.add('active');
    renderClassManagement();
    notificationDropdown.classList.add('hidden');
}

function showQuizPanel() {
    hideAllPanels();
    quizPanel.classList.remove('hidden');
    clearActiveNav();
    navQuiz.classList.add('active');
    renderQuizPanel();
    notificationDropdown.classList.add('hidden');
}

function showSelfTestPanel() {
    hideAllPanels();
    selfTestPanel.classList.remove('hidden');
    clearActiveNav();
    navSelfTest.classList.add('active');
    notificationDropdown.classList.add('hidden');
}

function showBooksPanel() {
    hideAllPanels();
    const booksPanel = document.getElementById('books-panel');
    if (booksPanel) booksPanel.classList.remove('hidden');
    clearActiveNav();
    const navBooks = document.getElementById('nav-books');
    if (navBooks) navBooks.classList.add('active');
    notificationDropdown.classList.add('hidden');
    renderBooks();
}

function getWishlistKey() {
    if (!currentUser) return 'wishlist_guest';
    return `wishlist_${currentUser.id}`;
}

function getWishlist() {
    return JSON.parse(localStorage.getItem(getWishlistKey()) || '[]');
}

function setWishlist(ids) {
    localStorage.setItem(getWishlistKey(), JSON.stringify(ids));
    updateWishlistCount();
}

function updateWishlistCount() {
    const countEl = document.getElementById('books-wishlist-count');
    if (!countEl) return;
    countEl.textContent = getWishlist().length;
}

function renderBooks() {
    const grid = document.getElementById('books-grid');
    if (!grid) return;

    const normalizedSearch = currentBookSearch.trim().toLowerCase();
    const filtered = booksData.filter(book => {
        const matchesCategory = currentBookCategory === 'all' || book.category === currentBookCategory;
        const matchesSearch = !normalizedSearch ||
            book.title.toLowerCase().includes(normalizedSearch) ||
            book.author.toLowerCase().includes(normalizedSearch);
        return matchesCategory && matchesSearch;
    });

    grid.innerHTML = filtered.map(book => `
        <div class="book-card" onclick="openBookModal(${book.id})">
            <div class="book-icon">${book.icon}</div>
            <h4>${book.title}</h4>
            <div class="book-author">${book.author}</div>
            <div class="book-category">${book.category}</div>
            <div class="book-status">${book.status === 'available' ? 'Mövcuddur' : 'Məşğuldur'}</div>
        </div>
    `).join('');

    updateWishlistCount();
}

function filterBooks(value) {
    currentBookSearch = value || '';
    renderBooks();
}

function filterBookCategory(category, btn) {
    currentBookCategory = category;
    document.querySelectorAll('.book-cat-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderBooks();
}

function openBookModal(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (!book) return;
    currentBookId = bookId;

    const modal = document.getElementById('book-detail-modal');
    if (modal) modal.classList.remove('hidden');

    const iconEl = document.getElementById('book-modal-icon');
    const titleEl = document.getElementById('book-modal-title');
    const authorEl = document.getElementById('book-modal-author');
    const categoryEl = document.getElementById('book-modal-category');
    const descEl = document.getElementById('book-modal-desc');
    const summaryEl = document.getElementById('book-modal-summary');

    if (iconEl) iconEl.textContent = book.icon;
    if (titleEl) titleEl.textContent = book.title;
    if (authorEl) authorEl.textContent = book.author;
    if (categoryEl) categoryEl.textContent = book.category;
    if (descEl) descEl.textContent = book.description;
    if (summaryEl) summaryEl.textContent = book.summary;

    updateWishlistButton();
}

function closeBookModal() {
    const modal = document.getElementById('book-detail-modal');
    if (modal) modal.classList.add('hidden');
}

function switchBookTab(tabId, btn) {
    document.querySelectorAll('.book-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.book-tab-content').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const tab = document.getElementById(`book-${tabId}-tab`);
    if (tab) tab.classList.add('active');
}

function updateWishlistButton() {
    const btn = document.getElementById('wishlist-btn');
    if (!btn) return;
    const wishlist = getWishlist();
    const isSaved = wishlist.includes(currentBookId);
    btn.textContent = isSaved ? '❤️ Siyahıdan çıxar' : '🤍 Siyahıya əlavə et';
}

function toggleWishlist() {
    if (!currentBookId) return;
    const wishlist = getWishlist();
    const index = wishlist.indexOf(currentBookId);
    if (index >= 0) {
        wishlist.splice(index, 1);
        showToast('Kitab siyahıdan çıxarıldı', 'info');
    } else {
        wishlist.push(currentBookId);
        showToast('Kitab siyahıya əlavə edildi', 'success');
    }
    setWishlist(wishlist);
    updateWishlistButton();
}

function addNewBook(event) {
    event.preventDefault();
    const title = document.getElementById('new-book-title')?.value.trim();
    const author = document.getElementById('new-book-author')?.value.trim();
    const category = document.getElementById('new-book-category')?.value;
    const description = document.getElementById('new-book-desc')?.value.trim();
    const summary = document.getElementById('new-book-summary')?.value.trim();

    if (!title || !author || !category || !description || !summary) {
        showToast('Zəhmət olmasa bütün sahələri doldurun', 'warning');
        return;
    }

    booksData.unshift({
        id: Date.now(),
        title,
        author,
        category,
        icon: '📘',
        description,
        summary,
        status: 'available'
    });

    showToast('Kitab əlavə edildi', 'success');
    event.target.reset();
    renderBooks();
}

function showSkillTreePanel() {
    hideAllPanels();
    const skillTreePanel = document.getElementById('skill-tree-panel');
    if (skillTreePanel) {
        skillTreePanel.classList.remove('hidden');
    }
    clearActiveNav();
    const navSkills = document.getElementById('nav-skills');
    if (navSkills) navSkills.classList.add('active');
    notificationDropdown.classList.add('hidden');
    renderSkillTree();
}

function showLiveClassPanel() {
    hideAllPanels();
    liveClassPanel.classList.remove('hidden');
    clearActiveNav();
    navLiveClass.classList.add('active');
    renderLiveClassPanel();
    notificationDropdown.classList.add('hidden');
}

function showAdminPanel() {
    hideAllPanels();
    adminPanel.classList.remove('hidden');
    clearActiveNav();
    navAdmin.classList.add('active');
    renderAdminPanel();
    loadAdminReports(); // Load reports
    loadBlacklist(); // Load blacklist
    notificationDropdown.classList.add('hidden');
}

// Blacklist Management
async function loadBlacklist() {
    const listContainer = document.getElementById('blacklist-list');
    if (!listContainer) return;

    listContainer.innerHTML = '<span style="color:#666;">Yüklənir...</span>';

    try {
        const response = await fetch(`${API_BASE}/ai/blacklist`, {
            credentials: 'include'
        });

        if (response.ok) {
            const list = await response.json();
            listContainer.innerHTML = '';

            if (list.length === 0) {
                listContainer.innerHTML = '<span style="color:#666; width:100%; text-align:center;">Hələ heç bir söz əlavə edilməyib.</span>';
                return;
            }

            list.forEach(item => {
                const tag = document.createElement('div');
                tag.style.cssText = `
                    background: #ffeba7; 
                    padding: 5px 12px; 
                    border-radius: 20px; 
                    display: flex; 
                    align-items: center; 
                    gap: 8px; 
                    font-size: 14px;
                `;
                tag.innerHTML = `
                    <span>${item.word}</span>
                    <button onclick="removeBlacklistWord(${item.id})" style="background:none; border:none; color:#c0392b; font-weight:bold; cursor:pointer;">×</button>
                `;
                listContainer.appendChild(tag);
            });
        }
    } catch (error) {
        console.error('Failed to load blacklist:', error);
        listContainer.innerHTML = '<span style="color:var(--danger-color);">Yüklənmə xətası</span>';
    }
}

async function addBlacklistWord() {
    const input = document.getElementById('blacklist-input');
    const word = input.value.trim();
    if (!word) return;

    try {
        const response = await fetch(`${API_BASE}/ai/blacklist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ word })
        });

        const data = await response.json();
        if (response.ok) {
            showToast('Söz əlavə edildi', 'success');
            input.value = '';
            loadBlacklist();
        } else {
            showToast(data.error || 'Xəta baş verdi', 'error');
        }
    } catch (error) {
        console.error('Failed to add word:', error);
        showToast('Server ilə əlaqə xətası', 'error');
    }
}

async function removeBlacklistWord(id) {
    if (!confirm('Bu sözü silmək istədiyinizə əminsiniz?')) return;

    try {
        const response = await fetch(`${API_BASE}/ai/blacklist/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            showToast('Söz silindi', 'info');
            loadBlacklist();
        } else {
            showToast('Silinmə xətası', 'error');
        }
    } catch (error) {
        console.error('Failed to delete word:', error);
        showToast('Server ilə əlaqə xətası', 'error');
    }
}

function showEduBotPanel() {
    hideAllPanels();
    edubotPanel.classList.remove('hidden');
    clearActiveNav();
    navEduBot.classList.add('active');
    notificationDropdown.classList.add('hidden');
    renderEduBot();
}

let edubotMessages = [
    { role: 'bot', text: 'Salam! Mən EduBot - sənin Sokrat üsullu AI köməkçinəm. 🎓 Cavabları hazır verməyəcəm, amma düzgün suallarla səni həllə yönləndirəcəm. Hansı mövzuda kömək lazımdır?' }
];

function renderEduBot() {
    edubotPanel.innerHTML = `
        <h2 class="content-section-header">🤖 EduBot - AI Köməkçi</h2>
        <div class="card" style="max-width:700px;margin:0 auto;">
            <div id="edubot-chat" style="height:350px;overflow-y:auto;padding:15px;background:#f8f9fa;border-radius:10px;margin-bottom:15px;">
                ${edubotMessages.map(m => {
        if (m.isTyping) {
            return `<div style="display:flex;margin-bottom:12px;">
                            <div style="max-width:75%;padding:12px 16px;border-radius:18px 18px 18px 4px;background:#fff;color:#333;box-shadow:0 1px 2px rgba(0,0,0,0.1);">
                                <span class="typing-indicator">${m.text} <span class="dots">...</span></span>
                            </div>
                        </div>`;
        }
        return `<div style="display:flex;margin-bottom:12px;${m.role === 'user' ? 'justify-content:flex-end;' : ''}">
                        <div style="max-width:75%;padding:12px 16px;border-radius:${m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};background:${m.role === 'bot' ? '#fff' : 'var(--primary-color)'};color:${m.role === 'bot' ? '#333' : '#fff'};box-shadow:0 1px 2px rgba(0,0,0,0.1);">
                            ${m.text}
                        </div>
                    </div>`;
    }).join('')}
            </div>
            <form onsubmit="sendToEduBot(event)" style="display:flex;gap:10px;">
                <input type="text" id="edubot-input" placeholder="Sualını yaz..." style="flex:1;padding:10px 16px;border:2px solid #e0e0e0;border-radius:25px;font-size:14px;">
                <button type="submit" class="action-btn" style="background:var(--primary-color);padding:10px 20px;border-radius:25px;font-size:14px;">Göndər</button>
            </form>
        </div>
    `;
    const chat = document.getElementById('edubot-chat');
    if (chat) chat.scrollTop = chat.scrollHeight;
}

function getEduBotResponse(userText) {
    const text = userText.toLowerCase();

    // Salamlaşma
    if (text.includes('salam') || text.includes('hello') || text.includes('hey')) {
        return 'Salam! 👋 Bugün hansı dərsdə və ya tapşırıqda çətinlik çəkirsən? Mövzunu dəqiq yazsan, birlikdə həll edərik.';
    }

    // Necəsən
    if (text.includes('necəsən') || text.includes('nə var') || text.includes('nə xəbər')) {
        return 'Yaxşıyam, sağ ol! 😊 Sənin dərslərində kömək etməyə hazıram. Hansı mövzuda sual var?';
    }

    // Riyaziyyat
    if (text.includes('riyaziyyat') || text.includes('tənlik') || text.includes('hesab') || text.includes('ədəd')) {
        return '📐 Riyaziyyat haqqında soruşursan. Gəl Sokrat üsulu ilə gedək: Əvvəlcə mənə de, bu məsələdə nəyi bilirsən və harda ilişib qaldın?';
    }

    // Tarix
    if (text.includes('tarix') || text.includes('səfəvi') || text.includes('tarixi')) {
        return '📜 Tarix mövzusu! Maraqlıdır. Əvvəlcə sənə bir sual: Bu dövr haqqında əvvəldən nə bilirsən? Hansı hadisələri xatırlayırsan?';
    }

    // Ədəbiyyat
    if (text.includes('ədəbiyyat') || text.includes('şeir') || text.includes('yazıçı') || text.includes('əsər')) {
        return '📚 Ədəbiyyat gözəl mövzudur! Hansı əsər və ya yazıçı haqqında danışırıq? Əsərin əsas ideyası nə ola bilər, sənin fikrincə?';
    }

    // Fizika
    if (text.includes('fizika') || text.includes('qüvvə') || text.includes('enerji')) {
        return '⚡ Fizika sualı! Əla. Əvvəlcə düşünək: Bu hadisədə hansı fiziki qanunlar iştirak edə bilər? Ağlına nə gəlir?';
    }

    // Kömək
    if (text.includes('kömək') || text.includes('help') || text.includes('bilmirəm')) {
        return '🤔 Heç problem deyil, birlikdə həll edəcəyik! Mənə izah et: Dəqiq nəyi başa düşmürsən? Hansı hissədə çətinlik var?';
    }

    // Tapşırıq
    if (text.includes('tapşırıq') || text.includes('ev işi') || text.includes('homework')) {
        return '📝 Tapşırıq haqqında! Əvvəlcə mənə de: Tapşırığı oxudun? Nə tələb olunduğunu başa düşdün? Hansı hissəsi çətindir?';
    }

    // Sağol/Təşəkkür
    if (text.includes('sağ ol') || text.includes('təşəkkür') || text.includes('thanks')) {
        return 'Dəyməz! 🌟 Yenə sualın olsa, yaz. Sənin uğurun mənim uğurumdur!';
    }

    // Default Sokrat cavabı
    const socraticResponses = [
        `Maraqlı sual! 🎯 Gəl birlikdə düşünək: "${userText}" haqqında əvvəldən nə bilirsən?`,
        `Yaxşı mövzu! 💭 Bu barədə özün nə düşünürsən? Sənin ilkin fikrin nədir?`,
        `Anlayıram. 🤔 Bəs sənin fikrincə, bu problemin həlli hansı addımlardan ibarət ola bilər?`,
        `Bu sualı verməyinə sevindim! 📖 Əvvəlcə mənə de: Bu mövzuda hansı məlumatları artıq bilirsən?`,
        `Gözəl sual! 🧠 Sokrat deyərdi: "Düzgün sual yarı cavabdır." Sən bu problemi necə formalaşdırardın?`
    ];

    return socraticResponses[Math.floor(Math.random() * socraticResponses.length)];
}

async function sendToEduBot(event) {
    event.preventDefault();
    const input = document.getElementById('edubot-input');
    const text = input.value.trim();
    if (!text) return;

    edubotMessages.push({ role: 'user', text });
    input.value = '';
    renderEduBot();

    // Show typing indicator
    const typingMessage = { role: 'bot', text: '🤔 EduBot düşünü...', isTyping: true };
    edubotMessages.push(typingMessage);
    renderEduBot();

    try {
        // Call Gemini API
        const response = await fetch(`${API_BASE}/ai/edubot/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: text,
                context: edubotMessages.slice(-5).map(m => m.text).join(' | ') // Send last 5 messages as context
            })
        });

        const data = await response.json();

        // Remove typing indicator
        edubotMessages.pop();

        if (data.success) {
            edubotMessages.push({ role: 'bot', text: data.response });
        } else {
            // Use fallback response
            edubotMessages.push({ role: 'bot', text: data.fallback || 'Üzr istəyirik, AI xidməti müvəqqəti olaraq əlçatan deyil.' });
        }
    } catch (error) {
        console.error('EduBot API error:', error);
        // Remove typing indicator
        edubotMessages.pop();

        // Use fallback EduBot response
        const fallbackResponse = getEduBotResponse(text);
        edubotMessages.push({ role: 'bot', text: fallbackResponse });
    }

    renderEduBot();
}

function showTeacherTasks() {
    hideAllPanels();
    mainContentArea.classList.remove('hidden');
    teacherDashboard.classList.add('hidden');
    teacherPanel.classList.remove('hidden');
    clearActiveNav();
    navMain.classList.add('active');
}

// --- RENDER FUNKSİYALARI ---
function renderPoints() {
    const pointsEl = document.getElementById('user-points');
    if (pointsEl) pointsEl.textContent = userPoints;

    // Also update chest panel balance
    const chestPointsEl = document.getElementById('chest-user-points');
    if (chestPointsEl) chestPointsEl.textContent = userPoints;

    // Also update shop balance if exists
    const shopPointsEl = document.getElementById('shop-user-points');
    if (shopPointsEl) shopPointsEl.textContent = userPoints;
    const badgesContainer = document.getElementById('badges-container');
    badgesContainer.innerHTML = '';

    badges.forEach(badge => {
        badgesContainer.innerHTML += `
                <div class="badge-card ${badge.earned ? 'earned' : ''}">
                    <div class="certification-id">${badge.certificationId}</div>
                    <div class="badge-icon">${badge.icon}</div>
                    <h4>${badge.name}</h4>
                    <p>${badge.description}</p>
                    ${badge.earned ? `<small style="color: var(--secondary-color); font-weight: bold;">+${badge.points} xal</small>` : ''}
                </div>
            `;
    });
}

function renderLeaderboard() {
    const podium = document.getElementById('leaderboard-podium');
    const fullList = document.getElementById('full-leaderboard');

    podium.innerHTML = '';
    fullList.innerHTML = '';

    const sortedLeaderboard = [...leaderboard].sort((a, b) => b.points - a.points);

    // Podium (top 3)
    if (sortedLeaderboard.length >= 3) {
        const positions = ['second', 'first', 'third'];
        const topThree = [sortedLeaderboard[1], sortedLeaderboard[0], sortedLeaderboard[2]];

        topThree.forEach((user, index) => {
            if (user) {
                podium.innerHTML += `
                        <div class="podium-place ${positions[index]}">
                            <div class="avatar">${avatars[user.avatar]}</div>
                            <h3>${user.name}</h3>
                            <p>${user.points} xal</p>
                        </div>
                    `;
            }
        });
    }

    // Full list
    sortedLeaderboard.forEach((user, index) => {
        fullList.innerHTML += `
                <div style="display:flex;align-items:center;padding:10px;border-bottom:1px solid #eee;">
                    <span style="font-weight:bold;margin-right:15px;">${index + 1}.</span>
                    <div style="width:30px;height:30px;margin-right:10px;">${avatars[user.avatar]}</div>
                    <span style="flex-grow:1;">${user.name} (${user.class})</span>
                    <span style="font-weight:bold;color:var(--primary-color);">${user.points} xal</span>
                </div>
            `;
    });
}

// Load class wall from API
async function loadWallFromAPI() {
    if (!currentUser) return;

    const classId = currentUser.class_id || 1;
    try {
        const response = await fetch(`${API_BASE}/chat/wall/${classId}`, {
            credentials: 'include'
        });
        if (response.ok) {
            const posts = await response.json();
            wallPosts = posts.map(p => ({
                id: p.id,
                author: p.author,
                content: p.content,
                avatar: p.avatar,
                timestamp: new Date(p.created_at),
                isQuestion: p.is_question === 1,
                userId: p.user_id
            }));
            renderClassWall();
        }
    } catch (error) {
        console.error('Failed to load wall posts:', error);
    }
}

function renderClassWall() {
    const wallPostsContainer = document.getElementById('wall-posts');
    if (!wallPostsContainer) return;

    wallPostsContainer.innerHTML = '';

    if (wallPosts.length === 0) {
        wallPostsContainer.innerHTML = '<div class="card"><p style="text-align:center;color:#888;">Hələ heç bir paylaşım yoxdur.</p></div>';
        return;
    }

    const sortedPosts = [...wallPosts].sort((a, b) => b.timestamp - a.timestamp);

    sortedPosts.forEach(post => {
        const timeAgo = Math.floor((Date.now() - post.timestamp) / (1000 * 60 * 60));
        let timeText = timeAgo < 1 ? 'İndicə' : `${timeAgo} saat əvvəl`;
        if (timeAgo >= 24) timeText = Math.floor(timeAgo / 24) + ' gün əvvəl';

        // Admin or teacher can delete any post, users can only delete their own
        const isOwn = currentUser && post.userId === currentUser.id;
        const badgeMarkup = renderUserBadge(post.userId);
        const canDelete = isOwn || currentUserRole === 'teacher' || currentUserRole === 'admin';
        const deleteBtn = canDelete ? `<button class="delete-post-btn" onclick="deletePost(${post.id})" title="Sil" style="position:absolute;top:10px;right:10px;background:none;border:none;cursor:pointer;font-size:18px;color:#ccc;">×</button>` : '';

        wallPostsContainer.innerHTML += `
            <div class="post-item" style="position:relative;background:white;border-radius:12px;padding:20px;margin-bottom:20px;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
                ${deleteBtn}
                <div class="post-header" style="display:flex;align-items:center;margin-bottom:15px;">
                    <div class="avatar" style="width:45px;height:45px;background:#f0f0f0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;margin-right:12px;">
                        ${avatars[post.avatar] || '👤'}
                    </div>
                    <div class="user-info">
                        <h5 style="margin:0;font-size:16px;">${post.author} ${badgeMarkup}</h5>
                        <span style="font-size:13px;color:#888;">${timeText}</span>
                    </div>
                </div>
                <div class="post-content" style="font-size:15px;line-height:1.6;color:#333;margin-bottom:15px;">${post.content}</div>
                <div class="post-actions" style="display:flex;gap:15px;border-top:1px solid #f0f0f0;padding-top:10px;">
                    <button style="background:none;border:none;color:#666;cursor:pointer;font-size:14px;display:flex;align-items:center;gap:5px;">👍 Bəyən</button>
                    <button onclick="answerQuestion(${post.id})" style="background:none;border:none;color:#666;cursor:pointer;font-size:14px;display:flex;align-items:center;gap:5px;">💬 Cavabla</button>
                    ${!isOwn && currentUserRole !== 'admin' ? `<button onclick="showReportModal(${post.id}, 'wall')" style="background:none;border:none;color:#ff6b35;cursor:pointer;font-size:14px;display:flex;align-items:center;gap:5px;opacity:0.7;">⚠️ Şikayət</button>` : ''}
                </div>
            </div>
        `;
    });
}

function answerQuestion(postId) {
    mentorAnswers++;
    awardPoints(5, 'Sual cavablandırdınız');
    checkBadges();
    showToast('Sual cavablandırdığınız üçün +5 xal!', 'success');
}

function renderClassManagement() {
    const tabsContainer = document.getElementById('class-tabs-container');
    const studentsContainer = document.getElementById('current-class-students');

    // Render class tabs
    tabsContainer.innerHTML = '';
    Object.keys(classes).forEach(className => {
        tabsContainer.innerHTML += `
                <div class="class-tab ${className === currentClass ? 'active' : ''}" onclick="switchClass('${className}')">${className}</div>
            `;
    });

    studentsContainer.innerHTML = '';
    const currentClassStudents = classes[currentClass] || [];

    currentClassStudents.forEach(student => {
        studentsContainer.innerHTML += `
                <div class="student-card">
                    <div class="avatar">${avatars[student.avatar]}</div>
                    <h4>${student.name}</h4>
                    <p>${student.points} xal</p>
                    ${currentUserRole === 'admin' ? `<button onclick="removeStudent('${currentClass}', '${student.name}')" style="background:var(--danger-color);color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;margin-top:10px;">Sil</button>` : ''}
                </div>
            `;
    });

    // Add student form for admin
    if (currentUserRole === 'admin') {
        studentsContainer.innerHTML += `
                <div class="student-card" style="border: 2px dashed #ddd;">
                    <div style="text-align: center;">
                        <h4>Yeni Şagird</h4>
                        <form onsubmit="addStudent(event, '${currentClass}')">
                            <input type="text" name="studentName" placeholder="Şagird adı" required style="width: 100%; margin-bottom: 10px; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                            <button type="submit" style="background:var(--primary-color);color:white;border:none;padding:8px 15px;border-radius:5px;cursor:pointer;">Əlavə Et</button>
                        </form>
                    </div>
                </div>
            `;
    }
}

function renderLiveClassPanel() {
    const teacherSection = document.getElementById('teacher-live-class-section');
    const studentSection = document.getElementById('student-live-class-section');

    if (currentUserRole === 'teacher' || currentUserRole === 'admin') {
        teacherSection.classList.remove('hidden');
        studentSection.classList.add('hidden');

        // Populate class options
        const meetingClassSelect = document.getElementById('meeting-class');
        meetingClassSelect.innerHTML = '<option value="">Sinif seçin</option>';
        Object.keys(classes).forEach(className => {
            meetingClassSelect.innerHTML += `<option value="${className}">${className}</option>`;
        });

        renderActiveMeetings();
    } else {
        teacherSection.classList.add('hidden');
        studentSection.classList.remove('hidden');
        renderStudentMeetings();
    }
}

function renderActiveMeetings() {
    const activeMeetingsContainer = document.getElementById('active-meetings');
    activeMeetingsContainer.innerHTML = '<h3>Aktiv Görüşlər</h3>';

    if (meetings.length === 0) {
        activeMeetingsContainer.innerHTML += '<p>Aktiv görüş yoxdur.</p>';
        return;
    }

    meetings.forEach(meeting => {
        const meetingDate = new Date(meeting.datetime);
        activeMeetingsContainer.innerHTML += `
                <div class="card" style="margin-bottom: 15px;">
                    <h4>${meeting.title}</h4>
                    <p><strong>Sinif:</strong> ${meeting.class}</p>
                    <p><strong>Tarix:</strong> ${meetingDate.toLocaleString('az-AZ')}</p>
                    <p><strong>Platform:</strong> ${meeting.platform}</p>
                    <div class="meeting-link">
                        <strong>Link:</strong> <a href="${meeting.link}" target="_blank">${meeting.link}</a>
                    </div>
                    <button onclick="deleteMeeting(${meeting.id})" style="background:var(--danger-color);color:white;border:none;padding:8px 15px;border-radius:5px;cursor:pointer;margin-top:10px;">Sil</button>
                </div>
            `;
    });
}

function renderStudentMeetings() {
    const studentMeetingsContainer = document.getElementById('student-meetings');
    const studentMeetings = meetings.filter(m => m.class === '10F');

    studentMeetingsContainer.innerHTML = '';
    if (studentMeetings.length === 0) {
        studentMeetingsContainer.innerHTML = '<div class="card"><p>Aktiv görüş yoxdur.</p></div>';
        return;
    }

    studentMeetings.forEach(meeting => {
        const meetingDate = new Date(meeting.datetime);
        const isUpcoming = meetingDate > new Date();

        studentMeetingsContainer.innerHTML += `
                <div class="card" style="margin-bottom: 15px;">
                    <h4>${meeting.title}</h4>
                    <p><strong>Tarix:</strong> ${meetingDate.toLocaleString('az-AZ')}</p>
                    <p><strong>Platform:</strong> ${meeting.platform}</p>
                    ${isUpcoming ?
                `<a href="${meeting.link}" target="_blank" class="action-btn" style="background:var(--primary-color);width:auto;padding:10px 20px;text-decoration:none;">Görüşə Qoşul</a>` :
                `<p style="color: var(--text-color);">Görüş başa çatıb</p>`
            }
                </div>
            `;
    });
}

function renderQuizPanel() {
    const teacherSection = document.getElementById('teacher-quiz-section');
    const studentSection = document.getElementById('student-quiz-section');

    if (currentUserRole === 'teacher' || currentUserRole === 'admin') {
        teacherSection.classList.remove('hidden');
        studentSection.classList.add('hidden');
        renderTeacherQuizzes();
    } else {
        teacherSection.classList.add('hidden');
        studentSection.classList.remove('hidden');
        renderStudentQuizzes();
    }
}

function renderTeacherQuizzes() {
    const quizList = document.getElementById('quiz-list');
    quizList.innerHTML = '';

    quizzes.forEach(quiz => {
        quizList.innerHTML += `
                <div class="quiz-card">
                    <h4>${quiz.title}</h4>
                    <p>Sinif: ${quiz.class}</p>
                    <p>Suallar: ${quiz.questions.length}</p>
                    <button class="action-btn" style="background:var(--primary-color);width:auto;padding:8px 15px;" onclick="viewQuizResults(${quiz.id})">Nəticələri Gör</button>
                </div>
            `;
    });
}

function renderStudentQuizzes() {
    const studentQuizList = document.getElementById('student-quiz-list');
    studentQuizList.innerHTML = '';

    const availableQuizzes = quizzes.filter(q => q.class === '10F');
    availableQuizzes.forEach(quiz => {
        const statusText = quiz.completed ? `Tamamlandı (${quiz.score}/${quiz.questions.length})` : 'Başla';
        const buttonStyle = quiz.completed ? 'background:#6c757d;' : 'background:var(--primary-color);';

        studentQuizList.innerHTML += `
                <div class="quiz-card">
                    <h4>${quiz.title}</h4>
                    <p>Suallar: ${quiz.questions.length}</p>
                    <button class="action-btn" style="${buttonStyle}width:auto;padding:8px 15px;" onclick="startQuiz(${quiz.id})" ${quiz.completed ? 'disabled' : ''}>
                        ${statusText}
                    </button>
                </div>
            `;
    });
}

function renderAdminPanel() {
    // Update admin statistics
    const totalStudents = Object.values(classes).reduce((sum, classStudents) => sum + classStudents.length, 0);
    document.getElementById('total-students').textContent = totalStudents;
    document.getElementById('total-assignments').textContent = assignments.length;
    document.getElementById('total-quizzes').textContent = quizzes.length;

    // Render classes list
    const adminClassesList = document.getElementById('admin-classes-list');
    adminClassesList.innerHTML = '';

    Object.keys(classes).forEach(className => {
        const studentCount = classes[className].length;
        adminClassesList.innerHTML += `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;border-bottom:1px solid #eee;">
                    <div>
                        <strong>${className}</strong> - ${studentCount} şagird
                    </div>
                    <button onclick="deleteClass('${className}')" style="background:var(--danger-color);color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">Sil</button>
                </div>
            `;
    });
}

function renderResources() {
    resourcesListSection.innerHTML = '';

    if (currentOERTab === 'local') {
        if (resources.length === 0) {
            resourcesListSection.innerHTML = '<div class="card"><p>Heç bir resurs əlavə edilməyib.</p></div>';
            return;
        }

        resources.forEach((res, index) => {
            resourcesListSection.innerHTML += `
                    <div class="card" style="animation-delay: ${index * 0.1}s;">
                        <h4>${res.title}</h4>
                        <p>${res.description}</p>
                        <a href="${res.link}" target="_blank" class="action-btn" style="background:var(--primary-color);width:auto;padding:8px 15px;font-size:0.9em;">Keçid et</a>
                    </div>
                `;
        });
    } else {
        // Global OER resources
        globalOERResources.forEach((res, index) => {
            resourcesListSection.innerHTML += `
                    <div class="oer-resource" style="animation-delay: ${index * 0.1}s;">
                        <h4>${res.title}<span class="source-badge">${res.source}</span></h4>
                        <p>${res.description}</p>
                        <a href="${res.link}" target="_blank" class="action-btn" style="background:var(--primary-color);width:auto;padding:8px 15px;font-size:0.9em;">Keçid et</a>
                    </div>
                `;
        });
    }
}

function updateClassSelectors() {
    // Update all class selectors when classes change
    const selectors = ['task-class', 'quiz-class', 'meeting-class'];
    selectors.forEach(selectorId => {
        const selector = document.getElementById(selectorId);
        if (selector) {
            const currentValue = selector.value;
            selector.innerHTML = '<option value="">Sinif seçin</option>';
            Object.keys(classes).forEach(className => {
                selector.innerHTML += `<option value="${className}" ${className === currentValue ? 'selected' : ''}>${className}</option>`;
            });
        }
    });
}

function updateDashboard(role, username) {
    // Calculate stats based on user-specific submissions
    const userSubmissions = getSubmissions();
    const newTasksCount = assignments.filter(t => {
        const sub = userSubmissions[t.id];
        const isSubmitted = sub ? sub.status === 'submitted' : t.status === 'submitted';
        return !isSubmitted; // If not submitted, it's new (active)
    }).length;

    const submittedTasksCount = assignments.filter(t => {
        const sub = userSubmissions[t.id];
        return sub ? sub.status === 'submitted' : t.status === 'submitted';
    }).length;

    if (role === 'student') {
        // Check Streak
        checkStreak();

        // Calculate Level Progress
        const levelProgress = ((userXP % 1000) / 1000) * 100;

        userInfoHeader.innerHTML = `
                <div style="display:flex;align-items:center;">
                    <div style="margin-right:10px;">
                        <h4>${username}</h4>
                        <div class="xp-container">
                            <div class="xp-info">
                                <span>Səviyyə ${userLevel}</span>
                                <span>${userXP % 1000}/1000 XP</span>
                            </div>
                            <div class="xp-bar">
                                <div class="xp-fill" style="width: ${levelProgress}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        // Show Streak and Pomodoro
        const streakContainer = document.getElementById('streak-container');
        if (streakContainer) streakContainer.classList.remove('hidden');
        const streakCount = document.getElementById('streak-count');
        if (streakCount) streakCount.textContent = userStreak;
        const pomodoroContainer = document.getElementById('pomodoro-container');
        if (pomodoroContainer) pomodoroContainer.classList.remove('hidden');

        welcomeBanner.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
                <div>
                    <h1 style="margin:0;font-size:1.8em;">👋 Xoş gəldin, ${username}!</h1>
                    <p style="margin-top:10px;opacity:0.9;font-size:1.1em;">Yeni tapşırıqların səni gözləyir. Uğurlar!</p>
                </div>
                <div style="font-size:4em;opacity:0.8;">📚</div>
            </div>
        `;

        // Show grade average and EduBot report
        const gradeAverageSection = document.getElementById('grade-average-section');
        if (gradeAverageSection) gradeAverageSection.classList.remove('hidden');
        const gradeAverage = document.getElementById('grade-average');
        if (gradeAverage) gradeAverage.textContent = calculateGradeAverage();
        const edubotReportText = document.getElementById('edubot-report-text');
        if (edubotReportText) edubotReportText.textContent = generateEduBotReport();
        if (typeof renderForgettingCurve === 'function') renderForgettingCurve();

        statsGrid.innerHTML = `
                <div class="stat-card" style="animation-delay: 0.1s; cursor: pointer;" onclick="document.getElementById('student-task-list').scrollIntoView({behavior: 'smooth', block: 'start'})">
                    <div class="icon" style="background:#e3e7fe;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                    </div>
                    <div class="info">
                        <h3>${newTasksCount}</h3>
                        <p>Aktiv Tapşırıq</p>
                    </div>
                </div>
                <div class="stat-card" style="animation-delay: 0.2s;">
                    <div class="icon" style="background:#e2f7e7;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-color)" stroke-width="2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                    </div>
                    <div class="info">
                        <h3>${submittedTasksCount}</h3>
                        <p>Təhvil Verilən</p>
                    </div>
                </div>
                <div class="stat-card" style="animation-delay: 0.3s;">
                    <div class="icon" style="background:#fff3cd;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffc107" stroke-width="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </div>
                    <div class="info">
                        <h3>${userPoints}</h3>
                        <p>Ümumi Xal</p>
                    </div>
                </div>
            `;
    } else if (role === 'teacher') {
        userInfoHeader.innerHTML = `<h4>Hüseyn M.</h4><p>Müəllim</p>`;
        welcomeBanner.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
                <div>
                    <h1 style="margin:0;font-size:1.8em;">👨‍🏫 Salam, Hüseyn müəllim!</h1>
                    <p style="margin-top:10px;opacity:0.9;font-size:1.1em;">Bu gün üçün planınız nədir?</p>
                </div>
                <div style="font-size:4em;opacity:0.8;">📋</div>
            </div>
        `;
        teacherDashboard.classList.remove('hidden');
        teacherPanel.classList.add('hidden');
        studentPanel.classList.add('hidden');
        document.getElementById('grade-average-section').classList.add('hidden');
        const pomodoroContainer = document.getElementById('pomodoro-container');
        if (pomodoroContainer) pomodoroContainer.classList.add('hidden');
        statsGrid.innerHTML = '';
    } else if (role === 'admin') {
        userInfoHeader.innerHTML = `<h4>Feridhuseyn</h4><p>Administrator</p>`;
        welcomeBanner.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
                <div>
                    <h1 style="margin:0;font-size:1.8em;">⚙️ Admin Panel</h1>
                    <p style="margin-top:10px;opacity:0.9;font-size:1.1em;">Sistem idarəçiliyi və konfiqurasiya</p>
                </div>
                <div style="font-size:4em;opacity:0.8;">🛠️</div>
            </div>
        `;
        welcomeBanner.className = 'welcome-banner admin-banner';
        document.getElementById('grade-average-section').classList.add('hidden');
        const pomodoroContainer = document.getElementById('pomodoro-container');
        if (pomodoroContainer) pomodoroContainer.classList.add('hidden');
        statsGrid.innerHTML = '';
    }
}

function renderStudentTasks() {
    studentTaskList.innerHTML = '';
    // Filter assignments by user's class
    const userClassName = currentUser?.class_name || '10F';
    const classAssignments = assignments.filter(a => a.class === userClassName);
    const tasks = [
        ...classAssignments.filter(t => t.status === 'new'),
        ...classAssignments.filter(t => t.status === 'submitted' || t.status === 'graded')
    ];

    if (tasks.length === 0) {
        studentTaskList.innerHTML = `
            <div class="card" style="text-align:center;padding:50px 30px;animation-delay:0.3s;">
                <div style="font-size:5em;margin-bottom:20px;opacity:0.8;">🎉</div>
                <h3 style="color:var(--primary-color);margin-bottom:15px;font-size:1.5em;">Əla! Bütün tapşırıqlar tamamdır!</h3>
                <p style="color:#666;font-size:1.1em;margin-bottom:25px;">Hal-hazırda sizin üçün yeni tapşırıq yoxdur.</p>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;text-align:left;margin-top:30px;">
                    <div style="background:#f8f9fa;padding:15px;border-radius:12px;border-left:4px solid var(--primary-color);">
                        <strong style="color:var(--primary-color);">💡 Tövsiyə</strong>
                        <p style="font-size:0.9em;margin-top:5px;color:#666;">EduBot-dan mövzular haqqında sual soruşun</p>
                    </div>
                    <div style="background:#f8f9fa;padding:15px;border-radius:12px;border-left:4px solid var(--secondary-color);">
                        <strong style="color:var(--secondary-color);">📚 Resurslar</strong>
                        <p style="font-size:0.9em;margin-top:5px;color:#666;">Tədris materiallarını nəzərdən keçirin</p>
                    </div>
                    <div style="background:#f8f9fa;padding:15px;border-radius:12px;border-left:4px solid #ffc107;">
                        <strong style="color:#e6a800;">🏆 Yarışlar</strong>
                        <p style="font-size:0.9em;margin-top:5px;color:#666;">Aktiv yarışlarda iştirak edin və xal qazanın</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // Group tasks by subject (title)
    const groupedTasks = {};
    tasks.forEach(task => {
        if (!groupedTasks[task.title]) {
            groupedTasks[task.title] = [];
        }
        groupedTasks[task.title].push(task);
    });

    Object.keys(groupedTasks).forEach((subject, groupIndex) => {
        const subjectTasks = groupedTasks[subject];
        const containerId = `subject-tasks-${groupIndex}`;
        const newCount = subjectTasks.filter(t => t.status === 'new').length;

        let tasksHTML = '';
        const userSubmissions = getSubmissions();

        subjectTasks.forEach((task, index) => {
            const submission = userSubmissions[task.id];
            const status = submission ? submission.status : (task.status || 'new');
            const isSubmittedCheck = status === 'submitted' || status === 'graded';
            const submittedFile = submission ? submission.submittedFile : task.submittedFile;

            const timeInfo = formatTimeRemaining(task.deadline);
            const isOverdue = new Date(task.deadline) < new Date() && !isSubmittedCheck;

            let gradeFeedbackHTML = '';
            if (isSubmittedCheck && task.grade !== null && task.grade !== undefined) {
                gradeFeedbackHTML = `
                        <div class="grade-feedback-area">
                            <span class="grade">Qiymət: ${task.grade}/5</span>
                            <p class="feedback"><strong>Müəllim rəyi:</strong> ${task.feedback}</p>
                        </div>
                    `;
            }

            const questionFormHTML = `
                    <div class="question-area">
                        <form onsubmit="askQuestion(event, ${task.id})">
                            <textarea name="question" placeholder="Tapşırıqla bağlı sualınızı bura yazın..." required></textarea>
                            <button type="submit" class="action-btn" style="background:var(--primary-color);width:auto;padding:8px 15px;font-size:0.9em;margin-top:10px;">Sual Ver</button>
                        </form>
                    </div>
                `;

            tasksHTML += `
                    <div class="card task-card ${isSubmittedCheck ? 'submitted' : ''} ${isOverdue ? 'overdue' : ''}" style="margin-bottom:15px; animation-delay: ${0.1 * index}s;">
                        <div class="deadline ${timeInfo.class}">${timeInfo.text}</div>
                        <h4>${task.title}</h4>
                        <p>${task.description}</p>
                        ${gradeFeedbackHTML}
                        <div style="margin-top:20px;padding-top:20px;border-top:1px dashed #eee;">
                            ${!isSubmittedCheck && !isOverdue ?
                    `<form onsubmit="submitTask(event, ${task.id})">
                                    <div class="form-group">
                                        <label>Fayl yüklə (isteğe bağlı)</label>
                                        <input type="file" name="file">
                                    </div>
                                    <div class="form-group">
                                        <label>Mətn cavabı</label>
                                        <textarea name="text" placeholder="Cavabınızı bura yazın..." required></textarea>
                                    </div>
                                    <button type="submit" class="action-btn" style="background:var(--secondary-color);width:auto;padding:8px 15px;font-size:0.9em;margin-top:10px;">Təhvil Ver</button>
                                </form>` :
                    isSubmittedCheck ? `<div class="status">✓ Təhvil verildi${submittedFile ? ': ' + submittedFile : ''}</div>` :
                        `<div style="color:var(--danger-color);font-weight:600;">⚠ Vaxt bitib</div>`
                }
                        </div>
                        ${questionFormHTML}
                    </div>
                `;
        });

        studentTaskList.innerHTML += `
            <div class="card subject-card" onclick="toggleSubject('${containerId}')" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-left: 4px solid var(--primary-color); transition: all 0.2s ease;">
                <div>
                    <h3 style="margin:0; color:var(--text-primary); font-size: 1.2em;">${subject}</h3>
                    <p style="margin:5px 0 0; color:var(--text-secondary); font-size:0.9em;">
                        ${subjectTasks.length} Tapşırıq ${newCount > 0 ? `<span class="badge" style="background:var(--accent-orange); color:white; padding:2px 8px; border-radius:10px; font-size:0.8em; margin-left:5px;">${newCount} Yeni</span>` : ''}
                    </p>
                </div>
                <div style="font-size:1.2em; color:var(--primary-color);">
                   &#9662;
                </div>
            </div>
            <div id="${containerId}" class="subject-tasks-container hidden" style="padding-left:10px; margin-bottom: 20px;">
                ${tasksHTML}
            </div>
        `;
    });
}

function getSubmissions() {
    if (!currentUser) return {};
    return JSON.parse(localStorage.getItem(`submissions_${currentUser.id}`) || '{}');
}

function saveSubmission(taskId, submissionData) {
    if (!currentUser) return;
    const submissions = getSubmissions();
    submissions[taskId] = submissionData;
    localStorage.setItem(`submissions_${currentUser.id}`, JSON.stringify(submissions));

    // Also update global assignments array for immediate UI reflection if needed (optional)
    // but the source of truth for rendering will be getSubmissions()
}

async function submitTask(event, taskId) {
    event.preventDefault();
    const form = event.target;
    const text = form.text.value.trim();
    const file = form.file.files[0];

    if (!text && !file) {
        showToast('Zəhmət olmasa mətn cavabı yazın və ya fayl yükləyin.', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/assignments/${taskId}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                content: text || null,
                filePath: file ? file.name : null
            })
        });

        const data = await response.json();
        if (!response.ok) {
            showToast(data.error || 'Tapşırıq göndərmək mümkün olmadı.', 'error');
            return;
        }

        saveSubmission(taskId, {
            submittedText: text || null,
            submittedFile: file ? file.name : null,
            status: 'submitted',
            submittedAt: new Date().toISOString()
        });

        if (typeof loadAssignmentsFromAPI === 'function') {
            await loadAssignmentsFromAPI();
        }

        showToast('Tapşırıq uğurla təhvil verildi!', 'success');
        form.reset();
        renderStudentTasks();
        updateDashboard('student', currentUsername);
    } catch (error) {
        console.error('Submit assignment error:', error);
        showToast('Server xətası.', 'error');
    }
}

function toggleSubject(id) {
    const container = document.getElementById(id);
    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        container.style.animation = 'slideUp 0.3s ease-out';
    } else {
        container.classList.add('hidden');
    }
}

function renderTeacherSubmissions() {
    teacherSubmissionList.innerHTML = '';
    const submittedTasks = assignments.filter(task => task.status === 'submitted').reverse();

    if (submittedTasks.length === 0) {
        teacherSubmissionList.innerHTML = '<div class="card" style="animation-delay:0.3s;"><p>Hələlik təhvil verilmiş iş yoxdur.</p></div>';
        return;
    }

    submittedTasks.forEach((task, index) => {
        const aiAnalysisHTML = task.aiAnalysis ? `
                <div class="ai-analysis-area">
                    <div class="ai-analysis-header">
                        <strong>AI Analiz Nəticəsi</strong>
                    </div>
                    <div class="ai-analysis-section">
                        <h5>Plagiat Yoxlaması:</h5>
                        <p class="plagiarism-warning">${task.aiAnalysis.plagiarism}</p>
                    </div>
                    <div class="ai-analysis-section">
                        <h5>Əsas Arqumentlər:</h5>
                        <p>${task.aiAnalysis.mainPoints}</p>
                    </div>
                    <div class="ai-analysis-section">
                        <h5>Təklif:</h5>
                        <p class="ai-suggestion">${task.aiAnalysis.suggestion}</p>
                    </div>
                </div>
            ` : '';

        // Code analysis for math/programming assignments
        const codeAnalysisHTML = task.submittedText && (task.title.toLowerCase().includes('riyaziyyat') || task.title.toLowerCase().includes('kod')) ? `
                <div class="code-analysis-area">
                    <div class="ai-analysis-header">
                        <strong>Kod/Riyazi Həll Analizi</strong>
                    </div>
                    <div id="code-result-${task.id}"></div>
                    ${!task.codeAnalyzed ? `<button onclick="analyzeCode(${task.id})" class="action-btn" style="background:#17a2b8;width:auto;padding:8px 15px;font-size:0.9em;margin-bottom:15px;">Həlli Yoxla</button>` : ''}
                </div>
            ` : '';

        const gradingFormHTML = task.grade ?
            `<div class="grade-feedback-area"><span class="grade">Qiymətləndirilib: ${task.grade}/5</span></div>` :
            `<div class="grading-area">
                    ${!task.aiAnalysis ? `<button onclick="analyzeWithAI(${task.id})" class="action-btn" style="background:#ff9800;width:auto;padding:8px 15px;font-size:0.9em;margin-bottom:15px;">AI Analiz Et</button>` : ''}
                    <form onsubmit="gradeTask(event, ${task.id})">
                        <label>Qiymət (1-5):</label>
                        <input type="number" name="grade" min="1" max="5" required style="width:60px;padding:8px;border:1px solid #ddd;border-radius:5px;margin:0 10px;">
                        <label>Rəy:</label>
                        <textarea name="feedback" required></textarea>
                        <button type="submit" class="action-btn" style="background:var(--secondary-color);width:auto;padding:8px 15px;font-size:0.9em;margin-top:10px;">Qiymətləndir</button>
                    </form>
                </div>`;

        teacherSubmissionList.innerHTML += `
                <div class="card" style="margin-bottom:20px; animation-delay: ${0.3 + index * 0.1}s;">
                    <p style="margin:0;"><strong>Şagird:</strong> Ferid (10F)</p>
                    <p style="margin:5px 0;"><strong>Tapşırıq:</strong> ${task.title}</p>
                    ${task.submittedFile ? `<p style="margin:0; font-weight:600; color:var(--primary-color);">${task.submittedFile}</p>` : ''}
                    ${task.submittedText ? `<div style="margin:10px 0; padding:10px; background:#f8f9fa; border-radius:5px; border-left:3px solid var(--primary-color);"><strong>Mətn cavabı:</strong><br>${task.submittedText}</div>` : ''}
                    ${aiAnalysisHTML}
                    ${codeAnalysisHTML}
                    ${gradingFormHTML}
                </div>
            `;
    });
}

function renderTeacherQuestions() {
    teacherQuestionsList.innerHTML = '';
    let hasQuestions = false;

    assignments.forEach(task => {
        if (task.questions.length > 0) {
            hasQuestions = true;
            task.questions.forEach(q => {
                teacherQuestionsList.innerHTML += `
                        <div class="card question-card" style="margin-bottom:20px;">
                            <p style="margin:0;"><strong>Şagird:</strong> ${q.student}</p>
                            <p style="margin:5px 0;"><strong>Tapşırıq:</strong> ${task.title}</p>
                            <p style="margin:0; font-style:italic;"><strong>Sual:</strong> "${q.text}"</p>
                        </div>
                    `;
            });
        }
    });

    if (!hasQuestions) {
        teacherQuestionsList.innerHTML = '<div class="card"><p>Yeni sual yoxdur.</p></div>';
    }
}

// --- ƏSAS FUNKSİYALAR ---
function openProfileModal() {
    avatarGrid.innerHTML = '';
    avatars.forEach(svgString => {
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar-option';
        avatarDiv.innerHTML = svgString;
        avatarDiv.onclick = () => selectAvatar(svgString);
        avatarGrid.appendChild(avatarDiv);
    });
    renderProfileInventory();
    profileModalWrapper.classList.add('visible');
}

function closeProfileModal() {
    profileModalWrapper.classList.remove('visible');
}

function selectAvatar(svgString) {
    currentUserAvatar = svgString;
    headerAvatar.innerHTML = currentUserAvatar;
    applyEquippedItemsToHeaderAvatar();
}

function applyEquippedItemsToHeaderAvatar() {
    if (!headerAvatar || !currentUserAvatar) return;
    headerAvatar.innerHTML = currentUserAvatar;
    const slots = ['head', 'face', 'effect', 'badge'];
    slots.forEach(slot => {
        const itemId = equippedItems[slot];
        if (!itemId) return;
        const accessory = document.createElement('div');
        accessory.className = `avatar-accessory avatar-${slot}`;
        accessory.textContent = getItemIcon(itemId);
        headerAvatar.appendChild(accessory);
    });
}

function switchClass(className) {
    currentClass = className;
    document.querySelectorAll('.class-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    renderClassManagement();
}

function selectDifficulty(difficulty, element) {
    selectedDifficulty = difficulty;
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');
}



function deleteClass(className) {
    if (confirm(`${className} sinifini silmək istədiyinizə əminsiniz?`)) {
        delete classes[className];
        renderAdminPanel();
        updateClassSelectors();
        showToast(`${className} sinifi silindi`, 'info');
    }
}

function addStudent(event, className) {
    event.preventDefault();
    const studentName = event.target.studentName.value.trim();

    if (!studentName) return;

    if (!classes[className]) {
        classes[className] = [];
    }

    // Check if student already exists
    if (classes[className].some(s => s.name === studentName)) {
        showToast('Bu adda şagird artıq mövcuddur!', 'error');
        return;
    }

    classes[className].push({
        name: studentName,
        avatar: Math.floor(Math.random() * avatars.length),
        points: 0
    });

    event.target.reset();
    renderClassManagement();
    renderAdminPanel();
    showToast(`${studentName} əlavə edildi`, 'success');
}

function removeStudent(className, studentName) {
    if (confirm(`${studentName} şagirdini silmək istədiyinizə əminsiniz?`)) {
        classes[className] = classes[className].filter(s => s.name !== studentName);
        renderClassManagement();
        renderAdminPanel();
        showToast(`${studentName} silindi`, 'info');
    }
}

function addQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    const questionCount = questionsContainer.children.length;

    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.innerHTML = `
            <div class="form-group">
                <label>Sual ${questionCount}</label>
                <input type="text" name="question_${questionCount}" placeholder="Sualı yazın" required>
            </div>
            <div class="form-group">
                <label>Cavab A</label>
                <input type="text" name="option_${questionCount}_0" placeholder="A variantı" required>
            </div>
            <div class="form-group">
                <label>Cavab B</label>
                <input type="text" name="option_${questionCount}_1" placeholder="B variantı" required>
            </div>
            <div class="form-group">
                <label>Cavab C</label>
                <input type="text" name="option_${questionCount}_2" placeholder="C variantı" required>
            </div>
            <div class="form-group">
                <label>Cavab D</label>
                <input type="text" name="option_${questionCount}_3" placeholder="D variantı" required>
            </div>
            <div class="form-group">
                <label>Doğru cavab</label>
                <select name="correct_${questionCount}" required>
                    <option value="">Seçin</option>
                    <option value="0">A</option>
                    <option value="1">B</option>
                    <option value="2">C</option>
                    <option value="3">D</option>
                </select>
            </div>
            <button type="button" onclick="removeQuestion(this)" style="background:var(--danger-color);color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">Sualı Sil</button>
        `;

    questionsContainer.appendChild(questionDiv);
}

function removeQuestion(button) {
    button.parentElement.remove();
}

function startQuiz(quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz || quiz.completed) return;

    const quizTakingArea = document.getElementById('quiz-taking-area');
    const quizContent = document.getElementById('quiz-content');

    quizContent.innerHTML = `
            <h3>${quiz.title}</h3>
            <form id="quiz-taking-form" onsubmit="submitQuiz(event, ${quizId})">
                ${quiz.questions.map((q, index) => `
                    <div class="question-item">
                        <h5>${index + 1}. ${q.question}</h5>
                        <ul class="options-list">
                            ${q.options.map((option, optIndex) => `
                                <li>
                                    <input type="radio" name="question_${index}" value="${optIndex}" id="q${index}_${optIndex}" required>
                                    <label for="q${index}_${optIndex}">${option}</label>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
                <button type="submit" class="action-btn" style="background:var(--primary-color);">Testi Təhvil Ver</button>
            </form>
        `;

    document.getElementById('student-quiz-list').classList.add('hidden');
    quizTakingArea.classList.remove('hidden');
}

function submitQuiz(event, quizId) {
    event.preventDefault();
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    const formData = new FormData(event.target);
    let score = 0;
    let answers = [];

    quiz.questions.forEach((q, index) => {
        const userAnswer = parseInt(formData.get(`question_${index}`));
        answers.push(userAnswer);
        if (userAnswer === q.correct) {
            score++;
        }
    });

    quiz.completed = true;
    quiz.score = score;

    const percentage = Math.round((score / quiz.questions.length) * 100);
    const points = Math.round(percentage / 2); // 100% = 50 xal

    awardPoints(points, `${quiz.title} testini ${percentage}% ilə tamamladınız`);

    // Save to backend
    if (currentUser) {
        fetch(`${API_BASE}/classes/quizzes/${quizId}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ score, answers })
        }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log('Quiz result saved to server');
                }
            }).catch(err => console.error('Failed to save quiz result:', err));
    }

    document.getElementById('quiz-content').innerHTML = `
            <div class="quiz-results">
                <h3>Test Nəticəsi</h3>
                <p><strong>Doğru cavablar:</strong> ${score}/${quiz.questions.length}</p>
                <p><strong>Faiz:</strong> ${percentage}%</p>
                <p><strong>Qazanılan xal:</strong> +${points}</p>
                <button onclick="backToQuizList()" class="action-btn" style="background:var(--primary-color);width:auto;padding:10px 20px;">Geri</button>
            </div>
        `;
}


function backToQuizList() {
    document.getElementById('student-quiz-list').classList.remove('hidden');
    document.getElementById('quiz-taking-area').classList.add('hidden');
    renderStudentQuizzes();
}

function viewQuizResults(quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    const quizTitle = quiz ? quiz.title : 'Test';

    // Create modal for results
    let modal = document.getElementById('quiz-results-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quiz-results-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <span class="close-modal" onclick="document.getElementById('quiz-results-modal').style.display='none'">&times;</span>
            <h2 style="margin-bottom: 20px;">📊 ${quizTitle} - Nəticələr</h2>
            <div id="quiz-results-list" style="max-height: 400px; overflow-y: auto;">
                <div style="text-align:center;padding:20px;">Yüklənir...</div>
            </div>
        </div>
    `;
    modal.style.display = 'flex';

    // Fetch results from backend
    fetch(`${API_BASE}/classes/quizzes/${quizId}/results`, {
        credentials: 'include'
    })
        .then(res => res.json())
        .then(results => {
            const container = document.getElementById('quiz-results-list');

            if (!Array.isArray(results) || results.length === 0) {
                container.innerHTML = '<p style="text-align:center;color:#666;">Hələ heç bir şagird bu testi tamamlamayıb.</p>';
                return;
            }

            let html = `
            <table style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr style="background:#f8f9fa;">
                        <th style="padding:12px;text-align:left;border-bottom:2px solid #ddd;">Şagird</th>
                        <th style="padding:12px;text-align:center;border-bottom:2px solid #ddd;">Nəticə</th>
                        <th style="padding:12px;text-align:center;border-bottom:2px solid #ddd;">Faiz</th>
                        <th style="padding:12px;text-align:right;border-bottom:2px solid #ddd;">Tarix</th>
                    </tr>
                </thead>
                <tbody>
        `;

            results.forEach(r => {
                const totalQuestions = quiz ? quiz.questions.length : r.score;
                const percentage = quiz ? Math.round((r.score / quiz.questions.length) * 100) : 0;
                const percentColor = percentage >= 70 ? '#28a745' : percentage >= 40 ? '#ffc107' : '#dc3545';
                const date = new Date(r.completed_at).toLocaleDateString('az-AZ', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                html += `
                <tr style="border-bottom:1px solid #eee;">
                    <td style="padding:12px;">${r.student_name}</td>
                    <td style="padding:12px;text-align:center;font-weight:bold;">${r.score}/${totalQuestions}</td>
                    <td style="padding:12px;text-align:center;">
                        <span style="background:${percentColor};color:white;padding:3px 10px;border-radius:12px;font-size:0.85em;">
                            ${percentage}%
                        </span>
                    </td>
                    <td style="padding:12px;text-align:right;color:#666;font-size:0.9em;">${date}</td>
                </tr>
            `;
            });

            html += '</tbody></table>';
            container.innerHTML = html;
        })
        .catch(err => {
            console.error('Failed to fetch quiz results:', err);
            document.getElementById('quiz-results-list').innerHTML = '<p style="color:#dc3545;text-align:center;">Nəticələr yüklənərkən xəta baş verdi.</p>';
        });
}


function deleteMeeting(meetingId) {
    if (confirm('Bu görüşü silmək istədiyinizə əminsiniz?')) {
        meetings = meetings.filter(m => m.id !== meetingId);
        renderActiveMeetings();
        showToast('Görüş silindi', 'info');
    }
}

function showRoleSelection() {
    roleScreen.classList.remove('hidden');
    loginScreen.classList.add('hidden');
}

function showLogin(role) {
    roleScreen.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    loginForm.reset();
    loginForm.role.value = role;
    loginForm.username.focus();
    loginScreen.querySelector('h1').textContent = (role === 'teacher') ? "Müəllim Girişi" : "Şagird Girişi";
    errorMessage.classList.add('hidden');
}

function logout() {
    body.classList.remove('panel-body');
    body.classList.add('login-body');
    loginSection.classList.remove('hidden');
    panelWrapper.classList.add('hidden');
    showRoleSelection();
    currentUserRole = '';
    notificationDropdown.classList.add('hidden');

    // Clear form fields to prevent username persistence
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    if (usernameField) usernameField.value = '';
    if (passwordField) passwordField.value = '';

    // Clear user info header
    if (userInfoHeader) userInfoHeader.innerHTML = '';

    // Reset avatar to default
    currentUserAvatar = avatars[0];
    if (headerAvatar) headerAvatar.innerHTML = currentUserAvatar;
}

// --- AI FUNKSİYALARI ---
async function analyzeWithAI(taskId) {
    const task = assignments.find(t => t.id === taskId);
    if (!task || !task.submittedText) {
        showToast('Analiz ediləcək mətn tapılmadı.', 'error');
        return;
    }

    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    loadingDiv.innerHTML = '<div class="loading-spinner"></div><span>Analiz edilir...</span>';

    const taskCard = document.querySelector(`[data-task-id="${taskId}"]`) || document.querySelector('.card');
    if (taskCard) taskCard.appendChild(loadingDiv);

    try {
        const response = await fetch(`${API_BASE}/ai/analyze-assignment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                title: task.title,
                content: task.submittedText
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Analiz uğursuz oldu');
        }

        task.aiAnalysis = data.analysis;

        loadingDiv.remove();
        renderTeacherSubmissions();
        showToast('AI analizi tamamlandı!', 'success');
    } catch (error) {
        if (loadingDiv.parentNode) loadingDiv.remove();
        showToast('AI analizi zamanı xəta baş verdi: ' + error.message, 'error');
        console.error(error);
    }
}

async function analyzeCode(taskId) {
    const task = assignments.find(t => t.id === taskId);
    if (!task || !task.submittedText) return;

    const resultDiv = document.getElementById(`code-result-${taskId}`);
    resultDiv.innerHTML = '<div class="loading-indicator"><div class="loading-spinner"></div><span>Kod analiz edilir...</span></div>';

    // Simple code execution simulation for math problems
    try {
        let result = '';
        let isCorrect = false;

        if (task.title.toLowerCase().includes('kvadrat')) {
            // Analyze quadratic equations
            const equations = task.submittedText.match(/x²[^=]*=[^,\n]*/g) || [];
            if (equations.length > 0) {
                result = `${equations.length} kvadrat tənlik tapıldı. `;
                // Simple validation - check if solutions are provided
                const solutions = task.submittedText.match(/x[₁₂]?\s*=\s*[-\d.]+/g) || [];
                if (solutions.length >= equations.length) {
                    result += 'Həllər təqdim edilib. ';
                    isCorrect = true;
                } else {
                    result += 'Bəzi həllər çatışmır. ';
                }
            }
        } else if (task.submittedText.includes('function') || task.submittedText.includes('def ')) {
            // Code analysis
            result = 'Kod strukturu analiz edildi. ';
            if (task.submittedText.includes('return')) {
                result += 'Return statement mövcuddur. ';
                isCorrect = true;
            }
        }

        task.codeAnalyzed = true;
        resultDiv.innerHTML = `
                <div class="code-result ${isCorrect ? 'success' : 'error'}">
                    <strong>Analiz Nəticəsi:</strong> ${result || 'Kod analiz edildi.'}
                    <br><strong>Status:</strong> ${isCorrect ? '✅ Düzgün' : '⚠️ Yoxlanmalı'}
                </div>
            `;
    } catch (error) {
        resultDiv.innerHTML = '<div class="code-result error">Kod analizi zamanı xəta baş verdi.</div>';
    }
}

async function getAIResponse(prompt) {
    try {
        const response = await fetch(`${API_BASE}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'AI cavabı alına bilmədi');
        }

        return data.response;
    } catch (error) {
        console.error('getAIResponse error:', error);
        throw error;
    }
}

async function generateSelfTest(subject, topic, difficulty) {
    // Check for non-educational topics
    const nonEducationalKeywords = [
        'oyun', 'video oyun', 'game', 'film', 'movie', 'serial', 'dizi',
        'futbol', 'idman', 'sport', 'maşın', 'car', 'telefon', 'phone',
        'moda', 'fashion', 'yemek', 'food', 'müzik', 'music'
    ];

    const isNonEducational = nonEducationalKeywords.some(keyword =>
        subject.toLowerCase().includes(keyword) || topic.toLowerCase().includes(keyword)
    );

    if (isNonEducational) {
        return { error: 'Bu mövzu təhsillə əlaqəli deyil. Zəhmət olmasa təhsil mövzusu daxil edin (məsələn: Riyaziyyat, Tarix, Fizika, Kimya və s.).' };
    }

    const difficultyText = {
        'easy': 'asan',
        'medium': 'orta',
        'hard': 'çətin'
    };

    const prompt = `
        "${subject}" fənnindən "${topic}" mövzusu üzrə ${difficultyText[difficulty]} səviyyədə 5 qapalı sual hazırla.

        Hər sual üçün 4 variant (A, B, C, D) ver və doğru cavabı qeyd et.
        Suallar təhsillə əlaqəli olmalıdır.

        Format:
        Sual 1: [sual mətni]
        A) [variant]
        B) [variant]
        C) [variant]
        D) [variant]
        Doğru cavab: [A/B/C/D]

        Əgər mövzu təhsillə əlaqəli deyilsə, "Bu mövzu təhsillə əlaqəli deyil" cavabını ver.
        `;

    try {
        const response = await getAIResponse(prompt);

        if (response.includes('təhsillə əlaqəli deyil')) {
            return { error: 'Bu mövzu təhsillə əlaqəli deyil. Zəhmət olmasa təhsil mövzusu daxil edin.' };
        }

        // Parse the response into structured questions
        const questions = parseAIQuestions(response);
        return { success: true, questions: questions };
    } catch (error) {
        return { error: 'Test yaradılarkən xəta baş verdi.' };
    }
}

function parseAIQuestions(response) {
    const questions = [];
    const lines = response.split('\n').filter(line => line.trim());

    let currentQuestion = null;
    let options = [];
    let correctAnswer = '';

    lines.forEach(line => {
        line = line.trim();

        if (line.startsWith('Sual')) {
            if (currentQuestion) {
                questions.push({
                    question: currentQuestion,
                    options: [...options],
                    correct: ['A', 'B', 'C', 'D'].indexOf(correctAnswer),
                    explanation: ''
                });
            }
            currentQuestion = line.replace(/^Sual \d+:\s*/, '');
            options = [];
            correctAnswer = '';
        } else if (line.match(/^[A-D]\)/)) {
            options.push(line.substring(3));
        } else if (line.includes('Doğru cavab:')) {
            correctAnswer = line.replace('Doğru cavab:', '').trim();
        }
    });

    // Add the last question
    if (currentQuestion) {
        questions.push({
            question: currentQuestion,
            options: [...options],
            correct: ['A', 'B', 'C', 'D'].indexOf(correctAnswer),
            explanation: ''
        });
    }

    return questions;
}

function renderSelfTestQuestions(questions) {
    const generatedTestDiv = document.getElementById('generated-test');

    generatedTestDiv.innerHTML = `
            <h3>Test Sualları</h3>
            <div id="self-test-questions">
                ${questions.map((q, index) => `
                    <div class="self-test-question">
                        <h4>${index + 1}. ${q.question}</h4>
                        <div class="self-test-options">
                            ${q.options.map((option, optIndex) => `
                                <div class="self-test-option" onclick="selectSelfTestOption(${index}, ${optIndex}, this)">
                                    ${String.fromCharCode(65 + optIndex)}) ${option}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <button onclick="finishSelfTest()" class="action-btn" style="background:var(--primary-color);margin-top:20px;">Testi Bitir</button>
        `;

    currentSelfTest = {
        questions: questions,
        answers: new Array(questions.length).fill(-1)
    };
}

function selectSelfTestOption(questionIndex, optionIndex, element) {
    // Remove previous selection
    const questionDiv = element.parentElement;
    questionDiv.querySelectorAll('.self-test-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Add selection to clicked option
    element.classList.add('selected');

    // Store answer
    if (currentSelfTest) {
        currentSelfTest.answers[questionIndex] = optionIndex;
    }
}

async function finishSelfTest() {
    if (!currentSelfTest) return;

    const questions = currentSelfTest.questions;
    const answers = currentSelfTest.answers;

    let score = 0;
    const results = [];

    questions.forEach((q, index) => {
        const isCorrect = answers[index] === q.correct;
        if (isCorrect) score++;

        results.push({
            question: q.question,
            userAnswer: answers[index],
            correctAnswer: q.correct,
            isCorrect: isCorrect,
            options: q.options
        });
    });

    const percentage = Math.round((score / questions.length) * 100);
    const points = Math.round(percentage / 4); // Self-test gives fewer points

    if (currentUserRole === 'student') {
        awardPoints(points, `Özünü yoxla testini ${percentage}% ilə tamamladınız`);
    }

    renderSelfTestResults(results, score, questions.length, percentage);
}

function renderSelfTestResults(results, score, total, percentage) {
    const generatedTestDiv = document.getElementById('generated-test');

    generatedTestDiv.innerHTML = `
            <h3>Test Nəticəsi</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p><strong>Doğru cavablar:</strong> ${score}/${total}</p>
                <p><strong>Faiz:</strong> ${percentage}%</p>
                ${currentUserRole === 'student' ? `<p><strong>Qazanılan xal:</strong> +${Math.round(percentage / 4)}</p>` : ''}
            </div>

            <h4>Səhv Cavablar və İzahlar</h4>
            <div id="wrong-answers">
                ${results.filter(r => !r.isCorrect).map((result, index) => `
                    <div class="self-test-question">
                        <h5>${result.question}</h5>
                        <div class="self-test-options">
                            ${result.options.map((option, optIndex) => {
        let className = 'self-test-option';
        if (optIndex === result.correctAnswer) className += ' correct';
        if (optIndex === result.userAnswer && optIndex !== result.correctAnswer) className += ' incorrect';

        return `<div class="${className}">
                                    ${String.fromCharCode(65 + optIndex)}) ${option}
                                    ${optIndex === result.correctAnswer ? ' ✓' : ''}
                                    ${optIndex === result.userAnswer && optIndex !== result.correctAnswer ? ' ✗' : ''}
                                </div>`;
    }).join('')}
                        </div>
                        <button class="explain-btn" onclick="explainAnswer('${result.question}', '${result.options[result.correctAnswer]}')">İzah Et</button>
                    </div>
                `).join('')}
            </div>

            <button onclick="hideSelfTestResults()" class="action-btn" style="background:var(--primary-color);width:auto;padding:10px 20px;margin-top:20px;">Yeni Test</button>
        `;
}

async function explainAnswer(question, correctAnswer) {
    const prompt = `
        Bu sualın cavabını izah et:

        Sual: ${question}
        Doğru cavab: ${correctAnswer}

        Qısa və aydın izah ver ki, şagird niyə bu cavabın doğru olduğunu başa düşsün.
        `;

    try {
        const explanation = await getAIResponse(prompt);
        showToast(explanation, 'info');
    } catch (error) {
        showToast('İzah alınarkən xəta baş verdi.', 'error');
    }
}

// --- EDUBOT FUNKSİYALARI ---
function addMessageToChat(message, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.textContent = message;
    edubotChatWindow.appendChild(bubble);
    edubotChatWindow.scrollTop = edubotChatWindow.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    edubotChatWindow.appendChild(typingDiv);
    edubotChatWindow.scrollTop = edubotChatWindow.scrollHeight;
    return typingDiv;
}

async function getAIBotResponse(userInput) {
    try {
        const response = await fetch(`${API_BASE}/ai/edubot/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userInput,
                context: '' // Context will be handled by backend
            })
        });

        const data = await response.json();

        if (data.success) {
            return data.response;
        } else {
            // Use fallback response from backend
            return data.fallback || 'Üzr istəyirik, AI xidməti müvəqqəti olaraq əlçatan deyil.';
        }
    } catch (error) {
        console.error('EduBot API error:', error);
        return 'İnternet bağlantısında problem var. Zəhmət olmasa, bağlantını yoxlayıb yenidən cəhd edin.';
    }
}

// --- FOOTER MODAL FUNCTIONS ---
function showMissionModal() {
    alert('🚀 Bizim Missiyamız\n\nEduTask platforması olaraq məqsədimiz təhsil prosesini daha interaktiv, əlçatan və effektiv etməkdir. Biz şagird və müəllimlərin arasında körpü rolunu oynayaraq, hər kəsin öz potensialını maksimum dərəcədə reallaşdırmasına kömək edirik.');
}

function showEduBotInfoModal() {
    alert('🤖 EduBot Köməkçi haqqında\n\nEduBot sizin şəxsi təhsil köməkçinizdir. O, Sokrat metodundan istifadə edərək sizə hazır cavablar vermir, əvəzində düşünməyə yönləndirici suallar verir. Bu yolla siz mövzunu daha dərindən başa düşürsünüz.');
}

function showFAQModal() {
    alert('❓ Tez-tez Verilən Suallar\n\n1. Necə qeydiyyatdan keçə bilərəm?\n2. Tapşırıqları necə təhvil verə bilərəm?\n3. Xallar necə hesablanır?\n4. EduBot necə işləyir?\n5. Texniki problemlər zamanı nə etməliyəm?');
}

function showTeacherGuideModal() {
    alert('👨‍🏫 Müəllimlər üçün Təlimatlar\n\n1. Yeni tapşırıq yaratmaq\n2. Şagird işlərini qiymətləndirmək\n3. AI analiz alətlərindən istifadə\n4. Sinif idarəçiliyi\n5. Canlı dərs təşkili');
}

function showTermsModal() {
    alert('📋 İstifadəçi Şərtləri\n\nEduTask platformasından istifadə edərkən aşağıdakı şərtləri qəbul etmiş olursunuz:\n\n1. Platformadan yalnız təhsil məqsədləri üçün istifadə edəcəksiniz\n2. Digər istifadəçilərə hörmət göstərəcəksiniz\n3. Məlumatlarınızın təhlükəsizliyini qoruyacağıq');
}

function showPrivacyModal() {
    alert('🔒 Məxfilik Siyasəti\n\nBizim məxfilik siyasətimiz:\n\n1. Şəxsi məlumatlarınız qorunur\n2. Üçüncü tərəflərlə paylaşılmır\n3. Yalnız təhsil məqsədləri üçün istifadə olunur\n4. İstədiyiniz zaman hesabınızı silə bilərsiniz');
}

function showCopyrightModal() {
    alert('© Müəllif Hüquqları\n\nEduTask platforması və bütün məzmunu müəllif hüquqları ilə qorunur.\n\n© 2025 EduTask. Bütün hüquqlar qorunur.\n\nDevelopers: Hüseyn Verdiyev, Fərid Həşimli');
}

// --- EVENT LISTENERS ---
// Login handled by API in handleLogin function
// Login handled by API in handleLogin function


teacherTaskForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const title = teacherTaskForm['task-title'].value;
    const description = teacherTaskForm['task-description'].value;
    const deadline = teacherTaskForm['task-deadline'].value;
    const classId = teacherTaskForm['task-class'].value;

    try {
        const response = await fetch(`${API_BASE}/assignments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ title, description, classId, deadline })
        });

        const data = await response.json();

        if (response.ok) {
            addNotification(`Yeni tapşırıq əlavə edildi: ${title}`, 'assignment');
            showToast('Tapşırıq uğurla göndərildi!', 'success');
            teacherTaskForm.reset();
            if (typeof loadTeacherAssignmentsFromAPI === 'function') {
                await loadTeacherAssignmentsFromAPI();
            }
            renderAll();
        } else {
            showToast(data.error || 'Tapşırıq göndərilə bilmədi', 'error');
        }
    } catch (error) {
        console.error('Assignment create error:', error);
        showToast('Server ilə əlaqə yoxdur', 'error');
    }
});

addResourceForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const newResource = {
        id: Date.now(),
        title: addResourceForm['resource-title'].value,
        link: addResourceForm['resource-link'].value,
        description: addResourceForm['resource-description'].value
    };

    resources.unshift(newResource);
    showToast('Resurs uğurla əlavə edildi!', 'success');
    addResourceForm.reset();
    renderAll();
});

document.getElementById('wall-post-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const content = document.getElementById('post-content').value.trim();
    const submitBtn = this.querySelector('button[type="submit"]');

    if (!content) return;

    if (!currentUser) {
        showToast('Paylaşım etmək üçün daxil olun', 'error');
        return;
    }

    const classId = currentUser.class_id || 1;

    // Disable button
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Gözləyin... ⏳';
    }

    try {
        // AI Content Moderation for Wall Post too
        const moderationResponse = await fetch(`${API_BASE}/ai/moderate-content`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });

        if (moderationResponse.ok) {
            const moderation = await moderationResponse.json();
            if (!moderation.safe) {
                showToast('⚠️ ' + (moderation.reason || 'Paylaşım uyğunsuz məzmun ehtiva edir'), 'error');
                return;
            }
        }

        const response = await fetch(`${API_BASE}/chat/wall`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ classId, content, isQuestion: content.includes('?') })
        });

        if (response.ok) {
            document.getElementById('post-content').value = '';
            showToast('Post paylaşıldı!', 'success');
            loadWallFromAPI();
            // Bonus points for posting on wall
            awardPoints(2, 'Sinif divarında paylaşım');
        } else {
            showToast('Paylaşım xətası', 'error');
        }
    } catch (error) {
        console.error('Failed to post to wall:', error);
        showToast('Server ilə əlaqə yoxdur', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Paylaş';
        }
    }
});

async function deletePost(postId) {
    if (confirm('Bu paylaşımı silmək istədiyinizə əminsiniz?')) {
        try {
            const response = await fetch(`${API_BASE}/chat/wall/${postId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                showToast('Post silindi', 'info');
                loadWallFromAPI();
            } else {
                showToast('Silinmə xətası', 'error');
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    }
}

document.getElementById('quiz-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const questionsContainer = document.getElementById('questions-container');
    const questionItems = questionsContainer.querySelectorAll('.question-item');

    const questions = [];
    questionItems.forEach((item, index) => {
        const questionText = formData.get(`question_${index}`);
        const options = [
            formData.get(`option_${index}_0`),
            formData.get(`option_${index}_1`),
            formData.get(`option_${index}_2`),
            formData.get(`option_${index}_3`)
        ];
        const correct = parseInt(formData.get(`correct_${index}`));

        questions.push({
            question: questionText,
            type: 'multiple',
            options: options,
            correct: correct
        });
    });

    const newQuiz = {
        id: Date.now(),
        title: formData.get('quiz-title'),
        class: formData.get('quiz-class'),
        questions: questions,
        completed: false,
        score: null
    };

    quizzes.push(newQuiz);
    showToast('Test uğurla yaradıldı!', 'success');
    event.target.reset();
    questionsContainer.innerHTML = '<h4>Suallar</h4>';
    renderTeacherQuizzes();
});

document.getElementById('self-test-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!selectedDifficulty) {
        showToast('Zəhmət olmasa çətinlik səviyyəsini seçin.', 'warning');
        return;
    }

    const subject = document.getElementById('subject').value.trim();
    const topic = document.getElementById('topic').value.trim();

    const resultsDiv = document.getElementById('self-test-results');
    const generatedTestDiv = document.getElementById('generated-test');

    generatedTestDiv.innerHTML = '<div style="text-align:center;padding:20px;"><div class="loading-spinner" style="margin: 0 auto 10px;"></div>Test yaradılır...</div>';
    resultsDiv.classList.remove('hidden');

    const result = await generateSelfTest(subject, topic, selectedDifficulty);

    if (result.error) {
        generatedTestDiv.innerHTML = `<div class="error-message">${result.error}</div>`;
    } else {
        renderSelfTestQuestions(result.questions);
    }
});

document.getElementById('add-class-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const className = document.getElementById('new-class-name').value.trim();

    // Validate class name format (1A-11Z)
    const classPattern = /^(1[0-1]|[1-9])[A-Z]$/;
    if (!classPattern.test(className)) {
        showToast('Sinif adı 1A-11Z formatında olmalıdır!', 'error');
        return;
    }

    if (classes[className]) {
        showToast('Bu sinif artıq mövcuddur!', 'error');
        return;
    }

    classes[className] = [];
    showToast(`${className} sinifi uğurla əlavə edildi!`, 'success');
    document.getElementById('new-class-name').value = '';
    renderAdminPanel();
    updateClassSelectors();
});

document.getElementById('live-class-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const newMeeting = {
        id: Date.now(),
        title: formData.get('meeting-title'),
        datetime: formData.get('meeting-datetime'),
        class: formData.get('meeting-class'),
        platform: formData.get('meeting-platform'),
        link: formData.get('meeting-link')
    };

    meetings.push(newMeeting);
    showToast('Görüş uğurla yaradıldı!', 'success');
    event.target.reset();
    renderActiveMeetings();
});

edubotInputForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const userMessage = edubotUserInput.value.trim();

    if (userMessage) {
        addMessageToChat(userMessage, 'user');
        edubotUserInput.value = '';

        const typingIndicator = showTypingIndicator();
        const botMessage = await getAIBotResponse(userMessage);
        edubotChatWindow.removeChild(typingIndicator);
        addMessageToChat(botMessage, 'bot');
    }
});

function gradeTask(event, taskId) {
    event.preventDefault();
    const grade = parseInt(event.target.grade.value);
    const feedback = event.target.feedback.value;
    const task = assignments.find(t => t.id === taskId);

    if (task) {
        task.grade = grade;
        task.feedback = feedback;
        addNotification(`${task.title} tapşırığınız qiymətləndirildi: ${grade}/5`, 'grade');
        showToast('Tapşırıq qiymətləndirildi.', 'success');
        renderAll();
    }
}

function askQuestion(event, taskId) {
    event.preventDefault();
    const questionText = event.target.question.value;
    const task = assignments.find(t => t.id === taskId);

    if (task) {
        task.questions.push({
            student: 'Ferid',
            text: questionText
        });
        showToast('Sualınız müəllimə göndərildi.', 'success');
        event.target.reset();
        renderAll();
    }
}

function hideSelfTestResults() {
    document.getElementById('self-test-results').classList.add('hidden');
    document.getElementById('self-test-form').reset();
    selectedDifficulty = '';
    currentSelfTest = null;
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('selected'));
}

function renderAll() {
    updateDashboard(currentUserRole, currentUsername);
    renderStudentTasks();
    renderTeacherSubmissions();
    renderTeacherQuestions();
    renderResources();
}

// Close dropdowns when clicking outside
document.addEventListener('click', function (event) {
    if (!event.target.closest('.notification-bell')) {
        notificationDropdown.classList.add('hidden');
    }
    if (event.target === profileModalWrapper) {
        closeProfileModal();
    }
    if (event.target === eportfolioModal) {
        closeEPortfolioModal();
    }
    if (event.target.id === 'book-detail-modal') {
        closeBookModal();
    }
});

// Initialize with first question for quiz form
window.addEventListener('load', function () {
    // Set minimum datetime for task deadline to current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const taskDeadlineInput = document.getElementById('task-deadline');
    if (taskDeadlineInput) {
        taskDeadlineInput.min = now.toISOString().slice(0, 16);
    }

    // Set minimum datetime for meeting
    const meetingDatetimeInput = document.getElementById('meeting-datetime');
    if (meetingDatetimeInput) {
        meetingDatetimeInput.min = now.toISOString().slice(0, 16);
    }

    // Initialize notifications
    updateNotificationBadge();

    // Initialize class selectors
    updateClassSelectors();
});

// ========================================
// POMODORO TIMER SYSTEM
// ========================================
let pomodoroModal = null;

function togglePomodoro() {
    if (!pomodoroModal) {
        createPomodoroModal();
    }
    const isVisible = pomodoroModal.classList.toggle('visible');

    // Show/hide time in header when modal opens/closes
    const pomoTime = document.getElementById('pomo-time');
    if (isVisible) {
        updatePomodoroDisplay(); // Update the time before showing
        pomoTime.classList.remove('hidden');
    } else if (!isPomodoroActive) {
        // Only hide if timer is not active
        pomoTime.classList.add('hidden');
    }
}

function createPomodoroModal() {
    pomodoroModal = document.createElement('div');
    pomodoroModal.id = 'pomodoro-modal';
    pomodoroModal.className = 'pomodoro-modal';
    pomodoroModal.innerHTML = `
        <div class="pomodoro-modal-content">
            <button class="modal-close-btn" onclick="closePomodoroModal()">&times;</button>
            <h2>🍅 Pomodoro Taymeri</h2>
            <div class="pomodoro-display" id="pomodoro-display">25:00</div>
            <div class="pomodoro-controls">
                <button onclick="startPomodoro()" class="pomo-btn start">Başla</button>
                <button onclick="pausePomodoro()" class="pomo-btn pause">Dayandır</button>
                <button onclick="resetPomodoro()" class="pomo-btn reset">Sıfırla</button>
            </div>
            <div class="pomodoro-settings">
                <label>Müddət (dəqiqə):</label>
                <select id="pomo-duration" onchange="setPomoDuration(this.value)">
                    <option value="25">25</option>
                    <option value="15">15</option>
                    <option value="45">45</option>
                    <option value="60">60</option>
                </select>
            </div>
            <p style="margin-top:15px;color:#888;font-size:0.9em;">Fokuslanmaq üçün Pomodoro metodundan istifadə edin!</p>
        </div>
    `;
    document.body.appendChild(pomodoroModal);
}

function closePomodoroModal() {
    if (pomodoroModal) {
        pomodoroModal.classList.remove('visible');

        // Hide header time if timer is not active
        if (!isPomodoroActive) {
            const pomoTime = document.getElementById('pomo-time');
            pomoTime.classList.add('hidden');
        }
    }
}

function startPomodoro() {
    if (isPomodoroActive) return;
    isPomodoroActive = true;
    pomodoroInterval = setInterval(() => {
        if (pomodoroTime > 0) {
            pomodoroTime--;
            updatePomodoroDisplay();
        } else {
            clearInterval(pomodoroInterval);
            isPomodoroActive = false;
            showToast('🍅 Pomodoro tamamlandı! Fasilə vaxtı!', 'success');
            awardPoints(10, 'Pomodoro sessiyasını tamamladınız');
            if (currentUser) {
                const sessionKey = `pomodoroSessions_${currentUser.id}`;
                const sessions = parseInt(localStorage.getItem(sessionKey) || '0') + 1;
                localStorage.setItem(sessionKey, sessions.toString());
                if (typeof renderQuestBoard === 'function') renderQuestBoard();
            }
        }
    }, 1000);
}

function pausePomodoro() {
    clearInterval(pomodoroInterval);
    isPomodoroActive = false;

    // Hide header time if modal is not visible
    if (pomodoroModal && !pomodoroModal.classList.contains('visible')) {
        const pomoTime = document.getElementById('pomo-time');
        pomoTime.classList.add('hidden');
    }
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);
    isPomodoroActive = false;
    pomodoroTime = 25 * 60;
    updatePomodoroDisplay();

    // Hide header time if modal is not visible
    if (pomodoroModal && !pomodoroModal.classList.contains('visible')) {
        const pomoTime = document.getElementById('pomo-time');
        pomoTime.classList.add('hidden');
    }
}

function setPomoDuration(minutes) {
    pomodoroTime = parseInt(minutes) * 60;
    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    // Use requestAnimationFrame for smoother updates when pomodoro is active
    if (isPomodoroActive) {
        requestAnimationFrame(() => {
            const minutes = Math.floor(pomodoroTime / 60);
            const seconds = pomodoroTime % 60;
            const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            const pomoDisplay = document.getElementById('pomodoro-display');
            const pomoTime = document.getElementById('pomo-time');
            if (pomoDisplay) pomoDisplay.textContent = display;
            if (pomoTime) pomoTime.textContent = display;
        });
    } else {
        // Direct update for non-active states
        const minutes = Math.floor(pomodoroTime / 60);
        const seconds = pomodoroTime % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const pomoDisplay = document.getElementById('pomodoro-display');
        const pomoTime = document.getElementById('pomo-time');
        if (pomoDisplay) pomoDisplay.textContent = display;
        if (pomoTime) pomoTime.textContent = display;
    }
}

// ========================================
// CLASS WALL REPLY/LIKE SYSTEM
// ========================================
let lastReplyTime = {};

function likePost(postId) {
    const post = wallPosts.find(p => p.id === postId);
    if (post) {
        if (!post.likes) post.likes = 0;
        if (!post.likedBy) post.likedBy = [];

        const currentUser = currentUserRole === 'student' ? 'Ferid' : 'Müəllim';
        if (!post.likedBy.includes(currentUser)) {
            post.likes++;
            post.likedBy.push(currentUser);
            showToast('Bəyəndiniz! ❤️', 'success');
        } else {
            showToast('Artıq bəyənmisiniz.', 'info');
        }
        renderClassWall();
    }
}

function replyToPost(postId) {
    const now = Date.now();
    const lastTime = lastReplyTime[currentUserRole] || 0;
    const cooldown = 30000; // 30 seconds

    if (now - lastTime < cooldown) {
        const remaining = Math.ceil((cooldown - (now - lastTime)) / 1000);
        showToast(`Növbəti cavab üçün ${remaining} saniyə gözləyin.`, 'warning');
        return;
    }

    const replyText = prompt('Cavabınızı yazın:');
    if (replyText && replyText.trim()) {
        const post = wallPosts.find(p => p.id === postId);
        if (post) {
            if (!post.answers) post.answers = [];
            post.answers.push({
                author: currentUserRole === 'student' ? 'Ferid' : 'Müəllim',
                text: replyText.trim(),
                timestamp: new Date()
            });
            lastReplyTime[currentUserRole] = now;
            showToast('Cavabınız əlavə edildi!', 'success');

            // Award points for helping
            if (currentUserRole === 'student') {
                mentorAnswers++;
                if (mentorAnswers % 5 === 0) {
                    awardPoints(15, 'Sinif yoldaşlarına kömək!');
                }
            }
            renderClassWall();
        }
    }
}

// Update renderClassWall to include like/reply buttons
const originalRenderClassWall = renderClassWall;
renderClassWall = function () {
    const wallContainer = document.getElementById('wall-posts');
    if (!wallContainer) return;

    wallContainer.innerHTML = '';

    if (wallPosts.length === 0) {
        wallContainer.innerHTML = '<div class="card"><p>Hələ heç bir paylaşım yoxdur.</p></div>';
        return;
    }

    wallPosts.forEach(post => {
        const timeAgo = getTimeAgo(post.timestamp);
        const likesCount = post.likes || 0;
        const badgeMarkup = renderUserBadge(post.userId);
        const answersHtml = (post.answers || []).map(a => `
            <div class="wall-answer">
                <strong>${a.author}:</strong> ${a.text}
            </div>
        `).join('');

        wallContainer.innerHTML += `
            <div class="post-item">
                <div class="post-header">
                    <div class="avatar">${avatars[post.avatar] || avatars[0]}</div>
                    <div class="user-info">
                        <h5>${post.author} ${badgeMarkup}</h5>
                        <span>${timeAgo}</span>
                    </div>
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-actions">
                    <button onclick="likePost(${post.id})">❤️ ${likesCount}</button>
                    <button onclick="replyToPost(${post.id})">💬 Cavabla</button>
                </div>
                ${answersHtml ? '<div class="wall-answers">' + answersHtml + '</div>' : ''}
            </div>
        `;
    });
};

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'İndicə';
    if (minutes < 60) return `${minutes} dəqiqə əvvəl`;
    if (hours < 24) return `${hours} saat əvvəl`;
    return `${days} gün əvvəl`;
}

// ========================================
// ACCESSIBILITY TOGGLES (Fixed)
// ========================================
function toggleTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.classList.toggle('active');
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Re-declare toggleContrast and toggleFontSize to ensure they work
window.toggleContrast = function () {
    const toggle = document.getElementById('contrast-toggle');
    if (toggle) toggle.classList.toggle('active');
    document.body.classList.toggle('high-contrast');
    localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
};

window.toggleFontSize = function () {
    const toggle = document.getElementById('font-toggle');
    if (toggle) toggle.classList.toggle('active');
    document.body.classList.toggle('large-font');
    localStorage.setItem('largeFont', document.body.classList.contains('large-font'));
};

// Load saved accessibility settings
(function loadAccessibilitySettings() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        const toggle = document.getElementById('theme-toggle');
        if (toggle) toggle.classList.add('active');
    }
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
        const toggle = document.getElementById('contrast-toggle');
        if (toggle) toggle.classList.add('active');
    }
    if (localStorage.getItem('largeFont') === 'true') {
        document.body.classList.add('large-font');
        const toggle = document.getElementById('font-toggle');
        if (toggle) toggle.classList.add('active');
    }
})();

// ========================================
// STREAK SYSTEM
// ========================================
function checkStreak() {
    const today = new Date().toDateString();
    const lastTaskDate = localStorage.getItem('lastTaskDate');
    const savedStreak = parseInt(localStorage.getItem('userStreak')) || 0;

    if (lastTaskDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastTaskDate === today) {
            // Already completed task today
            userStreak = savedStreak;
        } else if (lastTaskDate === yesterday.toDateString()) {
            // Completed task yesterday, streak continues
            userStreak = savedStreak;
        } else {
            // Missed a day, reset streak
            userStreak = 0;
            localStorage.setItem('userStreak', '0');
        }
    } else {
        userStreak = 0;
    }

    updateStreakDisplay();
}

function updateStreakDisplay() {
    const streakCount = document.getElementById('streak-count');
    const streakContainer = document.getElementById('streak-container');

    if (streakCount) {
        streakCount.textContent = userStreak;
    }

    if (streakContainer && currentUserRole === 'student') {
        streakContainer.classList.remove('hidden');
        if (userStreak > 0) {
            streakContainer.classList.add('active');
        } else {
            streakContainer.classList.remove('active');
        }
    }
}

function incrementStreak() {
    const today = new Date().toDateString();
    const lastTaskDate = localStorage.getItem('lastTaskDate');

    if (lastTaskDate !== today) {
        userStreak++;
        localStorage.setItem('userStreak', userStreak.toString());
        localStorage.setItem('lastTaskDate', today);
        updateStreakDisplay();

        if (userStreak > 0 && userStreak % 7 === 0) {
            showToast(`🔥 ${userStreak} günlük seriya! Əla!`, 'success');
            awardPoints(50, `${userStreak} günlük seriya bonusu`);
        }
    }
}

// Hook into task submission to increment streak
const originalSubmitTask = submitTask;
submitTask = function (event, taskId) {
    originalSubmitTask(event, taskId);
    incrementStreak();
};

// ========================================
// ROLE-SPECIFIC NOTIFICATIONS
// ========================================
let roleNotifications = {
    student: [
        { id: 1, message: 'Yeni tapşırıq əlavə edildi: Tarix', timestamp: new Date(Date.now() - 30 * 60 * 1000), read: false, type: 'assignment' },
        { id: 2, message: 'Ədəbiyyat tapşırığınız qiymətləndirildi', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: false, type: 'grade' }
    ],
    teacher: [
        { id: 1, message: 'Ferid tapşırığını təhvil verdi', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), read: false, type: 'submission' },
        { id: 2, message: 'Yeni şagird qeydiyyatdan keçdi', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), read: false, type: 'info' }
    ],
    admin: [
        { id: 1, message: 'Sistem yeniləməsi tamamlandı', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), read: false, type: 'system' },
        { id: 2, message: 'Yeni müəllim qeydiyyatdan keçdi', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), read: false, type: 'info' }
    ]
};

// Override addNotification to use role-specific storage
const originalAddNotification = addNotification;
addNotification = function (message, type, targetRole = null) {
    const role = targetRole || currentUserRole || 'student';
    if (!roleNotifications[role]) roleNotifications[role] = [];

    roleNotifications[role].unshift({
        id: Date.now(),
        message: message,
        timestamp: new Date(),
        read: false,
        type: type
    });

    updateNotificationBadge();
};

// Override renderNotifications and updateNotificationBadge
const originalUpdateNotificationBadge = updateNotificationBadge;
updateNotificationBadge = function () {
    const currentNotifs = roleNotifications[currentUserRole] || [];
    const unreadCount = currentNotifs.filter(n => !n.read).length;

    if (notificationBadge) {
        notificationBadge.textContent = unreadCount;
        if (unreadCount > 0) {
            notificationBadge.classList.remove('hidden');
        } else {
            notificationBadge.classList.add('hidden');
        }
    }
};

const originalRenderNotifications = renderNotifications;
renderNotifications = function () {
    const currentNotifs = roleNotifications[currentUserRole] || [];

    if (currentNotifs.length === 0) {
        notificationDropdown.innerHTML = '<div class="notification-empty">Bildiriş yoxdur</div>';
        return;
    }

    notificationDropdown.innerHTML = currentNotifs.map(n => `
        <div class="notification-item ${n.read ? 'read' : ''}" onclick="markAsRead(${n.id})">
            <span class="notification-icon">${getNotificationIcon(n.type)}</span>
            <div class="notification-content">
                <p>${n.message}</p>
                <small>${getTimeAgo(n.timestamp)}</small>
            </div>
        </div>
    `).join('');
};

function getNotificationIcon(type) {
    const icons = {
        assignment: '📝',
        grade: '⭐',
        submission: '📤',
        system: '⚙️',
        info: 'ℹ️',
        points: '🎯'
    };
    return icons[type] || '📌';
}

// Override markAsRead
const originalMarkAsRead = markAsRead;
markAsRead = function (notificationId) {
    const currentNotifs = roleNotifications[currentUserRole] || [];
    const notif = currentNotifs.find(n => n.id === notificationId);
    if (notif) {
        notif.read = true;
        updateNotificationBadge();
        renderNotifications();
    }
};

// ========================================
// RENDER SKILL TREE (If not exists)
// ========================================
if (typeof renderSkillTree !== 'function') {
    window.renderSkillTree = function () {
        const container = document.getElementById('skill-tree-container');
        if (!container) return;

        const skills = [
            { id: 1, name: 'Oxuma', icon: '📖', level: 3, maxLevel: 5, unlocked: true },
            { id: 2, name: 'Yazma', icon: '✍️', level: 2, maxLevel: 5, unlocked: true },
            { id: 3, name: 'Riyaziyyat', icon: '🔢', level: 1, maxLevel: 5, unlocked: true },
            { id: 4, name: 'Tarix', icon: '📜', level: 2, maxLevel: 5, unlocked: true },
            { id: 5, name: 'Elm', icon: '🔬', level: 0, maxLevel: 5, unlocked: false },
            { id: 6, name: 'Sənət', icon: '🎨', level: 0, maxLevel: 5, unlocked: false }
        ];

        container.innerHTML = skills.map(skill => `
            <div class="skill-branch">
                <div class="skill-node ${skill.unlocked ? 'unlocked' : 'locked'}">
                    <div class="node-icon">${skill.icon}</div>
                    <div class="node-info">
                        <h4>${skill.name}</h4>
                        <div class="skill-progress">
                            <div class="skill-bar" style="width: ${(skill.level / skill.maxLevel) * 100}%"></div>
                        </div>
                        <small>${skill.level}/${skill.maxLevel}</small>
                    </div>
                </div>
            </div>
        `).join('');
    };
}

// ========================================
// NEWS PANEL
// ========================================
let newsArticles = [];
let currentNewsFilter = 'all';

async function showNewsPanel() {
    hideAllPanels();
    const newsPanel = document.getElementById('news-panel');
    if (newsPanel) newsPanel.classList.remove('hidden');
    clearActiveNav();
    const navNews = document.getElementById('nav-news');
    if (navNews) navNews.classList.add('active');

    // Show admin form if admin
    const adminForm = document.getElementById('admin-news-form');
    if (adminForm) {
        if (currentUserRole === 'admin') {
            adminForm.classList.remove('hidden');
        } else {
            adminForm.classList.add('hidden');
        }
    }

    await loadNewsFromAPI();
}

async function loadNewsFromAPI() {
    try {
        const url = currentNewsFilter === 'all'
            ? `${API_BASE}/news`
            : `${API_BASE}/news?category=${currentNewsFilter}`;

        const response = await fetch(url, {
            credentials: 'include'
        });

        if (response.ok) {
            newsArticles = await response.json();
        }

        // SAMPLE DATA INJECTION (If empty)
        if (!newsArticles || newsArticles.length === 0) {
            console.log('No news found, adding samples...');
            newsArticles = [
                {
                    id: 101,
                    title: 'Respublika Fənn Olimpiadaları Başlayır!',
                    category: 'olimpiada',
                    content: 'Bütün məktəbliləri 14 fevral tarixində keçiriləcək Respublika Fənn Olimpiadalarında iştirak etməyə dəvət edirik. Qeydiyyat artıq başlamışdır!',
                    image_url: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=500',
                    created_at: new Date().toISOString(),
                    author_name: 'Təhsil Nazirliyi'
                },
                {
                    id: 102,
                    title: 'Məktəbimizdə Yeni Robototexnika Laboratoriyası',
                    category: 'robot',
                    content: 'Şagirdlərimiz üçün müasir robototexnika avadanlıqları ilə təchiz olunmuş yeni laboratoriya istifadəyə verildi. İlk dərs sabah başlayır.',
                    image_url: 'https://images.unsplash.com/photo-1535378437803-91c8ba61f777?auto=format&fit=crop&q=80&w=500',
                    created_at: new Date().toISOString(),
                    author_name: 'Məktəb İdarəsi'
                }
            ];
        }

        renderNews();

    } catch (error) {
        console.error('Failed to load news:', error);

        // Fallback samples on error
        newsArticles = [
            {
                id: 101,
                title: 'Respublika Fənn Olimpiadaları Başlayır!',
                category: 'olimpiada',
                content: 'Bütün məktəbliləri 14 fevral tarixində keçiriləcək Respublika Fənn Olimpiadalarında iştirak etməyə dəvət edirik. Qeydiyyat artıq başlamışdır!',
                image_url: '',
                created_at: new Date().toISOString(),
                author_name: 'Admin'
            },
            {
                id: 102,
                title: 'Yeni Robototexnika Avadanlıqları',
                category: 'robot',
                content: 'Məktəbimizə yeni LEGO Mindstorms dəstləri gətirildi. Gəlin birlikdə robotlar yığaq!',
                image_url: '',
                created_at: new Date().toISOString(),
                author_name: 'Admin'
            }
        ];
        renderNews();

        showToast('Xəbərlər serverdən yüklənə bilmədi (Nümunələr göstərilir)', 'warning');
    }
}

function renderNews() {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    if (newsArticles.length === 0) {
        grid.innerHTML = '<div class="card"><p style="text-align:center;color:#888;padding:20px;">Hələ heç bir xəbər yoxdur.</p></div>';
        return;
    }

    grid.innerHTML = newsArticles.map(news => {
        const dateStr = new Date(news.created_at).toLocaleDateString('az-AZ');
        const categoryLabels = {
            'mekteb': '🏫 Məktəb',
            'olimpiada': '🏆 Olimpiada',
            'idman': '⚽ İdman',
            'elm': '🔬 Elm',
            'robot': '🤖 Robot',
            'qlobal': '🌍 Qlobal'
        };
        const deleteBtn = currentUserRole === 'admin'
            ? `<button onclick="deleteNews(${news.id})" title="Sil" style="background:none;border:none;cursor:pointer;font-size:18px;color:#ccc;position:absolute;top:10px;right:10px;">×</button>`
            : '';

        return `
            <div class="news-card" style="position:relative;">
                ${deleteBtn}
                <div class="news-card-image" style="${news.image_url ? 'background-image:url(' + news.image_url + ');background-size:cover;' : 'background-color:#f0f0f0;display:flex;align-items:center;justify-content:center;height:120px;font-size:3em;'}">${news.image_url ? '' : (categoryLabels[news.category]?.split(' ')[0] || '📰')}</div>
                <div class="news-card-content">
                    <span class="news-card-category ${news.category}">${categoryLabels[news.category] || news.category}</span>
                    <h3>${news.title}</h3>
                    <p>${news.content}</p>
                    <div class="news-card-footer">
                        <span>📅 ${dateStr}</span>
                        <span>✍️ ${news.author_name || 'Admin'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function filterNews(category, btn) {
    currentNewsFilter = category;
    document.querySelectorAll('.news-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    await loadNewsFromAPI();
}

async function addNews(event) {
    event.preventDefault();
    const title = document.getElementById('news-title').value;
    const category = document.getElementById('news-category').value;
    const content = document.getElementById('news-content').value;
    const image = document.getElementById('news-image').value;

    try {
        const response = await fetch(`${API_BASE}/news`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                title,
                category,
                content,
                image_url: image
            })
        });

        if (response.ok) {
            event.target.reset();
            await loadNewsFromAPI();
            showToast('Xəbər uğurla əlavə edildi!', 'success');
        } else {
            const data = await response.json();
            showToast(data.error || 'Xəbər əlavə edilmədi', 'error');
        }
    } catch (error) {
        console.error('Failed to add news:', error);
        showToast('Server xətası', 'error');
    }
}

async function deleteNews(id) {
    if (!confirm('Bu xəbəri silmək istədiyinizə əminsiniz?')) return;

    try {
        const response = await fetch(`${API_BASE}/news/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            showToast('Xəbər silindi', 'info');
            await loadNewsFromAPI();
        } else {
            showToast('Silinmə xətası', 'error');
        }
    } catch (error) {
        console.error('Failed to delete news:', error);
        showToast('Server xətası', 'error');
    }
}

// ========================================
// SHOP MYTHIC TIMER DISPLAY (Simple)
// ========================================
const originalRenderShop = renderShop;
renderShop = function () {
    // Call original render shop first
    if (typeof originalRenderShop === 'function') {
        originalRenderShop();
    }

    // Add small mythic timer at bottom
    const shopContainer = document.getElementById('shop-items') || document.querySelector('.shop-items');
    if (!shopContainer) return;

    // Calculate next mythic event
    const now = new Date();
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + (7 - now.getDay()));
    nextSunday.setHours(18, 0, 0, 0);

    const diff = nextSunday - now;
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));

    // Remove existing timer if any
    const existingTimer = document.getElementById('mythic-timer-small');
    if (existingTimer) existingTimer.remove();

    // Add small timer at bottom
    const timerDiv = document.createElement('div');
    timerDiv.id = 'mythic-timer-small';
    timerDiv.className = 'mythic-timer-small';

    if (!mythicShopActive) {
        timerDiv.innerHTML = `
            <span>✨ Mitik: </span>
            <span class="countdown">${days}g ${hours}s ${minutes}d</span>
        `;
    } else {
        timerDiv.style.background = 'linear-gradient(135deg, #9c27b0, #673ab7)';
        timerDiv.innerHTML = `<span>🌟 MİTİK MAĞAZA AÇIQ!</span>`;
    }

    shopContainer.parentNode.appendChild(timerDiv);
};

// ========================================  
// STREAK FIX
// ========================================
// Ensure streak functions work properly
window.checkStreak = function () {
    const today = new Date().toDateString();
    const lastTaskDate = localStorage.getItem('lastTaskDate');
    const savedStreak = parseInt(localStorage.getItem('userStreak')) || 0;

    if (lastTaskDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastTaskDate === today) {
            userStreak = savedStreak;
        } else if (lastTaskDate === yesterday.toDateString()) {
            userStreak = savedStreak;
        } else {
            userStreak = 0;
            localStorage.setItem('userStreak', '0');
        }
    } else {
        userStreak = 0;
    }

    updateStreakDisplay();
};

window.updateStreakDisplay = function () {
    const streakCount = document.getElementById('streak-count');
    const streakContainer = document.getElementById('streak-container');

    if (streakCount) {
        streakCount.textContent = userStreak;
    }

    if (streakContainer && currentUserRole === 'student') {
        streakContainer.classList.remove('hidden');
        if (userStreak > 0) {
            streakContainer.classList.add('active');
        } else {
            streakContainer.classList.remove('active');
        }
    }
};

window.incrementStreak = function () {
    const today = new Date().toDateString();
    const lastTaskDate = localStorage.getItem('lastTaskDate');

    if (lastTaskDate !== today) {
        userStreak++;
        localStorage.setItem('userStreak', userStreak.toString());
        localStorage.setItem('lastTaskDate', today);
        updateStreakDisplay();
        showToast('🔥 Streak artırıldı! ' + userStreak + ' gün', 'success');

        if (userStreak > 0 && userStreak % 7 === 0) {
            showToast('🎉 ' + userStreak + ' günlük seriya bonusu!', 'success');
            awardPoints(50, userStreak + ' günlük seriya bonusu');
        }
    }
};

// ========================================
// FRIENDS SYSTEM
// ========================================
let friends = [];
let suggestedFriends = [
    { id: 1, name: 'Aysel', points: 130, avatar: 1, class: '10F' },
    { id: 2, name: 'Rəşad', points: 120, avatar: 0, class: '10F' },
    { id: 3, name: 'Nigar', points: 85, avatar: 1, class: '11A' },
    { id: 4, name: 'Tural', points: 75, avatar: 0, class: '11A' },
    { id: 5, name: 'Fatimə', points: 110, avatar: 1, class: '10A' }
];

function showFriendsPanel() {
    hideAllPanels();
    const friendsPanel = document.getElementById('friends-panel');
    if (friendsPanel) friendsPanel.classList.remove('hidden');
    clearActiveNav();
    const navFriends = document.getElementById('nav-friends');
    if (navFriends) navFriends.classList.add('active');
    renderFriends();
}

function renderFriends() {
    const grid = document.getElementById('friends-grid');
    if (!grid) return;

    const allPeople = [...suggestedFriends];
    grid.innerHTML = allPeople.map(person => {
        const isFollowing = friends.includes(person.id);
        return `
            <div class="friend-card">
                <div class="friend-avatar">${avatars[person.avatar]}</div>
                <div class="friend-info">
                    <h4>${person.name}</h4>
                    <div class="friend-stats">
                        <span>${person.points} xal</span> • <span>${person.class}</span>
                    </div>
                </div>
                <button class="friend-btn ${isFollowing ? 'following' : 'follow'}" onclick="toggleFollow(${person.id})">
                    ${isFollowing ? '✓ İzləyirsən' : '+ İzlə'}
                </button>
            </div>
        `;
    }).join('');
}

function toggleFollow(personId) {
    const index = friends.indexOf(personId);
    if (index > -1) {
        friends.splice(index, 1);
        showToast('İzləmədən çıxdınız', 'info');
    } else {
        friends.push(personId);
        showToast('İzləməyə başladınız! 👥', 'success');
    }
    renderFriends();
}

// ========================================
// WEEKLY COMPETITIONS
// ========================================
let weeklyCompetition = {
    name: 'Həftəlik Xal Yarışı',
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    prizes: [
        { rank: 1, reward: '🥇 500 xal + Qızıl çərçivə' },
        { rank: 2, reward: '🥈 300 xal' },
        { rank: 3, reward: '🥉 150 xal' }
    ]
};

function showCompetitionsPanel() {
    hideAllPanels();
    const compPanel = document.getElementById('competitions-panel');
    if (compPanel) compPanel.classList.remove('hidden');
    clearActiveNav();
    const navComp = document.getElementById('nav-competitions');
    if (navComp) navComp.classList.add('active');
    // Coming soon - original code kept for later
    if (compPanel) {
        compPanel.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:300px;padding:40px;">
                <span style="font-size:4em;">🏆</span>
                <h2>Tezliklə...</h2>
                <p style="color:#888;">Yarışlar tezliklə aktivləşdiriləcək!</p>
            </div>
        `;
    }
    // renderCompetitions(); // Disabled for now
}

function renderCompetitions() {
    const container = document.getElementById('competition-content');
    if (!container) return;

    const timeLeft = weeklyCompetition.endDate - new Date();
    const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

    const topLeaders = [...leaderboard].sort((a, b) => b.points - a.points).slice(0, 5);

    container.innerHTML = `
        <div class="competition-card">
            <h3>🏆 ${weeklyCompetition.name}</h3>
            <p>Ən çox xal toplayaraq mükafat qazan!</p>
            <div class="competition-timer">${days} gün ${hours} saat qaldı</div>
            <div class="competition-prizes">
                ${weeklyCompetition.prizes.map(p => `
                    <div class="prize">
                        <span>${p.reward}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="leaderboard-mini">
            <h4>🏅 Hazırkı Sıralama</h4>
            ${topLeaders.map((leader, index) => `
                <div class="mini-leader-item">
                    <span class="rank-badge ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">${index + 1}</span>
                    <div>${avatars[leader.avatar]}</div>
                    <span style="flex:1;margin-left:10px;">${leader.name}</span>
                    <span style="font-weight:bold;">${leader.points} xal</span>
                </div>
            `).join('')}
        </div>
    `;
}

// ========================================
// CLASS CHAT (API-based)
// ========================================
let chatMessages = [];

function showChatPanel() {
    hideAllPanels();
    const chatPanel = document.getElementById('chat-panel');
    if (chatPanel) chatPanel.classList.remove('hidden');
    clearActiveNav();
    const navChat = document.getElementById('nav-chat');
    if (navChat) navChat.classList.add('active');

    // Update chat header with user's class name
    const chatHeader = document.querySelector('#chat-panel .chat-header');
    if (chatHeader && currentUser) {
        chatHeader.textContent = (currentUser.class_name || 'Sinif') + ' Sinfi Söhbəti';
    }

    // Load messages from API
    loadChatFromAPI();

    // Start polling for real-time updates
    startChatPolling();

    // Connect WebSocket
    if (currentUser) connectWebSocket();
}

function renderChat(forceScroll = false) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    // Check if user is near bottom BEFORE updating content (threshold 150px)
    const isNearBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < 150;

    messagesContainer.innerHTML = chatMessages.map(msg => {
        const authorName = msg.author || 'Anonim';
        const isOwn = currentUsername && authorName.toLowerCase() === currentUsername.toLowerCase();
        const msgTime = msg.time instanceof Date ? msg.time : new Date(msg.time);
        const timeStr = msgTime.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
        const badgeMarkup = renderUserBadge(msg.userId);
        const readReceipt = isOwn ? (msg.read ? '<span style="color:#34B7F1;margin-left:5px;">✓✓</span>' : '<span style="color:#888;margin-left:5px;">✓</span>') : '';
        // Admin can delete any message, users can only delete their own
        const canDelete = isOwn || currentUserRole === 'admin';
        const deleteBtn = canDelete ? `<span class="msg-delete" onclick="deleteMessage(${msg.id}, 'chat')" style="cursor:pointer;margin-left:8px;opacity:0.5;">🗑️</span>` : '';
        // Report button (only for other users' messages, not for admins viewing)
        const reportBtn = (!isOwn && currentUserRole !== 'admin') ? `<span class="msg-report" onclick="showReportModal(${msg.id})" style="cursor:pointer;margin-left:8px;opacity:0.5;" title="Şikayət et">⚠️</span>` : '';
        return `
            <div class="chat-message ${isOwn ? 'own' : ''}">
                <div class="message-content">${msg.content}</div>
                <div class="message-meta">${authorName} ${badgeMarkup} • ${timeStr}${readReceipt}${reportBtn}${deleteBtn}</div>
            </div>
        `;
    }).join('');

    // Scroll only if forced or user was already near bottom
    if (forceScroll || isNearBottom) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

async function sendChatMessage(event) {
    event.preventDefault();
    const input = document.getElementById('chat-input');
    const content = input.value.trim();
    // Assuming the button is next to input or can be found. 
    // Usually form submit button. But here let's try to find it.
    const form = input.closest('form');
    let submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    if (!content) return;

    // Disable button if found
    if (submitBtn) {
        submitBtn.disabled = true;
    }

    // If not logged in via API, use local storage
    if (!currentUser) {
        chatMessages.push({
            id: Date.now(),
            author: currentUsername || 'Anonim',
            content: content,
            time: new Date(),
            avatar: 0,
            read: false,
            userId: currentUser ? currentUser.id : null
        });
        input.value = '';
        renderChat(true); // Force scroll for own message
        return;
    }

    const classId = currentUser.class_id || 1;

    try {
        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ classId, content })
        });

        if (response.ok) {
            input.value = '';
            localStorage.removeItem('chatDraft');
            // Immediately add to local array for instant feedback
            chatMessages.push({
                id: Date.now(),
                author: currentUsername,
                content: content,
                time: new Date(),
                read: false,
                userId: currentUser ? currentUser.id : null
            });
            renderChat(true); // Force scroll for own message
            // Then reload from server after a short delay
            setTimeout(loadChatFromAPI, 500);
        } else {
            const errorData = await response.json();
            if (errorData.blocked) {
                showToast('⚠️ ' + (errorData.reason || 'Mesaj uyğunsuz məzmun ehtiva edir'), 'error');
            } else {
                showToast('Mesaj göndərilmədi', 'error');
            }
        }
    } catch (error) {
        console.error('Failed to send message:', error);
        showToast('Server ilə əlaqə yoxdur', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
        }
    }
}

// Load chat messages from API
async function loadChatFromAPI() {
    if (!currentUser) return;

    const classId = currentUser.class_id || 1;
    try {
        const response = await fetch(`${API_BASE}/chat/${classId}`, {
            credentials: 'include'
        });
        if (response.ok) {
            const messages = await response.json();
            chatMessages = messages.map(m => ({
                id: m.id,
                author: m.author,
                content: m.content,
                avatar: m.avatar,
                time: new Date(m.time),
                read: m.read,
                userId: m.userId
            }));
            renderChat();
        }
    } catch (error) {
        console.error('Failed to load chat:', error);
    }
}

// Auto-refresh chat every 2 seconds
var chatPollingInterval = null;

function startChatPolling() {
    if (chatPollingInterval) return;
    // Reduced polling frequency for better performance
    chatPollingInterval = setInterval(() => {
        if (currentUser && document.getElementById('chat-messages')) {
            loadChatFromAPI();
        }
    }, 15000); // Changed from 2000ms to 15000ms (15 seconds)
}

function stopChatPolling() {
    if (chatPollingInterval) {
        clearInterval(chatPollingInterval);
        chatPollingInterval = null;
    }
}

// ========================================
// UI POLISH FEATURES
// ========================================

// --- BATCH 1: Login & Security ---

// Password Toggle
function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggle = document.querySelector('.password-toggle');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggle.textContent = '🙈';
    } else {
        passwordField.type = 'password';
        toggle.textContent = '👁️';
    }
}

// Caps Lock Warning
function checkCapsLock(event) {
    const capsWarning = document.getElementById('caps-warning');
    if (event.getModifierState && event.getModifierState('CapsLock')) {
        capsWarning.classList.remove('hidden');
    } else {
        capsWarning.classList.add('hidden');
    }
}

// Login Spinner
const originalHandleLogin = handleLogin;
window.handleLogin = async function (event) {
    event.preventDefault();
    const btn = document.querySelector('.hero-submit-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnSpinner = btn.querySelector('.btn-spinner');

    if (btnText) btnText.classList.add('hidden');
    if (btnSpinner) btnSpinner.classList.remove('hidden');
    btn.disabled = true;

    setTimeout(async () => {
        if (btnText) btnText.classList.remove('hidden');
        if (btnSpinner) btnSpinner.classList.add('hidden');
        btn.disabled = false;
        await originalHandleLogin(event);
    }, 800);
};

// --- BATCH 3: Chat & Messaging ---

// Emoji Picker Data
const emojis = ['😀', '😊', '😂', '🤔', '👍', '❤️', '🎉', '🔥', '✨', '📚', '✅', '💪', '🙏', '👏', '🌟'];

// Add Emoji Picker to Chat
function setupEmojiPicker() {
    const chatInputArea = document.querySelector('.chat-input-area');
    if (chatInputArea && !document.getElementById('emoji-btn')) {
        const emojiBtn = document.createElement('button');
        emojiBtn.type = 'button';
        emojiBtn.id = 'emoji-btn';
        emojiBtn.innerHTML = '😊';
        emojiBtn.style.cssText = 'width:40px;height:40px;border-radius:50%;border:none;background:#f0f0f0;cursor:pointer;font-size:1.2em;';
        emojiBtn.onclick = toggleEmojiPicker;
        chatInputArea.insertBefore(emojiBtn, chatInputArea.querySelector('button[type="submit"]'));

        const emojiPanel = document.createElement('div');
        emojiPanel.id = 'emoji-panel';
        emojiPanel.className = 'hidden';
        emojiPanel.style.cssText = 'position:absolute;bottom:60px;left:15px;background:white;border-radius:10px;padding:10px;box-shadow:0 4px 15px rgba(0,0,0,0.15);display:flex;flex-wrap:wrap;gap:5px;max-width:200px;';
        emojiPanel.innerHTML = emojis.map(e => `<span style="cursor:pointer;font-size:1.5em;" onclick="insertEmoji('${e}')">${e}</span>`).join('');
        chatInputArea.style.position = 'relative';
        chatInputArea.appendChild(emojiPanel);
    }
}

function toggleEmojiPicker() {
    const panel = document.getElementById('emoji-panel');
    if (panel) panel.classList.toggle('hidden');
}

function insertEmoji(emoji) {
    const input = document.getElementById('chat-input');
    if (input) {
        input.value += emoji;
        input.focus();
    }
    toggleEmojiPicker();
}

// Message Delete
function deleteMessage(msgId, type) {
    if (type === 'chat') {
        chatMessages = chatMessages.filter(m => m.id !== msgId);
        renderChat();
    } else if (type === 'wall') {
        wallPosts = wallPosts.filter(p => p.id !== msgId);
        renderClassWall();
    }
    showToast('Mesaj silindi', 'info');
}

// Auto-save Draft
function setupAutoSaveDraft() {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        // Load saved draft
        const savedDraft = localStorage.getItem('chatDraft');
        if (savedDraft) chatInput.value = savedDraft;

        // Save on input
        chatInput.addEventListener('input', () => {
            localStorage.setItem('chatDraft', chatInput.value);
        });
    }
}

// Clear draft after sending
const originalSendChatMessage = sendChatMessage;
window.sendChatMessage = function (event) {
    originalSendChatMessage(event);
    localStorage.removeItem('chatDraft');
};

// Notification Sound
const notificationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onqqvs7K3triZcldJVWl3g5Ceo6uusbe1');

function playNotificationSound() {
    try {
        notificationSound.volume = 0.3;
        notificationSound.play().catch(() => { });
    } catch (e) { }
}

// --- BATCH 4: Gamification ---

// Level Up Confetti
function triggerConfetti() {
    // Reduced confetti count for better performance
    const colors = ['#667eea', '#764ba2', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'];
    for (let i = 0; i < 25; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = (Math.random() * 0.5) + 's';
        piece.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 3000); // Reduced lifetime
    }
}

// Birthday Greeting
function checkBirthday() {
    const birthdays = {
        'ferid': '01-15',
        'ayaz': '03-22',
        'aysel': '07-08'
    };
    const today = new Date();
    const todayStr = (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');

    if (currentUsername && birthdays[currentUsername.toLowerCase()] === todayStr) {
        setTimeout(() => {
            showToast('🎂 Ad günün mübarək, ' + currentUsername + '! 🎉', 'success');
            triggerConfetti();
        }, 1000);
    }
}

// --- BATCH 5: UX Improvements ---

// Scroll to Top
function setupScrollToTop() {
    if (!document.getElementById('scroll-to-top-btn')) {
        const btn = document.createElement('button');
        btn.id = 'scroll-to-top-btn';
        btn.className = 'scroll-to-top';
        btn.innerHTML = '↑';
        btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });
    }
}

// Favicon Notification Count
function updateFaviconCount(count) {
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';

    if (count > 0) {
        document.title = `(${count}) EduTask`;
    } else {
        document.title = 'EduTask';
    }
}

// Last Login Time (for teachers)
let lastLoginTimes = {
    'ferid': new Date(Date.now() - 5 * 60 * 1000),
    'ayaz': new Date(Date.now() - 30 * 60 * 1000),
    'aysel': new Date(Date.now() - 2 * 60 * 60 * 1000)
};

function getLastActiveText(username) {
    const lastTime = lastLoginTimes[username.toLowerCase()];
    if (!lastTime) return 'Bilinmir';

    const diff = Date.now() - lastTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'İndicə aktiv';
    if (minutes < 60) return minutes + ' dəqiqə əvvəl';
    if (hours < 24) return hours + ' saat əvvəl';
    return '1+ gün əvvəl';
}

// --- BATCH 6: Particle Background ---

function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.3 + 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(102, 126, 234, ${p.opacity})`;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// --- Initialize All Features ---
document.addEventListener('DOMContentLoaded', () => {
    setupScrollToTop();
    initParticles();
});

// Performance optimization: Clean up unused intervals
function cleanupPerformance() {
    // Clear any orphaned intervals
    if (typeof chatPollingInterval !== 'undefined' && !document.getElementById('chat-messages')) {
        clearInterval(chatPollingInterval);
        chatPollingInterval = null;
    }

    if (typeof ediPopupInterval !== 'undefined' && currentUserRole !== 'student') {
        clearInterval(ediPopupInterval);
        ediPopupInterval = null;
    }
}

// Setup features when chat panel opens
const originalShowChatPanel = showChatPanel;
window.showChatPanel = function () {
    originalShowChatPanel();
    loadChatFromAPI(); // Load from API
    setTimeout(() => {
        setupEmojiPicker();
        setupAutoSaveDraft();
    }, 100);
};

// Check birthday on login
const originalRenderAll = typeof renderAll === 'function' ? renderAll : () => { };
window.renderAll = function () {
    originalRenderAll();
    checkBirthday();
};

// Delete chat message via API
window.deleteMessage = async function (msgId, type) {
    if (type === 'chat') {
        try {
            const response = await fetch(`${API_BASE}/chat/${msgId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                await loadChatFromAPI();
                showToast('Mesaj silindi', 'info');
            }
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    } else if (type === 'wall') {
        try {
            const response = await fetch(`${API_BASE}/chat/wall/${msgId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                showToast('Post silindi', 'info');
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    }
};

// Load leaderboard from API
async function loadLeaderboardFromAPI() {
    try {
        const response = await fetch(`${API_BASE}/users/leaderboard`, {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            // Update leaderboard array
            leaderboard = data.map(u => ({
                name: u.name,
                points: u.points,
                avatar: u.avatar,
                class: u.class_id === 1 ? '10F' : u.class_id === 2 ? '11A' : '10A'
            }));
            updateLeaderboard();
            if (typeof renderLeaderboard === 'function') {
                renderLeaderboard();
            }
        }
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
    }
}

// Logout via API
const originalLogout = logout;
window.logout = async function () {
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    if (chatSocket) chatSocket.close();
    currentUser = null;
    originalLogout();
};

// ========================================
// WEBSOCKET REAL-TIME CHAT
// ========================================

let chatSocket = null;
let typingTimeout = null;

// Connect to WebSocket
function connectWebSocket() {
    if (!currentUser) return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}`;

    try {
        chatSocket = new WebSocket(wsUrl);

        chatSocket.onopen = () => {
            console.log('WebSocket connected');
            // Join class chat room
            chatSocket.send(JSON.stringify({
                type: 'join',
                classId: currentUser.class_id || 1,
                userId: currentUser.id,
                username: currentUser.full_name || currentUser.username
            }));
        };

        chatSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'message') {
                // Add new message to chat
                chatMessages.push({
                    id: data.id,
                    author: data.author,
                    content: data.content,
                    time: new Date(data.time),
                    read: true,
                    userId: data.userId
                });
                renderChat();
                playNotificationSound();
            }

            if (data.type === 'typing') {
                showTypingIndicator(data.username);
            }
        };

        chatSocket.onclose = () => {
            console.log('WebSocket disconnected');
            // Reconnect after 3 seconds
            setTimeout(connectWebSocket, 3000);
            // Start polling fallback
            startChatPolling();
        };

        chatSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            // Start polling fallback
            startChatPolling();
        };
    } catch (e) {
        console.error('WebSocket connection failed:', e);
        // Start polling fallback
        startChatPolling();
    }
}

// Typing indicator
function showTypingIndicator(username) {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.textContent = `${username} yazır...`;
        indicator.classList.remove('hidden');

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            indicator.classList.add('hidden');
        }, 2000);
    }
}

// Send typing notification
function sendTypingNotification() {
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify({ type: 'typing' }));
    }
}

// ========================================
// FILE UPLOAD
// ========================================

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE.replace('/api', '')}/api/upload`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            showToast('Fayl yükləndi: ' + data.originalName, 'success');
            return data;
        } else {
            showToast('Fayl yüklənmədi', 'error');
            return null;
        }
    } catch (error) {
        console.error('Upload error:', error);
        showToast('Fayl yüklənmədi', 'error');
        return null;
    }
}

// Connect WebSocket after login
const originalHandleLoginForWS = handleLogin;
window.handleLogin = async function (event) {
    await originalHandleLoginForWS(event);
    if (currentUser) {
        connectWebSocket();
    }
};

// Add typing listener to chat input
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        let lastTyping = 0;
        chatInput.addEventListener('input', () => {
            if (Date.now() - lastTyping > 1000) {
                sendTypingNotification();
                lastTyping = Date.now();
            }
        });
    }
});

// ========================================
// EDI MASCOT SYSTEM - Simple Login Greeting
// ========================================

var ediPopupInterval = null;

const ediSystem = {
    container: null,
    character: null,
    bubble: null,
    messageEl: null,
    imageEl: null,
    isVisible: false,
    bubbleTimeout: null,

    init() {
        const containers = document.querySelectorAll('#edi-container');
        let preferredContainer = null;
        containers.forEach((c) => {
            if (!preferredContainer && c.querySelector('#edi-message')) {
                preferredContainer = c;
            }
        });
        this.container = preferredContainer || containers[0] || null;
        if (this.container && this.container.parentElement !== document.body) {
            document.body.appendChild(this.container);
        }

        this.character = this.container ? this.container.querySelector('#edi-character') : null;
        this.bubble = this.container ? this.container.querySelector('#edi-bubble') : null;
        this.messageEl = this.container ? this.container.querySelector('#edi-message') : null;
        this.imageEl = this.container ? this.container.querySelector('#edi-image') : null;

        if (!this.container || !this.character || !this.messageEl) {
            console.warn('Edi elements not found');
            return;
        }
    },

    setHappyPose() {
        if (this.imageEl) {
            this.imageEl.src = 'assets/edi/edi-happy.png';
        }
        if (this.character) {
            this.character.setAttribute('data-mood', 'happy');
        }
    },

    show() {
        if (!this.container || !this.character) return;
        this.container.classList.remove('hidden');
        this.isVisible = true;
        this.character.classList.remove('edi-slide-out');
        this.character.classList.add('edi-slide-in');
    },

    hide() {
        if (!this.container || !this.character) return;
        this.character.classList.remove('edi-slide-in');
        this.character.classList.add('edi-slide-out');
        setTimeout(() => {
            this.container.classList.add('hidden');
            this.isVisible = false;
        }, 400);
    },

    speak(message) {
        if (!this.bubble || !this.messageEl || !message) return;
        if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);
        this.messageEl.textContent = message;
        this.bubble.classList.remove('hidden', 'edi-bubble-exit');
        this.bubble.classList.add('edi-bubble-enter');
        this.bubbleTimeout = setTimeout(() => {
            this.hideBubble();
        }, 6000);
    },

    hideBubble() {
        if (!this.bubble) return;
        this.bubble.classList.add('edi-bubble-exit');
        setTimeout(() => {
            this.bubble.classList.add('hidden');
            this.bubble.classList.remove('edi-bubble-enter', 'edi-bubble-exit');
        }, 300);
    },

    showWelcomeMessage(name = '') {
        const safeName = name || currentUsername || 'sagird';
        this.setHappyPose();
        this.showPeekFromRight();
        setTimeout(() => {
            this.speak(`Salam, ${safeName}! Xoş gəldin! 🎉`);
        }, 1000);
    },

    // Edi-nin yarısı sağdan bounce effekti ilə çıxır
    showPeekFromRight() {
        if (!this.container || !this.character) return;

        // Remove any existing classes
        this.character.classList.remove('edi-slide-in', 'edi-slide-out', 'edi-peek-right', 'edi-peek-slide-in-right');
        this.container.classList.remove('edi-peek-right-mode');

        // Show container and add peek mode
        this.container.classList.remove('hidden');
        this.container.classList.add('edi-peek-right-mode');
        this.isVisible = true;

        // Start with slide-in animation, then switch to continuous bounce
        this.character.classList.add('edi-peek-slide-in-right');

        // After entrance animation completes, switch to continuous bounce
        setTimeout(() => {
            this.character.classList.remove('edi-peek-slide-in-right');
            this.character.classList.add('edi-peek-right');
        }, 800);
    },

    onStreakRisk() { },
    onTaskCompleted() { },
    onDeadlineApproaching() { },
    onLongAbsence() { },

    onClick() {
        if (!this.bubble || this.bubble.classList.contains('hidden')) return;
        this.hideBubble();
    }
};

function hideEdiBubble() {
    ediSystem.hideBubble();
}

function ediClick() {
    ediSystem.onClick();
}

function showEdi() {
    ediSystem.show();
}

function hideEdi() {
    ediSystem.hide();
}

ediSystem.init();

// ========================================
// SHOP CATEGORY FILTERING
// ========================================

function filterShopCategory(cat, btn) {
    document.querySelectorAll('.shop-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const items = document.querySelectorAll('.shop-item');
    items.forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// ========================================
// 2D SKILL TREE - Visual Roadmap System
// ========================================

// Skill Tree Data Structure
const skillTreeData2D = {
    riyaziyyat: {
        id: 'riyaziyyat',
        name: 'Riyaziyyat',
        icon: '🧮',
        color: '#3B82F6',
        colorDark: '#1D4ED8',
        topics: [
            {
                id: 'hesablama',
                name: 'Əsas Hesablamalar',
                skills: [
                    { id: 'r1', name: 'Toplama və Çıxma', emoji: '➕', requires: [], progress: 100, description: 'Ədədlərin toplanması və çıxılması' },
                    { id: 'r2', name: 'Vurma və Bölmə', emoji: '✖️', requires: ['r1'], progress: 100, description: 'Ədədlərin vurulması və bölünməsi' },
                    { id: 'r3', name: 'Kəsrlər', emoji: '½', requires: ['r2'], progress: 75, description: 'Kəsrlərlə əməliyyatlar' }
                ]
            },
            {
                id: 'algebra',
                name: 'Cəbr',
                skills: [
                    { id: 'r4', name: 'Tənliklər', emoji: '📊', requires: ['r3'], progress: 50, description: 'Sadə tənliklərin həlli' },
                    { id: 'r5', name: 'Funksiyalar', emoji: '📈', requires: ['r4'], progress: 0, description: 'Funksiyalar və qrafiklər' },
                    { id: 'r6', name: 'Kvadrat tənliklər', emoji: '📐', requires: ['r4'], progress: 0, description: 'ax² + bx + c = 0 tipli tənliklər' }
                ]
            },
            {
                id: 'geometriya',
                name: 'Həndəsə',
                skills: [
                    { id: 'r7', name: 'Bucaqlar', emoji: '📐', requires: ['r2'], progress: 100, description: 'Bucaq növləri və ölçülməsi' },
                    { id: 'r8', name: 'Üçbucaqlar', emoji: '🔺', requires: ['r7'], progress: 30, description: 'Üçbucağın xassələri' },
                    { id: 'r9', name: 'Çevrə', emoji: '⭕', requires: ['r7'], progress: 0, description: 'Çevrə və dairə' }
                ]
            }
        ]
    },
    tarix: {
        id: 'tarix',
        name: 'Tarix',
        icon: '📜',
        color: '#F59E0B',
        colorDark: '#D97706',
        topics: [
            {
                id: 'qedim',
                name: 'Qədim Dövr',
                skills: [
                    { id: 't1', name: 'İlk sivilizasiyalar', emoji: '🏛️', requires: [], progress: 100, description: 'Mesopotamiya, Misir, Hindistan' },
                    { id: 't2', name: 'Antik Yunanıstan', emoji: '🏺', requires: ['t1'], progress: 80, description: 'Yunan mədəniyyəti və fəlsəfəsi' },
                    { id: 't3', name: 'Roma İmperiyası', emoji: '⚔️', requires: ['t1'], progress: 40, description: 'Roma tarixi və mədəniyyəti' }
                ]
            },
            {
                id: 'orta',
                name: 'Orta Əsrlər',
                skills: [
                    { id: 't4', name: 'Feodalizm', emoji: '🏰', requires: ['t3'], progress: 0, description: 'Feodal quruluş və cəmiyyət' },
                    { id: 't5', name: 'İslam mədəniyyəti', emoji: '🕌', requires: ['t3'], progress: 0, description: 'İslam sivilizasiyasının yüksəlişi' }
                ]
            },
            {
                id: 'azerbaycan',
                name: 'Azərbaycan Tarixi',
                skills: [
                    { id: 't6', name: 'Qədim Azərbaycan', emoji: '🏔️', requires: [], progress: 100, description: 'Manna, Midiya, Atropatena' },
                    { id: 't7', name: 'Səfəvilər', emoji: '👑', requires: ['t6'], progress: 65, description: 'Səfəvi dövləti tarixi' },
                    { id: 't8', name: 'ADR', emoji: '🇦🇿', requires: ['t7'], progress: 20, description: 'Azərbaycan Demokratik Respublikası' }
                ]
            }
        ]
    },
    fizika: {
        id: 'fizika',
        name: 'Fizika',
        icon: '⚡',
        color: '#8B5CF6',
        colorDark: '#6D28D9',
        topics: [
            {
                id: 'mekanika',
                name: 'Mexanika',
                skills: [
                    { id: 'f1', name: 'Hərəkət', emoji: '🏃', requires: [], progress: 100, description: 'Düzxətli və əyrixətli hərəkət' },
                    { id: 'f2', name: 'Qüvvə', emoji: '💪', requires: ['f1'], progress: 70, description: 'Nyuton qanunları' },
                    { id: 'f3', name: 'Enerji', emoji: '🔋', requires: ['f2'], progress: 30, description: 'Kinetik və potensial enerji' }
                ]
            },
            {
                id: 'elektrik',
                name: 'Elektrik',
                skills: [
                    { id: 'f4', name: 'Cərəyan', emoji: '⚡', requires: ['f1'], progress: 50, description: 'Elektrik cərəyanı' },
                    { id: 'f5', name: 'Dövrələr', emoji: '🔌', requires: ['f4'], progress: 0, description: 'Elektrik dövrələri' }
                ]
            }
        ]
    },
    edebiyyat: {
        id: 'edebiyyat',
        name: 'Ədəbiyyat',
        icon: '📚',
        color: '#EC4899',
        colorDark: '#BE185D',
        topics: [
            {
                id: 'klassik',
                name: 'Klassik Ədəbiyyat',
                skills: [
                    { id: 'e1', name: 'Nizami Gəncəvi', emoji: '📖', requires: [], progress: 100, description: 'Xəmsə və əsərləri' },
                    { id: 'e2', name: 'Füzuli', emoji: '✒️', requires: ['e1'], progress: 60, description: 'Qəzəllər və poema' },
                    { id: 'e3', name: 'Nəsimi', emoji: '🕊️', requires: ['e1'], progress: 40, description: 'Hürufizm və şeirləri' }
                ]
            },
            {
                id: 'muasir',
                name: 'Müasir Ədəbiyyat',
                skills: [
                    { id: 'e4', name: 'Sabir', emoji: '😤', requires: ['e2'], progress: 20, description: 'Satirik şeirlər' },
                    { id: 'e5', name: 'Cəlil Məmmədquluzadə', emoji: '📰', requires: ['e2'], progress: 0, description: 'Molla Nəsrəddin jurnalı' }
                ]
            }
        ]
    }
};

let currentSkillSubject = 'riyaziyyat';

// Get skill state based on progress and prerequisites
function getSkillState(skill, allSkills) {
    // Check if all required skills are completed (progress >= 100)
    const requirementsMet = skill.requires.every(reqId => {
        const reqSkill = allSkills.find(s => s.id === reqId);
        return reqSkill && reqSkill.progress >= 100;
    });

    if (skill.progress >= 100) return 'completed';
    if (skill.progress > 0) return 'in-progress';
    if (requirementsMet || skill.requires.length === 0) return 'available';
    return 'locked';
}

// Flatten all skills from a subject
function getAllSkillsFromSubject(subjectId) {
    const subject = skillTreeData2D[subjectId];
    if (!subject) return [];
    const allSkills = [];
    subject.topics.forEach(topic => {
        topic.skills.forEach(skill => allSkills.push(skill));
    });
    return allSkills;
}

// Calculate overall progress for a subject
function calculateSubjectProgress(subjectId) {
    const skills = getAllSkillsFromSubject(subjectId);
    if (skills.length === 0) return 0;
    const totalProgress = skills.reduce((sum, s) => sum + s.progress, 0);
    return Math.round(totalProgress / skills.length);
}

// Render subject tabs
function renderSkillSubjectTabs() {
    const container = document.getElementById('skill-subject-tabs');
    if (!container) return;

    container.innerHTML = Object.values(skillTreeData2D).map(subject => `
        <button class="skill-subject-tab ${subject.id === currentSkillSubject ? 'active' : ''}" 
                style="--tab-color: ${subject.color}; --tab-color-dark: ${subject.colorDark};"
                onclick="switchSkillSubject('${subject.id}')">
            <span class="tab-icon">${subject.icon}</span>
            ${subject.name}
        </button>
    `).join('');
}

// Switch between subjects
function switchSkillSubject(subjectId) {
    currentSkillSubject = subjectId;
    renderSkillSubjectTabs();
    renderSkillTree2D();
    updateSkillTreeProgress();
}

// Render the 2D skill tree
function renderSkillTree2D() {
    const nodesContainer = document.getElementById('skill-tree-nodes');
    const svgContainer = document.getElementById('skill-tree-svg');

    if (!nodesContainer || !svgContainer) return;

    const subject = skillTreeData2D[currentSkillSubject];
    if (!subject) return;

    const allSkills = getAllSkillsFromSubject(currentSkillSubject);

    // Build tree HTML
    let html = '';

    subject.topics.forEach((topic, topicIndex) => {
        html += `
            <div class="skill-tree-topic" data-topic="${topic.id}">
                <div style="text-align: center; margin-bottom: 20px;">
                    <span class="skill-tree-topic-header">
                        <h3 class="skill-tree-topic-title">${topic.name}</h3>
                    </span>
                </div>
                <div class="skill-tree-row">
        `;

        topic.skills.forEach(skill => {
            const state = getSkillState(skill, allSkills);
            const isCurrent = state === 'in-progress' || (state === 'available' && allSkills.filter(s => getSkillState(s, allSkills) === 'in-progress').length === 0);

            html += `
                <div class="skill-node-2d ${state} ${isCurrent && state === 'in-progress' ? 'current' : ''}" 
                     data-skill-id="${skill.id}"
                     style="--node-color: ${subject.color}; --node-color-dark: ${subject.colorDark}; --node-color-light: ${subject.color}88; --progress: ${skill.progress}%;"
                     onclick="showSkillDetail('${skill.id}')">
                    
                    <!-- Tooltip -->
                    <div class="skill-tooltip">
                        <div class="skill-tooltip-title">${skill.emoji} ${skill.name}</div>
                        <div class="skill-tooltip-desc">${skill.description || ''}</div>
                        <div class="skill-tooltip-status" style="color: ${state === 'completed' ? '#10B981' :
                    state === 'in-progress' ? subject.color :
                        state === 'available' ? '#F59E0B' : '#9CA3AF'
                }">
                            ${state === 'completed' ? '✓ Tamamlandı' :
                    state === 'in-progress' ? `${skill.progress}% tamamlanıb` :
                        state === 'available' ? '🎯 Başlamağa hazır' : '🔒 Kilidli'}
                        </div>
                    </div>
                    
                    <!-- Node Ring and Circle -->
                    <div class="skill-node-ring">
                        <div class="skill-node-circle-2d">${skill.emoji}</div>
                    </div>
                    
                    <!-- Title -->
                    <span class="skill-node-title-2d">${skill.name}</span>
                    
                    <!-- Progress bar for in-progress skills -->
                    ${state === 'in-progress' ? `
                        <div class="skill-node-progress">
                            <div class="skill-node-progress-fill" style="width: ${skill.progress}%;"></div>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    nodesContainer.innerHTML = html;

    // Draw connecting lines after a short delay to allow DOM to render
    setTimeout(() => drawSkillConnections(), 100);
}

// Draw SVG connections between skills
function drawSkillConnections() {
    const svg = document.getElementById('skill-tree-svg');
    if (!svg) return;

    const subject = skillTreeData2D[currentSkillSubject];
    if (!subject) return;

    const allSkills = getAllSkillsFromSubject(currentSkillSubject);
    let paths = '';

    subject.topics.forEach(topic => {
        topic.skills.forEach(skill => {
            const toNode = document.querySelector(`[data-skill-id="${skill.id}"]`);
            if (!toNode) return;

            skill.requires.forEach(reqId => {
                const fromNode = document.querySelector(`[data-skill-id="${reqId}"]`);
                if (!fromNode) return;

                const fromRect = fromNode.getBoundingClientRect();
                const toRect = toNode.getBoundingClientRect();
                const containerRect = svg.parentElement.getBoundingClientRect();

                // Calculate center points relative to container
                const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
                const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
                const toX = toRect.left + toRect.width / 2 - containerRect.left;
                const toY = toRect.top + toRect.height / 2 - containerRect.top;

                // Determine line state
                const fromSkill = allSkills.find(s => s.id === reqId);
                const toSkill = allSkills.find(s => s.id === skill.id);
                const fromState = fromSkill ? getSkillState(fromSkill, allSkills) : 'locked';
                const toState = toSkill ? getSkillState(toSkill, allSkills) : 'locked';

                let lineClass = 'branch-line';
                if (fromState === 'completed' && toState === 'completed') {
                    lineClass += ' completed';
                } else if (fromState === 'completed' && (toState === 'in-progress' || toState === 'available')) {
                    lineClass += ' active';
                }

                // Create curved path
                const midY = (fromY + toY) / 2;
                paths += `<path class="${lineClass}" d="M ${fromX} ${fromY} Q ${fromX} ${midY} ${(fromX + toX) / 2} ${midY} T ${toX} ${toY}" />`;
            });
        });
    });

    svg.innerHTML = paths;
}

// Update progress summary
function updateSkillTreeProgress() {
    const progressFill = document.getElementById('skill-progress-fill');
    const progressText = document.getElementById('skill-progress-text');

    if (!progressFill || !progressText) return;

    const progress = calculateSubjectProgress(currentSkillSubject);
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;
}

// Show skill detail (placeholder for modal)
function showSkillDetail(skillId) {
    const allSkills = getAllSkillsFromSubject(currentSkillSubject);
    const skill = allSkills.find(s => s.id === skillId);
    if (!skill) return;

    const state = getSkillState(skill, allSkills);

    if (state === 'locked') {
        showToast('Bu bacarıq hələ kilidlidir! Əvvəlki bacarıqları tamamlayın.', 'warning');
        return;
    }

    // Could open a detailed modal here
    showToast(`${skill.emoji} ${skill.name}: ${skill.progress}% tamamlanıb`, 'info');
}

// Main function to show skill tree panel
function showSkillTreePanel() {
    hideAllPanels();
    const panel = document.getElementById('skill-tree-panel');
    if (panel) {
        panel.classList.remove('hidden');
        renderSkillSubjectTabs();
        renderSkillTree2D();
        updateSkillTreeProgress();
    }
    clearActiveNav();
    const navSkills = document.getElementById('nav-skills');
    if (navSkills) navSkills.classList.add('active');
}

// Re-draw connections on window resize
window.addEventListener('resize', () => {
    if (document.getElementById('skill-tree-panel') && !document.getElementById('skill-tree-panel').classList.contains('hidden')) {
        setTimeout(() => drawSkillConnections(), 100);
    }
});

// ========================================
// MƏNİM PLANIM (MY PLAN) - AI Personal Coach
// ========================================

// My Plan Data Structure (stored in localStorage)
let myPlanData = {
    isOnboarded: false,
    goals: [],
    currentGoal: null,
    preferences: {
        dailyMinutes: 30,
        preferredTime: 'evening'
    },
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0] // Mon-Sun
};

// Onboarding State
let onboardingData = {
    goalType: null,
    goalName: '',
    deadline: null,
    dailyMinutes: null
};

// Load My Plan data from localStorage
function loadMyPlanData() {
    const saved = localStorage.getItem('myPlanData');
    if (saved) {
        try {
            myPlanData = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load My Plan data:', e);
        }
    }
}

// Save My Plan data to localStorage
function saveMyPlanData() {
    localStorage.setItem('myPlanData', JSON.stringify(myPlanData));
}

// Initialize My Plan on page load
loadMyPlanData();

// Show My Plan Panel
function showMyPlanPanel() {
    hideAllPanels();
    const panel = document.getElementById('myplan-panel');
    if (panel) {
        panel.classList.remove('hidden');

        if (myPlanData.isOnboarded && myPlanData.goals.length > 0) {
            showDashboard();
        } else {
            showOnboarding();
        }
    }
    clearActiveNav();
    const navMyPlan = document.getElementById('nav-myplan');
    if (navMyPlan) navMyPlan.classList.add('active');
}

// Show Onboarding Wizard
function showOnboarding() {
    const onboarding = document.getElementById('myplan-onboarding');
    const dashboard = document.getElementById('myplan-dashboard');
    if (onboarding) onboarding.classList.remove('hidden');
    if (dashboard) dashboard.classList.add('hidden');
    goToOnboardingStep(1);
}

// Show Dashboard
function showDashboard() {
    const onboarding = document.getElementById('myplan-onboarding');
    const dashboard = document.getElementById('myplan-dashboard');
    if (onboarding) onboarding.classList.add('hidden');
    if (dashboard) dashboard.classList.remove('hidden');
    renderDashboard();
}

// Navigate between onboarding steps
function goToOnboardingStep(step) {
    // Update step dots
    document.querySelectorAll('.step-dot').forEach(dot => {
        const dotStep = parseInt(dot.dataset.step);
        dot.classList.remove('active', 'completed');
        if (dotStep === step) {
            dot.classList.add('active');
        } else if (dotStep < step) {
            dot.classList.add('completed');
        }
    });

    // Update step content
    document.querySelectorAll('.onboarding-step').forEach(stepEl => {
        stepEl.classList.remove('active');
        if (parseInt(stepEl.dataset.step) === step) {
            stepEl.classList.add('active');
        }
    });
}

// Select goal type
function selectGoalType(type) {
    onboardingData.goalType = type;

    // Update UI
    document.querySelectorAll('.goal-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');

    // Show custom input if needed
    const customInput = document.getElementById('custom-goal-input');
    if (type === 'custom') {
        customInput.classList.remove('hidden');
    } else {
        customInput.classList.add('hidden');
        // Set predefined goal name
        const goalNames = {
            'dim_extra': 'DIM Gücləndirilmiş Hazırlıq',
            'sat': 'SAT İmtahanına Hazırlıq',
            'ielts': 'IELTS Sertifikat Hazırlığı',
            'olimpiada': 'Fənn Olimpiadası Hazırlığı'
        };
        onboardingData.goalName = goalNames[type] || '';
    }

    // Enable next button
    document.getElementById('goal-next-btn').disabled = false;
}

// Handle custom goal name input
document.addEventListener('DOMContentLoaded', () => {
    const customGoalInput = document.getElementById('custom-goal-name');
    if (customGoalInput) {
        customGoalInput.addEventListener('input', (e) => {
            onboardingData.goalName = e.target.value;
        });
    }

    const customTimeInput = document.getElementById('custom-daily-time');
    if (customTimeInput) {
        customTimeInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value >= 5 && value <= 180) {
                onboardingData.dailyMinutes = value;
                document.querySelectorAll('.time-option').forEach(opt => opt.classList.remove('selected'));
                document.getElementById('complete-btn').disabled = false;
            }
        });
    }
});

// Set deadline from date input
function onDeadlineChange() {
    const dateInput = document.getElementById('goal-deadline');
    if (dateInput.value) {
        onboardingData.deadline = dateInput.value;
        document.getElementById('deadline-next-btn').disabled = false;
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    }
}

// Set deadline from preset
function setDeadlinePreset(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateStr = date.toISOString().split('T')[0];

    onboardingData.deadline = dateStr;
    document.getElementById('goal-deadline').value = dateStr;
    document.getElementById('deadline-next-btn').disabled = false;

    // Update preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// Select daily time
function selectDailyTime(minutes) {
    onboardingData.dailyMinutes = minutes;

    // Update UI
    document.querySelectorAll('.time-option').forEach(opt => opt.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    // Clear custom input
    document.getElementById('custom-daily-time').value = '';

    // Enable complete button
    document.getElementById('complete-btn').disabled = false;
}

// Complete onboarding and create plan
function completeOnboarding() {
    // Create goal
    const newGoal = {
        id: 'goal_' + Date.now(),
        type: onboardingData.goalType,
        name: onboardingData.goalName || 'Şəxsi Hədəf',
        targetDate: onboardingData.deadline,
        dailyMinutes: onboardingData.dailyMinutes,
        progress: 0,
        createdAt: new Date().toISOString(),
        completedDays: 0,
        totalDays: calculateDaysUntil(onboardingData.deadline)
    };

    // Save to data
    myPlanData.isOnboarded = true;
    myPlanData.goals.push(newGoal);
    myPlanData.currentGoal = newGoal;
    myPlanData.preferences.dailyMinutes = onboardingData.dailyMinutes;

    saveMyPlanData();

    // Show dashboard
    showDashboard();
    showToast('🎉 Planın uğurla yaradıldı!', 'success');
}

// Calculate days until deadline
function calculateDaysUntil(dateStr) {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = target - now;
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// Reset My Plan
function resetMyPlan() {
    if (confirm('Planınızı sıfırlamaq istədiyinizə əminsiniz?')) {
        myPlanData = {
            isOnboarded: false,
            goals: [],
            currentGoal: null,
            preferences: { dailyMinutes: 30 },
            weeklyProgress: [0, 0, 0, 0, 0, 0, 0]
        };
        onboardingData = { goalType: null, goalName: '', deadline: null, dailyMinutes: null };
        saveMyPlanData();
        showOnboarding();

        // Reset onboarding UI
        document.querySelectorAll('.goal-card').forEach(card => card.classList.remove('selected'));
        document.querySelectorAll('.time-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('goal-deadline').value = '';
        document.getElementById('custom-goal-name').value = '';
        document.getElementById('custom-daily-time').value = '';
        document.getElementById('goal-next-btn').disabled = true;
        document.getElementById('deadline-next-btn').disabled = true;
        document.getElementById('complete-btn').disabled = true;
    }
}

// Render Dashboard
function renderDashboard() {
    renderAICoachMessage();
    renderTodaysTasks();
    renderGoalProgress();
    renderWeeklyChart();
}

// Generate AI Coach Message (considers DIM workload)
function renderAICoachMessage() {
    const messageEl = document.getElementById('coach-message-text');
    if (!messageEl || !myPlanData.currentGoal) return;

    // Simulate DIM tasks (in real app, this would come from the actual DIM system)
    const dimTaskCount = Math.floor(Math.random() * 3) + 1;
    const estimatedDimTime = dimTaskCount * 20; // ~20 mins per DIM task
    const personalTime = Math.max(10, myPlanData.currentGoal.dailyMinutes - Math.floor(estimatedDimTime / 3));

    const messages = [
        `Salam! Bu gün DIM-dən ${dimTaskCount} tapşırığın var. ${myPlanData.currentGoal.name} üçün ${personalTime} dəqiqəlik blok əlavə etdim.`,
        `Bu gün ${myPlanData.currentGoal.name} üçün yaxşı bir gündür! DIM tapşırıqlarından sonra ${personalTime} dəqiqə şəxsi plan üzərində işləyə bilərsən.`,
        `Afərin! Dünən çox yaxşı irəliləyiş göstərdin. Bu gün DIM ilə birlikdə ${personalTime} dəqiqəlik şəxsi tapşırıq planladım.`,
        `Hazırsan? Bu gün ${dimTaskCount} DIM tapşırığı + ${personalTime} dəq şəxsi hədəf bloku var. Birlikdə bacaracağıq! 💪`
    ];

    messageEl.textContent = messages[Math.floor(Math.random() * messages.length)];
}

// Render Today's Combined Tasks
function renderTodaysTasks() {
    const listEl = document.getElementById('today-tasks-list');
    if (!listEl) return;

    // Simulate DIM tasks
    const dimTasks = [
        { icon: '📐', title: 'Riyaziyyat - Həndəsə', meta: 'DIM Tapşırığı', time: '20 dəq' },
        { icon: '📜', title: 'Tarix - Roma İmperiyası', meta: 'DIM Tapşırığı', time: '15 dəq' }
    ];

    // Personal tasks based on goal
    const personalTasks = [];
    if (myPlanData.currentGoal) {
        const goalIcons = {
            'sat': '📝',
            'ielts': '🌍',
            'dim_extra': '📚',
            'olimpiada': '🏆',
            'custom': '🎯'
        };
        personalTasks.push({
            icon: goalIcons[myPlanData.currentGoal.type] || '🎯',
            title: myPlanData.currentGoal.name,
            meta: 'Şəxsi Hədəf',
            time: `${myPlanData.currentGoal.dailyMinutes} dəq`
        });
    }

    let html = '';

    // DIM Tasks
    dimTasks.forEach(task => {
        html += `
            <div class="task-item dim-task">
                <span class="task-icon">${task.icon}</span>
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">${task.meta}</div>
                </div>
                <span class="task-time">${task.time}</span>
            </div>
        `;
    });

    // Personal Tasks
    personalTasks.forEach(task => {
        html += `
            <div class="task-item personal-task">
                <span class="task-icon">${task.icon}</span>
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">${task.meta}</div>
                </div>
                <span class="task-time">${task.time}</span>
            </div>
        `;
    });

    listEl.innerHTML = html;
}

// Render Goal Progress
function renderGoalProgress() {
    const cardEl = document.getElementById('goal-progress-card');
    if (!cardEl || !myPlanData.currentGoal) return;

    const goal = myPlanData.currentGoal;
    const daysLeft = calculateDaysUntil(goal.targetDate);
    const progressPercent = Math.min(100, Math.round((goal.completedDays / goal.totalDays) * 100));

    cardEl.innerHTML = `
        <div class="goal-progress-header">
            <span class="goal-name">${goal.name}</span>
            <span class="goal-deadline-badge">${daysLeft} gün qalıb</span>
        </div>
        <div class="goal-progress-bar">
            <div class="goal-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>
        <div class="goal-stats">
            <span>${goal.completedDays} gün tamamlandı</span>
            <span>${progressPercent}%</span>
        </div>
    `;
}

// Render Weekly Chart
function renderWeeklyChart() {
    const bars = document.querySelectorAll('.day-bar .bar-fill');
    if (bars.length === 0) return;

    // Simulate weekly data (in real app, this would track actual completion)
    const weekData = myPlanData.weeklyProgress || [60, 80, 40, 100, 70, 30, 0];

    bars.forEach((bar, index) => {
        const height = Math.max(4, weekData[index]);
        bar.style.height = `${height}%`;
    });
}

// ========================================
// FRIENDS STREAK AND READING
// ========================================

function renderFriendStreaks() {
    const container = document.getElementById('friend-streaks');
    if (!container) return;

    // Mock data - would come from API
    const streaks = [
        { names: 'Sən + Elvin', days: 7 },
        { names: 'Sən + Aysel', days: 3 }
    ];

    container.innerHTML = streaks.map(s => `
        <div class="friend-streak-card">
            <span class="streak-fire">🔥</span>
            <div class="streak-info">
                <span class="streak-names">${s.names}</span>
                <span class="streak-days">${s.days} günlük streak</span>
            </div>
        </div>
    `).join('');
}

function renderFriendsReading() {
    const container = document.getElementById('friends-reading');
    if (!container) return;

    // Mock data
    const reading = [
        { name: 'Elvin', initial: 'E', book: '1984', progress: 80 },
        { name: 'Aysel', initial: 'A', book: 'Alkimyager', progress: 45 }
    ];

    container.innerHTML = reading.map(f => `
        <div class="friend-reading-item">
            <div class="friend-info">
                <div class="friend-avatar">${f.initial}</div>
                <div class="reading-details">
                    <span class="friend-name">${f.name}</span>
                    <span class="book-name">📘 ${f.book} - ${f.progress}%</span>
                </div>
            </div>
            <button class="start-reading-btn" onclick="startReadingBook('${f.book}')">Mən də oxu</button>
        </div>
    `).join('');
}

function startReadingBook(bookName) {
    const book = booksData.find(b => b.title === bookName);
    if (book) {
        showBooksPanel();
        openBookModal(book.id);
    }
}

// Enhance showFriendsPanel to include new sections
const originalShowFriendsPanel = window.showFriendsPanel;
window.showFriendsPanel = function () {
    if (originalShowFriendsPanel) originalShowFriendsPanel();
    else {
        hideAllPanels();
        document.getElementById('friends-panel')?.classList.remove('hidden');
    }
    renderFriendStreaks();
    renderFriendsReading();
};

// --- SELF TEST FUNCTIONS ---
let currentGeneratedQuiz = [];

async function handleSelfTestSubmit(event) {
    event.preventDefault();

    // UI Elements
    const form = document.getElementById('self-test-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const resultsContainer = document.getElementById('self-test-results');
    const generatedTestContainer = document.getElementById('generated-test');

    // Get Data
    const subject = document.getElementById('subject').value;
    const topic = document.getElementById('topic').value;
    // Helper to get selected difficulty
    const difficultyEl = document.querySelector('.difficulty-btn.active');
    const difficulty = difficultyEl ? difficultyEl.textContent.trim().toLowerCase() : 'orta';

    // Show Loading state
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Sual Hazırlanır... (biraz çəkə bilər)';
    submitBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/ai/generate-quiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subject, topic, difficulty })
        });

        const data = await response.json();

        if (data.success) {
            currentGeneratedQuiz = data.quiz;
            resultsContainer.classList.remove('hidden');
            renderGeneratedQuiz(data.quiz);
            // Scroll to results
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
            showToast(data.error || 'Xəta baş verdi', 'error');
        }

    } catch (error) {
        console.error('Self Test Error:', error);
        showToast('Server xətası: Sunucu ilə əlaqə qurula bilmədi', 'error');
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
}

function renderGeneratedQuiz(quiz) {
    const container = document.getElementById('generated-test');
    container.innerHTML = '<h3>Nəticə:</h3>';

    quiz.forEach((q, index) => {
        let optionsHTML = '';
        q.options.forEach((opt, optIndex) => {
            optionsHTML += `
                <div class="option-item">
                    <label style="cursor:pointer; display:flex; align-items:center; gap:10px; padding:8px; border:1px solid #eee; border-radius:8px; margin-bottom:5px;">
                        <input type="radio" name="q_${index}" value="${optIndex}">
                        <span>${opt}</span>
                    </label>
                </div>
            `;
        });

        container.innerHTML += `
            <div class="quiz-question" style="margin-bottom:20px; padding:15px; background:#f9f9f9; border-radius:10px;">
                <p><strong>${index + 1}. ${q.question}</strong></p>
                <div class="options-list">
                    ${optionsHTML}
                </div>
            </div>
        `;
    });

    container.innerHTML += `
        <button onclick="checkSelfTestAnswers()" class="action-btn" style="background:var(--success-color); margin-top:10px;">Cavabları Yoxla</button>
        <div id="self-test-score" style="margin-top:15px; font-weight:bold; font-size:1.2em;"></div>
    `;
}

function checkSelfTestAnswers() {
    let score = 0;
    const questions = document.querySelectorAll('.quiz-question');

    questions.forEach((qDiv, index) => {
        const selected = qDiv.querySelector(`input[name="q_${index}"]:checked`);
        const correctIndex = currentGeneratedQuiz[index].correctIndex;
        const optionsList = qDiv.querySelector('.options-list');
        const options = optionsList.querySelectorAll('.option-item'); // Assuming div wrapping label

        // Reset styles
        options.forEach(opt => opt.querySelector('label').style.background = 'transparent');

        if (selected) {
            const userAns = parseInt(selected.value);
            if (userAns === correctIndex) {
                score++;
                selected.parentElement.style.background = '#d4edda'; // Greenish
                selected.parentElement.style.border = '1px solid #c3e6cb';
            } else {
                selected.parentElement.style.background = '#f8d7da'; // Reddish
                selected.parentElement.style.border = '1px solid #f5c6cb';
            }
        }

        // Always show correct answer
        const correctLabel = options[correctIndex].querySelector('label');
        if (correctLabel) {
            correctLabel.style.border = '2px solid #28a745';
            correctLabel.innerHTML += ' ✅';
        }
    });

    const percentage = Math.round((score / currentGeneratedQuiz.length) * 100);
    const scoreDiv = document.getElementById('self-test-score');
    scoreDiv.innerHTML = `Sizin nəticəniz: ${score} / ${currentGeneratedQuiz.length} (${percentage}%)`;
    scoreDiv.style.color = percentage >= 50 ? 'var(--success-color)' : 'var(--danger-color)';
}

// Add event listener manually since HTML doesn't have onsubmit
document.addEventListener('DOMContentLoaded', () => {
    const selfTestForm = document.getElementById('self-test-form');
    if (selfTestForm) {
        selfTestForm.addEventListener('submit', handleSelfTestSubmit);
    }
});

function gradeTask(event, taskId) {
    event.preventDefault();
    showToast('Qiymətləndirmə simulyasiya edildi (backend inteqrasiyası tələb olunur)', 'info');
}

// ========================================
// ADMIN STUDENT MANAGEMENT
// ========================================

// Load classes into admin student form selector
async function loadAdminClassSelector() {
    const select = document.getElementById('student-class');
    if (!select) return;

    // Clear existing options except first
    select.innerHTML = '<option value="">Sinif seçin</option>';

    try {
        const response = await fetch(`${API_BASE}/classes`, {
            credentials: 'include'
        });
        if (response.ok) {
            const classes = await response.json();
            classes.forEach(c => {
                const option = document.createElement('option');
                option.value = c.id;
                option.textContent = c.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Failed to load classes:', error);
        // Fallback to local classes if API fails
        Object.keys(classes).forEach(className => {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = className;
            select.appendChild(option);
        });
    }
}

// Admin add student function
async function adminAddStudent(event) {
    event.preventDefault();

    const firstName = document.getElementById('student-first-name').value.trim();
    const lastName = document.getElementById('student-last-name').value.trim();
    const birthday = document.getElementById('student-birthday').value;
    const classId = document.getElementById('student-class').value;
    const username = document.getElementById('student-username').value.trim().toLowerCase();
    const password = document.getElementById('student-password').value;

    if (!firstName || !lastName || !username || !password) {
        showToast('Bütün sahələri doldurun!', 'error');
        return;
    }

    if (password.length < 4) {
        showToast('Şifrə ən azı 4 simvol olmalıdır!', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users/admin/create-student`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                firstName,
                lastName,
                birthday,
                classId: classId ? parseInt(classId) : null,
                username,
                password
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showToast(data.message || 'Şagird uğurla əlavə edildi!', 'success');
            // Clear form
            document.getElementById('admin-add-student-form').reset();
        } else {
            showToast(data.error || 'Xəta baş verdi!', 'error');
        }
    } catch (error) {
        console.error('Admin add student error:', error);
        showToast('Server ilə əlaqə yoxdur!', 'error');
    }
}

// Hook into showAdminPanel to load classes and reports
const originalShowAdminPanelRef = typeof showAdminPanel === 'function' ? showAdminPanel : null;
window.showAdminPanel = function () {
    hideAllPanels();
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
        adminPanel.classList.remove('hidden');
        loadAdminClassSelector();
        loadAdminReports(); // Load reports when admin panel opens
    }
    clearActiveNav();
    const navAdmin = document.getElementById('nav-admin');
    if (navAdmin) navAdmin.classList.add('active');
};

// ========================================
// MESSAGE REPORTING SYSTEM
// ========================================

let currentReportMessageId = null;

// Show report modal
function showReportModal(messageId) {
    currentReportMessageId = messageId;

    // Create modal if not exists
    let modal = document.getElementById('report-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'report-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <span class="close-modal" onclick="closeReportModal()">&times;</span>
                <h2 style="margin-bottom: 20px;">⚠️ Mesajı Şikayət Et</h2>
                <p style="color: #666; margin-bottom: 15px;">Şikayət səbəbini seçin:</p>
                <div class="report-reasons" style="display: flex; flex-direction: column; gap: 10px;">
                    <button onclick="submitReport('Söyüş və ya təhqir')" class="report-reason-btn">🤬 Söyüş və ya təhqir</button>
                    <button onclick="submitReport('Uyğunsuz məzmun')" class="report-reason-btn">🔞 Uyğunsuz məzmun</button>
                    <button onclick="submitReport('Spam və ya reklam')" class="report-reason-btn">📢 Spam və ya reklam</button>
                    <button onclick="submitReport('Nifrət nitqi')" class="report-reason-btn">💢 Nifrət nitqi</button>
                    <button onclick="submitReport('Digər')" class="report-reason-btn">❓ Digər</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add styles for report buttons
        const style = document.createElement('style');
        style.textContent = `
            .report-reason-btn {
                padding: 12px 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background: white;
                cursor: pointer;
                text-align: left;
                transition: all 0.2s;
                font-size: 14px;
            }
            .report-reason-btn:hover {
                background: #ffeee6;
                border-color: #ff6b35;
            }
            .report-card {
                background: #fff;
                border: 1px solid #eee;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 10px;
                border-left: 4px solid #ff6b35;
            }
            .report-card.dismissed {
                border-left-color: #28a745;
                opacity: 0.7;
            }
            .report-card .report-message {
                background: #f8f9fa;
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
                font-style: italic;
            }
            .report-card .report-actions {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
            .report-card .report-actions button {
                padding: 8px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 13px;
            }
            .report-delete-btn {
                background: #dc3545;
                color: white;
            }
            .report-dismiss-btn {
                background: #6c757d;
                color: white;
            }
        `;
        document.head.appendChild(style);
    }

    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

// Close report modal
function closeReportModal() {
    const modal = document.getElementById('report-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
    currentReportMessageId = null;
}

// Submit report
async function submitReport(reason) {
    if (!currentReportMessageId) return;

    try {
        const response = await fetch(`${API_BASE}/chat/report/${currentReportMessageId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ reason })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showToast('✅ Şikayət göndərildi!', 'success');
            closeReportModal();
        } else {
            showToast(data.error || 'Şikayət göndərilə bilmədi', 'error');
        }
    } catch (error) {
        console.error('Report error:', error);
        showToast('Server ilə əlaqə yoxdur', 'error');
    }
}

// Load admin reports
async function loadAdminReports() {
    const container = document.getElementById('admin-reports-list');
    const countEl = document.getElementById('reports-count');

    if (!container) return;

    try {
        const response = await fetch(`${API_BASE}/chat/reports/pending`, {
            credentials: 'include'
        });

        if (!response.ok) {
            container.innerHTML = '<p style="color:#666;">Şikayətlər yüklənə bilmədi</p>';
            return;
        }

        const reports = await response.json();

        if (countEl) {
            countEl.textContent = `${reports.length} gözləyən şikayət`;
        }

        if (reports.length === 0) {
            container.innerHTML = '<p style="color:#28a745;">✅ Heç bir gözləyən şikayət yoxdur!</p>';
            return;
        }

        container.innerHTML = reports.map(report => {
            const date = new Date(report.created_at).toLocaleDateString('az-AZ', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
                <div class="report-card" id="report-${report.id}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <strong style="color: #dc3545;">📢 ${report.reporter_name}</strong> şikayət etdi
                            <span style="color: #666; font-size: 12px;">(${date})</span>
                        </div>
                        <span style="background: #ffeee6; color: #ff6b35; padding: 3px 8px; border-radius: 4px; font-size: 12px;">
                            ${report.reason}
                        </span>
                    </div>
                    <div class="report-message">
                        <strong>${report.author_name}:</strong> "${report.message_content}"
                    </div>
                    <div class="report-actions">
                        <button class="report-delete-btn" onclick="handleReportAction(${report.id}, 'delete')">
                            🗑️ Mesajı Sil
                        </button>
                        <button class="report-dismiss-btn" onclick="handleReportAction(${report.id}, 'dismiss')">
                            ✓ Rədd Et
                        </button>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Load reports error:', error);
        container.innerHTML = '<p style="color:#dc3545;">Xəta baş verdi</p>';
    }
}

// Handle report action
async function handleReportAction(reportId, action) {
    try {
        let response;

        if (action === 'delete') {
            response = await fetch(`${API_BASE}/chat/reports/${reportId}/message`, {
                method: 'DELETE',
                credentials: 'include'
            });
        } else if (action === 'dismiss') {
            response = await fetch(`${API_BASE}/chat/reports/${reportId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: 'dismissed', action: 'Admin tərəfindən rədd edildi' })
            });
        }

        if (response && response.ok) {
            showToast(action === 'delete' ? '🗑️ Mesaj silindi!' : '✓ Şikayət rədd edildi!', 'success');
            // Remove from UI
            const card = document.getElementById(`report-${reportId}`);
            if (card) card.remove();
            // Update count
            const countEl = document.getElementById('reports-count');
            const remaining = document.querySelectorAll('.report-card').length;
            if (countEl) countEl.textContent = `${remaining} gözləyən şikayət`;
            if (remaining === 0) {
                document.getElementById('admin-reports-list').innerHTML = '<p style="color:#28a745;">✅ Heç bir gözləyən şikayət yoxdur!</p>';
            }
        } else {
            showToast('Əməliyyat uğursuz oldu', 'error');
        }
    } catch (error) {
        console.error('Report action error:', error);
        showToast('Server ilə əlaqə yoxdur', 'error');
    }
}

// Make functions global
window.showReportModal = showReportModal;
window.closeReportModal = closeReportModal;
window.submitReport = submitReport;
window.loadAdminReports = loadAdminReports;
window.handleReportAction = handleReportAction;

// ========================================
// MOBILE SIDEBAR FUNCTIONS
// ========================================

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburger = document.getElementById('hamburger-btn');

    if (sidebar && overlay) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
        if (hamburger) hamburger.classList.toggle('active');

        // Prevent body scroll when sidebar is open
        if (sidebar.classList.contains('mobile-open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburger = document.getElementById('hamburger-btn');

    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');
    document.body.style.overflow = '';
}

// Close sidebar when clicking on a nav link (mobile)
function updateActiveNav(element) {
    // Close mobile sidebar after navigation
    if (window.innerWidth <= 1024) {
        closeMobileSidebar();
    }

    // Update active state
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    if (element) element.classList.add('active');
}

// Close sidebar on window resize if it was open
window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) {
        closeMobileSidebar();
    }
});

// Close sidebar on escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeMobileSidebar();
    }
});

// Make mobile functions globally available
window.toggleMobileSidebar = toggleMobileSidebar;
window.closeMobileSidebar = closeMobileSidebar;

// ==========================================
// CHEST SYSTEM IMPLEMENTATION
// ==========================================

const chestTiers = [
    { id: 'basic', name: 'Basic Chest', price: 100, limit: -1, color: 'chest-basic', chance: 0.0001, icon: '🟢', limitType: 'none', duration: 400 },
    { id: 'advanced', name: 'Advanced Chest', price: 350, limit: 3, color: 'chest-advanced', chance: 0.001, icon: '🔵', limitType: 'daily', duration: 600 },
    { id: 'elite', name: 'Elite Chest', price: 900, limit: 1, color: 'chest-elite', chance: 0.005, icon: '🟣', limitType: 'daily', duration: 900 },
    { id: 'master', name: 'Master Chest', price: 2500, limit: 1, color: 'chest-master', chance: 0.01, icon: '🟠', limitType: 'weekly', duration: 1200 },
    { id: 'ascended', name: 'Ascended Chest', price: 99999, limit: 0, color: 'chest-ascended', chance: 0.05, icon: '🔴', limitType: 'event', duration: 1800 }
];

function getChestLimits() {
    if (!currentUser) return {};
    const key = `chestLimits_${currentUser.id}`;
    const stored = JSON.parse(localStorage.getItem(key) || '{}');

    // Check resets
    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    // Calculate week number manually for ISO week
    const date = new Date(now.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    const weekNum = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    const thisWeek = `${date.getFullYear()}-W${weekNum}`;

    if (stored.date !== today) {
        // Daily reset
        stored.daily = {};
        stored.date = today;
    }

    if (stored.week !== thisWeek) {
        // Weekly reset
        stored.weekly = {};
        stored.week = thisWeek;
    }

    return stored;
}

function saveChestLimits(limits) {
    if (!currentUser) return;
    const key = `chestLimits_${currentUser.id}`;
    localStorage.setItem(key, JSON.stringify(limits));
}

function renderChests() {
    const grid = document.getElementById('chest-grid');
    if (!grid) return;

    const limits = getChestLimits();
    grid.innerHTML = '';

    chestTiers.forEach(tier => {
        const card = document.createElement('div');
        card.className = `chest-card ${tier.color} ${tier.id}`; // Add ID class for specific targeting

        // Count usage
        let usage = 0;
        if (tier.limitType === 'daily') usage = limits.daily?.[tier.id] || 0;
        if (tier.limitType === 'weekly') usage = limits.weekly?.[tier.id] || 0;

        const isLocked = tier.limit !== -1 && usage >= tier.limit;

        card.innerHTML = `
            <div class="chest-visual-wrapper">
                 <div class="chest-visual-box">
                    <div class="chest-lid">
                        <div class="chest-lid-top"></div>
                        <div class="chest-lid-side"></div>
                    </div>
                    <div class="chest-body-box">
                         <div class="chest-lock">
                            <div class="chest-lock-hole"></div>
                         </div>
                         <div class="chest-corner corner-tl"></div>
                         <div class="chest-corner corner-tr"></div>
                         <div class="chest-corner corner-bl"></div>
                         <div class="chest-corner corner-br"></div>
                    </div>
                    <div class="chest-highlights"></div>
                 </div>
                 <div class="chest-platform"></div>
            </div>

            <div class="chest-info" style="text-align: center; margin-top: 15px;">
                <h3 style="margin: 0; font-size: 1.1rem; color: #333;">${tier.name}</h3>
                <div class="chest-price" style="margin: 5px 0; font-weight: bold; color: gold; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                    <span>🪙 ${tier.price.toLocaleString()}</span>
                </div>
                ${tier.limit !== -1 ? `<div class="chest-limit" style="font-size: 0.8rem; opacity: 0.7; color: #666;">${usage}/${tier.limit} ${tier.limitType === 'daily' ? 'Günlük' : 'Həftəlik'}</div>` : ''}
            </div>

            <button class="action-btn chest-buy-btn" onclick="window.buyChest('${tier.id}')" ${isLocked ? 'disabled' : ''} style="width: 100%; margin-top: 10px; ${isLocked ? 'background: #555;' : ''}">
                ${isLocked ? 'Bitdi' : 'Aç!'}
            </button>
        `;

        grid.appendChild(card);
    });
}

function buyChest(tierId) {
    // DEBUG ALERT
    console.log('BuyChest Triggered', tierId);

    try {
        console.log('Attempting to buy chest:', tierId);
        const tier = chestTiers.find(t => t.id === tierId);
        if (!tier) {
            console.error('Tier not found');
            return;
        }

        if (userPoints < tier.price) {
            showToast('Kifayət qədər xalınız yoxdur!', 'error');
            return;
        }

        const limits = getChestLimits();
        let usage = 0;
        if (tier.limitType === 'daily') usage = limits.daily?.[tierId] || 0;
        if (tier.limitType === 'weekly') usage = limits.weekly?.[tierId] || 0;

        if (tier.limit !== -1 && usage >= tier.limit) {
            showToast('Limit dolub!', 'error');
            return;
        }

        // Deduct points
        userPoints -= tier.price;
        if (typeof renderPoints === 'function') renderPoints();
        if (typeof updateShopBalance === 'function') updateShopBalance();
        saveUserData();

        // Update limits
        if (tier.limitType === 'daily') {
            if (!limits.daily) limits.daily = {};
            limits.daily[tierId] = (limits.daily[tierId] || 0) + 1;
        } else if (tier.limitType === 'weekly') {
            if (!limits.weekly) limits.weekly = {};
            limits.weekly[tierId] = (limits.weekly[tierId] || 0) + 1;
        }
        saveChestLimits(limits);

        renderChests();

        // Open Animation
        openChestModal(tier);
    } catch (e) {
        console.error('Buy Chest Error:', e);
        alert('Xəta baş verdi: ' + e.message);
    }
}

function openChestModal(tier) {
    const modal = document.getElementById('chest-modal');
    const box = document.getElementById('chest-box');
    const light = document.getElementById('chest-light');
    const rewardDiv = document.getElementById('chest-reward');

    if (!modal) {
        console.error('Chest modal not found');
        return;
    }

    modal.classList.remove('hidden');
    if (box) {
        box.className = `chest-box ${tier.id}`; // Add tier class for styling
        box.classList.remove('open');
        box.style.animation = '';
    }
    if (light) light.classList.add('hidden');
    if (rewardDiv) rewardDiv.classList.add('hidden');

    // Ascended Effect: Darken Background
    if (tier.id === 'ascended') {
        modal.querySelector('.chest-modal-backdrop').style.background = 'rgba(0,0,0,0.95)';
    } else {
        modal.querySelector('.chest-modal-backdrop').style.background = '';
    }

    const duration = tier.duration || 1000;

    // Sequence
    // 1. Shake/Levitate
    if (box) {
        if (tier.id === 'ascended') {
            box.style.animation = `levitate ${duration / 1000}s ease-in-out infinite`;
        } else {
            box.style.animation = `shake 0.1s ease-in-out infinite`; // Fast shake
        }
    }

    setTimeout(() => {
        // 2. Stop shake, Enlarge, Open
        if (box) {
            box.style.animation = 'chestGrow 0.5s forwards'; // Grow effect
            setTimeout(() => {
                box.classList.add('open');
            }, 200); // Slight delay for grow to start
        }
        if (typeof playNotificationSound === 'function') playNotificationSound();

        // Tier specific effects on open
        if (tier.id === 'master' || tier.id === 'ascended') {
            // Stronger light
            if (light) light.style.boxShadow = '0 0 100px 50px white';
        } else {
            if (light) light.style.boxShadow = '';
        }

        setTimeout(() => {
            // 3. Light
            if (light) light.classList.remove('hidden');

            setTimeout(() => {
                // 4. Reward
                showChestReward(tier);
                if (rewardDiv) rewardDiv.classList.remove('hidden');
            }, 500);
        }, 500);
    }, duration);
}

function showChestReward(tier) {
    const rewardIconDiv = document.getElementById('reward-icon');
    const rewardNameDiv = document.getElementById('reward-name');
    const rewardRarityDiv = document.getElementById('reward-rarity');
    const rewardDescDiv = document.getElementById('reward-desc');
    const rewardGlow = document.querySelector('.reward-glow');

    if (!rewardIconDiv || !rewardNameDiv) return;

    // Drop logic
    const roll = Math.random() * 100;
    let droppedRarity = 'common';

    // Configured Chances: Common 70%, Rare 22%, Epic 7%, Legendary 0.9%, Mythic 0.1%
    if (roll > 99.9) droppedRarity = 'mythic';
    else if (roll > 99.0) droppedRarity = 'legendary';
    else if (roll > 92.0) droppedRarity = 'epic';
    else if (roll > 70.0) droppedRarity = 'rare';
    else droppedRarity = 'common'; // Includes common and uncommon

    // Filter Shop Items
    let pool = [];
    if (droppedRarity === 'common') {
        pool = shopItems.filter(i => i.rarity === 'common' || i.rarity === 'uncommon');
    } else {
        pool = shopItems.filter(i => i.rarity === droppedRarity);
    }

    // Fallback if pool is empty (e.g. no mythics available)
    if (pool.length === 0) {
        pool = shopItems.filter(i => i.rarity === 'common');
        droppedRarity = 'common';
    }

    // Pick Random Item
    const item = pool[Math.floor(Math.random() * pool.length)];

    // Check Ownership
    const isOwned = userInventory.some(inv => inv.id === item.id);

    let displayText = '';
    let displayIcon = '';
    let displayClass = '';

    if (!isOwned) {
        // New Item!
        userInventory.push({ id: item.id, date: new Date().toISOString() });
        displayText = item.name;
        displayIcon = item.icon;
        displayClass = `rarity-${item.rarity}`; // Assuming CSS classes exist or we add them
        if (rewardDescDiv) rewardDescDiv.textContent = `Shop Item (${item.rarity.toUpperCase()})`;

        // Save
        saveUserData();
    } else {
        // Duplicate - Convert to Coins
        const refund = Math.floor(item.price / 2);
        displayText = `Duplicate: ${item.name}`;
        displayIcon = '💰';
        displayClass = 'rarity-common';
        userPoints += refund;
        if (rewardDescDiv) rewardDescDiv.textContent = `Converted to ${refund} Coins`;
        // Save
        saveUserData();
    }

    // Update UI
    rewardNameDiv.textContent = displayText;
    rewardIconDiv.textContent = displayIcon;
    rewardRarityDiv.textContent = droppedRarity.toUpperCase();
    rewardRarityDiv.className = `reward-rarity ${droppedRarity}`;

    // Colors for Rarity
    const colors = {
        common: '#bdbdbd',
        rare: '#42a5f5',
        epic: '#ab47bc',
        legendary: '#ffa000',
        mythic: '#ff5252'
    };

    const color = colors[droppedRarity] || '#fff';
    if (rewardGlow) rewardGlow.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
    rewardNameDiv.style.color = color;

    saveUserData();
}

function closeChestModal() {
    const modal = document.getElementById('chest-modal');
    if (modal) modal.classList.add('hidden');
}

// Make global
window.buyChest = buyChest;
window.closeChestModal = closeChestModal;
window.renderChests = renderChests;
