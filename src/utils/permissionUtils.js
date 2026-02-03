/**
 * Permission Utility Functions
 * Helper functions for permission validation and management
 */

/**
 * Check if user has a specific permission
 * @param {Array} permissions - Array of user permissions
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission
 */
export const hasPermission = (permissions, permission) => {
  if (!permissions || !Array.isArray(permissions)) {
    return false;
  }
  return permissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 * @param {Array} permissions - Array of user permissions
 * @param {Array} requiredPermissions - Array of permissions to check
 * @returns {boolean} - True if user has at least one permission
 */
export const hasAnyPermission = (permissions, requiredPermissions) => {
  if (!permissions || !Array.isArray(permissions) || !Array.isArray(requiredPermissions)) {
    return false;
  }
  return requiredPermissions.some(permission => permissions.includes(permission));
};

/**
 * Check if user has all of the specified permissions
 * @param {Array} permissions - Array of user permissions
 * @param {Array} requiredPermissions - Array of permissions to check
 * @returns {boolean} - True if user has all permissions
 */
export const hasAllPermissions = (permissions, requiredPermissions) => {
  if (!permissions || !Array.isArray(permissions) || !Array.isArray(requiredPermissions)) {
    return false;
  }
  return requiredPermissions.every(permission => permissions.includes(permission));
};

/**
 * Get permissions by resource type
 * @param {Array} permissions - Array of user permissions
 * @param {string} resource - Resource type (e.g., 'User', 'Role', 'Award')
 * @returns {Array} - Array of permissions for the resource
 */
export const getPermissionsByResource = (permissions, resource) => {
  if (!permissions || !Array.isArray(permissions)) {
    return [];
  }
  return permissions.filter(permission => permission.startsWith(resource));
};

/**
 * Check if user has any permission for a specific resource
 * @param {Array} permissions - Array of user permissions
 * @param {string} resource - Resource type
 * @returns {boolean} - True if user has any permission for the resource
 */
export const hasResourcePermission = (permissions, resource) => {
  const resourcePermissions = getPermissionsByResource(permissions, resource);
  return resourcePermissions.length > 0;
};

/**
 * Check if user has specific action permission for a resource
 * @param {Array} permissions - Array of user permissions
 * @param {string} resource - Resource type
 * @param {string} action - Action type ('Create', 'Read', 'Update', 'Delete')
 * @returns {boolean} - True if user has the specific permission
 */
export const hasResourceActionPermission = (permissions, resource, action) => {
  const permission = `${resource} ${action}`;
  return hasPermission(permissions, permission);
};

/**
 * Get all available resources from permissions
 * @param {Array} permissions - Array of user permissions
 * @returns {Array} - Array of unique resource types
 */
export const getAvailableResources = (permissions) => {
  if (!permissions || !Array.isArray(permissions)) {
    return [];
  }
  const resources = permissions.map(permission => {
    const parts = permission.split(' ');
    return parts[0];
  });
  return [...new Set(resources)];
};

/**
 * Check if user has admin-level permissions (all CRUD operations for a resource)
 * @param {Array} permissions - Array of user permissions
 * @param {string} resource - Resource type
 * @returns {boolean} - True if user has all CRUD permissions for the resource
 */
export const hasAdminPermission = (permissions, resource) => {
  const requiredActions = ['Create', 'Read', 'Update', 'Delete'];
  return requiredActions.every(action => 
    hasResourceActionPermission(permissions, resource, action)
  );
};

/**
 * Enhanced includes method for checking multiple permissions (any)
 * @param {Array} permissions - Array of user permissions
 * @param {...string} permissionArgs - One or more permission strings to check
 * @returns {boolean} - True if user has any of the specified permissions
 */
export const hasAnyOfPermissions = (permissions, ...permissionArgs) => {
  if (!permissions || !Array.isArray(permissions)) {
    return false;
  }
  return permissionArgs.some(permission => permissions.includes(permission));
};

/**
 * Enhanced includes method for checking all permissions
 * @param {Array} permissions - Array of user permissions
 * @param {...string} permissionArgs - One or more permission strings to check
 * @returns {boolean} - True if user has all of the specified permissions
 */
export const hasAllOfPermissions = (permissions, ...permissionArgs) => {
  if (!permissions || !Array.isArray(permissions)) {
    return false;
  }
  return permissionArgs.every(permission => permissions.includes(permission));
};

/**
 * Permission constants for easy reference
 */
export const PERMISSIONS = {
  // User permissions
  USER_CREATE: 'User Create',
  USER_READ: 'User Read',
  USER_UPDATE: 'User Update',
  USER_DELETE: 'User Delete',
  
  // Role permissions
  ROLE_CREATE: 'Role Create',
  ROLE_READ: 'Role Read',
  ROLE_UPDATE: 'Role Update',
  ROLE_DELETE: 'Role Delete',
  
  // Award permissions
  AWARD_CREATE: 'Award Create',
  AWARD_READ: 'Award Read',
  AWARD_UPDATE: 'Award Update',
  AWARD_DELETE: 'Award Delete',
  
  // Transfer permissions
  TRANSFER_CREATE: 'Transfer Create',
  TRANSFER_READ: 'Transfer Read',
  TRANSFER_UPDATE: 'Transfer Update',
  TRANSFER_DELETE: 'Transfer Delete',
  
  // Resignation permissions
  RESIGNATION_CREATE: 'Resignation Create',
  RESIGNATION_READ: 'Resignation Read',
  RESIGNATION_UPDATE: 'Resignation Update',
  RESIGNATION_DELETE: 'Resignation Delete',
  
  // Promotion permissions
  PROMOTION_CREATE: 'Promotion Create',
  PROMOTION_READ: 'Promotion Read',
  PROMOTION_UPDATE: 'Promotion Update',
  PROMOTION_DELETE: 'Promotion Delete',
  
  // Complaint permissions
  COMPLAINT_CREATE: 'Complaint Create',
  COMPLAINT_READ: 'Complaint Read',
  COMPLAINT_UPDATE: 'Complaint Update',
  COMPLAINT_DELETE: 'Complaint Delete',
  
  // Termination permissions
  TERMINATION_CREATE: 'Termination Create',
  TERMINATION_READ: 'Termination Read',
  TERMINATION_UPDATE: 'Termination Update',
  TERMINATION_DELETE: 'Termination Delete',
  
  // Announcement permissions
  ANNOUNCEMENT_CREATE: 'Announcement Create',
  ANNOUNCEMENT_READ: 'Announcement Read',
  ANNOUNCEMENT_UPDATE: 'Announcement Update',
  ANNOUNCEMENT_DELETE: 'Announcement Delete',
  
  // Holiday permissions
  HOLIDAY_CREATE: 'Holiday Create',
  HOLIDAY_READ: 'Holiday Read',
  HOLIDAY_UPDATE: 'Holiday Update',
  HOLIDAY_DELETE: 'Holiday Delete',
  
  // Department permissions
  DEPARTMENT_CREATE: 'Department Create',
  DEPARTMENT_READ: 'Department Read',
  DEPARTMENT_UPDATE: 'Department Update',
  DEPARTMENT_DELETE: 'Department Delete',
  
  // Designation permissions
  DESIGNATION_CREATE: 'Designation Create',
  DESIGNATION_READ: 'Designation Read',
  DESIGNATION_UPDATE: 'Designation Update',
  DESIGNATION_DELETE: 'Designation Delete',
  
  // Branch permissions
  BRANCH_CREATE: 'Branch Create',
  BRANCH_READ: 'Branch Read',
  BRANCH_UPDATE: 'Branch Update',
  BRANCH_DELETE: 'Branch Delete',
  
  // Payroll permissions
  PAYROLL_CREATE: 'Payroll Create',
  PAYROLL_READ: 'Payroll Read',
  PAYROLL_UPDATE: 'Payroll Update',
  PAYROLL_DELETE: 'Payroll Delete',
  
  // Allowance permissions
  ALLOWANCE_CREATE: 'Allowance Create',
  ALLOWANCE_READ: 'Allowance Read',
  ALLOWANCE_UPDATE: 'Allowance Update',
  ALLOWANCE_DELETE: 'Allowance Delete',
  
  // Report permissions
  REPORT_CREATE: 'Report Create',
  REPORT_READ: 'Report Read',
  REPORT_UPDATE: 'Report Update',
  REPORT_DELETE: 'Report Delete',
  
  // Finance permissions
  FINANCE_CREATE: 'Finance Create',
  FINANCE_READ: 'Finance Read',
  FINANCE_UPDATE: 'Finance Update',
  FINANCE_DELETE: 'Finance Delete',
  
  // Recruitment permissions
  RECRUITMENT_CREATE: 'Recruitment Create',
  RECRUITMENT_READ: 'Recruitment Read',
  RECRUITMENT_UPDATE: 'Recruitment Update',
  RECRUITMENT_DELETE: 'Recruitment Delete',
  
  // Contract permissions
  CONTRACT_CREATE: 'Contract Create',
  CONTRACT_READ: 'Contract Read',
  CONTRACT_UPDATE: 'Contract Update',
  CONTRACT_DELETE: 'Contract Delete',
  
  // Event permissions
  EVENT_CREATE: 'Event Create',
  EVENT_READ: 'Event Read',
  EVENT_UPDATE: 'Event Update',
  EVENT_DELETE: 'Event Delete',
  
  // Meeting permissions
  MEETING_CREATE: 'Meeting Create',
  MEETING_READ: 'Meeting Read',
  MEETING_UPDATE: 'Meeting Update',
  MEETING_DELETE: 'Meeting Delete',
  
  // Asset permissions
  ASSET_CREATE: 'Asset Create',
  ASSET_READ: 'Asset Read',
  ASSET_UPDATE: 'Asset Update',
  ASSET_DELETE: 'Asset Delete',
  
  // Document permissions
  DOCUMENT_CREATE: 'Document Create',
  DOCUMENT_READ: 'Document Read',
  DOCUMENT_UPDATE: 'Document Update',
  DOCUMENT_DELETE: 'Document Delete',
  
  // Expense permissions
  EXPENSE_CREATE: 'Expense Create',
  EXPENSE_READ: 'Expense Read',
  EXPENSE_UPDATE: 'Expense Update',
  EXPENSE_DELETE: 'Expense Delete',
  
  // Loan permissions
  LOAN_CREATE: 'Loan Create',
  LOAN_READ: 'Loan Read',
  LOAN_UPDATE: 'Loan Update',
  LOAN_DELETE: 'Loan Delete',
  
  // Settings permissions
  SETTINGS_CREATE: 'Settings Create',
  SETTINGS_READ: 'Settings Read',
  SETTINGS_UPDATE: 'Settings Update',
  SETTINGS_DELETE: 'Settings Delete',
  
  // Leave permissions
  LEAVE_CREATE: 'Leave Create',
  LEAVE_READ: 'Leave Read',
  LEAVE_UPDATE: 'Leave Update',
  LEAVE_DELETE: 'Leave Delete',
  
  // Guarantor permissions
  GUARANTOR_CREATE: 'Guarantor Create',
  GUARANTOR_READ: 'Guarantor Read',
  GUARANTOR_UPDATE: 'Guarantor Update',
  GUARANTOR_DELETE: 'Guarantor Delete',
  
  // Borrower permissions
  BORROWER_CREATE: 'Borrower Create',
  BORROWER_READ: 'Borrower Read',
  BORROWER_UPDATE: 'Borrower Update',
  BORROWER_DELETE: 'Borrower Delete',
  
  // Group permissions
  GROUP_CREATE: 'Group Create',
  GROUP_READ: 'Group Read',
  GROUP_UPDATE: 'Group Update',
  GROUP_DELETE: 'Group Delete',
  
  // Audit permissions
  AUDIT_CREATE: 'Audit Create',
  AUDIT_READ: 'Audit Read',
  AUDIT_UPDATE: 'Audit Update',
  AUDIT_DELETE: 'Audit Delete',

  // Construction permissions
  CONSTRUCTION_CREATE: 'Construction Create',
  CONSTRUCTION_READ: 'Construction Read',
  CONSTRUCTION_UPDATE: 'Construction Update',
  CONSTRUCTION_DELETE: 'Construction Delete',
  
  // Business permissions
  BUSINESS_READ: 'Business Read',
  BUSINESS_UPDATE: 'Business Update',

  // Visitor permissions
  VISITOR_CREATE: 'Visitors Create',
  VISITOR_READ: 'Visitors Read',
  VISITOR_UPDATE: 'Visitors Update',
  VISITOR_DELETE: 'Visitors Delete',
  
  // Contacts permissions
  CONTACTS_CREATE: 'Contacts Create',
  CONTACTS_READ: 'Contacts Read',
  CONTACTS_UPDATE: 'Contacts Update',
  CONTACTS_DELETE: 'Contacts Delete',

  // Policy permissions
  POLICY_CREATE: 'Policy Create',
  POLICY_READ: 'Policy Read',
  POLICY_UPDATE: 'Policy Update',
  POLICY_DELETE: 'Policy Delete',

  // Project permissions
  PROJECT_CREATE: 'Projects Create',
  PROJECT_READ: 'Projects Read',
  PROJECT_UPDATE: 'Projects Update',
  PROJECT_DELETE: 'Projects Delete',

  // AWARD_CREATE: 'Award Create',
  // AWARD_READ: 'Award Read',
  // AWARD_UPDATE: 'Award Update',
  // AWARD_DELETE: 'Award Delete',

};

/**
 * Resource types for easy reference
 */
export const RESOURCES = {
  USER: 'User',
  ROLE: 'Role',
  AWARD: 'Award',
  TRANSFER: 'Transfer',
  RESIGNATION: 'Resignation',
  PROMOTION: 'Promotion',
  COMPLAINT: 'Complaint',
  TERMINATION: 'Termination',
  ANNOUNCEMENT: 'Announcement',
  HOLIDAY: 'Holiday',
  DEPARTMENT: 'Department',
  DESIGNATION: 'Designation',
  BRANCH: 'Branch',
  PAYROLL: 'Payroll',
  ALLOWANCE: 'Allowance',
  REPORT: 'Report',
  FINANCE: 'Finance',
  RECRUITMENT: 'Recruitment',
  CONTRACT: 'Contract',
  EVENT: 'Event',
  MEETING: 'Meeting',
  ASSET: 'Asset',
  DOCUMENT: 'Document',
  EXPENSE: 'Expense',
  LOAN: 'Loan',
  SETTINGS: 'Settings',
  LEAVE: 'Leave',
  GUARANTOR: 'Guarantor',
  BORROWER: 'Borrower',
  GROUP: 'Group',
  AUDIT: 'Audit',
  VISITOR: 'Visitors',
  CONTACTS: 'Contacts',
  BUSINESS: 'Business',
  CONSTRUCTION: 'Construction',
  POLICY: 'Policy',
  PROJECT: 'Projects'
};

/**
 * Action types for easy reference
 */
export const ACTIONS = {
  CREATE: 'Create',
  READ: 'Read',
  UPDATE: 'Update',
  DELETE: 'Delete'
};
