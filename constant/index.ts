import { LocalIcons } from "@/public/icons"
import { TIntegrationCardData } from "@/types"

export const DummyIntregationCardData: TIntegrationCardData[] = [
  {
    id: 1,
    title: "Email",
    description: "Recive an email every time a user submit their answer",
    image: LocalIcons.email,
    status: "active",
    alt: "intregation option",
  },
  {
    id: 2,
    title: "Google Sheets",
    description:
      "Send your data straight to Google Sheets. Automatically syncs as results come in.",
    image: LocalIcons.googleSheets,
    status: "Inactive",
    alt: "intregation option",
  },
  {
    id: 3,
    title: "Excel",
    description:
      "Send your typeform responses to Excel Online. Turn feedback into graphs, support quries into workflows, and much more.",
    image: LocalIcons.excel,
    status: "Inactive",
    alt: "intregation option",
  },
]
