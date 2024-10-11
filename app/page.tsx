import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-pink-600">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Welcome to AI Image Generator</h1>
        <p className="text-xl text-white mb-8">Create stunning AI-generated images with ease</p>
        <Link href="/generate">
          <Button className="bg-white text-purple-600 hover:bg-gray-100">
            Start Generating
          </Button>
        </Link>
      </div>
    </div>
  );
}
