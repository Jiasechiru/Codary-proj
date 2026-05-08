import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useEffect, useMemo, useState } from "react";
import Target from "../../assets/Icons/target.svg?react"
import Lightning from "../../assets/Icons/lightning.svg?react"
import Leader from "../../assets/Icons/leader.svg?react"
import { getCourses } from "../../services/courses";
import { getProgressOverview } from "../../services/progress";
import { getUserActivity, getUserProfile } from "../../services/users";
import PageState from "../../components/PageState/PageState";
import styles from "./ProgressPage.module.css";

const ProgressPage = () => {
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
                const [overview, profile, activity, courses] = await Promise.all([
                    getProgressOverview(),
                    getUserProfile(),
                    getUserActivity(),
                    getCourses(),
                ]);
                const completedTasks = overview.tasks.filter((task) => task.isCompleted).length;
                const totalTasks = overview.tasks.length || 1;
                setSuccessRate(Math.round((completedTasks / totalTasks) * 100));
                setStreak(profile?.daysStreak || 0);
                setTotalPoints(profile?.totalPoints || 0);

                const titleMap = new Map(courses.map((course) => [course.id, course.title]));
                setCoursesProgress(
                    overview.courses.map((item) => ({
                        courseId: item.courseId,
                        title: titleMap.get(item.courseId) || `Course #${item.courseId}`,
                        percentage: item.percentage,
                    }))
                );

                const lastWeek = activity.slice(0, 7).reverse();
                setWeeklyData(
                    lastWeek.map((item) => ({
                        day: new Date(item.date).toLocaleDateString(undefined, { weekday: "short" }),
                        tasks: Math.max(1, Math.round(item.timeSpentSeconds / 1800)),
                    }))
                );

                setProgressData(
                    activity
                        .slice(0, 12)
                        .reverse()
                        .map((item, idx) => ({
                            month: new Date(item.date).toLocaleDateString(undefined, { month: "short" }),
                            completed: idx + 1,
                        }))
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadProgress();
    }, []);

    const rankedCourses = useMemo(
        () => coursesProgress.slice().sort((a, b) => b.percentage - a.percentage).slice(0, 5),
        [coursesProgress]
    );

    if (isLoading) {
        return <PageState kind="loading" title="Loading progress..." />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Your Progress</h1>
                <p className={styles.subtitle}>Track your learning journey and achievements</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.successTint}`}>
                            <Target className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>Success Rate</p>
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
                            <p className={styles.mutedText}>Current Streak</p>
                            <p className={styles.statValue}>{streak} days</p>
                        </div>
                    </div>
                    <p className={styles.mutedText}>Keep it up! 🔥</p>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.warningTint}`}>
                            <Leader className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>Total Points</p>
                            <p className={styles.statValue}>{totalPoints.toLocaleString()}</p>
                        </div>
                    </div>
                    <p className={styles.mutedText}>All earned in real tasks and quizzes</p>
                </div>
            </div>

            <div className={styles.chartsGrid}>
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Weekly Activity</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="day" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "8px",
                                }}
                            />
                            <Bar dataKey="tasks" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Progress Over Time</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={progressData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "8px",
                                }}
                            />
                            <Line type="monotone" dataKey="completed" stroke="#22C55E" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Course Progress</h2>
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
                    )) : <p className={styles.mutedText}>No course progress yet.</p>}
                </div>
            </div>
        </div>
    );
}

export default ProgressPage;