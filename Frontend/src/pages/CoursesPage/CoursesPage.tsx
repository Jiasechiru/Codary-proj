import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import Chevronup from "../../assets/Icons/chevronup.svg?react"
import Chevrondown from "../../assets/Icons/chevrondown.svg?react"
import Lock from "../../assets/Icons/lock.svg?react"
import { getCourseGroups, getCourses, getCourseModules, type Course } from "../../services/courses";
import { getModule } from "../../services/modules";
import { getProgressOverview } from "../../services/progress";
import PageState from "../../components/PageState/PageState";
import styles from "./CoursesPage.module.css";

type CourseLinks = {
    theoryId: number | null;
    quizId: number | null;
    taskId: number | null;
    topicsCount: number;
};

const CoursesPage = () => {
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [groups, setGroups] = useState<Array<{ id: number; title: string; type: string }>>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [progressMap, setProgressMap] = useState<Map<number, number>>(new Map());
    const [linksMap, setLinksMap] = useState<Map<number, CourseLinks>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [groupsData, coursesData, overview] = await Promise.all([
                    getCourseGroups(),
                    getCourses(),
                    getProgressOverview(),
                ]);
                setGroups(groupsData);
                setCourses(coursesData);
                setExpandedCategories(groupsData.slice(0, 2).map((group) => group.title));
                setProgressMap(new Map(overview.courses.map((item) => [item.courseId, item.percentage])));

                const linksEntries = await Promise.all(
                    coursesData.map(async (course) => {
                        const emptyLinks: CourseLinks = {
                            theoryId: null,
                            quizId: null,
                            taskId: null,
                            topicsCount: 0,
                        };
                        try {
                            const modules = await getCourseModules(course.id);
                            if (modules.length === 0) {
                                return [course.id, emptyLinks] as [number, CourseLinks];
                            }
                            const firstModule = await getModule(modules[0].id);
                            return [
                                course.id,
                                {
                                    theoryId: modules[0].id,
                                    quizId: firstModule?.quizzes[0]?.id || null,
                                    taskId: firstModule?.tasks[0]?.id || null,
                                    topicsCount: modules.length,
                                },
                            ] as [number, CourseLinks];
                        } catch (_error) {
                            return [course.id, emptyLinks] as [number, CourseLinks];
                        }
                    })
                );

                setLinksMap(new Map(linksEntries));
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const coursesByCategory = useMemo(() => {
        return groups.map((group) => ({
            category: group.title,
            language: group.type,
            courses: courses.filter((course) => course.courseGroupId === group.id),
        }));
    }, [courses, groups]);

    const toggleCategory = (category: string) => {
        setExpandedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    if (loading) {
        return <PageState kind="loading" title="Loading courses..." />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Courses</h1>
                <p className={styles.subtitle}>Choose a course to continue your learning journey</p>
            </div>

            <div className={styles.categoryList}>
                {coursesByCategory.map((categoryData) => {
                    const isExpanded = expandedCategories.includes(categoryData.category);
                    const totalCourses = categoryData.courses.length;
                    const completedCourses = categoryData.courses.filter(
                        (course) => (progressMap.get(course.id) || 0) >= 100
                    ).length;
                    const inProgressCourses = categoryData.courses.filter(
                        (course) => {
                            const progress = progressMap.get(course.id) || 0;
                            return progress > 0 && progress < 100;
                        }
                    ).length;

                    return (
                        <div key={categoryData.category} className={styles.categoryCard}>
                            <button
                                onClick={() => toggleCategory(categoryData.category)}
                                className={styles.categoryButton}
                            >
                                <div className={styles.categoryInfo}>
                                    <div className={styles.categoryText}>
                                        <h2 className={styles.categoryTitle}>{categoryData.category}</h2>
                                        <p className={styles.categoryMeta}>
                                            {categoryData.language} • {totalCourses} courses
                                            {inProgressCourses > 0 && ` • ${inProgressCourses} in progress`}
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.categoryActions}>
                                    {completedCourses > 0 && (
                                        <span className={styles.completedBadge}>
                                            {completedCourses} completed
                                        </span>
                                    )}
                                    {isExpanded ? (
                                        <Chevronup className={styles.chevronIcon} />
                                    ) : (
                                        <Chevrondown className={styles.chevronIcon} />
                                    )}
                                </div>
                            </button>

                            {isExpanded && (
                                <div className={styles.expandedContent}>
                                    <div className={styles.coursesGrid}>
                                        {categoryData.courses.map((course, index) => {
                                            const progress = progressMap.get(course.id) || 0;
                                            const links = linksMap.get(course.id) || {
                                                theoryId: null,
                                                quizId: null,
                                                taskId: null,
                                                topicsCount: 0,
                                            };
                                            const locked = index > 0 && (progressMap.get(categoryData.courses[index - 1].id) || 0) < 100;

                                            return (
                                            <div
                                                key={course.id}
                                                className={`${styles.courseCard} ${locked ? styles.courseLocked : ""}`}
                                            >
                                                <div className={styles.courseHeader}>
                                                    <div className={styles.courseInfo}>
                                                        <h3 className={styles.courseTitle}>{course.title}</h3>
                                                        <p className={styles.courseDescription}>{course.description || "No description yet."}</p>
                                                        <div className={styles.courseMeta}>
                                                            <span>{links.topicsCount} topics</span>
                                                            <span>•</span>
                                                            <span>{course.level}</span>
                                                        </div>
                                                    </div>
                                                    {locked && (
                                                        <div className={styles.lockBadge}>
                                                            <Lock className={styles.lockIcon} />
                                                        </div>
                                                    )}
                                                </div>

                                                {!locked && (
                                                    <>
                                                        <div className={styles.progressTrack}>
                                                            <div
                                                                className={styles.progressFill}
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className={styles.linkRow}>
                                                            {links.theoryId ? <Link
                                                                to={`/app/theory/${links.theoryId}`}
                                                                className={`${styles.courseLink} ${styles.theoryLink}`}
                                                            >
                                                                Theory
                                                            </Link> : <span className={`${styles.courseLink} ${styles.theoryLink}`}>Theory</span>}
                                                            {links.quizId ? <Link
                                                                to={`/app/quiz/${links.quizId}`}
                                                                className={`${styles.courseLink} ${styles.quizLink}`}
                                                            >
                                                                Quiz
                                                            </Link> : <span className={`${styles.courseLink} ${styles.quizLink}`}>Quiz</span>}
                                                            {links.taskId ? <Link
                                                                to={`/app/task/${links.taskId}`}
                                                                className={`${styles.courseLink} ${styles.practiceLink}`}
                                                            >
                                                                Practice
                                                            </Link> : <span className={`${styles.courseLink} ${styles.practiceLink}`}>Practice</span>}
                                                        </div>
                                                    </>
                                                )}

                                                {locked && (
                                                    <div className={styles.lockedHint}>
                                                        Complete previous courses to unlock
                                                    </div>
                                                )}
                                            </div>
                                        )})}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CoursesPage;
