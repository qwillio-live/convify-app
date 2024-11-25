import { User } from "@prisma/client"

import { Icons } from "@/components/icons"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number
    isPro: boolean
  }

type ContentProps = {
  handleStatusUpdate: (newStatus: string) => void
  status: string
}

export type TIntegrationCardData = {
  title: string
  description: string
  image: string | StaticImageData
  status: string
  alt: string
  id: number
  Content?: JSX.Element<ContentProps>
}

export type TSelectOptions = {
  id: number
  value: string
  label: string
}

export type Template = {
  id: number
  name: string
  isPopular: boolean
  img: string
  isRecommended: boolean
  category: string
}

export interface ComponentProps {
  displayName: string
  props: {
    containerBackground: string
    [key: string]: any // Any additional properties in the component
  }
}

export interface Data {
  [key: string]: ComponentProps
}
