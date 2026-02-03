import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const { Title, Text } = Typography;

const ViewRepayments = (props) => {
  const { record, refetch, setIsModalVisible } = props;
  const router = useRouter();
  const { id } = router.query;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const showDeleteModal = () => setDeleteModalOpen(true);
  const handleCancel = () => setDeleteModalOpen(false);
  const handleDelete = () => {
    // TODO: Implement actual delete logic
    setDeleteModalOpen(false);
  };

  return (
    <div style={{ padding: 24, background: '#f7f8fa', minHeight: '100vh' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={24}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Repayment Details</Title>}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
            bodyStyle={{ padding: 32 }}
          >
            <Row gutter={32} align="middle">
              <Col xs={24} md={16}>
                <Row gutter={[0, 24]}>
                  <Col span={12}><Text strong>Repayment ID</Text><br />{record?.loan_repayment_id?.substring(0, 8)}...</Col>
                  <Col span={12}><Text strong>Borrower</Text><br />{record?.loan?.borrower?.fullname || 'N/A'}</Col>
                  <Col span={12}><Text strong>Loan Amount</Text><br />GHS {record?.loan?.loan_amount ? parseFloat(record.loan.loan_amount).toLocaleString() : 'N/A'}</Col>
                  <Col span={12}><Text strong>Amount Paid</Text><br />GHS {record?.amount_paid ? parseFloat(record.amount_paid).toLocaleString() : 'N/A'}</Col>
                  <Col span={12}><Text strong>Applied Principal</Text><br />GHS {record?.applied_principal ? parseFloat(record.applied_principal).toLocaleString() : 'N/A'}</Col>
                  <Col span={12}><Text strong>Applied Interest</Text><br />GHS {record?.applied_interest ? parseFloat(record.applied_interest).toLocaleString() : 'N/A'}</Col>
                  <Col span={12}><Text strong>Applied Fees</Text><br />GHS {record?.applied_fees ? parseFloat(record.applied_fees).toLocaleString() : 'N/A'}</Col>
                  <Col span={12}><Text strong>Payment Date</Text><br />{record?.payment_date ? new Date(record.payment_date).toLocaleDateString() : 'N/A'}</Col>
                  <Col span={12}><Text strong>Reference</Text><br />{record?.reference_no || 'N/A'}</Col>
                  <Col span={12}><Text strong>Status</Text><br />{record?.status || 'N/A'}</Col>
                  <Col span={12}><Text strong>Creator</Text><br />{record?.creator?.fullname || 'N/A'}</Col>
                  <Col span={12}><Text strong>Funding Account</Text><br />{record?.fundingAccount?.acc_name || 'N/A'}</Col>
                  <Col span={12}><Text strong>Branch</Text><br />{record?.fundingBranch?.branch?.name || 'N/A'}</Col>
                </Row>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                <div style={{ 
                  background: record?.status === 'CONFIRMED' ? '#f6ffed' : 
                             record?.status === 'PENDING' ? '#fffbe6' : 
                             record?.status === 'FAILED' ? '#fff2f0' : '#f5f5f5',
                  border: `2px solid ${record?.status === 'CONFIRMED' ? '#52c41a' : 
                                        record?.status === 'PENDING' ? '#faad14' : 
                                        record?.status === 'FAILED' ? '#ff4d4f' : '#d9d9d9'}`,
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: 16
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                    {record?.status === 'CONFIRMED' ? '✅' : 
                     record?.status === 'PENDING' ? '⏳' : 
                     record?.status === 'FAILED' ? '❌' : 
                     record?.status === 'REFUNDED' ? '💰' : 
                     record?.status === 'REVERSED' ? '🔄' : '📊'}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {record?.status || 'Unknown'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    Repayment Status
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
       
        </Col>
        <Col xs={24} md={24}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Repayment Summary</Title>}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}
            bodyStyle={{ padding: 24 }}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>
                💰
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#1890ff' }}>
                GHS {record?.amount_paid ? parseFloat(record.amount_paid).toLocaleString() : '0'}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                Total Amount Paid
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Principal:</span>
                <span style={{ fontWeight: 'bold' }}>GHS {record?.applied_principal ? parseFloat(record.applied_principal).toLocaleString() : '0'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Interest:</span>
                <span style={{ fontWeight: 'bold' }}>GHS {record?.applied_interest ? parseFloat(record.applied_interest).toLocaleString() : '0'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span>Fees:</span>
                <span style={{ fontWeight: 'bold' }}>GHS {record?.applied_fees ? parseFloat(record.applied_fees).toLocaleString() : '0'}</span>
              </div>
              <div style={{ 
                padding: '12px', 
                background: '#f0f0f0', 
                borderRadius: '8px',
                fontSize: '12px',
                color: '#666'
              }}>
                Created: {record?.created_at ? new Date(record.created_at).toLocaleString() : 'N/A'}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        open={deleteModalOpen}
        title={<span style={{ color: '#d4380d', fontWeight: 600 }}>Delete Repayment</span>}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDelete}>
            Delete
          </Button>,
        ]}
      >
        <p style={{ fontSize: 16, marginBottom: 0 }}>
          Are you sure you want to delete this repayment record? <br />
          <b>This action cannot be undone and will permanently remove the repayment data.</b>
        </p>
      </Modal>
    </div>
  );
};

export default ViewRepayments;