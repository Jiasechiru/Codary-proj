import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import target from "../../assets/Icons/target.svg"
import lightning from "../../assets/Icons/lightning.svg"
import leader from "../../assets/Icons/leader.svg"
import styles from "./ProgressPage.module.css";

const weeklyData = [
    { day: "Mon", tasks: 3 },
    { day: "Tue", tasks: 5 },
    { day: "Wed", tasks: 4 },
    { day: "Thu", tasks: 6 },
    { day: "Fri", tasks: 7 },
    { day: "Sat", tasks: 2 },
    { day: "Sun", tasks: 4 },
];

const progressData = [
    { month: "Jan", completed: 12 },
    { month: "Feb", completed: 18 },
    { month: "Mar", completed: 25 },
    { month: "Apr", completed: 31 },
];

const ProgressPage = () => {
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
                            <img src={target} className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>Success Rate</p>
                            <p className={styles.statValue}>87%</p>
                        </div>
                    </div>
                    <div className={styles.progressTrack}>
                        <div className={styles.successProgress} style={{ width: "87%" }}></div>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.primaryTint}`}>
                            <img src={lightning} className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>Current Streak</p>
                            <p className={styles.statValue}>12 days</p>
                        </div>
                    </div>
                    <p className={styles.mutedText}>Keep it up! 🔥</p>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.iconWrap} ${styles.warningTint}`}>
                            <img src={leader} className={styles.icon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>Total Points</p>
                            <p className={styles.statValue}>2,450</p>
                        </div>
                    </div>
                    <p className={styles.mutedText}>Top 15% of learners</p>
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
                    <div>
                        <div className={styles.rowBetween}>
                            <span className={styles.itemLabel}>JavaScript Basics</span>
                            <span className={styles.mutedText}>80%</span>
                        </div>
                        <div className={styles.progressTrack}>
                            <div className={styles.primaryProgress} style={{ width: "80%" }}></div>
                        </div>
                    </div>
                    <div>
                        <div className={styles.rowBetween}>
                            <span className={styles.itemLabel}>JavaScript Intermediate</span>
                            <span className={styles.mutedText}>45%</span>
                        </div>
                        <div className={styles.progressTrack}>
                            <div className={styles.primaryProgress} style={{ width: "45%" }}></div>
                        </div>
                    </div>
                    <div>
                        <div className={styles.rowBetween}>
                            <span className={styles.itemLabel}>React Basics</span>
                            <span className={styles.mutedText}>30%</span>
                        </div>
                        <div className={styles.progressTrack}>
                            <div className={styles.primaryProgress} style={{ width: "30%" }}></div>
                        </div>
                    </div>
                    <div>
                        <div className={styles.rowBetween}>
                            <span className={styles.itemLabel}>TypeScript Fundamentals</span>
                            <span className={styles.mutedText}>0%</span>
                        </div>
                        <div className={styles.progressTrack}>
                            <div className={styles.primaryProgress} style={{ width: "0%" }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProgressPage;