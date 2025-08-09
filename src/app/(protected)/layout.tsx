"use client";
import Navigation from "@/components/Navigation";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { UserProvider, useUser } from "@/contexts/UserContext";

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

// Protected content component that uses the user context
function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { userData, setUserData, isLoading, setIsLoading } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // userData is now available and will be populated when user is authenticated
  // This can be accessed by any child component using useUser() hook
  console.log("Current user data:", userData); // Log for debugging purposes

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
        .split("; ")
        .find((row) => row.startsWith("vtoken="))
        ?.split("=")[1];

      const tokenVerification = await fetch(
        "https://n8n.srv869586.hstgr.cloud/webhook/logged",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${vtoken}`,
          },
        }
      );

      if (!vtoken || !tokenVerification.ok) {
        console.error("No valid vtoken found or token verification failed");
        setIsAuthenticated(false);
        setUserData(null); // Clear user data
        setIsLoading(false);
        return;
      } else {
        const data = await tokenVerification.json();
        // console.log('vtoken/ is valid:', data[0]);

        // Store the employee data in context
        setUserData(data);
        setIsAuthenticated(!!vtoken);

        // Calculate remaining time to wait
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        // Wait for the remaining time before setting loading to false
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    };

    // Check initially
    checkAuthToken();

    // Set up an interval to check for cookie changes every 5 seconds
    const interval = setInterval(() => {
      // For interval checks, don't add delay - just update immediately
      const vtoken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("vtoken="))
        ?.split("=")[1];

      setIsAuthenticated(!!vtoken);
      if (!vtoken) {
        setUserData(null); // Clear user data when token is gone
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isClient, setUserData, setIsLoading]);

  const admin = userData?.[0]?.position === "Head of Digital" || false; // Check if user has admin access

  const data: Data = {
    navMain: [
      {
        title: t("gettingStarted"),
        url: "#",
        items: [
          // Only show login if user is not authenticated
          ...(isAuthenticated
            ? [
                {
                  title: t("home"),
                  url: "/",
                  icon: "HomeIcon",
                },

                {
                  title: t("about"),
                  url: "/about",
                  icon: "InfoIcon",
                },
                {
                  title: t("ebusinessCard"),
                  url: "/ebusinesscard",
                  icon: "InfoIcon",
                },

                ...(admin
                  ? [
                     
                    ]
                  : []),
              ]
            : [
                {
                  title: t("login"),
                  url: "/login",
                  icon: "HomeIcon",
                },
                {
                  title: t("updateemps"),
                  url: "/updateemps",
                  icon: "InfoIcon",
                },

                //   {
                //   title: t('login'),
                //   url: "/login",
                //   icon: 'ClipboardCheckIcon',
                // }
              ]),
        ],
      },

      ...(admin
        ? [
            {
              title: t("adiminPanel"),
              url: "#",
              items: [
                 {
                        title: t("updateemps"),
                        url: "/updateemps",
                        icon: "InfoIcon",
                      },
                      {
                        title: t("usersmanagement"),
                        url: "/usersmanagement",
                        icon: "UsersIcon",
                      }
              ],
            },
          ]
        : []),
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

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <ProtectedContent>{children}</ProtectedContent>
    </UserProvider>
  );
}
