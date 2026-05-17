// AI Routes - Gemini 2.0 Flash Integration
require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { dbHelpers } = require('../db');
const router = express.Router();

console.log('🤖 AI Routes loaded successfully');

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Try the latest Gemini 3 Flash model
let model = null;

if (!genAI) {
    console.log('[AI] GEMINI_API_KEY is missing. AI features will use fallback mode only.');
} else {
    try {
        console.log('Trying to initialize model: gemini-3-flash-preview');
        model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
        console.log('✅ Successfully initialized model: gemini-3-flash-preview');
    } catch (error) {
        console.log('❌ Failed to initialize gemini-3-flash-preview:', error.message);

        // Fallback to older models
        const fallbackModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
        for (const modelName of fallbackModels) {
            try {
                console.log(`Trying fallback model: ${modelName}`);
                model = genAI.getGenerativeModel({ model: modelName });
                console.log(`✅ Successfully initialized fallback model: ${modelName}`);
                break;
            } catch (error) {
                console.log(`❌ Failed fallback model ${modelName}:`, error.message);
            }
        }
    }
}

if (!model) {
    console.log('❌ No Gemini models available, using fallback mode only');
}

// Auth middleware
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Daxil olmaq tələb olunur' });
    }
    next();
};

// EduBot chat endpoint
router.post('/edubot/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Mesaj tələb olunur' });
        }

        // Create prompt for educational assistant
        const prompt = `Sən EduBot adlı Azərbaycan dilində danışan AI köməkçisən.

CAVAB UZUNLUĞU QAYDALARI (ÇOX VACİBDİR - MÜTLƏQbunu izlə!):
- SADƏ SUALLAR (salam, necəsən, nə var, sağ ol, təşəkkür, hələlik, görüşərik və s.): 
  YALNIZ 1-2 QISA CÜMLƏ! Uzun cavab vermə!
  Nümunə: "Salam! 👋 Hansı dərsdə kömək lazımdır?" - BU QƏDƏR!
  
- DƏRS MÖVZULARI (riyaziyyat, tarix, ədəbiyyat, fizika, kimya, biologiya, coğrafiya, tənlik, məsələ, tapşırıq və s.): 
  Sokrat üsulu ilə ətraflı izah et, suallar ver, şagirdi düşündür.

ÜMUMI QAYDALAR:
1. Şagirdlərə hazır cavablar vermə, onları düşünməyə yönləndir
2. Azərbaycan dilində danış
3. Dostcasına və dəstəkləyici ol
4. Əgər şagird bilmirsə, doğru suallarla onları həllə yönləndir
5. Məktəb mövzuları: Riyaziyyat, Tarix, Ədəbiyyat, Fizika, Kimya, Biologiya, Coğrafiya

Şagirdin mesajı: "${message}"

${context ? `Əvvəlki kontekst: ${context}` : ''}

XATIRLA: Sadə salamlaşmaya QISA cavab ver!
Cavabını ver:`;

        // Check if model is available
        if (!model) {
            const fallbackResponse = getFallbackResponse(message);
            res.json({
                success: false,
                fallback: fallbackResponse
            });
            return;
        }

        // Generate response with Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            response: text,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Gemini API error:', error);
        // Always return fallback response instead of error
        const fallbackResponse = getFallbackResponse(message);
        res.json({
            success: false,
            fallback: fallbackResponse
        });
    }
});

// Assignment Analysis Endpoint
router.post('/analyze-assignment', async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Başlıq və məzmun tələb olunur' });
        }

        const prompt = `
        Aşağıdakı şagird işini analiz et və Azərbaycan dilində cavab ver. 
        Xüsusilə mətnin internetdən kopyalanıb-kopyalanmadığını (plagiat) yoxla.
        Mətnə əsasən şagirdin mövzunu başa düşüb-düşmədiyini qiymətləndir.

        Tapşırıq: ${title}
        Şagird cavabı: ${content}

        Zəhmət olmasa aşağıdakı formatda (YALNIZ JSON) cavab ver:
        {
          "plagiarism": "Plagiat yoxlaması nəticəsi (məsələn: 'Mətn orijinal görünür' və ya 'Mətnin bəzi hissələri internet resursları ilə eynilik təşkil edir')",
          "mainPoints": "Şagirdin toxunduğu əsas məqamlar və çatışmazlıqlar",
          "suggestion": "Şagirdə və müəllimə tövsiyələr"
        }
        JSON formatından başqa heç nə yazma.`;

        if (!model) {
            return res.json({
                success: true,
                analysis: {
                    plagiarism: "AI xidməti aktiv deyil. Əllə yoxlama tövsiyə olunur.",
                    mainPoints: "Məzmun analiz edilə bilmədi.",
                    suggestion: "Zəhmət olmasa daha sonra təkrar yoxlayın."
                },
                isFallback: true
            });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let analysis = {};
        try {
            analysis = JSON.parse(text);
        } catch (parseError) {
            console.error('JSON Parse Error in assignment analysis:', parseError);
            // Fallback parsing if JSON fails
            analysis = {
                plagiarism: "Təhlil zamanı xəta baş verdi.",
                mainPoints: "Mətn oxuna bilmədi.",
                suggestion: "AI cavabı formatlanarkən xəta oldu."
            };
        }

        res.json({
            success: true,
            analysis: analysis
        });

    } catch (error) {
        console.error('Assignment Analysis Error:', error);
        res.status(500).json({ error: 'Analiz zamanı xəta baş verdi' });
    }
});

// Generic AI Chat Endpoint (for simple prompts)
router.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt tələb olunur' });
        }

        if (!model) {
            return res.json({
                success: false,
                response: "AI xidməti aktiv deyil.",
                isFallback: true
            });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            response: text
        });

    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ error: 'AI ilə əlaqə zamanı xəta baş verdi' });
    }
});



// Fallback response function (in case Gemini API fails)
function getFallbackResponse(userText) {
    const text = userText.toLowerCase();

    // Greetings
    if (text.match(/^(salam|sağ ol|necesən|necəsən|nə var|axşamın xeyir|sabahın xeyir)/)) {
        return 'Salam! 👋 Mən EduBot, sənin təhsil köməkçinəm. Sənə dərslərində necə kömək edə bilərəm?';
    }

    // Identity
    if (text.includes('kim') || text.includes('adın') || text.includes('nəçisən')) {
        return 'Mən EduBot, şagirdlərə və müəllimlərə kömək etmək üçün yaradılmış süni intellekt köməkçisiyəm. 🤖';
    }

    if (text.includes('riyaziyyat') || text.includes('tənlik')) {
        return 'Riyaziyyat mövzusunda çətinlik çəkirsən? Gəl birlikdə düşünək: Bu məsələdə hansı ədədləri bilirsən? Nəyi hesablamaq lazımdır?';
    }

    if (text.includes('tarix') || text.includes('səfəvi')) {
        return 'Tarix mövzusu! Əvvəlcə sənə bir sual: Bu dövr haqqında əvvəldən nə bilirsən? Hansı hadisələri xatırlayırsan?';
    }

    if (text.includes('ədəbiyyat') || text.includes('şeir')) {
        return 'Ədəbiyyat gözəl mövzudur! Hansı əsər haqqında danışırıq? Əsərin əsas ideyası nə ola bilər, sənin fikrincə?';
    }

    return 'Maraqlı sual! 🤔 Gəl birlikdə düşünək. Bu mövzuda əvvəldən nə bilirsən? Səncə cavab nə ola bilər? (AI bağlantısı yoxlansa daha ətraflı kömək edə bilərəm)';
}

// Generate Quiz Endpoint
router.post('/generate-quiz', async (req, res) => {
    try {
        const { subject, topic, difficulty } = req.body;

        if (!subject || !topic) {
            return res.status(400).json({ error: 'Fənn və mövzu tələb olunur' });
        }

        const prompt = `Azərbaycan dilində 5 suallıq test yarat.
Fənn: ${subject}
Mövzu: ${topic}
Çətinlik: ${difficulty || 'orta'}

Çıxış yalnız JSON formatında olsun və bu struktura malik olsun:
[
  {
    "question": "Sual mətni",
    "options": ["A variantı", "B variantı", "C variantı", "D variantı"],
    "correctIndex": 0 (düzgün cavabın indeksi 0-3 arası)
  }
]
JSON-dan başqa heç nə yazma.`;

        // Check if model is available
        if (!model) {
            // Mock response for fallback
            const mockQuiz = [
                {
                    question: `${topic} haqqında əsas sual nədir? (AI İnteqrasiyası yoxdur)`,
                    options: ["Variant A", "Variant B", "Variant C", "Variant D"],
                    correctIndex: 0
                },
                {
                    question: `${subject} fənnində ${difficulty} səviyyəli sual`,
                    options: ["Cavab 1", "Cavab 2", "Cavab 3", "Cavab 4"],
                    correctIndex: 1
                }
            ];

            return res.json({
                success: true,
                quiz: mockQuiz,
                isFallback: true
            });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let quiz = [];
        try {
            quiz = JSON.parse(text);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.log('Raw text:', text);
            return res.status(500).json({ error: 'AI cavabı oxuna bilmədi' });
        }

        res.json({
            success: true,
            quiz: quiz
        });

    } catch (error) {
        console.error('Quiz Generation Error:', error);
        res.status(500).json({ error: 'Quiz yaradılarkən xəta baş verdi' });
    }
});

// Content Moderation Endpoint - Check if message is appropriate
router.post('/moderate-content', async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Məzmun tələb olunur' });
        }

        // 1. STRICT LOCAL FILTER (First line of defense)
        // Azerbaijani and English bad words/slang
        let badWords = [
            // Azerbaijani - Explicit
            'söyüş', 'göt', 'cındır', 'qəhbə', 'fahişə', 'bic', 'peysər', 'gijdıllağ', 'gijdillagh',
            'sik', 'siktir', 'yarak', 'yaraq', 'amcıq', 'amciq', 'mem', 'məmə',
            'pox', 'zibil', 'kopeyoglu', 'köpəyoğlu', 'gic', 'sarsaq', 'tupoy', 'axmaq',
            'qehbe', 'fahise', 'dılğır', 'dilgir', 'got', 'sikdir', 'oxra', 'bestol',
            // English - Common
            'fuck', 'shit', 'bitch', 'ass', 'dick', 'pussy', 'whore', 'slut', 'bastard', 'cunt',
            'damn', 'nigger', 'nigga', 'faggot'
        ];

        // Fetch custom blacklist from DB
        try {
            const dbBlacklist = dbHelpers.checkBlacklist();
            if (dbBlacklist && dbBlacklist.length > 0) {
                const dbWords = dbBlacklist.map(b => b.word.toLowerCase());
                badWords = [...badWords, ...dbWords];
            }
        } catch (dbError) {
            console.error('Failed to fetch blacklist from DB:', dbError);
        }

        const lowerContent = content.toLowerCase();

        // Exact match or contains bad word padded with spaces/start/end
        // This prevents blocking legitimate words (e.g., "analiz" containing "anal")
        // But for Azerbaijani, direct contains is often better for agglutinative languages, 
        // though we must be careful. Let's start with flexible contains for specific strong words.

        const strictMatch = badWords.some(word => {
            // Regex for exact word or word surrounded by non-letters
            const regex = new RegExp(`(^|[^a-zA-ZğüşıöçəĞÜŞIÖÇƏ])${word}([^a-zA-ZğüşıöçəĞÜŞIÖÇƏ]|$)`, 'u');
            return regex.test(lowerContent) || lowerContent.includes(word); // For now, simple includes for this list is safer for safety
        });

        if (strictMatch) {
            return res.json({
                safe: false,
                reason: 'Qadağan olunmuş sözlər aşkarlandı (Avtomatik)',
                fallback: true
            });
        }

        // 2. AI FILTER (Contextual & Advanced)
        if (!model) {
            // If valid but model offline, and passed local filter, let it pass
            return res.json({ safe: true, message: 'AI unavailable, passed local filter' });
        }

        const prompt = `Sən sərt bir məzmun moderatorusan. Aşağıdakı mesajı yoxla.

Mesaj: "${content}"

Qaydalar:
1. Azərbaycan dilində küçə söyüşləri, təhqirlər, "söyüş", "gijdıllağ", "peysər" və bənzəri sözlər QƏTİ QADAĞANDIR.
2. Hər hansı cinsi məzmun, biədəb sözlər QADAĞANDIR.
3. Mesajda hərflər dəyişdirilsə belə (məs: s!k, g*t) mənasını başa düş və blokla.
4. "Tənbəl", "dəcəl" kimi yüngül sözlər icazəlidir.

Cavab formatı (JSON):
{"safe": true} - tamamilə təmizdirsə
{"safe": false, "reason": "səbəb"} - qayda pozuntusu varsa

YALNIZ JSON QAYTAR.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const parsed = JSON.parse(text);
            res.json({
                safe: parsed.safe,
                reason: parsed.reason || null,
                fallback: false
            });
        } catch (parseError) {
            console.error('Moderation parse error:', parseError);
            // If response is not JSON but contains rejection keywords, assume unsafe
            if (text.toLowerCase().includes('false') || text.toLowerCase().includes('qadağan') || text.toLowerCase().includes('safe": false')) {
                res.json({ safe: false, reason: 'AI tərəfindən bloklandı', fallback: false });
            } else {
                res.json({ safe: true, reason: null, fallback: true });
            }
        }

    } catch (error) {
        console.error('Moderation error:', error);
        // Fallback to safe if local check passed
        res.json({ safe: true, reason: null, error: true });
    }
});

router.post('/test', async (req, res) => {
    try {
        const { message } = req.body;

        console.log('Testing Gemini API with message:', message);
        console.log('Model available:', !!model);

        // Check if model is available
        if (!model) {
            res.json({
                success: false,
                error: 'No Gemini model available',
                fallback: 'Fallback mode: Salam! Mən EduBot-am. Gemini API mövcud deyil, amma yenə də kömək edə bilərəm!'
            });
            return;
        }

        console.log('Using model:', model.model);

        const prompt = `Cavabını qısa saxla: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini API success:', text);

        res.json({
            success: true,
            response: text,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Gemini API test error:', error);
        console.error('Error details:', error.message);
        console.error('Full error:', error);

        res.status(500).json({
            error: 'Gemini API error',
            details: error.message,
            model: model ? model.model : 'none'
        });
    }
});

// ========================================
// ADMIN BLACKLIST MANAGEMENT
// ========================================

// Middleware for admin check
const requireAdmin = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Daxil olmaq tələb olunur' });
    }
    const user = dbHelpers.getUserById(req.session.userId);
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Yalnız adminlər üçündür' });
    }
    next();
};

// Get blacklist
router.get('/blacklist', requireAdmin, (req, res) => {
    try {
        const blacklist = dbHelpers.getBlacklist();
        res.json(blacklist);
    } catch (error) {
        console.error('Get blacklist error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Add word to blacklist
router.post('/blacklist', requireAdmin, (req, res) => {
    try {
        const { word } = req.body;
        if (!word) {
            return res.status(400).json({ error: 'Söz tələb olunur' });
        }

        dbHelpers.addBlacklistWord(word, req.session.userId);
        res.json({ success: true, message: 'Söz qara siyahıya əlavə edildi' });
    } catch (error) {
        console.error('Add blacklist error:', error);
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: 'Bu söz artıq mövcuddur' });
        }
        res.status(500).json({ error: 'Server xətası' });
    }
});

// Remove word from blacklist
router.delete('/blacklist/:id', requireAdmin, (req, res) => {
    try {
        const id = parseInt(req.params.id);
        dbHelpers.removeBlacklistWord(id);
        res.json({ success: true, message: 'Söz silindi' });
    } catch (error) {
        console.error('Delete blacklist error:', error);
        res.status(500).json({ error: 'Server xətası' });
    }
});

module.exports = router;
