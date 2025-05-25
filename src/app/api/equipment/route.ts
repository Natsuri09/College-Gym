import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json(
      { error: 'Error fetching equipment' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    console.log('Received form data:', Object.fromEntries(formData));

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;

    if (!name || !description) {
      console.log('Missing required fields:', { name, description });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For now, use a default image URL since we can't store files in Vercel
    const imageUrl = '/images/default-equipment.png';

    // Create equipment with the image URL
    const equipment = await prisma.equipment.create({
      data: {
        name,
        description,
        imageUrl,
      },
    });

    console.log('Created equipment:', equipment);
    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Error creating equipment:', error);
    return NextResponse.json(
      { error: 'Error creating equipment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 