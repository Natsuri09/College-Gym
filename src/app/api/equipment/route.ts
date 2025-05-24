import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

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
      { error: 'Error fetching equipment', details: error instanceof Error ? error.message : 'Unknown error' },
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
    const quantity = parseInt(formData.get('quantity') as string) || 1;
    const status = formData.get('status') as string || 'available';
    const imageFile = formData.get('image') as File;

    if (!name || !description) {
      console.log('Missing required fields:', { name, description });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let imageUrl = '/images/default-equipment.png';

    if (imageFile) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = new Uint8Array(bytes);

        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await writeFile(path.join(uploadDir, imageFile.name), buffer);

        imageUrl = `/uploads/${imageFile.name}`;
        console.log('Image uploaded successfully:', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
          { error: 'Error uploading image', details: error instanceof Error ? error.message : 'Unknown error' },
          { status: 500 }
        );
      }
    }

    // Create equipment with the image URL
    const equipment = await prisma.equipment.create({
      data: {
        name,
        description,
        imageUrl,
        quantity,
        status,
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