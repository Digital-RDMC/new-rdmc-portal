// src/lib/useLanguageUtils.ts
"use client";

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../components/LanguageProvider';

export interface LanguageUtils {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  setLanguageWithURL: (lang: string, rawParams?: URLSearchParams) => void;
  generateLocalizedLink: (path: string, lang: string) => string;
  isRTL: boolean;
}

export function useLanguageUtils(): LanguageUtils {
  const { language, changeLanguage } = useLanguage();
  const pathname = usePathname();

  // Change language with URL update (for sharing links)
  // Updated to receive searchParams as a parameter instead of using the hook
  const setLanguageWithURL = useCallback((lang: string, rawParams?: URLSearchParams) => {
    if (!['en', 'fr', 'ar'].includes(lang)) return;
    
    changeLanguage(lang);
    
    if (typeof window !== 'undefined') {
      // Create params without using the useSearchParams hook
      const params = rawParams || new URLSearchParams(window.location.search);
      params.set('lang', lang);
      
      // Update the URL without reloading the page
      const newUrl = `${pathname}?${params.toString()}`;
      window.history.pushState({}, '', newUrl);
    }
  }, [changeLanguage, pathname]);

  // Generate a link with language parameter
  const generateLocalizedLink = useCallback((path: string, lang: string) => {
    if (!path) return '';
    
    // Don't add the param if it's the default language
    if (lang === 'en') return path;
    
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}lang=${lang}`;
  }, []);

  return {
    currentLanguage: language,
    changeLanguage,
    setLanguageWithURL,
    generateLocalizedLink,
    isRTL: language === 'ar',
  };
}

export default useLanguageUtils;
