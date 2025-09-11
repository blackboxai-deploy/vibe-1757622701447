'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { TaskForm } from '@/components/dashboard/task-form';
import { TaskFilters } from '@/components/dashboard/task-filters';
import { TaskList } from '@/components/dashboard/task-list';
import { useAuthContext } from '@/components/auth/auth-provider';
import { useTasks } from '@/hooks/use-tasks';
import { CreateTaskData, TaskFilter, TaskSort } from '@/types';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [showCreateTask, setShowCreateTask] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const {
    tasks,
    allTasks,
    loading: tasksLoading,
    filter,
    sortBy,
    stats,
    setFilter,
    setSortBy,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    isOverdue,
  } = useTasks(user?.id);

  // Show loading state
  if (authLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Calculate task counts for filters
  const taskCounts = {
    all: allTasks.length,
    pending: allTasks.filter(task => !task.completed).length,
    completed: allTasks.filter(task => task.completed).length,
    overdue: allTasks.filter(task => isOverdue(task)).length,
  };

  const handleCreateTask = async (taskData: CreateTaskData) => {
    const newTask = await createTask(taskData);
    if (newTask) {
      setShowCreateTask(false);
    }
    return newTask;
  };

  const handleFilterChange = (newFilter: TaskFilter) => {
    setFilter(newFilter);
  };

  const handleSortChange = (newSort: TaskSort) => {
    setSortBy(newSort);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader taskStats={stats} />

      {/* Task Filters */}
      <TaskFilters
        filter={filter}
        sortBy={sortBy}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        taskCounts={taskCounts}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Create Task Button */}
        <div className="mb-6">
          <Dialog open={showCreateTask} onOpenChange={setShowCreateTask}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full sm:w-auto">
                ➕ Create New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setShowCreateTask(false)}
                mode="create"
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Empty State or Task List */}
        {allTasks.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to get organized?
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first task and start managing your to-do list efficiently. 
                Set due dates, track progress, and stay productive!
              </p>
              <Button 
                onClick={() => setShowCreateTask(true)}
                size="lg"
              >
                Create Your First Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleTask={toggleTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            isOverdue={isOverdue}
          />
        )}
      </div>
    </div>
  );
}