import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { Check } from "lucide-react"

const loaderVariants = cva("inline-flex items-center justify-center", {
  variants: {
    size: {
      default: "h-32 w-32",
      small: "h-24 w-24",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "small"
  asChild?: boolean
  waitTime?: number
}

const CustomLoader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size, asChild = false, ...props }, ref) => {
    const [showIcon, setShowIcon] = React.useState(false)
    const defaultTime = props?.waitTime || 2

    React.useEffect(() => {
      setShowIcon(false)
      const timer = setTimeout(() => {
        setShowIcon(true)
      }, defaultTime * 1000)

      return () => clearTimeout(timer)
    }, [defaultTime])

    const Comp = asChild ? Slot : "div"

    const spinnerStyles: React.CSSProperties = {
      position: "relative",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }

    const iconStyles: React.CSSProperties = {
      position: "absolute",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#4050ff",
      visibility: showIcon ? "visible" : "hidden",
      border: showIcon
        ? `${size === "small" ? "1.6px solid #4050ff" : "2px solid #4050ff"}`
        : "none",
      borderRadius: showIcon ? "50%" : "none",
    }

    const spinnerAnimation = showIcon ? "none" : "spin 1s linear infinite"

    return (
      <Comp
        className={cn(loaderVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        <div className="spinner" style={spinnerStyles}>
          <div
            className="spinner-content"
            style={{
              display: showIcon ? "none" : "block",
              border: "2px solid rgba(0, 0, 0, 0.1)",
              borderLeftColor: "#4050ff",
              borderRadius: "50%",
              width: "100%",
              height: "100%",
              animation: spinnerAnimation,
            }}
          ></div>
          <div className="icon" style={iconStyles}>
            <Check size={90} strokeWidth={size === "small" ? 0.4 : 0.55} />
          </div>
        </div>
      </Comp>
    )
  }
)
CustomLoader.displayName = "Loader"

export default CustomLoader
