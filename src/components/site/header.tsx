"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@heroui/react";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="size-6 rounded bg-foreground" />
            <Link href="/" className="text-sm font-semibold tracking-tight">Fiyova</Link>
          </div>
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-1">
                <NavigationMenuItem>
                  <NavigationMenuLink href="/products" className="px-3 py-2 text-sm text-foreground/80 hover:text-foreground">Products</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#faq" className="px-3 py-2 text-sm text-foreground/80 hover:text-foreground">FAQ</NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button as={Link} href="#login" color="primary" variant="shadow">
              Sign in
            </Button>
            <ThemeToggle />
          </div>
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button isIconOnly aria-label="Open menu" variant="light" radius="full">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="size-6 rounded bg-foreground" />
                    <span className="text-sm font-semibold tracking-tight">Fiyova</span>
                  </div>
                  <SheetClose asChild>
                    <Button isIconOnly aria-label="Close menu" variant="light" radius="full">
                      <X className="size-5" />
                    </Button>
                  </SheetClose>
                </div>
                <nav className="mt-6 grid gap-1">
                  <Link onClick={() => setOpen(false)} href="/products" className="rounded-md px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10">Products</Link>
                  <Link onClick={() => setOpen(false)} href="#faq" className="rounded-md px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10">FAQ</Link>
                </nav>
                <div className="mt-4 flex items-center gap-2">
                  <Button className="flex-1" color="primary" variant="shadow">Sign in</Button>
                  <ThemeToggle />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}


