import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from "@/components/ui";
import { Home, LogOutIcon, Menu, Settings, User, Users, X } from "lucide-react";
import logo from "/favicon.ico";

const navigationMenuItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Players", href: "/players", icon: Users },
  { name: "Admin", href: "/admin", icon: Settings },
];

const profileMenuItems = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Log Out", href: "/logout", icon: LogOutIcon },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-200">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-neutral-900 text-neutral-100 px-2">
        {/* Header Items Container */}
        <div className="flex flex-1  h-16 items-center justify-between mx-auto container gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} className="h-12 w-12" />
            <span>Sicktown Poker</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center justify-between gap-4">
            {navigationMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex gap-1 font-medium  text-neutral-300 hover:text-white items-center"
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Profile Menu */}
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-300 hover:text-white hover:bg-neutral-800 mr-2"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {profileMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.name}>
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-5 w-5"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-neutral-800 border-t border-neutral-500">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Menu Nav */}
              <div className="space-y-3">
                {navigationMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-base font-medium text-neutral-300 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex">
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </div>
              <DropdownMenuSeparator />
              {/* Mobile Profile Menu */}
              <div className="pt-4 space-y-3">
                {profileMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-base font-medium text-neutral-300 hover:text-white"
                      // className="flex"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex">
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 h-[calc(100vh-4rem)]">
        <div className="mx-auto p-2 h-full container bg-neutral-100">
          {children}
        </div>
      </main>
    </div>
  );
}
