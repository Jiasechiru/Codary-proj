import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import Chevronleft from "../../assets/Icons/chevronleft.svg?react"
import Chevronright from "../../assets/Icons/chevronright.svg?react"
import { getModule } from "../../services/modules";
import PageState from "../../components/PageState/PageState";
import styles from "./TheoryPage.module.css";

const TheoryPage = () => {
    const { topicId } = useParams();
    const [title, setTitle] = useState("Theory");
    const [content, setContent] = useState("Loading...");
    const [quizId, setQuizId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTheory = async () => {
            if (!topicId) return;
            try {
                const module = await getModule(Number(topicId));
                setTitle(module?.title || "Theory");
                setContent(module?.theory?.content || "Theory content is not available for this module yet.");
                setQuizId(module?.quizzes[0]?.id || null);
            } finally {
                setIsLoading(false);
            }
        };

        loadTheory();
    }, [topicId]);

    if (isLoading) {
        return <PageState kind="loading" title="Loading theory..." />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link to="/app/courses" className={styles.backLink}>
                    <Chevronleft className={styles.smallIcon} />
                    Back to Courses
                </Link>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>Module theory and explanations</p>
            </div>

            <div className={styles.contentCard}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Content</h2>
                    <div className={styles.codeBlock}>
                        <pre>{content}</pre>
                    </div>
                </section>
            </div>

            <div className={styles.footerActions}>
                <button className={styles.secondaryButton}>
                    <Chevronleft className={styles.smallIcon} />
                    Previous Topic
                </button>
                {quizId ? <Link
                    to={`/app/quiz/${quizId}`}
                    className={styles.primaryButton}
                >
                    Take Quiz
                </Link> : <span className={styles.primaryButton}>Quiz unavailable</span>}
                <button className={styles.secondaryButton}>
                    Next Topic
                    <Chevronright className={styles.smallIcon} />
                </button>
            </div>
        </div>
    );
}

export default TheoryPage;