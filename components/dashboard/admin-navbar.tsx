"use client";

import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";

export default function AdminNavBar() {
  return (
  <nav className="flex justify-between items-center px-6 py-4 border-b border-border bg-dark text-light">
    <h1 className="text-2xl font-bold">Admin Panel</h1>

    <NavigationMenu>
      {/* Add NavigationMenuList here */}
      <NavigationMenuList className="flex gap-2"> 
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/admin" className="px-4 py-2 rounded-lg hover:bg-muted transition">
              Dashboard
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/admin/organization" className="px-4 py-2 rounded-lg hover:bg-muted transition">
              Organization View
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </nav>
);
}