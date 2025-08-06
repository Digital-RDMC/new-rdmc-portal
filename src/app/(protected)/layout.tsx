"use client";
import Navigation from "@/components/Navigation";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import LoginPage from "@/app/(protected)/login/page";
import LoadingPage from "@/app/(protected)/loading/page";
// import LanguageSwitcher from "@/app/components/LanguageSwitcher";
interface Data {
  navMain: {
    title: string;
    icon?: string;
    isActive?: boolean;
    url: string;
    items?: {
      title: string;
      icon?: string;
      disabled?: boolean;
      target?: boolean;
      url: string;
      isActive?: boolean;
    }[];
  }[];
} 

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Check for vtoken cookie on component mount and when cookies change
  useEffect(() => {
    if (!isClient) return;
    
    const checkAuthToken = async () => {
      // Add minimum loading delay of 5 seconds for testing the new background
      const startTime = Date.now();
      const minLoadingTime = 5000; // 5 seconds for testing
      
      const vtoken = document.cookie
        .split('; ')
        .find(row => row.startsWith('vtoken='))
        ?.split('=')[1];
      
      setIsAuthenticated(!!vtoken);
      
      // Calculate remaining time to wait
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      // Wait for the remaining time before setting loading to false
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    };
    
    // Check initially
    checkAuthToken();
    
    // Set up an interval to check for cookie changes every 5 seconds
    const interval = setInterval(() => {
      // For interval checks, don't add delay - just update immediately
      const vtoken = document.cookie
        .split('; ')
        .find(row => row.startsWith('vtoken='))
        ?.split('=')[1];
      
      setIsAuthenticated(!!vtoken);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isClient]);
  
  const data: Data = {
   navMain: [
        {
          title: t('gettingStarted'),
          url: "#",
          items: [
          
            // Only show login if user is not authenticated
            ...(isAuthenticated ? [
{
              title: t('home'),
              url: "/",
              icon: 'HomeIcon',
            },


              {
                title: t('about'),
                url: "/about",
                icon: 'InfoIcon',
              },
              {
                title: t('ebusinessCard'),
                url: "/ebusinesscard",
                icon: 'InfoIcon',
              },
              
                {
              title: t('updateemps'),
              url: "/updateemps",
              icon: 'InfoIcon',
            },

            ] : [

              {
              title: t('login'),
              url: "/login",
              icon: 'HomeIcon',
            },
            {
              title: t('updateemps'),
              url: "/updateemps",
              icon: 'InfoIcon',
            },
            
              
            //   {
            //   title: t('login'),
            //   url: "/login",
            //   icon: 'ClipboardCheckIcon',
            // }
          
          ]),
          ],
        },
       
      ],
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {!isClient || isLoading ? (
        // Show loading page during SSR, initial hydration, and authentication check
        <LoadingPage />
      ) : isAuthenticated ? (
        <Navigation data={data}>{children}</Navigation>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}
