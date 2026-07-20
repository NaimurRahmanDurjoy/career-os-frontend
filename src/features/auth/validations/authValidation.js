import { z } from 'zod';

/**
 * Validation schema for user authentication / login form
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' })
    .trim(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

/**
 * Validation schema for user registration form
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Full name is required' })
      .min(2, { message: 'Name must be at least 2 characters long' })
      .trim(),
    email: z
      .string()
      .min(1, { message: 'Email address is required' })
      .email({ message: 'Please enter a valid email address' })
      .trim(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    passwordConfirmation: z
      .string()
      .min(1, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'], // Mounts the error directly on the confirmation field
  });