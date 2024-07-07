// pages/404.js
import { useTranslations } from "next-intl"
const Custom404 = () => {
    const t = useTranslations("CreateFlow.SharePage")
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - {t("Page Not Found")}</h1>
            <p>{t("Sorry, we couldn't find the page you're looking for")}</p>
        </div>
    );
}

export default Custom404;
