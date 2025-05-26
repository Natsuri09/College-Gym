import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
console.log(Object.keys(prisma));

// Create a new booking (member)
export async function POST(req: NextRequest) {
  try {
    const { userId, startTime, endTime } = await req.json();
    if (!userId || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const booking = await prisma.gymBooking.create({
      data: {
        userId: Number(userId),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: 'pending',
      },
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// List bookings (manager or member)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const where: any = {};
  if (userId) where.userId = Number(userId);
  if (status) where.status = status;
  const bookings = await prisma.gymBooking.findMany({
    where,
    include: { user: true },
    orderBy: { startTime: 'desc' },
  });
  return NextResponse.json(bookings);
}

// Approve or reject a booking (manager)
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const booking = await prisma.gymBooking.update({
      where: { id: Number(id) },
      data: { status },
    });
    return NextResponse.json(booking);
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 