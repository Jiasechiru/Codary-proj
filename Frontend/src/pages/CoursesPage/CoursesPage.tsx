import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import Chevronup from "../../assets/Icons/chevronup.svg?react"
import Chevrondown from "../../assets/Icons/chevrondown.svg?react"
import { enrollCourse, getCourseGroups, getCourses, getCourseModules, type Course } from "../../services/courses";
import { getProgressOverview } from "../../services/progress";
import PageState from "../../components/PageState/PageState";
import styles from "./CoursesPage.module.css";

const CoursesPage = () => {
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [groups, setGroups] = useState<Array<{ id: number; title: string; type: string }>>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrolledSet, setEnrolledSet] = useState<Set<number>>(new Set());
    const [progressMap, setProgressMap] = useState<Map<number, number>>(new Map());
    const [moduleCountMap, setModuleCountMap] = useState<Map<number, number>>(new Map());
    const [enrollingId, setEnrollingId] = useState<number | null>(null);
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
                setEnrolledSet(new Set(overview.courses.map((item) => item.courseId)));
                setProgressMap(new Map(overview.courses.map((item) => [item.courseId, item.percentage])));

                const countEntries = await Promise.all(
                    coursesData.map(async (course) => {
                        try {
                            const modules = await getCourseModules(course.id);
                            return [course.id, modules.length] as [number, number];
                        } catch (_error) {
                            return [course.id, 0] as [number, number];
                        }
                    })
                );

                setModuleCountMap(new Map(countEntries));
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleEnroll = async (courseId: number) => {
        setEnrollingId(courseId);
        try {
            const result = await enrollCourse(courseId);
            setEnrolledSet((prev) => new Set(prev).add(courseId));
            setProgressMap((prev) => new Map(prev).set(courseId, result.percentage));
        } finally {
            setEnrollingId(null);
        }
    };

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
                    const enrolledInCategory = categoryData.courses.filter((course) =>
                        enrolledSet.has(course.id)
                    ).length;
                    const completedCourses = categoryData.courses.filter(
                        (course) => enrolledSet.has(course.id) && (progressMap.get(course.id) || 0) >= 100
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
                                            {enrolledInCategory > 0 && ` • ${enrolledInCategory} enrolled`}
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
                                        {categoryData.courses.map((course) => {
                                            const isEnrolled = enrolledSet.has(course.id);
                                            const progress = progressMap.get(course.id) || 0;
                                            const isCompleted = isEnrolled && progress >= 100;
                                            const moduleCount = moduleCountMap.get(course.id) || 0;
                                            const isEnrolling = enrollingId === course.id;

                                            return (
                                                <div
                                                    key={course.id}
                                                    className={`${styles.courseCard} ${isCompleted ? styles.courseCardCompleted : ""}`}
                                                >
                                                    <div className={styles.courseHeader}>
                                                        <div className={styles.courseInfo}>
                                                            <h3 className={styles.courseTitle}>{course.title}</h3>
                                                            <p className={styles.courseDescription}>
                                                                {course.description || "No description yet."}
                                                            </p>
                                                            <div className={styles.courseMeta}>
                                                                <span>{moduleCount} modules</span>
                                                                <span>•</span>
                                                                <span>{course.level}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {isEnrolled ? (
                                                        <>
                                                            <div className={styles.progressTrack}>
                                                                <div
                                                                    className={styles.progressFill}
                                                                    style={{ width: `${progress}%` }}
                                                                ></div>
                                                            </div>
                                                            <p className={styles.courseProgressText}>
                                                                {Math.round(progress)}% complete
                                                            </p>
                                                            <Link
                                                                to={`/app/courses/${course.id}`}
                                                                className={styles.openCourseButton}
                                                            >
                                                                {isCompleted ? "View Modules" : "Continue Learning"}
                                                            </Link>
                                                        </>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className={styles.enrollButton}
                                                            disabled={isEnrolling}
                                                            onClick={() => handleEnroll(course.id)}
                                                        >
                                                            {isEnrolling ? "Enrolling..." : "Enroll in Course"}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
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
