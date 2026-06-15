import { Link } from "react-router";
import LogoBlueBackground from "../../assets/Icons/LogoBlueBackground.svg"
import Profile from "../../assets/Icons/profile.svg?react"
import styles from "./NavBar.module.css";

const NavBar = () => {
    return (
        <nav className={styles.nav}>
            <div className={styles.content}>
                <Link to="/app" className={styles.brand}>
                    <div className={styles.logoContainer}>
                        <img src={LogoBlueBackground} className={styles.logo} />
                    </div>
                    <span className={styles.brandText}>Codary</span>
                </Link>

                <div className={styles.actions}>
                    <Link
                        to="/app/profile"
                        className={styles.profileLink}
                    >
                        <Profile className={styles.profileIcon} />
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
