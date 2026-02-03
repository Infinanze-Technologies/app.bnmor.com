# Code Structure Documentation

## Overview
This document outlines the clean, well-structured codebase for the ERP system with comprehensive security and permission management.

## 🏗️ Architecture Overview

### Core Components Structure
```
src/
├── components/
│   ├── SecurityGuard.jsx          # Central security component
│   ├── DashboardLayout/          # Layout components
│   │   ├── DashSidebar.jsx       # Main sidebar component
│   │   └── Sidebars/             # Role-specific sidebars
│   │       ├── AdminSidebarItem.js  # Admin/Manager sidebar
│   │       └── EmpSidebar.js        # Employee sidebar
│   └── utils/
│       └── permissionUtils.js     # Permission utilities
├── hooks/
│   ├── useGetSingleEntity.js     # Data fetching hook
│   └── usePermissions.js         # Permission hook
└── pages/
    └── dashboard/
        ├── home/index.jsx        # Home page
        └── man_staff/
            └── all_employees/index.js  # Staff management
```

## 🔐 Security System

### SecurityGuard Component
**Location**: `src/components/SecurityGuard.jsx`

**Features**:
- Automatic role data fetching
- Permission-based access control
- Role information injection to children
- Custom permission checkers
- Loading states
- Access denied handling

**Usage**:
```jsx
<SecurityGuard
  user={props?.user}
  jwt={props?.jwt}
  requiredPermissions={[PERMISSIONS.USER_CREATE]}
  customChecker={(permissions, roleData) => {
    // Custom logic
    return hasAccess;
  }}
>
  <YourComponent />
</SecurityGuard>
```

### Permission System
**Location**: `src/utils/permissionUtils.js`

**Available Functions**:
- `hasPermission(permissions, permission)` - Check single permission
- `hasAnyPermission(permissions, requiredPermissions)` - Check any permission
- `hasAllPermissions(permissions, requiredPermissions)` - Check all permissions

**Permission Constants**:
```javascript
import { PERMISSIONS } from '@/utils/permissionUtils';

// Usage examples:
const hasUserCreatePermission = permissions?.includes(PERMISSIONS.USER_CREATE);
const hasAwardPermission = permissions?.includes(PERMISSIONS.AWARD_CREATE);
const hasPayrollPermission = permissions?.includes(PERMISSIONS.PAYROLL_READ);
```

**Available Permission Constants**:
- `PERMISSIONS.USER_CREATE`, `PERMISSIONS.USER_READ`, `PERMISSIONS.USER_UPDATE`, `PERMISSIONS.USER_DELETE`
- `PERMISSIONS.AWARD_CREATE`, `PERMISSIONS.AWARD_READ`, `PERMISSIONS.AWARD_UPDATE`, `PERMISSIONS.AWARD_DELETE`
- `PERMISSIONS.PAYROLL_CREATE`, `PERMISSIONS.PAYROLL_READ`, `PERMISSIONS.PAYROLL_UPDATE`, `PERMISSIONS.PAYROLL_DELETE`
- `PERMISSIONS.SETTINGS_CREATE`, `PERMISSIONS.SETTINGS_READ`, `PERMISSIONS.SETTINGS_UPDATE`, `PERMISSIONS.SETTINGS_DELETE`
- And many more for all system resources...

## 🎨 Sidebar Components

### DashSidebar
**Location**: `src/components/DashboardLayout/DashSidebar.jsx`

**Features**:
- Role-based sidebar rendering
- Dynamic component loading
- Permission-based menu items

### AdminSidebarItem
**Location**: `src/components/DashboardLayout/Sidebars/AdminSidebarItem.js`

**Features**:
- Admin/Manager specific menu items
- Permission-based menu rendering using PERMISSIONS constants
- Comprehensive HR, Payroll, and Loan management sections
- Settings and profile management
- Dynamic menu visibility based on user permissions

**Menu Sections**:
- Overview
- Manage Users (Staff, Roles)
- HR Setup (Awards, Resignation, Termination, Holidays, Promotion, Leave)
- Payroll (Set Salary, Payslip)
- Borrower Hub (Borrowers, Guarantors, Groups)
- Manage Loans (Loan Products, Loans, Repayments)
- Accounting (Chart of Accounts)
- Settings (Categories, Account Profile, Edit Profile, Logout)

### EmpSidebar
**Location**: `src/components/DashboardLayout/Sidebars/EmpSidebar.js`

**Features**:
- Employee/Staff specific menu items
- Simplified navigation for staff users
- Personal HR and payroll access
- Permission-based menu rendering using PERMISSIONS constants
- Dynamic menu visibility based on user permissions

**Menu Sections**:
- Overview
- Employee (Personal view)
- HR Setup (Awards, Resignation, Termination, Holidays, Promotion, Timesheet, Leave, Announcement)
- Payroll (Set Salary, Payslip)
- Settings (Edit Profile, Logout)

## 📄 Page Structure

### Home Page
**Location**: `pages/dashboard/home/index.jsx`

**Structure**:
```jsx
// 1. Imports (organized by category)
// 2. Component definitions
// 3. Main page component
// 4. Server-side props
```

**Key Components**:
- `HomePageWithSidebar` - Layout with sidebar
- `HomePageContent` - Content logic
- `HomePage` - Main page component

### All Employees Page
**Location**: `pages/dashboard/man_staff/all_employees/index.js`

**Structure**:
```jsx
// 1. Imports (organized by category)
// 2. Main page component
// 3. Server-side props
```

## 🎨 Component Organization

### Import Organization
All files follow this import structure:
```jsx
// Core React
import React from 'react';

// Components
import ComponentName from './ComponentName';

// Hooks and Services
import useHook from '@/hooks/useHook';

// Configuration
import { CONFIG } from '@/config/config';
```

### Component Structure
Each component follows this structure:
```jsx
/**
 * =============================================================================
 * COMPONENT NAME
 * =============================================================================
 */

/**
 * Component description
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 */
const ComponentName = ({ props }) => {
  // =============================================================================
  // SECTION NAME
  // =============================================================================
  
  // Code here
  
  // =============================================================================
  // RENDER
  // =============================================================================
  
  return (
    // JSX here
  );
};
```

## 🔄 Data Flow

### Role Information Flow
```
SecurityGuard (fetches role data)
    ↓ (passes role info)
HomePageWithSidebar (receives role info)
    ↓ (passes role info to both)
    ├── Sidebar (gets role info)
    └── HomePageContent (gets role info)
        ├── Home (gets role info)
        └── EmpView (gets role info)
```

### Available Role Information
All components have access to:
- **`role_name`**: User's role name
- **`role_status`**: Role status (active/inactive)
- **`role_is_super`**: Super admin flag
- **`permissions`**: Array of user permissions

## 🛠️ Usage Examples

### Basic Security Guard
```jsx
<SecurityGuard
  requiredPermissions={[PERMISSIONS.USER_CREATE]}
  user={props?.user}
  jwt={props?.jwt}
>
  <YourComponent />
</SecurityGuard>
```

### Custom Permission Checker
```jsx
<SecurityGuard
  customChecker={(permissions, roleData) => {
    const hasUserCreatePermission = permissions.includes(PERMISSIONS.USER_CREATE);
    const isStaff = roleData?.role_name === 'Staff';
    return hasUserCreatePermission || isStaff;
  }}
  user={props?.user}
  jwt={props?.jwt}
>
  <YourComponent />
</SecurityGuard>
```

### Permission Gate
```jsx
<PermissionGate 
  permission={PERMISSIONS.USER_CREATE}
  permissions={permissions}
>
  <Button>Create User</Button>
</PermissionGate>
```

## 📋 Best Practices

### 1. Import Organization
- Group imports by category
- Use clear comments to separate sections
- Order: Core React → Components → Hooks → Configuration

### 2. Component Structure
- Use clear section headers with `=============================================================================`
- Document component purpose and features
- Separate logic into clear sections

### 3. Security Implementation
- Always use SecurityGuard for permission checks
- Pass role information through props
- Use PermissionGate for conditional rendering

### 4. Data Fetching
- Use custom hooks for data fetching
- Handle loading states properly
- Implement error handling

## 🚀 Benefits of This Structure

### 1. **Maintainability**
- Clear separation of concerns
- Well-documented code
- Consistent structure across files

### 2. **Scalability**
- Easy to add new components
- Reusable security system
- Flexible permission system

### 3. **Developer Experience**
- Clear code organization
- Easy to understand and modify
- Consistent patterns

### 4. **Security**
- Centralized permission management
- Automatic role information injection
- Flexible permission checking

## 🔧 Configuration

### Permission Constants
**Location**: `src/utils/permissionUtils.js`

```javascript
export const PERMISSIONS = {
  USER_CREATE: 'User.create',
  USER_READ: 'User.read',
  USER_UPDATE: 'User.update',
  USER_DELETE: 'User.delete',
  // ... more permissions
};
```

### API Paths
**Location**: `src/config/api-paths.js`

```javascript
export const URL_SHOW_ROLE_WITH_PERMISSIONS_BY_ROLE_ID = '/api/roles/with-permissions';
```

## 📝 Notes

- All components are fully typed with JSDoc comments
- Security system is centralized and reusable
- Role information is automatically passed to children
- Loading states are handled consistently
- Error handling is implemented throughout
