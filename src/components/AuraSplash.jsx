import React from 'react';
import { motion } from 'framer-motion';

const AuraSplash = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onAnimationComplete={() => { }}
            className="splash-overlay"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, letterSpacing: "0.2em" }}
                animate={{ opacity: 1, scale: 1, letterSpacing: "0.5em" }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="splash-content"
            >
                <span className="splash-logo">Pathfinder</span>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100px" }}
                    transition={{ duration: 1, delay: 1 }}
                    className="splash-line"
                />
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="splash-tagline"
                >
                    One-of-One Masterpieces
                </motion.span>
            </motion.div>
        </motion.div>
    );
};

export default AuraSplash;
