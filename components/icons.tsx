import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  LucideProps,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  AlertCircle,
  LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
  logo: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  error: AlertCircle,
  googleSignup: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 45"
      {...props}
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  ),
  google: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  ),
  SquareCheck: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-square-check mr-2"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  SquarePen: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-square-pen"
      {...props}
    >
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
    </svg>
  ),
  NotebookPen: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-notebook-pen"
    >
      <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
      <path d="M2 6h4" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
    </svg>
  ),
  twitter: Twitter,
  check: Check,
  Delete: ({ ...props }: LucideProps) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_822_6838)">
        <path
          d="M13.3333 3.33301C13.5101 3.33301 13.6797 3.40325 13.8047 3.52827C13.9298 3.65329 14 3.82286 14 3.99967C14 4.17649 13.9298 4.34605 13.8047 4.47108C13.6797 4.5961 13.5101 4.66634 13.3333 4.66634H12.6667L12.6647 4.71367L12.0427 13.4277C12.0187 13.7641 11.8682 14.0789 11.6214 14.3087C11.3746 14.5386 11.0499 14.6663 10.7127 14.6663H5.28667C4.94943 14.6663 4.62471 14.5386 4.37792 14.3087C4.13114 14.0789 3.98061 13.7641 3.95667 13.4277L3.33467 4.71434C3.33366 4.69836 3.33321 4.68235 3.33333 4.66634H2.66667C2.48986 4.66634 2.32029 4.5961 2.19526 4.47108C2.07024 4.34605 2 4.17649 2 3.99967C2 3.82286 2.07024 3.65329 2.19526 3.52827C2.32029 3.40325 2.48986 3.33301 2.66667 3.33301H13.3333ZM11.3313 4.66634H4.66867L5.28733 13.333H10.7127L11.3313 4.66634ZM9.33333 1.33301C9.51014 1.33301 9.67971 1.40325 9.80474 1.52827C9.92976 1.65329 10 1.82286 10 1.99967C10 2.17649 9.92976 2.34605 9.80474 2.47108C9.67971 2.5961 9.51014 2.66634 9.33333 2.66634H6.66667C6.48986 2.66634 6.32029 2.5961 6.19526 2.47108C6.07024 2.34605 6 2.17649 6 1.99967C6 1.82286 6.07024 1.65329 6.19526 1.52827C6.32029 1.40325 6.48986 1.33301 6.66667 1.33301H9.33333Z"
          fill="#7B7D80"
        />
      </g>
      <defs>
        <clipPath id="clip0_822_6838">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  GripVertical: ({ ...props }: LucideProps) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.375 3.67C7.375 3.025 6.815 2.5 6.125 2.5C5.435 2.5 4.875 3.025 4.875 3.67C4.875 4.316 5.435 4.84 6.125 4.84C6.815 4.84 7.375 4.316 7.375 3.67ZM7.375 12.33C7.375 11.684 6.815 11.16 6.125 11.16C5.435 11.16 4.875 11.684 4.875 12.33C4.875 12.975 5.435 13.5 6.125 13.5C6.815 13.5 7.375 12.975 7.375 12.33ZM6.125 6.83C6.815 6.83 7.375 7.355 7.375 8C7.375 8.645 6.815 9.17 6.125 9.17C5.435 9.17 4.875 8.645 4.875 8C4.875 7.355 5.435 6.83 6.125 6.83ZM11.125 3.67C11.125 3.025 10.565 2.5 9.875 2.5C9.185 2.5 8.625 3.025 8.625 3.67C8.625 4.316 9.185 4.84 9.875 4.84C10.565 4.84 11.125 4.316 11.125 3.67ZM9.875 11.16C10.565 11.16 11.125 11.684 11.125 12.33C11.125 12.975 10.565 13.5 9.875 13.5C9.185 13.5 8.625 12.975 8.625 12.33C8.625 11.684 9.185 11.16 9.875 11.16ZM11.125 8C11.125 7.355 10.565 6.83 9.875 6.83C9.185 6.83 8.625 7.355 8.625 8C8.625 8.645 9.185 9.17 9.875 9.17C10.565 9.17 11.125 8.645 11.125 8Z"
        fill="#7B7D80"
      />
    </svg>
  ),
}
