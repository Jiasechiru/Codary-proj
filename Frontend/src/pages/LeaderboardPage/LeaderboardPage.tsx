import crown from "../../assets/Icons/crown.svg"
import medal from "../../assets/Icons/medal.svg"
import leader from "../../assets/Icons/leader.svg"
import progress from "../../assets/Icons/progress.svg"
import award from "../../assets/Icons/award.svg"
import styles from "./LeaderboardPage.module.css";


const leaderboardData = [
    { rank: 1, name: "Sarah Chen", avatar: "SC", points: 4850, tasksCompleted: 127, streak: 45 },
    { rank: 2, name: "Marcus Rodriguez", avatar: "MR", points: 4520, tasksCompleted: 115, streak: 38 },
    { rank: 3, name: "Emma Watson", avatar: "EW", points: 4210, tasksCompleted: 108, streak: 42 },
    { rank: 4, name: "James Kim", avatar: "JK", points: 3980, tasksCompleted: 102, streak: 29 },
    { rank: 5, name: "Olivia Martinez", avatar: "OM", points: 3750, tasksCompleted: 96, streak: 35 },
    { rank: 6, name: "Liam Johnson", avatar: "LJ", points: 3420, tasksCompleted: 89, streak: 21 },
    { rank: 7, name: "Sophia Lee", avatar: "SL", points: 3180, tasksCompleted: 84, streak: 28 },
    { rank: 8, name: "Noah Patel", avatar: "NP", points: 2950, tasksCompleted: 78, streak: 18 },
    { rank: 9, name: "Ava Brown", avatar: "AB", points: 2680, tasksCompleted: 71, streak: 15 },
    { rank: 10, name: "You (Alex)", avatar: "AJ", points: 2450, tasksCompleted: 47, streak: 12, isCurrentUser: true },
];

const getRankIcon = (rank: number) => {
    if (rank === 1) return { icon: crown, iconClass: styles.rankIconGold, bgClass: styles.rankBadgeGold };
    if (rank === 2) return { icon: medal, iconClass: styles.rankIconSilver, bgClass: styles.rankBadgeSilver };
    if (rank === 3) return { icon: medal, iconClass: styles.rankIconBronze, bgClass: styles.rankBadgeBronze };
    return null;
};

const LeaderboardPage = () => {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <div className={styles.headerIconWrap}>
                        <img src={leader} className={styles.headerIcon} />
                    </div>
                    <div>
                        <h1 className={styles.title}>Leaderboard</h1>
                        <p className={styles.subtitle}>See how you rank among other learners</p>
                    </div>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.statIconWrap} ${styles.primaryTint}`}>
                            <img src={progress} className={styles.statIcon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>Your Rank</p>
                            <p className={styles.statValue}>#10</p>
                        </div>
                    </div>
                    <p className={styles.mutedText}>Top 15% of learners</p>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.statIconWrap} ${styles.warningTint}`}>
                            <img src={leader} className={styles.statIcon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>Total Points</p>
                            <p className={styles.statValue}>2,450</p>
                        </div>
                    </div>
                    <p className={styles.successText}>+120 this week</p>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.statIconWrap} ${styles.successTint}`}>
                            <img src={award} className={styles.statIcon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>Next Rank</p>
                            <p className={styles.statValue}>#9</p>
                        </div>
                    </div>
                    <p className={styles.mutedText}>230 points to go</p>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.sectionTitle}>Top Learners</h2>
                </div>

                <div className={styles.tableBody}>
                    {leaderboardData.map((user) => {
                        const rankIcon = getRankIcon(user.rank);

                        return (
                            <div
                                key={user.rank}
                                className={`${styles.tableRow} ${user.isCurrentUser ? styles.currentUserRow : styles.hoverRow}`}
                            >
                                <div className={styles.rowContent}>
                                    <div className={styles.rankColumn}>
                                        {rankIcon ? (
                                            <div className={`${styles.rankBadge} ${rankIcon.bgClass}`}>
                                                <img src={rankIcon.icon} className={`${styles.rankBadgeIcon} ${rankIcon.iconClass}`} />
                                            </div>
                                        ) : (
                                            <span className={styles.rankText}>#{user.rank}</span>
                                        )}
                                    </div>

                                    <div className={`${styles.avatar} ${user.isCurrentUser ? styles.avatarCurrent : styles.avatarDefault}`}>
                                        <span className={styles.avatarText}>{user.avatar}</span>
                                    </div>

                                    <div className={styles.userInfo}>
                                        <p className={styles.userName}>{user.name}</p>
                                        <p className={styles.mutedText}>
                                            {user.tasksCompleted} tasks • {user.streak} day streak
                                        </p>
                                    </div>

                                    <div className={styles.pointsBlock}>
                                        <p className={styles.points}>{user.points.toLocaleString()}</p>
                                        <p className={styles.pointsLabel}>points</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.tipsCard}>
                <h3 className={styles.sectionTitle}>How to climb the leaderboard</h3>
                <ul className={styles.tipsList}>
                    <li>• Complete tasks to earn points</li>
                    <li>• Maintain your daily streak for bonus points</li>
                    <li>• Achieve perfect scores on tasks for extra rewards</li>
                    <li>• Unlock achievements to boost your ranking</li>
                </ul>
            </div>
        </div>
    );
}

export default LeaderboardPage;