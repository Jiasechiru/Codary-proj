import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import Home from "../../assets/Icons/home.svg?react"
import Book from "../../assets/Icons/book.svg?react"
import Chat from "../../assets/Icons/chat.svg?react"
import Progress from "../../assets/Icons/progress.svg?react"
import Leader from "../../assets/Icons/leader.svg?react"
import Profile from "../../assets/Icons/profile.svg?react"
import Gear from "../../assets/Icons/gear.svg?react"
import Opentab from "../../assets/Icons/opentab.svg?react"
import Closetab from "../../assets/Icons/closetab.svg?react"
import styles from "./SideBar.module.css";

const navItems = [
    { icon: Home, label: "Dashboard", path: "/app" },
    { icon: Book, label: "Courses", path: "/app/courses" },
    { icon: Progress, label: "Progress", path: "/app/progress" },
    { icon: Chat, label: "AI Chat", path: "/app/chat" },
    { icon: Leader, label: "Leaderboard", path: "/app/leaderboard" },
    { icon: Profile, label: "Profile", path: "/app/profile" },
    { icon: Gear, label: "Settings", path: "/app/settings" },
];

const MOBILE_BREAKPOINT = 767;

const SideBar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const updateSidebarWidth = () => {
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                document.documentElement.style.setProperty("--sidebar-width", "0");
            } else {
                document.documentElement.style.setProperty(
                    "--sidebar-width",
                    isCollapsed ? "5rem" : "16rem"
                );
            }
        };

        updateSidebarWidth();
        window.addEventListener("resize", updateSidebarWidth);
        return () => window.removeEventListener("resize", updateSidebarWidth);
    }, [isCollapsed]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (isMobileMenuOpen && window.innerWidth <= MOBILE_BREAKPOINT) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    const handleNavClick = () => {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            {isMobileMenuOpen && (
                <button
                    type="button"
                    className={styles.mobileBackdrop}
                    aria-label="Close menu"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <button
                type="button"
                className={styles.mobileToggle}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
                {isMobileMenuOpen ? (
                    <Closetab className={styles.mobileToggleIcon} />
                ) : (
                    <Opentab className={styles.mobileToggleIcon} />
                )}
            </button>

            <aside
                className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ""} ${isMobileMenuOpen ? styles.sidebarMobileOpen : ""}`}
            >
                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={item.label}
                                onClick={handleNavClick}
                                className={`${styles.navLink} ${isCollapsed ? styles.collapsed : styles.expanded} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}
                            >
                                <Icon className={styles.navIcon} />
                                <span className={styles.navLabel}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className={styles.footer}>
                    <button
                        type="button"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`${styles.toggleButton} ${isCollapsed ? styles.collapsed : styles.expanded}`}
                        title={isCollapsed ? "Expand sidebar" : "Hide tab"}
                    >
                        {isCollapsed ? (
                            <Opentab className={styles.navIcon} />
                        ) : (
                            <>
                                <Closetab className={styles.navIcon} />
                                <span className={styles.navLabel}>Hide tab</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}

export default SideBar;
