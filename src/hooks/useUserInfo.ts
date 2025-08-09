"use client";
import { useUser } from "@/contexts/UserContext";

// Custom hook to get specific user information
export const useUserInfo = () => {
  const { userData, isLoading } = useUser();

  // Get the first user from the array (since API returns an array)
  const user = userData && userData.length > 0 ? userData[0] : null;

  return {
    user,
    userData, // Full array if needed
    isLoading,
    // Helper functions to access specific user properties
    getEmpCode: () => user?.empcode || null,
    getName: () => user?.name || null,
    getNameAr: () => user?.namear || null,
    getFirstName: () => user?.firstname || null,
    getFirstNameAr: () => user?.firstnamear || null,
    getLastName: () => user?.lastname || null,
    getLastNameAr: () => user?.lastnamear || null,
    getEmail: () => user?.email || null,
    getMobile: () => user?.mobile || null,
    getDepartment: () => user?.dep || null,
    getPosition: () => user?.position || null,
    getManagerCode: () => user?.managercode || null,
    getGender: () => user?.gender || null,
    getNationality: () => user?.nationality || null,
    getGradeInternal: () => user?.gradeinternal || null,
    getGradeOfficial: () => user?.gradeofficial || null,
    getDateOfBirth: () => user?.dob || null,
    getPhoto: () => user?.photo || null,
    getToken: () => user?.token || null,
    hasAccess: () => user?.access || false,
    getCreatedAt: () => user?.created_at || null,
    getUpdated: () => user?.updated || null,
    
    // Generic property getter for any additional fields
    getUserProperty: (property: string): unknown => {
      if (!user) return null;
      return (user as unknown as Record<string, unknown>)[property] || null;
    },
  };
};
