// context/LicenseContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

const LicenseContext = createContext([]);

export const useLicenses = () => useContext(LicenseContext);

export const LicenseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/licenses');
        const data = await res.json();
        setLicenses(data);
      } catch (error) {
        console.error('Failed to fetch licenses:', error);
      }
    };

    fetchLicenses();
  }, []);

  return (
    <LicenseContext.Provider value={licenses}>
      {children}
    </LicenseContext.Provider>
  );
};
