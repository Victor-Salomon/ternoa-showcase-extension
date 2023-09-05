"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export default function SidebarNav({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) =>
        item.title !== "Secret NFT" ? (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted border border-transparent"
                : "hover:bg-transparent border border-transparent hover:border-slate-300",
              "justify-start"
            )}
          >
            {item.title}
          </Link>
        ) : (
          <Popover key={item.href}>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "text-black bg-transparent hover:bg-muted hover:bg-transparent border border-transparent hover:border-slate-300",
                  "justify-start"
                )}
              >
                {item.title}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 text-sm">Coming soon... 😮‍💨</PopoverContent>
          </Popover>
        )
      )}
    </nav>
  );
}
