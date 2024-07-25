"use client"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signOut } from "next-auth/react"
import { isBrowser, isMobile } from "react-device-detect"
import Illustration from "@/assets/images/mobile-forwarder.png"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

interface User {
  name: string
  email: string
  image: string
  id: string
}

export default function MobileForwarder() {
  const [userData, setUserData] = useState<User>()
  const router = useRouter()
  const t = useTranslations("Components")

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user data:", error))
  }, [])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  // if (isBrowser) router.push("/dashboard")
  return (
    <div className="font-sans3  flex min-h-screen flex-col   bg-white text-center md:justify-normal">
      <header className="flex items-center justify-between border-b-2 bg-[#FAFBFC] p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold"
        >
          <svg
            className="h-8 w-8"
            viewBox="0 0 720 524"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_2503_36160"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="65"
              y="65"
              width="590"
              height="394"
            >
              <rect
                x="65.4551"
                y="65.4551"
                width="589.091"
                height="392.727"
                fill="#D9D9D9"
              />
            </mask>
            <g mask="url(#mask0_2503_36160)">
              <path
                d="M114.547 507.273L286.365 261.819L114.547 16.3643"
                stroke="white"
                strokeWidth="98.1818"
              />
              <path
                d="M114.547 507.273L286.365 261.819L114.547 16.3643"
                stroke="black"
                strokeWidth="98.1818"
              />
              <path
                d="M261.818 507.273L433.637 261.819L261.818 16.3643"
                stroke="white"
                strokeWidth="98.1818"
              />
              <path
                d="M261.818 507.273L433.637 261.819L261.818 16.3643"
                stroke="black"
                strokeOpacity="0.6"
                strokeWidth="98.1818"
              />
              <path
                d="M409.092 507.273L580.91 261.819L409.092 16.3643"
                stroke="white"
                strokeWidth="98.1818"
              />
              <path
                d="M409.092 507.273L580.91 261.819L409.092 16.3643"
                stroke="black"
                strokeOpacity="0.2"
                strokeWidth="98.1818"
              />
            </g>
          </svg>
          <span className="">Convify</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="flex h-[40px] w-[40px]  items-center justify-center rounded-full bg-[#eaeaec] p-0 text-base font-bold uppercase hover:bg-[#eaeaec]"
            >
              {userData ? (
                userData?.name ? (
                  userData?.name?.charAt(0).toUpperCase()
                ) : (
                  userData?.email?.charAt(0)
                )
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-user"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                </svg>
              )}
              <span className="sr-only">{t("Toggle user menu")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("My Account")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("Settings")}</DropdownMenuItem>
            <DropdownMenuItem>{t("Support")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              {t("Logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      {/* <Separator s /> */}
      <main className="mt-2 flex flex-col  text-center ">
        <div className="flex flex-col items-center">
          <Image
            src={Illustration}
            height={254}
            width={328}
            alt="Illustration"
            className="md:h-[350px] md:w-[450px]"
          />
          <h1 className="mx-9 mt-6 text-2xl font-semibold text-[#0F172A]">
            {t("Convify is best experienced on a bigger screen")}
          </h1>
          <p className="font-sans3 mx-[51px] mt-2 items-center text-sm font-normal text-[#64748B] ">
            {t(
              "Click the button below to send a link to your inbox and continue your journey with Convify on another device"
            )}
          </p>
        </div>
        <div className="font-sans3 mt-6 flex flex-col items-center justify-center space-y-2 md:space-y-4">
          <Button variant={"default"} size={"mobileForwarder"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-1 -1 16 16"
              width="1.5em"
              height="1.2em"
            >
              <g fill="none" stroke="currentColor">
                <rect width="13" height="10.5" x=".5" y="1.75" rx="1"></rect>
                <path d="m.5 3l5.86 5a1 1 0 0 0 1.28 0l5.86-5"></path>
              </g>
            </svg>
            <span className="ml-2">{t("Send to my inbox")}</span>
          </Button>
          <Button variant={"green"} size={"mobileForwarder"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-1 -1 16 16"
              width="1.5em"
              height="1.2em"
            >
              <g fill="none" stroke="currentColor">
                <path d="M7 .88C3.665.88.88 3.67.88 7.002a6.14 6.14 0 0 0 1.025 3.39L.877 13.127l3.439-.622A6.13 6.13 0 0 0 7 13.121c3.338.002 6.127-2.784 6.127-6.118c0-3.33-2.79-6.126-6.127-6.124Z"></path>
                <path d="M7.337 9.7c.829.531 1.692.144 2.294-.305c.415-.31.402-.907.047-1.285l-.7-.745c-.265.265-.783.397-1.142.287c-.773-.235-1.097-.637-1.36-1.047c-.301-.47.04-1.172.305-1.437l-.78-.712c-.329-.3-.828-.35-1.115-.01c-.568.673-.92 1.696-.503 2.347c.75 1.169 1.785 2.156 2.954 2.906Z"></path>
              </g>
            </svg>
            <span className="ml-2"> {t("Send on WhatsApp")}</span>
          </Button>
          <Button variant={"lightBlue"} size={"mobileForwarder"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-1 -1 16 16"
              width="1.5em"
              height="1.2em"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M.25 7a6.75 6.75 0 1 1 13.5 0A6.75 6.75 0 0 1 .25 7m9.002 4.064l1.045-7.932l-8.165 3.935l2.417.876l2.686-2.076a.5.5 0 1 1 .611.792L5.618 8.38v2.726l1.685-1.604z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="ml-2"> {t("Send on Telegram")}</span>
          </Button>
        </div>
      </main>
      <footer
        className="font-sans3 p-4 text-base font-semibold text-[#64748B] hover:cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        {t("Continue on mobile device")}
      </footer>
    </div>
  )
}
