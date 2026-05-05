import { Link } from "react-router";
import LogoBlueBackground from "../../assets/Icons/LogoBlueBackground.svg"
import profile from "../../assets/Icons/profile.svg"
import styles from "./NavBar.module.css";

const NavBar = () => {
    return (
        <nav className={styles.nav}>
            <div className={styles.content}>
                <Link to="/app" className={styles.brand}>
                    <div className={styles.logoContainer}>
                        <img src={LogoBlueBackground} className={styles.logo} />
                    </div>
                    <span className={styles.brandText}>CodeMentor AI</span>
                </Link>

                <div className={styles.actions}>
                    <Link
                        to="/app/profile"
                        className={styles.profileLink}
                    >
                        <img src={profile} className={styles.profileIcon} />
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;