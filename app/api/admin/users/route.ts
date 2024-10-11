import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).isAdmin) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    const users = await db.collection("users").aggregate([
      {
        $lookup: {
          from: "images",
          localField: "_id",
          foreignField: "userId",
          as: "images"
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          createdAt: 1,
          isAdmin: 1,
          isSuspended: 1,
          imageCount: { $size: "$images" }
        }
      }
    ]).toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
