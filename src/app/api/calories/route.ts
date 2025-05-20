import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, date, activity, duration, calories } = await req.json();
    console.log('Received:', { userId, date, activity, duration, calories });
    const entry = await prisma.caloriesEntry.create({
      data: { userId, date, activity, duration, calories }
    });
    console.log('Created entry:', entry);
    return NextResponse.json(entry);
  } catch (err) {
    console.error('API POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json([], { status: 400 });
    const entries = await prisma.caloriesEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(entries);
  } catch (err) {
    console.error('API GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 