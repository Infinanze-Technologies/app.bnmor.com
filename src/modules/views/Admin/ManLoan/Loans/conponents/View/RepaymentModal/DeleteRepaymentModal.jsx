import React, { useState } from 'react';
import { Modal, Button, Space, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteRequest } from '@/hooks/apiService';
import { URL_DELETE_LOAN_REPAYMENT } from '@/config/api-paths';
import useHandleResponse from '@/hooks/useHandleResponse';

const DeleteRepaymentModal = ({ 
  visible, 
  onCancel, 
  repaymentData, 
  jwt, 
  SingleLoanDataRefetch,
  RepaymentsDataRefetch,
  LoanScheduleData,
  LoanJournalEntriesData,
  LoanAuditTrailData
}) => {
  const [loading, setLoading] = useState(false);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();

  const handleDelete = async () => {
    if (!repaymentData?.repayment_id) {
      message.error('Repayment ID is required for deletion');
      return;
    }

    setLoading(true);
    try {
      await deleteRequest(URL_DELETE_LOAN_REPAYMENT, repaymentData.repayment_id, jwt).then((res) => {
        handleRequestResponse(res);
        SingleLoanDataRefetch?.refetchEntity();
        RepaymentsDataRefetch?.refetchEntity();
        LoanScheduleData?.refetchEntity();
        LoanJournalEntriesData?.refetchEntity();
        LoanAuditTrailData?.refetchEntity();
        onCancel();
      }).catch((err) => {
        handleRequestError(err);
      });
     
    } catch (error) {
      console.error('Error deleting repayment:', error);
      message.error('Failed to delete repayment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      open={visible}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 18 }} />
          <span style={{ color: '#2a3f54', fontWeight: 600 }}>Delete Repayment</span>
        </div>
      }
      onCancel={onCancel}
      footer={null}
      width={400}
      centered
    >
      <div style={{ padding: '16px 0' }}>
        <p style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
          Are you sure you want to delete this repayment?
        </p>
        
        {repaymentData && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: 16, 
            borderRadius: 8, 
            marginBottom: 24,
            border: '1px solid #e8e8e8'
          }}>
            <div style={{ marginBottom: 8 }}>
              <strong>Amount:</strong> GH₵ {repaymentData.amount_paid?.toLocaleString()} GHS
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Date:</strong> {new Date(repaymentData.payment_date).toLocaleDateString('en-GB')}
            </div>
            {repaymentData.reference_no && (
              <div>
                <strong>Description:</strong> {repaymentData.reference_no}
              </div>
            )}
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              <strong>Payment Method:</strong> {repaymentData.funding_account?.acc_name || 'N/A'}
            </div>
          </div>
        )}
        
        <p style={{ fontSize: 12, color: '#ff4d4f', marginBottom: 24 }}>
          This action cannot be undone.
        </p>
        
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              danger 
              onClick={handleDelete}
              loading={loading}
            >
              Delete Repayment
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteRepaymentModal; 