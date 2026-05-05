import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import home from "../../assets/Icons/home.svg"
import book from "../../assets/Icons/book.svg"
import chat from "../../assets/Icons/chat.svg"
import progress from "../../assets/Icons/progress.svg"
import leader from "../../assets/Icons/leader.svg"
import profile from "../../assets/Icons/profile.svg"
import gear from "../../assets/Icons/gear.svg"
import opentab from "../../assets/Icons/opentab.svg"
import closetab from "../../assets/Icons/closetab.svg"
import styles from "./SideBar.module.css";

const navItems = [
    { icon: home, label: "Dashboard", path: "/app" },
    { icon: book, label: "Courses", path: "/app/courses" },
    { icon: progress, label: "Progress", path: "/app/progress" },
    { icon: chat, label: "AI Chat", path: "/app/chat" },
    { icon: leader, label: "Leaderboard", path: "/app/leaderboard" },
    { icon: profile, label: "Profile", path: "/app/profile" },
    { icon: gear, label: "Settings", path: "/app/settings" },
];

const SideBar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '5rem' : '16rem');
    }, [isCollapsed]);

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ""}`}>
            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={isCollapsed ? item.label : undefined}
                            className={`${styles.navLink} ${isCollapsed ? styles.collapsed : styles.expanded} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}
                        >
                            <img src={Icon} className={styles.navIcon} />
                            {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>
            <div className={styles.footer}>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`${styles.toggleButton} ${isCollapsed ? styles.collapsed : styles.expanded}`}
                    title={isCollapsed ? "Expand sidebar" : "Hide tab"}
                >
                    {isCollapsed ? (
                        <img src={opentab} className={styles.navIcon} />
                    ) : (
                        <>
                            <img src={closetab} className={styles.navIcon} />
                            <span className={styles.navLabel}>Hide tab</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}

export default SideBar;
