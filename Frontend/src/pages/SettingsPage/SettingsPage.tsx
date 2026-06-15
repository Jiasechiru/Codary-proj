import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Moon from "../../assets/Icons/moon.svg?react"
import Sun from "../../assets/Icons/sun.svg?react"
import { logout } from "../../services/auth";
import { getSettings, updateSettings } from "../../services/settings";
import PageState from "../../components/PageState/PageState";
import styles from "./SettingsPage.module.css";

const SettingsPage = () => {
    const navigate = useNavigate();
    const [aiEnabled, setAiEnabled] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoSuggestions, setAutoSuggestions] = useState(true);
    const [dailyReminders, setDailyReminders] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await getSettings();
                const settings = response?.settings || {};
                setAiEnabled(settings.aiEnabled ?? true);
                setNotifications(settings.notifications ?? true);
                setDarkMode((settings.theme ?? "light") === "dark");
                setAutoSuggestions(settings.autoSuggestions ?? true);
                setDailyReminders(settings.dailyReminders ?? true);
            } catch (_error) {
                // Keep defaults when loading fails.
            } finally {
                setIsLoading(false);
            }
        };

        loadSettings();
    }, []);

    const saveSettings = async (next: {
        aiEnabled?: boolean;
        notifications?: boolean;
        darkMode?: boolean;
        autoSuggestions?: boolean;
        dailyReminders?: boolean;
    }) => {
        try {
            await updateSettings({
                aiEnabled: next.aiEnabled ?? aiEnabled,
                notifications: next.notifications ?? notifications,
                theme: (next.darkMode ?? darkMode) ? "dark" : "light",
                autoSuggestions: next.autoSuggestions ?? autoSuggestions,
                dailyReminders: next.dailyReminders ?? dailyReminders,
            });
        } catch (_error) {
            // Ignore save errors silently for now.
        }
    };

    const toggleDarkMode = async () => {
        const nextDark = !darkMode;
        setDarkMode(nextDark);
        document.documentElement.classList.toggle("dark", nextDark);
        await saveSettings({ darkMode: nextDark });
    };

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate("/login");
        }
    };

    if (isLoading) {
        return <PageState kind="loading" title="Loading settings..." />;
    }

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
                                onClick={async () => {
                                    const next = !aiEnabled;
                                    setAiEnabled(next);
                                    await saveSettings({ aiEnabled: next });
                                }}
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
                                onClick={async () => {
                                    const next = !autoSuggestions;
                                    setAutoSuggestions(next);
                                    await saveSettings({ autoSuggestions: next });
                                }}
                                className={`${styles.switch} ${autoSuggestions ? styles.switchEnabled : styles.switchDisabled}`}
                            >
                                <div className={`${styles.switchThumb} ${autoSuggestions ? styles.switchThumbOn : ""}`}></div>
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
                                    <Moon className={styles.switchIcon} />
                                ) : (
                                    <Sun className={styles.switchIcon} />
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
                                onClick={async () => {
                                    const next = !notifications;
                                    setNotifications(next);
                                    await saveSettings({ notifications: next });
                                }}
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
                                onClick={async () => {
                                    const next = !dailyReminders;
                                    setDailyReminders(next);
                                    await saveSettings({ dailyReminders: next });
                                }}
                                className={`${styles.switch} ${dailyReminders ? styles.switchEnabled : styles.switchDisabled}`}
                            >
                                <div className={`${styles.switchThumb} ${dailyReminders ? styles.switchThumbOn : ""}`}></div>
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
                        <button
                            type="button"
                            onClick={handleLogout}
                            className={styles.logoutButton}
                        >
                            Log Out
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