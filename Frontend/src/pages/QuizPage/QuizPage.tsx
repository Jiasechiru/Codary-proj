import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Chevronleft from "../../assets/Icons/chevronleft.svg?react"
import Correct from "../../assets/Icons/correct.svg?react"
import Incorrect from "../../assets/Icons/incorrect.svg?react"
import { getQuiz, submitQuiz, type Quiz } from "../../services/quizzes";
import { getModule } from "../../services/modules";
import PageState from "../../components/PageState/PageState";
import styles from "./QuizPage.module.css";

const QuizPage = () => {
    const { topicId } = useParams();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [courseId, setCourseId] = useState<number | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [showResults, setShowResults] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const courseLink = courseId ? `/app/courses/${courseId}` : "/app/courses";

    useEffect(() => {
        const loadQuiz = async () => {
            if (!topicId) return;
            try {
                const data = await getQuiz(Number(topicId));
                setQuiz(data);
                const module = await getModule(data.moduleId);
                setCourseId(module?.courseId ?? null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load quiz.");
            } finally {
                setIsLoading(false);
            }
        };

        loadQuiz();
    }, [topicId]);

    const handleCheckAnswer = async () => {
        if (!quiz || !selectedAnswer) return;
        setIsSubmitting(true);
        try {
            const result = await submitQuiz(quiz.id, selectedAnswer);
            setIsCorrect(result.isCorrect);
            setShowResults(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetake = () => {
        setSelectedAnswer("");
        setShowResults(false);
    };

    if (isLoading) {
        return <PageState kind="loading" title="Loading quiz..." />;
    }

    if (error) {
        return (
            <PageState
                kind="error"
                title="Unable to open quiz."
                description={error}
            />
        );
    }

    if (!quiz) {
        return <PageState kind="empty" title="Quiz not found." description="This module may not have a quiz yet." />;
    }

    if (showResults) {
        const passed = isCorrect;

        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <Link to={courseLink} className={styles.backLink}>
                        <Chevronleft className={styles.smallIcon} />
                        Back to Course
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

                    <h1 className={styles.title}>Quiz Complete!</h1>
                    <p className={styles.subtitle}>
                        {passed
                            ? "Great job! Your answer is correct."
                            : "Incorrect answer. Review the theory and try again."}
                    </p>

                    <div className={styles.scoreBlock}>
                        <div className={styles.scoreValue}>{passed ? "100%" : "0%"}</div>
                        <p className={styles.subtitle}>
                            {passed ? "1 out of 1 correct" : "0 out of 1 correct"}
                        </p>
                    </div>

                    <div className={styles.reviewBox}>
                        <h3 className={styles.reviewTitle}>Review Your Answers</h3>
                        <div className={styles.answerList}>
                            <div className={styles.answerRow}>
                                <span>Question 1</span>
                                {isCorrect ? (
                                    <span className={`${styles.answerStatus} ${styles.successText}`}>
                                        <Correct className={styles.smallIcon} />
                                        Correct
                                    </span>
                                ) : (
                                    <span className={`${styles.answerStatus} ${styles.destructiveText}`}>
                                        <Incorrect className={styles.smallIcon} />
                                        Incorrect
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.actionsCentered}>
                        <button
                            onClick={handleRetake}
                            className={styles.secondaryButton}
                        >
                            Retake Quiz
                        </button>
                        {passed && (
                            <Link
                                to={courseLink}
                                className={styles.primaryLink}
                            >
                                Continue Learning
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const isAnswered = selectedAnswer !== "";

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link to={courseLink} className={styles.backLink}>
                    <Chevronleft className={styles.smallIcon} />
                    Back to Course
                </Link>
                <div className={styles.headerRow}>
                    <h1 className={styles.quizTitle}>Quiz</h1>
                    <span className={styles.progressText}>
                        Question 1 of 1
                    </span>
                </div>
            </div>

            <div className={styles.progressBarWrap}>
                <div className={styles.progressTrack}>
                    <div
                        className={styles.progressFill}
                        style={{ width: "100%" }}
                    ></div>
                </div>
            </div>

            <div className={styles.card}>
                <h2 className={styles.questionTitle}>{quiz.question}</h2>

                <div className={styles.answerList}>
                    {quiz.answerVariants.map((option) => {
                        const isSelected = selectedAnswer === option;
                        return (
                            <button
                                key={option}
                                onClick={() => setSelectedAnswer(option)}
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

            <div className={styles.actionsRight}>
                <button
                    onClick={handleCheckAnswer}
                    disabled={!isAnswered || isSubmitting}
                    className={styles.secondaryButton}
                >
                    {isSubmitting ? "Checking..." : "Check Answer"}
                </button>
            </div>
        </div>
    );
}

export default QuizPage;
