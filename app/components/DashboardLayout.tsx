import React from 'react';
import Link from 'next/link';
import { Home, Image, BookOpen, Users, User, Menu } from 'lucide-react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800">
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <span className="text-lg font-semibold text-white">AI Image Generator</span>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 py-4">
            <li>
              <Link href="/" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                <Home className="w-5 h-5 mr-3" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/generate" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                <Image className="w-5 h-5 mr-3" />
                <span>Generate</span>
              </Link>
            </li>
            <li>
              <Link href="/tutorial" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                <BookOpen className="w-5 h-5 mr-3" />
                <span>Tutorial</span>
              </Link>
            </li>
            <li>
              <Link href="/community" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                <Users className="w-5 h-5 mr-3" />
                <span>Community</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-gray-900 border-b border-gray-700">
          <button className="md:hidden text-gray-300 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div></div>
          <Link href="/profile" className="flex items-center text-gray-300 hover:text-white">
            <User className="w-5 h-5 mr-2" />
            <span>Profile</span>
          </Link>
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
