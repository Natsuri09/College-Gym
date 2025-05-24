import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Verify JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

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
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

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

      return NextResponse.json({
        message: 'Login successful',
        token,
        user: userData,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
