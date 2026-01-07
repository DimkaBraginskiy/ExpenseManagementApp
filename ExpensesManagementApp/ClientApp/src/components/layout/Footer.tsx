import styles from "./Layout.module.css";
import {LanguageSwitcher} from "./LanguageSwitcher.tsx";


export function Footer(){
    return (
        <footer className={styles.footer}>
            <LanguageSwitcher/>
            • 2025 Expense Management App •
        </footer>
    );
}