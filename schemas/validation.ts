// Validation utilities for Borrower Management System
import { ValidationError, ValidationResult } from './types';

// Common validation patterns
const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\d{7,15}$/,
  ZIPCODE: /^\d{4,10}$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  BASE64_IMAGE: /^data:image\/(jpeg|jpg|png|webp);base64,/i
};

// Core validation functions
export const validators = {
  required: (value: any, fieldName: string): ValidationError | null => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return { field: fieldName, message: `${fieldName} is required`, value };
    }
    return null;
  },

  email: (value: string, fieldName: string): ValidationError | null => {
    if (value && !PATTERNS.EMAIL.test(value)) {
      return { field: fieldName, message: `${fieldName} must be a valid email address`, value };
    }
    return null;
  },

  phone: (value: string, fieldName: string): ValidationError | null => {
    if (value && !PATTERNS.PHONE.test(value)) {
      return { field: fieldName, message: `${fieldName} must be 7-15 digits`, value };
    }
    return null;
  },

  zipcode: (value: string, fieldName: string): ValidationError | null => {
    if (value && !PATTERNS.ZIPCODE.test(value)) {
      return { field: fieldName, message: `${fieldName} must be 4-10 digits`, value };
    }
    return null;
  },

  date: (value: string, fieldName: string): ValidationError | null => {
    if (value && !PATTERNS.DATE.test(value)) {
      return { field: fieldName, message: `${fieldName} must be in YYYY-MM-DD format`, value };
    }
    if (value && new Date(value) > new Date()) {
      return { field: fieldName, message: `${fieldName} cannot be in the future`, value };
    }
    return null;
  },

  min: (value: number, min: number, fieldName: string): ValidationError | null => {
    if (value !== undefined && value < min) {
      return { field: fieldName, message: `${fieldName} must be at least ${min}`, value };
    }
    return null;
  },

  max: (value: number, max: number, fieldName: string): ValidationError | null => {
    if (value !== undefined && value > max) {
      return { field: fieldName, message: `${fieldName} must be no more than ${max}`, value };
    }
    return null;
  },

  enum: (value: any, allowedValues: any[], fieldName: string): ValidationError | null => {
    if (value && !allowedValues.includes(value)) {
      return { field: fieldName, message: `${fieldName} must be one of: ${allowedValues.join(', ')}`, value };
    }
    return null;
  },

  arrayLength: (value: any[], min: number, max: number, fieldName: string): ValidationError | null => {
    if (value && (value.length < min || value.length > max)) {
      return { field: fieldName, message: `${fieldName} must have between ${min} and ${max} items`, value };
    }
    return null;
  },

  base64Image: (value: string, fieldName: string): ValidationError | null => {
    if (value && !PATTERNS.BASE64_IMAGE.test(value)) {
      return { field: fieldName, message: `${fieldName} must be a valid base64 image`, value };
    }
    return null;
  }
};

// Utility functions
export function formatValidationErrors(errors: ValidationError[]): string[] {
  return errors.map(error => `${error.field}: ${error.message}`);
}

export function hasFieldError(fieldName: string, errors: ValidationError[]): boolean {
  return errors.some(error => error.field === fieldName);
}

export function getFieldError(fieldName: string, errors: ValidationError[]): string | null {
  const error = errors.find(error => error.field === fieldName);
  return error ? error.message : null;
}

export default {
  validators,
  formatValidationErrors,
  hasFieldError,
  getFieldError
}; 