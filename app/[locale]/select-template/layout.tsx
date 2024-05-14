interface SelectTemplateLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default async function SelectTemplateLayout({
  children,
  params: { locale },
}: SelectTemplateLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main>{children}</main>
    </div>
  )
}
