import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { HexColorInput, HexColorPicker } from "react-colorful"

interface ColorInputProps {
  value?: string | undefined | null
  handleChange: (e: string) => void
  handleRemove?: () => void
  className?: string
}

export function ColorInput({
  value,
  handleChange,
  handleRemove,
  className,
}: ColorInputProps) {
  return (
    <Popover>
      <div className={cn("flex items-center gap-2", className)}>
        <PopoverTrigger asChild>
          <div
            style={{
              backgroundColor:
                typeof value === "string" && value[0] === "#"
                  ? value
                  : "transparent",
            }}
            className="relative h-[32px] w-[62px] overflow-hidden rounded-md"
          >
            {!(typeof value === "string"  && value[0] === "#") && (
              <div className="absolute inset-0 z-0 grid place-content-center rounded-md border bg-[#FAFAFA] text-xs text-[#7B7D80]">
                Choose
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-64 left-0" side="left">
          <HexColorPicker color={value ? value : undefined} onChange={handleChange}/>
          <HexColorInput
            prefixed
            color={value ? value : undefined} onChange={handleChange}
            className="w-full mt-2 border rounded text-center"/>
        </PopoverContent>
        {!!handleRemove
          ? typeof value === "string"  && value[0] === "#" && (
              <span onClick={() => handleRemove()}>
                <X size={16} className={"text-muted-foreground cursor-pointer"} />
              </span>
            )
          : null}
      </div>
    </Popover>
  )
}
