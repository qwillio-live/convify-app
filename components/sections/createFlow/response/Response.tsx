import EmptyResponse from "@/components/sections/createFlow/empty/Empty"

import { ArrowDown, ArrowUp } from "lucide-react"
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
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LoadingEl } from "./ResponseLoading"
interface Response {
  id?: string
  content?: Object
  createdAt?: string
  flowId?: string
  ip?: string
  isDeleted?: boolean
  updatedAt?: string
  userAgent?: string
  "Submission time"?: string
}

type Content = Record<string, any>

function extractLabels(content: Content): Set<string> {
  const labels = new Set<string>()
  function traverse(obj: Content) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]
        if (typeof value === "object" && value !== null) {
          traverse(value)
        } else if (key !== "value") {
          if (key === "label") {
            labels.add(obj[key])
          } else {
            labels.add(key)
          }
        }
      }
    }
  }
  traverse(content)
  return labels
}

function normalizeNamesWithRegex(set) {
  // Define regex patterns and their corresponding normalized names
  const patterns = [
    { regex: /^(first[-\s]?name)$/i, normalized: "firstName" },
    { regex: /^(last[-\s]?name)$/i, normalized: "lastName" },
    { regex: /^(email)$/i, normalized: "email" },
    { regex: /^(phone)$/i, normalized: "phone" },
    // Add more patterns as needed for other variations
  ]

  // Create a new set to store the normalized values
  const normalizedSet = new Set()

  // Function to normalize a value based on the defined patterns
  function normalize(value) {
    for (const { regex, normalized } of patterns) {
      if (regex.test(value)) {
        return normalized
      }
    }
    return value // Return original if no match found
  }

  // Iterate through the original set and normalize each value
  set.forEach((value) => {
    if (value === "Email address") {
      value = "email"
    }
    const normalizedValue = normalize(value)
    normalizedSet.add(normalizedValue)
  })

  return normalizedSet
}

function extractValuesOfLabels(content: Content): Object {
  const hashTable = {}

  function traverse(obj: Content) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const val = obj[key]
        if (
          typeof val === "object" &&
          val !== null &&
          "label" in val &&
          "value" in val
        ) {
          hashTable[val.label] = val.value
        } else if (typeof val === "object" && val !== null) {
          traverse(val)
        } else {
          hashTable[key] = val
        }
      }
    }
  }

  traverse(content)
  return hashTable
}

function tableMap(elementsOfLabels: Array<Object>, labels: Set<string>) {
  const rows: Object[] = []
  labels.add("Submission time")
  elementsOfLabels.forEach((element: any) => {
    const oneObj = {}
    labels.forEach((label) => {
      if (label in element) {
        oneObj[label] = element[label]
      } else if (
        ("first-name" in element && label === "firstName") ||
        ("First name" in element && label === "firstName")
      ) {
        if ("first-name" in element) {
          oneObj[label] = element["first-name"]
        } else {
          oneObj[label] = element["First name"]
        }
      } else if (
        ("last-name" in element && label === "lastName") ||
        ("Last name" in element && label === "lastName")
      ) {
        if ("last-name" in element) {
          oneObj[label] = element["last-name"]
        } else {
          oneObj[label] = element["Last name"]
        }
      } else if (
        ("email" in element && label === "email") ||
        ("Email address" in element && label === "email")
      ) {
        if ("email" in element) {
          oneObj[label] = element["email"]
        } else {
          oneObj[label] = element["Email address"]
        }
      } else if (
        ("phone" in element && label === "phone") ||
        ("Phone" in element && label === "phone")
      ) {
        if ("phone" in element) {
          oneObj[label] = element["phone"]
        } else {
          oneObj[label] = element["Phone"]
        }
      } else {
        oneObj[label] = "" // or some default value if the label is not found
      }
    })
    rows.push(oneObj)
  })

  return rows
}

function convertTimestamp(timestamp: string): string {
  const date = new Date(timestamp)

  const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    date.getUTCDay()
  ]
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ]
  const month = monthNames[date.getUTCMonth()]
  const dayOfMonth = date.getUTCDate()
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()

  // Formatting the output
  const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth} ${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

  return formattedDate
}

const ResponseFlowComponents = () => {
  const t = useTranslations("CreateFlow.ResultsPage")
  const [flowId, setFlowId] = useState<string | null>(null)
  const currentPath = usePathname()

  useEffect(() => {
    const extractFlowIdFromUrl = async () => {
      const url = currentPath // Get the current URL
      const match = url && url.match(/dashboard\/([^\/]+)\/results/) // Use regex to match the flowId
      if (match && match[1] && match[1] !== "flows") {
        setFlowId(match[1])
      }
    }
    extractFlowIdFromUrl()
  }, [])
  // const flow_id = 'clxtcj8dm0005mokca440ysv4'
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isAscending, setIsAscending] = useState<boolean>(false)
  const [rows, setRows] = useState<Object[]>([]) // Add state for rows

  useEffect(() => {
    const getResponses = async () => {
      const storedResponses = localStorage.getItem("responses")
      const flowIdStorage = JSON.parse(localStorage.getItem("flowId") || "{}")
      if (storedResponses && flowIdStorage === `${flowId}`) {
        setResponses(JSON.parse(storedResponses))
      } else if (flowId) {
        setLoading(true)
        const response = await fetch(`/api/flows/${flowId}/responses/`)
        const dataRes = await response.json()
        setResponses(dataRes)
        localStorage.setItem("responses", JSON.stringify(dataRes))
        localStorage.setItem("flowId", JSON.stringify(flowId))
        setLoading(false)
      }
    }
    getResponses()
  }, [flowId])
  useEffect(() => {
    // Parse analytics from local storage when component mounts or updates
    const dataRes = localStorage.getItem("responses")
    if (dataRes) {
      setResponses(JSON.parse(dataRes))
    }
  }, [])
  useEffect(() => {
    const uniqueLabels = new Set<string>()
    responses.length > 0 &&
      responses.forEach((item) => {
        const labels = extractLabels(item.content as Content) // Add type assertion to item.content
        labels.forEach((label) => uniqueLabels.add(label))
      })

    const elementsWithLabels: any[] = [] // Change type annotation to 'any[]'
    // console.log("responses", responses)
    responses.length > 0 &&
      responses.forEach((item) => {
        const valuesWithLables = extractValuesOfLabels(item.content as Content) // Add type assertion to item.content
        valuesWithLables["Submission time"] = item.createdAt
        valuesWithLables["flowId"] = item.flowId
        elementsWithLabels.push(valuesWithLables)
      })

    const normalizedUniqueLabels = normalizeNamesWithRegex(
      uniqueLabels
    ) as Set<string> // Cast uniqueLabels to Set<string>
    const sortedRows = tableMap(elementsWithLabels, normalizedUniqueLabels) // Use normalizedUniqueLabels instead of uniqueLabels

    // Initial sort
    sortedRows.sort((a, b) => {
      return isAscending
        ? new Date(a["Submission time"]).getTime() -
            new Date(b["Submission time"]).getTime()
        : new Date(b["Submission time"]).getTime() -
            new Date(a["Submission time"]).getTime()
    })

    setRows(sortedRows) // Update rows state
  }, [responses, isAscending]) // Add dependencies

  const uniqueLabelsArray = Array.from(
    normalizeNamesWithRegex(new Set(rows.flatMap(Object.keys)))
  )

  const handleSort = () => {
    setIsAscending(!isAscending)
    setRows((prevRows) => {
      const sortedRows = [...prevRows].sort((a, b) => {
        return isAscending
          ? new Date(a["Submission time"]).getTime() -
              new Date(b["Submission time"]).getTime()
          : new Date(b["Submission time"]).getTime() -
              new Date(a["Submission time"]).getTime()
      })
      return sortedRows
    })
  }

  console.log(responses)

  return (
    <div className="mx-auto min-h-screen flex-1 items-center justify-center px-0 pb-36 pt-4 lg:px-8">
      {loading ? (
        <LoadingEl />
      ) : responses.length > 0 ? (
        <div className="mb-20 h-full overflow-x-auto rounded-[12px] border border-[#E9E9E9] bg-white px-6 py-5 lg:rounded-[20px]">
          <Table className="h-full text-sm">
            <TableHeader>
              <TableRow>
                <TableHead
                  className="flex items-center gap-0.5 whitespace-nowrap text-[#9B9A99] font-normal"
                  style={{ cursor: "pointer" }}
                  onClick={handleSort} // Use handleSort
                >
                  {t("Submission time")}{" "}
                  {isAscending ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </TableHead>
                {uniqueLabelsArray.length > 0 &&
                  uniqueLabelsArray.map((label: string) => (
                    <TableHead
                      className="whitespace-nowrap text-[#9B9A99] font-normal"
                      key={label as React.Key}
                    >
                      {label !== "Submission time" &&
                        label !== "label" &&
                        label.charAt(0).toUpperCase() +
                          label.slice(1).toLowerCase()}
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody className="h-full">
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {convertTimestamp(row["Submission time"])}{" "}
                    <span className="text-gray-500"></span>
                  </TableCell>
                  {uniqueLabelsArray.map((label: string) => (
                    <TableCell key={label as React.Key}>
                      {label !== "Submission time" &&
                        label !== "label" &&
                        row[label]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyResponse />
      )}
    </div>
  )
}

export default ResponseFlowComponents
