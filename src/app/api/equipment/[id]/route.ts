import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: 'Missing equipment ID' }, { status: 400 });
  }
  try {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid equipment ID' }, { status: 400 });
    }
    await prisma.equipment.delete({
      where: {
        id: numericId
      }
    });
    return NextResponse.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({
      error: 'Failed to delete equipment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 