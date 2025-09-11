'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Smart Task Organization',
    description: 'Create, categorize, and organize your tasks with an intuitive interface that adapts to your workflow.',
    icon: '📝'
  },
  {
    title: 'Due Date Tracking',
    description: 'Set due dates for your tasks and get visual indicators for upcoming and overdue items.',
    icon: '📅'
  },
  {
    title: 'Progress Monitoring',
    description: 'Track your productivity with completion statistics and visual progress indicators.',
    icon: '📊'
  },
  {
    title: 'Secure & Private',
    description: 'Your tasks are stored securely with user authentication protecting your personal data.',
    icon: '🔒'
  },
  {
    title: 'Responsive Design',
    description: 'Access your tasks from any device with our mobile-optimized responsive interface.',
    icon: '📱'
  },
  {
    title: 'Quick Actions',
    description: 'Efficiently manage tasks with quick actions like mark complete, edit, and delete.',
    icon: '⚡'
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to stay organized
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            TaskFlow provides all the essential features to help you manage your tasks effectively and boost your productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6">
            Ready to transform how you manage your tasks?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Get Started Free
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}