import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <h1 className="text-4xl font-bold mb-8 text-white">Welcome to AI Image Generator</h1>
      <Link href="/generate">
        <Button className="bg-white text-purple-600 hover:bg-purple-100">Start Generating</Button>
      </Link>
    </div>
  );
}