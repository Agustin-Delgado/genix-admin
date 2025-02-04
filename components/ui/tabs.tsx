"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const [underlineStyle, setUnderlineStyle] = React.useState({ left: "0px", width: "0px" });
  const tabsRef = React.useRef<(HTMLButtonElement | null)[]>([]);

  const updateUnderline = React.useCallback(() => {
    const activeTab = tabsRef.current.find((tab) => tab?.getAttribute("data-state") === "active");
    if (activeTab) {
      const { offsetLeft, offsetWidth } = activeTab;
      setUnderlineStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px` });
    }
  }, []);

  React.useLayoutEffect(() => {
    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [updateUnderline]);

  React.useLayoutEffect(() => {
    updateUnderline();
  }, [children]);

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn("relative inline-flex items-center gap-2 w-full", className)}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ ref?: React.Ref<HTMLButtonElement> }>, {
            ref: (el: any) => (tabsRef.current[index] = el),
          });
        }
        return child;
      })}
      <div
        className="absolute bottom-0 h-0.5 bg-primary transition-[left,width] duration-300 ease-in-out"
        style={underlineStyle}
      />
    </TabsPrimitive.List>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const button = e.currentTarget;
    const x = e.clientX - button.getBoundingClientRect().left;
    const y = e.clientY - button.getBoundingClientRect().top;
    const ripples = document.createElement("span");

    ripples.style.cssText = `
        left: ${x}px; 
        top: ${y}px; 
        position: absolute; 
        transform: translate(-50%, -50%); 
        pointer-events: none; 
        border-radius: 50%; 
        animation: ripple 500ms linear infinite; 
        `;

    ripples.classList.add(...'bg-black/15'.split(" "));
    button.appendChild(ripples);

    setTimeout(() => {
      ripples.remove();
    }, 500);
  };

  return <TabsPrimitive.Trigger
    ref={ref}
    onMouseDown={handleClick}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
