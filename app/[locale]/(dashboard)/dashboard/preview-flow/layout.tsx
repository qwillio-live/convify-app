import FlowLayout from "@/components/flow-preview/flow-preview-server"

export default async function PreviewFlowsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <FlowLayout isHeader={true} />
      {children}
      <FlowLayout isHeader={false} />
    </>
  )
}
