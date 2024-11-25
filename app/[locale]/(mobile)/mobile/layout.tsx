interface AuthLayoutProps {
  children: React.ReactNode
}

const APP_NAME = process.env.APP_NAME

export async function generateMetadata() {
  const t = await getTranslations("Components") // Fetch translations

  return {
    title: `${APP_NAME} - ${t("Create")}`, // Use translations for title
  }
}
import { getTranslations } from "next-intl/server"
export default function MobileLayout({ children }: AuthLayoutProps) {
  return (
    <div>
      {children}
    </div>
  )
}
