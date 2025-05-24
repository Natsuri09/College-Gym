import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add a GET method for testing database connection
export async function GET() {
  try {
    // Test environment variables
    const envCheck = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrl: process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set',
    };

    // Test database connection
    let dbStatus = 'not tested';
    try {
      await prisma.$connect();
      dbStatus = 'connected';
      
      // Try a simple query
      const userCount = await prisma.user.count();
      dbStatus += ` (${userCount} users found)`;
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
  console.log('Register route called');
  try {
    console.log('Attempting to parse request body');
    const body = await request.json();
    console.log('Request body parsed successfully');
    
    const { name, email, username, password, role } = body;

    // Validate required fields
    if (!name || !email || !username || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, username: !!username, password: !!password });
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    console.log('Checking for existing user with email:', normalizedEmail, 'or username:', username);

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: normalizedEmail }, { username }],
        },
      });

      if (existingUser) {
        console.log('User already exists:', { email: existingUser.email, username: existingUser.username });
        return NextResponse.json(
          { error: 'Email or username already exists' },
          { status: 400 }
        );
      }

      console.log('Hashing password');
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log('Creating new user');
      // Create new user
      const user = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          username,
          password: hashedPassword,
          role: role || 'GymMember',
        },
      });

      console.log('User created successfully:', { id: user.id, email: user.email });
      return NextResponse.json(
        { message: 'User registered successfully', userId: user.id },
        { status: 201 }
      );
    } catch (dbError: unknown) {
      console.error('Database error details:', {
        name: dbError instanceof Error ? dbError.name : 'Unknown',
        message: dbError instanceof Error ? dbError.message : String(dbError),
        stack: dbError instanceof Error ? dbError.stack : 'No stack trace'
      });
      return NextResponse.json(
        { error: 'Database error', details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Register error details:', {
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
