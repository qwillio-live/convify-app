export async function logError({
  error_code,
  error_message,
  user_id,
  request_url,
}) {
  const logUrl = process.env.LOG_URL
  const appKey = process.env.LOG_APP_KEY

  if (!logUrl || !appKey) {
    console.error("Log URL or APP Key not defined in environment variables.")
    return
  }

  const logPayload = {
    error_code,
    error_message,
    user_id,
    request_url,
    appKey,
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
