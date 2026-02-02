export const projects = [
    {
        id: 1,
        title: "Soul Claim Survivors",
        subtitle: "Unity 2D / Action Roguelike",
        status: "Work in Progress",
        description: "A chaotic, fast-paced action game inspired by the Vampire Survivors genre. Built entirely in Unity with C#, it features a robust Entity Component System (ECS) approach for performance optimization. I implemented a custom Object Pooling system to handle hundreds of enemies on screen simultaneously without frame drops.",
        link: "https://github.com/GalipEfeOncu/soul-claim-survivors",
        image: "/assets/images/SoulClaim.png",
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
        title: "GameTracker",
        subtitle: ".NET WinForms Desktop App",
        status: "Completed",
        description: "GameTracker is a sophisticated desktop application designed for gamers to organize their collections. Unlike standard CRUD apps, this tool integrates Google's Gemini AI to provide personalized game recommendations based on your library. The backend is powered by MSSQL for reliable data storage.",
        link: "https://github.com/GalipEfeOncu/gametracker",
        image: "/assets/images/GameTracker.png",
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
        title: "Prayer Time",
        subtitle: "React & Vite / Modern Web App",
        status: "Completed",
        description: "A sleek and modern web application to track prayer times. It features automatic location detection, a countdown timer to the next prayer, and highlights religious days. Built with React and Vite for high performance, focusing on a clean and responsive user interface.",
        link: "https://github.com/GalipEfeOncu/prayer-time",
        image: "/assets/images/PrayerTime.png",
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
        title: "Survival Game",
        subtitle: "Unity 3D / First Person Survival",
        status: "Discontinued",
        description: "A technically ambitious first-person survival game featuring a custom Procedural Landmass Generator. This generator creates unique, infinite terrains using Perlin Noise and Mesh Generation techniques, which was the most challenging aspect of development. The game also includes resource gathering, inventory management, and survival mechanics.",
        link: "https://github.com/Eferene/survival-game",
        image: "/assets/images/SurvivalGame.png",
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
