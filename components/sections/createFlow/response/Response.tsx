import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
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
import EmptyResponse from "@/components/sections/createFlow/empty/Empty"

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

function extractLabels(
  content: Content
): { id: string; label: string; value: string }[] {
  const labels: { id: string; label: string; value: string }[] = []

  function traverse(obj: Content, parentId: string | null = null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]
        if (typeof value === "object" && value !== null) {
          traverse(value, key)
        } else if (key === "label" && parentId) {
          const parentValue = obj["value"] || ""
          labels.push({ id: parentId, label: value, value: parentValue })
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

const extractValuesOfLabels = (content: Content) => {
  const valuesWithLabels: { [key: string]: any } = {}
  const seenLabels = new Set<string>()

  Object.entries(content).forEach(([key, value]) => {
    let label = value.label || key
    if (seenLabels.has(label)) {
      label = `${label} (${key})`
    } else {
      seenLabels.add(label)
    }
    valuesWithLabels[key] = { label, value: value.value }
  })

  return valuesWithLabels
}

function tableMap(elementsOfLabels: Array<Object>, labels: string[]) {
  // const rows: Object[] = []
  // labels.push("Submission time")
  // elementsOfLabels.forEach((element: any) => {
  //   const oneObj = {}
  //   labels.forEach((label) => {
  //     if (label in element) {
  //       oneObj[label] = element[label]
  //     } else if (
  //       ("first-name" in element && label === "firstName") ||
  //       ("First name" in element && label === "firstName")
  //     ) {
  //       if ("first-name" in element) {
  //         oneObj[label] = element["first-name"]
  //       } else {
  //         oneObj[label] = element["First name"]
  //       }
  //     } else if (
  //       ("last-name" in element && label === "lastName") ||
  //       ("Last name" in element && label === "lastName")
  //     ) {
  //       if ("last-name" in element) {
  //         oneObj[label] = element["last-name"]
  //       } else {
  //         oneObj[label] = element["Last name"]
  //       }
  //     } else if (
  //       ("email" in element && label === "email") ||
  //       ("Email address" in element && label === "email")
  //     ) {
  //       if ("email" in element) {
  //         oneObj[label] = element["email"]
  //       } else {
  //         oneObj[label] = element["Email address"]
  //       }
  //     } else if (
  //       ("phone" in element && label === "phone") ||
  //       ("Phone" in element && label === "phone")
  //     ) {
  //       if ("phone" in element) {
  //         oneObj[label] = element["phone"]
  //       } else {
  //         oneObj[label] = element["Phone"]
  //       }
  //     } else {
  //       oneObj[label] = "" // or some default value if the label is not found
  //     }
  //   })
  //   rows.push(oneObj)
  // })

  // return rows
  return elementsOfLabels.map((element) => {
    const result = {}
    for (const key in element) {
      if (key === "Submission time") {
        result[key] = element[key]
        continue
      }
      result[key] = element[key]?.value ?? ""
    }
    return result
  })
}

function convertTimestamp(timestamp: string): string {
  const date = new Date(timestamp)

  // Extracting date components
  const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    date.getUTCDay()
  ]
  const month = date.getUTCMonth() + 1 // Months are zero-indexed
  const dayOfMonth = date.getUTCDate()
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()

  // Formatting the output
  const formattedDate = `${dayOfWeek}, ${month}/${dayOfMonth} ${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

  return formattedDate
}
const ResponseFlowComponents = () => {
  const t = useTranslations("CreateFlow.ResultsPage")
  const [flowId, setFlowId] = useState<string | null>(null)
  const currentPath = usePathname()
  const [tableHeader, setTableHeader] = useState<string[]>([])

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
  const [loading, setLoading] = useState<boolean>(true)
  const [isAscending, setIsAscending] = useState<boolean>(false)
  const [rows, setRows] = useState<Object[]>([]) // Add state for rows

  useEffect(() => {
    const getResponses = async () => {
      setLoading(true)
      function sortContentByOrder(arr: any[]) {
        return arr.map((item: any) => {
          //@ts-ignore
          const sortedContent = Object.entries(item.content)
            .sort(
              ([, a]: [string, any], [, b]: [string, any]) =>
                (a.order || 0) - (b.order || 0)
            )
            .reduce((acc, [key, value]) => {
              acc[key] = value
              return acc
            }, {})

          return { ...item, content: sortedContent }
        })
      }
      try {
        const response = await fetch(`/api/flows/${flowId}/responses/`)
        let dataRes = await response.json()
        console.log("response", dataRes)
        localStorage.setItem("responses", JSON.stringify(dataRes))
        localStorage.setItem("flowId", JSON.stringify(flowId))

        const sortedData = sortContentByOrder(dataRes)

        console.log("updated dataRe", sortedData)
        setResponses(sortedData)
      } finally {
        setLoading(false)
      }

      // const storedResponses = localStorage.getItem("responses")
      // const flowIdStorage = JSON.parse(localStorage.getItem("flowId") || "{}")
      // if (dataRes && flowIdStorage === `${flowId}`) {
      //   setResponses(storedResponses))
      // }
    }
    if (flowId) {
      getResponses()
    }
  }, [flowId])

  // useEffect(() => {
  //   // Parse analytics from local storage when component mounts or updates
  //   const dataRes = localStorage.getItem("responses")
  //   if (dataRes) {
  //     setResponses(JSON.parse(dataRes))
  //   }
  // }, [])

  // console.log("response", responses)

  useEffect(() => {
    if (responses.length > 0) {
      const uniqueLabels = new Map<string, string>() // Map to store the latest label for each unique key
      const elementsWithLabels: any[] = []

      // Extract the latest label for each unique key
      responses.forEach((item) => {
        // for header
        const labels = extractLabels(item.content as Content)
        // console.log("anjit labels", labels)
        labels.forEach((label) => {
          if (!uniqueLabels.has(label.id))
            uniqueLabels.set(label.id, label.label) // Store the latest label for each key
        })

        // Extract values and associate them with the latest labels
        console.log("item", item)
        const valuesWithLabels = extractValuesOfLabels(item.content as Content)
        valuesWithLabels["Submission time"] = item.createdAt
        valuesWithLabels["flowId"] = item.flowId
        elementsWithLabels.push(valuesWithLabels)
      })

      // Add "Submission time" to the unique labels
      uniqueLabels.set("Submission time", "Submission time")
      setTableHeader(Array.from(uniqueLabels.values()))

      const normalizedUniqueLabels = Array.from(uniqueLabels.values()) // Get the latest label
      const sortedRows = tableMap(elementsWithLabels, normalizedUniqueLabels) // Use normalizedUniqueLabels

      // Initial sort
      sortedRows.sort((a, b) => {
        return isAscending
          ? new Date(a["Submission time"]).getTime() -
              new Date(b["Submission time"]).getTime()
          : new Date(b["Submission time"]).getTime() -
              new Date(a["Submission time"]).getTime()
      })

      setRows(sortedRows) // Update rows state

      console.log("anjit rows", rows)
      // console.log("anjit elementsWithLabels", elementsWithLabels)
    }
  }, [responses, isAscending]) // Add dependencies

  const uniqueLabelsArray = Array.from(
    normalizeNamesWithRegex(new Set(rows.flatMap(Object.keys)))
  ).filter((label) => label !== "Submission time" && label !== "flowId")

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

  return (
    <div className="mx-auto min-h-screen flex-1 items-center justify-center px-0 py-4 lg:px-8 lg:py-4">
      {loading ? (
        <LoadingEl />
      ) : responses.length > 0 ? (
        <Card className="h-full overflow-x-auto">
          <Table className="h-full text-xs">
            <TableHeader>
              <TableRow>
                <TableHead
                  className="flex items-center gap-0.5 whitespace-nowrap"
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
                {tableHeader.length > 0 &&
                  tableHeader.map((label: string) => (
                    <TableHead
                      className="whitespace-nowrap"
                      key={label as React.Key}
                    >
                      {label !== "Submission time" &&
                        label !== "label" &&
                        (label.includes("(")
                          ? label // If it's a repeated label with key, use as is
                          : label.charAt(0).toUpperCase() +
                            label.slice(1).toLowerCase())}
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
                      !!row[label]
                        ? typeof row[label] === "string"
                          ? row[label]
                          : Array.isArray(row[label])
                          ? row[label]
                              ?.map((rowItem) => rowItem?.value)
                              .join(", ")
                          : row[label]?.value + "bb"
                          ? row[label].value + "bb"
                          : ""
                        : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <EmptyResponse />
      )}
    </div>
  )
}

export default ResponseFlowComponents
