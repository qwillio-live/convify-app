import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"

interface FlowsLayoutProps {
  children?: React.ReactNode
}

export default async function FlowsLayout({ children }: FlowsLayoutProps) {
  return <>{children}</>
}
