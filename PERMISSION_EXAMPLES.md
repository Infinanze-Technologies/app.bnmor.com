# Permission System Examples

## 🎯 **New Flexible Permission Functions**

The permission system now supports checking multiple permissions in a single call, just like you requested!

## 📋 **Available Functions**

### 1. `hasAnyOfPermissions(permissions, ...permissionArgs)`
Checks if user has **ANY** of the specified permissions.

### 2. `hasAllOfPermissions(permissions, ...permissionArgs)`
Checks if user has **ALL** of the specified permissions.

## 🔧 **Usage Examples**

### **Single Permission (Same as Before)**
```javascript
// Old way
const hasUserCreate = permissions?.includes(PERMISSIONS.USER_CREATE);

// New way (same result)
const hasUserCreate = hasAnyOfPermissions(permissions, PERMISSIONS.USER_CREATE);
```

### **Multiple Permissions - ANY (What You Wanted!)**
```javascript
// Old way (verbose)
const hasPayrollAccess = permissions?.includes(PERMISSIONS.PAYROLL_CREATE) || 
                        permissions?.includes(PERMISSIONS.PAYROLL_READ);

// New way (clean!)
const hasPayrollAccess = hasAnyOfPermissions(permissions, 
  PERMISSIONS.PAYROLL_CREATE, 
  PERMISSIONS.PAYROLL_READ
);
```

### **Multiple Permissions - ALL**
```javascript
// Old way (verbose)
const hasFullPayrollAccess = permissions?.includes(PERMISSIONS.PAYROLL_CREATE) && 
                             permissions?.includes(PERMISSIONS.PAYROLL_READ);

// New way (clean!)
const hasFullPayrollAccess = hasAllOfPermissions(permissions, 
  PERMISSIONS.PAYROLL_CREATE, 
  PERMISSIONS.PAYROLL_READ
);
```

## 🎨 **Real-World Examples**

### **HR Access Check**
```javascript
// Check if user has ANY HR-related permissions
const hasHRAccess = hasAnyOfPermissions(permissions, 
  PERMISSIONS.AWARD_READ, 
  PERMISSIONS.RESIGNATION_READ, 
  PERMISSIONS.PROMOTION_READ, 
  PERMISSIONS.TERMINATION_READ, 
  PERMISSIONS.ANNOUNCEMENT_READ, 
  PERMISSIONS.HOLIDAY_READ
);
```

### **Admin Access Check**
```javascript
// Check if user has ALL admin permissions
const hasAdminAccess = hasAllOfPermissions(permissions, 
  PERMISSIONS.USER_CREATE, 
  PERMISSIONS.USER_UPDATE, 
  PERMISSIONS.USER_DELETE
);
```

### **Settings Access Check**
```javascript
// Check if user has ALL settings permissions
const hasSettingsAccess = hasAllOfPermissions(permissions, 
  PERMISSIONS.SETTINGS_CREATE, 
  PERMISSIONS.SETTINGS_READ
);
```

## 🚀 **Benefits**

### **1. Cleaner Code**
```javascript
// Before
const hasAccess = permissions?.includes(PERMISSIONS.PAYROLL_CREATE) && 
                  permissions?.includes(PERMISSIONS.PAYROLL_READ);

// After
const hasAccess = hasAllOfPermissions(permissions, 
  PERMISSIONS.PAYROLL_CREATE, 
  PERMISSIONS.PAYROLL_READ
);
```

### **2. More Readable**
```javascript
// Before
const hasHRAccess = permissions?.includes(PERMISSIONS.AWARD_READ) || 
                    permissions?.includes(PERMISSIONS.RESIGNATION_READ) || 
                    permissions?.includes(PERMISSIONS.PROMOTION_READ);

// After
const hasHRAccess = hasAnyOfPermissions(permissions, 
  PERMISSIONS.AWARD_READ, 
  PERMISSIONS.RESIGNATION_READ, 
  PERMISSIONS.PROMOTION_READ
);
```

### **3. Flexible Logic**
```javascript
// Check for ANY of these permissions
const canViewReports = hasAnyOfPermissions(permissions, 
  PERMISSIONS.REPORT_READ, 
  PERMISSIONS.REPORT_CREATE
);

// Check for ALL of these permissions
const canManageUsers = hasAllOfPermissions(permissions, 
  PERMISSIONS.USER_CREATE, 
  PERMISSIONS.USER_UPDATE, 
  PERMISSIONS.USER_DELETE
);
```

## 📝 **Implementation in Components**

### **AdminSidebarItem.js**
```javascript
// Single permission checks
const hasUserCreatePermission = hasAnyOfPermissions(permissions, PERMISSIONS.USER_CREATE);

// Multiple permission checks - user needs ALL of these
const hasPayrollPermission = hasAllOfPermissions(permissions, 
  PERMISSIONS.PAYROLL_CREATE, 
  PERMISSIONS.PAYROLL_READ
);

// Alternative: Check if user has ANY of multiple permissions
const hasPayrollPermission = hasAnyOfPermissions(permissions, 
  PERMISSIONS.PAYROLL_CREATE, 
  PERMISSIONS.PAYROLL_READ
);
```

### **EmpSidebar.js**
```javascript
// Check if user has ANY HR-related permissions
const hasHRAccess = hasAnyOfPermissions(permissions, 
  PERMISSIONS.AWARD_READ, 
  PERMISSIONS.RESIGNATION_READ, 
  PERMISSIONS.PROMOTION_READ, 
  PERMISSIONS.TERMINATION_READ, 
  PERMISSIONS.ANNOUNCEMENT_READ, 
  PERMISSIONS.HOLIDAY_READ
);

// Check if user has ALL payroll permissions
const hasFullPayrollAccess = hasAllOfPermissions(permissions, 
  PERMISSIONS.PAYROLL_READ, 
  PERMISSIONS.PAYROLL_CREATE
);
```

## 🎯 **Summary**

Now you can use the exact syntax you wanted:

```javascript
// Instead of this:
const hasPayrollPermission = permissions?.includes(PERMISSIONS.PAYROLL_CREATE) && 
                            permissions?.includes(PERMISSIONS.PAYROLL_READ);

// You can do this:
const hasPayrollPermission = hasAllOfPermissions(permissions, 
  PERMISSIONS.PAYROLL_CREATE, 
  PERMISSIONS.PAYROLL_READ
);
```

The system is now much more flexible and readable! 🎉
