export const URL_LOGIN = 'auth/signin'
export const URL_GET_USER_BY_ID = 'auth/user_profile'
export const URL_CREATE_ADMIN = 'create_admin'
export const URL_GET_ADMIN = 'admin'

export const URL_UPDATE_ADMIN = 'admin' 
export const URL_DELETE_ADMIN = 'admin'
export const URL_ADMIN_STATUS = 'admin_status'
export const URL_SHOW_USERS_PERMISSIONS = 'show_user_role'
export const URL_FORGOT_PASSWORD = 'forgot-password'
export const URL_RESET_PASSWORD = 'reset-password'
export const URL_GET_BUSINESS_SETTINGS = 'auth/business_profile'
export const URL_UPDATE_BUSINESS_SETTINGS = 'auth/business_profile'

export const URL_UPDATE_BANK_SETTINGS = 'update_bank'
export const URL_UPDATE_VAT = 'update_vat'

//
// User Profile
export const URL_UPDATE_PROFILE_BY_ID = 'auth/user_profile'
export const URL_CHANGE_USER_PASSWORD = 'auth/change_password'










// User Roles EndPoint 

export const URL_GET_ALL_ROLES= 'permissions/roles'
export const URL_GET_ROLES_WITH_PERMISSIONS = 'permissions/roles_permission'
export const URL_CREATE_ROLE = 'permissions/role'
export const URL_UPDATE_ROLE = 'permissions/role'
export const URL_UPDATE_ROLE_STATUS = 'permissions/status_role'
export const URL_DELETE_ROLE = 'permissions/role'
export const URL_GET_ALL_EMP_ROLES= 'permissions/emp_roles'
export const URL_SHOW_ROLE_WITH_PERMISSIONS_BY_ROLE_ID = 'permissions/show_role'
 

// User Permission EndPoint
export const URL_GET_APP_MODULES = 'permissions/app_modules'
export const URL_GET_ALL_PERMISSION = 'permissions/all_permission'
export const URL_CREATE_PERMISSIONS = 'permissions/assign-permission'
export const URL_UPDATE_PERMISSIONS = 'permissions/assign-permission'
export const URL_GET_ALL_PERMISSION_FOR_EDIT ='permissions/edit_permission_data'
export const URL_GET_ROLE_PERMISSION = 'permissions/role_permission'
export const URL_GET_ACTIVE_ROLES = 'permissions/activeRoles'







// Hr Settings


// Employee 
export const URL_GET_EMPLOYEES= 'employee'
export const URL_ADD_EMPLOYEE = 'employee'
export const URL_SHOW_EMPLOYEE = 'employee'
export const URL_UPDATE_EMPLOYEE = 'employee'
export const URL_UPDATE_EMPLOYEE_STATUS = 'employee/account-status'
export const URL_DELETE_EMPLOYEE= 'employee'
export const URL_EMPLOYEE_STATUS = 'employee/status'
export const URL_GET_EMPLOYEE_DOCUMENT = 'employee/document'
export const URL_UPDATE_EMPLOYEE_DOCUMENT = 'employee/document'
export const URL_QRY_EMPLOYEES= 'employee/qry_employee'





// Branches
export const URL_GET_BRANCH= 'branches'
export const URL_ADD_BRANCH = 'branches'
export const URL_SHOW_BRANCH = 'branches'
export const URL_UPDATE_BRANCH = 'branches'
export const URL_DELETE_BRANCH= 'branches'
export const URL_BRANCH_STATUS = 'branches/status'
export const URL_GET_Qry_BRANCH = 'branches/qry_branch'

// Department

export const URL_GET_DEPARTMENT= 'department'
export const URL_ADD_DEPARTMENT = 'department'
export const URL_SHOW_DEPARTMENT = 'department'
export const URL_UPDATE_DEPARTMENT = 'department'
export const URL_DELETE_DEPARTMENT= 'department'
export const URL_DEPARTMENT_STATUS = 'department/status'
export const URL_GET_Qry_DEPARTMENT = 'department/qry_department'
export const URL_GET_Qry_EMPLOYEES = 'department/qry_emp_by_department'
export const URL_GET_DEPARTMENT_BY_BRANCH = 'department/qry_department_by_branch'




// Designation

export const URL_GET_DESIGNATION = 'designation'
export const URL_ADD_DESIGNATION = 'designation'
export const URL_SHOW_DESIGNATION = 'designation'
export const URL_UPDATE_DESIGNATION = 'designation'
export const URL_DELETE_DESIGNATION = 'designation'
export const URL_DESIGNATION_STATUS = 'designation/status'
export const URL_GET_DESIGNATION_BY_DEPARTMENT = 'designation/department'
export const URL_QRY_DESIGNATION_BY_DEPARTMENT = 'designation/qry_designation'
export const URL_ACTIVE_DESIGNATION = 'designation/active'





// Attributes

export const URL_GET_ATTRIBUTES = 'attributes'
export const URL_ADD_ATTRIBUTE = 'attributes'
export const URL_SHOW_ATTRIBUTE = 'attributes'
export const URL_UPDATE_ATTRIBUTE = 'attributes'
export const URL_DELETE_ATTRIBUTE = 'attributes'
export const URL_ATTRIBUTE_STATUS = 'attributes/status'
export const URL_GET_QRY_ATTRIBUTE = 'attributes/query_attributes'


// Currency
export const URL_GET_CURRENCY = 'currency/system_currencies'
export const URL_GET_CURRENCY_BY_ID = 'currency/system_currency'


// Timesheet
export const URL_GET_TIMESHEET= 'timesheet'
export const URL_ADD_TIMESHEET = 'timesheet'
export const URL_SHOW_TIMESHEET = 'timesheet'
export const URL_UPDATE_TIMESHEET = 'timesheet'
export const URL_DELETE_TIMESHEET= 'timesheet'
export const URL_TIMESHEET_STATUS = 'timesheet/status'



// Leave
export const URL_GET_LEAVE= 'leave'
export const URL_ADD_LEAVE = 'leave'
export const URL_SHOW_LEAVE = 'leave'
export const URL_UPDATE_LEAVE = 'leave'
export const URL_DELETE_LEAVE= 'leave'
export const URL_LEAVE_STATUS = 'leave/status'


// Award
export const URL_GET_AWARD= 'award'
export const URL_ADD_AWARD = 'award'
export const URL_SHOW_AWARD = 'award'
export const URL_UPDATE_AWARD = 'award'
export const URL_DELETE_AWARD= 'award'
export const URL_AWARD_STATUS = 'award/status'

// Termination
export const URL_GET_TERMINATION= 'termination'
export const URL_ADD_TERMINATION = 'termination'
export const URL_SHOW_TERMINATION = 'termination'
export const URL_UPDATE_TERMINATION = 'termination'
export const URL_DELETE_TERMINATION= 'termination'
export const URL_TERMINATION_STATUS = 'termination/status'


// Resignation
export const URL_GET_RESIGNATION= 'resignation'
export const URL_ADD_RESIGNATION = 'resignation'
export const URL_SHOW_RESIGNATION = 'resignation'
export const URL_UPDATE_RESIGNATION = 'resignation'
export const URL_DELETE_RESIGNATION= 'resignation'
export const URL_RESIGNATION_STATUS = 'resignation/status'



// Holiday
export const URL_GET_HOLIDAY= 'holiday'
export const URL_ADD_HOLIDAY = 'holiday'
export const URL_SHOW_HOLIDAY = 'holiday'
export const URL_UPDATE_HOLIDAY = 'holiday'
export const URL_DELETE_HOLIDAY= 'holiday'
export const URL_HOLIDAY_STATUS = 'holiday/status'


// Promotion
export const URL_GET_PROMOTION= 'promotion'
export const URL_ADD_PROMOTION = 'promotion'
export const URL_SHOW_PROMOTION = 'promotion'
export const URL_UPDATE_PROMOTION = 'promotion'
export const URL_DELETE_PROMOTION= 'promotion'
export const URL_PROMOTION_STATUS = 'promotion/status'
export const URL_GET_DESIGNATIONS_BY_EMPLOYEE_ID = 'promotion/get-designations-by-employee_id'


// Announcement


export const URL_GET_Announcement= 'announcement'
export const URL_ADD_Announcement = 'announcement'
export const URL_SHOW_Announcement = 'announcement'
export const URL_UPDATE_Announcement = 'announcement'
export const URL_DELETE_Announcement= 'announcement'
export const URL_Announcemen_STATUS = 'announcement/status'


// Finance EndPoint



// ACCOUNT LIST
export const URL_GET_ACCOUNTLIST = 'account'
export const URL_ADD_ACCOUNTLIST = 'account'
export const URL_SHOW_ACCOUNTLIST = 'account'
export const URL_UPDATE_ACCOUNTLIST = 'account'
export const URL_DELETE_ACCOUNTLIST= 'account'
export const URL_ACCOUNT_BALANCE = 'account/balance'
export const URL_BRANCH_ACCOUNT_LIST = 'account/branch_account'




// payee

export const URL_GET_PAYEE = 'payee'
export const URL_ADD_PAYEE = 'payee'
export const URL_SHOW_PAYEE = 'payee'
export const URL_UPDATE_PAYEE = 'payee'
export const URL_DELETE_PAYEE= 'payee'
export const URL_BRANCH_PAYEE= 'payee/branch_payees'


// payer
export const URL_GET_PAYER = 'payer'
export const URL_ADD_PAYER = 'payer'
export const URL_SHOW_PAYER = 'payer'
export const URL_UPDATE_PAYER = 'payer'
export const URL_DELETE_PAYER= 'payer'
export const URL_BRANCH_PAYER= 'payer/branch_payers'


// deposit

export const URL_GET_DEPOSIT = 'deposit'
export const URL_ADD_DEPOSIT = 'deposit'
export const URL_SHOW_DEPOSIT = 'deposit'
export const URL_UPDATE_DEPOSIT = 'deposit'
export const URL_DELETE_DEPOSIT= 'deposit'


// expense
export const URL_GET_EXPENSES = 'expense'
export const URL_ADD_EXPENSES = 'expense'
export const URL_SHOW_EXPENSES = 'expense'
export const URL_UPDATE_EXPENSES = 'expense'
export const URL_DELETE_EXPENSES= 'expense'

// transfer

export const URL_GET_BANK_TRANSFER = 'transfer'
export const URL_ADD_BANK_TRANSFER = 'transfer'
export const URL_SHOW_BANK_TRANSFER = 'transfer'
export const URL_UPDATE_BANK_TRANSFER = 'transfer'
export const URL_DELETE_BANK_TRANSFER= 'transfer'


// Payrolll

// salary
export const URL_GET_SALARY = 'salary'
export const URL_ADD_SALARY = 'salary'
export const URL_SHOW_SALARY = 'salary'
export const URL_UPDATE_SALARY = 'salary'
export const URL_DELETE_SALARY= 'salary'


// allowance
export const URL_GET_ALLOWANCE = 'allowance'
export const URL_ADD_ALLOWANCE = 'allowance'
export const URL_SHOW_ALLOWANCE = 'allowance'
export const URL_UPDATE_ALLOWANCE = 'allowance'
export const URL_DELETE_ALLOWANCE = 'allowance'


// commission

export const URL_GET_COMMISSION= 'commission'
export const URL_ADD_COMMISSION= 'commission'
export const URL_SHOW_COMMISSION= 'commission'
export const URL_UPDATE_COMMISSION= 'commission'
export const URL_DELETE_COMMISSION= 'commission'

// overtime

export const URL_GET_OVERTIME= 'overtime'
export const URL_ADD_OVERTIME= 'overtime'
export const URL_SHOW_OVERTIME= 'overtime'
export const URL_UPDATE_OVERTIME= 'overtime'
export const URL_DELETE_OVERTIME= 'overtime'


// others

export const URL_GET_OTHERPAYMENT= 'others'
export const URL_ADD_OTHERPAYMENT= 'others'
export const URL_SHOW_OTHERPAYMENT= 'others'
export const URL_UPDATE_OTHERPAYMENT= 'others'
export const URL_DELETE_OTHERPAYMENT= 'others'

// deduction

export const URL_GET_DEDUCTION= 'deduction'
export const URL_ADD_DEDUCTION= 'deduction'
export const URL_SHOW_DEDUCTION= 'deduction'
export const URL_UPDATE_DEDUCTION= 'deduction'
export const URL_DELETE_DEDUCTION= 'deduction'


// PaySlip

export const URL_GET_PAYSLIP= 'payslip'
export const URL_GENERATE_PAYSLIP= 'payslip/generate'
export const URL_CREATE_BULK_PAYMENT= 'payslip/bulk_payment'
export const URL_GET_BULK_PAYMENT= 'payslip/get_bulk_payment'
export const URL_UPDATE_PAYMENT= 'payslip/update_payment'
export const URL_DELETE_PAYSLIP= 'payslip'


// Dashboard Endpoint  

export const URL_GET_ANNUAL_INCOME= 'dashboard/annual_revenue'
export const URL_GET_INITIAL_INCOME='dashboard/balance'
export const URL_GET_DASH_STATS= 'dashboard/dash_stats'
export const URL_GET_ANNOUNCEMENT= 'dashboard/announcement'

 export const URL_GET_VISITOR_DASHBOARD_STATS = 'visitors/dashboard/stats'
 export const URL_GET_VISITOR_DASHBOARD_COMPREHENSIVE_ANALYTICS = 'dashboard/comprehensive-analytics'
 export const URL_GET_HR_DASHBOARD_COMPREHENSIVE_ANALYTICS = 'dashboard/hr/analytics'
 export const URL_GET_FINANCE_DASHBOARD_COMPREHENSIVE_ANALYTICS = 'dashboard/finance/analytics'


// export const URL_GET_DASH_CUSTOMERS= 'dash_customers'
// export const URL_GET_DASH_COMPLAINTS= 'dash_complaints'
// export const URL_GET_DASH_ROLES= 'dash_userRoles'
// export const URL_GET_ALL_CAT_WITH_PRODUCT= 'dash_catWithProduct'
// export const URL_GET_ALL_CAT_WITH_PRODUCT_DATA = 'all_catWithProduct'


// Staffs Endpoint  
export const URL_GET_EMP_TIMESHEET= 'emp_timesheet'
export const URL_ADD_EMP_TIMESHEET = 'emp_timesheet'
export const URL_SHOW_EMP_TIMESHEET = 'emp_timesheet'
export const URL_UPDATE_EMP_TIMESHEET = 'emp_timesheet'
export const URL_DELETE_EMP_TIMESHEET= 'emp_timesheet'
export const URL_EMP_TIMESHEET_STATUS = 'emp_timesheet/status'

export const URL_GET_EMP_LEAVE= 'emp_leave'
export const URL_ADD_EMP_LEAVE = 'emp_leave'
export const URL_SHOW_EMP_LEAVE = 'emp_leave'
export const URL_UPDATE_EMP_LEAVE = 'emp_leave'
export const URL_DELETE_EMP_LEAVE= 'emp_leave'
export const URL_EMP_LEAVE_STATUS = 'emp_leave/status'

export const URL_GET_EMP_AWARD= 'emp_award'
export const URL_ADD_EMP_AWARD = 'emp_award'
export const URL_SHOW_EMP_AWARD = 'emp_award'
export const URL_UPDATE_EMP_AWARD = 'emp_award'
export const URL_DELETE_EMP_AWARD= 'emp_award'
export const URL_EMP_AWARD_STATUS = 'emp_award/status'

export const URL_GET_EMP_TERMINATION= 'emp_termination'
export const URL_ADD_EMP_TERMINATION = 'emp_termination'
export const URL_SHOW_EMP_TERMINATION = 'emp_termination'
export const URL_UPDATE_EMP_TERMINATION = 'emp_termination'
export const URL_DELETE_EMP_TERMINATION= 'emp_termination'
export const URL_EMP_TERMINATION_STATUS = 'emp_termination/status'

export const URL_GET_EMP_RESIGNATION= 'emp_resignation'
export const URL_ADD_EMP_RESIGNATION = 'emp_resignation'
export const URL_SHOW_EMP_RESIGNATION = 'emp_resignation'
export const URL_UPDATE_EMP_RESIGNATION = 'emp_resignation'
export const URL_DELETE_EMP_RESIGNATION= 'emp_resignation'
export const URL_EMP_RESIGNATION_STATUS = 'emp_resignation/status'

export const URL_GET_EMP_HOLIDAY= 'emp_holiday'
export const URL_ADD_EMP_HOLIDAY = 'emp_holiday'
export const URL_SHOW_EMP_HOLIDAY = 'emp_holiday'
export const URL_UPDATE_EMP_HOLIDAY = 'emp_holiday'
export const URL_DELETE_EMP_HOLIDAY= 'emp_holiday'
export const URL_EMP_HOLIDAY_STATUS = 'emp_holiday/status'

export const URL_GET_EMP_PROMOTION= 'emp_promotion'
export const URL_ADD_EMP_PROMOTION = 'emp_promotion'
export const URL_SHOW_EMP_PROMOTION = 'emp_promotion'
export const URL_UPDATE_EMP_PROMOTION = 'emp_promotion'
export const URL_DELETE_EMP_PROMOTION= 'emp_promotion'
export const URL_EMP_PROMOTION_STATUS = 'emp_promotion/status'

export const URL_GET_EMP_Announcement= 'emp_announcement'
export const URL_ADD_EMP_Announcement = 'emp_announcement'
export const URL_SHOW_EMP_Announcement = 'emp_announcement'
export const URL_UPDATE_EMP_Announcement = 'emp_announcement'
export const URL_DELETE_EMP_Announcement= 'emp_announcement'
export const URL_EMP_Announcemen_STATUS = 'emp_announcement/status'

export const URL_GET_EMP_SALARY = 'emp_payslip/salary'
export const URL_GET_EMP_ALLOWANCE = 'emp_payslip/allowance'
export const URL_GET_EMP_COMMISSION= 'emp_payslip/commission'
export const URL_GET_EMP_OVERTIME= 'emp_payslip/overtime'
export const URL_GET_EMP_OTHERPAYMENT= 'emp_payslip/otherPayment'
export const URL_GET_EMP_DEDUCTION= 'emp_payslip/deduction'
export const URL_GET_EMP_PAYSLIP= 'emp_payslip/payslip'


// Borrower
export const URL_GET_BORROWER = 'borrowers'
export const URL_ADD_BORROWER = 'borrowers'
export const URL_SHOW_BORROWER = 'borrowers'
export const URL_UPDATE_BORROWER = 'borrowers'
export const URL_DELETE_BORROWER= 'borrowers'
export const URL_BORROWER_STATUS = 'borrowers/update_borrower_status'
export const URL_UPDATE_BORROWER_IMAGE = 'borrowers/image'
export const URL_GET_MEMBER_TYPES_BORROWER = 'borrowers/member-types'


// Guarantor
export const URL_GET_GUARANTOR = 'guarantors'
export const URL_ADD_GUARANTOR = 'guarantors'
export const URL_SHOW_GUARANTOR = 'guarantors'
export const URL_UPDATE_GUARANTOR = 'guarantors'
export const URL_DELETE_GUARANTOR= 'guarantors'
export const URL_GUARANTOR_STATUS = 'guarantors/status'
export const URL_UPDATE_GUARANTOR_IMAGE = 'guarantors/image'

// Group
export const URL_GET_GROUP = 'groups'
export const URL_ADD_GROUP = 'groups'
export const URL_SHOW_GROUP = 'groups'
export const URL_UPDATE_GROUP = 'groups'
export const URL_DELETE_GROUP= 'groups'
export const URL_GROUP_STATUS = 'groups/status'
export const URL_ADD_BORROWER_TO_GROUP = 'groups/members'




//COA
export const URL_GET_COA_HIERARCHY = 'coa/coa-hierarchy'
export const URL_GET_FUNDING_HIERARCHY = 'coa/funding-hierarchy'

export const URL_ADD_COA = 'coa'
export const URL_UPDATE_COA = 'coa'
export const URL_DELETE_COA = 'coa'
export const URL_UPDATE_PARENT_FUNDING_BALANCE = 'coa/update-parent-funding-balance'
export const URL_GET_FUNDING_BRANCHES = 'coa/coa-funding-branches'
// export const URL_GET_FUNDING_BRANCH_ID = 'coa/coa-fund-branch'

// Loan Product APIs
export const URL_GET_LOAN_PRODUCT = 'loan-products'
export const URL_ADD_LOAN_PRODUCT = 'loan-products'
export const URL_SHOW_LOAN_PRODUCT = 'loan-products'
export const URL_UPDATE_LOAN_PRODUCT = 'loan-products'
export const URL_DELETE_LOAN_PRODUCT= 'loan-products'
export const URL_LOAN_PRODUCT_STATUS = 'loan-products/status'

export const URL_UPDATE_LOAN_PRODUCT_BASIC_DETAILS = 'loan-products/basic-details'
export const URL_UPDATE_LOAN_PRODUCT_ACCOUNT_DETAILS = 'loan-products/accounts'
export const URL_UPDATE_LOAN_PRODUCT_FEES_DETAILS = 'loan-products/fees'
export const URL_UPDATE_LOAN_PRODUCT_PENALTY_DETAILS = 'loan-products/penalty'
export const URL_GET_CASH_FUNDING_ACCOUNTS = 'coa/qry-funding-accounts'
export const URL_GET_COA_FOR_LOANS = 'coa/coa-for-loans'


// Loan APIs

export const URL_GET_LOAN = 'loans'
export const URL_ADD_LOAN = 'loans'
export const URL_SHOW_LOAN = 'loans'
export const URL_UPDATE_LOAN = 'loans'
export const URL_DELETE_LOAN= 'loans'
export const URL_LOAN_STATUS = 'loans/status'
export const URL_GET_ACTIVE_BORROWERS = 'loans/active-borrowers'
export const URL_GET_ACTIVE_GUARANTORS = 'loans/active-guarantors'
export const URL_GET_ACTIVE_LOAN_PRODUCTS = 'loans/active-loan-products'

export const URL_UPDATE_LOAN_BASIC_DETAILS = 'loans/basic-details'
export const URL_UPDATE_LOAN_ACCOUNT = 'loans/accounts'
export const URL_UPDATE_LOAN_FEES_DETAILS = 'loans/fees'
export const URL_UPDATE_LOAN_PENALTY_DETAILS = 'loans/penalty'
export const URL_UPDATE_LOAN_ACCOUNT_STATUS = 'loans/status' 

export const URL_GENERATE_REPAYMENT_SCHEDULE = 'loans/generate-repayment-schedule'

export const URL_ADD_LOAN_REPAYMENT = 'loans/repayment'
export const URL_GET_LOAN_REPAYMENTS_BY_LOAN_ID = 'loans/repayments'
export const URL_DELETE_LOAN_REPAYMENT = 'loans/repayment'
export const URL_GET_LOAN_SCHEDULE = 'loans/schedule'
export const URL_GET_LOAN_JOURNAL_ENTRIES = 'loans/journal-entries'
export const URL_GET_LOAN_REPAYMENTS = 'loans/repayments'



export const URL_GET_BUSINESS_LOAN_SUMMARY = 'dashboard/business_loan_summary'
export const URL_GET_LOAN_AUDIT_TRAIL = 'loans/audit-trail'



// Visitor Management
export const URL_GET_VISITOR_ENTRIES = 'visitors/entries'
export const URL_ADD_VISITOR_ENTRIES = 'visitors/entries'
export const URL_SHOW_VISITOR_ENTRIES = 'visitors/entries'
export const URL_UPDATE_VISITOR_ENTRIES = 'visitors/entries'
export const URL_DELETE_VISITOR_ENTRIES= 'visitors/entries'
export const URL_VISITOR_ENTRIES_STATUS = 'visitors/entries/status'
export const URL_UPDATE_VISITOR_ENTRIES_CHECK_IN = 'visitors/entries/check-in'
export const URL_UPDATE_VISITOR_ENTRIES_CHECK_OUT = 'visitors/entries/check-out'

export const URL_GET_VISITOR_GUESTS = 'visitors/guests'
export const URL_ADD_VISITOR_GUESTS = 'visitors/guests'
export const URL_SHOW_VISITOR_GUESTS = 'visitors/guests'
export const URL_UPDATE_VISITOR_GUESTS = 'visitors/guests'
export const URL_DELETE_VISITOR_GUESTS= 'visitors/guests'
export const URL_VISITOR_GUESTS_STATUS = 'visitors/guests/status'
export const URL_GET_VISITOR_GUESTS_HISTORY_BY_GUEST_ID = 'visitors/guests/history'






export const URL_GET_VISITOR_APPOINTMENTS = 'visitors/appointments'
export const URL_ADD_VISITOR_APPOINTMENTS = 'visitors/appointments'
export const URL_SHOW_VISITOR_APPOINTMENTS = 'visitors/appointments'
export const URL_UPDATE_VISITOR_APPOINTMENTS = 'visitors/appointments'
export const URL_DELETE_VISITOR_APPOINTMENTS= 'visitors/appointments'
export const URL_VISITOR_APPOINTMENTS_STATUS = 'visitors/appointments/status'


export const URL_GET_VISITOR_ORGANIZATIONS = 'visitors/organizations'
export const URL_ADD_VISITOR_ORGANIZATIONS = 'visitors/organizations'
export const URL_UPDATE_VISITOR_ORGANIZATIONS = 'visitors/organizations'
export const URL_DELETE_VISITOR_ORGANIZATIONS= 'visitors/organizations'
export const URL_GET_ACTIVE_ORGANIZATIONS = 'visitors/organizations/active'



// Other Visitor Management Endpoints
export const URL_GET_VISITOR_HOSTS_BY_DEPARTMENT = 'visitors/employees/department'
export const URL_SHOW_VISITOR_HOSTS = 'visitors/guests/active'
export const URL_SHOW_VISITOR_ALL_HOSTS = 'visitors/hosts'



// Construction Endpoints
export const URL_GET_CATEGORY = 'category'
export const URL_GET_CATEGORY_ATTRIBUTES = 'category/attributes'
export const URL_GET_PROPERTIES = 'properties'
export const URL_ADD_PROPERTIES = 'properties'
export const URL_SHOW_PROPERTIES = 'properties'
export const URL_UPDATE_PROPERTIES = 'properties'
export const URL_DELETE_PROPERTIES = 'properties'
export const URL_DELETE_PROPERTY = 'properties'
export const URL_PROPERTIES_STATUS = 'properties/status'
export const URL_ADD_PROPERTY_FILES = 'properties/image'
export const URL_DELETE_PROPERTY_FILES = 'properties/image'

export const URL_GET_PROPERTY_CATEGORIES = 'properties/categories'
export const URL_GET_PROPERTY_SUBCATEGORIES = 'properties/subcategories'
export const URL_GET_PROPERTY_STATUS = 'properties/statuses'
export const URL_GET_PROPERTY_ENTITIES = 'properties/entities'
export const URL_GET_PROPERTY_REGIONS = 'properties/regions'
export const URL_GET_PROPERTY_DISTRICTS = 'properties/regions/districts'
export const URL_GET_PROPERTY_AREAS = 'properties/districts/areas'


export const URL_GET_ENTITIES = 'entities'
export const URL_ADD_ENTITIES = 'entities'
export const URL_SHOW_ENTITIES = 'entities'
export const URL_UPDATE_ENTITIES = 'entities'
export const URL_DELETE_ENTITIES = 'entities'


export const URL_ADD_LOCATIONS_AREAS = 'locations/areas'



// Ledger Endpoints

export const URL_GET_LEDGER = 'ledger/accounts'
export const URL_ADD_LEDGER = 'ledger/reports/trial-balance'
