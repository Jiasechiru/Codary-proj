import { useState } from "react";
import { Link } from "react-router";
import chevronleft from "../../assets/Icons/chevronleft.svg"
import light from "../../assets/Icons/light.svg"
import plain from "../../assets/Icons/plain.svg"
import aistar from "../../assets/Icons/aistar.svg"
import styles from "./TaskPage.module.css";

const TaskPage = () => {
    const [code, setCode] = useState(`function filterEvenNumbers(arr) {
  // Your code here

}`);
    const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm here to help you with this task. Feel free to ask questions!" },
    ]);
    const [input, setInput] = useState("");

    const handleRun = () => {
        const hasFilter = code.includes("filter");
        if (hasFilter && code.includes("return")) {
            setResult({
                type: "success",
                message: "Great job! Your solution works correctly. All test cases passed!",
            });
        } else {
            setResult({
                type: "error",
                message: "Not quite right. Make sure you're using the filter method and returning the result.",
            });
        }
    };

    const handleHint = () => {
        setMessages([
            ...messages,
            { role: "user", content: "Give a hint" },
            {
                role: "assistant",
                content: "Try using the filter() method with a callback function that checks if a number is even using the modulo operator (%).",
            },
        ]);
    };

    const handleSendMessage = () => {
        if (!input.trim()) return;
        setMessages([
            ...messages,
            { role: "user", content: input },
            {
                role: "assistant",
                content: "That's a great question! The filter method creates a new array with elements that pass a test. You provide a function that returns true or false for each element.",
            },
        ]);
        setInput("");
    };

    const quickActions = [
        "Explain the task",
        "Give a hint",
        "Find an error",
        "Show example",
    ];

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link to="/app/courses" className={styles.backLink}>
                    <img src={chevronleft} className={styles.smallIcon} />
                    Back to Courses
                </Link>
            </div>

            <div className={styles.titleBlock}>
                <h1 className={styles.title}>Filter Even Numbers</h1>
                <p className={styles.subtitle}>
                    Write a function that takes an array of numbers and returns a new array containing only the even numbers.
                </p>
            </div>

            <div className={styles.requirementsCard}>
                <h3 className={styles.requirementsTitle}>Requirements:</h3>
                <ul className={styles.requirementsList}>
                    <li>Use the <code className={styles.inlineCode}>filter()</code> method</li>
                    <li>Return a new array with only even numbers</li>
                    <li>Do not modify the original array</li>
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
                                    <img src={light} className={styles.smallIcon} />
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
                            <div className={styles.testCase}>
                                <span className={styles.testLabel}>Input:</span> [1, 2, 3, 4, 5, 6]
                                <br />
                                <span className={styles.testLabel}>Expected:</span> [2, 4, 6]
                            </div>
                            <div className={styles.testCase}>
                                <span className={styles.testLabel}>Input:</span> [10, 15, 20, 25]
                                <br />
                                <span className={styles.testLabel}>Expected:</span> [10, 20]
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.assistantPanel}>
                    <div className={styles.assistantHeader}>
                        <img src={aistar} className={styles.assistantIcon} />
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
                                    onClick={() => {
                                        setMessages([
                                            ...messages,
                                            { role: "user", content: action },
                                            {
                                                role: "assistant",
                                                content: `Here's help with "${action}". The filter method is perfect for selecting specific elements from an array based on a condition.`,
                                            },
                                        ]);
                                    }}
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
                                <img src={plain} className={styles.smallIcon} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskPage;