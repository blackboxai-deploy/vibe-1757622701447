// User authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: AuthCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

// Task management types
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  completed?: boolean;
}

export type TaskFilter = 'all' | 'pending' | 'completed' | 'overdue';

export type TaskSort = 'dueDate' | 'createdAt' | 'title' | 'status';

// Storage types
export interface StorageUser extends User {
  passwordHash: string;
}

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  expiresAt: string;
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined;
}

// API response types (for future backend integration)
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: FormErrors;
}