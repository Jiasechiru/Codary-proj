import { Link, useNavigate } from "react-router";
import { useState } from "react";
import LogoBlueBackground from "../../assets/Icons/LogoBlueBackground.svg"
import { login } from "../../services/auth";
import { useLanguage } from "../../lib/LanguageContext";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await login(username, password);
            navigate("/app");
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : t("login.failed"));
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
                    <h1 className={styles.title}>{t("login.welcome")}</h1>
                    <p className={styles.subtitle}>{t("login.subtitle")}</p>
                </div>

                <div className={styles.card}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label htmlFor="username" className={styles.label}>
                                {t("login.username")}
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={styles.input}
                                placeholder={t("login.usernamePlaceholder")}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="password" className={styles.label}>
                                {t("login.password")}
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

                        {error ? <p className={styles.errorText}>{error}</p> : null}

                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? t("login.signingIn") : t("login.signIn")}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p className={styles.footerText}>
                            {t("login.noAccount")}{" "}
                            <Link to="/register" className={styles.footerLink}>
                                {t("login.signUp")}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
