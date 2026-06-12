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
            const distSq = dx * dx + dy * dy;
            const pushRadius = 90;
            const pushRadiusSq = pushRadius * pushRadius;

            if (distSq < pushRadiusSq) {
                const dist = Math.sqrt(distSq);
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

// Pre-compute RGB values from hex
function hexToRgbValues(hex) {
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
    return `${r}, ${g}, ${b}`;
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

        // Cache accent color RGB values — only update on theme change
        let accentRgb = '217, 119, 87'; // fallback
        const updateAccentColor = () => {
            const style = getComputedStyle(document.documentElement);
            const accent = style.getPropertyValue('--accent').trim() || '#d97757';
            accentRgb = accent.startsWith('#') ? hexToRgbValues(accent) : '217, 119, 87';
        };
        updateAccentColor();

        // Watch for theme changes via MutationObserver
        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.attributeName === 'data-theme') {
                    updateAccentColor();
                    break;
                }
            }
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        // Resize with debounce
        let resizeTimer;
        const resize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (!canvas) return;
                width = canvas.clientWidth;
                height = canvas.clientHeight;
                // Handle high DPI screens
                const dpr = window.devicePixelRatio || 1;
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before scaling
                ctx.scale(dpr, dpr);
                // Re-initialize particles to fit the new size
                initParticles();
            }, 100);
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

        canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
        canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true });
        window.addEventListener('resize', resize, { passive: true });

        // Initial size
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        initParticles();

        // Pre-computed constants
        const maxDist = 95;
        const maxDistSq = maxDist * maxDist;
        const mouseMaxDist = 110;
        const mouseMaxDistSq = mouseMaxDist * mouseMaxDist;

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Use cached accent color
            ctx.fillStyle = `rgb(${accentRgb})`;

            // Update & Draw Particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(width, height, mouseRef.current);
                particles[i].draw(ctx);
            }

            // Draw Connection Lines
            ctx.lineWidth = 0.8;
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < maxDistSq) {
                        const dist = Math.sqrt(distSq);
                        const alpha = (1 - dist / maxDist) * 0.16;
                        ctx.strokeStyle = `rgba(${accentRgb}, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse if active
                const mouse = mouseRef.current;
                if (mouse.active && mouse.x !== null && mouse.y !== null) {
                    const dx = p1.x - mouse.x;
                    const dy = p1.y - mouse.y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < mouseMaxDistSq) {
                        const dist = Math.sqrt(distSq);
                        const alpha = (1 - dist / mouseMaxDist) * 0.22;
                        ctx.strokeStyle = `rgba(${accentRgb}, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                        ctx.lineWidth = 0.8;
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (canvas) {
                canvas.removeEventListener('mousemove', handleMouseMove);
                canvas.removeEventListener('mouseleave', handleMouseLeave);
            }
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(resizeTimer);
            observer.disconnect();
        };
    }, []);

    return (
        <div className="interactive-canvas-wrap">
            <canvas ref={canvasRef} />
        </div>
    );
}
