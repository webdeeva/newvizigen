import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from "@/lib/mongodb";
import { createUser } from "@/models/User";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

const generateFakeUser = async (index: number) => {
  const username = `user${index}`;
  const email = `user${index}@example.com`;
  const password = await bcrypt.hash('password123', 10);
  
  const avatar = createAvatar(lorelei, { seed: username });
  const avatarUrl = await avatar.toDataUri();

  const user = createUser(username, email, password);
  user.avatarUrl = avatarUrl;
  user.isAdmin = false;
  user.createdAt = new Date(Date.now() - Math.floor(Math.random() * 10000000000)); // Random date within last ~4 months

  return user;
};

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("ai_image_generator");

    const fakeUsers = await Promise.all(
      Array.from({ length: 10 }, (_, i) => generateFakeUser(i + 1))
    );

    const result = await db.collection('users').insertMany(fakeUsers);

    return NextResponse.json({ message: 'Fake users created successfully', count: result.insertedCount }, { status: 201 });
  } catch (error) {
    console.error('Error creating fake users:', error);
    return NextResponse.json({ error: 'Failed to create fake users' }, { status: 500 });
  }
}
