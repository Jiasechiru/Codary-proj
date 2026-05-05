import leader from "../../assets/Icons/leader.svg"
import lightning from "../../assets/Icons/lightning.svg"
import calendar from "../../assets/Icons/calendar.svg"
import breaks from "../../assets/Icons/breaks.svg"
import target from "../../assets/Icons/target.svg"
import award from "../../assets/Icons/award.svg"
import styles from "./ProfilePage.module.css";

const achievements = [
    { id: 1, title: "First Steps", description: "Completed your first task", icon: leader, unlocked: true },
    { id: 2, title: "Fast Learner", description: "Completed 10 tasks in a week", icon: lightning, unlocked: true },
    { id: 3, title: "Streak Master", description: "Maintained a 7-day streak", icon: calendar, unlocked: true },
    { id: 4, title: "Code Warrior", description: "Completed 50 tasks", icon: breaks, unlocked: true },
    { id: 5, title: "Perfect Score", description: "Got 100% on 5 tasks in a row", icon: target, unlocked: false },
    { id: 6, title: "Dedicated", description: "Maintained a 30-day streak", icon: award, unlocked: false },
];

const ProfilePage = () => {
    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatar}>
                        <span className={styles.avatarText}>AJ</span>
                    </div>
                    <div className={styles.profileInfo}>
                        <h1 className={styles.title}>Alex Johnson</h1>
                        <p className={styles.subtitle}>alex.johnson@email.com</p>
                        <div className={styles.statsRow}>
                            <div>
                                <p className={styles.statValue}>47</p>
                                <p className={styles.mutedText}>Tasks Completed</p>
                            </div>
                            <div>
                                <p className={styles.statValue}>24h</p>
                                <p className={styles.mutedText}>Time Spent</p>
                            </div>
                            <div>
                                <p className={styles.statValue}>12</p>
                                <p className={styles.mutedText}>Day Streak</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Learning Summary</h2>
                <div className={styles.summaryGrid}>
                    <div>
                        <h3 className={styles.subHeading}>Skills</h3>
                        <div className={styles.stack}>
                            <div>
                                <div className={styles.rowBetween}>
                                    <span>JavaScript</span>
                                    <span className={styles.mutedText}>Advanced</span>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressFill} style={{ width: "85%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.rowBetween}>
                                    <span>React</span>
                                    <span className={styles.mutedText}>Intermediate</span>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressFill} style={{ width: "60%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.rowBetween}>
                                    <span>TypeScript</span>
                                    <span className={styles.mutedText}>Beginner</span>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressFill} style={{ width: "30%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className={styles.subHeading}>Recent Milestones</h3>
                        <div className={styles.stack}>
                            <div className={styles.milestoneRow}>
                                <div className={`${styles.dot} ${styles.dotSuccess}`}></div>
                                <div>
                                    <p className={styles.itemTitle}>Completed JavaScript Basics</p>
                                    <p className={styles.timeText}>3 days ago</p>
                                </div>
                            </div>
                            <div className={styles.milestoneRow}>
                                <div className={`${styles.dot} ${styles.dotPrimary}`}></div>
                                <div>
                                    <p className={styles.itemTitle}>Started React Course</p>
                                    <p className={styles.timeText}>1 week ago</p>
                                </div>
                            </div>
                            <div className={styles.milestoneRow}>
                                <div className={`${styles.dot} ${styles.dotWarning}`}></div>
                                <div>
                                    <p className={styles.itemTitle}>Reached 1000 Points</p>
                                    <p className={styles.timeText}>2 weeks ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Achievements</h2>
                <div className={styles.achievementsGrid}>
                    {achievements.map((achievement) => {
                        const Icon = achievement.icon;
                        return (
                            <div
                                key={achievement.id}
                                className={`${styles.achievementCard} ${achievement.unlocked ? styles.achievementUnlocked : styles.achievementLocked}`}
                            >
                                <div className={styles.milestoneRow}>
                                    <div
                                        className={`${styles.badgeIconWrap} ${achievement.unlocked ? styles.badgeUnlocked : styles.badgeLocked}`}
                                    >
                                        <img src={Icon} className={styles.badgeIcon} />
                                    </div>
                                    <div>
                                        <h3 className={styles.itemTitle}>{achievement.title}</h3>
                                        <p className={styles.mutedText}>{achievement.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
