import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, empcode } = body;

    // Get the Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header missing or invalid' },
        { status: 401 }
      );
    }

    const vtoken = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate required fields
    if (!password || !empcode) {
      return NextResponse.json(
        { error: 'Password and employee code are required' },
        { status: 400 }
      );
    }

    // Password validation
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return NextResponse.json(
        { error: 'Password does not meet security requirements' },
        { status: 400 }
      );
    }

    // Here you would typically make an API call to your backend service
    // For now, I'll create a placeholder that you can replace with your actual API endpoint
    
    // Example API call structure:
    /*
    const response = await fetch('YOUR_BACKEND_API_ENDPOINT/set-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${vtoken}`,
      },
      body: JSON.stringify({
        password: password,
        empcode: empcode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to set password' },
        { status: response.status }
      );
    }

    const result = await response.json();
    */

    // Temporary success response - replace with actual API integration
    console.log('Setting password for employee:', empcode, 'with token:', vtoken);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Password set successfully',
        empcode: empcode 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error setting password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
