import React from 'react';
import { motion } from 'framer-motion';

const Manifesto = () => {
    return (
        <section className="rolex-section">
            <div className="rolex-container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    className="rolex-header"
                >
                    <h2 className="rolex-title">The Philosophy</h2>
                    <p className="rolex-subtitle">Time is the ultimate luxury. We simply give it form.</p>
                </motion.div>

                <div className="rolex-split">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="rolex-text"
                    >
                        <h3>One-of-One Masterpieces</h3>
                        <p>Singular creation. Never replicated. Every detail is meticulously shaped by master artisans to ensure a timepiece that stands alone in the timeline of horology. There is no production line, only the precise dialogue between the craftsman and the individual.</p>
                        <a href="#inquiry" className="rolex-link">Discover more</a>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)", y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="rolex-image-wrapper"
                    >
                        <motion.img
                            src="/watch_clean_1.png"
                            alt="Watch Masterpiece"
                            className="rolex-content-img"
                            animate={{ y: [-10, 10, -10], rotateZ: [-0.5, 0.5, -0.5] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Manifesto;
