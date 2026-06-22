import { Link, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import Book from "../../assets/Icons/book.svg?react"
import Breaks from "../../assets/Icons/breaks.svg?react"
import Award from "../../assets/Icons/award.svg?react"
import Clock from "../../assets/Icons/clock.svg?react"
import Correct from "../../assets/Icons/correct.svg?react"
import { getCourses } from "../../services/courses";
import { getProgressOverview } from "../../services/progress";
import { getUserActivity, getUserProfile } from "../../services/users";
import { getDailyChallengeStatus } from "../../services/dailyChallenge";
import { useLanguage } from "../../lib/LanguageContext";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
    const { t, locale } = useLanguage();
    const navigate = useNavigate();
    const [dailyCompleted, setDailyCompleted] = useState<boolean | null>(null);
    const [userName, setUserName] = useState("");
    const [coursesCount, setCoursesCount] = useState(0);
    const [tasksCompleted, setTasksCompleted] = useState(0);
    const [achievementsCount, setAchievementsCount] = useState(0);
    const [timeSpent, setTimeSpent] = useState("0m");
    const [recentCourses, setRecentCourses] = useState<Array<{ id: number; title: string; percentage: number }>>([]);
    const [recentActivity, setRecentActivity] = useState<Array<{ id: number; date: string; timeSpentSeconds: number }>>([]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [profile, activity, courses, overview] = await Promise.all([
                    getUserProfile(),
                    getUserActivity(),
                    getCourses(),
                    getProgressOverview(),
                ]);

                setUserName(profile?.username || "");
                setCoursesCount(overview.courses.length);
                setTasksCompleted(overview.tasks.filter((item) => item.isCompleted).length);
                setAchievementsCount(profile?.achievements.length || 0);
                setTimeSpent(`${Math.max(1, Math.round((profile?.totalTimeSpentSeconds || 0) / 3600))}h`);
                setRecentActivity(activity.slice(0, 4));

                const progressMap = new Map(overview.courses.map((item) => [item.courseId, item.percentage]));
                const inProgress = courses
                    .map((course) => ({
                        id: course.id,
                        title: course.title,
                        percentage: progressMap.get(course.id) || 0,
                    }))
                    .filter((course) => course.percentage > 0)
                    .sort((a, b) => b.percentage - a.percentage)
                    .slice(0, 2);

                setRecentCourses(inProgress);
            } catch (_error) {
                // Keep default values on failure.
            }
        };

        loadDashboard();
    }, []);

    useEffect(() => {
        getDailyChallengeStatus()
            .then((status) => setDailyCompleted(status.completedToday))
            .catch(() => setDailyCompleted(false));
    }, []);

    const recentActivityRows = useMemo(
        () =>
            recentActivity.map((item, index) => ({
                id: item.id,
                title: t("dashboard.studiedMinutes", {
                    count: Math.max(1, Math.round(item.timeSpentSeconds / 60)),
                }),
                time: new Date(item.date).toLocaleDateString(locale),
                dotClass: index % 3 === 0 ? styles.dotSuccess : index % 3 === 1 ? styles.dotPrimary : styles.dotWarning,
            })),
        [recentActivity, t, locale]
    );

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t("dashboard.welcome", { name: userName || t("dashboard.defaultUser") })}</h1>
                <p className={styles.subtitle}>{t("dashboard.subtitle")}</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.primaryTint}`}>
                            <Book className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.statValue}>{coursesCount}</p>
                            <p className={styles.mutedText}>{t("dashboard.courses")}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.successTint}`}>
                            <Breaks className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.statValue}>{tasksCompleted}</p>
                            <p className={styles.mutedText}>{t("dashboard.tasksCompleted")}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.warningTint}`}>
                            <Award className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.statValue}>{achievementsCount}</p>
                            <p className={styles.mutedText}>{t("dashboard.achievements")}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.accentTint}`}>
                            <Clock className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.statValue}>{timeSpent}</p>
                            <p className={styles.mutedText}>{t("dashboard.timeSpent")}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>{t("dashboard.continueLearning")}</h2>
                    <div className={styles.stack}>
                        {recentCourses.length > 0 ? (
                            recentCourses.map((course) => (
                                <div key={course.id} className={styles.innerCard}>
                                    <div className={styles.rowBetween}>
                                        <div>
                                            <h3 className={styles.itemTitle}>{course.title}</h3>
                                            <p className={styles.mutedText}>{t("dashboard.inProgress")}</p>
                                        </div>
                                        <span className={styles.progressTag}>{course.percentage.toFixed(0)}%</span>
                                    </div>
                                    <div className={styles.progressTrack}>
                                        <div className={styles.progressFill} style={{ width: `${course.percentage}%` }}></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.mutedText}>{t("dashboard.noProgress")}</p>
                        )}
                    </div>
                    <Link
                        to="/app/courses"
                        className={styles.primaryLink}
                    >
                        {t("dashboard.viewAllCourses")}
                    </Link>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>{t("dashboard.recentActivity")}</h2>
                    <div className={styles.stack}>
                        {recentActivityRows.map((item) => (
                            <div key={item.id} className={styles.activityRow}>
                                <div className={`${styles.dot} ${item.dotClass}`}></div>
                                <div className={styles.activityContent}>
                                    <p className={styles.activityTitle}>{item.title}</p>
                                    <p className={styles.activityTime}>{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.challengeCard}>
                <h2 className={styles.sectionTitle}>{t("dashboard.dailyChallenge")}</h2>
                {dailyCompleted ? (
                    <p className={styles.challengeSolved}>
                        <Correct className={styles.challengeSolvedIcon} />
                        {t("dashboard.dailySolved")}
                    </p>
                ) : (
                    <>
                        <p className={styles.challengeText}>
                            {t("dashboard.dailyChallengeText")}
                        </p>
                        <p className={styles.challengeChoose}>{t("dashboard.dailyChooseLanguage")}</p>
                        <div className={styles.challengeLanguages}>
                            <button
                                type="button"
                                className={styles.inlinePrimaryLink}
                                onClick={() => navigate("/app/daily-challenge/javascript")}
                            >
                                JavaScript
                            </button>
                            <button
                                type="button"
                                className={styles.inlineSecondaryLink}
                                onClick={() => navigate("/app/daily-challenge/c")}
                            >
                                C
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;