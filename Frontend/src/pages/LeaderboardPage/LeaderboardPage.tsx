import Crown from "../../assets/Icons/crown.svg?react"
import Medal from "../../assets/Icons/medal.svg?react"
import Leader from "../../assets/Icons/leader.svg?react"
import Progress from "../../assets/Icons/progress.svg?react"
import Award from "../../assets/Icons/award.svg?react"
import { useEffect, useMemo, useState } from "react";
import { getLeaderboard, type LeaderboardEntry } from "../../services/leaderboard";
import { me } from "../../services/auth";
import PageState from "../../components/PageState/PageState";
import styles from "./LeaderboardPage.module.css";

const getInitials = (name: string) =>
    name
        .split(/[\s_.-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");

const getRankIcon = (rank: number) => {
    if (rank === 1) return { icon: Crown, iconClass: styles.rankIconGold, bgClass: styles.rankBadgeGold };
    if (rank === 2) return { icon: Medal, iconClass: styles.rankIconSilver, bgClass: styles.rankBadgeSilver };
    if (rank === 3) return { icon: Medal, iconClass: styles.rankIconBronze, bgClass: styles.rankBadgeBronze };
    return null;
};

const LeaderboardPage = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [board, auth] = await Promise.all([getLeaderboard(), me()]);
                setEntries(board);
                setCurrentUserId(auth.user.id);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const currentRank = useMemo(
        () => entries.findIndex((item) => item.id === currentUserId) + 1,
        [entries, currentUserId]
    );
    const currentPoints = entries.find((item) => item.id === currentUserId)?.totalPoints || 0;
    const nextPoints =
        currentRank > 1 && currentRank <= entries.length
            ? Math.max(entries[currentRank - 2].totalPoints - currentPoints + 1, 0)
            : 0;

    if (isLoading) {
        return <PageState kind="loading" title="Loading leaderboard..." />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <div className={styles.headerIconWrap}>
                        <Leader className={styles.headerIcon} />
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
                            <Progress className={styles.statIcon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>Your Rank</p>
                            <p className={styles.statValue}>{currentRank > 0 ? `#${currentRank}` : "-"}</p>
                        </div>
                    </div>
                    <p className={styles.mutedText}>
                        {currentRank > 0 ? `Top ${Math.ceil((currentRank / entries.length) * 100)}% of learners` : "No rank yet"}
                    </p>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.statIconWrap} ${styles.warningTint}`}>
                            <Leader className={styles.statIcon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>Total Points</p>
                            <p className={styles.statValue}>{currentPoints.toLocaleString()}</p>
                        </div>
                    </div>
                    <p className={styles.successText}>Keep learning to climb up</p>
                </div>

                <div className={styles.card}>
                    <div className={styles.statRow}>
                        <div className={`${styles.statIconWrap} ${styles.successTint}`}>
                            <Award className={styles.statIcon} />
                        </div>
                        <div>
                            <p className={styles.mutedText}>Next Rank</p>
                            <p className={styles.statValue}>{currentRank > 1 ? `#${currentRank - 1}` : "#1"}</p>
                        </div>
                    </div>
                    <p className={styles.mutedText}>{nextPoints} points to go</p>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.sectionTitle}>Top Learners</h2>
                </div>

                <div className={styles.tableBody}>
                    {entries.map((user, index) => {
                        const rank = index + 1;
                        const rankIcon = getRankIcon(rank);
                        const isCurrentUser = user.id === currentUserId;

                        return (
                            <div
                                key={user.id}
                                className={`${styles.tableRow} ${isCurrentUser ? styles.currentUserRow : styles.hoverRow}`}
                            >
                                <div className={styles.rowContent}>
                                    <div className={styles.rankColumn}>
                                        {rankIcon ? (
                                            <div className={`${styles.rankBadge} ${rankIcon.bgClass}`}>
                                                <rankIcon.icon className={`${styles.rankBadgeIcon} ${rankIcon.iconClass}`} />
                                            </div>
                                        ) : (
                                            <span className={styles.rankText}>#{rank}</span>
                                        )}
                                    </div>

                                    <div className={`${styles.avatar} ${isCurrentUser ? styles.avatarCurrent : styles.avatarDefault}`}>
                                        <span className={styles.avatarText}>{getInitials(user.username)}</span>
                                    </div>

                                    <div className={styles.userInfo}>
                                        <p className={styles.userName}>{user.username}</p>
                                        <p className={styles.mutedText}>
                                            {user.level}
                                        </p>
                                    </div>

                                    <div className={styles.pointsBlock}>
                                        <p className={styles.points}>{user.totalPoints.toLocaleString()}</p>
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