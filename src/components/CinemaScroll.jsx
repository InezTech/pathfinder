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

            // Defer loading the remaining frames slightly more to give the 3D canvas and fonts time to breathe
            setTimeout(async () => {
                const isMobile = window.innerWidth < 768;

                // MASSIVE UX BOOST: Load a "skeleton" animation first.
                // Mobile networks choke on 40+ parallel requests. We throttle the skeleton load into batches of 4.
                // On mobile, we only load every 20th frame for the skeleton to get it ready twice as fast.
                const skeletonStep = isMobile ? 20 : 10;
                const skeletonConcurrency = 4;

                for (let i = skeletonStep; i < frameCount; i += skeletonConcurrency * skeletonStep) {
                    const batch = [];
                    for (let j = 0; j < skeletonConcurrency && i + (j * skeletonStep) < frameCount; j++) {
                        batch.push(loadFrame(i + (j * skeletonStep)));
                    }
                    await Promise.all(batch);
                }

                // Now smoothly load all the remaining gap frames in the background.
                // Mobile uses a very slow trickle (2 parallel) so it never interrupts scrolling.
                const concurrency = isMobile ? 2 : 6;
                for (let i = 1; i < frameCount; i += concurrency) {
                    const batch = [];
                    for (let j = 0; j < concurrency && i + j < frameCount; j++) {
                        const targetFrame = i + j;
                        // Skip if we already loaded it in the skeleton pass
                        if (targetFrame % skeletonStep !== 0 && targetFrame !== 0) {
                            batch.push(loadFrame(targetFrame));
                        }
                    }
                    if (batch.length > 0) {
                        await Promise.all(batch);
                    }
                }
            }, 800);
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
        // We cache the last drawn elements and ONLY redraw when the actual image mathematically changes.
        let lastDrawnImg = null;

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

            // Only execute the canvas render pipeline if the image actually changed!
            if (img && img.complete && img.naturalWidth > 0 && img !== lastDrawnImg) {

                // EXTREME GPU OFFLOADING: 
                // We no longer calculate screen `scale`, `x/y` centering, or `Math.max` dynamically in JavaScript. 
                // We lock the canvas internal coordinate system to the raw 1080p source image, and let 
                // the hardware-accelerated CSS `object-fit: cover` magically stretch it to fluidly fit ANY device screen perfectly without CPU lag.
                if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                }

                // Since the canvas intrinsically matches the image, we just drop it at 0,0
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0);

                lastDrawnImg = img;
            }
        };

        // Initial draw setup (we no longer need to bind this to resize events, CSS handles that magically!)
        setTimeout(() => renderFrame(scrollObj.frame), 100);

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
