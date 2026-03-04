import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CinemaScroll = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const imagesRef = useRef([]);
    const frameCount = 417;

    useEffect(() => {
        const loadedImages = new Array(frameCount).fill(null);
        imagesRef.current = loadedImages;

        const loadFrame = (index) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.fetchPriority = index === 0 ? "high" : "low";
                const frameIndex = (index + 1).toString().padStart(4, '0');
                img.src = `/frames/frame_${frameIndex}.jpg`;
                img.onload = () => {
                    loadedImages[index] = img;
                    resolve(img);
                };
                img.onerror = () => resolve(null);
            });
        };

        const init = async () => {
            // Load frame 0 immediately
            await loadFrame(0);

            // Re-render once so canvas paints the first frame
            const canvas = canvasRef.current;
            if (canvas) {
                const e = new Event('resize');
                window.dispatchEvent(e);
            }

            // Defer loading the remaining frames slightly so other page assets take priority
            setTimeout(async () => {
                // Throttle to 5 concurrent connections to prevent stalling Safari/Edge
                const concurrency = 5;
                for (let i = 1; i < frameCount; i += concurrency) {
                    const batch = [];
                    for (let j = 0; j < concurrency && i + j < frameCount; j++) {
                        batch.push(loadFrame(i + j));
                    }
                    await Promise.all(batch);
                }
            }, 500);
        };

        if (!imagesRef.current[0]) {
            init();
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        const scrollObj = { frame: 0 };

        const renderFrame = (index) => {
            let img = imagesRef.current[index];
            if (!img) {
                // Fallback to nearest loaded previous frame
                for (let i = index - 1; i >= 0; i--) {
                    if (imagesRef.current[i]) {
                        img = imagesRef.current[i];
                        break;
                    }
                }
            }

            if (img) {
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        };

        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(Math.round(scrollObj.frame));
        };

        window.addEventListener('resize', updateSize);
        // Initial draw setup
        setTimeout(updateSize, 100);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=400%",
                scrub: 1.5,
                pin: true,
            }
        });

        tl.to(scrollObj, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 1,
            onUpdate: () => renderFrame(Math.round(scrollObj.frame)),
        }, 0);

        tl.to('.cinema-overlay', {
            opacity: 1,
            duration: 0.15,
            ease: "power2.inOut"
        }, 0.85);

        return () => {
            window.removeEventListener('resize', updateSize);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div ref={containerRef} className="hero-container" id="hero">
            <canvas ref={canvasRef} className="cinema-canvas" />
            <div className="cinema-overlay" style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'var(--platinum)',
                opacity: 0,
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default CinemaScroll;
