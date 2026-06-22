import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import Chevronup from "../../assets/Icons/chevronup.svg?react"
import Chevrondown from "../../assets/Icons/chevrondown.svg?react"
import { enrollCourse, getCourseGroups, getCourses, getCourseModules, type Course } from "../../services/courses";
import { getProgressOverview } from "../../services/progress";
import { useLanguage } from "../../lib/LanguageContext";
import PageState from "../../components/PageState/PageState";
import styles from "./CoursesPage.module.css";

type LanguageFilter = "all" | string;
type CategorySort = "default" | "coursesDesc" | "coursesAsc";

type CategoryView = {
    id: number;
    category: string;
    language: string;
    courses: Course[];
};

const CoursesPage = () => {
    const { t } = useLanguage();
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [groups, setGroups] = useState<Array<{ id: number; title: string; type: string }>>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrolledSet, setEnrolledSet] = useState<Set<number>>(new Set());
    const [progressMap, setProgressMap] = useState<Map<number, number>>(new Map());
    const [moduleCountMap, setModuleCountMap] = useState<Map<number, number>>(new Map());
    const [enrollingId, setEnrollingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("all");
    const [categorySort, setCategorySort] = useState<CategorySort>("default");

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

    const coursesByCategory = useMemo<CategoryView[]>(() => {
        return groups.map((group) => ({
            id: group.id,
            category: group.title,
            language: group.type,
            courses: courses.filter((course) => course.courseGroupId === group.id),
        }));
    }, [courses, groups]);

    const availableLanguages = useMemo(() => {
        const languages = new Set(groups.map((group) => group.type));
        return Array.from(languages).sort((a, b) => a.localeCompare(b));
    }, [groups]);

    const visibleCategories = useMemo(() => {
        const filtered = coursesByCategory.filter(
            (category) => languageFilter === "all" || category.language === languageFilter
        );

        const sorted = [...filtered];
        if (categorySort === "coursesDesc") {
            sorted.sort((a, b) => b.courses.length - a.courses.length || a.category.localeCompare(b.category));
        } else if (categorySort === "coursesAsc") {
            sorted.sort((a, b) => a.courses.length - b.courses.length || a.category.localeCompare(b.category));
        }

        return sorted;
    }, [coursesByCategory, languageFilter, categorySort]);

    const sortOptions: Array<{ value: CategorySort; labelKey: string }> = [
        { value: "default", labelKey: "courses.sortDefault" },
        { value: "coursesDesc", labelKey: "courses.sortCoursesDesc" },
        { value: "coursesAsc", labelKey: "courses.sortCoursesAsc" },
    ];

    const toggleCategory = (category: string) => {
        setExpandedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    if (loading) {
        return <PageState kind="loading" title={t("courses.loading")} />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t("courses.title")}</h1>
                <p className={styles.subtitle}>{t("courses.subtitle")}</p>
            </div>

            <div className={styles.controlsCard}>
                <div className={styles.controlGroup}>
                    <span className={styles.controlLabel}>{t("courses.filterLanguage")}</span>
                    <div className={styles.controlButtons}>
                        <button
                            type="button"
                            className={`${styles.controlButton} ${languageFilter === "all" ? styles.controlButtonActive : ""}`}
                            onClick={() => setLanguageFilter("all")}
                        >
                            {t("courses.filterAll")}
                        </button>
                        {availableLanguages.map((language) => (
                            <button
                                key={language}
                                type="button"
                                className={`${styles.controlButton} ${languageFilter === language ? styles.controlButtonActive : ""}`}
                                onClick={() => setLanguageFilter(language)}
                            >
                                {language}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.controlGroup}>
                    <span className={styles.controlLabel}>{t("courses.sortBy")}</span>
                    <div className={styles.controlButtons}>
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`${styles.controlButton} ${categorySort === option.value ? styles.controlButtonActive : ""}`}
                                onClick={() => setCategorySort(option.value)}
                            >
                                {t(option.labelKey)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.categoryList}>
                {visibleCategories.length === 0 ? (
                    <div className={styles.emptyState}>{t("courses.noCategories")}</div>
                ) : null}
                {visibleCategories.map((categoryData) => {
                    const isExpanded = expandedCategories.includes(categoryData.category);
                    const totalCourses = categoryData.courses.length;
                    const enrolledInCategory = categoryData.courses.filter((course) =>
                        enrolledSet.has(course.id)
                    ).length;
                    const completedCourses = categoryData.courses.filter(
                        (course) => enrolledSet.has(course.id) && (progressMap.get(course.id) || 0) >= 100
                    ).length;

                    return (
                        <div key={categoryData.id} className={styles.categoryCard}>
                            <button
                                onClick={() => toggleCategory(categoryData.category)}
                                className={styles.categoryButton}
                            >
                                <div className={styles.categoryInfo}>
                                    <div className={styles.categoryText}>
                                        <h2 className={styles.categoryTitle}>{categoryData.category}</h2>
                                        <p className={styles.categoryMeta}>
                                            {categoryData.language} • {t("courses.coursesCount", { count: totalCourses })}
                                            {enrolledInCategory > 0 && ` • ${t("courses.enrolledCount", { count: enrolledInCategory })}`}
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.categoryActions}>
                                    {completedCourses > 0 && (
                                        <span className={styles.completedBadge}>
                                            {t("courses.completedCount", { count: completedCourses })}
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
                                                                {course.description || t("courses.noDescription")}
                                                            </p>
                                                            <div className={styles.courseMeta}>
                                                                <span>{t("courses.modulesCount", { count: moduleCount })}</span>
                                                                <span>•</span>
                                                                <span>{course.level}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={styles.courseFooter}>
                                                        {isEnrolled ? (
                                                            <>
                                                                <div className={styles.progressTrack}>
                                                                    <div
                                                                        className={styles.progressFill}
                                                                        style={{ width: `${progress}%` }}
                                                                    ></div>
                                                                </div>
                                                            <p className={styles.courseProgressText}>
                                                                {t("courses.percentComplete", { percent: Math.round(progress) })}
                                                            </p>
                                                            <Link
                                                                to={`/app/courses/${course.id}`}
                                                                className={styles.openCourseButton}
                                                            >
                                                                {isCompleted ? t("courses.viewModules") : t("courses.continueLearning")}
                                                            </Link>
                                                        </>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className={styles.enrollButton}
                                                            disabled={isEnrolling}
                                                            onClick={() => handleEnroll(course.id)}
                                                        >
                                                            {isEnrolling ? t("courses.enrolling") : t("courses.enroll")}
                                                        </button>
                                                    )}
                                                    </div>
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
