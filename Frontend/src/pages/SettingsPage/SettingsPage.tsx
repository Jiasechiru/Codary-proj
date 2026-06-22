import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Moon from "../../assets/Icons/moon.svg?react"
import Sun from "../../assets/Icons/sun.svg?react"
import { logout } from "../../services/auth";
import { getSettings, updateSettings } from "../../services/settings";
import { applyTheme } from "../../lib/theme";
import { useLanguage } from "../../lib/LanguageContext";
import type { Language } from "../../lib/i18n";
import PageState from "../../components/PageState/PageState";
import styles from "./SettingsPage.module.css";

const SettingsPage = () => {
    const navigate = useNavigate();
    const { t, language, setLanguage } = useLanguage();
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
                const theme = settings.theme ?? "light";
                setAiEnabled(settings.aiEnabled ?? true);
                setNotifications(settings.notifications ?? true);
                setDarkMode(theme === "dark");
                setAutoSuggestions(settings.autoSuggestions ?? true);
                setDailyReminders(settings.dailyReminders ?? true);
                applyTheme(theme);
                if (settings.language) {
                    setLanguage(settings.language);
                }
            } catch (_error) {
                // Keep defaults when loading fails.
            } finally {
                setIsLoading(false);
            }
        };

        loadSettings();
    }, [setLanguage]);

    const saveSettings = async (next: {
        aiEnabled?: boolean;
        notifications?: boolean;
        darkMode?: boolean;
        autoSuggestions?: boolean;
        dailyReminders?: boolean;
        language?: Language;
    }) => {
        try {
            await updateSettings({
                aiEnabled: next.aiEnabled ?? aiEnabled,
                notifications: next.notifications ?? notifications,
                theme: (next.darkMode ?? darkMode) ? "dark" : "light",
                autoSuggestions: next.autoSuggestions ?? autoSuggestions,
                dailyReminders: next.dailyReminders ?? dailyReminders,
                language: next.language ?? language,
            });
        } catch (_error) {
            // Ignore save errors silently for now.
        }
    };

    const toggleDarkMode = async () => {
        const nextDark = !darkMode;
        setDarkMode(nextDark);
        applyTheme(nextDark ? "dark" : "light");
        await saveSettings({ darkMode: nextDark });
    };

    const handleSelectLanguage = async (next: Language) => {
        if (next === language) return;
        setLanguage(next);
        await saveSettings({ language: next });
    };

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate("/login");
        }
    };

    if (isLoading) {
        return <PageState kind="loading" title={t("settings.loading")} />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t("settings.title")}</h1>
                <p className={styles.subtitle}>{t("settings.subtitle")}</p>
            </div>

            <div className={styles.sections}>
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>{t("settings.aiAssistant")}</h2>
                    <div className={styles.stack}>
                        <div className={styles.settingRow}>
                            <div>
                                <p className={styles.settingTitle}>{t("settings.enableAi")}</p>
                                <p className={styles.settingDescription}>
                                    {t("settings.enableAiDesc")}
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
                                <p className={styles.settingTitle}>{t("settings.autoSuggestions")}</p>
                                <p className={styles.settingDescription}>
                                    {t("settings.autoSuggestionsDesc")}
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
                    <h2 className={styles.sectionTitle}>{t("settings.appearance")}</h2>
                    <div className={styles.settingRow}>
                        <div>
                            <p className={styles.settingTitle}>{t("settings.darkMode")}</p>
                            <p className={styles.settingDescription}>
                                {t("settings.darkModeDesc")}
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
                    <h2 className={styles.sectionTitle}>{t("settings.language")}</h2>
                    <div className={styles.settingRow}>
                        <div>
                            <p className={styles.settingTitle}>{t("settings.language")}</p>
                            <p className={styles.settingDescription}>
                                {t("settings.languageDesc")}
                            </p>
                        </div>
                        <div className={styles.languageGroup}>
                            <button
                                type="button"
                                onClick={() => handleSelectLanguage("ru")}
                                className={`${styles.languageButton} ${language === "ru" ? styles.languageButtonActive : ""}`}
                            >
                                {t("settings.languageRu")}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSelectLanguage("en")}
                                className={`${styles.languageButton} ${language === "en" ? styles.languageButtonActive : ""}`}
                            >
                                {t("settings.languageEn")}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>{t("settings.notifications")}</h2>
                    <div className={styles.stack}>
                        <div className={styles.settingRow}>
                            <div>
                                <p className={styles.settingTitle}>{t("settings.emailNotifications")}</p>
                                <p className={styles.settingDescription}>
                                    {t("settings.emailNotificationsDesc")}
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
                                <p className={styles.settingTitle}>{t("settings.dailyReminders")}</p>
                                <p className={styles.settingDescription}>
                                    {t("settings.dailyRemindersDesc")}
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
                    <h2 className={styles.sectionTitle}>{t("settings.account")}</h2>
                    <div className={styles.actions}>
                        <button className={styles.secondaryButton}>
                            {t("settings.changePassword")}
                        </button>
                        <button className={styles.secondaryButton}>
                            {t("settings.updateEmail")}
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className={styles.logoutButton}
                        >
                            {t("settings.logout")}
                        </button>
                        <button className={styles.dangerButton}>
                            {t("settings.deleteAccount")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;