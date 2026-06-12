import { useEffect, useRef } from 'react';

class Particle {
    constructor(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
    }

    update(width, height, mouse) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction - gentle push
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            const pushRadius = 90;

            if (dist < pushRadius) {
                const force = (pushRadius - dist) / pushRadius;
                const angle = Math.atan2(dy, dx);
                // Push away gently
                this.x += Math.cos(angle) * force * 1.5;
                this.y += Math.sin(angle) * force * 1.5;
            }
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

export default function InteractiveCanvas() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: null, y: null, active: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;

        // Set canvas backing store size
        const resize = () => {
            if (!canvas) return;
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            // Handle high DPI screens
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            // Re-initialize particles to fit the new size
            initParticles();
        };

        // Get colors dynamically from CSS variables
        const getColors = () => {
            const style = getComputedStyle(document.documentElement);
            const accent = style.getPropertyValue('--accent').trim() || '#d97757';
            return { accent };
        };

        const initParticles = () => {
            // Scale particle density based on size
            const density = Math.min(60, Math.floor((width * height) / 7000));
            particles = Array.from({ length: density }, () => new Particle(width, height));
        };

        // Listeners
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
            mouseRef.current.active = true;
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
            mouseRef.current.x = null;
            mouseRef.current.y = null;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', resize);

        resize();

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            const { accent } = getColors();

            // Setup styles
            ctx.fillStyle = accent;
            ctx.strokeStyle = accent;

            // Update & Draw Particles
            particles.forEach((p) => {
                p.update(width, height, mouseRef.current);
                p.draw(ctx);
            });

            // Draw Connection Lines
            const maxDist = 95;
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.16;
                        ctx.strokeStyle = accent.startsWith('#')
                            ? hexToRgba(accent, alpha)
                            : accent.includes('rgba') 
                                ? accent.replace(/[\d.]+\)$/, `${alpha})`) 
                                : `rgba(217, 119, 87, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse if active
                const mouse = mouseRef.current;
                if (mouse.active && mouse.x !== null && mouse.y !== null) {
                    const distToMouse = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
                    const mouseMaxDist = 110;
                    if (distToMouse < mouseMaxDist) {
                        const alpha = (1 - distToMouse / mouseMaxDist) * 0.22;
                        ctx.strokeStyle = accent.startsWith('#')
                            ? hexToRgba(accent, alpha)
                            : `rgba(217, 119, 87, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        // Utility to convert hex to rgba
        function hexToRgba(hex, alpha) {
            // Remove hash
            hex = hex.replace('#', '');
            let r, g, b;
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else {
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            }
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        animate();

        return () => {
            if (canvas) {
                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.removeEventListener('mouseleave', handleMouseLeave);
            }
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="interactive-canvas-wrap">
            <canvas ref={canvasRef} />
        </div>
    );
}
