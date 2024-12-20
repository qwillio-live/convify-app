import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ColorPickerWithSuggestions } from "./color-picker-with-suggestions"
import { useRef, useState } from "react"
import { useOnClickOutside } from "@/hooks/use-click-outside"
import { createPortal } from "react-dom"

type ColorInputType = "primary" | "squared"

interface ColorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  inputType?: ColorInputType
  inputSize?: "sm" | "md" | "lg"
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRemove?: () => void
}

export function ColorInput({
  inputType = "primary",
  inputSize = "md",
  value,
  handleChange,
  handleRemove,
  className,
  ...rest
}: ColorInputProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const [isPickerVisible, setIsPickerVisible] = useState(false)
  const [containerRect, setContainerRect] = useState({
    right: 0,
    top: 0,
    height: 0,
  })

  const onChange = (color: string) => {
    handleChange({
      target: { value: color },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  const handleClick = () => {
    if (!isPickerVisible && containerRef.current) {
      const { right, top, height } =
        containerRef.current.getBoundingClientRect()
      setContainerRect({
        right,
        top,
        height,
      })
    }
    setIsPickerVisible((visible) => !visible)
  }

  const handleClose = () => {
    setIsPickerVisible(false)
  }

  useOnClickOutside(pickerRef, handleClose)

  return (
    <>
      {createPortal(
        <ColorPickerWithSuggestions
          ref={pickerRef}
          className={cn(`absolute z-30 hidden min-w-52 -translate-x-full`, {
            block: isPickerVisible,
          })}
          style={{
            left: containerRect.right,
            top: containerRect.top + containerRect.height,
          }}
          color={value}
          onChange={onChange}
          {...rest}
        />,
        document.body
      )}
      <div
        ref={containerRef}
        className={cn("relative flex items-center gap-2", className)}
      >
        <div
          style={{
            backgroundColor:
              typeof value === "string" && value[0] === "#"
                ? value
                : "transparent",
          }}
          className={cn("relative overflow-hidden rounded-md", {
            "h-[24px] w-[48px]": inputType === "primary" && inputSize === "sm",
            "h-[32px] w-[62px]": inputType === "primary" && inputSize === "md",
            "h-[40px] w-[80px]": inputType === "primary" && inputSize === "lg",
            "h-[24px] w-[24px]": inputType === "squared" && inputSize === "sm",
            "h-[32px] w-[32px]": inputType === "squared" && inputSize === "md",
            "h-[40px] w-[40px]": inputType === "squared" && inputSize === "lg",
          })}
        >
          {!(typeof value === "string" && value[0] === "#") && (
            <div className="absolute inset-0 z-0 grid place-content-center rounded-md border bg-[#FAFAFA] text-xs text-[#7B7D80]">
              Choose
            </div>
          )}
          <button
            className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
            onClick={handleClick}
          />
        </div>
        {!!handleRemove
          ? typeof value === "string" &&
            value[0] === "#" && (
              <span onClick={() => handleRemove()}>
                <X
                  size={16}
                  className={"text-muted-foreground cursor-pointer"}
                />
              </span>
            )
          : null}
      </div>
    </>
  )
}
