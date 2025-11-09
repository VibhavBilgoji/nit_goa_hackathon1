"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MapPin,
  Map,
  Users,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Home,
  Shield,
  Menu,
  X,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Dock, DockIcon } from "@/components/magicui/dock";

export function Navigation() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const centerNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/report", label: "Report Issue", icon: PlusCircle },
    { href: "/map", label: "Map", icon: Map },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/team", label: "Team", icon: Users },
  ];

  const authItems = [
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Sign Up" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo - Left */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative size-8 sm:size-10 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="OurStreet Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-base sm:text-lg font-semibold text-black dark:text-white">
            OurStreet
          </span>
        </Link>

        {/* Center Navigation - Desktop Only with Dock Animation */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <TooltipProvider>
            <Dock direction="middle" magnification={50} distance={120}>
              {centerNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <DockIcon key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          aria-label={item.label}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "size-10 rounded-full",
                            isActive &&
                              "bg-gray-100 dark:bg-gray-900 text-black dark:text-white",
                          )}
                        >
                          <Icon className="size-4" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </DockIcon>
                );
              })}
            </Dock>
          </TooltipProvider>
        </div>

        {/* Right Side - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated && user?.role === "admin" && (
            <Link href="/admin">
              <Button
                size="sm"
                variant="outline"
                className="font-medium border-2 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <Shield className="mr-1.5 size-4" />
                <span className="hidden lg:inline">Admin Panel</span>
              </Button>
            </Link>
          )}
          {isAuthenticated && (
            <Link href="/report">
              <Button
                size="sm"
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-medium"
              >
                <PlusCircle className="mr-1.5 size-4" />
                <span className="hidden lg:inline">Report Issue</span>
              </Button>
            </Link>
          )}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="font-medium"
              >
                <LogOut className="mr-1.5 size-4" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <NavigationMenu>
              <NavigationMenuList>
                {authItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <NavigationMenuItem key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "font-medium",
                          isActive &&
                            "bg-gray-100 dark:bg-gray-900 text-black dark:text-white",
                          item.label === "Sign Up" &&
                            "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200",
                        )}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button and Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {/* Navigation Links */}
            {centerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-gray-100 dark:bg-gray-900 text-black dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900",
                  )}
                >
                  <Icon className="size-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-800 my-3" />

            {/* Admin Panel (if admin) */}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <Shield className="size-5" />
                <span className="font-medium">Admin Panel</span>
              </Link>
            )}

            {/* Report Issue (if authenticated) */}
            {isAuthenticated && (
              <Link
                href="/report"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                <PlusCircle className="size-5" />
                <span className="font-medium">Report Issue</span>
              </Link>
            )}

            {/* Auth Buttons */}
            {isAuthenticated && user ? (
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start gap-3 px-4 py-2.5 h-auto font-medium text-gray-600 dark:text-gray-400"
              >
                <LogOut className="size-5" />
                Logout
              </Button>
            ) : (
              <div className="space-y-2">
                {authItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-center px-4 py-2.5 rounded-lg font-medium transition-colors",
                      item.label === "Sign Up"
                        ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
