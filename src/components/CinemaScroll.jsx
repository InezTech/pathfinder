import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CinemaScroll = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [images, setImages] = useState([]);
    const frameCount = 417;

    useEffect(() => {
        const loadedImages = [];
        let loadedCount = 0;

        const preloadImages = () => {
            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                const frameIndex = i.toString().padStart(4, '0');
                img.src = `/frames/frame_${frameIndex}.jpg`;
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === frameCount) {
                        setImages(loadedImages);
                    }
                };
                loadedImages.push(img);
            }
        };

        preloadImages();
    }, []);

    useEffect(() => {
        if (images.length !== frameCount) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(0);
        };

        const renderFrame = (index) => {
            if (images[index]) {
                const img = images[index];
                // Calculate scale to ensure video covers the full screen (like object-fit: cover)
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        };

        window.addEventListener('resize', updateSize);
        updateSize();

        const scrollObj = { frame: 0 };
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

        // Fade overlay to black over the canvas in the last 15% of the timeline
        tl.to('.cinema-overlay', {
            opacity: 1,
            duration: 0.15,
            ease: "power2.inOut"
        }, 0.85);

        return () => {
            window.removeEventListener('resize', updateSize);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [images]);

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
