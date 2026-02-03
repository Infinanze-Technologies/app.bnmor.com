import React, { useState } from 'react';
import { Button, Space, Typography, Alert, Divider } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteRequest } from '@/hooks/apiService';
import { URL_DELETE_GUARANTOR } from '@/config/api-paths';
import useHandleResponse from '@/hooks/useHandleResponse';

const { Title, Text } = Typography;

const DeleteGuarantor = ({ setIsModalVisible, jwt, record, refetch,forceRefetch }) => {
  const [loading, setLoading] = useState(false);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();

  const handleDelete = async () => {
    if (!record?.id) {
      handleRequestError({ message: 'Invalid guarantor record' });
      return;
    }

    setLoading(true);
    try {
      const response = await deleteRequest(URL_DELETE_GUARANTOR, record.guarantor_id, jwt);
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
    <div className="delete-guarantor-modal">
      <div className="text-center mb-4">
        <ExclamationCircleOutlined 
          style={{ 
            fontSize: '4rem', 
            color: '#ff4d4f',
            marginBottom: '1rem'
          }} 
        />
        <Title level={3} style={{ color: '#ff4d4f' }}>
          Delete Guarantor
        </Title>
      </div>

      <Alert
        message="Warning"
        description="This action cannot be undone. This will permanently delete the guarantor and all associated data."
        type="warning"
        showIcon
        style={{ marginBottom: '1.5rem' }}
      />

      <Divider />

      <div className="guarantor-details mb-4">
        <Title level={5}>Guarantor Details:</Title>
        <div className="detail-row">
          <Text strong>Name:</Text> <Text>{record?.fullname || 'N/A'}</Text>
        </div>
        <div className="detail-row">
          <Text strong>Email:</Text> <Text>{record?.email || 'N/A'}</Text>
        </div>
        <div className="detail-row">
          <Text strong>Phone:</Text> <Text>{record?.phone_number || 'N/A'}</Text>
        </div>
        <div className="detail-row">
          <Text strong>ID:</Text> <Text code>{record?.guarantor_id || 'N/A'}</Text>
        </div>
      </div>

      <Divider />

      <div className="text-center">
        <Space size="middle">
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />}
            loading={loading}
            onClick={handleDelete}
            size="large"
          >
            Delete Guarantor
          </Button>
          <Button 
            onClick={handleCancel}
            size="large"
          >
            Cancel
          </Button>
        </Space>
      </div>

      <style jsx>{`
        .delete-guarantor-modal {
          padding: 1rem;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default DeleteGuarantor;
