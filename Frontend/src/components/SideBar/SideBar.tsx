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
import { useLanguage } from "../../lib/LanguageContext";
import styles from "./SideBar.module.css";

const navItems = [
    { icon: Home, labelKey: "nav.dashboard", path: "/app" },
    { icon: Book, labelKey: "nav.courses", path: "/app/courses" },
    { icon: Progress, labelKey: "nav.progress", path: "/app/progress" },
    { icon: Chat, labelKey: "nav.chat", path: "/app/chat" },
    { icon: Leader, labelKey: "nav.leaderboard", path: "/app/leaderboard" },
    { icon: Profile, labelKey: "nav.profile", path: "/app/profile" },
    { icon: Gear, labelKey: "nav.settings", path: "/app/settings" },
];

const MOBILE_BREAKPOINT = 767;

const SideBar = () => {
    const location = useLocation();
    const { t } = useLanguage();
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
                aria-label={isMobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
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
                        const label = t(item.labelKey);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={label}
                                onClick={handleNavClick}
                                className={`${styles.navLink} ${isCollapsed ? styles.collapsed : styles.expanded} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}
                            >
                                <Icon className={styles.navIcon} />
                                <span className={styles.navLabel}>{label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className={styles.footer}>
                    <button
                        type="button"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`${styles.toggleButton} ${isCollapsed ? styles.collapsed : styles.expanded}`}
                        title={isCollapsed ? t("nav.expandSidebar") : t("nav.hideTab")}
                    >
                        {isCollapsed ? (
                            <Opentab className={styles.navIcon} />
                        ) : (
                            <>
                                <Closetab className={styles.navIcon} />
                                <span className={styles.navLabel}>{t("nav.hideTab")}</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}

export default SideBar;
