'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task, UpdateTaskData } from '@/types';
import { TaskForm } from './task-form';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => Promise<Task | null>;
  onUpdateTask: (taskId: string, updates: UpdateTaskData) => Promise<Task | null>;
  onDeleteTask: (taskId: string) => Promise<boolean>;
  isOverdue: (task: Task) => boolean;
}

export function TaskList({
  tasks,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  isOverdue,
}: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Check if it's tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    // Format as readable date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  const getTaskStatus = (task: Task) => {
    if (task.completed) {
      return { label: 'Completed', variant: 'default' as const, className: 'bg-green-100 text-green-800' };
    }
    
    if (isOverdue(task)) {
      return { label: 'Overdue', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' };
    }
    
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      if (daysDiff <= 1) {
        return { label: 'Due Soon', variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800' };
      }
    }
    
    return { label: 'Pending', variant: 'outline' as const, className: 'bg-blue-100 text-blue-800' };
  };

  const handleToggleTask = async (taskId: string) => {
    await onToggleTask(taskId);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (taskData: UpdateTaskData): Promise<Task | null> => {
    if (!editingTask) return null;
    
    const result = await onUpdateTask(editingTask.id, taskData);
    if (result) {
      setEditingTask(null);
    }
    return result;
  };

  const handleDeleteTask = async (taskId: string) => {
    setDeletingTaskId(taskId);
    try {
      const success = await onDeleteTask(taskId);
      if (success) {
        // Task deleted successfully
      }
    } finally {
      setDeletingTaskId(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">
              Start by creating your first task to get organized!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {tasks.map((task) => {
            const status = getTaskStatus(task);
            const isTaskOverdue = isOverdue(task);
            const isDeleting = deletingTaskId === task.id;

            return (
              <Card
                key={task.id}
                className={`transition-all duration-200 hover:shadow-md ${
                  task.completed ? 'opacity-75' : ''
                } ${isTaskOverdue && !task.completed ? 'border-red-200' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <div className="flex items-center pt-1">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTask(task.id)}
                        className="w-5 h-5"
                        disabled={isDeleting}
                      />
                    </div>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-lg font-medium ${
                              task.completed
                                ? 'line-through text-gray-500'
                                : 'text-gray-900'
                            }`}
                          >
                            {task.title}
                          </h3>
                          
                          {task.description && (
                            <p
                              className={`mt-1 text-sm ${
                                task.completed ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <Badge className={status.className}>
                              {status.label}
                            </Badge>
                            
                            {task.dueDate && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  isTaskOverdue && !task.completed
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                Due: {formatDate(task.dueDate)}
                              </span>
                            )}
                            
                            <span className="text-xs text-gray-400">
                              Created {formatDate(task.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTask(task)}
                            disabled={isDeleting}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              onSubmit={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
              initialData={{
                title: editingTask.title,
                description: editingTask.description,
                dueDate: editingTask.dueDate,
              }}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}