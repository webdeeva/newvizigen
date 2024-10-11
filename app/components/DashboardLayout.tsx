"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Home, Image, BookOpen, Users, User, LogOut, Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const isAdmin = (session?.user as any)?.isAdmin;

  const navLinkClass = "flex items-center px-4 py-2 text-gray-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300";

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700">
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <span className="text-lg font-semibold text-white">AI Image Generator</span>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 py-4">
            <li>
              <Link href="/generate" className={navLinkClass}>
                <Image className="w-5 h-5 mr-3" />
                <span>Generate</span>
              </Link>
            </li>
            <li>
              <Link href="/tutorial" className={navLinkClass}>
                <BookOpen className="w-5 h-5 mr-3" />
                <span>Tutorial</span>
              </Link>
            </li>
            <li>
              <Link href="/community" className={navLinkClass}>
                <Users className="w-5 h-5 mr-3" />
                <span>Community</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          <Button onClick={handleSignOut} className="w-full flex items-center justify-center">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-gray-800 border-b border-gray-700">
          <button className="md:hidden text-gray-300 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div></div>
          <div className="flex items-center">
            {isAdmin && (
              <Link href="/admin" className="mr-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            <Link href="/profile" className="flex items-center text-gray-300 hover:text-white">
              <User className="w-5 h-5 mr-2" />
              <span>{session?.user?.name || 'Profile'}</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
