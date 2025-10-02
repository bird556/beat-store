import { useEffect } from 'react';

// Use a global flag to prevent multiple script injections
let isScriptInjected = false;

export const useGoogleTranslate = () => {
  useEffect(() => {
    // 1. Prevent multiple script injections
    if (isScriptInjected) {
      return;
    }

    // 2. Define the callback function globally
    // Use an 'if' check to prevent redefinition errors if another part
    // of the application also tries to load the translation widget.
    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        // Ensure 'google' object is available before calling TranslateElement
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,de,es,fr,it,nl,pt,ja,zh-CN',
              layout: (window as any).google.translate.TranslateElement
                .InlineLayout.SIMPLE,
            },
            'google_translate_element'
          );
        }
      };
    }

    // 3. Inject the script only once
    const script = document.createElement('script');
    script.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    isScriptInjected = true;

    // Optional cleanup (less critical for scripts injected to body)
    // return () => {
    //   // Potentially remove the script and the element on unmount
    // };
  }, []);
};
