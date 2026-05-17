🎮 Oyunlaşdırmanı Dərinləşdirmək (Gamification) Xal və mağaza sistemi artıq var. Gəlin onları daha mənalı edək.

2. "XP" (Təcrübə) və Səviyyə (Level) Sistemi Nədir: Xərclənən "Xal"lardan (Points) əlavə, heç vaxt xərclənməyən "Təcrübə" (XP) sistemi.

Necə İşləyəcək (Frontend ilə):

userPoints (xərclənə bilən) ilə yanaşı userXP (cəmi qazanılan) dəyişəni yaradın.

awardPoints funksiyası hər iki dəyəri də artırsın.

Header-də şagirdin adı altında kiçik bir "XP Tərəqqi Zolağı" (<progress>) və "Səviyyə 1" yazısı olsun.

Səviyyəni hesablamaq üçün sadə bir formula istifadə edin (məs: let level = Math.floor(userXP / 100) + 1;).

Effekti: Mağazadakı bəzi əşyaları səviyyəyə görə kilidləyə bilərsiniz (məs: "Ejder Qanadları"nı almaq üçün 5-ci səviyyə olmaq lazımdır). Bu, şagirdləri təkcə xal yox, həm də səviyyə toplamağa həvəsləndirəcək.

3. Gündəlik "Streak" (Davamlılıq) Sistemi Nədir: Hər gün platformaya daxil olmaq üçün bonus xallar vermək.

Necə İşləyəcək (Frontend ilə):

localStorage-da son giriş tarixini (lastLoginDate) saxlayın.

(Simulyasiya edilmiş) giriş zamanı yoxlayın: əgər bugünkü tarix dünənki tarixdən 1 gün sonradırsa, "streak" sayğacını artırın (userStreak++).

Header-də bir alov ikonu (🔥) və userStreak sayını göstərin.

Əgər userStreak 3, 5, 7 günə çatarsa, avtomatik bonus xal (awardPoints(50, "7 günlük davamlılıq bonusu!")) verin.

7. "Pomodoro" Taymeri Nədir: Şagirdlərin fokuslanmasına kömək edən 25 dəqiqəlik daxili taymer.

Necə İşləyəcək (Frontend ilə):

UserProfilPanel-də (bildiriş zənginin yanında) kiçik bir taymer ikonu əlavə edin.

Kliklədikdə, 25 dəqiqədən geriyə sayan bir setInterval başlasın.

Vaxt bitdikdə, brauzer səsi (new Audio(...)) oxudulsun və "Fasilə vaxtıdır! 5 dəqiqə dincəl." deyə bir "toast" bildirişi çıxsın.

Nəticə: Platformanı sadəcə tapşırıq təhvil vermə yerindən, həm də bir dərs çalışma vasitəsinə çevirir.

"Bəcəriklər Ağacı" (Skill Tree) Nədir: "Nişanlar" (Badges) bölməsini aşağı sürüşdürdükdə çıxam vizual və oyunlaşdırılmış skill tree. Şagird sadəcə nişan siyahısı görmür, bir oyundakı kimi "bəcəriklər ağacı"nı açır.

Necə İşləyəcək (Frontend ilə):

Yeni bir səhifə yaradın ("Bəcəriklərim").

CSS və ya SVG istifadə edərək budaqlanan bir ağac sxemi çəkin.

Ağacın "budaqları" fənlər olsun (Riyaziyyat, Tarix, Ədəbiyyat).

"Yarpaqlar" isə mövzular və ya nişanlar olsun (məs: "Kvadrat Tənliklər", "Esse Yazmaq", "Mentor I").

localStorage-dan şagirdin qiymətləri və nişanları oxunur. Əgər şagird "Riyaziyyat" tapşırığından 5 alıbsa, "Kvadrat Tənliklər" yarpağı "aktivləşir" (məsələn, rəngi dəyişir, parlayır).

Bir budaqdakı bütün yarpaqlar açıldıqda, o budaq (fənn) "Ustad" (Mastered) səviyyəsinə çatır.

5. Proqressiv Veb Tətbiqi (PWA) - Offline Rejim Nədir: Saytın telefona və ya kompüterə bir tətbiq kimi "quraşdırılmasına" və internet olmadan işləməsinə imkan vermək.

Necə İşləyəcək (Frontend ilə):

Bir manifest.json faylı (tətbiqin adını, ikonunu müəyyən edir) və bir Service Worker (sw.js) faylı yaratmaq lazımdır.

Service Worker arxa planda işləyərək bütün əsas faylları (HTML, CSS, JS, Avatarlar) brauzerin "keş" yaddaşına yazacaq.

İstifadəçi interneti itirdikdə belə, saytı açanda Service Worker bu keşlənmiş faylları göstərəcək və tətbiq (AI funksiyaları xaric) tam işlək qalacaq.

Nəticə: Tətbiqə yerli (native) tətbiq hissi verir, çox sürətli yüklənir və internet kəsintilərinə davamlı olur.

6. Dinamik Temalar (Dark Mode və Fənn Temaları) Nədir: Tətbiqin rəng sxemasını dəyişdirmək.

Necə İşləyəcək (Frontend ilə):

Qaranlıq/İşıqlı Rejim: Profil ayarlarındakı mövcud "Əlçatanlıq" bölməsinə "Qaranlıq Rejim" keçiricisi (toggle) əlavə edin. Bu, <body>-yə dark-mode sinfi əlavə edəcək və CSS dəyişənləri (:root) vasitəsilə bütün rəngləri tündləşdirəcək. Seçim localStorage-da saxlanılsın.

Fənn Temaları (Bonus): Şagird "Tarix" tapşırığına daxil olduqda, --primary-color-u müvəqqəti olaraq qəhvəyi/sepia rənginə dəyişin. "Biologiya" üçün yaşıl, "Fizika" üçün tünd göy edin. Bu, kontekst hissini gücləndirir.

Nəticə: İstifadəçiyə daha çox nəzarət verir və tətbiqi vizual olaraq daha cəlbedici edir.

bunların hamısını yalnız index.html daxilində yaz