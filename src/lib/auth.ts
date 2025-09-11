import { User, AuthCredentials, SignupData } from '@/types';
import { userStorage, sessionStorage } from './storage';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation (minimum 6 characters)
const MIN_PASSWORD_LENGTH = 6;

export const authUtils = {
  // Validate email format
  isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email);
  },

  // Validate password strength
  isValidPassword(password: string): boolean {
    return password.length >= MIN_PASSWORD_LENGTH;
  },

  // Validate signup data
  validateSignup(data: SignupData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    // Name validation
    if (!data.name.trim()) {
      errors.name = 'Name is required';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!data.password) {
      errors.password = 'Password is required';
    } else if (!this.isValidPassword(data.password)) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
    }

    // Confirm password validation
    if (!data.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Validate login data
  validateLogin(data: AuthCredentials): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!data.password) {
      errors.password = 'Password is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Sign up new user
  async signup(data: SignupData): Promise<{ success: boolean; user?: User; errors?: Record<string, string> }> {
    // Validate input data
    const validation = this.validateSignup(data);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    try {
      // Check if user already exists
      const existingUser = userStorage.findByEmail(data.email);
      if (existingUser) {
        return { 
          success: false, 
          errors: { email: 'An account with this email already exists' }
        };
      }

      // Create new user
      const user = userStorage.create(data.email, data.password, data.name.trim());
      
      // Create session
      sessionStorage.create(user);

      return { success: true, user };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        errors: { general: 'Failed to create account. Please try again.' }
      };
    }
  },

  // Log in existing user
  async login(credentials: AuthCredentials): Promise<{ success: boolean; user?: User; errors?: Record<string, string> }> {
    // Validate input data
    const validation = this.validateLogin(credentials);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    try {
      // Verify credentials
      const user = userStorage.verify(credentials.email, credentials.password);
      if (!user) {
        return { 
          success: false, 
          errors: { general: 'Invalid email or password' }
        };
      }

      // Create session
      sessionStorage.create(user);

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        errors: { general: 'Failed to log in. Please try again.' }
      };
    }
  },

  // Log out user
  logout(): void {
    sessionStorage.clear();
  },

  // Get current user from session
  getCurrentUser(): User | null {
    const session = sessionStorage.get();
    if (!session) return null;

    // Verify user still exists
    const user = userStorage.findById(session.userId);
    if (!user) {
      sessionStorage.clear();
      return null;
    }

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
};