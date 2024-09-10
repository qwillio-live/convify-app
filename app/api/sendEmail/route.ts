export const runtime = "nodejs"

import { env } from "@/env.mjs"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { logError } from "@/lib/utils/logger"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return new Response("Unauthorized", { status: 403 })
    // }
    const body = await req.json()
    const { send_to, template_id, params } = body
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT, // Use 587 for STARTTLS, or 465 for SSL
      secure: false, // Set to true if using port 465
      auth: {
        user: process.env.SMTP_USER, // Your Gmail address
        pass: process.env.SMTP_PASS, // Your Gmail app password or actual password
      },
    })
    let template = await prisma.emailTemplate.findUnique({
      where: {
        id: template_id,
      },
    })
    console.log("template", template)
    if (template) {
      // Optionally, you could test sending an email
      let emailHtml = template.emailHtml
      //   const variables = JSON.parse(params)
      for (const [key, value] of Object.entries(params)) {
        emailHtml = emailHtml.replace(
          new RegExp(`{${key}}`, "g"),
          value as string
        )
      }

      const sendEmail = await transporter.sendMail({
        from: `<${template.emailFrom}>`, // Sender address
        to: send_to, // List of receivers
        subject: template.subject,
        html: emailHtml, // HTML body
      })
      const emailLog = await prisma.emailLog.create({
        data: {
          templateId: template.id,
          sendTo: send_to,
          subject: template.subject,
          emailHtml,
          sentAt: new Date(),
        },
      })
      // Return a success response
      return NextResponse.json({ status: "SENT", emailLog })
    } else {
      return NextResponse.json({
        status: "FAILED",
        message: "Template not found",
      })
    }
  } catch (error) {
    logError(error) // Log the error using your logging utility
    return NextResponse.json(
      { status: "FAILED", error: error.message },
      { status: 500 }
    )
  }
}
