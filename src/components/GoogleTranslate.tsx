// components/GoogleTranslate.tsx
import { useGoogleTranslate } from '../contexts/hooks/useGoogleTranslate';

const GoogleTranslate = () => {
  useGoogleTranslate();

  // GoogleTranslate.tsx
  return <div id="google_translate_element" className="translate-widget" />;
};

export default GoogleTranslate;
