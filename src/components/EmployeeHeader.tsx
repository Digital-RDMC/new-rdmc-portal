"use client";
import { useUserInfo } from "@/hooks/useUserInfo";
import Image from "next/image";

// Simple component to display employee info in header/navbar
export default function EmployeeHeader() {
  const { getName, getEmpCode, getPosition, getPhoto, isLoading } = useUserInfo();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {getPhoto() && (
        <Image 
          src={getPhoto() as string} 
          alt="Profile" 
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}
      <div className="text-sm">
        <div className="font-medium text-gray-900">{getName()}</div>
        <div className="text-gray-500">{getEmpCode()} • {getPosition()}</div>
      </div>
    </div>
  );
}
