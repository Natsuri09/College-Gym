import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { emailOrUsername, password } = await request.json();

    // Input validation
    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { error: 'Both email/username and password are required' },
        { status: 400 }
      );
    }

    // Normalize input
    const input = emailOrUsername.trim().toLowerCase();

    // Special case: Only allow this manager (no DB lookup)
    if (input === 'npema2017@gmail.com' && password === 'Natsuri09') {
      const userData = {
        id: 'manager-id',
        name: 'Gym Manager',
        email: 'npema2017@gmail.com',
        username: 'manager',
        role: 'manager',
      };
      const token = jwt.sign(
        { userId: userData.id, email: userData.email, role: userData.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      return NextResponse.json({
        message: 'Login successful',
        token,
        user: userData,
      });
    }

    console.log('Attempting to find user with input:', input);

    // Find user - try exact username match first
    let user = await prisma.user.findFirst({
      where: {
        username: emailOrUsername, // Exact username match
      },
    });

    // If no user found with exact username, try email
    if (!user) {
      user = await prisma.user.findFirst({
        where: {
          email: input, // Case-insensitive email match
        },
      });
    }

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('Comparing passwords...');
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log('Password correct:', isPasswordCorrect);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
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

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    // Return more detailed error information
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
