'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            Organize Your Tasks
            <span className="block text-blue-600 mt-2">Stay Productive</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            TaskFlow helps you manage your daily tasks efficiently with a clean, intuitive interface. 
            Set due dates, track progress, and never miss an important deadline again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button asChild size="lg" className="min-w-48">
              <Link href="/auth/signup">Start Organizing Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-48">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <img
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f1a7c306-2081-4a31-a134-8ccae077f453.png"
                alt="Modern task management dashboard with clean interface showing organized todo lists and calendar view"
                className="rounded-xl shadow-2xl w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  target.style.color = 'white';
                  target.style.display = 'flex';
                  target.style.alignItems = 'center';
                  target.style.justifyContent = 'center';
                  target.style.minHeight = '300px';
                  target.style.fontSize = '18px';
                  target.innerHTML = 'Task Management Dashboard Preview';
                }}
              />
              
              {/* Floating elements for visual appeal */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-100 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}