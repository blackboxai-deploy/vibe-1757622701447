import { User, Task, StorageUser, SessionData } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'todo_users',
  TASKS: 'todo_tasks',
  SESSION: 'todo_session',
} as const;

// Simple hash function for password storage (demo purposes only)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

// User storage functions
export const userStorage = {
  // Get all users
  getUsers(): StorageUser[] {
    if (typeof window === 'undefined') return [];
    try {
      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  },

  // Save users array
  saveUsers(users: StorageUser[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  },

  // Find user by email
  findByEmail(email: string): StorageUser | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  },

  // Find user by ID
  findById(id: string): StorageUser | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  },

  // Create new user
  create(email: string, password: string, name: string): User {
    const users = this.getUsers();
    const existingUser = this.findByEmail(email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: StorageUser = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      email,
      name,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Verify user credentials
  verify(email: string, password: string): User | null {
    const user = this.findByEmail(email);
    if (!user) return null;

    const passwordHash = simpleHash(password);
    if (user.passwordHash !== passwordHash) return null;

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};

// Session storage functions
export const sessionStorage = {
  // Get current session
  get(): SessionData | null {
    if (typeof window === 'undefined') return null;
    try {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!session) return null;

      const sessionData: SessionData = JSON.parse(session);
      
      // Check if session is expired
      if (new Date() > new Date(sessionData.expiresAt)) {
        this.clear();
        return null;
      }

      return sessionData;
    } catch {
      this.clear();
      return null;
    }
  },

  // Create new session
  create(user: User): void {
    if (typeof window === 'undefined') return;
    
    const sessionData: SessionData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  },

  // Clear session
  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }
};

// Task storage functions
export const taskStorage = {
  // Get all tasks for a user
  getUserTasks(userId: string): Task[] {
    if (typeof window === 'undefined') return [];
    try {
      const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      const allTasks: Task[] = tasks ? JSON.parse(tasks) : [];
      return allTasks.filter(task => task.userId === userId);
    } catch {
      return [];
    }
  },

  // Get all tasks
  getAllTasks(): Task[] {
    if (typeof window === 'undefined') return [];
    try {
      const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      return tasks ? JSON.parse(tasks) : [];
    } catch {
      return [];
    }
  },

  // Save all tasks
  saveTasks(tasks: Task[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  },

  // Create new task
  create(userId: string, taskData: { title: string; description?: string; dueDate?: string }): Task {
    const allTasks = this.getAllTasks();
    
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      completed: false,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    allTasks.push(newTask);
    this.saveTasks(allTasks);
    return newTask;
  },

  // Update task
  update(taskId: string, updates: Partial<Task>): Task | null {
    const allTasks = this.getAllTasks();
    const taskIndex = allTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return null;

    const updatedTask = {
      ...allTasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    allTasks[taskIndex] = updatedTask;
    this.saveTasks(allTasks);
    return updatedTask;
  },

  // Delete task
  delete(taskId: string): boolean {
    const allTasks = this.getAllTasks();
    const filteredTasks = allTasks.filter(task => task.id !== taskId);
    
    if (filteredTasks.length === allTasks.length) {
      return false; // Task not found
    }

    this.saveTasks(filteredTasks);
    return true;
  },

  // Find task by ID
  findById(taskId: string): Task | null {
    const allTasks = this.getAllTasks();
    return allTasks.find(task => task.id === taskId) || null;
  }
};