import { Link, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import Chevronleft from "../../assets/Icons/chevronleft.svg?react";
import Lock from "../../assets/Icons/lock.svg?react";
import Correct from "../../assets/Icons/correct.svg?react";
import {
    enrollCourse,
    getCourseDetails,
    type CourseDetails,
    type CourseModuleStatus,
} from "../../services/courses";
import { useLanguage } from "../../lib/LanguageContext";
import PageState from "../../components/PageState/PageState";
import styles from "./CoursePage.module.css";

const CoursePage = () => {
    const { t } = useLanguage();
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
            setError(err instanceof Error ? err.message : t("course.loadFailed"));
        } finally {
            setLoading(false);
        }
    }, [courseId, t]);

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
            setError(err instanceof Error ? err.message : t("course.enrollFailed"));
        } finally {
            setIsEnrolling(false);
        }
    };

    if (loading) {
        return <PageState kind="loading" title={t("course.loading")} />;
    }

    if (error && !details) {
        return (
            <PageState
                kind="error"
                title={t("course.notFound")}
                description={error || t("course.notFoundDesc")}
            />
        );
    }

    if (!details) {
        return (
            <PageState
                kind="error"
                title={t("course.notFound")}
                description={t("course.notFoundDesc")}
            />
        );
    }

    const { course, modules, enrolled } = details;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link to="/app/courses" className={styles.backLink}>
                    <Chevronleft className={styles.smallIcon} />
                    {t("course.backToCourses")}
                </Link>
                <h1 className={styles.title}>{course.title}</h1>
                <p className={styles.subtitle}>
                    {course.description || t("course.defaultDescription")}
                </p>
                <div className={styles.courseMeta}>
                    <span>{course.language}</span>
                    <span>•</span>
                    <span>{course.level}</span>
                    {enrolled ? (
                        <>
                            <span>•</span>
                            <span>{t("course.modulesCount", { count: modules.length })}</span>
                        </>
                    ) : null}
                </div>
            </div>

            {!enrolled ? (
                <div className={styles.enrollCard}>
                    <h2 className={styles.enrollTitle}>{t("course.enrollTitle")}</h2>
                    <p className={styles.enrollText}>
                        {t("course.enrollText")}
                    </p>
                    <button
                        type="button"
                        className={styles.enrollButton}
                        disabled={isEnrolling}
                        onClick={handleEnroll}
                    >
                        {isEnrolling ? t("course.enrolling") : t("course.enroll")}
                    </button>
                </div>
            ) : (
                <>
                    <div className={styles.progressCard}>
                        <div className={styles.progressHeader}>
                            <span className={styles.progressLabel}>{t("course.progress")}</span>
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
                            <ModuleCard key={module.id} module={module} index={index} t={t} />
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
    t: (key: string, vars?: Record<string, string | number>) => string;
};

const ModuleCard = ({ module, index, t }: ModuleCardProps) => {
    const locked = module.isLocked;
    // When the whole module is completed, only the module badge is shown.
    // Per-part indicators appear only while the module is partially done.
    const showQuizDone = module.quizCompleted && !module.isCompleted;
    const showPracticeDone = module.taskCompleted && !module.isCompleted;

    return (
        <div className={`${styles.moduleCard} ${locked ? styles.moduleLocked : ""}`}>
            <div className={styles.moduleHeader}>
                <div className={styles.moduleInfo}>
                    <p className={styles.moduleIndex}>{t("course.module", { number: index + 1 })}</p>
                    <h3 className={styles.moduleTitle}>{module.title}</h3>
                    <p className={styles.moduleStatus}>
                        {locked
                            ? t("course.locked")
                            : module.isCompleted
                              ? t("course.completed")
                              : t("course.inProgress")}
                    </p>
                </div>
                {locked && (
                    <div className={styles.lockBadge}>
                        <Lock className={styles.lockIcon} />
                    </div>
                )}
                {module.isCompleted && !locked && (
                    <span className={styles.completedBadge}>{t("course.done")}</span>
                )}
            </div>

            {!locked && (
                <div className={styles.linkRow}>
                    <Link
                        to={`/app/theory/${module.id}`}
                        className={`${styles.moduleLink} ${styles.theoryLink}`}
                    >
                        {t("course.theory")}
                    </Link>
                    {module.quizId ? (
                        <Link
                            to={`/app/quiz/${module.id}`}
                            className={`${styles.moduleLink} ${styles.quizLink} ${showQuizDone ? styles.moduleLinkDone : ""}`}
                            title={showQuizDone ? t("course.quizDone") : undefined}
                        >
                            {showQuizDone && <Correct className={styles.linkDoneIcon} />}
                            {t("course.quiz")}
                        </Link>
                    ) : (
                        <span className={`${styles.moduleLink} ${styles.quizLink}`}>{t("course.quiz")}</span>
                    )}
                    {module.taskId ? (
                        <Link
                            to={`/app/task/${module.taskId}`}
                            className={`${styles.moduleLink} ${styles.practiceLink} ${showPracticeDone ? styles.moduleLinkDone : ""}`}
                            title={showPracticeDone ? t("course.practiceDone") : undefined}
                        >
                            {showPracticeDone && <Correct className={styles.linkDoneIcon} />}
                            {t("course.practice")}
                        </Link>
                    ) : (
                        <span className={`${styles.moduleLink} ${styles.practiceLink}`}>{t("course.practice")}</span>
                    )}
                </div>
            )}

            {locked && (
                <p className={styles.lockedHint}>{t("course.lockedHint")}</p>
            )}
        </div>
    );
};

export default CoursePage;
