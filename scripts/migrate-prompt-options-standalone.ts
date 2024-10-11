import { MongoClient } from 'mongodb';
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

let uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set in the environment variables.');
  process.exit(1);
}

// Remove problematic options from the URI
uri = (uri as string).split('?')[0]; // Remove query parameters

async function migratePromptOptions() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

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
    await client.close();
    console.log('Disconnected from MongoDB');
    process.exit();
  }
}

migratePromptOptions();
