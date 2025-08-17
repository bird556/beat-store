import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const MailerLitePopup = () => {
  useEffect(() => {
    // Load MailerLite script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://assets.mailerlite.com/js/universal.js';
    document.head.appendChild(script);

    // Initialize MailerLite
    script.onload = () => {
      (window as any).ml =
        (window as any).ml ||
        function () {
          ((window as any).ml.q = (window as any).ml.q || []).push(arguments);
        };
      (window as any).ml(
        'account',
        `${import.meta.env.VITE_MAILERLITE_ACCOUNT_ID}`
      );
    };

    console.log(
      'mailierelite ID: ',
      import.meta.env.VITE_MAILERLITE_ACCOUNT_ID
    );

    // Cleanup
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <Helmet>
      <meta name="mailerlite-popup" content="Beat Release Signup Form" />
    </Helmet>
  );
};

export default MailerLitePopup;
