import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    rangeClassName?: string;
    thumbLabel?: string;
  }
>(({ className, rangeClassName, thumbLabel, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center py-2", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-track">
      <SliderPrimitive.Range className={cn("absolute h-full bg-primary", rangeClassName)} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      aria-label={thumbLabel}
      className="block h-5 w-5 rounded-full border border-border bg-card shadow-soft transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
