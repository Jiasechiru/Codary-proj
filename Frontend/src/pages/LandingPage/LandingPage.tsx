import { Link } from "react-router";
import LogoBlueBackground from "../../assets/Icons/LogoBlueBackground.svg"
import Brain from "../../assets/Icons/brain.svg?react"
import Chat from "../../assets/Icons/chat.svg?react"
import Target from "../../assets/Icons/target.svg?react"
import Lightning from "../../assets/Icons/lightning.svg?react"
import Book from "../../assets/Icons/book.svg?react"
import Slbreaks from "../../assets/Icons/slbreaks.svg?react"
import { useLanguage } from "../../lib/LanguageContext";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
    const { t } = useLanguage();
    return (
        <div className={styles.page}>
            <nav className={styles.navbar}>
                <div className={styles.navContent}>
                    <div className={styles.brand}>
                        <img src={LogoBlueBackground} alt="Codary" className={styles.logo} />
                        <span className={styles.brandText}>Codary</span>
                    </div>
                    <Link
                        to="/login"
                        className={styles.navLoginLink}
                    >
                        {t("landing.login")}
                    </Link>
                </div>
            </nav>

            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        {t("landing.heroTitle")}
                    </h1>
                    <p className={styles.heroDescription}>
                        {t("landing.heroDescription")}
                    </p>
                    <div className={styles.heroActions}>
                        <Link
                            to="/register"
                            className={styles.primaryButton}
                        >
                            {t("landing.getStarted")}
                        </Link>
                        <Link
                            to="/login"
                            className={styles.secondaryButton}
                        >
                            {t("landing.login")}
                        </Link>
                    </div>
                </div>
            </section>

            <section className={styles.featuresSection}>
                <div className={styles.featuresContent}>
                    <h2 className={styles.sectionTitle}>{t("landing.featuresTitle")}</h2>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIconContainer}>
                                <Brain className={styles.featureIcon} />
                            </div>
                            <h3 className={styles.featureTitle}>{t("landing.feature1Title")}</h3>
                            <p className={styles.featureDescription}>
                                {t("landing.feature1Desc")}
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIconContainer}>
                                <Chat className={styles.featureIcon} />
                            </div>
                            <h3 className={styles.featureTitle}>{t("landing.feature2Title")}</h3>
                            <p className={styles.featureDescription}>
                                {t("landing.feature2Desc")}
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIconContainer}>
                                <Target className={styles.featureIcon} />
                            </div>
                            <h3 className={styles.featureTitle}>{t("landing.feature3Title")}</h3>
                            <p className={styles.featureDescription}>
                                {t("landing.feature3Desc")}
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIconContainer}>
                                <Lightning className={styles.featureIcon} />
                            </div>
                            <h3 className={styles.featureTitle}>{t("landing.feature4Title")}</h3>
                            <p className={styles.featureDescription}>
                                {t("landing.feature4Desc")}
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIconContainer}>
                                <Book className={styles.featureIcon} />
                            </div>
                            <h3 className={styles.featureTitle}>{t("landing.feature5Title")}</h3>
                            <p className={styles.featureDescription}>
                                {t("landing.feature5Desc")}
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIconContainer}>
                                <Slbreaks className={styles.featureIcon} />
                            </div>
                            <h3 className={styles.featureTitle}>{t("landing.feature6Title")}</h3>
                            <p className={styles.featureDescription}>
                                {t("landing.feature6Desc")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2 className={styles.sectionTitle}>{t("landing.ctaTitle")}</h2>
                    <p className={styles.ctaDescription}>
                        {t("landing.ctaDescription")}
                    </p>
                    <Link
                        to="/register"
                        className={styles.primaryButton}
                    >
                        {t("landing.getStartedFree")}
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default LandingPage;