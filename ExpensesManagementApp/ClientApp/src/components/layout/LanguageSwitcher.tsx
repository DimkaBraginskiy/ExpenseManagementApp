import i18n from "i18next";

export function LanguageSwitcher() {
    return (
        <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
            <option value="en">English</option>
            <option value="pl">Polski</option>
            <option value="ru">Русский</option>
        </select>
    );
}
