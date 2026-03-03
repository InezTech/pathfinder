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

                        <div className="menu-content">
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

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="menu-footer-text"
                            >
                                In pursuit of absolute perfection
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
