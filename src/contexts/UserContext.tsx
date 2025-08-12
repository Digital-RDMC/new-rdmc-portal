"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for user data based on your API response
export interface UserData {
  created_at: string;
  empcode: string;
  email: string;
  mobile: string;
  token: number;
  access: boolean;
  updated: string;
  password: string | null;
  dob: string;
  dep: string;
  managercode: string;
  name: string;
  namear: string;
  firstname: string;
  firstnamear: string;
  lastname: string;
  lastnamear: string;
  gender: string;
  gradeinternal: string;
  gradeofficial: string;
  nationality: string;
  position: string;
  photo: string;

}

// Define the context type
interface UserContextType {
  userData: UserData[] | null; // API returns an array of user data
  setUserData: (data: UserData[] | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  vtoken: string;
  setVtoken: (token: string) => void; 
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vtoken, setVtoken] = useState<string>("");

  return (
    <UserContext.Provider value={{ userData, setUserData, isLoading, setIsLoading, vtoken, setVtoken }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
