'use client';

import { Card, CardContent } from '@/components/ui/card';

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            About TaskFlow
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            TaskFlow is designed to simplify task management and help you maintain focus on what matters most.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Why TaskFlow?
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Simple Yet Powerful</h4>
                <p className="text-gray-600">
                  We believe that task management shouldn't be complicated. TaskFlow provides powerful features 
                  in a clean, intuitive interface that anyone can master in minutes.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Focus on Productivity</h4>
                <p className="text-gray-600">
                  Every feature is designed to help you stay focused and productive. From smart due date tracking 
                  to progress monitoring, we help you accomplish more with less effort.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Built for Everyone</h4>
                <p className="text-gray-600">
                  Whether you're a student managing assignments, a professional handling projects, or just someone 
                  trying to organize daily tasks, TaskFlow adapts to your workflow.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <img
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c731179b-c98a-4873-a9eb-71ea343c32eb.png"
              alt="Team collaboration and productivity workspace with modern design elements"
              className="rounded-xl shadow-lg w-full h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                target.style.color = 'white';
                target.style.display = 'flex';
                target.style.alignItems = 'center';
                target.style.justifyContent = 'center';
                target.style.minHeight = '250px';
                target.style.fontSize = '16px';
                target.innerHTML = 'Productivity Workspace';
              }}
            />
            
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">10K+</div>
                    <div className="text-sm text-gray-600">Tasks Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 mb-1">99%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">500+</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 text-center">
          <Card className="bg-blue-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                To empower individuals and teams to achieve their goals through simple, effective task management 
                that reduces stress and increases productivity.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}