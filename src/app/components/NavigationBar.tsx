'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/cv', label: 'CV' },
];

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="justify-center py-4">
      <NavigationMenuList>
        {navItems.map(({ href, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <NavigationMenuItem key={href}>
              <NavigationMenuLink asChild>
                <Link
                  href={href}
                  className={`p-2 font-medium rounded-md hover:bg-muted hover:text-foreground ${
                    isActive
                      ? 'text-foreground font-semibold bg-muted'
                      : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
