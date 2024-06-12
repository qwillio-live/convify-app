import { Button } from "@/components/ui/button"
import {
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover"
import { ChevronsUpDown, Check } from "lucide-react"

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
  <div className="col-span-2 flex flex-col items-center space-y-2">
    <label
      htmlFor={label}
      className="basis-full self-start text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {label}
    </label>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex w-full items-center justify-between"
        >
          {selectedFont ? (
            <>
              {fontList?.find((font) => font.variable === selectedFont)?.name}
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </>
          ) : defaultFont ? (
            defaultFont
          ) : (
            `Select ${label.toLowerCase()}`
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-10 w-[200px] p-0">
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
    </Popover>
  </div>
)
