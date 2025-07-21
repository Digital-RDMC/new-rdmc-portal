"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

interface LoginWarningProps {
  onTryAgain: () => void;
  onGoBack: () => void;
  errorMessage?: string;
  isLoading?: boolean;
}

export function LoginWarning({ 
  onTryAgain, 
  onGoBack, 
  errorMessage, 
  isLoading = false 
}: LoginWarningProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-destructive/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl text-destructive">
              {t('loginFailed')}
            </CardTitle>
            <CardDescription>
              {errorMessage || t('loginFailedMessage')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  {t('possibleReasons')}:
                </p>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>• {t('invalidCredentials')}</li>
                  <li>• {t('accountNotFound')}</li>
                  <li>• {t('temporaryIssue')}</li>
                  <li>• {t('networkConnection')}</li>
                </ul>
              </div>

              <div className="grid gap-3">
                <Button 
                  onClick={onTryAgain} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      {t('retrying')}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {t('tryAgain')}
                    </>
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  onClick={onGoBack}
                  className="w-full"
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('goBackToLogin')}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {t('needHelp')}{" "}
                  <a 
                    href="#" 
                    className="text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    {t('contactSupport')}
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
