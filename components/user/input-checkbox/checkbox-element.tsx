"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  checkmarkColor?: string;
}



const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, checkmarkColor, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(false);

  const handleCheckChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={isChecked}
      onCheckedChange={handleCheckChange}
      className={cn(
        "peer h-4 w-4 shrink-0 border border-input ring-offset-background focus-visible:outline-none  rounded-[5px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center  justify-center text-primary")}
      >
        <Check
          className="h-4 w-4"
          style={{
            color: `${isChecked ? "#fff" : checkmarkColor}`,
            backgroundColor: `${isChecked ? checkmarkColor : "inherit"}`
          }}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
