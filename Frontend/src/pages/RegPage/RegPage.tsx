import { Link, useNavigate } from "react-router";
import { useState } from "react";
import LogoBlueBackground from "../../assets/Icons/LogoBlueBackground.svg"
import { register } from "../../services/auth";
import styles from "./RegPage.module.css";

const RegPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await register(username, password);
            navigate("/app");
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Failed to create account");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.brand}>
                        <div className={styles.logoContainer}>
                            <img src={LogoBlueBackground} className={styles.logo} />
                        </div>
                        <span className={styles.brandText}>CodeMentor AI</span>
                    </div>
                    <h1 className={styles.title}>Create your account</h1>
                    <p className={styles.subtitle}>Start learning to code with AI assistance</p>
                </div>

                <div className={styles.card}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label htmlFor="username" className={styles.label}>
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={styles.input}
                                placeholder="john_doe"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="password" className={styles.label}>
                                Password
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
                            {isSubmitting ? "Creating..." : "Create Account"}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p className={styles.footerText}>
                            Already have an account?{" "}
                            <Link to="/login" className={styles.footerLink}>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegPage;