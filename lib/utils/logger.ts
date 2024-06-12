export async function logError({
  statusCode,
  errorMessage,
  userId,
  requestUrl,
}) {
  const logUrl = process.env.LOG_URL
  const appKey = process.env.LOG_APP_KEY

  if (!logUrl || !appKey) {
    console.error("Log URL or APP Key not defined in environment variables.")
    return
  }

  const logPayload = {
    error_code  : statusCode,
    error_message : errorMessage,
    user_id : userId,
    request_url: requestUrl,
    appKey: appKey,
  }

  try {
    await fetch(logUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logPayload),
    })
  } catch (err) {
    console.error("Failed to log error:", err)
  }
}
