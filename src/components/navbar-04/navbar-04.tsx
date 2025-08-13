import { Logo } from './logo';
import { NavMenu } from './nav-menu';
import { NavigationSheet } from './navigation-sheet';

const Navbar04Page = () => {
  return (
    <nav className=" !sticky !top-0 z-[500] top-6 inset-x-4 h-16 backdrop-blur-sm bg-background dark:bg-black/0 dark:border-slate-700/70  mx-auto ">
      <div className="h-full flex items-center justify-between mx-auto px-4">
        <Logo />

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <button className="hidden sm:inline-flex rounded-full">
            Sign In
          </button>
          <button className="rounded-full">Get Started</button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar04Page;
