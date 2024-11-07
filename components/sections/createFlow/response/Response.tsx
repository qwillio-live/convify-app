import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ArrowDown, ArrowUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { orderBy, sortBy } from "lodash"

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
import { useAppSelector } from "@/lib/state/flows-state/hooks"

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
          const parentValue = obj["orgKey"] || ""
          console.log("valeuee", value)
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
  const uniqueLabels = content.map((item) => item.value)
  console.log("uniqueLabels", uniqueLabels)
  // const valuesWithLabels: { [key: string]: any } = {}
  // const seenLabels = new Set<string>()

  // Object.entries(content).forEach(([key, value]) => {
  //   let label = value.label || key
  //   if (seenLabels.has(label)) {
  //     label = `${label} (${key})`
  //   } else {
  //     seenLabels.add(label)
  //   }
  //   valuesWithLabels[key] = { label, value: value.value }
  // })

  return uniqueLabels
}
function tableMap(
  elementsOfLabels: Array<Object>,
  labels: Map<string, { label: string; value: string }>
) {
  return elementsOfLabels.map((element: any) => {
    const result: any = {} // This will store the final mapped result
    const contentItems = element.content

    // Iterate over the labels in the same order (since Map keeps insertion order)
    labels.forEach((labelObj, labelId) => {
      // For "Submission time", add it directly
      if (labelObj.label === "Submission time") {
        result[labelObj.label] = element.createdAt || "" // You can replace createdAt with any other timestamp you want
        return // Skip further logic for "Submission time"
      }

      // For other labels, check for the corresponding value based on orgKey
      const matchingContents = contentItems.filter(
        (content: any) => content.orgKey === labelObj.value
      )

      if (matchingContents.length > 0) {
        // If there are multiple matches, concatenate their values as a string
        result[labelObj.value] =
          matchingContents
            .map((content: any) => content.value?.value || content.value)
            .join(", ") || "" // Join values with a comma
      } else {
        // If no matching content is found, assign an empty string
        result[labelObj.value] = ""
      }
    })

    return result // Return the mapped result for this element
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
  const screens = useAppSelector((state) => state.screen?.screens)
  useEffect(() => {
    const getResponses = async () => {
      setLoading(true)

      try {
        const response = await fetch(`/api/flows/${flowId}/responses/`)
        let dataRes = await response.json()
        const ogLabels = screens?.map((screen, index) => {
          let screenData = JSON.parse(screen.screenData) // Parse the screenData string
          const labels = Object.keys(screenData).filter((key) => key !== "ROOT") // Get the keys from the object
          return { [index]: labels } // Return an object where the index is the key and labels are the value
        })

        console.log("ogLabels", ogLabels)

        console.log("response", dataRes)
        // Result container for the arrays
        const result = []

        // Iterate over the ordersArray
        dataRes.map((data, index) => {
          let tempResult = []
          let sortedIndex = 0
          //@ts-ignore
          ogLabels.forEach((step, stepIndex) => {
            const key = Object.keys(step)[0] // Get the key (step index)
            const orgKeysForStep = step[key] // Get the orgKeys for the current step

            // Filter the content array to find matching orgKeys
            const matchedContent = data.content.filter((item) =>
              orgKeysForStep.includes(item.orgKey)
            )
            if (matchedContent.length > 0) {
              sortedIndex = stepIndex
              //@ts-ignore
              tempResult = [...tempResult, ...matchedContent]
            }
          })

          data.content = tempResult
          console.log("stepContent", data)
        })

        console.log("result", dataRes)

        // console.log(
        //   "first",
        //   dataRes[0].content,
        //   "screens",
        //   screens,
        //   JSON.parse(screens[1].screenData)
        // )
        localStorage.setItem("responses", JSON.stringify(dataRes))
        localStorage.setItem("flowId", JSON.stringify(flowId))
        setResponses(dataRes)
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
  const reorderRow = (row, header) => {
    const reorderedRow = {}

    // Iterate through the tableHeader and reorder the row
    header.forEach((label) => {
      // Find the corresponding key in the row and add it to the reorderedRow
      for (const key in row) {
        if (row[key].label === label) {
          reorderedRow[label] = row[key].value || row[key] // Add value if available
        }
      }
      // Handle special cases like 'Submission time'
      if (label === "Submission time" && !reorderedRow[label]) {
        reorderedRow[label] = row["Submission time"]
      }
    })

    return reorderedRow
  }
  useEffect(() => {
    if (responses.length > 0) {
      const uniqueLabels = new Map<string, { label: string; value: string }>()
      const elementsWithLabels: any[] = []
      const rowsBeforeSort: any[] = [] // This will hold the rows before sorting

      // Extract the latest label for each unique key
      responses.forEach((item) => {
        // Extract labels from the content

        const labels = extractLabels(item.content as Content)
        console.log("labelszzz", labels)
        labels.forEach((label) => {
          // Here, we store the 'label' and 'value' for each 'label.id'
          //@ts-ignore
          uniqueLabels.set(label.id, {
            label: label.label,
            value: label.value?.value || label.value,
          })
        })
        // Extract values associated with the labels
        const valuesWithLabels = extractValuesOfLabels(item.content as Content)

        // Add "Submission time" and "flowId" to the valuesWithLabels object
        valuesWithLabels["Submission time"] = item.createdAt
        valuesWithLabels["flowId"] = item.flowId

        // Push the valuesWithLabels to elementsWithLabels array
        elementsWithLabels.push(valuesWithLabels)

        // Push the row with originalIndex for sorting later
        rowsBeforeSort.push({ ...valuesWithLabels, originalIndex: item.id })
      })

      // Add "Submission time" to the unique labels
      uniqueLabels.set("Submission time", {
        label: "Submission time",
        value: "Submission time",
      })
      const labelArray = Array.from(uniqueLabels.values()).map(
        (item) => item.label
      )
      console.log("labelArray", labelArray)
      setTableHeader(labelArray)

      const normalizedUniqueLabels = labelArray
      console.log("uniqueLabels", uniqueLabels)

      // Ensure sorting logic works but respects the original order
      const sortedRows = tableMap(responses, uniqueLabels)
      console.log("sortedRows", sortedRows)
      // Now that the rows are sorted by timestamp, you can apply sorting logic based on the original order if needed.
      setRows(sortedRows)
    }
  }, [responses, isAscending]) // Make sure this only triggers when responses or isAscending changes

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
                          : row[label]?.value
                          ? row[label].value
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
