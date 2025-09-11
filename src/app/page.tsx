'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/landing/navigation';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { AboutSection } from '@/components/landing/about-section';
import { useAuthContext } from '@/components/auth/auth-provider';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render landing page if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="ml-2 text-xl font-bold">TaskFlow</span>
              </div>
              <p className="text-gray-400">
                Simplifying task management for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Task Organization</li>
                <li>Due Date Tracking</li>
                <li>Progress Monitoring</li>
                <li>Secure Storage</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Get Started</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/auth/signup" className="hover:text-white transition-colors">
                    Create Account
                  </a>
                </li>
                <li>
                  <a href="/auth/login" className="hover:text-white transition-colors">
                    Sign In
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Learn More
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TaskFlow. Built with Next.js and passion for productivity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}