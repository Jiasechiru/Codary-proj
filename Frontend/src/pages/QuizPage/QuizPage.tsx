import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Chevronleft from "../../assets/Icons/chevronleft.svg?react"
import Correct from "../../assets/Icons/correct.svg?react"
import Incorrect from "../../assets/Icons/incorrect.svg?react"
import {
    getModuleQuiz,
    submitModuleQuiz,
    type ModuleQuiz,
    type ModuleQuizResult,
} from "../../services/quizzes";
import { getModule } from "../../services/modules";
import { useLanguage } from "../../lib/LanguageContext";
import PageState from "../../components/PageState/PageState";
import styles from "./QuizPage.module.css";

const QuizPage = () => {
    const { t, language } = useLanguage();
    const { topicId } = useParams();
    const [quiz, setQuiz] = useState<ModuleQuiz | null>(null);
    const [courseId, setCourseId] = useState<number | null>(null);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [result, setResult] = useState<ModuleQuizResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const courseLink = courseId ? `/app/courses/${courseId}` : "/app/courses";

    useEffect(() => {
        const loadQuiz = async () => {
            if (!topicId) return;
            try {
                const moduleId = Number(topicId);
                const [data, module] = await Promise.all([
                    getModuleQuiz(moduleId),
                    getModule(moduleId),
                ]);
                setQuiz(data);
                setCourseId(module?.courseId ?? null);
            } catch (err) {
                setError(err instanceof Error ? err.message : t("quiz.loadFailed"));
            } finally {
                setIsLoading(false);
            }
        };

        loadQuiz();
    }, [topicId, t]);

    const selectAnswer = (quizId: number, option: string) => {
        setAnswers((prev) => ({ ...prev, [quizId]: option }));
    };

    const handleSubmit = async () => {
        if (!quiz) return;
        setIsSubmitting(true);
        try {
            const payload = quiz.questions.map((q) => ({
                quizId: q.id,
                answer: answers[q.id] ?? "",
            }));
            const res = await submitModuleQuiz(quiz.moduleId, payload);
            setResult(res);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetake = () => {
        setAnswers({});
        setResult(null);
    };

    if (isLoading) {
        return <PageState kind="loading" title={t("quiz.loading")} />;
    }

    if (error) {
        return (
            <PageState
                kind="error"
                title={t("quiz.unableToOpen")}
                description={error}
            />
        );
    }

    if (!quiz || quiz.questions.length === 0) {
        return <PageState kind="empty" title={t("quiz.notFound")} description={t("quiz.notFoundDesc")} />;
    }

    if (result) {
        const passed = result.passed;
        const percent = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;

        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <Link to={courseLink} className={styles.backLink}>
                        <Chevronleft className={styles.smallIcon} />
                        {t("quiz.backToCourse")}
                    </Link>
                </div>

                <div className={`${styles.card} ${styles.centered}`}>
                    <div className={`${styles.resultIconWrap} ${passed ? styles.resultSuccess : styles.resultWarning}`}>
                        {passed ? (
                            <Correct className={styles.resultIcon} />
                        ) : (
                            <Incorrect className={styles.resultIcon} />
                        )}
                    </div>

                    <h1 className={styles.title}>
                        {passed ? t("quiz.passedTitle") : t("quiz.failedTitle")}
                    </h1>
                    <p className={styles.subtitle}>
                        {passed ? t("quiz.passMessage") : t("quiz.failMessage")}
                    </p>

                    <div className={styles.scoreBlock}>
                        <div className={styles.scoreValue}>{percent}%</div>
                        <p className={styles.subtitle}>
                            {t("quiz.scoreLine", { correct: result.correct, total: result.total })}
                        </p>
                    </div>

                    <div className={styles.actionsCentered}>
                        <button
                            onClick={handleRetake}
                            className={styles.secondaryButton}
                        >
                            {t("quiz.retake")}
                        </button>
                        {passed && (
                            <Link
                                to={courseLink}
                                className={styles.primaryLink}
                            >
                                {t("quiz.continueLearning")}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const answeredCount = quiz.questions.filter((q) => answers[q.id]).length;
    const allAnswered = answeredCount === quiz.questions.length;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link to={courseLink} className={styles.backLink}>
                    <Chevronleft className={styles.smallIcon} />
                    {t("quiz.backToCourse")}
                </Link>
                <div className={styles.headerRow}>
                    <h1 className={styles.quizTitle}>{t("quiz.title")}</h1>
                    <span className={styles.progressText}>
                        {t("quiz.answeredProgress", { answered: answeredCount, total: quiz.questions.length })}
                    </span>
                </div>
                {quiz.isCompleted ? (
                    <p className={styles.progressText}>{t("quiz.alreadyCompleted")}</p>
                ) : null}
            </div>

            <div className={styles.progressBarWrap}>
                <div className={styles.progressTrack}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {quiz.questions.map((question, index) => (
                <div key={question.id} className={styles.card}>
                    <h2 className={styles.questionTitle}>
                        {index + 1}. {language === "ru" ? question.questionRu || question.question : question.question}
                    </h2>

                    <div className={styles.answerList}>
                        {question.answerVariants.map((option) => {
                            const isSelected = answers[question.id] === option;
                            return (
                                <button
                                    key={option}
                                    onClick={() => selectAnswer(question.id, option)}
                                    className={`${styles.answerButton} ${isSelected ? styles.answerSelected : styles.answerDefault} ${styles.pointer}`}
                                >
                                    <div className={styles.answerRow}>
                                        <span>{option}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            <div className={styles.actionsRight}>
                <button
                    onClick={handleSubmit}
                    disabled={!allAnswered || isSubmitting}
                    className={styles.secondaryButton}
                >
                    {isSubmitting ? t("quiz.checking") : t("quiz.submit")}
                </button>
            </div>
        </div>
    );
}

export default QuizPage;
