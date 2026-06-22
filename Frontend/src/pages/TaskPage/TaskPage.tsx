import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import Chevronleft from "../../assets/Icons/chevronleft.svg?react"
import Light from "../../assets/Icons/light.svg?react"
import Plain from "../../assets/Icons/plain.svg?react"
import Aistar from "../../assets/Icons/aistar.svg?react"
import Correct from "../../assets/Icons/correct.svg?react"
import Incorrect from "../../assets/Icons/incorrect.svg?react"
import {
    appendStreamingDelta,
    finalizeStreamingMessage,
    getTaskChatHistory,
    replaceStreamingWithError,
    streamTaskMessage,
    type ChatMessage,
} from "../../services/ai";
import {
    getAttemptResultMessage,
    getTask,
    submitTask,
    waitForAttemptResult,
    type Task,
} from "../../services/tasks";
import { getProgressOverview } from "../../services/progress";
import { getModule } from "../../services/modules";
import { useLanguage } from "../../lib/LanguageContext";
import PageState from "../../components/PageState/PageState";
import ChatAssistantContent from "../../components/ChatAssistantContent/ChatAssistantContent";
import CodeEditor, { detectLanguage } from "../../components/CodeEditor/CodeEditor";
import styles from "./TaskPage.module.css";

type ResultState = {
    type: "success" | "error" | "pending";
    message: string;
} | null;

const TaskPage = () => {
    const { t, language } = useLanguage();
    const { taskId } = useParams();
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [task, setTask] = useState<Task | null>(null);
    const [code, setCode] = useState("");
    const [result, setResult] = useState<ResultState>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: "assistant", content: t("task.assistantGreeting") },
    ]);
    const [input, setInput] = useState("");
    const [isChatSending, setIsChatSending] = useState(false);
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
                setLoadError(error instanceof Error ? error.message : t("task.loadFailed"));
            } finally {
                setIsLoading(false);
            }
        };

        loadTask();
    }, [taskId, t]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isChatSending]);

    useEffect(() => {
        const loadChatHistory = async () => {
            if (!taskId) return;
            try {
                const history = await getTaskChatHistory(Number(taskId));
                if (history.length > 0) {
                    setMessages(
                        history.map((item) => ({
                            id: item.id,
                            role: item.role,
                            content: item.message,
                        }))
                    );
                }
            } catch (_error) {
                // Keep greeting when history is unavailable.
            }
        };

        loadChatHistory();
    }, [taskId]);

    const handleRun = async () => {
        if (!task || isSubmitting) return;

        setIsSubmitting(true);
        setResult({ type: "pending", message: t("task.checkingSolution") });

        try {
            const submitResponse = await submitTask(task.id, code);
            const attemptStatus = await waitForAttemptResult(submitResponse.attemptId);
            const uiResult = getAttemptResultMessage(attemptStatus);

            setResult({
                type: uiResult.type,
                message: uiResult.rawMessage || t(uiResult.messageKey),
            });

            if (attemptStatus.isCorrect) {
                setIsCompleted(true);
            }
        } catch (error) {
            setResult({
                type: "error",
                message: error instanceof Error ? error.message : t("task.submitFailed"),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const sendTaskChat = async (message: string) => {
        if (!task || isChatSending) return;

        const userMessage = message.trim();
        if (!userMessage) return;

        setMessages((prev) => [
            ...prev,
            { role: "user", content: userMessage },
            { role: "assistant", content: "", isStreaming: true },
        ]);
        setIsChatSending(true);

        try {
            await streamTaskMessage(task.id, userMessage, code, {
                onDelta: (delta) => {
                    setMessages((prev) => appendStreamingDelta(prev, delta));
                },
                onDone: (message) => {
                    setMessages((prev) => finalizeStreamingMessage(prev, message));
                    setIsChatSending(false);
                },
                onError: (message) => {
                    const content =
                        message.toLowerCase().includes("disabled")
                            ? t("task.aiDisabled")
                            : t("task.aiFailed");
                    setMessages((prev) => replaceStreamingWithError(prev, content));
                    setIsChatSending(false);
                },
            });
        } catch (_error) {
            setMessages((prev) => replaceStreamingWithError(prev, t("task.aiFailed")));
            setIsChatSending(false);
        }
    };

    const handleHint = async () => {
        await sendTaskChat(t("task.actionHint"));
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isChatSending) return;
        const userMessage = input;
        setInput("");
        await sendTaskChat(userMessage);
    };

    const quickActions = [
        t("task.actionExplain"),
        t("task.actionHint"),
        t("task.actionFindError"),
        t("task.actionExample"),
    ];

    if (isLoading) {
        return <PageState kind="loading" title={t("task.loading")} />;
    }

    if (loadError) {
        return (
            <PageState
                kind="error"
                title={t("task.unableToOpen")}
                description={loadError}
            />
        );
    }

    if (!task) {
        return <PageState kind="empty" title={t("task.notFound")} description={t("task.notFoundDesc")} />;
    }

    const localizedDescription =
        language === "ru" ? task.descriptionRu || task.description : task.description;
    const localizedRequirements =
        language === "ru" && task.requirementsRu && task.requirementsRu.length > 0
            ? task.requirementsRu
            : task.requirements;

    if (result?.type === "success" && isCompleted) {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <Link to={courseLink} className={styles.backLink}>
                        <Chevronleft className={styles.smallIcon} />
                        {t("task.backToCourse")}
                    </Link>
                </div>

                <div className={`${styles.completionCard} ${styles.centered}`}>
                    <div className={`${styles.completionIconWrap} ${styles.resultSuccess}`}>
                        <Correct className={styles.completionIcon} />
                    </div>
                    <h1 className={styles.title}>{t("task.completedTitle")}</h1>
                    <p className={styles.subtitle}>{result.message}</p>
                    <p className={styles.completionMeta}>{t("task.progressSaved")}</p>
                    <Link to={courseLink} className={styles.completionButton}>
                        {t("task.backToCourse")}
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
                    {t("task.backToCourse")}
                </Link>
            </div>

            <div className={styles.titleBlock}>
                <h1 className={styles.title}>{task.title}</h1>
                <p className={styles.subtitle}>
                    {localizedDescription}
                </p>
                {isCompleted ? (
                    <span className={styles.completedBadge}>{t("task.completed")}</span>
                ) : null}
            </div>

            <div className={styles.requirementsCard}>
                <h3 className={styles.requirementsTitle}>{t("task.requirements")}</h3>
                <ul className={styles.requirementsList}>
                    {localizedRequirements && localizedRequirements.length > 0 ? (
                        localizedRequirements.map((requirement, index) => (
                            <li key={index}>{requirement}</li>
                        ))
                    ) : (
                        <>
                            <li>{t("task.req1")}</li>
                            <li>{t("task.req2")}</li>
                            <li>{t("task.req3")}</li>
                        </>
                    )}
                </ul>
            </div>

            <div className={styles.layout}>
                <div className={styles.mainColumn}>
                    <div className={styles.editorCard}>
                        <div className={styles.editorToolbar}>
                            <span className={styles.fileName}>
                                {detectLanguage(task.starterCode) === "c" ? "main.c" : "code.js"}
                            </span>
                            <div className={styles.toolbarActions}>
                                <button
                                    onClick={handleHint}
                                    className={styles.hintButton}
                                    disabled={isSubmitting || isChatSending}
                                >
                                    <Light className={styles.smallIcon} />
                                    {t("task.getHint")}
                                </button>
                                <button
                                    onClick={handleRun}
                                    className={styles.runButton}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? t("task.checking") : t("task.runCode")}
                                </button>
                            </div>
                        </div>
                        <CodeEditor
                            value={code}
                            onChange={setCode}
                            language={detectLanguage(task.starterCode)}
                            readOnly={isSubmitting}
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
                                        ? t("task.success")
                                        : result.type === "pending"
                                          ? t("task.checkingTitle")
                                          : t("task.error")}
                                </p>
                            </div>
                            <p className={styles.resultText}>{result.message}</p>
                        </div>
                    )}

                    <div className={styles.testCard}>
                        <h3 className={styles.requirementsTitle}>{t("task.testCases")}</h3>
                        <div className={styles.testCases}>
                            {task.codeTests.map((test) => (
                                <div key={test.id} className={styles.testCase}>
                                    <span className={styles.testLabel}>{t("task.input")}</span> {test.input}
                                    <br />
                                    <span className={styles.testLabel}>{t("task.expected")}</span> {test.expectedOutput}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.assistantPanel}>
                    <div className={styles.assistantHeader}>
                        <Aistar className={styles.assistantIcon} />
                        <h3 className={styles.requirementsTitle}>{t("task.aiAssistant")}</h3>
                    </div>

                    <div className={styles.assistantMessages}>
                        {messages.map((msg, idx) => (
                            <div
                                key={msg.id ?? idx}
                                className={`${styles.messageRow} ${msg.role === "user" ? styles.messageRight : styles.messageLeft}`}
                            >
                                <div
                                    className={`${styles.messageBubble} ${msg.role === "user" ? styles.userBubble : styles.assistantBubble}`}
                                >
                                    {msg.role === "assistant" ? (
                                        <ChatAssistantContent
                                            content={msg.content}
                                            isStreaming={msg.isStreaming}
                                            textClassName={styles.messageText}
                                        />
                                    ) : (
                                        <p className={styles.messageText}>{msg.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <div className={styles.assistantFooter}>
                        <div className={styles.quickActions}>
                            {quickActions.map((action) => (
                                <button
                                    key={action}
                                    onClick={async () => sendTaskChat(action)}
                                    className={styles.quickActionButton}
                                    disabled={isChatSending}
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
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder={t("task.askPlaceholder")}
                                className={styles.input}
                                disabled={isChatSending}
                            />
                            <button
                                onClick={handleSendMessage}
                                className={styles.sendButton}
                                disabled={!input.trim() || isChatSending}
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
