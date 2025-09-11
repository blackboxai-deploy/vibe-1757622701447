'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateTaskData, Task } from '@/types';

interface TaskFormProps {
  onSubmit: (taskData: CreateTaskData) => Promise<Task | null>;
  onCancel?: () => void;
  initialData?: Partial<CreateTaskData>;
  mode?: 'create' | 'edit';
}

export function TaskForm({ onSubmit, onCancel, initialData, mode = 'create' }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters long';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await onSubmit(formData);
      if (result) {
        // Reset form if creating new task
        if (mode === 'create') {
          setFormData({ title: '', description: '', dueDate: '' });
        }
        setErrors({});
        
        // Call onCancel to close form if it exists
        onCancel?.();
      }
    } catch (error) {
      console.error('Failed to save task:', error);
      setErrors({ general: 'Failed to save task. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '', dueDate: '' });
    setErrors({});
    onCancel?.();
  };

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {mode === 'edit' ? 'Edit Task' : 'Create New Task'}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={handleInputChange}
              disabled={isLoading}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add task description (optional)..."
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formatDateForInput(formData.dueDate || '')}
              onChange={handleInputChange}
              disabled={isLoading}
              className={errors.dueDate ? 'border-red-500' : ''}
              min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500">{errors.dueDate}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                mode === 'edit' ? 'Updating...' : 'Creating...'
              ) : (
                mode === 'edit' ? 'Update Task' : 'Create Task'
              )}
            </Button>
            
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </form>
    </Card>
  );
}