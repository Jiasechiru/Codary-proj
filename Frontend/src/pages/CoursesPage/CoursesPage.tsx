import { Link } from "react-router";
import { useState } from "react";
import chevronup from "../../assets/Icons/chevronup.svg"
import chevrondown from "../../assets/Icons/chevrondown.svg"
import lock from "../../assets/Icons/lock.svg"
import styles from "./CoursesPage.module.css";

const coursesByCategory = [
    {
        category: "JavaScript",
        language: "JavaScript",
        icon: "🟨",
        courses: [
            {
                id: "javascript-basics",
                title: "JavaScript Basics",
                description: "Learn the fundamentals of JavaScript programming",
                progress: 80,
                topics: 12,
                completed: 10,
                locked: false,
            },
            {
                id: "javascript-intermediate",
                title: "JavaScript Intermediate",
                description: "Arrays, objects, and advanced concepts",
                progress: 45,
                topics: 15,
                completed: 7,
                locked: false,
            },
            {
                id: "javascript-advanced",
                title: "Advanced JavaScript",
                description: "Async programming, closures, and design patterns",
                progress: 0,
                topics: 18,
                completed: 0,
                locked: false,
            },
        ],
    },
    {
        category: "TypeScript",
        language: "TypeScript",
        icon: "🔷",
        courses: [
            {
                id: "typescript",
                title: "TypeScript Fundamentals",
                description: "Type-safe JavaScript for better code quality",
                progress: 0,
                topics: 12,
                completed: 0,
                locked: false,
            },
            {
                id: "typescript-advanced",
                title: "Advanced TypeScript",
                description: "Generics, utility types, and type manipulation",
                progress: 0,
                topics: 14,
                completed: 0,
                locked: true,
            },
        ],
    },
    {
        category: "React",
        language: "React",
        icon: "⚛️",
        courses: [
            {
                id: "react-basics",
                title: "React Basics",
                description: "Introduction to React and component-based development",
                progress: 30,
                topics: 10,
                completed: 3,
                locked: false,
            },
            {
                id: "react-hooks",
                title: "React Hooks",
                description: "useState, useEffect, and custom hooks",
                progress: 0,
                topics: 12,
                completed: 0,
                locked: false,
            },
            {
                id: "advanced-react",
                title: "Advanced React",
                description: "Context, performance optimization, and patterns",
                progress: 0,
                topics: 14,
                completed: 0,
                locked: true,
            },
        ],
    },
    {
        category: "Backend Development",
        language: "Node.js",
        icon: "🟢",
        courses: [
            {
                id: "nodejs",
                title: "Node.js Fundamentals",
                description: "Server-side JavaScript with Node.js",
                progress: 0,
                topics: 16,
                completed: 0,
                locked: true,
            },
            {
                id: "express",
                title: "Express.js",
                description: "Building REST APIs with Express",
                progress: 0,
                topics: 14,
                completed: 0,
                locked: true,
            },
        ],
    },
    {
        category: "Python",
        language: "Python",
        icon: "🐍",
        courses: [
            {
                id: "python-basics",
                title: "Python Basics",
                description: "Learn Python programming fundamentals",
                progress: 0,
                topics: 15,
                completed: 0,
                locked: true,
            },
            {
                id: "python-data",
                title: "Python for Data Science",
                description: "NumPy, Pandas, and data analysis",
                progress: 0,
                topics: 18,
                completed: 0,
                locked: true,
            },
        ],
    },
];

const CoursesPage = () => {
    const [expandedCategories, setExpandedCategories] = useState<string[]>(["JavaScript", "React"]);

    const toggleCategory = (category: string) => {
        setExpandedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

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
                    const completedCourses = categoryData.courses.filter((c) => c.progress === 100).length;
                    const inProgressCourses = categoryData.courses.filter(
                        (c) => c.progress > 0 && c.progress < 100
                    ).length;

                    return (
                        <div key={categoryData.category} className={styles.categoryCard}>
                            <button
                                onClick={() => toggleCategory(categoryData.category)}
                                className={styles.categoryButton}
                            >
                                <div className={styles.categoryInfo}>
                                    <span className={styles.categoryEmoji}>{categoryData.icon}</span>
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
                                        <img src={chevronup} className={styles.chevronIcon} />
                                    ) : (
                                        <img src={chevrondown} className={styles.chevronIcon} />
                                    )}
                                </div>
                            </button>

                            {isExpanded && (
                                <div className={styles.expandedContent}>
                                    <div className={styles.coursesGrid}>
                                        {categoryData.courses.map((course) => (
                                            <div
                                                key={course.id}
                                                className={`${styles.courseCard} ${course.locked ? styles.courseLocked : ""}`}
                                            >
                                                <div className={styles.courseHeader}>
                                                    <div className={styles.courseInfo}>
                                                        <h3 className={styles.courseTitle}>{course.title}</h3>
                                                        <p className={styles.courseDescription}>{course.description}</p>
                                                        <div className={styles.courseMeta}>
                                                            <span>{course.topics} topics</span>
                                                            <span>•</span>
                                                            <span>
                                                                {course.completed}/{course.topics} completed
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {course.locked && (
                                                        <div className={styles.lockBadge}>
                                                            <img src={lock} className={styles.lockIcon} />
                                                        </div>
                                                    )}
                                                </div>

                                                {!course.locked && (
                                                    <>
                                                        <div className={styles.progressTrack}>
                                                            <div
                                                                className={styles.progressFill}
                                                                style={{ width: `${course.progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className={styles.linkRow}>
                                                            <Link
                                                                to={`/app/theory/${course.id}`}
                                                                className={`${styles.courseLink} ${styles.theoryLink}`}
                                                            >
                                                                Theory
                                                            </Link>
                                                            <Link
                                                                to={`/app/quiz/${course.id}`}
                                                                className={`${styles.courseLink} ${styles.quizLink}`}
                                                            >
                                                                Quiz
                                                            </Link>
                                                            <Link
                                                                to={`/app/task/${course.id}`}
                                                                className={`${styles.courseLink} ${styles.practiceLink}`}
                                                            >
                                                                Practice
                                                            </Link>
                                                        </div>
                                                    </>
                                                )}

                                                {course.locked && (
                                                    <div className={styles.lockedHint}>
                                                        Complete previous courses to unlock
                                                    </div>
                                                )}
                                            </div>
                                        ))}
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
