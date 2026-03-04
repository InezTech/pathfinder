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
            // Load frame 0 immediately for the initial render
            await loadFrame(0);
            const canvas = canvasRef.current;
            if (canvas) {
                window.dispatchEvent(new Event('resize'));
            }

            // Defer loading the remaining frames slightly so other page assets take priority
            setTimeout(async () => {
                // MASSIVE UX BOOST: Load a "skeleton" animation first.
                // We load every 10th frame. This ensures if the customer scrolls really fast,
                // the canvas always has a frame very close to the current index ready to drop in, 
                // creating an instantly smooth scrub without waiting for all 400 frames.
                const skeletonBatch = [];
                for (let i = 10; i < frameCount; i += 10) {
                    skeletonBatch.push(loadFrame(i));
                }
                await Promise.all(skeletonBatch);

                // Now smoothly load all the remaining gap frames in the background
                const concurrency = 6;
                for (let i = 1; i < frameCount; i += concurrency) {
                    const batch = [];
                    for (let j = 0; j < concurrency && i + j < frameCount; j++) {
                        const targetFrame = i + j;
                        // Skip if we already loaded it in the skeleton pass
                        if (targetFrame % 10 !== 0 && targetFrame !== 0) {
                            batch.push(loadFrame(targetFrame));
                        }
                    }
                    if (batch.length > 0) {
                        await Promise.all(batch);
                    }
                }
            }, 300);
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

        // CRITICAL PERFORMANCE FIX: 
        // GSAP fires onUpdate hundreds of times per second. 
        // If we clearRect and drawImage the exact same frame repeatedly, it destroys laptop/mobile CPU.
        // We cache the last drawn elements and ONLY redraw when the actual image mathematically changes.
        let lastDrawnImg = null;
        let lastCanvasWidth = 0;
        let lastCanvasHeight = 0;

        const renderFrame = (index) => {
            const rawIndex = Math.round(index);
            let img = imagesRef.current[rawIndex];

            // If the current frame isn't perfectly loaded yet, instantly fallback to the closest previous loaded frame
            if (!img || !img.complete || img.naturalWidth === 0) {
                for (let i = rawIndex - 1; i >= 0; i--) {
                    const prevImg = imagesRef.current[i];
                    if (prevImg && prevImg.complete && prevImg.naturalWidth > 0) {
                        img = prevImg;
                        break;
                    }
                }
            }

            // Only execute the heavy canvas render pipeline if the image or screen size actually changed!
            if (img && img.complete && img.naturalWidth > 0 &&
                (img !== lastDrawnImg || canvas.width !== lastCanvasWidth || canvas.height !== lastCanvasHeight)) {

                const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
                const drawWidth = img.naturalWidth * scale;
                const drawHeight = img.naturalHeight * scale;
                const x = (canvas.width / 2) - (drawWidth / 2);
                const y = (canvas.height / 2) - (drawHeight / 2);

                // Use hardware acceleration friendly methods
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = 'high';
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, x, y, drawWidth, drawHeight);

                lastDrawnImg = img;
                lastCanvasWidth = canvas.width;
                lastCanvasHeight = canvas.height;
            }
        };

        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(scrollObj.frame);
        };

        window.addEventListener('resize', updateSize);
        setTimeout(updateSize, 100);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=400%",
                // Reduced scrub from 1.5 to 0.5. 
                // High scrub values create artificial sluggish drag. 0.5 feels much more razor-sharp and responsive.
                scrub: 0.5,
                pin: true,
            }
        });

        tl.to(scrollObj, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 1,
            onUpdate: () => renderFrame(scrollObj.frame),
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
