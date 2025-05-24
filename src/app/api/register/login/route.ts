import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add a GET method for testing
export async function GET() {
  try {
    // Test environment variables
    const envCheck = {
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    };

    // Test database connection
    let dbStatus = 'not tested';
    try {
      await prisma.$connect();
      dbStatus = 'connected';
    } catch (dbError) {
      dbStatus = 'error: ' + (dbError instanceof Error ? dbError.message : String(dbError));
    } finally {
      await prisma.$disconnect();
    }

    return NextResponse.json({
      status: 'ok',
      environment: envCheck,
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Test endpoint error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log('Login route called');
  try {
    // Verify JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('Attempting to parse request body');
    const body = await request.json();
    console.log('Request body parsed successfully');
    
    const { emailOrUsername, password } = body;

    // Input validation
    if (!emailOrUsername || !password) {
      console.log('Missing credentials:', { emailOrUsername: !!emailOrUsername, password: !!password });
      return NextResponse.json(
        { error: 'Both email/username and password are required' },
        { status: 400 }
      );
    }

    // Normalize input
    const input = emailOrUsername.trim().toLowerCase();
    console.log('Searching for user with input:', input);

    // Special case: Only allow this manager (no DB lookup)
    if (input === 'npema2017@gmail.com' && password === 'Natsuri09') {
      console.log('Manager login detected');
      const userData = {
        id: 'manager-id',
        name: 'Gym Manager',
        email: 'npema2017@gmail.com',
        username: 'manager',
        role: 'manager',
      };
      const token = jwt.sign(
        { userId: userData.id, email: userData.email, role: userData.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return NextResponse.json({
        message: 'Login successful',
        token,
        user: userData,
      });
    }

    try {
      console.log('Attempting database query');
      // Find user
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: input },
            { username: emailOrUsername }, // username might be case-sensitive
          ],
        },
      });

      if (!user) {
        console.log('No user found with credentials');
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      console.log('User found, verifying password');
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        console.log('Invalid password');
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      console.log('Password verified, generating token');
      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Store user data in localStorage
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      };

      console.log('Login successful');
      return NextResponse.json({
        message: 'Login successful',
        token,
        user: userData,
      });
    } catch (dbError: unknown) {
      console.error('Database error details:', {
        name: dbError instanceof Error ? dbError.name : 'Unknown',
        message: dbError instanceof Error ? dbError.message : String(dbError),
        stack: dbError instanceof Error ? dbError.stack : 'No stack trace'
      });
      return NextResponse.json(
        { error: 'Database connection error', details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Login error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : String(error),
        type: error instanceof Error ? error.name : 'Unknown'
      },
      { status: 500 }
    );
  }
}
