import React, { useState } from 'react';
import { Modal, Card, Row, Col, Image, Typography, Tag, Button, Space, Spin, message } from 'antd';
import { EyeOutlined, DownloadOutlined, UserOutlined, IdcardOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { URL_DELETE_PROPERTY_FILES } from '@/config/api-paths';
import { deleteRequest } from '@/hooks/apiService';
import useHandleResponse from '@/hooks/useHandleResponse';

const { Title, Text } = Typography;

const ViewPropertyFiles = ({ record, visible, onCancel, jwt, onFileUpdate }) => {
  const [loading, setLoading] = useState(false);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();  


  const getFileType = (url) => {
    if (!url) return 'Unknown';
    const extension = url.split('.').pop().toLowerCase();
    return extension.toUpperCase();
  };

 


  

  const handleDeleteFile = (image) => {
    Modal.confirm({
      title: 'Delete Image',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: 'Are you sure you want to delete this image? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setLoading(true);
          
          // Extract image ID from the image object
          const imageId = image.id || image.key?.replace('image_', '');
          
          if (!imageId) {
            message.error('Unable to identify image for deletion');
            return;
          }

          await deleteRequest(URL_DELETE_PROPERTY_FILES, imageId, jwt).then((res) => {
            handleRequestResponse(res);
            onFileUpdate && onFileUpdate();
            setLoading(false);
          }).catch((err) => {
            handleRequestError(err);
            setLoading(false);
          });
        } catch (error) {
          handleRequestError(error);
          setLoading(false);
        }
      },
    });
  };

  // Debug: Log the record to see what data we're getting


  // Extract images from the record
  const images = record?.images || [];
  
  const imageItems = images.map((image, index) => ({
    key: `image_${image.id || index}`,
    id: image.id,
    title: `Image ${index + 1}`,
    url: image.image_url,
    icon: <UserOutlined style={{ fontSize: '18px', color: '#1890ff' }} />,
    description: `Property image ${index + 1}`,
    color: index === 0 ? '#1890ff' : index === 1 ? '#52c41a' : '#fa8c16'
  }));

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EyeOutlined style={{ color: '#1890ff' }} />
          <span>Property Images - {record?.name || record?.title || 'Property'}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>
      ]}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
    >
      <Spin spinning={loading}>
     
        
        <Row gutter={[16, 16]}>
          {imageItems.map((item) => (
            <Col xs={24} md={8} key={item.key}>
              <Card
                hoverable
                style={{
                  height: '100%',
                  border: `2px solid ${item.color}20`,
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ padding: '16px' }}
              >
               

                {item.url ? (
                  <>
                    <div style={{ 
                      marginBottom: '12px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '150px',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      border: `1px solid ${item.color}30`
                    }}>
                      <Image
                        src={item.url}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          borderRadius: '8px'
                        }}
                        placeholder={
                          <div style={{
                            width: '100%',
                            height: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f5f5f5',
                            borderRadius: '8px'
                          }}>
                            <Spin size="small" />
                          </div>
                        }
                        preview={{
                          mask: <div style={{ color: 'white', fontSize: '14px' }}>Click to preview</div>
                        }}
                        onError={(e) => {
                          console.log(`Error loading image for ${item.title}:`, item.url);
                          console.log('Error details:', e);
                        }}
                      />
                    </div>

                 
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                   
                      <Button
                        icon={<DeleteOutlined />}
                        size="small"
                        block
                        onClick={() => handleDeleteFile(item)}
                        style={{
                          borderColor: '#ff4d4f',
                          color: '#ff4d4f',
                          borderRadius: '6px'
                        }}
                      >
                        Delete Image
                      </Button>
                    </Space>
                  </>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#999',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    border: '2px dashed #d9d9d9'
                  }}>
                    <EyeOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                    <div>No {item.title} available</div>
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>

        {images.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <EyeOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <Title level={4} type="secondary">No Images Available</Title>
            <Text type="secondary">This property has no images uploaded yet.</Text>
          </div>
        )}
      </Spin>

    </Modal>
  );
};

export default ViewPropertyFiles;
