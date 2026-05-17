-- EduTask Seed Data
-- Initial data for testing

-- Insert classes
INSERT INTO classes (name) VALUES ('10F');
INSERT INTO classes (name) VALUES ('11A');
INSERT INTO classes (name) VALUES ('10A');

-- Insert users (passwords are plain text for demo - should be hashed in production)
-- Students
INSERT INTO users (username, password, full_name, role, class_id, avatar, points, xp, level, streak, birthday) 
VALUES ('ferid', '1234', 'Ferid', 'student', 1, 0, 150, 450, 3, 5, '2010-01-15');

INSERT INTO users (username, password, full_name, role, class_id, avatar, points, xp, level, streak, birthday) 
VALUES ('ayaz', '330', 'Ayaz', 'student', 1, 0, 50, 120, 1, 2, '2010-03-22');

INSERT INTO users (username, password, full_name, role, class_id, avatar, points, xp, level, streak) 
VALUES ('aysel', '1234', 'Aysel', 'student', 1, 1, 130, 380, 2, 3);

INSERT INTO users (username, password, full_name, role, class_id, avatar, points, xp, level, streak) 
VALUES ('resad', '1234', 'Rəşad', 'student', 1, 0, 120, 350, 2, 4);

INSERT INTO users (username, password, full_name, role, class_id, avatar, points, xp, level, streak) 
VALUES ('nigar', '1234', 'Nigar', 'student', 2, 1, 85, 240, 2, 1);

INSERT INTO users (username, password, full_name, role, class_id, avatar, points, xp, level, streak) 
VALUES ('tural', '1234', 'Tural', 'student', 2, 0, 75, 200, 1, 0);

-- Teachers
INSERT INTO users (username, password, full_name, role, avatar) 
VALUES ('huseyn', '1234', 'Hüseyn M.', 'teacher', 0);

-- Admin
INSERT INTO users (username, password, full_name, role, avatar) 
VALUES ('feridhuseyn', '1234', 'Feridhuseyn', 'admin', 0);

-- Update classes with teacher
UPDATE classes SET teacher_id = 7 WHERE id IN (1, 2, 3);

-- Insert sample assignments
INSERT INTO assignments (title, description, class_id, teacher_id, deadline, status)
VALUES ('Səfəvilər dövrü haqqında esse', 'Səfəvi dövlətinin yaranması və inkişafı haqqında 500 sözdən ibarət esse yazın.', 1, 7, datetime('now', '+7 days'), 'active');

INSERT INTO assignments (title, description, class_id, teacher_id, deadline, status)
VALUES ('Riyaziyyat tapşırığı', 'Dərslikdən 45-50 səhifələrdəki məsələləri həll edin.', 1, 7, datetime('now', '+3 days'), 'active');

-- Insert sample chat messages
INSERT INTO chat_messages (class_id, user_id, content, is_read)
VALUES (1, 3, 'Sabahkı tarix imtahanına hazırsınız?', 1);

INSERT INTO chat_messages (class_id, user_id, content, is_read)
VALUES (1, 4, 'Mən hələ Səfəvilər mövzusunu oxuyuram', 1);

INSERT INTO chat_messages (class_id, user_id, content, is_read)
VALUES (1, 1, 'Mən bitirmişəm, sualınız olsa yazın 📚', 1);

-- Insert sample wall posts
INSERT INTO wall_posts (class_id, user_id, content, is_question)
VALUES (1, 1, 'Bu linkdə Səfəvilər haqqında əla məlumat var: https://example.com/safeviler', 0);

-- Insert sample quiz
INSERT INTO quizzes (title, class_id, teacher_id)
VALUES ('Azərbaycan Tarixi - Səfəvilər', 1, 7);

INSERT INTO quiz_questions (quiz_id, question, type, options, correct_answer)
VALUES (1, 'Səfəvi dövləti hansı ildə qurulmuşdur?', 'multiple', '["1501", "1502", "1503", "1504"]', 0);

INSERT INTO quiz_questions (quiz_id, question, type, options, correct_answer)
VALUES (1, 'Şah İsmayılın atasının adı nə idi?', 'multiple', '["Şeyx Həydar", "Şeyx Səfi", "Şah Təhmasib", "Şah Abbas"]', 0);

-- Insert sample resources
INSERT INTO resources (title, description, class_id, teacher_id, category)
VALUES ('Tarix Dərslik - Səfəvilər', 'Səfəvilər dövrü haqqında ətraflı material', 1, 7, 'Tarix');

INSERT INTO resources (title, description, class_id, teacher_id, category, link)
VALUES ('Vikipediya - Şah İsmayıl', 'Şah İsmayıl haqqında məqalə', 1, 7, 'Tarix', 'https://az.wikipedia.org/wiki/I_%C5%9Eah_%C4%B0smay%C4%B1l');
