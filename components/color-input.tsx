import { X } from "lucide-react"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"

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

  return (
    <div className={cn("flex items-center gap-2", className)}>
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

        <Input
          type="color"
          onChange={handleChange}
          value={value}
          className="h-8.5 opacity-0"
          {...rest}
        />
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
  )
}
