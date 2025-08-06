'use client';

import { Button } from '@/components/ui/button';
import * as React from 'react';
import { useState } from 'react';




export default function DataLakePage() {


const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);


  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
     
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from:  null,
          to:  null,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to fetch data');
      }
      console.log('Fetched data:', result);
      
     setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);

      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
    
    }
  }, []);

  const handleApplyFilter = () => {
    fetchData();
  };





  // Show form first, then conditionally show table or no data message
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Data Lake - HR Data</h1>
      
   
        <Button 
          onClick={handleApplyFilter}
          variant="default"
          disabled={loading}
        >
          {loading ? 'Applying...' : 'Apply updates'}
        </Button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
       
      </div>

     
   
  );
}
