const base = import.meta.env.BASE_URL;

export const projects = [
    {
        id: 5,
        translationKey: "chaosTyping",
        title: "Chaos Typing",
        subtitle: "React & Vite / Web Browser Game",
        status: "Completed",
        description: "A chaotic, fast-paced typing and tower-defense game. The interface actively tries to troll the player with distractions like fake Windows errors, screen tilt, blur effects, and WhatsApp notifications. Features a dynamic vocabulary pool to test focus under pressure and a global leaderboard powered by Firebase.",
        link: "https://github.com/GalipEfeOncu/chaos-typing",
        demoLink: "https://galipefeoncu.github.io/chaos-typing/",
        image: `${base}assets/images/ChaosTyping.webp`,
        icon: "⚔️",
        tags: ["React", "Vite", "Firebase", "Game Dev"],
        learnings: [
            "Building high-performance game loops in React using requestAnimationFrame",
            "Implementing complex state management with Context and Refs",
            "Integrating Firebase for a realtime Global Leaderboard",
            "Designing dynamic UI elements that interact negatively with the user (trolling mechanics)",
            "Optimizing DOM manipulation to maintain a stable 60 FPS"
        ]
    },
    {
        id: 6,
        translationKey: "autoReq",
        title: "AutoReq",
        subtitle: "Python / AI & NLP / Streamlit",
        status: "Work in Progress",
        description: "An automated software requirement analyzer that uses hybrid AI (NLP + LLM) to transform vague customer requirements into structured, industry-standard engineering documentation.",
        link: "https://github.com/AutoReq-DevTeam/AutoReq",
        image: `${base}assets/images/AutoReq.webp`,
        icon: "🚀",
        tags: ["Python", "NLP", "spaCy", "Streamlit", "LLM"],
        learnings: [
            "Implementing Natural Language Processing (NLP) with spaCy and NLTK",
            "Integrating Large Language Models (LLM) for automated documentation",
            "Building interactive AI dashboards using Streamlit",
            "Applying Scrum Framework in an open-source development team",
            "Structuring complex data flows for requirement engineering"
        ]
    },
    {
        id: 7,
        translationKey: "fileConverter",
        title: "Universal File Workstation",
        subtitle: "Python / Streamlit / AI & Desktop",
        status: "Work in Progress",
        description: "A cross-platform desktop application for file conversion, document viewing, media playback, and AI-powered document analysis. Built to handle diverse file formats offline with an elegant interface.",
        link: "https://github.com/GalipEfeOncu/file-converter",
        image: `${base}assets/images/FileConverter.webp`,
        icon: "🗂️",
        tags: ["Python", "Streamlit", "AI Engine", "Desktop UI"],
        learnings: [
            "Developing cross-platform desktop utilities with Python and Streamlit",
            "Building robust file conversion algorithms for multiple formats",
            "Integrating AI engines for document summarization and Q&A",
            "Managing multi-page application state and navigation",
            "Implementing localized (i18n) support for global users"
        ]
    },
    {
        id: 8,
        translationKey: "financeTracker",
        title: "Finance Tracker",
        subtitle: "Python / Streamlit / Data Visualization",
        status: "Work in Progress",
        description: "A personal finance management tool to track income, expenses, and budget. Built with Python to provide a simple and effective way to manage personal finances with detailed visualizations.",
        link: "https://github.com/GalipEfeOncu/finance-tracker",
        image: `${base}assets/images/FinanceTracker.webp`,
        icon: "💰",
        tags: ["Python", "Streamlit", "Finance", "Data Visualization"],
        learnings: [
            "Data visualization and analysis with Python libraries",
            "Building intuitive financial dashboards with Streamlit",
            "Implementing persistent data storage for personal records",
            "Designing user-friendly expense categorization systems",
            "Handling complex financial calculations and reporting"
        ]
    },
    {
        id: 9,
        translationKey: "kadeh",
        title: "Kadeh",
        subtitle: "React & Vite / Tailwind CSS / Web App",
        status: "Work in Progress",
        description: "A comprehensive Turkish-language alcohol guide for beginners and enthusiasts, featuring drink histories, production processes, tasting profiles, and serving recommendations.",
        link: "https://github.com/GalipEfeOncu/kadeh",
        image: null,
        icon: "🥂",
        tags: ["React", "Vite", "Tailwind CSS"],
        learnings: [
            "Building content-rich static SPAs with React and Vite",
            "Designing premium dark UI themes with Tailwind CSS",
            "Structuring large static datasets as JS/JSON data files",
            "Implementing fast, accessible filtering and search UX"
        ]
    },
    {
        id: 1,
        translationKey: "soulClaim",
        title: "Soul Claim Survivors",
        subtitle: "Unity 2D / Action Roguelike",
        status: "Work in Progress",
        description: "A chaotic, fast-paced action game inspired by the Vampire Survivors genre. Built entirely in Unity with C#, it features a robust Entity Component System (ECS) approach for performance optimization. I implemented a custom Object Pooling system to handle hundreds of enemies on screen simultaneously without frame drops.",
        link: "https://github.com/GalipEfeOncu/soul-claim-survivors",
        image: `${base}assets/images/SoulClaim.webp`,
        icon: null,
        tags: ["Unity", "C#", "DOTween"],
        learnings: [
            "Understanding and implementing ECS (Entity Component System) architecture",
            "Memory optimization with Object Pooling technique",
            "Modular data management using ScriptableObjects",
            "Event-Driven architecture with Observer design pattern",
            "Visual effects with Unity Universal Render Pipeline (URP)"
        ]
    },
    {
        id: 2,
        translationKey: "gameTracker",
        title: "GameTracker",
        subtitle: ".NET WinForms Desktop App",
        status: "Completed",
        description: "GameTracker is a sophisticated desktop application designed for gamers to organize their collections. Unlike standard CRUD apps, this tool integrates Google's Gemini AI to provide personalized game recommendations based on your library. The backend is powered by MSSQL for reliable data storage.",
        link: "https://github.com/GalipEfeOncu/gametracker",
        image: `${base}assets/images/GameTracker.webp`,
        icon: "⚡",
        tags: ["WinForms", "MSSQL", "Gemini AI"],
        learnings: [
            "Modern and customized UI design with C# WinForms",
            "Relational database management with MSSQL and ADO.NET",
            "REST API consumption and JSON data processing (RAWG API)",
            "Artificial Intelligence (Gemini AI) integration",
            "Non-blocking operations with Asynchronous programming (Async/Await)"
        ]
    },
    {
        id: 3,
        translationKey: "prayerTime",
        title: "Prayer Time",
        subtitle: "React & Vite / Modern Web App",
        status: "Completed",
        description: "A sleek and modern web application to track prayer times. It features automatic location detection, a countdown timer to the next prayer, and highlights religious days. Built with React and Vite for high performance, focusing on a clean and responsive user interface.",
        link: "https://github.com/GalipEfeOncu/prayer-time",
        demoLink: "https://galipefeoncu.github.io/prayer-time/",
        image: `${base}assets/images/PrayerTime.webp`,
        icon: "🕌",
        tags: ["React", "Vite", "REST API", "Tailwind CSS"],
        learnings: [
            "Building modern Single Page Applications (SPA) with React",
            "State management with React Hooks (useState, useEffect)",
            "Consuming external APIs for location and time data",
            "Responsive design principles with Tailwind CSS",
            "Handling date and time calculations in JavaScript"
        ]
    },
    {
        id: 4,
        translationKey: "survivalGame",
        title: "Survival Game",
        subtitle: "Unity 3D / First Person Survival",
        status: "Discontinued",
        description: "A technically ambitious first-person survival game featuring a custom Procedural Landmass Generator. This generator creates unique, infinite terrains using Perlin Noise and Mesh Generation techniques, which was the most challenging aspect of development. The game also includes resource gathering, inventory management, and survival mechanics.",
        link: "https://github.com/Eferene/survival-game",
        image: `${base}assets/images/SurvivalGame.webp`,
        icon: "🌲",
        tags: ["Unity 3D", "Procedural Generation", "C#"],
        learnings: [
            "Procedural Landmass Generation using Perlin Noise",
            "Dynamic Mesh Generation and optimization",
            "Implementing 3D First-Person controller and camera systems",
            "Resource gathering mechanics (Mining, Woodcutting)",
            "Inventory and item management logic"
        ]
    }
];
