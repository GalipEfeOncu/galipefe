export const translations = {
    en: {
        seo: {
            aboutDesc: "Galip Efe Öncü - Software Engineering student and game developer specializing in Unity, C#, React, and building interactive software experiences.",
            projectsDesc: "Explore the games, desktop utilities, and web tools developed by Galip Efe Öncü, featuring roguelikes, AI engines, and productivity apps.",
            contactDesc: "Get in touch with Galip Efe Öncü for software engineering projects, collaborations, or game development opportunities."
        },
        nav: {
            about: "About",
            projects: "Projects",
            contact: "Contact"
        },
        hero: {
            welcome: "Hi there, I'm",
            role: "Software Engineering Student",
            status: "open to work",
            desc: "I build things that run, feel good, and don't break. Games, tools, web apps - if code can solve it, I'm already thinking about it.",
            interests: {
                gaming: "Gaming",
                walking: "Walking",
                reading: "Reading",
                fitness: "Fitness"
            },
            quote: "\"Life is brilliant. Beautiful. It enchants us, to the point of obsession.\""
        },
        about: {
            title: "About Me",
            bio1: "I'm <strong>{age}</strong>, a second-year Software Engineering student at <strong>Fırat University</strong> in Elazığ. Grew up in <strong>Konya</strong>, Turkey.",
            bio2: "Before university, I spent four years at <strong>Adil Karaağaç Vocational High School</strong> in the IT department. That's where my real curiosity about how things actually work under the hood began.",
            bio3: "I'm into building things that feel alive - Unity roguelikes, React apps, whatever. If there's an interesting problem, I'll dig into it. When I'm not coding, I'm usually working out, playing games, or occasionally burying myself in a book - a habit I'm trying to make stick.",
            facts: {
                location: "Location",
                locationVal: "Konya, Turkey",
                university: "University",
                universityVal: "Fırat University - Software Eng.",
                languages: "Languages",
                languagesVal: "Turkish (Native) · English (B2)",
                game: "Favorite Game",
                gameVal: "The Witcher 3: Wild Hunt"
            },
            cta: {
                projectsTitle: "What I've built",
                projectsDesc: "Games, tools, web stuff - take a look.",
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
            subtitle: "Games, desktop apps, web tools - stuff I built because I wanted to see if I could.",
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
            featuredLabel: "★ MY FAVORITE PROJECT",
            sortLabel: "sort: recent ↓",
            viewDetails: "open →"
        },
        modal: {
            keyTakeaways: "KEY TAKEAWAYS",
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
            ctaDesc: "Take a look at what I've been building - or just message me directly.",
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
            projectCTADesc: "Send a message - I usually get back the same day.",
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
            interest1: "Game dev - the feel, the systems, the tiny details that make it click",
            interest2: "Modern web - React, smooth interactions, clean UX",
            interest3: "Tools that actually save people time",
            githubDesc: "Where most of my code lives",
            linkedinDesc: "If you're the professional type",
            emailDesc: "Fastest way to actually reach me",
            viewProjects: "see my work →",
            formInfoLive: "This form sends messages directly to my inbox via Formspree.",
            formInfoDemo: "Demo Mode: Formspree ID is not configured. Submissions will be logged to the console."
        },
        projectData: {
            chaosTyping: {
                subtitle: "React & Vite / Web Browser Game",
                desc: "A typing game that actively fights you. Fake Windows errors, screen tilts, blur effects, WhatsApp pop-ups - the UI is trying to make you lose. There's also a dynamic word pool to test focus under pressure and a real-time global leaderboard backed by Firebase.",
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
                    "ECS architecture - what it actually means in practice",
                    "Object Pooling to keep memory in check under heavy entity counts",
                    "ScriptableObjects for clean, tweak-friendly data structures",
                    "Event-driven design with the Observer pattern",
                    "Visual polish with Unity's Universal Render Pipeline (URP)"
                ]
            },
            gameTracker: {
                subtitle: ".NET WinForms Desktop App",
                desc: "A desktop app for organizing your game library - not just CRUD, but smart. It pulls game data from the RAWG API and uses Google Gemini AI to recommend new games based on what's already in your collection. Data is stored locally in MSSQL.",
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
                desc: "A first-person survival game with no pre-made maps - terrain is generated on the fly using Perlin Noise and custom mesh generation. The world keeps building itself as you explore. Also includes resource gathering, an inventory system, and core survival mechanics.",
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
                desc: "A tool that takes messy, vague customer requirements and turns them into clean, structured engineering docs. It uses a hybrid AI pipeline - NLP for parsing structure, LLMs for generating readable output - built on top of spaCy, NLTK, and Streamlit.",
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
                desc: "A cross-platform desktop app that brings together file conversion, document viewing, media playback, and AI-powered document analysis - all in one place, all offline. Built to handle a wide range of formats without needing an internet connection.",
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
                desc: "A personal finance tracker to keep income, expenses, and budget in check. Built to be genuinely useful - quick to log, clear to read, with visualizations that actually help you understand where your money's going.",
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
                desc: "A Turkish-language guide to alcoholic drinks - histories, production methods, tasting notes, serving tips - designed for curious beginners and enthusiasts alike. The UI leans into a premium dark magazine feel.",
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
        seo: {
            aboutDesc: "Galip Efe Öncü - Unity, C#, React ve etkileşimli yazılım deneyimleri geliştirmeye odaklanmış Yazılım Mühendisliği öğrencisi ve oyun geliştirici.",
            projectsDesc: "Galip Efe Öncü tarafından geliştirilen roguelike oyunları, yapay zeka araçlarını ve web uygulamalarını inceleyin.",
            contactDesc: "Yazılım mühendisliği projeleri, iş birlikleri veya oyun geliştirme fırsatları için Galip Efe Öncü ile iletişime geçin."
        },
        nav: {
            about: "Hakkımda",
            projects: "Projeler",
            contact: "İletişim"
        },
        hero: {
            welcome: "Selam, ben",
            role: "Yazılım Mühendisliği Öğrencisi",
            status: "yeni fırsatlara açık",
            desc: "Sorunsuz çalışan, iyi hissettiren ve çökmeyen şeyler geliştiriyorum. Oyunlar, araçlar, web uygulamaları... Kodla çözülebilecek bir şeyse, çoktan üzerine düşünmeye başlamışımdır.",
            interests: {
                gaming: "Oyun",
                walking: "Yürüyüş",
                reading: "Kitap",
                fitness: "Spor"
            },
            quote: "\"Hayat harika. Güzel. Bizi büyüleyip kendine takıntı derecesinde bağlıyor.\""
        },
        about: {
            title: "Hakkımda",
            bio1: "<strong>{age} yaşındayım,</strong> Elazığ <strong>Fırat Üniversitesi</strong>'nde Yazılım Mühendisliği 2. sınıf öğrencisiyim. <strong>Konya</strong>'da büyüdüm.",
            bio2: "Üniversiteden önce dört yılımı <strong>Adil Karaağaç Mesleki ve Teknik Anadolu Lisesi</strong> Bilişim Teknolojileri bölümünde geçirdim. İşlerin arka planda gerçekten nasıl yürüdüğüne dair asıl merakım orada başladı.",
            bio3: "Yaşayan, etkileşimli şeyler geliştirmeyi seviyorum - Unity ile roguelike oyunlar, React uygulamaları, fark etmez. İlginç bir problem gördüğümde mutlaka derinine inerim. Kod yazmadığım zamanlarda genellikle spor yapıyorum, oyun oynuyorum, ve ara sıra kitaplara gömülüyorum - bu son alışkanlığı alışkanlık haline getirmek istiyorum.",
            facts: {
                location: "Konum",
                locationVal: "Konya, Türkiye",
                university: "Üniversite",
                universityVal: "Fırat Üniversitesi - Yazılım Müh.",
                languages: "Diller",
                languagesVal: "Türkçe (Anadil) · İngilizce (B2)",
                game: "Favori Oyun",
                gameVal: "The Witcher 3: Wild Hunt"
            },
            cta: {
                projectsTitle: "Neler geliştirdim",
                projectsDesc: "Oyunlar, araçlar, web projeleri - bir göz at.",
                contactTitle: "Selam ver",
                contactDesc: "Bir sorun mu var veya birlikte bir şeyler mi inşa etmek istiyorsun? Buralardayım.",
                projectsCount: "{count} proje · oyunlar, araçlar, web",
                contactChannels: "Bana ulaşabileceğin 3 yol"
            },
            heading: "Selam, ben Galip. Kod yazıyor ve insanların gerçekten kullandığı şeyler inşa ediyorum.",
            interestsPanel: "ilgilendiklerim",
            stackPanel: "stack · kullandığım teknolojiler",
            kvLocation: "konum",
            kvEdu: "okul",
            kvLang: "dil",
            kvFocus: "fav oyun"
        },
        projects: {
            title: "Projeler",
            subtitle: "Oyunlar, masaüstü uygulamaları, web araçları - sırf yapıp yapamayacağımı görmek için geliştirdiğim şeyler.",
            filters: {
                all: "Tümü",
                completed: "Tamamlanan",
                wip: "Devam Eden",
                discontinued: "Askıya Alınan"
            },
            emptyStateTitle: "Proje bulunamadı",
            emptyStateDesc: "Seçilen filtreye uygun bir proje yok.",
            modal: {
                about: "Hakkında",
                learnings: "Neler Öğrendim",
                liveDemo: "Canlı Demo",
                githubRepo: "GitHub Repo"
            },
            featuredLabel: "★ FAVORİ PROJEM",
            sortLabel: "sıralama: en yeni ↓",
            viewDetails: "incele →"
        },
        modal: {
            keyTakeaways: "NELER ÖĞRENDİM",
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
            title: "Bağlantı Kuralım",
            subtitle: "Bir projen, iş birliği fikrin mi var veya sadece kod hakkında mı konuşmak istiyorsun? Buralardayım.",
            elsewhere: "Diğer Platformlar",
            skills: "Kullandığım Araçlar",
            category: {
                lang: "Diller",
                frameworks: "Framework'ler & Araçlar",
                backend: "Backend & Veritabanı",
                gamedev: "Oyun Geliştirme"
            },
            ctaTitle: "Aklında bir şeyler mi var?",
            ctaDesc: "Geliştirdiğim işlere bir göz at ya da doğrudan bana mesaj gönder.",
            ctaBtn: "işlerimi gör →",
            primaryChannels: "bana buradan ulaş",
            elsewherePanel: "beni internette bul",
            formName: "İsim",
            formEmail: "E-posta",
            formMessage: "Mesaj",
            formSubmit: "Mesaj Gönder",
            formSubmitting: "Gönderiliyor...",
            formSuccess: "Teşekkürler! Mesajın başarıyla gönderildi.",
            formError: "Bir sorun çıktı ve mesajın gönderilemedi. Lütfen doğrudan e-posta atmayı dene.",
            formTitle: "Mesaj Gönder",
            projectCTA: "Aklında bir şey mi var?",
            projectCTADesc: "Bir mesaj at - genelde aynı gün içinde dönerim.",
            availabilityPanel: "durum",
            availabilityStatus: "yeni fırsatlara açık",
            availabilityTypes: "tam zamanlı · freelance · yan proje",
            responseLabel: "geri dönüş",
            responseVal: "~24s",
            timezoneLabel: "saat dilimi",
            timezoneVal: "GMT+3 · İstanbul",
            preferredLabel: "en iyi yol",
            preferredVal: "e-posta →",
            whatImInto: "ilgilendiklerim",
            interest1: "Oyun geliştirme - oyun hissi, sistemler ve o hissi veren küçük detaylar",
            interest2: "Modern web - React, akıcı etkileşimler, temiz UX",
            interest3: "Gerçekten insanlara zaman kazandıran araçlar",
            githubDesc: "Kodlarımın çoğunun yaşadığı yer",
            linkedinDesc: "Eğer profesyonel takılıyorsan",
            emailDesc: "Bana gerçekten ulaşmanın en hızlı yolu",
            viewProjects: "işlerimi gör →",
            heading: "Selam ver.",
            formInfoLive: "Bu form, mesajları Formspree aracılığıyla doğrudan gelen kutuma iletir.",
            formInfoDemo: "Demo Modu: Formspree ID ayarlanmamış. Gönderimler konsola kaydedilecek."
        },
        projectData: {
            chaosTyping: {
                subtitle: "React & Vite / Web Tarayıcı Oyunu",
                desc: "Seninle aktif olarak savaşan bir yazım oyunu. Sahte Windows hataları, ekran eğrilmeleri, bulanıklık efektleri, WhatsApp bildirimleri - arayüz kaybetmen için elinden geleni yapıyor. Ayrıca baskı altında odaklanmayı test eden dinamik bir kelime havuzu ve Firebase destekli gerçek zamanlı küresel bir liderlik tablosu var.",
                learnings: [
                    "requestAnimationFrame ile React'ta yüksek performanslı game loop",
                    "Context ve Ref'ler üzerinden karmaşık state yönetimi",
                    "Firebase ile gerçek zamanlı global skor tablosu",
                    "Oyuncuyu kasıtlı olarak çileden çıkarmak için tasarlanmış UI elemanları",
                    "Yoğun yük altında DOM güncellemelerini 60 FPS'te akıcı tutmak"
                ]
            },
            soulClaim: {
                subtitle: "Unity 2D / Action Roguelike",
                desc: "Vampire Survivors tarzında hızlı ve kaotik bir aksiyon oyunu. Unity ve C# ile sıfırdan geliştirdim. Performans için ECS yaklaşımı etrafında tasarladım ve yüzlerce düşmanın aynı anda kare hızı düşmeden ekranda olabilmesi için özel bir Object Pooling sistemi yazdım.",
                learnings: [
                    "ECS mimarisinin pratikte gerçekten ne anlama geldiği",
                    "Yüksek entity sayısında belleği kontrol altında tutmak için Object Pooling",
                    "Temiz ve kolayca ayarlanabilir veri yapıları için ScriptableObjects",
                    "Observer pattern ile event-driven mimari",
                    "Unity URP ile görsel efektler ve shader çalışması"
                ]
            },
            gameTracker: {
                subtitle: ".NET WinForms Masaüstü Uygulaması",
                desc: "Oyun kütüphaneni düzenlemek için bir masaüstü uygulaması - sadece basit bir kayıt defteri değil, akıllı. RAWG API'den oyun verilerini çekiyor ve koleksiyonundakilere dayanarak Google Gemini AI ile sana yeni oyunlar öneriyor. Veriler yerel olarak MSSQL'de tutuluyor.",
                learnings: [
                    "C# WinForms'ta standart dışı, modern bir UI inşası",
                    "MSSQL ve ADO.NET ile ilişkisel veritabanı yönetimi",
                    "REST API tüketimi ve büyük JSON yanıtlarını parse etmek (RAWG API)",
                    "Kişiselleştirilmiş öneriler için Gemini AI entegrasyonu",
                    "API çağrıları sırasında UI'ın donmaması için Async/Await kullanımı"
                ]
            },
            prayerTime: {
                subtitle: "React & Vite / Web Uygulaması",
                desc: "Günlük namaz vakitlerini takip etmek için temiz ve hızlı bir web uygulaması. Konumunu otomatik algılar, bir sonraki vakte canlı geri sayım gösterir ve dini günleri vurgular. Basitlik ve duyarlılık odaklı olarak React ve Vite ile geliştirildi.",
                learnings: [
                    "React ile sıfırdan sağlam bir SPA inşa etmek",
                    "useState ve useEffect ile zamana duyarlı state yönetimi",
                    "Konum ve saat verisi için birden fazla dış API ile çalışmak",
                    "Tailwind CSS ile responsive arayüzler",
                    "JavaScript'te tarih ve saat hesaplamaları (göründüğünden daha zor)"
                ]
            },
            survivalGame: {
                subtitle: "Unity 3D / FPS Survival Oyunu",
                desc: "Önceden yapılmış haritaları olmayan, birinci şahıs bir hayatta kalma oyunu. Arazi, Perlin Noise ve özel mesh üretimi ile sen oynarken anında oluşturulur. Dünyayı keşfettikçe kendi kendini inşa etmeye devam eder. Ayrıca kaynak toplama, envanter sistemi ve temel hayatta kalma mekanikleri içerir.",
                learnings: [
                    "Perlin Noise ile prosedürel arazi üretimi",
                    "Gerçek zamanlı mesh üretimi ve runtime optimizasyonu",
                    "FPS kamera ve controller hissiyatı",
                    "Kaynak toplama döngüleri (madencilik, odun kesme)",
                    "Slot tabanlı envanter mantığı"
                ]
            },
            autoReq: {
                subtitle: "Python / Yapay Zeka & NLP / Streamlit",
                desc: "Dağınık ve belirsiz müşteri gereksinimlerini alıp temiz, yapılandırılmış mühendislik dokümanlarına dönüştüren bir araç. Yapıyı ayrıştırmak için NLP, okunabilir çıktılar üretmek için LLM kullanan hibrit bir yapay zeka pipeline'ına sahip. spaCy, NLTK ve Streamlit üzerinde inşa edildi.",
                learnings: [
                    "spaCy ve NLTK ile NLP'nin pratikteki kullanımı",
                    "LLM'leri gerçek bir işleme pipeline'ına entegre etmek",
                    "Streamlit ile kullanılabilir yapay zeka arayüzleri inşa etmek",
                    "Açık kaynaklı bir ekipte Scrum ile çalışmak",
                    "Gereksinim analizi için karmaşık veri akışlarını yapılandırmak"
                ]
            },
            fileConverter: {
                subtitle: "Python / Streamlit / Yapay Zeka & Masaüstü",
                desc: "Dosya dönüştürme, belge görüntüleme, medya oynatma ve yapay zeka destekli belge analizini tek bir yerde, tamamen çevrimdışı bir araya getiren çapraz platform bir masaüstü uygulaması. İnternet bağlantısı olmadan birçok formatı işleyebilmesi için yapıldı.",
                learnings: [
                    "Python ve Streamlit ile platformdan bağımsız masaüstü araçları",
                    "Birden fazla format için dosya dönüştürme pipeline'ları",
                    "Yapay zeka destekli belge özetleme ve soru-cevap",
                    "Çok sayfalı uygulama state'i ve navigasyon yönetimi",
                    "Çok dilli kullanıcı kitlesi için yerelleştirme (i18n)"
                ]
            },
            financeTracker: {
                subtitle: "Python / Streamlit / Veri Görselleştirme",
                desc: "Gelir, gider ve bütçeyi kontrol altında tutmak için bir kişisel finans takipçisi. Gerçekten işe yaraması için yapıldı - hızlıca kayıt girilen, okunması kolay ve paranın nereye gittiğini anlamana gerçekten yardımcı olan görselleştirmelere sahip.",
                learnings: [
                    "Python ile veri görselleştirme (Matplotlib, Plotly)",
                    "Streamlit'te sade finansal panolar oluşturmak",
                    "Kişisel kayıtlar için kalıcı yerel depolama",
                    "Sezgisel gider kategorizasyonu UX'i",
                    "Finansal hesaplamalar ve rapor üretimi"
                ]
            },
            kadeh: {
                subtitle: "React & Vite / Tailwind CSS / Web Uygulaması",
                desc: "Alkollü içecekler için Türkçe bir rehber - tarihçeler, üretim yöntemleri, tadım notları, servis ipuçları. Hem meraklı yeni başlayanlar hem de tutkunlar için tasarlandı. Arayüz, premium ve karanlık bir dergi hissiyatına sahip.",
                learnings: [
                    "React ve Vite ile içerik ağırlıklı statik SPA mimarisi",
                    "Tailwind CSS ile premium karanlık arayüz tasarımı",
                    "Büyük statik veri setlerini JS/JSON olarak organize etmek",
                    "Hızlı ve erişilebilir filtreleme ve arama UX'i"
                ]
            }
        }
    }
};
