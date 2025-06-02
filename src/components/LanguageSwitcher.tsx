// src/app/components/LanguageSwitcher.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';
import { usePathname } from 'next/navigation';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { LanguagesIcon } from 'lucide-react';
import { SearchParamsWrapper } from '@/components/SearchParamsWrapper';

// Inner component that uses searchParams
const LanguageSwitcherContent = ({ searchParams }: { searchParams: URLSearchParams }) => {
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Handler that changes language and updates URL
  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    
    // Update URL with language parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang);
    
    // Update URL without navigation
    window.history.pushState({}, '', `${pathname}?${params.toString()}`);
  };

  // Only show component after client-side hydration to prevent mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until after hydration to avoid mismatch
  if (!mounted) {
    return <div className="h-12"></div>; // Placeholder with similar height
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full border-0">
          <LanguagesIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          {t('english')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('fr')}>
          {t('french')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('ar')}>
          {t('arabic')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Outer component that wraps with SearchParamsWrapper
const LanguageSwitcher: React.FC = () => {
  return (
    <SearchParamsWrapper>
      {(searchParams: URLSearchParams) => <LanguageSwitcherContent searchParams={searchParams} />}
    </SearchParamsWrapper>
  );
};

export default LanguageSwitcher;
