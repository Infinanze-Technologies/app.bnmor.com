import React from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { deleteRequest } from "@/hooks/apiService";
import { URL_DELETE_VISITOR_ENTRIES } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";

const { Title, Text } = Typography;

const DeleteEntry = (props) => {
  const { jwt, record, refetch, setIsModalVisible, setpage } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();

  const handleDelete = () => {
    deleteRequest(URL_DELETE_VISITOR_ENTRIES, record?.entry_id, jwt)
      .then((res) => {
        handleRequestResponse(res);
        refetch();
        setIsModalVisible(false);
        setpage(0);
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ 
      maxWidth: 600, 
      margin: "0 auto", 
      padding: 24
    }}>
      <Card
        bordered={false}
        style={{ 
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)", 
          borderRadius: 12,
          textAlign: 'center'
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <ExclamationCircleOutlined 
            style={{ 
              fontSize: 64, 
              color: '#ff4d4f',
              marginBottom: 16
            }} 
          />
          <Title level={3} style={{ color: '#ff4d4f', marginBottom: 16 }}>
            Delete Entry
          </Title>
          <Text style={{ fontSize: 16, color: '#666' }}>
            Are you sure you want to delete this entry?
          </Text>
          <br />
          <Text style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
            This action cannot be undone. All associated data will be permanently removed.
          </Text>
        </div>

        <Space size="middle">
          <Button
            size="large"
            onClick={handleCancel}
            style={{
              borderRadius: '8px',
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            size="large"
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            style={{
              borderRadius: '8px',
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Delete Permanently
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default DeleteEntry;
