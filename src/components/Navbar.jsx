import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { label: "The Aura", href: "#hero" },
        { label: "Our Philosophy", href: "#manifesto" },
        { label: "Private Atelier", href: "#inquiry" }
    ];

    return (
        <>
            <nav className="navbar">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="nav-logo"
                >
                    Pathfinder
                </motion.div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="nav-menu-trigger"
                >
                    <span className="nav-trigger-label">Menu</span>
                    <div className="nav-trigger-icon">
                        <Menu size={16} />
                    </div>
                </button>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="menu-overlay"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="menu-close"
                        >
                            <X size={32} strokeWidth={1} />
                        </button>

                        <div className="menu-container">
                            <div className="menu-nav-col">
                                {menuItems.map((item, i) => (
                                    <motion.a
                                        key={i}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="menu-item"
                                    >
                                        {item.label}
                                    </motion.a>
                                ))}
                            </div>

                            <motion.div
                                className="menu-info-col"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="menu-info-section">
                                    <h4 className="menu-info-title">Atelier Location</h4>
                                    <div className="menu-map-wrapper">
                                        <iframe
                                            src="https://maps.google.com/maps?q=Rue%20du%20Rh%C3%B4ne%2012,%201204%20Geneva,%20Switzerland&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                            width="100%"
                                            height="200"
                                            style={{ border: 0, filter: 'grayscale(1) invert(0.9) opacity(0.8)' }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                    </div>
                                    <p className="menu-address">Rue du Rhône 12, 1204 Geneva, Switzerland</p>
                                </div>

                                <div className="menu-info-section">
                                    <h4 className="menu-info-title">Connect</h4>
                                    <div className="menu-socials">
                                        <a href="#" className="menu-link">Instagram</a>
                                        <a href="#" className="menu-link">X (Twitter)</a>
                                        <a href="#" className="menu-link">LinkedIn</a>
                                    </div>
                                </div>

                                <div className="menu-info-section">
                                    <h4 className="menu-info-title">Legal</h4>
                                    <div className="menu-legal">
                                        <a href="#" className="menu-link">GDPR Compliance</a>
                                        <a href="#" className="menu-link">Privacy Policy</a>
                                    </div>
                                </div>

                                <div className="menu-footer-text">
                                    In pursuit of absolute perfection
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
