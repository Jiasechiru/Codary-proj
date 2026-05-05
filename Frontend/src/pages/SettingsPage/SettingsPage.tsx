import { useState } from "react";
import moon from "../../assets/Icons/moon.svg"
import sun from "../../assets/Icons/sun.svg"
import styles from "./SettingsPage.module.css";

const SettingsPage = () => {
    const [aiEnabled, setAiEnabled] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Settings</h1>
                <p className={styles.subtitle}>Manage your preferences and account settings</p>
            </div>

            <div className={styles.sections}>
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>AI Assistant</h2>
                    <div className={styles.stack}>
                        <div className={styles.settingRow}>
                            <div>
                                <p className={styles.settingTitle}>Enable AI Assistant</p>
                                <p className={styles.settingDescription}>
                                    Get help from AI while solving tasks
                                </p>
                            </div>
                            <button
                                onClick={() => setAiEnabled(!aiEnabled)}
                                className={`${styles.switch} ${aiEnabled ? styles.switchEnabled : styles.switchDisabled}`}
                            >
                                <div className={`${styles.switchThumb} ${aiEnabled ? styles.switchThumbOn : ""}`}></div>
                            </button>
                        </div>
                        <div className={`${styles.settingRow} ${styles.topBorder}`}>
                            <div>
                                <p className={styles.settingTitle}>Auto-suggestions</p>
                                <p className={styles.settingDescription}>
                                    Show code suggestions automatically
                                </p>
                            </div>
                            <button
                                className={`${styles.switch} ${aiEnabled ? styles.switchEnabled : styles.switchDisabled}`}
                            >
                                <div className={`${styles.switchThumb} ${aiEnabled ? styles.switchThumbOn : ""}`}></div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Appearance</h2>
                    <div className={styles.settingRow}>
                        <div>
                            <p className={styles.settingTitle}>Dark Mode</p>
                            <p className={styles.settingDescription}>
                                Switch between light and dark themes
                            </p>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`${styles.switch} ${darkMode ? styles.switchEnabled : styles.switchDisabled}`}
                        >
                            <div className={`${styles.switchThumb} ${styles.switchThumbContent} ${darkMode ? styles.switchThumbOn : ""}`}>
                                {darkMode ? (
                                    <img src={moon} className={styles.switchIcon} />
                                ) : (
                                    <img src={sun} className={styles.switchIcon} />
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Notifications</h2>
                    <div className={styles.stack}>
                        <div className={styles.settingRow}>
                            <div>
                                <p className={styles.settingTitle}>Email Notifications</p>
                                <p className={styles.settingDescription}>
                                    Receive updates about your progress
                                </p>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`${styles.switch} ${notifications ? styles.switchEnabled : styles.switchDisabled}`}
                            >
                                <div className={`${styles.switchThumb} ${notifications ? styles.switchThumbOn : ""}`}></div>
                            </button>
                        </div>
                        <div className={`${styles.settingRow} ${styles.topBorder}`}>
                            <div>
                                <p className={styles.settingTitle}>Daily Reminders</p>
                                <p className={styles.settingDescription}>
                                    Get reminded to practice daily
                                </p>
                            </div>
                            <button
                                className={`${styles.switch} ${notifications ? styles.switchEnabled : styles.switchDisabled}`}
                            >
                                <div className={`${styles.switchThumb} ${notifications ? styles.switchThumbOn : ""}`}></div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Account</h2>
                    <div className={styles.actions}>
                        <button className={styles.secondaryButton}>
                            Change Password
                        </button>
                        <button className={styles.secondaryButton}>
                            Update Email
                        </button>
                        <button className={styles.dangerButton}>
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;