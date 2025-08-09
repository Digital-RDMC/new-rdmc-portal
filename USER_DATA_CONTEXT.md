# User Data Context - Usage Guide

## Overview
The logged employee data from the authentication endpoint `https://n8n.srv869586.hstgr.cloud/webhook/logged` is now accessible throughout all components under the protected layout using React Context.

## User Data Structure
The API returns an array with user data in this format:
```typescript
{
  created_at: string;
  empcode: string;          // Employee code (e.g., "RDMC0187")
  email: string;           // Email address
  mobile: string;          // Mobile number
  token: number;           // Access token
  access: boolean;         // Access permission
  updated: string;         // Last updated date
  password: string | null; // Password (usually null)
  dob: string;            // Date of birth
  dep: string;            // Department
  managercode: string;     // Manager's employee code
  name: string;           // Full name in English
  namear: string;         // Full name in Arabic
  firstname: string;      // First name in English
  firstnamear: string;    // First name in Arabic
  lastname: string;       // Last name in English
  lastnamear: string;     // Last name in Arabic
  gender: string;         // Gender
  gradeinternal: string;  // Internal grade
  gradeofficial: string;  // Official grade
  nationality: string;    // Nationality
  position: string;       // Job position
  photo: string;          // Profile photo URL
}
```

## Files Created/Modified

### 1. `src/contexts/UserContext.tsx`
- **UserProvider**: React Context Provider that manages user data state
- **useUser**: Hook to access user data and related functions
- **UserData**: TypeScript interface matching your API response

### 2. `src/hooks/useUserInfo.ts`
- **useUserInfo**: Custom hook with helper functions for easy access to user properties
- Specific getters for all user fields

### 3. `src/components/UserProfile.tsx`
- Example component showing how to use the user data with actual styling

### 4. `src/app/(protected)/layout.tsx` (Modified)
- Now wraps all protected content with UserProvider
- Stores the employee data from the authentication response in context

## How to Use

### Method 1: Direct Context Access
```tsx
"use client";
import { useUser } from "@/contexts/UserContext";

export default function MyComponent() {
  const { userData, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (!userData || userData.length === 0) return <div>No user data</div>;

  const user = userData[0]; // Get first user from array

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Employee Code: {user.empcode}</p>
    </div>
  );
}
```

### Method 2: Using Helper Hook (Recommended)
```tsx
"use client";
import { useUserInfo } from "@/hooks/useUserInfo";

export default function MyComponent() {
  const { 
    user, 
    isLoading, 
    getName, 
    getEmpCode, 
    getEmail,
    getPosition,
    getDepartment
  } = useUserInfo();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div>
      <h1>Welcome, {getName()}!</h1>
      <p>Employee: {getEmpCode()}</p>
      <p>Position: {getPosition()}</p>
      <p>Department: {getDepartment()}</p>
      <p>Email: {getEmail()}</p>
    </div>
  );
}
```

## Available Helper Functions

### Personal Information
- `getName()`: Get full name in English
- `getNameAr()`: Get full name in Arabic
- `getFirstName()`: Get first name in English
- `getFirstNameAr()`: Get first name in Arabic
- `getLastName()`: Get last name in English
- `getLastNameAr()`: Get last name in Arabic
- `getGender()`: Get gender
- `getNationality()`: Get nationality
- `getDateOfBirth()`: Get date of birth

### Work Information
- `getEmpCode()`: Get employee code
- `getPosition()`: Get job position
- `getDepartment()`: Get department
- `getManagerCode()`: Get manager's employee code
- `getGradeInternal()`: Get internal grade
- `getGradeOfficial()`: Get official grade

### Contact Information
- `getEmail()`: Get email address
- `getMobile()`: Get mobile number

### System Information
- `getPhoto()`: Get profile photo URL
- `getToken()`: Get access token
- `hasAccess()`: Check if user has access (boolean)
- `getCreatedAt()`: Get account creation date
- `getUpdated()`: Get last updated date

### Generic Access
- `getUserProperty(propertyName)`: Get any property by name

## Real Example Usage

```tsx
import { useUserInfo } from "@/hooks/useUserInfo";
import Image from "next/image";

export default function EmployeeCard() {
  const { 
    getName, 
    getNameAr, 
    getEmpCode, 
    getPosition, 
    getDepartment,
    getPhoto,
    getEmail 
  } = useUserInfo();

  return (
    <div className="employee-card">
      {getPhoto() && (
        <Image 
          src={getPhoto() as string} 
          alt="Profile" 
          width={80} 
          height={80}
          className="rounded-full"
        />
      )}
      <h2>{getName()}</h2>
      <h3>{getNameAr()}</h3>
      <p>Code: {getEmpCode()}</p>
      <p>Position: {getPosition()}</p>
      <p>Department: {getDepartment()}</p>
      <p>Email: {getEmail()}</p>
    </div>
  );
}
```

## Benefits

1. **Type Safety**: Full TypeScript support with proper interfaces
2. **Global Access**: Available in any component without prop drilling
3. **Helper Functions**: Easy access to specific user properties
4. **Bilingual Support**: Both English and Arabic names
5. **Auto Updates**: Data refreshes when authentication changes
6. **Loading States**: Built-in loading state management
7. **Auto Cleanup**: Clears data when user logs out
8. **Profile Photos**: Direct access to Google Drive profile images
