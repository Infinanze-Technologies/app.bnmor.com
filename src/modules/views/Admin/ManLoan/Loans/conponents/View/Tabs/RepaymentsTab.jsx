import React from 'react';
import { Button, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, DownloadOutlined, CreditCardOutlined } from '@ant-design/icons';
import AddRepaymentModal from '../RepaymentModal/AddRepaymentModal';
import EditRepaymentModal from '../RepaymentModal/EditRepaymentModal';
import DeleteRepaymentModal from '../RepaymentModal/DeleteRepaymentModal';

const RepaymentsTab = ({
  addRepaymentModalVisible,
  setAddRepaymentModalVisible,
  editRepaymentModalVisible,
  setEditRepaymentModalVisible,
  selectedRepayment,
  setSelectedRepayment,
  deleteRepaymentModalVisible,
  setDeleteRepaymentModalVisible,
  selectedRepaymentForDelete,
  setSelectedRepaymentForDelete,
  singleLoanDataObject,
  jwt,
  message,
  repaymentsData,
  SingleLoanDataRefetch,
  LoanScheduleData,
  LoanJournalEntriesData,
  LoanAuditTrailData
}) => {
  let repaymentsDataObject = repaymentsData?.data?.data?.repayments;
  // console.log(repaymentsDataObject);

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return `GH₵${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Helper function to get payment method tag color
  const getPaymentMethodColor = (fundingAccount) => {
    const accountName = fundingAccount?.acc_name?.toLowerCase();
    if (accountName?.includes('cash')) return 'green';
    if (accountName?.includes('bank')) return 'blue';
    return 'default';
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        {repaymentsDataObject && repaymentsDataObject.length > 0 ? (
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            border: '1px solid #e8e8e8',
            borderRadius: 8,
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#fafafa' }}>
                <th style={{ 
                  padding: '16px 12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  borderRight: '1px solid #e8e8e8',
                  fontWeight: 600,
                  color: '#2a3f54',
                  fontSize: 14
                }}>
                  Repayment Amount
                </th>
                <th style={{ 
                  padding: '16px 12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  borderRight: '1px solid #e8e8e8',
                  fontWeight: 600,
                  color: '#2a3f54',
                  fontSize: 14
                }}>
                  Payment Method
                </th>
                <th style={{ 
                  padding: '16px 12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  borderRight: '1px solid #e8e8e8',
                  fontWeight: 600,
                  color: '#2a3f54',
                  fontSize: 14
                }}>
                  Amount Breakdown
                </th>
                <th style={{ 
                  padding: '16px 12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  borderRight: '1px solid #e8e8e8',
                  fontWeight: 600,
                  color: '#2a3f54',
                  fontSize: 14
                }}>
                  Collection Date
                </th>
                <th style={{ 
                  padding: '16px 12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  borderRight: '1px solid #e8e8e8',
                  fontWeight: 600,
                  color: '#2a3f54',
                  fontSize: 14
                }}>
                  Description
                </th>
                <th style={{ 
                  padding: '16px 12px', 
                  textAlign: 'center', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 600,
                  color: '#2a3f54',
                  fontSize: 14
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {repaymentsDataObject.map((repayment, index) => (
                <tr key={repayment.repayment_id || index}>
                  <td style={{ 
                    padding: '16px 12px', 
                    borderBottom: '1px solid #e8e8e8',
                    borderRight: '1px solid #e8e8e8',
                    color: '#333',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CreditCardOutlined style={{ color: '#1890ff' }} />
                    <span>{formatCurrency(repayment.amount_paid)}</span>
                  </td>
                  <td style={{ 
                    padding: '16px 12px', 
                    borderBottom: '1px solid #e8e8e8',
                    borderRight: '1px solid #e8e8e8',
                    color: '#333',
                    fontWeight: 500
                  }}>
                    <Tag color={getPaymentMethodColor(repayment.funding_account)}>
                      {repayment.funding_account?.acc_name || 'Unknown'}
                    </Tag>
                  </td>
                  <td style={{ 
                    padding: '16px 12px', 
                    borderBottom: '1px solid #e8e8e8',
                    borderRight: '1px solid #e8e8e8',
                    color: '#333',
                    fontWeight: 500
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Fees: {formatCurrency(repayment.applied_fees)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Principal: {formatCurrency(repayment.applied_principal)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Interest: {formatCurrency(repayment.applied_interest)}
                      </div>
                    </div>
                  </td>
                  <td style={{ 
                    padding: '16px 12px', 
                    borderBottom: '1px solid #e8e8e8',
                    borderRight: '1px solid #e8e8e8',
                    color: '#333',
                    fontWeight: 500
                  }}>
                    {formatDate(repayment.payment_date)}
                  </td>
                  <td style={{ 
                    padding: '16px 12px', 
                    borderBottom: '1px solid #e8e8e8',
                    borderRight: '1px solid #e8e8e8',
                    color: '#333',
                    fontWeight: 500
                  }}>
                    {repayment.reference_no || 'N/A'}
                  </td>
                  <td style={{ 
                    padding: '16px 12px', 
                    textAlign: 'center',
                    borderBottom: '1px solid #e8e8e8',
                    color: '#333'
                  }}>
                    <Space>
                      {/* <Button 
                        type="text" 
                        size="small" 
                        icon={<DownloadOutlined />} 
                        style={{ color: '#52c41a' }}
                      /> */}
                      {/* <Button 
                        type="text" 
                        size="small" 
                        icon={<EditOutlined />} 
                        onClick={() => {
                          setSelectedRepayment({
                            repayment_id: repayment.repayment_id,
                            amount_paid: repayment.amount_paid,
                            payment_date: repayment.payment_date,
                            reference_no: repayment.reference_no,
                            applied_principal: repayment.applied_principal,
                            applied_interest: repayment.applied_interest,
                            applied_fees: repayment.applied_fees,
                            funding_account: repayment.funding_account,
                            status: repayment.status
                          });
                          setEditRepaymentModalVisible(true);
                        }}
                        style={{ color: '#1890ff' }}
                      /> */}
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<DeleteOutlined />} 
                        onClick={() => {
                          setSelectedRepaymentForDelete({
                            repayment_id: repayment.repayment_id,
                            amount_paid: repayment.amount_paid,
                            payment_date: repayment.payment_date,
                            reference_no: repayment.reference_no,
                            applied_principal: repayment.applied_principal,
                            applied_interest: repayment.applied_interest,
                            applied_fees: repayment.applied_fees,
                            funding_account: repayment.funding_account,
                            status: repayment.status
                          });
                          setDeleteRepaymentModalVisible(true);
                        }}
                        style={{ color: '#ff4d4f' }}
                      />
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#999',
            fontSize: '16px'
          }}>
            No repayments found for this loan.
          </div>
        )}
      </div>

      <Button 
        type="primary" 
        onClick={() => setAddRepaymentModalVisible(true)}
        size="small"
        style={{ 
          borderRadius: 4,
          backgroundColor: '#000',
          borderColor: '#000',
          paddingLeft: 16,
          paddingRight: 16,
          height: 28,
          fontSize: 12,
          fontWeight: 500,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}
      >
        Add Repayment
      </Button>

      <AddRepaymentModal
        visible={addRepaymentModalVisible}
        jwt={jwt}
        singleLoanDataObject={singleLoanDataObject}
        onCancel={() => setAddRepaymentModalVisible(false)}
        SingleLoanDataRefetch={SingleLoanDataRefetch}
        RepaymentsDataRefetch={repaymentsData}
        LoanScheduleData={LoanScheduleData}
        LoanJournalEntriesData={LoanJournalEntriesData}
        LoanAuditTrailData={LoanAuditTrailData}
      />

   

      <DeleteRepaymentModal
        visible={deleteRepaymentModalVisible}
        repaymentData={selectedRepaymentForDelete}
        jwt={jwt}
        repaymentsData={repaymentsDataObject}
        onCancel={() => {
          setDeleteRepaymentModalVisible(false);
          setSelectedRepaymentForDelete(null);
        }}
        SingleLoanDataRefetch={SingleLoanDataRefetch}
        RepaymentsDataRefetch={repaymentsData}
        LoanScheduleData={LoanScheduleData}
        LoanJournalEntriesData={LoanJournalEntriesData}
        LoanAuditTrailData={LoanAuditTrailData}
        />
    </div>
  );
};

export default RepaymentsTab; 
