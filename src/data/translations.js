export const translations = {
    en: {
        nav: {
            about: "About Me",
            projects: "Projects",
            contact: "Contact"
        },
        hero: {
            role: "Software Engineering Student",
            status: "Available for Work",
            desc: "I build immersive digital experiences and useful tools. Passionate about game mechanics, clean architecture, and solving complex problems with code.",
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
            bio1: "I'm <strong>{age} years old</strong>, a Software Engineering student from <strong>Konya</strong>, Turkey. Currently studying at <strong>Fırat University</strong> in Elazığ, where I'm a sophomore in the Department of Software Engineering.",
            bio2: "Before university, I graduated from <strong>Adilkaraağaç Vocational and Technical High School</strong>, IT department, which gave me a strong technical foundation early on.",
            bio3: "I'm passionate about building immersive digital experiences — from action roguelikes in Unity to modern web apps with React. When I'm not coding, you'll probably find me exploring open-world RPGs (The Witcher 3 is an all-time favorite ❤️), going for walks, reading, or hitting the gym.",
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
                projectsTitle: "My Projects",
                projectsDesc: "Check out what I've been building — games, apps, and more.",
                contactTitle: "Get in Touch",
                contactDesc: "Have a question or want to collaborate? Let's connect."
            }
        },
        projects: {
            title: "My Projects",
            subtitle: "A collection of things I've built — from action games to desktop apps and modern web experiences.",
            filters: {
                all: "All",
                completed: "Completed",
                wip: "Work in Progress",
                discontinued: "Discontinued"
            },
            modal: {
                about: "About",
                learnings: "Key Learnings",
                liveDemo: "Live Demo",
                githubRepo: "GitHub Repo"
            }
        },
        contact: {
            title: "Let's Connect",
            subtitle: "Have a project idea, want to collaborate, or just want to say hi? Feel free to reach out through any of these channels.",
            elsewhere: "Find Me Elsewhere",
            skills: "Technical Skills",
            category: {
                lang: "Languages",
                frameworks: "Frameworks & Tools",
                backend: "Backend & Database",
                gamedev: "Game Development"
            },
            ctaTitle: "Interested in working together?",
            ctaDesc: "Check out my projects to see what I've been building, or drop me a message!",
            ctaBtn: "View Projects →"
        },
        projectData: {
            chaosTyping: {
                subtitle: "React & Vite / Web Browser Game",
                desc: "A chaotic, fast-paced typing and tower-defense game. The interface actively tries to troll the player with distractions like fake Windows errors, screen tilt, blur effects, and WhatsApp notifications. Features a dynamic vocabulary pool to test focus under pressure and a global leaderboard powered by Firebase.",
                learnings: [
                    "Building high-performance game loops in React using requestAnimationFrame",
                    "Implementing complex state management with Context and Refs",
                    "Integrating Firebase for a realtime Global Leaderboard",
                    "Designing dynamic UI elements that interact negatively with the user (trolling mechanics)",
                    "Optimizing DOM manipulation to maintain a stable 60 FPS"
                ]
            },
            soulClaim: {
                subtitle: "Unity 2D / Action Roguelike",
                desc: "A chaotic, fast-paced action game inspired by the Vampire Survivors genre. Built entirely in Unity with C#, it features a robust Entity Component System (ECS) approach for performance optimization. I implemented a custom Object Pooling system to handle hundreds of enemies on screen simultaneously without frame drops.",
                learnings: [
                    "Understanding and implementing ECS (Entity Component System) architecture",
                    "Memory optimization with Object Pooling technique",
                    "Modular data management using ScriptableObjects",
                    "Event-Driven architecture with Observer design pattern",
                    "Visual effects with Unity Universal Render Pipeline (URP)"
                ]
            },
            gameTracker: {
                subtitle: ".NET WinForms Desktop App",
                desc: "GameTracker is a sophisticated desktop application designed for gamers to organize their collections. Unlike standard CRUD apps, this tool integrates Google's Gemini AI to provide personalized game recommendations based on your library. The backend is powered by MSSQL for reliable data storage.",
                learnings: [
                    "Modern and customized UI design with C# WinForms",
                    "Relational database management with MSSQL and ADO.NET",
                    "REST API consumption and JSON data processing (RAWG API)",
                    "Artificial Intelligence (Gemini AI) integration",
                    "Non-blocking operations with Asynchronous programming (Async/Await)"
                ]
            },
            prayerTime: {
                subtitle: "React & Vite / Modern Web App",
                desc: "A sleek and modern web application to track prayer times. It features automatic location detection, a countdown timer to the next prayer, and highlights religious days. Built with React and Vite for high performance, focusing on a clean and responsive user interface.",
                learnings: [
                    "Building modern Single Page Applications (SPA) with React",
                    "State management with React Hooks (useState, useEffect)",
                    "Consuming external APIs for location and time data",
                    "Responsive design principles with Tailwind CSS",
                    "Handling date and time calculations in JavaScript"
                ]
            },
            survivalGame: {
                subtitle: "Unity 3D / First Person Survival",
                desc: "A technically ambitious first-person survival game featuring a custom Procedural Landmass Generator. This generator creates unique, infinite terrains using Perlin Noise and Mesh Generation techniques, which was the most challenging aspect of development. The game also includes resource gathering, inventory management, and survival mechanics.",
                learnings: [
                    "Procedural Landmass Generation using Perlin Noise",
                    "Dynamic Mesh Generation and optimization",
                    "Implementing 3D First-Person controller and camera systems",
                    "Resource gathering mechanics (Mining, Woodcutting)",
                    "Inventory and item management logic"
                ]
            }
        }
    },
    tr: {
        nav: {
            about: "Hakkımda",
            projects: "Projelerim",
            contact: "İletişim"
        },
        hero: {
            role: "Yazılım Mühendisliği Öğrencisi",
            status: "İş Tekliflerine Açık",
            desc: "Sürükleyici dijital deneyimler ve kullanışlı araçlar geliştiriyorum. Oyun mekanikleri, clean architecture ve kod yazarak karmaşık sorunları çözmek en büyük tutkum.",
            interests: {
                gaming: "Oyun",
                walking: "Yürüyüş",
                reading: "Kitap Okuma",
                fitness: "Fitness"
            },
            quote: "\"Bu hayatta ne yaparsan yap, arkadaşların bunu görecek kadar yanında değilse; efsanevi değildir.\""
        },
        about: {
            title: "Hakkımda",
            bio1: "Selam! Ben <strong>Konya</strong>'dan <strong>{age} yaşında</strong> bir Yazılım Mühendisliği öğrencisiyim. Şu an Elazığ'da <strong>Fırat Üniversitesi</strong> Yazılım Mühendisliği bölümünde 2. sınıfı okuyorum.",
            bio2: "Üniversiteye geçmeden önce <strong>Adilkaraağaç Mesleki ve Teknik Anadolu Lisesi</strong> Bilişim Teknolojileri bölümünden mezun oldum. Bu da sektöre erken yaşta sağlam bir teknik temelle adım atmamı sağladı.",
            bio3: "Unity'de action roguelike oyunlarından React ile modern web app'lere kadar işin mutfağında olmayı ve yeni şeyler üretmeyi çok seviyorum. Ekran başında olmadığım zamanlarda beni genelde açık dünya RPG oyunlarına dalmış (The Witcher 3 favorimdir ❤️), yürüyüş yaparken, kitap okurken veya sporda bulabilirsiniz.",
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
                projectsTitle: "Projelerim",
                projectsDesc: "Geliştirdiğim oyunlara, masaüstü uygulamalarına ve web sitelerine göz atın.",
                contactTitle: "Bana Ulaşın",
                contactDesc: "Aklınızda bir proje mi var veya sadece sohbet mi etmek istiyorsunuz? İletişime geçelim."
            }
        },
        projects: {
            title: "Projelerim",
            subtitle: "Aksiyon oyunlarından masaüstü uygulamalarına ve modern web deneyimlerine kadar oturup kodladığım projelerin bir derlemesi.",
            filters: {
                all: "Tümü",
                completed: "Tamamlanan",
                wip: "Geliştirilen",
                discontinued: "Dondurulan"
            },
            modal: {
                about: "Hakkında",
                learnings: "Neler Öğrendim?",
                liveDemo: "Canlı Demo",
                githubRepo: "GitHub Repo"
            }
        },
        contact: {
            title: "İletişim Kur",
            subtitle: "Bir proje fikriniz mi var, beraber çalışmak mı istiyorsunuz ya da sadece merhaba mı diyeceksiniz? Aşağıdaki kanallardan bana dilediğiniz gibi ulaşabilirsiniz.",
            elsewhere: "Diğer Platformlar",
            skills: "Teknik Yetenekler",
            category: {
                lang: "Diller",
                frameworks: "Frameworkler & Araçlar",
                backend: "Backend & Veritabanı",
                gamedev: "Oyun Geliştirme"
            },
            ctaTitle: "Birlikte çalışmak ister misiniz?",
            ctaDesc: "Neler inşa ettiğimi görmek isterseniz projelerime bakabilir veya direkt bana bir mesaj atabilirsiniz!",
            ctaBtn: "Projelerimi Gör →"
        },
        projectData: {
            chaosTyping: {
                subtitle: "React & Vite / Web Browser Oyunu",
                desc: "Kaotik ve inanılmaz hızlı tempolu bir typing ve kule savunma oyunu. Arayüz; sahte Windows hataları, ekran yatması, bulanıklaştırma efektleri ve araya giren WhatsApp bildirimleri gibi detaylarla oyuncuyu sürekli trollemeye çalışıyor. Baskı altında dikkati test eden dinamik bir kelime havuzu ve Firebase ile çalışan global bir skor tablosu var.",
                learnings: [
                    "requestAnimationFrame kullanarak React tarafında yüksek performanslı game loop'lar oluşturmak",
                    "Context ve Ref'ler aracılığıyla karmaşık state yönetimi",
                    "Real-time global skor tablosu için Firebase entegrasyonu",
                    "Kullanıcıya zorluk çıkaran dinamik UI elemanları tasarlamak (troll dinamikleri)",
                    "Oyunu 60 FPS'te akıcı tutabilmek için DOM manipülasyonunu ve render'ı optimize etmek"
                ]
            },
            soulClaim: {
                subtitle: "Unity 2D / Action Roguelike",
                desc: "Vampire Survivors tarzından ilham alan kaotik bir aksiyon oyunu. Tamamen C# ile Unity'de geliştirildi ve performans optimizasyonu sağlamak için ECS (Entity Component System) mantığı üzerine kuruldu. Ekranda tek bir FPS düşüşü bile olmadan yüzlerce düşmanı işleyebilmek için Object Pooling sistemini kendim kodladım.",
                learnings: [
                    "ECS (Entity Component System) mimarisini kavramak ve oyuna entegre etmek",
                    "Object Pooling sistemiyle memory optimizasyonunu sağlamak",
                    "ScriptableObject kullanarak modüler ve kolay tweak edilebilir bir veri yapısı oluşturmak",
                    "Observer design pattern ile event-driven bir mimari kurgulamak",
                    "Unity URP (Universal Render Pipeline) ile görsel efektleri tasarlamak"
                ]
            },
            gameTracker: {
                subtitle: ".NET WinForms Masaüstü App",
                desc: "Oyun koleksiyonunuzu, oynadığınız oyunları ve listelerinizi düzenli bir şekilde tutabileceğiniz modern bir masaüstü uygulaması. Sıradan CRUD programlarından farklı olarak Google Gemini AI kullanarak kütüphanenize ve zevkinize özel oyun önerileri de sunuyor. Arka planda veriler MSSQL ile tutuluyor.",
                learnings: [
                    "C# WinForms ile standartların dışında daha modern ve custom UI tasarımları çıkarmak",
                    "MSSQL ve ADO.NET ile detaylı veritabanı yönetimi yapabilmek",
                    "Dışarıdan REST API bağlamak ve RAWG API'den gelen dev JSON verilerini parse etmek",
                    "Google Gemini AI'yı uygulamaya yapay zeka gücü vermek için entegre etmek",
                    "Uygulamanın kilitlenmemesi için Async/Await kullanarak asenkron kod yazmak"
                ]
            },
            prayerTime: {
                subtitle: "React & Vite / Web App",
                desc: "Namaz vakitlerini takip etmek için geliştirdiğim şık, modern ve hızlı bir web uygulaması. Konumu otomatik algılıyor ve bir sonraki vakte geri sayım sayacı sunuyor. React ve Vite ile yazdığım için oldukça hızlı ve responsive (mobil uyumlu) bir tasarıma sahip.",
                learnings: [
                    "React ile modern bir SPA (Single Page Application) geliştirmek",
                    "React Hook'lar ile (useState, useEffect vb.) state'leri düzgün yönetmek",
                    "Konum ve saat verilerini çekmek için farklı API'larla çalışmak",
                    "Tailwind CSS ile responsive ve estetik arayüz tasarımına alışmak",
                    "JavaScript tarafında karmaşık tarih ve saat hesaplamalarıyla boğuşmak"
                ]
            },
            survivalGame: {
                subtitle: "Unity 3D / FPS Survival Oyunu",
                desc: "Dışarıdan hiç harita kullanmadan Procedural Landmass Generator ile çalışan oldukça zorlu bir 3D birinci şahıs hayatta kalma projesi. Arka planda Perlin Noise mantığı ve kendi mesh hesaplamalarımı kullanarak oyundayken durmadan sonsuz bir dünya üretiyor.",
                learnings: [
                    "Hazır harita almadan Perlin Noise matematiğini koda dökerek arazi üretimi yapmak",
                    "Oyun içinde anlık hesaplamalarla mesh üretimi ve performans ayarları",
                    "FPS (Birinci Şahıs) kamera ve controller sistemini pürüzsüz çalışacak şekilde entegre etmek",
                    "Taş kırma, odun kesme gibi maden ve kaynak (resource) toplama mantığını kurmak",
                    "Envanter sisteminin arkasında çalışan slot bazlı veri mantıkları"
                ]
            }
        }
    }
};
