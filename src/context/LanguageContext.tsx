'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, Translations, translations } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'es',
  setLocale: () => {},
  t: translations.es
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('apilary_lang') as Locale | null;
      if (saved && (saved === 'en' || saved === 'es')) {
        setLocaleState(saved);
      } else {
        // Check browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('en')) {
          setLocaleState('en');
        } else {
          setLocaleState('es');
        }
      }
    } catch {
      // ignore in environments without localStorage
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('apilary_lang', newLocale);
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
