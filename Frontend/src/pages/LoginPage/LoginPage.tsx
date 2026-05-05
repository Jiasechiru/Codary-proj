import { Link, useNavigate } from "react-router";
import { useState } from "react";
import LogoBlueBackground from "../../assets/Icons/LogoBlueBackground.svg"
import styles from "./LoginPage.module.css";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/app");
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
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.subtitle}>Sign in to continue your learning journey</p>
                </div>

                <div className={styles.card}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label htmlFor="email" className={styles.label}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                placeholder="you@example.com"
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

                        <button
                            type="submit"
                            className={styles.submitButton}
                        >
                            Sign In
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p className={styles.footerText}>
                            Don't have an account?{" "}
                            <Link to="/register" className={styles.footerLink}>
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
