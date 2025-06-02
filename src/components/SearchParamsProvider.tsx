"use client";

import { Suspense, ReactNode } from 'react';
// import { SearchParamsWrapper } from './SearchParamsWrapper';

interface SearchParamsProviderProps {
  children: ReactNode;
}

export function SearchParamsProvider({ children }: SearchParamsProviderProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}

export default SearchParamsProvider;
