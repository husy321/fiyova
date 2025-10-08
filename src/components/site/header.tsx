"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, LogOut, User, ShoppingCart } from "lucide-react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Badge } from "@heroui/react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { CreditBalanceBadge } from "@/components/ui/credit-balance-badge";
// import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { usePathname } from "next/navigation";

export function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; name: string; role?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { getCartCount } = useCart();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login" || pathname === "/signup";
  const cartCount = getCartCount();

  // Prevent hydration mismatch by only rendering Sheet after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple localStorage-based auth check
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  console.log("Header: user state:", user, "isLoading:", isLoading);

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/fiyova-logo.svg" alt="Fiyova" width={32} height={32} className="size-8" />
            <Link href="/" className="text-lg font-bold tracking-tight">Fiyova</Link>
          </div>

          {/* Center Navigation - Hidden on mobile and login page */}
          {!isLoginPage && (
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
              <nav className="flex items-center gap-1 bg-default-100 rounded-full px-6 py-2 border border-default-200">
                <Link href="/" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-default-200 rounded-full transition-all duration-200">
                  Home
                </Link>
                <Link href="/products" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-default-200 rounded-full transition-all duration-200">
                  Products
                </Link>
                <Link href="/faq" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-default-200 rounded-full transition-all duration-200">
                  FAQ
                </Link>
              </nav>
            </div>
          )}

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {/* Credit Balance */}
            {user && <CreditBalanceBadge />}
            {/* Cart Icon */}
            <Badge content={cartCount} color="primary" isInvisible={cartCount === 0}>
              <Button as={Link} href="/cart" isIconOnly variant="light" radius="full">
                <ShoppingCart size={20} />
              </Button>
            </Badge>
            {user ? (
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly variant="light" radius="full">
                    <User size={20} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="dashboard" as={Link} href="/dashboard" startContent={<User size={16} />}>
                    Dashboard
                  </DropdownItem>
                  <DropdownItem key="transactions" as={Link} href="/account/transactions" startContent={<User size={16} />}>
                    My Transactions
                  </DropdownItem>
                  {user?.role === "admin" ? (
                    <DropdownItem key="admin" as={Link} href="/admin" startContent={<User size={16} />}>
                      Admin Panel
                    </DropdownItem>
                  ) : null}
                  <DropdownItem key="logout" startContent={<LogOut size={16} />} onClick={() => logout()}>
                    Sign out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Button as={Link} href={isLoginPage ? "/signup" : "/login"} color="primary" variant="shadow" radius="full">
                {isLoginPage ? "Sign up" : "Sign in"}
              </Button>
            )}
          </div>
          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            {mounted && (
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button isIconOnly aria-label="Open menu" variant="light" radius="full">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image src="/fiyova-logo.svg" alt="Fiyova" width={32} height={32} className="size-8" />
                      <span className="text-lg font-bold tracking-tight">Fiyova</span>
                    </div>
                    <SheetClose asChild>
                      <Button isIconOnly aria-label="Close menu" variant="light" radius="full">
                        <X className="size-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  <nav className="mt-8 grid gap-2">
                    <Link onClick={() => setOpen(false)} href="/" className="rounded-full px-4 py-3 text-base font-medium hover:bg-default-100 transition-colors">Home</Link>
                    <Link onClick={() => setOpen(false)} href="/products" className="rounded-full px-4 py-3 text-base font-medium hover:bg-default-100 transition-colors">Products</Link>
                    <Link onClick={() => setOpen(false)} href="/faq" className="rounded-full px-4 py-3 text-base font-medium hover:bg-default-100 transition-colors">FAQ</Link>
                  </nav>
                  <div className="mt-8">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 px-4 py-3 bg-default-100 rounded-full">
                          <User size={20} />
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <Button className="w-full" color="danger" variant="light" radius="full" size="lg" startContent={<LogOut size={16} />} onClick={() => logout()}>
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <Button as={Link} href={isLoginPage ? "/signup" : "/login"} className="w-full" color="primary" variant="shadow" radius="full" size="lg">
                        {isLoginPage ? "Sign up" : "Sign in"}
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


