'use client';

import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
// import Marquee from 'react-fast-marquee';
import { NavLink } from 'react-router';
import BirdieLogo from '../../src/Images/logo.png';
import BirdieLogo1 from '../../src/Images/birdie2025-logo.png';

import CartModal from './cart-modal';
import { useCart } from '@/contexts/cart-context';

const Navbar = () => {
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="!sticky !top-0 z-[500] border-b border-foreground/30  backdrop-blur-sm bg-background dark:bg-black/70">
        {/* <div className="max-w-xl mx-auto">
          <Marquee
            gradient={false}
            gradientWidth={100}
            gradientColor="#0a0a0a"
            className="!bg-transparent font-medium"
          >
            15% OFF Code: BIRDIE15 🚀
          </Marquee>
        </div> */}

        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            {/* <Image
              src={BirdieLogo}
              alt="Birdie Bands Logo"
              width={200}
              height={200}
            /> */}
            {/* <img className="w-48" src={BirdieLogo} alt="Birdie Bands Logo" /> */}
            <img
              className="w-32 pointer !pointer-events-none"
              src={BirdieLogo}
              alt="Birdie Bands Logo"
            />
            <img
              className="w-12 rounded-full !pointer-events-none"
              src={BirdieLogo1}
              alt="Birdie Bands Logo"
            />
          </NavLink>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-5 list-none mr-[6.5rem]">
            <NavLink
              className={({ isActive }) =>
                `!bg-transparent hover:!border-transparent ${
                  isActive
                    ? '!text-green-400 border-b-2 border-white/55 drop-shadow-[0_0_4px_white]'
                    : 'text-foreground'
                }`
              }
              to="/"
            >
              <li className="text-foreground hover:text-green-400 transition-colors">
                Home
              </li>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `!bg-transparent hover:!border-transparent ${
                  isActive
                    ? '!text-green-400 border-b-2 border-white/55 drop-shadow-[0_0_4px_white]'
                    : 'text-foreground'
                }`
              }
              to="/beats"
            >
              <li className="text-foreground hover:text-green-400 transition-colors">
                Beats
              </li>
            </NavLink>
            {/* <NavLink
              to="/about"
              className="!bg-transparent hover:!border-transparent"
            >
              <li className="text-foreground hover:text-green-400 transition-colors">
                About
              </li>
            </NavLink> */}
            <NavLink
              to="/contact"
              className="!bg-transparent hover:!border-transparent"
            >
              <li className="text-foreground hover:text-green-400 transition-colors">
                Contact
              </li>
            </NavLink>
          </div>

          {/* Right side - Search, User, Cart, Hamburger */}
          <div className="flex items-center space-x-4">
            {/* Search - Hidden on mobile */}
            {/* <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search Beat"
                className="bg-gray-800 text-foreground px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 w-48"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div> */}

            {/* User Icon */}
            {/* <button className="text-foreground hover:text-green-400 transition-colors cursor-pointer !bg-transparent hover:!border-transparent">
              <User className="w-6 h-6" />
            </button> */}

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-foreground hover:text-green-400 transition-colors cursor-pointer !bg-transparent focus:!outline-transparent focus:!border-transparent hover:!border-transparent focus-visible:!outline-transparent focus-visible:!border-transparent"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger Menu - Visible on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-foreground hover:text-green-400 transition-colors !bg-transparent focus:!outline-transparent focus:!border-transparent hover:!border-transparent focus-visible:!outline-transparent focus-visible:!border-transparent"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 !outline-transparent focus:!outline-transparent" />
              ) : (
                <Menu className="w-6 h-6 !outline-transparent" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-foreground/30 ">
            <div className="flex flex-col space-y-4 pt-4 list-none transition-all duration-500">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="!bg-transparent hover:!border-transparent"
              >
                <li className="text-foreground hover:text-green-400 transition-colors">
                  Home
                </li>
              </NavLink>
              <NavLink
                to="/beats"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="!bg-transparent hover:!border-transparent"
              >
                <li className="text-foreground hover:text-green-400 transition-colors">
                  Beats
                </li>
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="!bg-transparent hover:!border-transparent"
              >
                <li className="text-foreground hover:text-green-400 transition-colors">
                  About
                </li>
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="!bg-transparent hover:!border-transparent"
              >
                <li className="text-foreground hover:text-green-400 transition-colors">
                  Contact
                </li>
              </NavLink>
            </div>
          </div>
        )}

        {/* Mobile Search - Always visible on smaller screens */}
        {/* <div className="mt-4 lg:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Beat"
              className="bg-gray-800 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div> */}
      </nav>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
