"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser, UserData } from "@/contexts/UserContext";
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
import { Eye, EyeOff, CheckCircle, UserCheck } from "lucide-react";

const AddPassword = () => {
  const { t } = useTranslation();
  const { userData, vtoken } = useUser();
  const [step, setStep] = useState<'greeting' | 'password' | 'success'>('greeting');
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{password?: string; confirmPassword?: string}>({});

  const dd: UserData = userData?.[0] || {
    created_at: "",
    empcode: "",
    email: "",
    mobile: "",
    token: 0,
    access: false,
    updated: "",
    password: null,
    dob: "",
    dep: "",
    managercode: "",
    name: "",
    namear: "",
    firstname: "",
    firstnamear: "",
    lastname: "",
    lastnamear: "",
    gender: "",
    gradeinternal: "",
    gradeofficial: "",
    nationality: "",
    position: "",
    photo: "",
  };

  const validatePassword = (pwd: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (pwd.length < minLength) {
      return t('passwordMinLength');
    }
    if (!hasUpperCase) {
      return t('passwordUpperCase');
    }
    if (!hasLowerCase) {
      return t('passwordLowerCase');
    }
    if (!hasNumbers) {
      return t('passwordNumber');
    }
    if (!hasSpecialChar) {
      return t('passwordSpecialChar');
    }
    return null;
  };

  const handlePasswordSubmit = async () => {
    setErrors({});
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: t('passwordsDoNotMatch') });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://n8n.srv869586.hstgr.cloud/webhook/add-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vtoken}`,
        },
        body: JSON.stringify({
          password: password,
        }),
      });

      if (response.ok) {
        setStep('success');
      } else {
        const errorData = await response.json();
        setErrors({ password: errorData.message || t('failedToSetPassword') });
      }
    } catch {
      setErrors({ password: t('networkErrorTryAgain') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithOTP = async () => {
    // Redirect to home or dashboard

 try {
      const response = await fetch('https://n8n.srv869586.hstgr.cloud/webhook/add-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vtoken}`,
        },
        body: JSON.stringify({
          password: "otp",
        }),
      });

      if (response.ok) {
        location.reload();
      } else {
        setErrors({ password: t('networkErrorTryLater') });
      }
    } catch {
      setErrors({ password: t('networkErrorTryAgain') });
    } finally {
      setIsLoading(false);
    }



  };

  if (step === 'greeting') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">{t('welcomeToRDMCPortal')}</CardTitle>
              <CardDescription className="text-base">
                {t('helloFirstTime', { name: dd.firstname || dd.name })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('passwordPreferenceQuestion', { method: dd.email ? t('email') : t('sms') })}
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={() => setStep('password')} 
                    className="w-full"
                    variant="default"
                  >
                    {t('setUpPasswordRecommended')}
                  </Button>
                  
                  <Button 
                    onClick={handleContinueWithOTP}
                    variant="outline" 
                    className="w-full"
                  >
                    {t('continueWithOTPEachTime')}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {t('changePreferenceLater')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'password') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{t('setUpYourPassword')}</CardTitle>
              <CardDescription>
                {t('createSecurePassword')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')} *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('enterYourPasswordPlaceholder')}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute end-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('confirmPassword')} *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('confirmYourPassword')}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute end-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{t('passwordRequirements')}</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('minEightChars')}</li>
                    <li>{t('upperLowerCase')}</li>
                    <li>{t('oneNumber')}</li>
                    <li>{t('oneSpecialChar')}</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handlePasswordSubmit}
                    disabled={isLoading || !password || !confirmPassword}
                    className="w-full"
                  >
                    {isLoading ? t('settingPassword') : t('setPassword')}
                  </Button>
                  
                  <Button 
                    onClick={() => setStep('greeting')}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {t('back')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">{t('passwordSetSuccessfully')}</CardTitle>
              <CardDescription>
                {t('canUsePasswordFuture')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                {t('continueToDashboard')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default AddPassword;
