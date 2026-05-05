import { Link, useNavigate } from "react-router";
import { useState } from "react";
import LogoBlueBackground from "../../assets/Icons/LogoBlueBackground.svg"
import styles from "./RegPage.module.css";

const RegPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
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
                    <h1 className={styles.title}>Create your account</h1>
                    <p className={styles.subtitle}>Start learning to code with AI assistance</p>
                </div>

                <div className={styles.card}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label htmlFor="name" className={styles.label}>
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.input}
                                placeholder="John Doe"
                                required
                            />
                        </div>

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
                            Create Account
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