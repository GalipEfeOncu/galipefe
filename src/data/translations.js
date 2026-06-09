export const translations = {
    en: {
        nav: {
            about: "About",
            projects: "Projects",
            contact: "Contact"
        },
        hero: {
            role: "Software Engineering Student",
            status: "open to work",
            desc: "I build things that run, feel good, and don't break. Games, tools, web apps — if code can solve it, I'm already thinking about it.",
            interests: {
                gaming: "Gaming",
                walking: "Walking",
                reading: "Reading",
                fitness: "Fitness"
            },
            quote: "\"Whatever you do in this life, it's not legendary, unless your friends are there to see it.\""
        },
        about: {
            title: "About Me",
            bio1: "I'm <strong>{age}</strong> and studying Software Engineering at <strong>Fırat University</strong> in Elazığ — second year in. Grew up in <strong>Konya</strong>, Turkey.",
            bio2: "Before university I spent four years at <strong>Adilkaraağaç Vocational High School</strong>, IT department — that's where I got serious about how things actually work under the hood.",
            bio3: "I'm into building things that feel alive — Unity roguelikes, React apps, whatever. If there's an interesting problem, I'll dig into it. Outside of coding you'll usually find me out on a walk, reading, or at the gym.",
            facts: {
                location: "Location",
                locationVal: "Konya, Turkey",
                university: "University",
                universityVal: "Fırat University — Software Eng. (2nd year)",
                languages: "Languages",
                languagesVal: "Turkish (Native) · English (B2)",
                game: "Favorite Game",
                gameVal: "The Witcher 3: Wild Hunt"
            },
            cta: {
                projectsTitle: "What I've built",
                projectsDesc: "Games, tools, web stuff — take a look.",
                contactTitle: "Say hello",
                contactDesc: "Got a question or want to build something together? I'm around.",
                projectsCount: "{count} projects · games, tools, web",
                contactChannels: "3 ways to reach me"
            },
            heading: "Hi, I'm Galip. I write code and build things people actually use.",
            interestsPanel: "interests",
            stackPanel: "stack · what I work with",
            kvLocation: "location",
            kvEdu: "edu",
            kvLang: "lang",
            kvFocus: "fav game"
        },
        projects: {
            title: "Projects",
            subtitle: "Games, desktop apps, web tools — stuff I built because I wanted to see if I could.",
            filters: {
                all: "All",
                completed: "Completed",
                wip: "Work in Progress",
                discontinued: "Discontinued"
            },
            emptyStateTitle: "No projects found",
            emptyStateDesc: "There are no projects matching the selected status filter.",
            modal: {
                about: "About",
                learnings: "Key Learnings",
                liveDemo: "Live Demo",
                githubRepo: "GitHub Repo"
            },
            featuredLabel: "★ FEATURED",
            sortLabel: "sort: recent ↓",
            viewDetails: "open →"
        },
        modal: {
            keyTakeaways: "// KEY TAKEAWAYS",
            stack: "STACK",
            repo: "⎇ Repo",
            liveDemo: "▶ Live Demo",
            close: "× close",
            github: "github↗",
            idLabel: "id",
            statusLabel: "status",
            repoLabel: "repo"
        },
        contact: {
            title: "Let's Connect",
            subtitle: "Got a project, a collab idea, or just want to talk code? I'm around.",
            elsewhere: "Find Me Elsewhere",
            skills: "Technical Skills",
            category: {
                lang: "Languages",
                frameworks: "Frameworks & Tools",
                backend: "Backend & Database",
                gamedev: "Game Development"
            },
            ctaTitle: "Got something cooking?",
            ctaDesc: "Take a look at what I've been building — or just message me directly.",
            ctaBtn: "See my work →",
            heading: "Say hi.",
            primaryChannels: "reach me here",
            elsewherePanel: "find me around the web",
            formName: "Name",
            formEmail: "Email",
            formMessage: "Message",
            formSubmit: "Send Message",
            formSubmitting: "Sending...",
            formSuccess: "Thanks! Your message has been sent successfully.",
            formError: "Oops! There was a problem submitting your message. Please try mail directly.",
            formTitle: "Send a Message",
            projectCTA: "Got something in mind?",
            projectCTADesc: "Send a message — I usually get back the same day.",
            availabilityPanel: "status",
            availabilityStatus: "open to work",
            availabilityTypes: "full-time · freelance · side projects",
            responseLabel: "response",
            responseVal: "~24h",
            timezoneLabel: "timezone",
            timezoneVal: "GMT+3 · Istanbul",
            preferredLabel: "best way",
            preferredVal: "email →",
            whatImInto: "what I'm into",
            interest1: "Game dev — the feel, the systems, the tiny details that make it click",
            interest2: "Modern web — React, smooth interactions, clean UX",
            interest3: "Tools that actually save people time",
            githubDesc: "Where most of my code lives",
            linkedinDesc: "If you're the professional type",
            emailDesc: "Fastest way to actually reach me",
            viewProjects: "see my work →"
        },
        projectData: {
            chaosTyping: {
                subtitle: "React & Vite / Web Browser Game",
                desc: "A typing game that actively fights you. Fake Windows errors, screen tilts, blur effects, WhatsApp pop-ups — the UI is trying to make you lose. There's also a dynamic word pool to test focus under pressure and a real-time global leaderboard backed by Firebase.",
                learnings: [
                    "High-performance game loops in React with requestAnimationFrame",
                    "Complex state management across Context and Refs",
                    "Real-time global leaderboard with Firebase",
                    "UI elements designed to actively frustrate the player (intentionally)",
                    "Keeping DOM updates smooth at 60 FPS under heavy load"
                ]
            },
            soulClaim: {
                subtitle: "Unity 2D / Action Roguelike",
                desc: "A fast and chaotic action game in the Vampire Survivors vein, built from scratch in Unity with C#. I designed it around an ECS approach for performance and wrote a custom Object Pooling system so hundreds of enemies can be on screen at once without any frame drops.",
                learnings: [
                    "ECS architecture — what it actually means in practice",
                    "Object Pooling to keep memory in check under heavy entity counts",
                    "ScriptableObjects for clean, tweak-friendly data structures",
                    "Event-driven design with the Observer pattern",
                    "Visual polish with Unity's Universal Render Pipeline (URP)"
                ]
            },
            gameTracker: {
                subtitle: ".NET WinForms Desktop App",
                desc: "A desktop app for organizing your game library — not just CRUD, but smart. It pulls game data from the RAWG API and uses Google Gemini AI to recommend new games based on what's already in your collection. Data is stored locally in MSSQL.",
                learnings: [
                    "Building a non-standard, polished UI in C# WinForms",
                    "Relational database management with MSSQL and ADO.NET",
                    "Consuming REST APIs and parsing large JSON payloads (RAWG API)",
                    "Integrating Gemini AI for personalized recommendations",
                    "Async/Await to keep the UI from freezing during API calls"
                ]
            },
            prayerTime: {
                subtitle: "React & Vite / Modern Web App",
                desc: "A clean, fast web app for tracking daily prayer times. It detects your location automatically, shows a live countdown to the next prayer, and highlights special religious days. Built with React and Vite with a focus on responsiveness and simplicity.",
                learnings: [
                    "Building a solid SPA with React from the ground up",
                    "Managing time-sensitive state with useState and useEffect",
                    "Working with multiple external APIs for location and time data",
                    "Responsive layouts with Tailwind CSS",
                    "Date and time arithmetic in JavaScript (trickier than it sounds)"
                ]
            },
            survivalGame: {
                subtitle: "Unity 3D / First Person Survival",
                desc: "A first-person survival game with no pre-made maps — terrain is generated on the fly using Perlin Noise and custom mesh generation. The world keeps building itself as you explore. Also includes resource gathering, an inventory system, and core survival mechanics.",
                learnings: [
                    "Procedural terrain generation with Perlin Noise algorithms",
                    "Real-time mesh generation and runtime optimization",
                    "First-person controller and camera feel",
                    "Resource gathering loops (mining, woodcutting)",
                    "Slot-based inventory logic"
                ]
            },
            autoReq: {
                subtitle: "Python / AI & NLP / Streamlit",
                desc: "A tool that takes messy, vague customer requirements and turns them into clean, structured engineering docs. It uses a hybrid AI pipeline — NLP for parsing structure, LLMs for generating readable output — built on top of spaCy, NLTK, and Streamlit.",
                learnings: [
                    "NLP in practice with spaCy and NLTK",
                    "Integrating LLMs into a real processing pipeline",
                    "Building usable AI dashboards with Streamlit",
                    "Working in an open-source team under Scrum",
                    "Structuring complex data flows for requirement analysis"
                ]
            },
            fileConverter: {
                subtitle: "Python / Streamlit / AI & Desktop",
                desc: "A cross-platform desktop app that brings together file conversion, document viewing, media playback, and AI-powered document analysis — all in one place, all offline. Built to handle a wide range of formats without needing an internet connection.",
                learnings: [
                    "Cross-platform desktop utilities with Python and Streamlit",
                    "File conversion pipelines for multiple formats",
                    "AI-powered document summarization and Q&A",
                    "Multi-page app state and navigation management",
                    "Localization (i18n) for a multilingual user base"
                ]
            },
            financeTracker: {
                subtitle: "Python / Streamlit / Data Visualization",
                desc: "A personal finance tracker to keep income, expenses, and budget in check. Built to be genuinely useful — quick to log, clear to read, with visualizations that actually help you understand where your money's going.",
                learnings: [
                    "Data visualization with Python (Matplotlib, Plotly)",
                    "Building clean financial dashboards in Streamlit",
                    "Persistent local data storage for personal records",
                    "Intuitive expense categorization UX",
                    "Financial calculations and report generation"
                ]
            },
            kadeh: {
                subtitle: "React & Vite / Tailwind CSS / Web App",
                desc: "A Turkish-language guide to alcoholic drinks — histories, production methods, tasting notes, serving tips — designed for curious beginners and enthusiasts alike. The UI leans into a premium dark magazine feel.",
                learnings: [
                    "Content-heavy static SPA architecture with React and Vite",
                    "Premium dark UI design with Tailwind CSS",
                    "Organizing and structuring large static datasets as JS/JSON",
                    "Fast, accessible filtering and search UX"
                ]
            }
        }
    },
    tr: {
        nav: {
            about: "Hakkımda",
            projects: "Projeler",
            contact: "İletişim"
        },
        hero: {
            role: "Yazılım Mühendisliği Öğrencisi",
            status: "yeni fırsatlara açık",
            desc: "Çalışan, iyi hissettiren ve bozulmayan şeyler yapıyorum. Oyunlar, araçlar, web uygulamaları — kodla çözülüyorsa, kafam zaten orada.",
            interests: {
                gaming: "Oyun",
                walking: "Yürüyüş",
                reading: "Okuma",
                fitness: "Fitness"
            },
            quote: "\"Bu hayatta ne yaparsan yap — arkadaşların orada değilse efsane olmaz.\""
        },
        about: {
            title: "Hakkımda",
            bio1: "Ben <strong>{age} yaşındayım</strong>, <strong>Konya</strong>'dan geliyorum. Şu an Elazığ'da <strong>Fırat Üniversitesi</strong> Yazılım Mühendisliği'nde ikinci sınıfı okuyorum.",
            bio2: "Üniversiteye başlamadan önce <strong>Adilkaraağaç Mesleki ve Teknik Anadolu Lisesi</strong>'nin Bilişim Teknolojileri bölümünü bitirdim. Teknik temeli orada attım, gerçekten işe yaradı.",
            bio3: "Unity'de roguelike yazmaktan React'la web uygulaması geliştirmeye kadar her şeye giriyorum. İlginç bir problem varsa zaten içine giriyorum. Ekran başında olmadığımda genelde yürüyüşteyim, bir kitabın içindeyim ya da spordayım.",
            facts: {
                location: "Konum",
                locationVal: "Konya, Türkiye",
                university: "Üniversite",
                universityVal: "Fırat Üni. — Yazılım Müh. (2. Sınıf)",
                languages: "Diller",
                languagesVal: "Türkçe (Anadil) · İngilizce (B2)",
                game: "Favori Oyun",
                gameVal: "The Witcher 3: Wild Hunt"
            },
            cta: {
                projectsTitle: "Yaptıklarım",
                projectsDesc: "Oyunlar, araçlar, web şeyleri — bir göz at.",
                contactTitle: "Selam ver",
                contactDesc: "Bir soru mu var, birlikte bir şey mi inşa edelim? Buradayım.",
                projectsCount: "{count} proje · oyunlar, araçlar, web",
                contactChannels: "3 farklı yoldan ulaşabilirsin"
            },
            heading: "Merhaba, ben Galip. Kod yazıyorum, işe yarayan şeyler yapıyorum.",
            interestsPanel: "ilgi alanları",
            stackPanel: "stack · çalıştığım teknolojiler",
            kvLocation: "konum",
            kvEdu: "okul",
            kvLang: "dil",
            kvFocus: "fav oyun"
        },
        projects: {
            title: "Projeler",
            subtitle: "Oyunlar, masaüstü uygulamalar, web araçları — yapıp yapamayacağımı görmek için başladığım şeyler.",
            filters: {
                all: "Tümü",
                completed: "Bitti",
                wip: "Devam ediyor",
                discontinued: "Askıya alındı"
            },
            emptyStateTitle: "Proje bulunamadı",
            emptyStateDesc: "Seçilen durum filtresine uygun bir proje bulunmuyor.",
            modal: {
                about: "Hakkında",
                learnings: "Neler Öğrendim",
                liveDemo: "Canlı Demo",
                githubRepo: "GitHub Repo"
            },
            featuredLabel: "★ ÖNE ÇIKAN",
            sortLabel: "sırala: yeni ↓",
            viewDetails: "aç →"
        },
        modal: {
            keyTakeaways: "// ÖĞRENDİKLERİM",
            stack: "STACK",
            repo: "⎇ Repo",
            liveDemo: "▶ Canlı Demo",
            close: "× kapat",
            github: "github↗",
            idLabel: "id",
            statusLabel: "durum",
            repoLabel: "repo"
        },
        contact: {
            title: "İletişim",
            subtitle: "Bir proje fikrin mi var, birlikte bir şey mi yapalım, yoksa sadece yazılımdan mı konuşalım? Her durumda buradayım.",
            elsewhere: "Diğer Platformlar",
            skills: "Kullandığım Araçlar",
            category: {
                lang: "Diller",
                frameworks: "Framework'ler & Araçlar",
                backend: "Backend & Veritabanı",
                gamedev: "Oyun Geliştirme"
            },
            ctaTitle: "Aklında bir şey mi döndü?",
            ctaDesc: "Neler yaptığıma bakabilir ya da direkt yazabilirsin.",
            ctaBtn: "projelerime bak →",
            primaryChannels: "buradan ulaşabilirsin",
            elsewherePanel: "internetteki diğer adreslerim",
            formName: "İsim",
            formEmail: "E-posta",
            formMessage: "Mesaj",
            formSubmit: "Mesajı Gönder",
            formSubmitting: "Gönderiliyor...",
            formSuccess: "Teşekkürler! Mesajınız başarıyla gönderildi.",
            formError: "Hata! Mesajınız gönderilemedi. Lütfen doğrudan e-posta ile ulaşın.",
            formTitle: "Mesaj Gönder",
            projectCTA: "Aklında bir proje mi var?",
            projectCTADesc: "Yaz bana — genelde aynı gün dönerim.",
            availabilityPanel: "durum",
            availabilityStatus: "yeni fırsatlara açık",
            availabilityTypes: "tam zamanlı · freelance · yan proje",
            responseLabel: "yanıt",
            responseVal: "~24 saat",
            timezoneLabel: "saat dilimi",
            timezoneVal: "GMT+3 · İstanbul",
            preferredLabel: "en hızlısı",
            preferredVal: "e-posta →",
            whatImInto: "beni heyecanlandıran şeyler",
            interest1: "Oyun geliştirme — his, sistem tasarımı, her şeyi bir arada tutan küçük detaylar",
            interest2: "Modern web — React, akıcı etkileşimler, sade UX",
            interest3: "İnsanlara gerçekten zaman kazandıran araçlar",
            githubDesc: "Kodlarımın büyük çoğunluğu burada",
            linkedinDesc: "Profesyonel bağlantı için",
            emailDesc: "Bana ulaşmanın en hızlı yolu",
            viewProjects: "projelerime bak →",
            heading: "Selam de.",
        },
        projectData: {
            chaosTyping: {
                subtitle: "React & Vite / Web Tarayıcı Oyunu",
                desc: "Seni yenmek için tasarlanmış bir yazma oyunu. Sahte Windows hataları, ekran yatması, bulanıklaştırma efektleri, araya giren WhatsApp bildirimleri — arayüz doğrudan sana karşı. Bunların üstüne baskı altında konsantrasyonu test eden dinamik bir kelime havuzu ve Firebase destekli bir global skor tablosu var.",
                learnings: [
                    "requestAnimationFrame ile React'ta yüksek performanslı game loop",
                    "Context ve Ref'ler üzerinden karmaşık state yönetimi",
                    "Firebase ile gerçek zamanlı global skor tablosu",
                    "Kullanıcıyı kasıtlı olarak zorlayan dinamik UI elemanları",
                    "Yoğun yük altında DOM güncellemelerini 60 FPS'te akıcı tutmak"
                ]
            },
            soulClaim: {
                subtitle: "Unity 2D / Action Roguelike",
                desc: "Vampire Survivors tarzından ilham alan, hızlı ve kaotik bir aksiyon oyunu. Unity'de C# ile sıfırdan yazdım; performans için ECS mimarisini baz aldım. Ekranda tek bir kare düşüşü olmadan yüzlerce düşmanı kaldırabilmek için Object Pooling sistemini kendim oluşturdum.",
                learnings: [
                    "ECS mimarisinin pratikte ne anlama geldiği",
                    "Yüksek entity sayısında belleği kontrol altında tutmak için Object Pooling",
                    "ScriptableObject ile temiz ve kolayca ayarlanabilir veri yapıları",
                    "Observer pattern ile event-driven mimari",
                    "Unity URP ile görsel efektler ve shader çalışması"
                ]
            },
            gameTracker: {
                subtitle: ".NET WinForms Masaüstü Uygulaması",
                desc: "Oyun kütüphaneni düzenlemek için bir masaüstü uygulaması — ama sıradan bir kayıt sistemi değil. RAWG API'den oyun verisi çekiyor, kütüphanene bakarak Gemini AI üzerinden yeni öneri sunuyor. Veriler yerel MSSQL veritabanında tutuluyor.",
                learnings: [
                    "C# WinForms'ta standart dışı, modern bir UI tasarımı",
                    "MSSQL ve ADO.NET ile ilişkisel veritabanı yönetimi",
                    "REST API bağlamak ve büyük JSON yanıtlarını parse etmek (RAWG API)",
                    "Gemini AI entegrasyonuyla kişiselleştirilmiş öneri sistemi",
                    "API çağrıları sırasında UI'nin donmaması için Async/Await"
                ]
            },
            prayerTime: {
                subtitle: "React & Vite / Web Uygulaması",
                desc: "Namaz vakitlerini takip etmek için geliştirdiğim sade ve hızlı bir web uygulaması. Konumunu otomatik algılıyor, bir sonraki vakte canlı geri sayım gösteriyor ve kandil günlerini öne çıkarıyor. Hızlı ve mobil uyumlu olması önceliğimdi.",
                learnings: [
                    "React ile sağlam bir SPA sıfırdan nasıl inşa edilir",
                    "useState ve useEffect ile zamana duyarlı state yönetimi",
                    "Konum ve saat verisi için birden fazla dış API ile çalışmak",
                    "Tailwind CSS ile responsive arayüz",
                    "JavaScript'te tarih ve saat hesaplamalarının incelikleri"
                ]
            },
            survivalGame: {
                subtitle: "Unity 3D / FPS Survival Oyunu",
                desc: "Hazır harita olmayan bir hayatta kalma oyunu — dünya, Perlin Noise ve kendi mesh hesaplamalarımla keşfettikçe üretiliyor. İçinde kaynak toplama, envanter sistemi ve temel survival mekanikleri var. Teknik açıdan en zorlandığım projelerden biri.",
                learnings: [
                    "Perlin Noise ile prosedürel arazi üretimi",
                    "Gerçek zamanlı mesh üretimi ve runtime optimizasyonu",
                    "FPS kamera ve controller'ın doğal hissettirmesi için ince ayar",
                    "Madencilik ve odun kesme gibi kaynak toplama döngüleri",
                    "Slot tabanlı envanter mantığı"
                ]
            },
            autoReq: {
                subtitle: "Python / Yapay Zeka & NLP / Streamlit",
                desc: "Müşterilerden gelen dağınık ve belirsiz gereksinimleri alıp temiz, yapılandırılmış mühendislik belgelerine dönüştüren bir araç. Yapı çıkarmak için NLP, okunabilir çıktı üretmek için LLM — spaCy, NLTK ve Streamlit üzerine kurulu hibrit bir pipeline.",
                learnings: [
                    "spaCy ve NLTK ile NLP'nin gerçek hayattaki uygulaması",
                    "LLM'leri gerçek bir işleme pipeline'ına entegre etmek",
                    "Streamlit ile kullanılabilir yapay zeka arayüzleri",
                    "Açık kaynaklı bir ekipte Scrum ile çalışmak",
                    "Gereksinim analizi için karmaşık veri akışlarını yapılandırmak"
                ]
            },
            fileConverter: {
                subtitle: "Python / Streamlit / Yapay Zeka & Masaüstü",
                desc: "Dosya dönüştürme, belge görüntüleme, medya oynatma ve yapay zeka destekli belge analizi — hepsini tek bir masaüstü uygulamasında, internete ihtiyaç duymadan. Farklı formatlarda dosyaları offline olarak işleyebilmek için tasarlandı.",
                learnings: [
                    "Python ve Streamlit ile platformdan bağımsız masaüstü araçları",
                    "Birden fazla format için dosya dönüştürme pipeline'ları",
                    "Belge özetleme ve soru-cevap için yapay zeka motoru entegrasyonu",
                    "Çok sayfalı uygulama state'i ve navigasyon yönetimi",
                    "Farklı dillerdeki kullanıcılar için i18n desteği"
                ]
            },
            financeTracker: {
                subtitle: "Python / Streamlit / Veri Görselleştirme",
                desc: "Gelir, gider ve bütçeyi takip etmek için yaptığım kişisel finans aracı. Gerçekten işe yarayan bir şey olmak üzere tasarlandı — hızlı kayıt, net okuma, paranın nereye gittiğini gösteren görselleştirmeler.",
                learnings: [
                    "Python ile veri görselleştirme (Matplotlib, Plotly)",
                    "Streamlit'te sade ve işlevsel finansal panolar",
                    "Kişisel kayıtlar için kalıcı yerel depolama",
                    "Anlaşılır gider kategorizasyon UX'i",
                    "Finansal hesaplamalar ve rapor üretimi"
                ]
            },
            kadeh: {
                subtitle: "React & Vite / Tailwind CSS / Web Uygulaması",
                desc: "Meraklı başlangıç seviyesinden tutkunlara kadar herkese yönelik, Türkçe bir içki rehberi — tarihler, üretim süreçleri, tadım notları, servis önerileri. Tasarımda premium, koyu bir dergi havası var.",
                learnings: [
                    "React ve Vite ile içerik ağırlıklı statik SPA mimarisi",
                    "Tailwind CSS ile premium koyu tema tasarımı",
                    "Büyük statik veri setlerini JS/JSON olarak organize etmek",
                    "Hızlı ve erişilebilir filtreleme ve arama UX'i"
                ]
            }
        }
    }
};
