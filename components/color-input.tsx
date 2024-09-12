import { X } from "lucide-react"
import { Input } from "./ui/input"

interface ColorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRemove: () => void
}

export function ColorInput({
  value,
  handleChange,
  handleRemove,
  ...rest
}: ColorInputProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        style={{ backgroundColor: (value as string) ?? "transparent" }}
        className="relative h-[32px] w-[62px] overflow-hidden rounded-sm"
      >
        {!value ||
          (!!(value === "transparent") && (
            <div className="absolute inset-0 z-0 grid place-content-center border text-xs text-[#7B7D80]">
              Choose
            </div>
          ))}
        <Input
          type="color"
          onChange={handleChange}
          className="h-full opacity-0"
          {...rest}
        />
      </div>
      {!!value && !(value === "transparent") && (
        <span onClick={() => handleRemove()}>
          <X size={16} className={"text-muted-foreground cursor-pointer"} />
        </span>
      )}
    </div>
  )
}
