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
        image: `${base}assets/images/ChaosTyping.png`,
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
        id: 1,
        translationKey: "soulClaim",
        title: "Soul Claim Survivors",
        subtitle: "Unity 2D / Action Roguelike",
        status: "Work in Progress",
        description: "A chaotic, fast-paced action game inspired by the Vampire Survivors genre. Built entirely in Unity with C#, it features a robust Entity Component System (ECS) approach for performance optimization. I implemented a custom Object Pooling system to handle hundreds of enemies on screen simultaneously without frame drops.",
        link: "https://github.com/GalipEfeOncu/soul-claim-survivors",
        image: `${base}assets/images/SoulClaim.png`,
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
        image: `${base}assets/images/GameTracker.png`,
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
        image: `${base}assets/images/PrayerTime.png`,
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
        image: `${base}assets/images/SurvivalGame.png`,
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
