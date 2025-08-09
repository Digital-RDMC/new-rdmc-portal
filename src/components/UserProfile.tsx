"use client";
import { useUserInfo } from "@/hooks/useUserInfo";
import Image from "next/image";

// Example component showing how to access user data
export default function UserProfile() {
  const { 
    user, 
    isLoading, 
    getName, 
    getNameAr, 
    getEmail, 
    getEmpCode,
    getPosition,
    getDepartment,
    getPhoto,
    getMobile,
    getNationality,
    getGender
  } = useUserInfo();

  if (isLoading) {
    return <div className="p-4">Loading user data...</div>;
  }

  if (!user) {
    return <div className="p-4">No user data available</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl">
      <div className="flex items-center space-x-4 mb-6">
        {getPhoto() && (
          <Image 
            src={getPhoto() as string} 
            alt="Profile" 
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{getName() as string}</h2>
          <p className="text-lg text-gray-600">{getNameAr() as string}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Employee Code:</span>
            <span className="ml-2 text-gray-900">{getEmpCode() as string}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Position:</span>
            <span className="ml-2 text-gray-900">{getPosition() as string}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Department:</span>
            <span className="ml-2 text-gray-900">{getDepartment() as string}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="ml-2 text-gray-900">{getEmail() as string}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Mobile:</span>
            <span className="ml-2 text-gray-900">{getMobile() as string}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Gender:</span>
            <span className="ml-2 text-gray-900">{getGender() as string}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Nationality:</span>
            <span className="ml-2 text-gray-900">{getNationality() as string}</span>
          </div>
        </div>
      </div>

      {/* Full user data for debugging */}
      <details className="mt-6">
        <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
          Full User Data (Debug)
        </summary>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mt-2 text-gray-800">
          {JSON.stringify(user, null, 2)}
        </pre>
      </details>
    </div>
  );
}
