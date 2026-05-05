import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import chevronleft from "../../assets/Icons/chevronleft.svg"
import correct from "../../assets/Icons/correct.svg"
import incorrect from "../../assets/Icons/incorrect.svg"
import styles from "./QuizPage.module.css";

const quizQuestions = [
    {
        id: 1,
        question: "What does the map() method return?",
        options: [
            "The original array modified",
            "A new array with transformed elements",
            "A single value",
            "undefined",
        ],
        correctAnswer: 1,
        explanation: "The map() method creates and returns a new array by applying a function to each element of the original array.",
    },
    {
        id: 2,
        question: "Which method would you use to create an array containing only even numbers?",
        options: [
            "map()",
            "reduce()",
            "filter()",
            "forEach()",
        ],
        correctAnswer: 2,
        explanation: "The filter() method creates a new array with elements that pass a test function, making it perfect for selecting specific elements.",
    },
    {
        id: 3,
        question: "What is the purpose of the reduce() method?",
        options: [
            "To remove elements from an array",
            "To reduce the size of an array",
            "To reduce an array to a single value",
            "To filter unwanted elements",
        ],
        correctAnswer: 2,
        explanation: "The reduce() method executes a reducer function on each element, resulting in a single output value.",
    },
    {
        id: 4,
        question: "Do array methods like map() and filter() modify the original array?",
        options: [
            "Yes, they always modify the original",
            "No, they create new arrays",
            "Sometimes, depending on the callback",
            "Only map() modifies the original",
        ],
        correctAnswer: 1,
        explanation: "Array methods like map(), filter(), and reduce() are immutable operations that create new arrays without modifying the original.",
    },
    {
        id: 5,
        question: "Can you chain multiple array methods together?",
        options: [
            "No, you can only use one method at a time",
            "Yes, because each method returns an array",
            "Only if you use map() first",
            "Only with filter() and reduce()",
        ],
        correctAnswer: 1,
        explanation: "Since these methods return new arrays, you can chain them together like: arr.filter().map().reduce().",
    },
];

const QuizPage = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleSelectAnswer = (answerIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = answerIndex;
        setSelectedAnswers(newAnswers);
        setShowExplanation(false);
    };

    const handleNext = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setShowExplanation(false);
        } else {
            setShowResults(true);
        }
    };

    const handleCheckAnswer = () => {
        setShowExplanation(true);
    };

    const calculateScore = () => {
        let correct = 0;
        quizQuestions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correct++;
            }
        });
        return correct;
    };

    const handleRetake = () => {
        setCurrentQuestion(0);
        setSelectedAnswers([]);
        setShowResults(false);
        setShowExplanation(false);
    };

    if (showResults) {
        const score = calculateScore();
        const percentage = (score / quizQuestions.length) * 100;
        const passed = percentage >= 70;

        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <Link to="/app/courses" className={styles.backLink}>
                        <img src={chevronleft} className={styles.smallIcon} />
                        Back to Courses
                    </Link>
                </div>

                <div className={`${styles.card} ${styles.centered}`}>
                    <div className={`${styles.resultIconWrap} ${passed ? styles.resultSuccess : styles.resultWarning}`}>
                        {passed ? (
                            <img src={correct} className={styles.resultIcon} />
                        ) : (
                            <img src={incorrect} className={styles.resultIcon} />
                        )}
                    </div>

                    <h1 className={styles.title}>Quiz Complete!</h1>
                    <p className={styles.subtitle}>
                        {passed
                            ? "Great job! You've passed the quiz."
                            : "You need 70% to pass. Review the material and try again."}
                    </p>

                    <div className={styles.scoreBlock}>
                        <div className={styles.scoreValue}>{percentage.toFixed(0)}%</div>
                        <p className={styles.subtitle}>
                            {score} out of {quizQuestions.length} correct
                        </p>
                    </div>

                    <div className={styles.reviewBox}>
                        <h3 className={styles.reviewTitle}>Review Your Answers</h3>
                        <div className={styles.answerList}>
                            {quizQuestions.map((question, index) => {
                                const isCorrect = selectedAnswers[index] === question.correctAnswer;
                                return (
                                    <div key={question.id} className={styles.answerRow}>
                                        <span>Question {index + 1}</span>
                                        {isCorrect ? (
                                            <span className={`${styles.answerStatus} ${styles.successText}`}>
                                                <img src={correct} className={styles.smallIcon} />
                                                Correct
                                            </span>
                                        ) : (
                                            <span className={`${styles.answerStatus} ${styles.destructiveText}`}>
                                                <img src={incorrect} className={styles.smallIcon} />
                                                Incorrect
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
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
                                to={`/app/task/${topicId || 'arrays'}`}
                                className={styles.primaryLink}
                            >
                                Continue to Practice
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const question = quizQuestions[currentQuestion];
    const selectedAnswer = selectedAnswers[currentQuestion];
    const isAnswered = selectedAnswer !== undefined;
    const isCorrect = selectedAnswer === question.correctAnswer;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link to="/app/courses" className={styles.backLink}>
                    <img src={chevronleft} className={styles.smallIcon} />
                    Back to Courses
                </Link>
                <div className={styles.headerRow}>
                    <h1 className={styles.quizTitle}>Array Methods Quiz</h1>
                    <span className={styles.progressText}>
                        Question {currentQuestion + 1} of {quizQuestions.length}
                    </span>
                </div>
            </div>

            <div className={styles.progressBarWrap}>
                <div className={styles.progressTrack}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className={styles.card}>
                <h2 className={styles.questionTitle}>{question.question}</h2>

                <div className={styles.answerList}>
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrectOption = index === question.correctAnswer;
                        const showCorrectAnswer = showExplanation && isCorrectOption;
                        const showWrongAnswer = showExplanation && isSelected && !isCorrect;

                        return (
                            <button
                                key={index}
                                onClick={() => !showExplanation && handleSelectAnswer(index)}
                                disabled={showExplanation}
                                className={`${styles.answerButton} ${showCorrectAnswer
                                    ? styles.answerCorrect
                                    : showWrongAnswer
                                        ? styles.answerWrong
                                        : isSelected
                                            ? styles.answerSelected
                                            : styles.answerDefault
                                    } ${showExplanation ? styles.notAllowed : styles.pointer}`}
                            >
                                <div className={styles.answerRow}>
                                    <span>{option}</span>
                                    {showCorrectAnswer && <img src={correct} className={styles.answerIcon} />}
                                    {showWrongAnswer && <img src={incorrect} className={styles.answerIcon} />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {showExplanation && (
                    <div className={`${styles.explanationBox} ${isCorrect ? styles.explanationSuccess : styles.explanationWarning}`}>
                        <p className={styles.explanationTitle}>
                            {isCorrect ? (
                                <>
                                    <img src={correct} className={styles.answerIcon} />
                                    <span className={styles.successText}>Correct!</span>
                                </>
                            ) : (
                                <>
                                    <img src={incorrect} className={styles.answerIcon} />
                                    <span className={styles.warningText}>Not quite</span>
                                </>
                            )}
                        </p>
                        <p className={styles.explanationText}>{question.explanation}</p>
                    </div>
                )}
            </div>

            <div className={styles.actionsRight}>
                {!showExplanation && isAnswered && (
                    <button
                        onClick={handleCheckAnswer}
                        className={styles.secondaryButton}
                    >
                        Check Answer
                    </button>
                )}
                {showExplanation && (
                    <button
                        onClick={handleNext}
                        className={styles.primaryButton}
                    >
                        {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "View Results"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default QuizPage;