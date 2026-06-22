import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import Chevronleft from "../../assets/Icons/chevronleft.svg?react"
import { getModule } from "../../services/modules";
import { useLanguage } from "../../lib/LanguageContext";
import PageState from "../../components/PageState/PageState";
import styles from "./TheoryPage.module.css";

const TheoryPage = () => {
    const { t, language } = useLanguage();
    const { topicId } = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [contentRu, setContentRu] = useState<string | null>(null);
    const [quizId, setQuizId] = useState<number | null>(null);
    const [courseId, setCourseId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const courseLink = courseId ? `/app/courses/${courseId}` : "/app/courses";

    useEffect(() => {
        const loadTheory = async () => {
            if (!topicId) return;
            try {
                const module = await getModule(Number(topicId));
                if (!module) {
                    setError(t("theory.notFound"));
                    return;
                }
                setTitle(module.title || t("theory.default"));
                setContent(module.theory?.content || t("theory.noContent"));
                setContentRu(module.theory?.contentRu ?? null);
                setQuizId(module.quizzes[0]?.id || null);
                setCourseId(module.courseId);
            } catch (err) {
                setError(err instanceof Error ? err.message : t("theory.loadFailed"));
            } finally {
                setIsLoading(false);
            }
        };

        loadTheory();
    }, [topicId, t]);

    if (isLoading) {
        return <PageState kind="loading" title={t("theory.loading")} />;
    }

    if (error) {
        return (
            <PageState
                kind="error"
                title={t("theory.unableToOpen")}
                description={error}
            />
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link to={courseLink} className={styles.backLink}>
                    <Chevronleft className={styles.smallIcon} />
                    {t("theory.backToCourse")}
                </Link>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>{t("theory.subtitle")}</p>
            </div>

            <div className={styles.contentCard}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t("theory.content")}</h2>
                    <div className={styles.prose}>{language === "ru" ? contentRu || content : content}</div>
                </section>
            </div>

            <div className={styles.footerActions}>
                <Link to={courseLink} className={styles.secondaryButton}>
                    <Chevronleft className={styles.smallIcon} />
                    {t("theory.backToModules")}
                </Link>
                {quizId ? <Link
                    to={`/app/quiz/${topicId}`}
                    className={styles.primaryButton}
                >
                    {t("theory.takeQuiz")}
                </Link> : <span className={styles.primaryButton}>{t("theory.quizUnavailable")}</span>}
            </div>
        </div>
    );
}

export default TheoryPage;
