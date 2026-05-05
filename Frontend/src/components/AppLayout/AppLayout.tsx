import { Outlet } from "react-router";
import Navbar from "../NavBar/NavBar";
import Sidebar from "../SideBar/SideBar";
import styles from "./AppLayout.module.css";

export default function AppLayout() {
    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.layout}>
                <Sidebar />
                <main className={styles.main} style={{ marginLeft: "var(--sidebar-width, 16rem)" }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}