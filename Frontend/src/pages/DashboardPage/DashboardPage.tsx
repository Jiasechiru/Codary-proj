import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import Book from "../../assets/Icons/book.svg?react"
import Breaks from "../../assets/Icons/breaks.svg?react"
import Award from "../../assets/Icons/award.svg?react"
import Clock from "../../assets/Icons/clock.svg?react"
import { getCourses } from "../../services/courses";
import { getProgressOverview } from "../../services/progress";
import { getUserActivity, getUserProfile } from "../../services/users";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
    const [userName, setUserName] = useState("Learner");
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

                setUserName(profile?.username || "Learner");
                setCoursesCount(courses.length);
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

    const recentActivityRows = useMemo(
        () =>
            recentActivity.map((item, index) => ({
                id: item.id,
                title: `Studied for ${Math.max(1, Math.round(item.timeSpentSeconds / 60))} minutes`,
                time: new Date(item.date).toLocaleDateString(),
                dotClass: index % 3 === 0 ? styles.dotSuccess : index % 3 === 1 ? styles.dotPrimary : styles.dotWarning,
            })),
        [recentActivity]
    );

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Welcome back, {userName}!</h1>
                <p className={styles.subtitle}>Continue your learning journey</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.primaryTint}`}>
                            <Book className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.statValue}>{coursesCount}</p>
                            <p className={styles.mutedText}>Courses</p>
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
                            <p className={styles.mutedText}>Tasks Completed</p>
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
                            <p className={styles.mutedText}>Achievements</p>
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
                            <p className={styles.mutedText}>Time Spent</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Continue Learning</h2>
                    <div className={styles.stack}>
                        {recentCourses.length > 0 ? (
                            recentCourses.map((course) => (
                                <div key={course.id} className={styles.innerCard}>
                                    <div className={styles.rowBetween}>
                                        <div>
                                            <h3 className={styles.itemTitle}>{course.title}</h3>
                                            <p className={styles.mutedText}>In progress</p>
                                        </div>
                                        <span className={styles.progressTag}>{course.percentage.toFixed(0)}%</span>
                                    </div>
                                    <div className={styles.progressTrack}>
                                        <div className={styles.progressFill} style={{ width: `${course.percentage}%` }}></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.mutedText}>Start a course to see progress here.</p>
                        )}
                    </div>
                    <Link
                        to="/app/courses"
                        className={styles.primaryLink}
                    >
                        View All Courses
                    </Link>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Recent Activity</h2>
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
                <h2 className={styles.sectionTitle}>Daily Challenge</h2>
                <p className={styles.challengeText}>
                    Complete today's challenge to maintain your learning streak!
                </p>
                <Link
                    to="/app/task/daily-challenge"
                    className={styles.inlinePrimaryLink}
                >
                    Start Challenge
                </Link>
            </div>
        </div>
    );
}

export default DashboardPage;