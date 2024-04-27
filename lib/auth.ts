import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"
import { Client } from "postmark"
import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

const postmarkClient = new Client(env.POSTMARK_API_TOKEN)

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // crednetials provider for login and sign up with email and password
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("Received credentials:", credentials)
        if (!credentials) {
          console.log("Credentials are missing")
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.username },
        })

        if (
          user &&
          bcrypt.compareSync(credentials.password, user.passwordHash)
        ) {
          return { id: user.id, name: user.email, email: user.email }
        } else {
          throw new Error("Invalid email or password")
        }
      },
    }),
    EmailProvider({
      from: env.SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const user = await db.user.findUnique({
          where: {
            email: identifier,
          },
          select: {
            emailVerified: true,
          },
        })

        const templateId = user?.emailVerified
          ? env.POSTMARK_SIGN_IN_TEMPLATE
          : env.POSTMARK_ACTIVATION_TEMPLATE
        if (!templateId) {
          throw new Error("Missing template id")
        }

        const result = await postmarkClient.sendEmailWithTemplate({
          TemplateId: parseInt(templateId),
          To: identifier,
          From: provider.from as string,
          TemplateModel: {
            action_url: url,
            product_name: siteConfig.name,
          },
          Headers: [
            {
              // Set this to prevent Gmail from threading emails.
              // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
              Name: "X-Entity-Ref-ID",
              Value: new Date().getTime() + "",
            },
          ],
        })

        if (result.ErrorCode) {
          throw new Error(result.Message)
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
}