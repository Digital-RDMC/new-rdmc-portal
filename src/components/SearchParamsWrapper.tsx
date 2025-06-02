"use client";

import { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

export function SearchParamsWrapper({ children }: { children: (searchParams: URLSearchParams) => ReactNode }) {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
}

export default SearchParamsWrapper;
