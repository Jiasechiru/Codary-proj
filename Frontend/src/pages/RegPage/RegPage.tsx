import { Link, useNavigate } from "react-router";
import { useState } from "react";
import LogoBlueBackground from "../../assets/Icons/LogoBlueBackground.svg"
import { register } from "../../services/auth";
import { useLanguage } from "../../lib/LanguageContext";
import styles from "./RegPage.module.css";

const RegPage = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError(t("reg.passwordMismatch"));
            return;
        }

        setIsSubmitting(true);

        try {
            await register(username, password);
            navigate("/app");
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : t("reg.failed"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.brand}>
                        <img src={LogoBlueBackground} alt="Codary" className={styles.logo} />
                        <span className={styles.brandText}>CodeMentor AI</span>
                    </div>
                    <h1 className={styles.title}>{t("reg.title")}</h1>
                    <p className={styles.subtitle}>{t("reg.subtitle")}</p>
                </div>

                <div className={styles.card}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label htmlFor="username" className={styles.label}>
                                {t("reg.username")}
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={styles.input}
                                placeholder={t("reg.usernamePlaceholder")}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="password" className={styles.label}>
                                {t("reg.password")}
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="confirmPassword" className={styles.label}>
                                {t("reg.confirmPassword")}
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.input}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error ? <p className={styles.errorText}>{error}</p> : null}

                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? t("reg.creating") : t("reg.createAccount")}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p className={styles.footerText}>
                            {t("reg.haveAccount")}{" "}
                            <Link to="/login" className={styles.footerLink}>
                                {t("reg.signIn")}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegPage;