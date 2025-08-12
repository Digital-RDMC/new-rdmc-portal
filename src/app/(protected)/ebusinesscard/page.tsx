'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Globe, Download, Share2 } from 'lucide-react';
import { useUser } from "@/contexts/UserContext";


export default function Page() {
   const userContext = useUser();
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');


  //  "created_at": "2025-08-09T21:32:32.746081+00:00",
  //     "empcode": "RDMC0000",
  //     "email": "digital.rdmc@ratpdev.com",
  //     "mobile": "01022666227",
  //     "token": 3957,
  //     "access": true,
  //     "updated": "2025-08-01",
  //     "password": null,
  //     "dob": "1978-08-23",
  //     "dep": "Technical",
  //     "managercode": "RDMC0187",
  //     "name": "Digital RDMC",
  //     "namear": "ديجيتال ار دي ام سي",
  //     "firstname": "Digital",
  //     "firstnamear": "ديجيتال ",
  //     "lastname": "RDMC",
  //     "lastnamear": "ار دي ام سي",
  //     "gender": "male",
  //     "gradeinternal": "6",
  //     "gradeofficial": "6",
  //     "nationality": "Egyptian",
  //     "position": "Digital Admin",
  //     "photo": null



  const emp = {
    id: 1,
    name: `${userContext.userData?.[0].firstname} ${userContext.userData?.[0].lastname}`,
    position: `${userContext.userData?.[0].position}`,
    email: `${userContext.userData?.[0].email}`,
    phone: `${userContext.userData?.[0].mobile}`,
    address: `10 Bagdad St, EL Korba, Cairo, Egypt`,
    website: `www.mobilitycairo.com`,
    department: "Engineering",
    company: "RATP Dev Mobility Cairo", 
    photoURL : userContext.userData?.[0]?.photo || null,
  };

  // Generate vCard format for contact creation
  const generateVCard = async () => {
    const firstName = userContext.userData?.[0]?.firstname || '';
    const lastName = userContext.userData?.[0]?.lastname || '';
   

    // If photo exists, convert it to base64 for embedding in vCard
    
    
    const vCard = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${emp.name}
ORG:${emp.company}
TITLE:${emp.position}
TEL:${emp.phone}
EMAIL:${emp.email}
URL:${emp.website}
ADR:;;${emp.address};;;;
END:VCARD`;
    return vCard;
  };

  // Generate QR Code
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const vCardData = await generateVCard();
        const qrDataURL = await QRCode.toDataURL(vCardData, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataURL(qrDataURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (userContext.userData?.[0]) {
      generateQRCode();
    }
  }, [userContext.userData]);

  // Download QR Code
  const downloadQRCode = () => {
    if (qrCodeDataURL) {
      const link = document.createElement('a');
      link.href = qrCodeDataURL;
      link.download = `${emp.name.replace(/\s+/g, '_')}_business_card_qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Share QR Code (Web Share API)
  const shareQRCode = async () => {
    if (navigator.share && qrCodeDataURL) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeDataURL);
        const blob = await response.blob();
        const file = new File([blob], `${emp.name}_business_card_qr.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `${emp.name} - Business Card`,
          text: `Scan this QR code to add ${emp.name} to your contacts`,
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing QR code:', error);
        // Fallback: copy to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  // Fallback: Copy QR code image to clipboard
  const copyToClipboard = async () => {
    try {
      const response = await fetch(qrCodeDataURL);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      alert('QR code copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Unable to copy QR code. Please try downloading instead.');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


         {/* QR Code Section */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">Scan to Add Contact</CardTitle>
            <p className="text-gray-600 text-sm">
              Scan this QR code with your phone to automatically add this contact
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {qrCodeDataURL ? (
              <div className="flex justify-center">
                <Image 
                  src={qrCodeDataURL} 
                  alt="Contact QR Code"
                  width={300}
                  height={300}
                  className="border border-gray-200 rounded-lg shadow-lg"
                />
              </div>
            ) : (
              <div className="w-[300px] h-[300px] mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Generating QR Code...</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={downloadQRCode}
                disabled={!qrCodeDataURL}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download QR</span>
              </Button>
              <Button 
                onClick={shareQRCode}
                disabled={!qrCodeDataURL}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share QR</span>
              </Button>
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold mb-1">How to use:</p>
              <ul className="text-left space-y-1">
                <li>• Open your phone&apos;s camera app</li>
                <li>• Point at the QR code</li>
                <li>• Tap the notification to add contact</li>
                <li>• Or use any QR code scanner app</li>
              </ul>
            </div>
          </CardContent>
        </Card>



        {/* Business Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              


               {userContext.userData?.[0]?.photo ? (
                                      <Image
                                        src={
                                          userContext.userData?.[0]?.photo || "/images/logo.png"
                                        }
                                        alt="Logo"
                                        className="rounded-full object-cover"
                                        width={32}
                                        height={32}
                                      />
                                    ) : (
                                      <svg
                                        className="rounded-full object-cover w-8 h-8 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        width={32}
                                        height={32}
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}

                                    
              {/* {emp.photoURL ? (
                <Image src={emp.photoURL} alt='Profile Photo' width={50} height={50} className="rounded-full object-cover" />
              ):(

                <span className="text-3xl font-bold text-blue-600">
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </span>

              )} */}
              
              {/* <span className="text-3xl font-bold text-blue-600">
                {emp.name.split(' ').map(n => n[0]).join('')}
              </span> */}
            </div>
            <CardTitle className="text-2xl font-bold">{emp.name}</CardTitle>
            <p className="text-blue-100">{emp.position}</p>
            <p className="text-blue-200 text-sm">{emp.department} • {emp.company}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5" />
              <span className="text-sm">{emp.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5" />
              <span className="text-sm">{emp.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">{emp.address}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5" />
              <span className="text-sm">{emp.website}</span>
            </div>
          </CardContent>
        </Card>

       
      </div>

      {/* Additional Information */}
      {/* <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">vCard Data Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
            {JSON.stringify(userContext, null, 2)}
 
          </pre>
        </CardContent>
      </Card> */}
    </div>
  );
}