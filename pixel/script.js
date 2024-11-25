document.addEventListener("DOMContentLoaded", function () {
  // Constants for selectors, classes, and configuration
  const API_URL = "https://app.iziflow.io"
  const GLOBAL_CONSTANT_FLOW_ID = window.FLOW_ID
  const VISITED_STORAGE_PREFIX = "visited-"
  const RESPONSES_STORAGE_PREFIX = "responses-"
  const RESPONSE_BUTTON_CLASS = "send-response"
  const SINGLE_TAG_WRAPPER = "li"
  const ACTIVE_SECTION_SELECTOR = "section.active" // Ensure it matches the updated HTML
  const INPUT_SELECTORS = 'input, textarea, select, button[role="checkbox"]'
  const MULTI_SELECTOR = ".m-choice"
  const RESPONSE_EXPIRY_MINUTES = 30 // 30 minutes

  let storage = {}
  const flowId = GLOBAL_CONSTANT_FLOW_ID

  if (!flowId) {
    console.error("flowId is missing")
    return
  }

  const responseState = {
    isSendingResponse: false,
  }

  // Function to send visit event
  function sendVisitEvent(stepId) {
    fetch(`${API_URL}/api/flows/${flowId}/visits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stepId }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Visit event sent:", data))
      .catch((error) => console.error("Error sending visit event:", error))
  }

  // Function to send response event
  function sendResponseEvent(stepId, content, responseId = null, state) {
    const method = responseId ? "PUT" : "POST"
    const url = responseId
      ? `${API_URL}/api/flows/${flowId}/responses/${responseId}`
      : `${API_URL}/api/flows/${flowId}/responses`
    const data = {
      ...storage,
      ...content,
    }
    storage = data
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: data,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response event sent:", data)
        if (!responseId) {
          localStorage.setItem(
            `${RESPONSES_STORAGE_PREFIX}${flowId}`,
            JSON.stringify({
              responseId: data.id,
              expiry: Date.now() + RESPONSE_EXPIRY_MINUTES * 60 * 1000,
            })
          ) // 30 minutes
        }
        state.isSendingResponse = false // Reset the flag
      })
      .catch((error) => {
        console.error("Error sending response event:", error)
        state.isSendingResponse = false // Reset the flag even on error
      })
  }

  // Function to get a value from local storage by name
  function getLocalStorageItem(name) {
    const item = localStorage.getItem(name)
    return item
  }

  // Function to check if stepId was visited in the last 24 hours
  function wasVisitedInLast24Hours(stepId) {
    const visitedTime = getLocalStorageItem(
      `${VISITED_STORAGE_PREFIX}${stepId}`
    )
    if (visitedTime) {
      const lastVisitedDate = new Date(visitedTime)
      const currentDate = new Date()
      const hoursDifference = (currentDate - lastVisitedDate) / (1000 * 60 * 60)
      return hoursDifference < 24
    }
    return false
  }

  // Function to handle step visit
  function handleStepVisit(stepId) {
    if (!wasVisitedInLast24Hours(stepId)) {
      sendVisitEvent(stepId)
      localStorage.setItem(
        `${VISITED_STORAGE_PREFIX}${stepId}`,
        new Date().toISOString()
      ) // 1440 minutes = 24 hours
    }
  }

  // Function to get current stepId from URL hash
  function getStepIdFromHash() {
    return window.location.hash.substring(1) // Remove the '#' from the hash
  }

  // Function to build content data structure
  function buildContentData() {
    const content = {}
    const activeSection = document.querySelector(ACTIVE_SECTION_SELECTOR)
    if (activeSection) {
      const ignoreList = []
      const elementsMulti = activeSection.querySelectorAll(MULTI_SELECTOR)
      elementsMulti.forEach((element) => {
        const id = element.id || element.name || element.getAttribute("data-id")
        if (!id) {
          return
        }
        let parentText
        try {
          parentText = element.childNodes[0].textContent
            .replace(/\n/g, "")
            .replace(/  /g, "")
        } catch (e) {}
        const label =
          element.getAttribute("data-label") ||
          parentText ||
          element.name ||
          element.id
        let values = []

        const elements = element.querySelectorAll("input")
        elements.forEach((element) => {
          const id =
            element.id || element.name || element.getAttribute("data-id")
          if (!id) {
            return
          }
          ignoreList.push(id)
          const labelElement = element.labels ? element.labels[0] : null
          let parentText
          try {
            parentText = element.parentElement.textContent
              .replace(/\n/g, "")
              .replace(/  /g, "")
          } catch (e) {}
          const label =
            element.getAttribute("data-label") ||
            (labelElement
              ? labelElement.innerText
              : parentText || element.name || element.id)
          let value

          value = element.value || element.getAttribute("data-value")
          if (value == "true") {
            values.push({ id, value: label })
          }
        })

        content[id] = { label, value: values, type: "m-choice" }
      })

      const elements = activeSection.querySelectorAll(INPUT_SELECTORS)
      elements.forEach((element) => {
        const id = element.id || element.name || element.getAttribute("data-id")
        if (!id) {
          return
        }
        if (ignoreList.includes(id)) {
          return
        }
        const labelElement = element.labels ? element.labels[0] : null
        let parentText
        try {
          parentText = element.parentElement.parentElement.textContent
            .replace(/\n/g, "")
            .replace(/  /g, "")
        } catch (e) {}
        const label =
          element.getAttribute("data-label") ||
          (labelElement
            ? labelElement.innerText
            : parentText || element.name || element.id)
        let value

        if (["checkbox", "radio"].includes(element.type)) {
          value = element.checked
        } else {
          value = element.value || element.getAttribute("data-value")
        }

        content[id] = { label, value }
      })
    }
    return content
  }

  // Function to handle send response
  function handleSendResponse(stepId, state) {
    if (state.isSendingResponse) return // Prevent multiple simultaneous requests
    state.isSendingResponse = true // Set the flag

    const content = buildContentData()
    const name = `${RESPONSES_STORAGE_PREFIX}${flowId}`
    const responseLocal = getLocalStorageItem(name)
    responseId = null
    try {
      const data = JSON.parse(responseLocal)
      if (data.expiry && Date.now() > data.expiry) {
        localStorage.removeItem(name)
      } else {
        if (data.responseId) {
          responseId = data.responseId
        } else {
          localStorage.removeItem(name)
        }
      }
    } catch (e) {
      localStorage.removeItem(name)
    }

    sendResponseEvent(stepId, content, responseId, state)
  }

  // Event listener for hash change
  window.addEventListener("hashchange", () => {
    const stepId = getStepIdFromHash()
    if (stepId) {
      handleStepVisit(stepId)
    }
  })

  document.addEventListener("click", (event) => {
    const target = event.target
    const singleTag = target.closest(SINGLE_TAG_WRAPPER)
    const responseInsideTag = singleTag
      ? singleTag.querySelector(`.${RESPONSE_BUTTON_CLASS}`)
      : false

    const button =
      target.tagName === "BUTTON" ? target : target.closest("button")

    if (
      (button && button.classList.contains(RESPONSE_BUTTON_CLASS)) ||
      responseInsideTag
    ) {
      const stepId = getStepIdFromHash()
      if (stepId) {
        handleSendResponse(stepId, responseState)
      }
    }
  })

  // Initial check on page load
  const initialStepId = getStepIdFromHash()
  if (initialStepId) {
    handleStepVisit(initialStepId)
  }
})
