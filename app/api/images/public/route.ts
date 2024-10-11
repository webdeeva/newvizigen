import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    const images = await db.collection("images")
      .aggregate([
        { $match: { isPublic: true } },
        { $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        { $project: {
            _id: 1,
            imageUrl: 1,
            prompt: 1,
            createdAt: 1,
            username: "$user.username"
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      .toArray();

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching public images:', error);
    return NextResponse.json({ error: 'Failed to fetch public images' }, { status: 500 });
  }
}
