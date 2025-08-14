"use client";
import Navigation from "@/components/Navigation";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { UserProvider, useUser , UserData} from "@/contexts/UserContext";

import LoginPage from "@/app/(protected)/login/page";
import AddPassword from "@/app/(protected)/login/add_password"; 
import LoadingPage from "@/components/LoadingPage";
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
      hidden?: boolean;
      target?: boolean;
      url: string;
      isActive?: boolean;
    }[];
  }[];
}

// Helper function to safely get cookie value
function getCookie(name: string): string | null {
  try {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(";").shift();
      return cookieValue || null;
    }
    return null;
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return null;
  }
}



// Protected content component that uses the user context
function ProtectedContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();
  const { userData, setUserData, isLoading, setIsLoading, vtoken, setVtoken } =
    useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // userData is now available and will be populated when user is authenticated
  // This can be accessed by any child component using useUser() hook
  // console.log("Current user data:", userData); // Log for debugging purposes

  // Check for client-side hydration
  useEffect(() => {
    setIsClient(true);
    // Check for vtoken cookie on component mount
    const vtokenInit = getCookie("vtoken");
    console.log("Initial vtoken from cookies:", vtokenInit);
    if (vtokenInit) {
      setVtoken(vtokenInit);
    } else {
      setIsAuthenticated(false);
      setUserData(null);
      setIsLoading(false);
      return;
    }
  }, []);

  // Check for vtoken cookie on component mount and when cookies change
  useEffect(() => {
    if (!isClient) return;

    const checkAuthToken = async () => {
      // Add minimum loading delay of 5 seconds for testing the new background
      const startTime = Date.now();
      const minLoadingTime = 5000; // 5 seconds for testing

      try {
        // console.log("vtoken2:", vtoken);
        // console.log("Found vtoken, verifying...");

        // Verify token with the server

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

        if (!tokenVerification.ok) {
          setIsAuthenticated(false);
          setUserData(null);
          setIsLoading(false);
          return;
        } else {
          // console.log("vtoken3:", vtoken);

          // Check if response has content before parsing JSON
          const responseText = await tokenVerification.text();

          if (!responseText || responseText.trim() === "") {
            console.error("Empty response from token verification endpoint");
            setIsAuthenticated(false);
            setUserData(null);

            setIsLoading(false);
            return;
          }
          // console.log("vtoken4:", vtoken);

          try {
            const data: UserData[] = JSON.parse(responseText);
            // console.log('Token verification successful. User data:', data[0]);

            // Store the employee data in context
            // console.log("Storing user data in context:", {...data, vtoken});
            setUserData(data);
            setVtoken(vtoken);
            setIsAuthenticated(true);

            // Calculate remaining time to wait
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

            // Wait for the remaining time before setting loading to false
            setTimeout(() => {
              setIsLoading(false);
            }, remainingTime);
          } catch (jsonError) {
            console.error(
              "Failed to parse JSON response from token verification:",
              jsonError
            );
            console.error("Response text received:", responseText);
            setIsAuthenticated(false);
            setUserData(null);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error during token verification process:", error);

        // Check if it's a network error
        if (error instanceof TypeError && error.message.includes("fetch")) {
          console.error("Network error: Unable to reach authentication server");
        }

        setIsAuthenticated(false);
        setUserData(null);
        setIsLoading(false);
      }
    };

    // Check initially
    checkAuthToken();

    // Set up an interval to check for cookie changes every 5 seconds
    const interval = setInterval(() => {
      try {
        // For interval checks, don't add delay - just update immediately
        // const vtoken = getCookie('vtoken');

        const wasAuthenticated = isAuthenticated;
        const currentlyAuthenticated = !!vtoken;

        // Only update if authentication status changed
        if (wasAuthenticated !== currentlyAuthenticated) {
          // console.log(`Authentication status changed: ${wasAuthenticated} -> ${currentlyAuthenticated}`);
          setIsAuthenticated(currentlyAuthenticated);

          if (!vtoken) {
            console.log("Token removed, clearing user data");
            setUserData(null); // Clear user data when token is gone
          }
        }
      } catch (error) {
        console.error("Error in token check interval:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isClient, setUserData, setIsLoading]);

  const admin = userData?.[0]?.position === "Head of Digital" || false; // Check if user has admin access
  const pic =  userData?.[0]?.position === "Head of Digital" || userData?.[0]?.position === "Station Master" || userData?.[0]?.position === "Head of PTW" ? true : false; // Check if user has pic access

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
                  title: t("medical"),
                  url: "/medical",
                  icon: "HeartPulseIcon", // Medical-related icon
                },

                // {
                //   title: t("about"),
                //   url: "/about",
                //   icon: "InfoIcon",
                // },

                ...(admin ? [] : []),
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

      {
        title: t("communication"),
        url: "#",
        items: [
          // Only show login if user is not authenticated
          ...(isAuthenticated
            ? [
                {
                  title: t("newsletter"),
                  url: "/newsletter",
                  icon: "HomeIcon",
                },
                {
                  title: t("ebusinessCard"),
                  url: "/ebusinesscard",
                  icon: "InfoIcon",
                },
                {
                  title: t("trainingcenter"),
                  url: "/trainingcenter",
                  icon: "InfoIcon",
                  disabled: true,
                },
                {
                  title: t("sharing_voice"),
                  url: "/sharing_voice",
                  icon: "InfoIcon",
                 
                },

              ]
            : []),
        ],
      },
 {
        title: t("humanresources"),
        url: "#",
        items: [
          // Only show login if user is not authenticated
          ...(isAuthenticated
            ? [
                {
                  title: t("hrdocuments"),
                  url: "/hrdocuments",
                  icon: "HomeIcon",
                   disabled: true,
                },
                {
                  title: t("hrservicedesk"),
                  url: `https://hr-helpdesk.vercel.app/login?token=${vtoken}`,
                  icon: "InfoIcon",
                  target: true,
                },
                {
                  title: t("kelio"),
                  url: "https://attendance.mobilitycairo.com/open/login",
                  target: true,
                  icon: "InfoIcon",
                  
                }, {
                  title: t("talentsoft"),
                  url: "https://ratpdev.talent-soft.com/",
                  icon: "InfoIcon",
                  target: true,
                }, {
                  title: t("payslip"),
                  url: "https://hrservices.mobilitycairo.com/selfservice/",
                  icon: "InfoIcon",
                  target: true,
                },
              ]
            : []),
        ],
      },

      {
        title: t("apps"),
        url: "#",
        items: [
          {
            title: t("pic"),
            url: "/pic",
            icon: "InfoIcon",
            hidden: !pic,
          },
          {
            title: t("driver swap"),
            url: "/video",
            icon: "InfoIcon",
            disabled: !pic,
          },
        ],
       
      },








 {
        title: t("documents"),
        url: "#",
        items: [
          // Only show login if user is not authenticated
          ...(isAuthenticated
            ? [
                {
                  title: t("policies"),
                  url: "/hrdocuments",
                  icon: "HomeIcon",
                   disabled: true,
                },
                {
                  title: t("templates"),
                  url: "/hrservicedesk",
                  icon: "InfoIcon",
                   disabled: true,
                },
                {
                  title: t("compliance"),
                  url: "/kelio",
                  icon: "InfoIcon",
                  disabled: true,
                }, 
              ]
            : []),
        ],
      },

       {
        title: t("digital"),
        url: "#",
        items: [
          // Only show login if user is not authenticated
          ...(isAuthenticated
            ? [
                {
                  title: t("userguide"),
                  url: "/hrdocuments",
                  icon: "HomeIcon",
                   disabled: true,
                },
                {
                  title: t("digitalservicedesk"),
                  url: "/hrservicedesk",
                  icon: "InfoIcon",
                   disabled: true,
                },
                {
                  title: t("compliance"),
                  url: "/kelio",
                  icon: "InfoIcon",
                  disabled: true,
                }, 
              ]
            : []),
        ],
      },



      ...(admin
        ? [
            {
              title: t("adiminPanel"),
              url: "#",
              items: [
                {
                  title: "Debug Auth",
                  url: "/debug-auth",
                  icon: "InfoIcon",
                },
                {
                  title: t("updateemps"),
                  url: "/updateemps",
                  icon: "InfoIcon",
                },
                {
                  title: t("usersmanagement"),
                  url: "/usersmanagement",
                  icon: "UsersIcon",
                },
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
      ) : isAuthenticated && userData ? (
        // Only show navigation and children if user is authenticated AND userData is available
        
          userData[0].password  ? <Navigation data={data}>{children}</Navigation> : <AddPassword /> 
      
      ) : (
        // Show login page if not authenticated OR userData is not available
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
      <ProtectedContent>{children} </ProtectedContent>
    </UserProvider>
  );
}
