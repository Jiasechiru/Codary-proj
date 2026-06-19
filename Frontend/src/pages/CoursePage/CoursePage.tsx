import { Link, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import Chevronleft from "../../assets/Icons/chevronleft.svg?react";
import Lock from "../../assets/Icons/lock.svg?react";
import {
    enrollCourse,
    getCourseDetails,
    type CourseDetails,
    type CourseModuleStatus,
} from "../../services/courses";
import PageState from "../../components/PageState/PageState";
import styles from "./CoursePage.module.css";

const CoursePage = () => {
    const { courseId } = useParams();
    const [details, setDetails] = useState<CourseDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadCourse = useCallback(async () => {
        if (!courseId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getCourseDetails(Number(courseId));
            setDetails(data);
        } catch (err) {
            setDetails(null);
            setError(err instanceof Error ? err.message : "Failed to load course.");
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        loadCourse();
    }, [loadCourse]);

    const handleEnroll = async () => {
        if (!courseId) return;

        setIsEnrolling(true);
        try {
            await enrollCourse(Number(courseId));
            await loadCourse();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to enroll.");
        } finally {
            setIsEnrolling(false);
        }
    };

    if (loading) {
        return <PageState kind="loading" title="Loading course..." />;
    }

    if (error && !details) {
        return (
            <PageState
                kind="error"
                title="Course not found."
                description={error || "Try opening another course from the list."}
            />
        );
    }

    if (!details) {
        return (
            <PageState
                kind="error"
                title="Course not found."
                description="Try opening another course from the list."
            />
        );
    }

    const { course, modules, enrolled } = details;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link to="/app/courses" className={styles.backLink}>
                    <Chevronleft className={styles.smallIcon} />
                    Back to Courses
                </Link>
                <h1 className={styles.title}>{course.title}</h1>
                <p className={styles.subtitle}>
                    {course.description || "Complete modules in order to unlock the next ones."}
                </p>
                <div className={styles.courseMeta}>
                    <span>{course.language}</span>
                    <span>•</span>
                    <span>{course.level}</span>
                    {enrolled ? (
                        <>
                            <span>•</span>
                            <span>{modules.length} modules</span>
                        </>
                    ) : null}
                </div>
            </div>

            {!enrolled ? (
                <div className={styles.enrollCard}>
                    <h2 className={styles.enrollTitle}>Enroll to start learning</h2>
                    <p className={styles.enrollText}>
                        Subscribe to this course to access modules, theory, quizzes, and practice tasks.
                    </p>
                    <button
                        type="button"
                        className={styles.enrollButton}
                        disabled={isEnrolling}
                        onClick={handleEnroll}
                    >
                        {isEnrolling ? "Enrolling..." : "Enroll in Course"}
                    </button>
                </div>
            ) : (
                <>
                    <div className={styles.progressCard}>
                        <div className={styles.progressHeader}>
                            <span className={styles.progressLabel}>Course progress</span>
                            <span className={styles.progressValue}>{Math.round(course.percentage)}%</span>
                        </div>
                        <div className={styles.progressTrack}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${course.percentage}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className={styles.moduleList}>
                        {modules.map((module, index) => (
                            <ModuleCard key={module.id} module={module} index={index} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

type ModuleCardProps = {
    module: CourseModuleStatus;
    index: number;
};

const ModuleCard = ({ module, index }: ModuleCardProps) => {
    const locked = module.isLocked;

    return (
        <div className={`${styles.moduleCard} ${locked ? styles.moduleLocked : ""}`}>
            <div className={styles.moduleHeader}>
                <div className={styles.moduleInfo}>
                    <p className={styles.moduleIndex}>Module {index + 1}</p>
                    <h3 className={styles.moduleTitle}>{module.title}</h3>
                    <p className={styles.moduleStatus}>
                        {locked
                            ? "Locked"
                            : module.isCompleted
                              ? "Completed"
                              : "In progress"}
                    </p>
                </div>
                {locked && (
                    <div className={styles.lockBadge}>
                        <Lock className={styles.lockIcon} />
                    </div>
                )}
                {module.isCompleted && !locked && (
                    <span className={styles.completedBadge}>Done</span>
                )}
            </div>

            {!locked && (
                <div className={styles.linkRow}>
                    <Link
                        to={`/app/theory/${module.id}`}
                        className={`${styles.moduleLink} ${styles.theoryLink}`}
                    >
                        Theory
                    </Link>
                    {module.quizId ? (
                        <Link
                            to={`/app/quiz/${module.quizId}`}
                            className={`${styles.moduleLink} ${styles.quizLink}`}
                        >
                            Quiz
                        </Link>
                    ) : (
                        <span className={`${styles.moduleLink} ${styles.quizLink}`}>Quiz</span>
                    )}
                    {module.taskId ? (
                        <Link
                            to={`/app/task/${module.taskId}`}
                            className={`${styles.moduleLink} ${styles.practiceLink}`}
                        >
                            Practice
                        </Link>
                    ) : (
                        <span className={`${styles.moduleLink} ${styles.practiceLink}`}>Practice</span>
                    )}
                </div>
            )}

            {locked && (
                <p className={styles.lockedHint}>Complete the previous module to unlock</p>
            )}
        </div>
    );
};

export default CoursePage;
