// TypeScript interfaces for Borrower Management System
// These interfaces correspond to the JSON schemas in this directory

export interface Borrower {
  id?: string;
  fullname: string;
  email: string;
  primary_phone: string;
  secondary_phone?: string;
  gender: 'Male' | 'Female' | 'Other';
  date_of_birth: string; // YYYY-MM-DD format
  nationality: string;
  marital_status: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  occupation: string;
  employment_status: 'Employed' | 'Self-employed' | 'Unemployed';
  monthly_income: number;
  proof_of_identification: 'National ID' | 'Driver\'s License' | 'Passport' | 'Voter\'s Card';
  identification_number: string;
  identification_cards: string[]; // Base64 encoded images [front, back]
  address: string;
  city: string;
  state: string;
  zipcode: string;
  profile_image?: string; // Base64 encoded image
  branch: string;
  date_of_registration: string; // YYYY-MM-DD format
  status?: 'Active' | 'Inactive' | 'Suspended' | 'Blacklisted';
  created_at?: string; // ISO 8601 format
  updated_at?: string; // ISO 8601 format
  created_by?: string; // UUID
  updated_by?: string; // UUID
}

export interface Guarantor {
  id?: string;
  fullname: string;
  date_of_birth: string; // YYYY-MM-DD format
  gender: 'Male' | 'Female' | 'Other';
  phone_number: string;
  email: string;
  city: string;
  residential_address: string;
  relationship_type: 'Friend' | 'Family' | 'Colleague' | 'Other';
  relationship_duration: string;
  employment_status: 'Employed' | 'Self-employed' | 'Unemployed';
  monthly_income: number;
  id_type: 'National ID' | 'Driver\'s License' | 'Passport' | 'Voter\'s Card';
  id_number: string;
  identification_cards: string[]; // Base64 encoded images [front, back]
  profile_image?: string; // Base64 encoded passport photo
  signature?: string; // Base64 encoded signature image
  consent_date: string; // YYYY-MM-DD format
  borrower_id?: string; // UUID reference to borrower
  status?: 'Active' | 'Inactive' | 'Withdrawn' | 'Rejected';
  guarantee_amount?: number;
  guarantee_percentage?: number;
  created_at?: string; // ISO 8601 format
  updated_at?: string; // ISO 8601 format
  created_by?: string; // UUID
  updated_by?: string; // UUID
}

export interface Group {
  id?: string;
  name: string;
  description?: string;
  group_type?: 'Individual' | 'Joint' | 'Corporate' | 'Association' | 'Cooperative';
  max_members?: number;
  min_members?: number;
  group_leader_id?: string; // UUID reference to borrower
  group_secretary_id?: string; // UUID reference to borrower
  group_treasurer_id?: string; // UUID reference to borrower
  meeting_frequency?: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  meeting_day?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  meeting_time?: string; // HH:MM format
  meeting_venue?: string;
  savings_requirement?: number;
  loan_eligibility_months?: number;
  attendance_requirement?: number;
  branch_id?: string; // UUID reference to branch
  field_officer_id?: string; // UUID reference to user
  formation_date?: string; // YYYY-MM-DD format
  status?: 'Active' | 'Inactive' | 'Suspended' | 'Dissolved';
  total_members?: number;
  total_savings?: number;
  total_outstanding_loans?: number;
  created_at?: string; // ISO 8601 format
  updated_at?: string; // ISO 8601 format
  created_by?: string; // UUID
  updated_by?: string; // UUID
}

// Form data interfaces for creating/updating entities
export interface CreateBorrowerRequest {
  fullname: string;
  email: string;
  primary_phone: string;
  secondary_phone?: string;
  gender: Borrower['gender'];
  date_of_birth: string;
  nationality: string;
  marital_status: Borrower['marital_status'];
  occupation: string;
  employment_status: Borrower['employment_status'];
  monthly_income: number;
  proof_of_identification: Borrower['proof_of_identification'];
  identification_number: string;
  identification_cards: string[];
  address: string;
  city: string;
  state: string;
  zipcode: string;
  profile_image?: string;
  branch: string;
  date_of_registration: string;
}

export interface CreateGuarantorRequest {
  fullname: string;
  date_of_birth: string;
  gender: Guarantor['gender'];
  phone_number: string;
  email: string;
  city: string;
  residential_address: string;
  relationship_type: Guarantor['relationship_type'];
  relationship_duration: string;
  employment_status: Guarantor['employment_status'];
  monthly_income: number;
  id_type: Guarantor['id_type'];
  id_number: string;
  identification_cards: string[];
  profile_image?: string;
  signature?: string;
  consent_date: string;
  borrower_id?: string;
  guarantee_amount?: number;
  guarantee_percentage?: number;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  group_type?: Group['group_type'];
  max_members?: number;
  min_members?: number;
  group_leader_id?: string;
  group_secretary_id?: string;
  group_treasurer_id?: string;
  meeting_frequency?: Group['meeting_frequency'];
  meeting_day?: Group['meeting_day'];
  meeting_time?: string;
  meeting_venue?: string;
  savings_requirement?: number;
  loan_eligibility_months?: number;
  attendance_requirement?: number;
  branch_id?: string;
  field_officer_id?: string;
  formation_date?: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

// File upload interfaces
export interface FileUpload {
  uid: string;
  name: string;
  status: 'uploading' | 'done' | 'error' | 'removed';
  url?: string;
  originFileObj?: File;
  preview?: string;
}

export interface ImageUploadConfig {
  accept: string;
  maxSizeMB: number;
  maxCount: number;
  placeholder: string;
}

// Validation interfaces
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Utility types
export type EntityStatus = 'Active' | 'Inactive' | 'Suspended' | 'Blacklisted' | 'Withdrawn' | 'Rejected' | 'Dissolved';

export type Gender = 'Male' | 'Female' | 'Other';

export type EmploymentStatus = 'Employed' | 'Self-employed' | 'Unemployed';

export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed';

export type IdType = 'National ID' | 'Driver\'s License' | 'Passport' | 'Voter\'s Card';

export type RelationshipType = 'Friend' | 'Family' | 'Colleague' | 'Other';

export type GroupType = 'Individual' | 'Joint' | 'Corporate' | 'Association' | 'Cooperative';

export type MeetingFrequency = 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Quarterly' | 'Annually';

// Form field interfaces for Ant Design components
export interface FormFieldConfig {
  name: string;
  label: string;
  required?: boolean;
  rules?: any[];
  placeholder?: string;
  type?: 'text' | 'email' | 'phone' | 'number' | 'date' | 'select' | 'upload' | 'textarea';
  options?: { label: string; value: any }[];
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
}

// Search and filter interfaces
export interface SearchFilters {
  keyword?: string;
  status?: EntityStatus;
  branch?: string;
  dateFrom?: string;
  dateTo?: string;
  employment_status?: EmploymentStatus;
  gender?: Gender;
}

export interface SortOptions {
  field: string;
  order: 'ascend' | 'descend';
}

