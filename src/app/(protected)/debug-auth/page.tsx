"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugAuthPage() {
  const [cookies, setCookies] = useState<string>("");
  const [vtoken, setVtoken] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>("");
  const [verificationResponse, setVerificationResponse] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to safely get cookie value
  function getCookie(name: string): string | null {
    try {
      if (typeof document === 'undefined') return null;
      
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue || null;
      }
      return null;
    } catch (error) {
      console.error(`Error getting cookie ${name}:`, error);
      return null;
    }
  }

  useEffect(() => {
    // Get all cookies
    setCookies(document.cookie);
    
    // Get vtoken specifically
    const token = getCookie('vtoken');
    setVtoken(token);
  }, []);

  const testTokenVerification = async () => {
    setIsLoading(true);
    setVerificationStatus("Testing...");
    setVerificationResponse(null);

    try {
      const token = getCookie('vtoken');
      
      if (!token) {
        setVerificationStatus("❌ No vtoken found");
        setIsLoading(false);
        return;
      }

      console.log("Testing token verification with token:", token);

      const response = await fetch(
        "https://n8n.srv869586.hstgr.cloud/webhook/logged",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();
      
      setVerificationStatus(`📡 Response Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        setVerificationResponse({
          error: "Request failed",
          status: response.status,
          statusText: response.statusText,
          responseText: responseText
        });
        setIsLoading(false);
        return;
      }

      if (!responseText || responseText.trim() === '') {
        setVerificationResponse({
          error: "Empty response",
          responseText: responseText
        });
        setIsLoading(false);
        return;
      }

      try {
        const data = JSON.parse(responseText);
        setVerificationStatus("✅ Token verification successful");
        setVerificationResponse(data);
      } catch (jsonError) {
        setVerificationResponse({
          error: "Failed to parse JSON",
          jsonError: jsonError instanceof Error ? jsonError.message : String(jsonError),
          responseText: responseText
        });
      }
    } catch (error) {
      setVerificationStatus("❌ Network error");
      setVerificationResponse({
        error: "Network error",
        message: error instanceof Error ? error.message : String(error),
        type: error instanceof Error ? error.constructor.name : typeof error
      });
    }

    setIsLoading(false);
  };

  const clearToken = () => {
    document.cookie = "vtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setVtoken(null);
    setCookies(document.cookie);
    setVerificationStatus("");
    setVerificationResponse(null);
  };

  const refreshData = () => {
    setCookies(document.cookie);
    setVtoken(getCookie('vtoken'));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div>
            <h3 className="font-semibold mb-2">Current Cookies:</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
              {cookies || "No cookies found"}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">VToken Status:</h3>
            <p className={`p-2 rounded ${vtoken ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
              {vtoken ? `✅ Present: ${vtoken.substring(0, 20)}...` : "❌ Not found"}
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={testTokenVerification} disabled={isLoading || !vtoken}>
              {isLoading ? "Testing..." : "Test Token Verification"}
            </Button>
            <Button onClick={clearToken} variant="destructive">
              Clear Token
            </Button>
            <Button onClick={refreshData} variant="outline">
              Refresh Data
            </Button>
          </div>

          {verificationStatus && (
            <div>
              <h3 className="font-semibold mb-2">Verification Status:</h3>
              <p className="p-2 rounded bg-blue-100 dark:bg-blue-900">
                {verificationStatus}
              </p>
            </div>
          )}

          {verificationResponse && (
            <div>
              <h3 className="font-semibold mb-2">Server Response:</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto max-h-64 overflow-y-auto">
                {JSON.stringify(verificationResponse, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded">
            <h4 className="font-semibold mb-2">Troubleshooting Steps:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>First, ensure you have logged in successfully and have a vtoken</li>
              <li>Test the token verification to see if the server responds correctly</li>
              <li>Check the browser network tab for any failed requests</li>
              <li>Verify the n8n endpoint is accessible: <code>https://n8n.srv869586.hstgr.cloud/webhook/logged</code></li>
              <li>If verification fails, try logging in again</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
