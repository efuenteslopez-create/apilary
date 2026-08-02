'use client';

import React, { createContext, useContext, useState } from 'react';
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

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'es';
  try {
    const saved = localStorage.getItem('apilary_lang');
    if (saved === 'en' || saved === 'es') return saved;
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) return 'en';
  } catch {
    // fallback
  }
  return 'es';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

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
