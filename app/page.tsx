import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <main className="text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          AI Image Generator
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          Create stunning, unique images with the power of AI. Our advanced algorithms turn your ideas into visual masterpieces.
        </p>
        <div className="space-x-4">
          <Link href="/login">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-pink-600 hover:bg-pink-700">
              Register
            </Button>
          </Link>
        </div>
      </main>
      <footer className="mt-8 text-gray-400">
        <p>© 2023 AI Image Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}
