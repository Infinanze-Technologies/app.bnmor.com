import React from 'react';
import { Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const DeleteDiscountModal = ({ visible, onCancel, onConfirm, discountData }) => {
  return (
    <Modal
      open={visible}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 18 }} />
          <span style={{ color: '#2a3f54', fontWeight: 600 }}>Delete Discount</span>
        </div>
      }
      onCancel={onCancel}
      footer={null}
      width={400}
      centered
    >
      <div style={{ padding: '16px 0' }}>
        <p style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
          Are you sure you want to delete this discount?
        </p>
        
        {discountData && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: 16, 
            borderRadius: 8, 
            marginBottom: 24,
            border: '1px solid #e8e8e8'
          }}>
            <div style={{ marginBottom: 8 }}>
              <strong>Name:</strong> {discountData.name}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Type:</strong> {discountData.discount_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            <div>
              <strong>Value:</strong> {discountData.value}%
            </div>
          </div>
        )}
        
        <p style={{ fontSize: 12, color: '#ff4d4f', marginBottom: 24 }}>
          This action cannot be undone.
        </p>
        
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              danger 
              onClick={onConfirm}
            >
              Delete Discount
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDiscountModal; 