import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from "@/lib/mongodb";
import { createUser } from "@/models/User";
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ai_image_generator');

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate avatar
    const avatar = createAvatar(lorelei, {
      seed: username,
    });
    const avatarUrl = await avatar.toDataUri();

    // Create user
    const newUser = createUser(username, email, hashedPassword);
    newUser.avatarUrl = avatarUrl;

    // Insert user into database
    const result = await db.collection('users').insertOne(newUser);

    return NextResponse.json({ message: 'User registered successfully', userId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
