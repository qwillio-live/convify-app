// import EmptyResponse from "@/components/sections/createFlow/empty/Empty"

import { ArrowDown, Check } from "lucide-react"
import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ResponseFlowComponents = () => {
  const t = useTranslations("CreateFlow.ResultsPage")

  return (
    <div className="min-w-screen-md flex-1 items-center justify-center overflow-y-hidden mx-auto py-4 px-0 lg:px-8 lg:py-4">
      <Card>
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="flex gap-0.5 items-center whitespace-nowrap">
                {t("Submission time")} <ArrowDown className="w-4 h-4" />
              </TableHead>
              <TableHead className="whitespace-nowrap">{t("Label")}</TableHead>
              <TableHead className="whitespace-nowrap">{t("Yes/No")}</TableHead>
              <TableHead className="whitespace-nowrap">
                {t("Social Media")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("Workers")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("First name")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("Last name")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("Compnay name")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("Email address")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("Phone number")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("User aggrement")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                Mon, 6/5 <span className="text-gray-500">17:07</span>
              </TableCell>
              <TableCell></TableCell>
              <TableCell>Yes</TableCell>
              <TableCell>Linkedin</TableCell>
              <TableCell>3 to 9</TableCell>
              <TableCell>Habibur</TableCell>
              <TableCell>Rahman</TableCell>
              <TableCell>xyz</TableCell>
              <TableCell>xyz@gmail.com</TableCell>
              <TableCell>01844345699</TableCell>
              <TableCell>
                <Check className="w-4 h-4" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Mon, 6/5 <span className="text-gray-500">17:07</span>
              </TableCell>
              <TableCell></TableCell>
              <TableCell>Yes</TableCell>
              <TableCell>Facebook</TableCell>
              <TableCell>3 to 9</TableCell>
              <TableCell>Tarek</TableCell>
              <TableCell>Hasan</TableCell>
              <TableCell>xyz</TableCell>
              <TableCell>xyz@gmail.com</TableCell>
              <TableCell>01844945699</TableCell>
              <TableCell>
                <Check className="w-4 h-4" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Mon, 6/5 <span className="text-gray-500">17:07</span>
              </TableCell>
              <TableCell></TableCell>
              <TableCell>Yes</TableCell>
              <TableCell>Linkedin</TableCell>
              <TableCell>3 to 9</TableCell>
              <TableCell>Mehedi</TableCell>
              <TableCell>Bhuiyan</TableCell>
              <TableCell>xyz</TableCell>
              <TableCell>xyz@gmail.com</TableCell>
              <TableCell>01844347799</TableCell>
              <TableCell>
                <Check className="w-4 h-4" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
      {/* <EmptyResponse /> */}
    </div>
  )
}

export default ResponseFlowComponents
