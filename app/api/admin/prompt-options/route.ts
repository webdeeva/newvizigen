import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    console.log('Attempting to connect to the database...');
    const client = await clientPromise;
    console.log('Connected to the database successfully');

    const db = client.db("ai_image_generator");
    console.log('Accessing ai_image_generator database');

    const options = await db.collection("prompt_options").find().toArray();
    console.log('Fetched prompt options from database:', options);

    return NextResponse.json(options);
  } catch (error) {
    console.error('Error fetching prompt options:', error);
    return NextResponse.json({ error: 'Failed to fetch prompt options' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { option } = await req.json();
    const client = await clientPromise;
    const db = client.db("ai_image_generator");
    const result = await db.collection("prompt_options").insertOne({ text: option, values: [] });
    return NextResponse.json({ message: 'Prompt option added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding prompt option:', error);
    return NextResponse.json({ error: 'Failed to add prompt option' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, value } = await req.json();
    console.log(`Attempting to add value "${value}" to option with id "${id}"`);
    
    const client = await clientPromise;
    const db = client.db("ai_image_generator");
    
    // Log the document before update
    const beforeDoc = await db.collection("prompt_options").findOne({ _id: new ObjectId(id) });
    console.log('Document before update:', beforeDoc);

    const result = await db.collection("prompt_options").updateOne(
      { _id: new ObjectId(id) },
      { $push: { values: value } }
    );
    
    console.log('Update result:', result);
    
    // Log the document after update
    const afterDoc = await db.collection("prompt_options").findOne({ _id: new ObjectId(id) });
    console.log('Document after update:', afterDoc);

    if (result.matchedCount === 0) {
      console.error(`No document found with id "${id}"`);
      return NextResponse.json({ error: 'Prompt option not found' }, { status: 404 });
    }
    
    if (result.modifiedCount === 0) {
      console.error(`Value "${value}" was not added to the document`);
      return NextResponse.json({ error: 'Failed to add value to prompt option' }, { status: 500 });
    }
    
    console.log(`Successfully added value "${value}" to option with id "${id}"`);
    return NextResponse.json({ message: 'Prompt option value added successfully' });
  } catch (error) {
    console.error('Error adding prompt option value:', error);
    return NextResponse.json({ error: 'Failed to add prompt option value' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const value = searchParams.get('value');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    if (value) {
      // Delete a specific value from the option
      const result = await db.collection("prompt_options").updateOne(
        { _id: new ObjectId(id) },
        { $pull: { values: value } as any }
      );
      console.log('Delete value result:', result);
      if (result.modifiedCount === 0) {
        return NextResponse.json({ error: 'Value not found or already deleted' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Prompt option value deleted successfully' });
    } else {
      // Delete the entire option
      const result = await db.collection("prompt_options").deleteOne({ _id: new ObjectId(id) });
      console.log('Delete option result:', result);
      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Prompt option not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Prompt option deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting prompt option or value:', error);
    return NextResponse.json({ error: 'Failed to delete prompt option or value' }, { status: 500 });
  }
}
