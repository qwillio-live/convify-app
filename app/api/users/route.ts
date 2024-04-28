import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session

    return new Response(JSON.stringify(user))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}
