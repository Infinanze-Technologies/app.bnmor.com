import React from 'react';
import { Tabs } from 'antd';
import { useRouter } from 'next/router';
import {
  BRANCH_PAGE,
  DEPARTMENT_PAGE,
  DESIGNATION_PAGE,
  LEAVETYPE_PAGE,
  PAYSLIPTYPE_PAGE,
  ALLOWANCCEOPTION_PAGE,
  DEDUCTIONOPTIONS_PAGE,
  AWARDTYPE_PAGE,
  TERMINATIONTYPE_PAGE,
  EXPENSESTYPE_PAGE,
  INCOMETYPE_PAGE,
  PAYMENTTYPE_PAGE
} from '@/config/page-routes';

const ManagementSettingsTabsClient = ({ activeKey, onTabChange }) => {
  const router = useRouter();

  const tabItems = [
    {
      key: 'branch',
      label: 'Branch',
      path: BRANCH_PAGE,
      icon: '🏢'
    },
    {
      key: 'department',
      label: 'Department',
      path: DEPARTMENT_PAGE,
      icon: '🏛️'
    },
    {
      key: 'designation',
      label: 'Designation',
      path: DESIGNATION_PAGE,
      icon: '👔'
    },
    {
      key: 'leaveType',
      label: 'Leave Type',
      path: LEAVETYPE_PAGE,
      icon: '🏖️'
    },
    {
      key: 'payslipType',
      label: 'Payslip Type',
      path: PAYSLIPTYPE_PAGE,
      icon: '💰'
    },
    {
      key: 'allowanceOption',
      label: 'Allowance Option',
      path: ALLOWANCCEOPTION_PAGE,
      icon: '➕'
    },
    {
      key: 'deductionOption',
      label: 'Deduction Option',
      path: DEDUCTIONOPTIONS_PAGE,
      icon: '➖'
    },
    {
      key: 'awardType',
      label: 'Award Type',
      path: AWARDTYPE_PAGE,
      icon: '🏆'
    },
    {
      key: 'terminationType',
      label: 'Termination Type',
      path: TERMINATIONTYPE_PAGE,
      icon: '🚪'
    },
    {
      key: 'expenseType',
      label: 'Expense Type',
      path: EXPENSESTYPE_PAGE,
      icon: '💸'
    },
    {
      key: 'incomeType',
      label: 'Income Type',
      path: INCOMETYPE_PAGE,
      icon: '💵'
    },
    {
      key: 'paymentType',
      label: 'Payment Type',
      path: PAYMENTTYPE_PAGE,
      icon: '💳'
    }
  ];

  const handleTabChange = (key) => {
    const selectedTab = tabItems.find(tab => tab.key === key);
    if (selectedTab) {
      router.push(selectedTab.path);
    }
    if (onTabChange) {
      onTabChange(key);
    }
  };

  return (
    <div className="management-settings-tabs" style={{ marginBottom: '24px' }}>
      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        type="card"
        size="large"
        tabPosition="top"
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '16px'
        }}
        items={tabItems.map(tab => ({
          key: tab.key,
          label: (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </span>
          )
        }))}
      />
    </div>
  );
};

export default ManagementSettingsTabsClient;
