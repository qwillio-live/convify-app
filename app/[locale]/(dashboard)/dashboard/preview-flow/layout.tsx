import dynamic from "next/dynamic"

// Client Components:
import FlowLayout from "@/components/flow-preview/flow-preview-server"

export default function PreviewFlowsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* <FlowLayout isHeader={true} /> */}
      {children}
      <FlowLayout isHeader={false} />
    </div>
  )
}
