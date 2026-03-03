import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PrivateInquiry = () => {
    return (
        <section className="inquiry-section">
            <div className="inquiry-container">
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    viewport={{ once: true }}
                    className="inquiry-divider"
                />

                <div className="inquiry-content">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="inquiry-tag"
                    >
                        By Invitation Only
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="inquiry-h2"
                    >
                        Commission Your <br /> Masterpiece
                    </motion.h2>

                    <div className="inquiry-grid">
                        {[
                            { label: "Global Atelier", val: "Geneva, Switzerland", sub: "Rue du Rhône 12, 1204" },
                            { label: "Private Line", val: "+41 22 555 0199", sub: "Mon - Fri, 09:00 - 18:00 CET" },
                            { label: "Digital Sanctuary", val: "concierge@pathfinder.watch", sub: "Estimated response: 24h" }
                        ].map((item, i) => (
                            <motion.div
                                className="inquiry-item"
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 + (i * 0.2) }}
                                viewport={{ once: true }}
                            >
                                <span className="inquiry-label">{item.label}</span>
                                <p className="inquiry-value">{item.val}</p>
                                <p className="inquiry-subvalue">{item.sub}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="commission-btn"
                    >
                        Begin The Dialogue
                        <ArrowRight size={16} />
                    </motion.button>
                </div>

                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 1.4 }}
                    viewport={{ once: true }}
                    className="inquiry-divider"
                />

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.8 }}
                    viewport={{ once: true }}
                    className="inquiry-footer-text"
                >
                    Access to our atelier is reserved for serious collectors.
                </motion.p>
            </div>
        </section>
    );
};

export default PrivateInquiry;
