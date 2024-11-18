import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { ColorPickerWithSuggestions } from "./ColorPickerWithSuggestions"
import { useState } from "react"


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
  console.log(value)
  const [open, setOpen] = useState(false);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={cn("flex items-center gap-2", className)}>

          <div
            style={{
              backgroundColor:
                typeof value === "string" && value[0] === "#"
                  ? value
                  : "transparent",
            }}
            className="relative h-[32px] w-[62px] overflow-hidden rounded-md"
            onClick={() => setOpen(true)}
          >
            {!(typeof value === "string" && value[0] === "#") && (
              <div className="absolute inset-0 z-0 grid place-content-center rounded-md border bg-[#FAFAFA] text-xs text-[#7B7D80]">
                Choose
              </div>
            )}


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
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">

          <ColorPickerWithSuggestions onChange={(value) => {
            handleChange({ target: { value } } as any)
            // setOpen(false)
          }} color={value} />

        </div>
      </PopoverContent>
    </Popover>

  )
}
