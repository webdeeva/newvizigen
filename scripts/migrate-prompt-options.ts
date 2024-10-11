import { MongoClient } from 'mongodb';
import clientPromise from '../lib/mongodb';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) {
    acc[key.trim()] = value.trim();
  }
  return acc;
}, {} as Record<string, string>);

// Set environment variables
Object.entries(envVars).forEach(([key, value]) => {
  process.env[key] = value;
});

async function migratePromptOptions() {
  try {
    const client = await clientPromise;
    const db = client.db("ai_image_generator");
    const collection = db.collection("prompt_options");

    const result = await collection.updateMany(
      { values: { $exists: false } },
      { $set: { values: [] } }
    );

    console.log(`Updated ${result.modifiedCount} documents`);
  } catch (error) {
    console.error('Error migrating prompt options:', error);
  } finally {
    process.exit();
  }
}

migratePromptOptions();
