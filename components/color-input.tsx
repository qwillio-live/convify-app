import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ColorPickerWithSuggestions } from "./color-picker-with-suggestions"
import { useRef, useState } from "react"
import { useOnClickOutside } from "@/hooks/use-click-outside"
import { createPortal } from "react-dom"

interface ColorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRemove?: () => void
}

export function ColorInput({
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
    handleChange({ target: { value: color } } as React.ChangeEvent<HTMLInputElement>)
  }

  const handleClick = () => {
    if (!isPickerVisible && containerRef.current) {
      const { right, top, height } = containerRef.current.getBoundingClientRect()
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
          className={cn(
            `hidden absolute min-w-52 z-30 -translate-x-full`,
            {
              'block': isPickerVisible,
            }
          )}
          style={{ left: containerRect.right, top: containerRect.top + containerRect.height }}
          color={value}
          onChange={onChange}
          {...rest}
        />,
        document.body
      )}
      <div ref={containerRef} className={cn("relative flex items-center gap-2", className)}>
        <div
          style={{
            backgroundColor:
              typeof value === "string" && value[0] === "#"
                ? value
                : "transparent",
          }}
          className="relative h-[32px] w-[62px] overflow-hidden rounded-md"
        >
          {!(typeof value === "string" && value[0] === "#") && (
            <div className="absolute inset-0 z-0 grid place-content-center rounded-md border bg-[#FAFAFA] text-xs text-[#7B7D80]">
              Choose
            </div>
          )}
          <button className="absolute w-full h-full opacity-0 cursor-pointer left-0 top-0" onClick={handleClick} />
        </div>
        {!!handleRemove
          ? typeof value === "string" &&
            value[0] === "#" && (
              <span onClick={() => handleRemove()}>
                <X size={16} className={"text-muted-foreground cursor-pointer"} />
              </span>
            )
          : null}
      </div>
    </>
  )
}
