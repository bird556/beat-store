// context/LicenseContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

// const LicenseContext = createContext([]);
// export const useLicenses = () => useContext(LicenseContext);
interface License {
  _id: string; // Example property
  type: string;
  title: string;
  licenseDownloadLink: string;
  features: string[]; // Assuming 'features' is an array of strings
  description: string;
  created_at: string;
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
  const [retries, setRetries] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL_BACKEND}/api/licenses`
        );
        const data = await res.json();
        setLicenses(data);
        // setLoading(false);
        setTimeout(() => setLoading(false), 1000); // Set loading to false after 1 second
      } catch (error) {
        console.error('Failed to fetch licenses:', error);
        if (retries < MAX_RETRIES) {
          console.log(`Retrying... Attempt ${retries + 1} of ${MAX_RETRIES}`);
          setTimeout(() => {
            setRetries(retries + 1);
          }, RETRY_DELAY);
        } else {
          console.error('Max retries reached. Giving up.');
          setLoading(false);
        }
      } finally {
        setTimeout(() => setLoading(false), 1000); // Set loading to false after 1 second
      }
    };

    fetchLicenses();
  }, [retries]);

  return (
    // <LicenseContext.Provider value={licenses}>
    <LicenseContext.Provider value={{ licenses, loading }}>
      {children}
    </LicenseContext.Provider>
  );
};
