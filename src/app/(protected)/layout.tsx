"use client";
import Navigation from "@/components/Navigation";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
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
  const { t, i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check for vtoken cookie on component mount and when cookies change
  useEffect(() => {
    const checkAuthToken = () => {
      const vtoken = document.cookie
        .split('; ')
        .find(row => row.startsWith('vtoken='))
        ?.split('=')[1];
      
      setIsAuthenticated(!!vtoken);
    };
    
    // Check initially
    checkAuthToken();
    
    // Set up an interval to check for cookie changes every 5 seconds
    const interval = setInterval(checkAuthToken, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
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

            ] : [

              {
              title: t('login'),
              url: "/",
              icon: 'HomeIcon',
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
      <Navigation data={data}>{children}</Navigation>
    </div>
  );
}
