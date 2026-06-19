import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Chevronleft from "../../assets/Icons/chevronleft.svg?react"
import Light from "../../assets/Icons/light.svg?react"
import Plain from "../../assets/Icons/plain.svg?react"
import Aistar from "../../assets/Icons/aistar.svg?react"
import Correct from "../../assets/Icons/correct.svg?react"
import Incorrect from "../../assets/Icons/incorrect.svg?react"
import { sendTaskMessage } from "../../services/ai";
import {
    getAttemptResultMessage,
    getTask,
    submitTask,
    waitForAttemptResult,
    type Task,
} from "../../services/tasks";
import { getProgressOverview } from "../../services/progress";
import { getModule } from "../../services/modules";
import PageState from "../../components/PageState/PageState";
import styles from "./TaskPage.module.css";

type ResultState = {
    type: "success" | "error" | "pending";
    message: string;
} | null;

const TaskPage = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [code, setCode] = useState("");
    const [result, setResult] = useState<ResultState>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm here to help you with this task. Feel free to ask questions!" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [courseId, setCourseId] = useState<number | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    const courseLink = courseId ? `/app/courses/${courseId}` : "/app/courses";

    useEffect(() => {
        const loadTask = async () => {
            if (!taskId) return;
            try {
                const [data, overview] = await Promise.all([
                    getTask(Number(taskId)),
                    getProgressOverview(),
                ]);
                const module = await getModule(data.moduleId);
                setTask(data);
                setCode(data.starterCode);
                setCourseId(module?.courseId ?? null);
                setIsCompleted(
                    overview.tasks.some((item) => item.taskId === data.id && item.isCompleted)
                );
            } catch (error) {
                setLoadError(error instanceof Error ? error.message : "Failed to load task.");
            } finally {
                setIsLoading(false);
            }
        };

        loadTask();
    }, [taskId]);

    const handleRun = async () => {
        if (!task || isSubmitting) return;

        setIsSubmitting(true);
        setResult({ type: "pending", message: "Checking your solution..." });

        try {
            const submitResponse = await submitTask(task.id, code);
            const attemptStatus = await waitForAttemptResult(submitResponse.attemptId);
            const uiResult = getAttemptResultMessage(attemptStatus);

            setResult(uiResult);

            if (attemptStatus.isCorrect) {
                setIsCompleted(true);
            }
        } catch (error) {
            setResult({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to submit solution.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const sendTaskChat = async (message: string) => {
        if (!task) return;
        setMessages((prev) => [...prev, { role: "user", content: message }]);
        const response = await sendTaskMessage(task.id, message);
        setMessages((prev) => [...prev, { role: "assistant", content: response.response }]);
    };

    const handleHint = async () => {
        await sendTaskChat("Give a hint");
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        await sendTaskChat(input);
        setInput("");
    };

    const quickActions = [
        "Explain the task",
        "Give a hint",
        "Find an error",
        "Show example",
    ];

    if (isLoading) {
        return <PageState kind="loading" title="Loading task..." />;
    }

    if (loadError) {
        return (
            <PageState
                kind="error"
                title="Unable to open task."
                description={loadError}
            />
        );
    }

    if (!task) {
        return <PageState kind="empty" title="Task not found." description="Try opening another task from courses." />;
    }

    if (result?.type === "success" && isCompleted) {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <Link to={courseLink} className={styles.backLink}>
                        <Chevronleft className={styles.smallIcon} />
                        Back to Course
                    </Link>
                </div>

                <div className={`${styles.completionCard} ${styles.centered}`}>
                    <div className={`${styles.completionIconWrap} ${styles.resultSuccess}`}>
                        <Correct className={styles.completionIcon} />
                    </div>
                    <h1 className={styles.title}>Task Completed!</h1>
                    <p className={styles.subtitle}>{result.message}</p>
                    <p className={styles.completionMeta}>Your progress has been saved.</p>
                    <Link to={courseLink} className={styles.completionButton}>
                        Back to Course
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link to={courseLink} className={styles.backLink}>
                    <Chevronleft className={styles.smallIcon} />
                    Back to Course
                </Link>
            </div>

            <div className={styles.titleBlock}>
                <h1 className={styles.title}>{task.title}</h1>
                <p className={styles.subtitle}>
                    {task.description}
                </p>
                {isCompleted ? (
                    <span className={styles.completedBadge}>Completed</span>
                ) : null}
            </div>

            <div className={styles.requirementsCard}>
                <h3 className={styles.requirementsTitle}>Requirements:</h3>
                <ul className={styles.requirementsList}>
                    <li>Write a correct solution for this task</li>
                    <li>Run code to check correctness</li>
                    <li>Use AI assistant for hints when needed</li>
                </ul>
            </div>

            <div className={styles.layout}>
                <div className={styles.mainColumn}>
                    <div className={styles.editorCard}>
                        <div className={styles.editorToolbar}>
                            <span className={styles.fileName}>code.js</span>
                            <div className={styles.toolbarActions}>
                                <button
                                    onClick={handleHint}
                                    className={styles.hintButton}
                                    disabled={isSubmitting}
                                >
                                    <Light className={styles.smallIcon} />
                                    Get Hint
                                </button>
                                <button
                                    onClick={handleRun}
                                    className={styles.runButton}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Checking..." : "Run Code"}
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={styles.editor}
                            spellCheck={false}
                            disabled={isSubmitting}
                        />
                    </div>

                    {result && (
                        <div
                            className={`${styles.resultCard} ${
                                result.type === "success"
                                    ? styles.resultSuccess
                                    : result.type === "pending"
                                      ? styles.resultPending
                                      : styles.resultError
                            }`}
                        >
                            <div className={styles.resultHeader}>
                                {result.type === "success" ? (
                                    <Correct className={styles.resultIcon} />
                                ) : result.type === "error" ? (
                                    <Incorrect className={styles.resultIcon} />
                                ) : null}
                                <p className={styles.resultTitle}>
                                    {result.type === "success"
                                        ? "Success!"
                                        : result.type === "pending"
                                          ? "Checking"
                                          : "Error"}
                                </p>
                            </div>
                            <p className={styles.resultText}>{result.message}</p>
                        </div>
                    )}

                    <div className={styles.testCard}>
                        <h3 className={styles.requirementsTitle}>Test Cases</h3>
                        <div className={styles.testCases}>
                            {task.codeTests.map((test) => (
                                <div key={test.id} className={styles.testCase}>
                                    <span className={styles.testLabel}>Input:</span> {test.input}
                                    <br />
                                    <span className={styles.testLabel}>Expected:</span> {test.expectedOutput}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.assistantPanel}>
                    <div className={styles.assistantHeader}>
                        <Aistar className={styles.assistantIcon} />
                        <h3 className={styles.requirementsTitle}>AI Assistant</h3>
                    </div>

                    <div className={styles.assistantMessages}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`${styles.messageRow} ${msg.role === "user" ? styles.messageRight : styles.messageLeft}`}
                            >
                                <div
                                    className={`${styles.messageBubble} ${msg.role === "user" ? styles.userBubble : styles.assistantBubble}`}
                                >
                                    <p className={styles.messageText}>{msg.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.assistantFooter}>
                        <div className={styles.quickActions}>
                            {quickActions.map((action) => (
                                <button
                                    key={action}
                                    onClick={async () => sendTaskChat(action)}
                                    className={styles.quickActionButton}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>

                        <div className={styles.inputRow}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Ask a question..."
                                className={styles.input}
                            />
                            <button
                                onClick={handleSendMessage}
                                className={styles.sendButton}
                            >
                                <Plain className={styles.smallIcon} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskPage;
