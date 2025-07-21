"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OTPVerificationProps {
  onVerify: (otp: string) => void;
  onResend: () => void;
  isLoading?: boolean;
  identifier: string;
  loginMethod: string;
}

export function OTPVerification({ 
  onVerify, 
  onResend, 
  isLoading = false, 
  identifier,
  loginMethod 
}: OTPVerificationProps) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [displayOtp, setDisplayOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Focus first input on mount
    const firstInput = document.getElementById('otp-0');
    firstInput?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    const newDisplayOtp = [...displayOtp];
    
    newOtp[index] = value;
    newDisplayOtp[index] = value ? '*' : '';
    
    setOtp(newOtp);
    setDisplayOtp(newDisplayOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 4) {
      onVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    } else if (e.key === 'Backspace' && otp[index]) {
      // Clear current field
      const newOtp = [...otp];
      const newDisplayOtp = [...displayOtp];
      newOtp[index] = '';
      newDisplayOtp[index] = '';
      setOtp(newOtp);
      setDisplayOtp(newDisplayOtp);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 4) {
      onVerify(otpCode);
    }
  };

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    setOtp(['', '', '', '']);
    setDisplayOtp(['', '', '', '']);
    const firstInput = document.getElementById('otp-0');
    firstInput?.focus();
    onResend();
  };

  const maskIdentifier = (id: string, method: string) => {
    if (method === 'email') {
      const [local, domain] = id.split('@');
      return `${local.slice(0, 2)}***@${domain}`;
    } else if (method === 'phone') {
      return `***${id.slice(-4)}`;
    }
    return `***${id.slice(-3)}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t('verifyOTP')}</CardTitle>
            <CardDescription>
              {t('otpSentTo')} {maskIdentifier(identifier, loginMethod)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label className="text-center">{t('enterOTPCode')}</Label>
                  <div className="flex gap-2 justify-center">
                    {displayOtp.map((displayDigit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={displayDigit}
                        onChange={(e) => {
                          // Only allow numeric input
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          if (value.length <= 1) {
                            handleChange(index, value);
                          }
                        }}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-semibold"
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || otp.join('').length !== 4}
                >
                  {isLoading ? t('verifying') : t('verify')}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {t('didntReceiveCode')}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResend}
                    disabled={!canResend || isLoading}
                    className="w-full"
                  >
                    {canResend 
                      ? t('resendOTP') 
                      : `${t('resendIn')} ${countdown}s`
                    }
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
