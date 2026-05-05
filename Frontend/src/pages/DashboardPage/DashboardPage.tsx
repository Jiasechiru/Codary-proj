import { Link } from "react-router";
import book from "../../assets/Icons/book.svg"
import breaks from "../../assets/Icons/breaks.svg"
import award from "../../assets/Icons/award.svg"
import clock from "../../assets/Icons/clock.svg"
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Welcome back, Alex!</h1>
                <p className={styles.subtitle}>Continue your learning journey</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.primaryTint}`}>
                            <img src={book} className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.statValue}>12</p>
                            <p className={styles.mutedText}>Courses</p>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.successTint}`}>
                            <img src={breaks} className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.statValue}>47</p>
                            <p className={styles.mutedText}>Tasks Completed</p>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.warningTint}`}>
                            <img src={award} className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.statValue}>8</p>
                            <p className={styles.mutedText}>Achievements</p>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.accentTint}`}>
                            <img src={clock} className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.statValue}>24h</p>
                            <p className={styles.mutedText}>Time Spent</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>Continue Learning</h2>
                    <div className={styles.stack}>
                        <div className={styles.innerCard}>
                            <div className={styles.rowBetween}>
                                <div>
                                    <h3 className={styles.itemTitle}>JavaScript Fundamentals</h3>
                                    <p className={styles.mutedText}>Arrays and Objects</p>
                                </div>
                                <span className={styles.progressTag}>65%</span>
                            </div>
                            <div className={styles.progressTrack}>
                                <div className={styles.progressFill} style={{ width: "65%" }}></div>
                            </div>
                        </div>

                        <div className={styles.innerCard}>
                            <div className={styles.rowBetween}>
                                <div>
                                    <h3 className={styles.itemTitle}>React Basics</h3>
                                    <p className={styles.mutedText}>State and Props</p>
                                </div>
                                <span className={styles.progressTag}>30%</span>
                            </div>
                            <div className={styles.progressTrack}>
                                <div className={styles.progressFill} style={{ width: "30%" }}></div>
                            </div>
                        </div>
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
                        <div className={styles.activityRow}>
                            <div className={`${styles.dot} ${styles.dotSuccess}`}></div>
                            <div className={styles.activityContent}>
                                <p className={styles.activityTitle}>Completed: For Loops</p>
                                <p className={styles.activityTime}>2 hours ago</p>
                            </div>
                        </div>
                        <div className={styles.activityRow}>
                            <div className={`${styles.dot} ${styles.dotSuccess}`}></div>
                            <div className={styles.activityContent}>
                                <p className={styles.activityTitle}>Completed: Functions in JavaScript</p>
                                <p className={styles.activityTime}>Yesterday</p>
                            </div>
                        </div>
                        <div className={styles.activityRow}>
                            <div className={`${styles.dot} ${styles.dotPrimary}`}></div>
                            <div className={styles.activityContent}>
                                <p className={styles.activityTitle}>Started: React Components</p>
                                <p className={styles.activityTime}>2 days ago</p>
                            </div>
                        </div>
                        <div className={styles.activityRow}>
                            <div className={`${styles.dot} ${styles.dotWarning}`}></div>
                            <div className={styles.activityContent}>
                                <p className={styles.activityTitle}>Achievement: First 10 Tasks</p>
                                <p className={styles.activityTime}>3 days ago</p>
                            </div>
                        </div>
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