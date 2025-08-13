import { useTheme } from '@/contexts/theme-provider'; // Adjust the import path to your ThemeProvider
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sun, Moon, Laptop } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="text-foreground hover:text-green-400 transition-colors !bg-transparent focus:!outline-transparent focus:!border-transparent hover:!border-transparent focus-visible:!outline-transparent focus-visible:!border-transparent !ring-0 !shadow-none"
        >
          {theme === 'light' ? (
            <Sun className="w-6 h-6" />
          ) : theme === 'dark' ? (
            <Moon className="w-6 h-6" />
          ) : (
            <Laptop className="w-6 h-6" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-background dark:bg-black/70 border-foreground/30 z-[700]"
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="text-foreground hover:text-green-400"
        >
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="text-foreground hover:text-green-400"
        >
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="text-foreground hover:text-green-400"
        >
          <Laptop className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
