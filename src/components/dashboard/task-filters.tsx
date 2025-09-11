'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskFilter, TaskSort } from '@/types';

interface TaskFiltersProps {
  filter: TaskFilter;
  sortBy: TaskSort;
  onFilterChange: (filter: TaskFilter) => void;
  onSortChange: (sort: TaskSort) => void;
  taskCounts: {
    all: number;
    pending: number;
    completed: number;
    overdue: number;
  };
}

export function TaskFilters({
  filter,
  sortBy,
  onFilterChange,
  onSortChange,
  taskCounts,
}: TaskFiltersProps) {
  const filterOptions = [
    { value: 'all' as TaskFilter, label: 'All Tasks', count: taskCounts.all },
    { value: 'pending' as TaskFilter, label: 'Pending', count: taskCounts.pending },
    { value: 'completed' as TaskFilter, label: 'Completed', count: taskCounts.completed },
    { value: 'overdue' as TaskFilter, label: 'Overdue', count: taskCounts.overdue },
  ];

  const sortOptions = [
    { value: 'dueDate' as TaskSort, label: 'Due Date' },
    { value: 'createdAt' as TaskSort, label: 'Created Date' },
    { value: 'title' as TaskSort, label: 'Title' },
    { value: 'status' as TaskSort, label: 'Status' },
  ];

  return (
    <div className="bg-white border-b px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const isActive = filter === option.value;
              const buttonVariant = isActive ? 'default' : 'outline';
              
              // Color coding for different filters
              let colorClass = '';
              if (isActive) {
                switch (option.value) {
                  case 'pending':
                    colorClass = 'bg-orange-600 hover:bg-orange-700';
                    break;
                  case 'completed':
                    colorClass = 'bg-green-600 hover:bg-green-700';
                    break;
                  case 'overdue':
                    colorClass = 'bg-red-600 hover:bg-red-700';
                    break;
                  default:
                    colorClass = 'bg-blue-600 hover:bg-blue-700';
                }
              }

              return (
                <Button
                  key={option.value}
                  variant={buttonVariant}
                  size="sm"
                  onClick={() => onFilterChange(option.value)}
                  className={`${colorClass} ${isActive ? 'text-white' : ''}`}
                >
                  {option.label}
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {option.count}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
            <Select value={sortBy} onValueChange={(value) => onSortChange(value as TaskSort)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filter Indicator */}
        {filter !== 'all' && (
          <div className="mt-3 text-sm text-gray-600">
            Showing {taskCounts[filter]} {filter} tasks
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange('all')}
              className="ml-2 h-auto p-0 text-blue-600 hover:text-blue-500"
            >
              Clear filter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}