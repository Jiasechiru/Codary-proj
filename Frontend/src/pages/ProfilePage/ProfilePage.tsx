import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Leader from "../../assets/Icons/leader.svg?react";
import Lightning from "../../assets/Icons/lightning.svg?react";
import Calendar from "../../assets/Icons/calendar.svg?react";
import Breaks from "../../assets/Icons/breaks.svg?react";
import Target from "../../assets/Icons/target.svg?react";
import Award from "../../assets/Icons/award.svg?react";
import { getUserActivity, getUserProfile, type UserActivity, type UserProfile } from "../../services/users";
import PageState from "../../components/PageState/PageState";
import styles from "./ProfilePage.module.css";

const achievementIcons = [Leader, Lightning, Calendar, Breaks, Target, Award];

function getInitials(username: string) {
    return username
        .split(/[\s_.-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

function formatTimeSpent(seconds: number) {
    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}m`;
    }

    return `${(seconds / 3600).toFixed(1)}h`;
}

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activity, setActivity] = useState<UserActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);
            setError("");

            try {
                const [profileData, activityData] = await Promise.all([getUserProfile(), getUserActivity()]);
                setProfile(profileData);
                setActivity(activityData);
            } catch (requestError) {
                const message = requestError instanceof Error ? requestError.message : "Failed to load profile";
                setError(message);

                if (message.toLowerCase().includes("unauthorized")) {
                    navigate("/login");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [navigate]);

    const recentActivity = useMemo(() => activity.slice(0, 3), [activity]);

    if (isLoading) {
        return <PageState kind="loading" title="Loading profile..." />;
    }

    if (error || !profile) {
        return <PageState kind="error" title={error || "Profile is unavailable."} />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatar}>
                        <span className={styles.avatarText}>{getInitials(profile.username)}</span>
                    </div>
                    <div className={styles.profileInfo}>
                        <h1 className={styles.title}>{profile.username}</h1>
                        <p className={styles.subtitle}>@{profile.username}</p>
                        <div className={styles.statsRow}>
                            <div>
                                <p className={styles.statValue}>{profile.completedTasks}</p>
                                <p className={styles.mutedText}>Tasks Completed</p>
                            </div>
                            <div>
                                <p className={styles.statValue}>{formatTimeSpent(profile.totalTimeSpentSeconds)}</p>
                                <p className={styles.mutedText}>Time Spent</p>
                            </div>
                            <div>
                                <p className={styles.statValue}>{profile.daysStreak}</p>
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
                        <h3 className={styles.subHeading}>Current Progress</h3>
                        <div className={styles.stack}>
                            <div>
                                <div className={styles.rowBetween}>
                                    <span>Level</span>
                                    <span className={styles.mutedText}>{profile.level}</span>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressFill} style={{ width: `${Math.min(profile.completedTasks * 2, 100)}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.rowBetween}>
                                    <span>Points</span>
                                    <span className={styles.mutedText}>{profile.totalPoints}</span>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressFill} style={{ width: `${Math.min(profile.totalPoints / 20, 100)}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.rowBetween}>
                                    <span>Consistency</span>
                                    <span className={styles.mutedText}>{profile.daysStreak} day streak</span>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressFill} style={{ width: `${Math.min(profile.daysStreak * 5, 100)}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className={styles.subHeading}>Recent Activity</h3>
                        <div className={styles.stack}>
                            {recentActivity.length > 0 ? (
                                recentActivity.map((entry, index) => (
                                    <div className={styles.milestoneRow} key={entry.id}>
                                        <div
                                            className={`${styles.dot} ${index % 3 === 0 ? styles.dotSuccess : index % 3 === 1 ? styles.dotPrimary : styles.dotWarning}`}
                                        ></div>
                                        <div>
                                            <p className={styles.itemTitle}>Spent {formatTimeSpent(entry.timeSpentSeconds)} learning</p>
                                            <p className={styles.timeText}>{new Date(entry.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.mutedText}>No activity yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Achievements</h2>
                <div className={styles.achievementsGrid}>
                    {profile.achievements.length > 0 ? profile.achievements.map((achievement, index) => {
                        const Icon = achievementIcons[index % achievementIcons.length];
                        return (
                            <div
                                key={achievement.id}
                                className={`${styles.achievementCard} ${styles.achievementUnlocked}`}
                            >
                                <div className={styles.milestoneRow}>
                                    <div
                                        className={`${styles.badgeIconWrap} ${styles.badgeUnlocked}`}
                                    >
                                        <Icon className={styles.badgeIcon} />
                                    </div>
                                    <div>
                                        <h3 className={styles.itemTitle}>{achievement.title}</h3>
                                        <p className={styles.mutedText}>{achievement.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : <p className={styles.mutedText}>No achievements unlocked yet.</p>}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
