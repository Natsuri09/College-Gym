import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Missing equipment ID' }, { status: 400 });
  }
  try {
    await prisma.equipment.delete({ where: { id } });
    return NextResponse.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete equipment', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 