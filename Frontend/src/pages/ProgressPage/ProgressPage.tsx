import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useEffect, useMemo, useState } from "react";
import Target from "../../assets/Icons/target.svg?react"
import Lightning from "../../assets/Icons/lightning.svg?react"
import Leader from "../../assets/Icons/leader.svg?react"
import { getCourses } from "../../services/courses";
import { getProgressOverview } from "../../services/progress";
import { getUserProfile } from "../../services/users";
import { useLanguage } from "../../lib/LanguageContext";
import PageState from "../../components/PageState/PageState";
import styles from "./ProgressPage.module.css";

const ProgressPage = () => {
    const { t, locale } = useLanguage();
    const [successRate, setSuccessRate] = useState(0);
    const [streak, setStreak] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [coursesProgress, setCoursesProgress] = useState<Array<{ courseId: number; title: string; percentage: number }>>([]);
    const [weeklyData, setWeeklyData] = useState<Array<{ day: string; tasks: number }>>([]);
    const [progressData, setProgressData] = useState<Array<{ month: string; completed: number }>>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const [overview, profile, courses] = await Promise.all([
                    getProgressOverview(),
                    getUserProfile(),
                    getCourses(),
                ]);

                const attempts = overview.attempts || { total: 0, correct: 0 };
                setSuccessRate(
                    attempts.total > 0 ? Math.round((attempts.correct / attempts.total) * 100) : 0
                );
                setStreak(profile?.daysStreak || 0);
                setTotalPoints(profile?.totalPoints || 0);

                const titleMap = new Map(courses.map((course) => [course.id, course.title]));
                setCoursesProgress(
                    overview.courses.map((item) => ({
                        courseId: item.courseId,
                        title: titleMap.get(item.courseId) || t("progress.courseFallback", { id: item.courseId }),
                        percentage: item.percentage,
                    }))
                );

                const dayMs = 24 * 60 * 60 * 1000;
                const startOfDay = (value: string | number | Date) => {
                    const d = new Date(value);
                    d.setHours(0, 0, 0, 0);
                    return d;
                };

                const completions = overview.tasks
                    .filter((task) => task.isCompleted && task.completedAt)
                    .map((task) => startOfDay(task.completedAt as string).getTime());

                const today = startOfDay(new Date()).getTime();
                const week = Array.from({ length: 7 }, (_, index) => {
                    const dayStart = today - (6 - index) * dayMs;
                    const count = completions.filter(
                        (time) => time >= dayStart && time < dayStart + dayMs
                    ).length;
                    return {
                        day: new Date(dayStart).toLocaleDateString(locale, { weekday: "short" }),
                        tasks: count,
                    };
                });
                setWeeklyData(week);

                const countByDay = new Map<number, number>();
                for (const time of completions) {
                    countByDay.set(time, (countByDay.get(time) || 0) + 1);
                }
                const sortedDays = Array.from(countByDay.keys()).sort((a, b) => a - b);
                let cumulative = 0;
                setProgressData(
                    sortedDays.map((time) => {
                        cumulative += countByDay.get(time) || 0;
                        return {
                            month: new Date(time).toLocaleDateString(locale, { month: "short", day: "numeric" }),
                            completed: cumulative,
                        };
                    })
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadProgress();
    }, [t, locale]);

    const rankedCourses = useMemo(
        () => coursesProgress.slice().sort((a, b) => b.percentage - a.percentage).slice(0, 5),
        [coursesProgress]
    );

    if (isLoading) {
        return <PageState kind="loading" title={t("progress.loading")} />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t("progress.title")}</h1>
                <p className={styles.subtitle}>{t("progress.subtitle")}</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.successTint}`}>
                            <Target className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>{t("progress.successRate")}</p>
                            <p className={styles.statValue}>{successRate}%</p>
                        </div>
                    </div>
                    <div className={styles.progressTrack}>
                        <div className={styles.successProgress} style={{ width: `${successRate}%` }}></div>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.primaryTint}`}>
                            <Lightning className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>{t("progress.currentStreak")}</p>
                            <p className={styles.statValue}>{t("progress.days", { count: streak })}</p>
                        </div>
                    </div>
                    <p className={styles.mutedText}>{t("progress.keepItUp")}</p>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.warningTint}`}>
                            <Leader className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>{t("progress.totalPoints")}</p>
                            <p className={styles.statValue}>{totalPoints.toLocaleString()}</p>
                        </div>
                    </div>
                    <p className={styles.mutedText}>{t("progress.pointsNote")}</p>
                </div>
            </div>

            <div className={styles.chartsGrid}>
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>{t("progress.weeklyActivity")}</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="day" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "2px solid #E5E7EB",
                                    borderRadius: "8px",
                                }}
                            />
                            <Bar dataKey="tasks" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>{t("progress.progressOverTime")}</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={progressData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "2px solid #E5E7EB",
                                    borderRadius: "8px",
                                }}
                            />
                            <Line type="monotone" dataKey="completed" stroke="#22C55E" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.card}>
                <h2 className={styles.sectionTitle}>{t("progress.courseProgress")}</h2>
                <div className={styles.stack}>
                    {rankedCourses.length > 0 ? rankedCourses.map((course) => (
                        <div key={course.courseId}>
                            <div className={styles.rowBetween}>
                                <span className={styles.itemLabel}>{course.title}</span>
                                <span className={styles.mutedText}>{course.percentage.toFixed(0)}%</span>
                            </div>
                            <div className={styles.progressTrack}>
                                <div className={styles.primaryProgress} style={{ width: `${course.percentage}%` }}></div>
                            </div>
                        </div>
                    )) : <p className={styles.mutedText}>{t("progress.noProgress")}</p>}
                </div>
            </div>
        </div>
    );
}

export default ProgressPage;