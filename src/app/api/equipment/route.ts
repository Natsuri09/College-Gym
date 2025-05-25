import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    let imageUrl = '/images/equip.jpg'; // Default image

    if (imageFile) {
      try {
        // Convert the file to base64
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');
        const dataURI = `data:${imageFile.type};base64,${base64Image}`;

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(dataURI, {
            folder: 'gym-equipment',
          }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });

        imageUrl = (result as any).secure_url;
        console.log('Image uploaded successfully:', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
          { error: 'Error uploading image' },
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