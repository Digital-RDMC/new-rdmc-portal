import { NextResponse } from 'next/server';
import sql from 'mssql';

// SQL Server configuration
const config = {
  server: '10.20.69.185',
  database: 'DataLake',
  user: 'digital',
  password: 'Digital@2024!',
  options: {
    encrypt: false, // Set to true if using Azure
    trustServerCertificate: true, // For development only
    enableArithAbort: true,
    connectTimeout: 30000, // 30 seconds
    requestTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

export async function POST(request: Request) {
  let pool: sql.ConnectionPool | null = null;
  
  try {




    // Parse request body
    const body = await request.json();
    const { from, to } = body;

    let fromDate: string | undefined = from;

    if (!from) {
      try{
 const response = await fetch('https://n8n.srv869586.hstgr.cloud/webhook/2018d21e-d3e9-4178-b67f-e8114b2ae349');
      const data = await response.json();
      fromDate = data.updated ; // Default to 2000-01-01 if no date provided
      }catch(e){
         fromDate =  '2000-01-01';
        console.error('Error fetching from date:', e);
      }
     
    }

    // Set default dates if not provided
    // const fromDate = from || '2000-01-01';
    const toDate = to || '2050-01-01';
    
    console.log('Attempting to connect to SQL Server:', config.server);
    console.log('Date range:', { fromDate, toDate });
    
    // Connect to SQL Server using ConnectionPool
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    
    console.log('Connected to SQL Server successfully');
    
    // Execute query with date filtering
    const result = await pool.request()
      .input('fromDate', sql.DateTime, fromDate)
      .input('toDate', sql.DateTime, toDate)
      .query('SELECT "Employee code" as empcode, "Email" as email, "Corporate Phone Number" as mobile, "updatedate" as updated , "Date Of Birth" as dob ,"Department" as dep ,"Direct Manager CODE" as managercode ,"ID NAME" as name ,"ID Name AR" as namear ,"First Name" as firstname ,"First Name AR" as firstnamear ,"Last Name" as lastname ,"Last Name AR" as lastnamear ,"Gender" as gender ,"Grade Internal" as gradeinternal ,"Grade Official" as gradeofficial ,"Nationality" as nationality ,"Position" as position , CASE WHEN "Status" = \'Active\' THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END as access FROM vw_HHP_HR WHERE updatedate >= @fromDate AND updatedate <= @toDate ORDER BY updatedate ASC');


 await fetch('https://n8n.srv869586.hstgr.cloud/webhook/accd78b5-3fdc-4c18-b0b5-4dc7c1ad9cbe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ empsdata: result.recordset })
    });

    console.log('Query executed successfully, rows returned:', result.recordset.length);
    
    // Close connection
    await pool.close();
    
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Database error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code,
      originalError: (error as { originalError?: Error })?.originalError,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Close connection if it was opened
    if (pool) {
      try {
        await pool.close();
      } catch (closeError) {
        console.error('Error closing connection:', closeError);
      }
    }
    
    // Return more specific error information
    let errorMessage = 'Failed to fetch data from database';
    let errorCode = 'UNKNOWN_ERROR';
    
    if (error instanceof Error) {
      if (error.message.includes('ETIMEOUT') || error.message.includes('timeout')) {
        errorMessage = 'Database connection timeout. Please check if the SQL Server is accessible.';
        errorCode = 'CONNECTION_TIMEOUT';
      } else if (error.message.includes('Failed to connect')) {
        errorMessage = 'Cannot connect to SQL Server. Please verify server address and credentials.';
        errorCode = 'CONNECTION_FAILED';
      } else if (error.message.includes('Login failed')) {
        errorMessage = 'Database authentication failed. Please check username and password.';
        errorCode = 'AUTH_FAILED';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        code: errorCode,
        details: error instanceof Error ? error.message : 'Unknown error',
        server: config.server,
        database: config.database
      },
      { status: 500 }
    );
  }
}
