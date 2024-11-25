import { Button } from "@/components/ui/button"
import {
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverPortal,
} from "@radix-ui/react-popover"
import { ChevronsUpDown, Check, ChevronDown } from "lucide-react"

interface FontSelectorProps {
  fontList: { name: string; variable: string }[] | undefined
  selectedFont: string | undefined
  handleFontChange: (value: string) => void
  label: string
  open: boolean
  setOpen: (value: boolean) => void
  defaultFont?: string
}

export const FontSelector = ({
  fontList,
  selectedFont,
  handleFontChange,
  label,
  open,
  setOpen,
  defaultFont,
}: FontSelectorProps) => (
  <div className="space-y-2">
    <Label htmlFor={label}>{label}</Label>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="bg-card flex h-9 w-full items-center justify-between border-inherit px-3 py-2 text-xs font-normal"
        >
          {selectedFont ? (
            <>
              {fontList?.find((font) => font.variable === selectedFont)?.name}
              <ChevronDown className="ml-2 size-4 shrink-0 text-[#7B7D80] opacity-50" />
            </>
          ) : defaultFont ? (
            defaultFont
          ) : (
            `Select ${label.toLowerCase()}`
          )}
        </Button>
      </PopoverTrigger>
      <PopoverPortal container={document.getElementById("create-flow-layout")}>
        <PopoverContent className="z-10 w-[--radix-popover-trigger-width] p-0">
          <ScrollArea className="h-72 rounded-md border">
            <Command>
              <CommandInput placeholder="Search font..." />
              <CommandEmpty>No font found.</CommandEmpty>
              <CommandGroup>
                {fontList?.map((font) => (
                  <CommandItem
                    key={font.variable}
                    value={font.variable}
                    onSelect={(currentValue) => {
                      handleFontChange(currentValue)
                      setOpen(false)
                    }}
                    style={{ fontFamily: `var(${font.variable})` }}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        selectedFont === font.variable
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {font.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </ScrollArea>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  </div>
)
