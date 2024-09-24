import StoreProvider from "@/lib/state/flows-state/store-provider"

export default async function VerificationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <StoreProvider>{children}</StoreProvider>
}
