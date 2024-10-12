import { NextRequest, NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'hot';

    let sortStage;
    switch (filter) {
      case 'hot':
        sortStage = { $sort: { favorites: -1, createdAt: -1 } };
        break;
      case 'newest':
        sortStage = { $sort: { createdAt: -1 } };
        break;
      case 'all':
      default:
        sortStage = { $sort: { createdAt: -1 } };
        break;
    }

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
            username: "$user.username",
            favorites: { $ifNull: ["$favorites", 0] }
          }
        },
        sortStage
      ])
      .toArray();

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching public images:', error);
    return NextResponse.json({ error: 'Failed to fetch public images' }, { status: 500 });
  }
}
