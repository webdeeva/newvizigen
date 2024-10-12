import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    const imageId = new ObjectId(params.id);

    const image = await db.collection("images").findOne({ _id: imageId });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Fetch the image data
    const imageResponse = await fetch(image.imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    // Get the file extension from the URL
    const fileExtension = image.imageUrl.split('.').pop().toLowerCase();

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="image-${params.id}.${fileExtension}"`);
    headers.set('Content-Type', `image/${fileExtension}`);

    return new NextResponse(imageBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error downloading image:', error);
    return NextResponse.json({ error: 'Failed to download image' }, { status: 500 });
  }
}
