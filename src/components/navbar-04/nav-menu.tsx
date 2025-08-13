// src/components/NavMenu.tsx
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils'; // Ensure you have this utility for className concatenation

interface NavMenuProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const NavMenu = ({
  className,
  orientation = 'horizontal',
}: NavMenuProps) => {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList
        className={cn(
          'gap-6',
          orientation === 'vertical' ? 'flex-col items-start' : 'space-x-0'
        )}
      >
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  navigationMenuTriggerStyle(),
                  '!bg-transparent hover:!border-transparent',
                  isActive
                    ? '!text-green-400 border-b-2 border-white/55 drop-shadow-[0_0_4px_white]'
                    : 'text-foreground hover:text-green-400'
                )
              }
            >
              Home
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <NavLink
              to="/beats"
              className={({ isActive }) =>
                cn(
                  navigationMenuTriggerStyle(),
                  '!bg-transparent hover:!border-transparent',
                  isActive
                    ? '!text-green-400 border-b-2 border-white/55 drop-shadow-[0_0_4px_white]'
                    : 'text-foreground hover:text-green-400'
                )
              }
            >
              Beats
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                cn(
                  navigationMenuTriggerStyle(),
                  '!bg-transparent hover:!border-transparent',
                  isActive
                    ? '!text-green-400 border-b-2 border-white/55 drop-shadow-[0_0_4px_white]'
                    : 'text-foreground hover:text-green-400'
                )
              }
            >
              Contact
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
