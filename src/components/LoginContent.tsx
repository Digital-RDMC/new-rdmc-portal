"use client";

import "@/i18n";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OTPVerification } from "@/components/otp-verification";
import { LoginWarning } from "@/components/login-warning";
import ThemeSwitcher from "@/components/ThemeSwitcher2";
import  LanguageSwitcher  from "@/components/LanguageSwitcher2";
import Image from 'next/image';

type LoginMethod = 'email' | 'phone' | 'employeeCode' | 'username';
type LoginState = 'login' | 'otp' | 'warning';

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<LoginMethod>('email');
  const [loginState, setLoginState] = useState<LoginState>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [basicAuthToken, setBasicAuthToken] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    // Get form data
    const formData = new FormData(e.currentTarget);
    const inputValue = formData.get(inputConfig.id) as string;
    setUserIdentifier(inputValue);
    
    // Handle different login methods
    switch (selectedMethod) {
      case 'phone':
        console.log('Phone login:', inputValue);
        break;
      case 'employeeCode':
        console.log('Employee Code login:', inputValue);
        break;
      case 'username':
        console.log('Username login:', inputValue);
        break;
      case 'email':
        console.log('Email login:', inputValue);
        break;
      default:
        console.log('Unknown login method');
    }
    
    try {
      // Use direct fetch to n8n webhook
      const response = await fetch('https://n8n.srv869586.hstgr.cloud/webhook/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: inputValue,
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.token) {
          console.log('Login successful, token received:', result.token);
          setBasicAuthToken(result.token);
          setLoginState('otp');
        } else {
          console.error('Login failed:', result.error || 'No token received');
          setErrorMessage(result.error || 'Authentication failed');
          setLoginState('warning');
        }
      } else {
        const result = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Login failed:', result.error);
        setErrorMessage(result.error || `Server error: ${response.status}`);
        setLoginState('warning');
      }
      
    } catch (error) {
      console.error('Network error:', error);
      
      // More specific error handling
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setErrorMessage('Network error: Unable to connect to the authentication service.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      setLoginState('warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setIsLoading(true);
    try {
      // Here you would typically send the OTP to your backend for verification
      console.log('Verifying OTP:', otp);
      
      // Simulate OTP verification API call
      const response = await fetch('https://n8n.srv869586.hstgr.cloud/webhook/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${basicAuthToken}`, // Use the token received from login
        },
        body: JSON.stringify({
          token: otp
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Save the verification token in a cookie for 30 minutes
        if (result.token) {
          const expirationTime = new Date();
          expirationTime.setMinutes(expirationTime.getMinutes() + 30);
          
          document.cookie = `vtoken=${result.token}; expires=${expirationTime.toUTCString()}; path=/; secure; samesite=strict`;
          
          // console.log('OTP verification successful and token saved:', result.token);
          // alert('Login successful! Redirecting to dashboard...');
          // Handle successful login - redirect to dashboard
          router.push('/');
        } else {
          console.error('OTP verification failed: No token received');
          setErrorMessage('Verification failed: No token received');
          setLoginState('warning');
        }
      } else {
        const result = await response.json().catch(() => ({ error: 'OTP verification failed' }));
        setErrorMessage(result.error || 'Invalid OTP code');
        setLoginState('warning');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setErrorMessage('Failed to verify OTP. Please try again.');
      setLoginState('warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPResend = async () => {
    setIsLoading(true);
    try {
      // Resend OTP logic
      console.log('Resending OTP to:', userIdentifier);
      
      const response = await fetch('https://n8n.srv869586.hstgr.cloud/webhook-test/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: userIdentifier
        })
      });

      if (response.ok) {
        console.log('OTP resent successfully');
        // OTP resent successfully
      } else {
        console.error('Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setLoginState('login');
    setErrorMessage('');
  };

  const handleGoBack = () => {
    setLoginState('login');
    setErrorMessage('');
    setUserIdentifier('');
  };

  const getInputConfig = () => {
    switch (selectedMethod) {
      case 'phone':
        return {
          label: t('phoneNumber'),
          type: 'tel',
          placeholder: '+1 (555) 000-0000',
          id: 'phone'
        };
      case 'employeeCode':
        return {
          label: t('employeeCode'),
          type: 'text',
          placeholder: t('enterEmployeeCode'),
          id: 'employeeCode'
        };
      case 'username':
        return {
          label: t('username'),
          type: 'text',
          placeholder: t('enterUsername'),
          id: 'username'
        };
      default:
        return {
          label: t('emailAddress'),
          type: 'email',
          placeholder: t('emailPlaceholder'),
          id: 'email'
        };
    }
  };

  const inputConfig = getInputConfig();

  // Conditional rendering based on login state
  if (loginState === 'otp') {
    return (
      <OTPVerification
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        isLoading={isLoading}
        identifier={userIdentifier}
        loginMethod={selectedMethod}
      />
    );
  }

  if (loginState === 'warning') {
    return (
      <LoginWarning
        onTryAgain={handleTryAgain}
        onGoBack={handleGoBack}
        errorMessage={errorMessage}
        isLoading={isLoading}
      />
    );
  }

  // Default login form
  return (
    <div className="flex  items-center justify-center p-4">
       <div className="absolute inset-0 z-0">
        {/* Test Background - Visible gradient */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-100 dark:from-blue-900/30 dark:via-cyan-900/20 dark:to-teal-900/30"></div> */}
        
        {/* Worldmap Background */}
        <div className="absolute inset-0 opacity-80 dark:opacity-50">
          <Image 
            src="/images/worldmap.svg" 
            alt="" 
            fill
            className="object-cover object-center"
            onError={(e) => {
              console.log('Worldmap image failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
          
        </div>  
        <div className="absolute inset-0 opacity-80 dark:opacity-50">
         
           <Image 
            src="/images/shades.svg" 
            alt="" 
            fill
            className="object-cover object-center"
            onError={(e) => {
              console.log('Shades image failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        
        {/* Animated Gradient Overlay */}
        {/* <div className="absolute inset-0 opacity-60 dark:opacity-40">
          <div 
            className="w-full h-full bg-gradient-to-br from-blue-500/30 via-cyan-400/20 to-teal-500/30"
            style={{
              animation: 'backgroundPulse 4s ease-in-out infinite'
            }}
          ></div>
        </div> */}
      </div>
      <div className="w-full max-w-md z-40">
        <Card className="bg-white/50 dark:bg-gray-800/80 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">

              <div className="flex flex-row justify-center items-center gap-2 pb-5">
               <LanguageSwitcher />  <ThemeSwitcher />
            </div>

              <div className="mb-6 flex justify-center">
          <Image 
            src="/images/logo.png" 
            alt="RATP Dev Mobility Cairo" 
            width={200}
            height={48}
            className="h-12 w-auto"
            style={{ maxWidth: '200px' }}
          />
        </div>
             
              
              {t('welcomeBack')}</CardTitle>
            <CardDescription>
              {t('loginWithPreferredMethod')}
            </CardDescription>
          </CardHeader>
          <CardContent>

            


            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor={inputConfig.id}>{inputConfig.label}</Label>
                    <Input
                      id={inputConfig.id}
                      name={inputConfig.id}
                      type={inputConfig.type}
                      placeholder={inputConfig.placeholder}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('verifying') : t('continue')}
                  </Button>



                </div>
                <div className="flex flex-col gap-4">
                  <Button 
                    type="button"
                    variant={selectedMethod === 'phone' ? 'default' : 'outline'} 
                    className={`w-full ${selectedMethod === 'phone' ? 'hidden' : 'bg-white/50 dark:bg-gray-800/80 hover:bg-primary/10'}`}
                    onClick={() => setSelectedMethod('phone')}
                    disabled={isLoading}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {t('continueWithPhone')}
                  </Button>
                  <Button 
                    type="button"
                    variant={selectedMethod === 'employeeCode' ? 'default' : 'outline'} 
                     className={`w-full ${selectedMethod === 'employeeCode' ? 'hidden' : 'bg-white/50 dark:bg-gray-800/80 hover:bg-primary/10'}`}
                    onClick={() => setSelectedMethod('employeeCode')}
                    disabled={isLoading}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                      <line x1="16" x2="16" y1="2" y2="6"/>
                      <line x1="8" x2="8" y1="2" y2="6"/>
                      <line x1="3" x2="21" y1="10" y2="10"/>
                      <path d="M8 14h.01"/>
                      <path d="M12 14h.01"/>
                      <path d="M16 14h.01"/>
                      <path d="M8 18h.01"/>
                      <path d="M12 18h.01"/>
                      <path d="M16 18h.01"/>
                    </svg>
                    {t('continueWithEmployeeCode')}
                  </Button>
                  <Button 
                    type="button"
                    variant={selectedMethod === 'username' ? 'default' : 'outline'} 
                     className={`w-full ${selectedMethod === 'username' ? 'hidden' : 'bg-white/50 dark:bg-gray-800/80 hover:bg-primary/10'}`}
                    onClick={() => setSelectedMethod('username')}
                    disabled={isLoading}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    {t('continueWithUsername')}
                  </Button>
                  <Button 
                    type="button"
                    variant={selectedMethod === 'email' ? 'default' : 'outline'} 
                     className={`w-full ${selectedMethod === 'email' ? 'hidden' : 'bg-white/50 dark:bg-gray-800/80 hover:bg-primary/10'}`}
                    onClick={() => setSelectedMethod('email')}
                    disabled={isLoading}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    {t('continueWithEmail')}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {t('cannotAccessAccount')}{" "}
                  <a href="#" className="underline underline-offset-4">
                    {t('openSupportTicket')}
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="mt-4 text-center text-xs text-balance text-muted-foreground">
          {t('agreeToTerms')}{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            {t('termsOfService')}
          </a>{" "}
          {t('and')}{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            {t('privacyPolicy')}
          </a>
          .
        </div>
      </div>
    </div>
  );
}


