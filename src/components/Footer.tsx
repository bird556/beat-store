import React from 'react';
import BirdieLogo from '/src/Images/logo.png';
import { FaCcVisa } from 'react-icons/fa';
import { FaCcMastercard } from 'react-icons/fa';
import { FaCcPaypal } from 'react-icons/fa';
import { FaCcStripe } from 'react-icons/fa';
import { SiCoinbase } from 'react-icons/si';
import { MoveUp } from 'lucide-react';
import { Link, NavLink } from 'react-router';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="mb-32 z-40 py-10 relative">
      <footer className=" rounded-lg m-4 relative">
        <div className="max-w-6xl  mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <NavLink
              to={'/'}
              className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
            >
              <img
                src={BirdieLogo}
                className="h-8 translate-y-1"
                alt="Birdie Logo"
              />
            </NavLink>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium  sm:mb-0">
              <li>
                <NavLink
                  to={'/refund-policy'}
                  className="!text-foreground hover:!underline !transition-all !duration-300 me-4 md:me-6"
                >
                  Refund Policy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={'/privacy-policy'}
                  className="!text-foreground hover:!underline !transition-all !duration-300 me-4 md:me-6"
                >
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={'/terms-of-service'}
                  className="!text-foreground hover:!underline !transition-all !duration-300 me-4 md:me-6"
                >
                  Terms of Use
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={'/licenses'}
                  className="!text-foreground hover:!underline !transition-all !duration-300 me-4 md:me-6"
                >
                  Licensing
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={'/contact'}
                  className="!text-foreground hover:!underline !transition-all !duration-300"
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="min-[300px]:flex min-[300px]:justify-center min-[300px]:items-center sm:flex sm:items-center sm:justify-between">
            <a
              href="https://flowbite.com/"
              className=" hidenn flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
            >
              <img
                src={BirdieLogo}
                className="hidden h-8 translate-y-1"
                alt="Flowbite Logo"
              />
            </a>
            <ul className="flex flex-wrap items-center mb-6 min-sm:my-3 text-sm font-medium space-x-6 sm:mb-0">
              <li>
                <FaCcVisa size={30} />
              </li>
              <li>
                <FaCcMastercard size={30} />
              </li>
              <li>
                <FaCcPaypal size={30} />
              </li>
              <li>
                <FaCcStripe size={30} />
              </li>
              {/* <li>
                <SiCoinbase size={50} />
              </li> */}
            </ul>
          </div>
          <hr className="my-6 border-foreground sm:mx-auto dark:border-foreground/30 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © {currentYear}{' '}
            <a
              href="https://flowbite.com/"
              className="!text-foreground hover:underline"
            >
              Birdie Bands™
            </a>
            . All Rights Reserved.
          </span>
        </div>
        {/* <button className="sticky bottom-20 translate-x-96 ">
          <MoveUp />
        </button> */}
      </footer>
    </div>
  );
};

export default Footer;
