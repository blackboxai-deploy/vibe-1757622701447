'use client';

import { useState, useEffect, useMemo } from 'react';
import { Task, TaskFilter, TaskSort, CreateTaskData, UpdateTaskData } from '@/types';
import { taskStorage } from '@/lib/storage';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sortBy, setSortBy] = useState<TaskSort>('dueDate');

  // Load tasks on mount or when userId changes
  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userTasks = taskStorage.getUserTasks(userId);
      setTasks(userTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    if (!tasks.length) return [];

    // Apply filter
    let filtered = tasks;
    const now = new Date();

    switch (filter) {
      case 'pending':
        filtered = tasks.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = tasks.filter(task => task.completed);
        break;
      case 'overdue':
        filtered = tasks.filter(task => 
          !task.completed && 
          task.dueDate && 
          new Date(task.dueDate) < now
        );
        break;
      case 'all':
      default:
        filtered = tasks;
        break;
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        
        case 'title':
          return a.title.localeCompare(b.title);
        
        case 'status':
          if (a.completed && !b.completed) return 1;
          if (!a.completed && b.completed) return -1;
          return 0;
        
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, filter, sortBy]);

  // Task statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const now = new Date();
    const overdue = tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    ).length;

    return { total, completed, pending, overdue };
  }, [tasks]);

  // Create new task
  const createTask = async (taskData: CreateTaskData): Promise<Task | null> => {
    if (!userId) return null;

    try {
      const newTask = taskStorage.create(userId, taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      return null;
    }
  };

  // Update task
  const updateTask = async (taskId: string, updates: UpdateTaskData): Promise<Task | null> => {
    try {
      const updatedTask = taskStorage.update(taskId, updates);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
        ));
      }
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task:', error);
      return null;
    }
  };

  // Delete task
  const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
      const success = taskStorage.delete(taskId);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
      }
      return success;
    } catch (error) {
      console.error('Failed to delete task:', error);
      return false;
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId: string): Promise<Task | null> => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    return updateTask(taskId, { completed: !task.completed });
  };

  // Helper function to check if task is overdue
  const isOverdue = (task: Task): boolean => {
    if (task.completed || !task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  };

  return {
    tasks: filteredAndSortedTasks,
    allTasks: tasks,
    loading,
    filter,
    sortBy,
    stats,
    setFilter,
    setSortBy,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    isOverdue
  };
}