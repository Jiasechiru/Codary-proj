import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Chevronleft from "../../assets/Icons/chevronleft.svg?react";
import Correct from "../../assets/Icons/correct.svg?react";
import Incorrect from "../../assets/Icons/incorrect.svg?react";
import {
    getDailyChallenge,
    submitDailyChallenge,
    type DailyChallenge,
    type DailyChallengeLanguage,
} from "../../services/dailyChallenge";
import { useLanguage } from "../../lib/LanguageContext";
import PageState from "../../components/PageState/PageState";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import styles from "./DailyChallengePage.module.css";

type ResultState = {
    type: "success" | "error" | "pending";
    message: string;
} | null;

const SUPPORTED: DailyChallengeLanguage[] = ["javascript", "c"];

const DailyChallengePage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { language } = useParams();
    const lang = (language === "c" ? "c" : "javascript") as DailyChallengeLanguage;

    const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
    const [code, setCode] = useState("");
    const [result, setResult] = useState<ResultState>(null);
    const [completed, setCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        if (!language || !SUPPORTED.includes(language as DailyChallengeLanguage)) {
            navigate("/app", { replace: true });
            return;
        }

        const load = async () => {
            try {
                const data = await getDailyChallenge(lang);
                setChallenge(data.challenge);
                setCode(data.challenge.starterCode);
                setCompleted(data.completedToday);
            } catch (error) {
                setLoadError(error instanceof Error ? error.message : t("daily.unavailable"));
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [language, lang, navigate, t]);

    const messageForStatus = (status: string, raw?: string) => {
        switch (status) {
            case "SUCCESS":
                return t("daily.solveSuccess");
            case "FAILED":
                return t("daily.solveFail");
            case "TIME_LIMIT":
                return t("task.resultTimeLimit");
            case "RUNTIME_ERROR":
                return raw || t("task.resultRuntimeError");
            case "COMPILATION_ERROR":
                return raw || t("task.resultCompilationError");
            default:
                return t("task.resultUnknown");
        }
    };

    const handleRun = async () => {
        if (!challenge || isSubmitting) return;

        setIsSubmitting(true);
        setResult({ type: "pending", message: t("task.checkingSolution") });

        try {
            const response = await submitDailyChallenge(lang, code);
            setResult({
                type: response.isCorrect ? "success" : "error",
                message: messageForStatus(response.status, response.message),
            });
            if (response.completedToday) {
                setCompleted(true);
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

    if (isLoading) {
        return <PageState kind="loading" title={t("daily.loading")} />;
    }

    if (loadError || !challenge) {
        return <PageState kind="error" title={t("daily.unavailable")} description={loadError ?? undefined} />;
    }

    if (completed && result?.type !== "error") {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <Link to="/app" className={styles.backLink}>
                        <Chevronleft className={styles.smallIcon} />
                        {t("daily.back")}
                    </Link>
                </div>

                <div className={`${styles.completionCard} ${styles.centered}`}>
                    <div className={styles.completionIconWrap}>
                        <Correct className={styles.completionIcon} />
                    </div>
                    <h1 className={styles.title}>{t("daily.completedTitle")}</h1>
                    <p className={styles.subtitle}>
                        {result?.type === "success" ? t("daily.solveSuccess") : t("daily.alreadyToday")}
                    </p>
                    <p className={styles.completionMeta}>{t("daily.streakNote")}</p>
                    <Link to="/app" className={styles.completionButton}>
                        {t("daily.back")}
                    </Link>
                </div>
            </div>
        );
    }

    const fileName = lang === "c" ? "main.c" : "code.js";

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Link to="/app" className={styles.backLink}>
                    <Chevronleft className={styles.smallIcon} />
                    {t("daily.back")}
                </Link>
            </div>

            <div className={styles.titleBlock}>
                <span className={styles.badge}>{t("daily.badge")}</span>
                <h1 className={styles.title}>{challenge.title}</h1>
                <p className={styles.subtitle}>{challenge.description}</p>
                <p className={styles.meta}>
                    {t("daily.difficulty")}: {challenge.difficulty} • {lang === "c" ? "C" : "JavaScript"}
                </p>
            </div>

            <div className={styles.mainColumn}>
                <div className={styles.editorCard}>
                    <div className={styles.editorToolbar}>
                        <span className={styles.fileName}>{fileName}</span>
                        <button
                            onClick={handleRun}
                            className={styles.runButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t("task.checking") : t("task.runCode")}
                        </button>
                    </div>
                    <CodeEditor
                        value={code}
                        onChange={setCode}
                        language={lang}
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
                        {challenge.tests.map((test, index) => (
                            <div key={index} className={styles.testCase}>
                                <span className={styles.testLabel}>{t("task.input")}</span> {test.input}
                                <br />
                                <span className={styles.testLabel}>{t("task.expected")}</span> {test.expectedOutput}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyChallengePage;
