import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Chevronleft from "../../assets/Icons/chevronleft.svg?react"
import Light from "../../assets/Icons/light.svg?react"
import Plain from "../../assets/Icons/plain.svg?react"
import Aistar from "../../assets/Icons/aistar.svg?react"
import { sendTaskMessage } from "../../services/ai";
import { getTask, submitTask, type Task } from "../../services/tasks";
import PageState from "../../components/PageState/PageState";
import styles from "./TaskPage.module.css";

const TaskPage = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [code, setCode] = useState("");
    const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm here to help you with this task. Feel free to ask questions!" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTask = async () => {
            if (!taskId) return;
            try {
                const data = await getTask(Number(taskId));
                setTask(data);
                setCode(data.starterCode);
            } finally {
                setIsLoading(false);
            }
        };

        loadTask();
    }, [taskId]);

    const handleRun = async () => {
        if (!task) return;
        try {
            const response = await submitTask(task.id, code);
            setResult({
                type: response.isCorrect ? "success" : "error",
                message: response.isCorrect
                    ? "Great job! Your solution works correctly. All test cases passed!"
                    : "Not quite right. Check the test cases and try again.",
            });
        } catch (_error) {
            setResult({ type: "error", message: "Failed to submit solution." });
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

    if (!task) {
        return <PageState kind="empty" title="Task not found." description="Try opening another task from courses." />;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link to="/app/courses" className={styles.backLink}>
                    <Chevronleft className={styles.smallIcon} />
                    Back to Courses
                </Link>
            </div>

            <div className={styles.titleBlock}>
                <h1 className={styles.title}>{task.title}</h1>
                <p className={styles.subtitle}>
                    {task.description}
                </p>
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
                                >
                                    <Light className={styles.smallIcon} />
                                    Get Hint
                                </button>
                                <button
                                    onClick={handleRun}
                                    className={styles.runButton}
                                >
                                    Run Code
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={styles.editor}
                            spellCheck={false}
                        />
                    </div>

                    {result && (
                        <div
                            className={`${styles.resultCard} ${result.type === "success" ? styles.resultSuccess : styles.resultError}`}
                        >
                            <p className={styles.resultTitle}>{result.type === "success" ? "Success!" : "Error"}</p>
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