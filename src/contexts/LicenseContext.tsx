// context/LicenseContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

// const LicenseContext = createContext([]);
// export const useLicenses = () => useContext(LicenseContext);
interface License {
  id: string; // Example property
  title: string;
  description: string;
  features: string[]; // Assuming 'features' is an array of strings
  // Add other properties of a License here
  licenseDownloadLink: string;
}

// Define the shape of the context value
interface LicenseContextType {
  licenses: License[];
  loading: boolean;
}

const LicenseContext = createContext<LicenseContextType | undefined>(undefined); // Initialize with undefined

export const useLicenses = () => {
  const context = useContext(LicenseContext);
  if (context === undefined) {
    throw new Error('useLicenses must be used within a LicenseProvider');
  }
  return context;
};

export const LicenseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const [licenses, setLicenses] = useState([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/licenses');
        const data = await res.json();
        setLicenses(data);
        // setLoading(false);
        setTimeout(() => setLoading(false), 1000); // Set loading to false after 1 second
      } catch (error) {
        console.error('Failed to fetch licenses:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000); // Set loading to false after 1 second
      }
    };

    fetchLicenses();
  }, []);

  return (
    // <LicenseContext.Provider value={licenses}>
    <LicenseContext.Provider value={{ licenses, loading }}>
      {children}
    </LicenseContext.Provider>
  );
};
