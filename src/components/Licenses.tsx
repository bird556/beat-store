import { HoverEffect } from './ui/card-hover-effect';
import { useLicenses } from '../contexts/LicenseContext';
import { useState, useEffect } from 'react';
interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  bulletPoints: string[];
}
const Licenses = () => {
  const { licenses, loading, error } = useLicenses();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Once loading is false and licenses are fetched, set isInitialLoad to false
    if (!loading && licenses.length > 0) {
      setIsInitialLoad(false);
    }
  }, [loading, licenses]);

  if (error) {
    return (
      <>
        <div className="flex flex-col gap-12 py-12">
          <h2 className="font-bold text-2xl">Licensing Info</h2>
          <div className="max-w-lg md:max-w-6xl mx-auto px-8">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex flex-col gap-12 py-12">
        <h2 className="font-bold text-2xl">Licensing Info</h2>
        <div className="max-w-lg md:max-w-6xl mx-auto px-8">
          <HoverEffect
            items={useProjects() as Project[]}
            isLoading={isInitialLoad || loading}
          />
        </div>
      </div>
    </>
  );
};

export default Licenses;

const useProjects = () => {
  const { licenses } = useLicenses();
  return licenses.map((license) => ({
    id: license._id,
    title: license.title,
    description: license.description,
    link: '#',
    bulletPoints: license.features,
  }));
};
