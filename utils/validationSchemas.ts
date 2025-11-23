// Utility for form validation rules
import * as yup from 'yup';

export const authValidationSchema = {
  login: yup.object({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required')
      .max(255, 'Email must be less than 255 characters'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(255, 'Password must be less than 255 characters')
      .required('Password is required'),
  }),

  register: yup.object({
    firstName: yup
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .required('First name is required'),
    lastName: yup
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .required('Last name is required'),
    username: yup
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be less than 30 characters')
      .matches(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
      .required('Username is required'),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required')
      .max(255, 'Email must be less than 255 characters'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(255, 'Password must be less than 255 characters')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
  }),
};

export type LoginFormData = yup.InferType<typeof authValidationSchema.login>;
export type RegisterFormData = yup.InferType<typeof authValidationSchema.register>;