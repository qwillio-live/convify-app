interface AuthLayoutProps {
  children: React.ReactNode
}
import localFont from "next/font/local"

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main
      className={`
      min-h-screen 
    
    `}
    >
      {children}
    </main>
  )
}
