import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received body:', body);

    const { name, email, username, password, role } = body;

    if (!name || !email || !username || !password) {
      console.log('Missing fields');
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username },
        ],
      },
    });

    console.log('Existing user:', existingUser);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        username,
        password: hashedPassword,
        role: role || 'GymMember',
      },
    });

    console.log('New user created:', newUser);

    return NextResponse.json(
      { message: 'User registered successfully', userId: newUser.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register error:', error.message || error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 