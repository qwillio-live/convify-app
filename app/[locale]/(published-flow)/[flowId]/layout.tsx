// export const dynamic = "force-static"
// Client Components:
import FlowLayout from "@/components/flow-preview/flow-preview-server"

export default function PreviewFlowsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      {/* <FlowLayout isHeader={true} /> */}
      {children}
      <FlowLayout isHeader={false} check={true} />
    </div>
  )
}
