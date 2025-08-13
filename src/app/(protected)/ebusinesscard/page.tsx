"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Globe, Download, Share2, Edit3, X } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function Page() {
  const userContext = useUser();
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editableData, setEditableData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    company: ""
  });

  const emp = {
    id: 1,
    name: `${editableData.firstname || userContext.userData?.[0]?.firstname} ${editableData.lastname || userContext.userData?.[0]?.lastname}`,
    position: `${userContext.userData?.[0]?.position}`,
    email: `${editableData.email || userContext.userData?.[0]?.email}`,
    phone: `${editableData.mobile || userContext.userData?.[0]?.mobile}`,
    address: `10 Bagdad St, EL Korba, Cairo, Egypt`,
    website: `www.mobilitycairo.com`,
    department: "Engineering",
    company: `${editableData.company || "RATP Dev Mobility Cairo"}`,
    photoURL: userContext.userData?.[0]?.photo || null,
  };

  // Initialize editable data when user data loads
  useEffect(() => {
    if (userContext.userData?.[0] && !editableData.firstname) {
      setEditableData({
        firstname: userContext.userData[0].firstname || "",
        lastname: userContext.userData[0].lastname || "",
        email: userContext.userData[0].email || "",
        mobile: userContext.userData[0].mobile || "",
        company: "RATP Dev Mobility Cairo"
      });
    }
  }, [userContext.userData, editableData.firstname]);

  // Generate vCard format for contact creation
  const generateVCard = async () => {
    const firstName = editableData.firstname || userContext.userData?.[0]?.firstname || "";
    const lastName = editableData.lastname || userContext.userData?.[0]?.lastname || "";

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
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        setQrCodeDataURL(qrDataURL);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    if (userContext.userData?.[0]) {
      generateQRCode();
    }
  }, [userContext.userData, editableData]);

  // Download QR Code
  const downloadQRCode = () => {
    if (qrCodeDataURL) {
      const link = document.createElement("a");
      link.href = qrCodeDataURL;
      link.download = `${emp.name.replace(/\s+/g, "_")}_business_card_qr.png`;
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
        const file = new File([blob], `${emp.name}_business_card_qr.png`, {
          type: "image/png",
        });

        await navigator.share({
          title: `${emp.name} - Business Card`,
          text: `Scan this QR code to add ${emp.name} to your contacts`,
          files: [file],
        });
      } catch (error) {
        console.error("Error sharing QR code:", error);
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
        new ClipboardItem({ "image/png": blob }),
      ]);
      alert("QR code copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Unable to copy QR code. Please try downloading instead.");
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditForm(false);
    // QR code will automatically regenerate due to useEffect dependency on editableData
  };

  // Toggle edit form
  const toggleEditForm = () => {
    setShowEditForm(!showEditForm);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code Section */}
        <div className="">
          <div className="flex flex-col sm:flex-row gap-3 mb-5 justify-center">
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

            <Button 
              variant="outline"
              className="flex items-center space-x-2"
              onClick={toggleEditForm}
            >
              <Edit3 className="w-4 h-4" />
              <span>{showEditForm ? 'Cancel Edit' : 'Edit QR'}</span>
            </Button>
          </div>

          <div className="">
            {showEditForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Edit QR Code Data</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={toggleEditForm}
                      className="p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstname">First Name</Label>
                        <Input
                          id="firstname"
                          type="text"
                          value={editableData.firstname}
                          onChange={(e) => handleInputChange('firstname', e.target.value)}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastname">Last Name</Label>
                        <Input
                          id="lastname"
                          type="text"
                          value={editableData.lastname}
                          onChange={(e) => handleInputChange('lastname', e.target.value)}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editableData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="mobile">Phone Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={editableData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        type="text"
                        value={editableData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Enter company name"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        Update QR Code
                      </Button>
                      <Button type="button" variant="outline" onClick={toggleEditForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader className="text-center">
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {qrCodeDataURL ? (
                <div className="flex justify-center">
                  <Image
                    src={qrCodeDataURL}
                    alt="Contact QR Code"
                    width={300}
                    height={300}
                    className=""
                  />
                </div>
              ) : (
                <div className="w-[300px] h-[300px] mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Generating QR Code...</p>
                </div>
              )}

              <div className="w-[300px] mx-auto">
                <div className="text-start mb-5">
                  <div className="text-2xl font-black text-primary">{emp.name}</div>
                  <p className="dark:text-blue-100 font-semibold">{emp.position}</p>
                  <p className="dark:text-blue-200 text-sm font-light">
                    {emp.department} • {emp.company}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{emp.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{emp.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{emp.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">{emp.website}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
