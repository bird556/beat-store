import { NavLink } from 'react-router-dom';
import BirdieLogo from '../../Images/logo.png';
import BirdieLogo1 from '../../Images/birdie2025-logo.png';

export const Logo = () => {
  return (
    <NavLink to="/" className="flex items-center space-x-2">
      <img
        className="w-32 pointer-events-none"
        src={BirdieLogo}
        alt="Birdie Bands Logo"
      />
      <img
        className="w-12 rounded-full pointer-events-none"
        src={BirdieLogo1}
        alt="Birdie Bands Logo"
      />
    </NavLink>
  );
};
