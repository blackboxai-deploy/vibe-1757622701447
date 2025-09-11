'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">TaskFlow</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Features
            </a>
            <a href="#about" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              About
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button - you can add mobile menu functionality later */}
      <div className="md:hidden px-4 py-2 border-t bg-gray-50">
        <div className="flex flex-col space-y-2">
          <a href="#features" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
            Features
          </a>
          <a href="#about" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
            About
          </a>
        </div>
      </div>
    </nav>
  );
}