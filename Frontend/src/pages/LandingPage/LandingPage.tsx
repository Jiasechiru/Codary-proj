import { Link } from "react-router";
import LogoBlueBackground from "../../assets/Icons/LogoBlueBackground.svg"
import brain from "../../assets/Icons/brain.svg"
import chat from "../../assets/Icons/chat.svg"
import target from "../../assets/Icons/target.svg"
import lightning from "../../assets/Icons/lightning.svg"
import book from "../../assets/Icons/book.svg"
import slbreaks from "../../assets/Icons/slbreaks.svg"
import styles from "./LandingPage.module.css";

const LandingPage = () => {
    return (
        <div className={styles.page}>
            <nav className={styles.navbar}>
                <div className={styles.navContent}>
                    <div className={styles.brand}>
                        <div className={styles.logoContainer}>
                            <img src={LogoBlueBackground} className={styles.logo} />
                        </div>
                        <span className={styles.brandText}>CodeMentor AI</span>
                    </div>
                    <Link
                        to="/login"
                        className={styles.navLoginLink}
                    >
                        Login
                    </Link>
                </div>
            </nav>

            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Learn Programming with AI-Powered Assistance
                    </h1>
                    <p className={styles.heroDescription}>
                        Master coding through interactive lessons, hands-on practice, and intelligent guidance. Your personal AI mentor is here to help you succeed.
                    </p>
                    <div className={styles.heroActions}>
                        <Link
                            to="/register"
                            className={styles.primaryButton}
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className={styles.secondaryButton}
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </section>

            <section className={styles.featuresSection}>
                <div className={styles.featuresContent}>
                    <h2 className={styles.sectionTitle}>AI Assistance Features</h2>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIconContainer}>
                                <img src={brain} className={styles.featureIcon} />
                            </div>
                            <h3 className={styles.featureTitle}>Smart Code Analysis</h3>
                            <p className={styles.featureDescription}>
                                Get instant feedback on your code with AI-powered analysis and suggestions for improvement.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIconContainer}>
                                <img src={chat} className={styles.featureIcon} />
                            </div>
                            <h3 className={styles.featureTitle}>Interactive Q&A</h3>
                            <p className={styles.featureDescription}>
                                Ask questions anytime and get clear, contextual answers tailored to your learning level.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIconContainer}>
                                <img src={target} className={styles.featureIcon} />
                            </div>
                            <h3 className={styles.featureTitle}>Personalized Hints</h3>
                            <p className={styles.featureDescription}>
                                Stuck on a problem? Get progressive hints that guide you without giving away the solution.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIconContainer}>
                                <img src={lightning} className={styles.featureIcon} />
                            </div>
                            <h3 className={styles.featureTitle}>Real-time Error Detection</h3>
                            <p className={styles.featureDescription}>
                                Identify and fix errors quickly with AI assistance that understands your code context.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIconContainer}>
                                <img src={book} className={styles.featureIcon} />
                            </div>
                            <h3 className={styles.featureTitle}>Structured Learning Path</h3>
                            <p className={styles.featureDescription}>
                                Follow a comprehensive curriculum designed to take you from beginner to advanced level.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIconContainer}>
                                <img src={slbreaks} className={styles.featureIcon} />
                            </div>
                            <h3 className={styles.featureTitle}>Hands-on Practice</h3>
                            <p className={styles.featureDescription}>
                                Learn by doing with interactive coding exercises and real-world projects.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2 className={styles.sectionTitle}>Ready to Start Your Coding Journey?</h2>
                    <p className={styles.ctaDescription}>
                        Join thousands of learners who are mastering programming with AI-powered assistance.
                    </p>
                    <Link
                        to="/register"
                        className={styles.primaryButton}
                    >
                        Get Started Free
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default LandingPage;