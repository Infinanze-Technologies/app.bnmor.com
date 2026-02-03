import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

/**
 * Example showing how Home and EmpView components can use role information
 * These components now receive role information automatically from SecurityGuard
 */

// Example Home component (Admin/Manager view)
const HomeComponent = ({ 
  session, 
  permissions, 
  BusinessLoanSummaryData,
  // Role information automatically passed from SecurityGuard
  role_name,
  role_status,
  role_is_super,
  rolePermissions
}) => {
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions({ data: { permissions: rolePermissions } });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Admin Dashboard - {role_name}</h3>
              {role_is_super && (
                <span className="badge badge-warning">Super Admin</span>
              )}
            </div>
            <div className="card-body">
              <p><strong>Role Status:</strong> {role_status}</p>
              <p><strong>Permissions:</strong> {rolePermissions?.length || 0}</p>
              
              {/* Role-based content */}
              <div className="row mt-3">
                <div className="col-md-3">
                  {canCreate('User') && (
                    <button className="btn btn-primary btn-block">Create User</button>
                  )}
                </div>
                <div className="col-md-3">
                  {canRead('User') && (
                    <button className="btn btn-info btn-block">View Users</button>
                  )}
                </div>
                <div className="col-md-3">
                  {canUpdate('User') && (
                    <button className="btn btn-warning btn-block">Edit Users</button>
                  )}
                </div>
                <div className="col-md-3">
                  {canDelete('User') && (
                    <button className="btn btn-danger btn-block">Delete Users</button>
                  )}
                </div>
              </div>

              {/* Super admin features */}
              {role_is_super && (
                <div className="mt-3">
                  <div className="alert alert-warning">
                    <strong>Super Admin Features:</strong>
                    <ul>
                      <li>System Settings</li>
                      <li>User Role Management</li>
                      <li>Database Administration</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Business loan summary */}
              {BusinessLoanSummaryData && (
                <div className="mt-3">
                  <h5>Business Loan Summary</h5>
                  {/* Your business loan summary component here */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example EmpView component (Staff view)
const EmpViewComponent = ({ 
  session, 
  SingleEmployeeData, 
  SingleEmployeeDocumentData,
  // Role information automatically passed from SecurityGuard
  role_name,
  role_status,
  role_is_super,
  rolePermissions
}) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Employee Dashboard - {role_name}</h3>
              <span className="badge badge-secondary">Staff Access</span>
            </div>
            <div className="card-body">
              <p><strong>Role Status:</strong> {role_status}</p>
              <p><strong>Access Level:</strong> Limited to own data</p>
              
              {/* Staff-specific content */}
              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h5>My Information</h5>
                    </div>
                    <div className="card-body">
                      {SingleEmployeeData && (
                        <p>Employee data loaded</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h5>My Documents</h5>
                    </div>
                    <div className="card-body">
                      {SingleEmployeeDocumentData && (
                        <p>Employee documents loaded</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role status information */}
              {role_status === 'active' && (
                <div className="alert alert-success mt-3">
                  Your account is active and you have access to your data
                </div>
              )}

              {role_status === 'inactive' && (
                <div className="alert alert-danger mt-3">
                  Your account is inactive. Please contact HR for assistance
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HomeComponent, EmpViewComponent };
