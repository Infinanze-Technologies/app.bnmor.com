import React, { useState } from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { deleteRequest } from '@/hooks/apiService';
import { URL_DELETE_BORROWER } from '@/config/api-paths';
import useHandleResponse from '@/hooks/useHandleResponse';

const { Text, Title } = Typography;

const DeleteBorrower = ({ setIsModalVisible, jwt, record, refetch,forceRefetch }) => {
  const [loading, setLoading] = useState(false);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();

  const handleDelete = async () => {
    if (!record?.borrower_id) {
      handleRequestError({ message: 'Invalid borrower record' });
      return;
    }

    setLoading(true);
    try {
      const response = await deleteRequest(URL_DELETE_BORROWER, record.borrower_id, jwt);
      handleRequestResponse(response);
      await forceRefetch();
      setIsModalVisible(false);
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div 
          style={{ 
            fontSize: '64px', 
            color: '#ff4d4f',
            marginBottom: '16px'
          }} 
        >
          ⚠️
        </div>
        <Title level={3} style={{ color: '#ff4d4f', marginBottom: '8px' }}>
          Delete Borrower
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Are you sure you want to delete this borrower?
        </Text>
      </div>

      <div style={{ 
        background: '#fff2f0', 
        border: '1px solid #ffccc7', 
        borderRadius: '8px', 
        padding: '16px', 
        marginBottom: '30px' 
      }}>
        <Title level={4} style={{ marginBottom: '12px', color: '#cf1322' }}>
          ⚠️ Warning
        </Title>
        <Text style={{ color: '#cf1322', fontSize: '14px', lineHeight: '1.6' }}>
          This action cannot be undone. Deleting this borrower will permanently remove:
        </Text>
        <ul style={{ 
          color: '#cf1322', 
          fontSize: '14px', 
          lineHeight: '1.6', 
          marginTop: '8px',
          marginBottom: '0',
          paddingLeft: '20px'
        }}>
          <li>All borrower information and personal data</li>
          <li>Associated loan records and repayment history</li>
          <li>Uploaded documents and files</li>
          <li>Any pending loan applications</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Text strong style={{ fontSize: '16px', marginBottom: '16px', display: 'block' }}>
          Borrower Details:
        </Text>
        <div style={{ 
          background: '#f5f5f5', 
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <Text strong>Name: </Text>
            <Text>{record?.fullname || 'N/A'}</Text>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <Text strong>Email: </Text>
            <Text>{record?.email || 'N/A'}</Text>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <Text strong>Phone: </Text>
            <Text>{record?.primary_phone || 'N/A'}</Text>
          </div>
          <div>
            <Text strong>Borrower ID: </Text>
            <Text style={{ fontFamily: 'monospace' }}>{record?.borrower_id || 'N/A'}</Text>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Space size="large">
          <Button 
            size="large" 
            onClick={handleCancel}
            style={{ 
              minWidth: '120px',
              height: '40px'
            }}
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            danger 
            size="large" 
            loading={loading}
            onClick={handleDelete}
            style={{ 
              minWidth: '120px',
              height: '40px'
            }}
          >
            {loading ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default DeleteBorrower;
