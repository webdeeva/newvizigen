import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).isAdmin) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  const { id } = params;
  const { action } = await request.json();

  try {
    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    let updateOperation;
    switch (action) {
      case 'suspend':
        updateOperation = { $set: { isSuspended: true } };
        break;
      case 'unsuspend':
        updateOperation = { $set: { isSuspended: false } };
        break;
      case 'promote':
        updateOperation = { $set: { isAdmin: true } };
        break;
      case 'delete':
        const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User deleted successfully' });
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (updateOperation) {
      const result = await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        updateOperation
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'User updated successfully' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
