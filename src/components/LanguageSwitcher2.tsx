// src/app/components/LanguageSwitcher.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation,  } from 'react-i18next';
import { useLanguage } from './LanguageProvider';
import { usePathname } from 'next/navigation';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import Image from 'next/image';
// import { LanguagesIcon } from 'lucide-react';
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
        <Button variant={'ghost'}  className="bg-transparent hover:bg-transparent text-secondary-foreground border-0 cursor-pointer">
          {t({
            en: 'English',
            fr: 'Français',
            ar: 'العربية',
          }[(searchParams.get('lang') as 'en' | 'fr' | 'ar') || 'en'])}

          <Image src={`/images/${(searchParams.get('lang') as 'en' | 'fr' | 'ar') || 'en'}.png`} alt="Language Icon" width={16} height={16} className="h-4 w-4" />

          {/* <LanguagesIcon /> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {searchParams.get('lang') as 'en' | 'fr' | 'ar' !== 'en'  && searchParams.get('lang') !== "" && (
          <DropdownMenuItem className='flex flex-row items-center justify-between' onClick={() => handleLanguageChange('en')}>
            <span> {t('english')}</span>  <Image src={`/images/en.png`} alt="Language Icon" width={16} height={16} className="h-4 w-4" />
          </DropdownMenuItem>
        )}
        {searchParams.get('lang') as 'en' | 'fr' | 'ar' !== 'fr'  && (
          <DropdownMenuItem className='flex flex-row items-center justify-between' onClick={() => handleLanguageChange('fr')}>
            <span> {t('french')}</span>  <Image src={`/images/fr.png`} alt="Language Icon" width={16} height={16} className="h-4 w-4" />
          </DropdownMenuItem>
        )}
        {searchParams.get('lang') as 'en' | 'fr' | 'ar' !== 'ar'  && (
          <DropdownMenuItem className='flex flex-row items-center justify-between' onClick={() => handleLanguageChange('ar')}>
            <span> {t('arabic')}</span>  <Image src={`/images/ar.png`} alt="Language Icon" width={16} height={16} className="h-4 w-4" />
          </DropdownMenuItem>
        )}
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
