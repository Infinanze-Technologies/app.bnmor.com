import React, { useState } from 'react';
import { Modal, Card, Row, Col, Image, Typography, Tag, Button, Space, Spin } from 'antd';
import { EyeOutlined, DownloadOutlined, UserOutlined, IdcardOutlined, EditOutlined } from '@ant-design/icons';
import EditFile from './EditFile';

const { Title, Text } = Typography;

const ViewBorrowerFiles = ({ record, visible, onCancel, jwt, onFileUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingFileType, setEditingFileType] = useState(null);

  const handleDownload = (url, filename) => {
    setLoading(true);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoading(false);
  };

  const getFileType = (url) => {
    if (!url) return 'Unknown';
    const extension = url.split('.').pop().toLowerCase();
    return extension.toUpperCase();
  };

  const getFileSize = (url) => {
    // This is a placeholder - in a real app you'd get this from the API
    return '~2.5 MB';
  };

  const handleEditFile = (fileType) => {
    setEditingFileType(fileType);
    setEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditingFileType(null);
  };

  const handleEditSuccess = () => {
    onFileUpdate?.();
    // onCancel();
    setEditModalVisible(false);
    setEditingFileType(null);
  };

  // Debug: Log the record to see what data we're getting


  const imageItems = [
    {
      key: 'profile',
      title: 'Profile Image',
      url: record?.files?.profile_img,
      icon: <UserOutlined style={{ fontSize: '18px', color: '#1890ff' }} />,
      description: 'Borrower profile picture',
      color: '#1890ff'
    },
    {
      key: 'front_id',
      title: 'ID Front Image',
      url: record?.files?.front_id,
      icon: <IdcardOutlined style={{ fontSize: '18px', color: '#52c41a' }} />,
      description: 'Front side of identification document',
      color: '#52c41a'
    },
    {
      key: 'back_id',
      title: 'ID Back Image',
      url: record?.files?.back_id,
      icon: <IdcardOutlined style={{ fontSize: '18px', color: '#fa8c16' }} />,
      description: 'Back side of identification document',
      color: '#fa8c16'
    }
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EyeOutlined style={{ color: '#1890ff' }} />
          <span>Borrower Files - {record?.fullname || 'Unknown'}</span>
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
        {/* Debug section - remove this after fixing */}
        {/* <div style={{ 
          background: '#f0f0f0', 
          padding: '10px', 
          marginBottom: '20px', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <strong>Debug Info:</strong><br/>
          Profile URL: {record?.files?.profile_img || 'Not found'}<br/>
          Front ID URL: {record?.files?.front_id || 'Not found'}<br/>
          Back ID URL: {record?.files?.back_id || 'Not found'}<br/>
          Files object: {JSON.stringify(record?.files, null, 2)}
        </div> */}
        
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
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  {item.icon}
                  <Title level={5} style={{ margin: '8px 0 4px 0', color: item.color }}>
                    {item.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {item.description}
                  </Text>
                </div>

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
                            borderRadius: '8px',
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

                    {/* <div style={{ marginBottom: '12px' }}>
                      <Space size="small" wrap>
                        <Tag color={item.color} style={{ fontSize: '11px' }}>
                          {getFileType(item.url)}
                        </Tag>
                        <Tag color="default" style={{ fontSize: '11px' }}>
                          {getFileSize(item.url)}
                        </Tag>
                      </Space>
                    </div> */}

                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        size="small"
                        block
                        onClick={() => handleDownload(item.url, `${item.title}.${getFileType(item.url).toLowerCase()}`)}
                        style={{
                          background: item.color,
                          borderColor: item.color,
                          borderRadius: '6px'
                        }}
                      >
                        Download
                      </Button>
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        block
                        onClick={() => handleEditFile(item)}
                        style={{
                          borderColor: item.color,
                          color: item.color,
                          borderRadius: '6px'
                        }}
                      >
                        Edit File
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

        {!record?.files?.profile_img && !record?.files?.front_id && !record?.files?.back_id && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <EyeOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <Title level={4} type="secondary">No Files Available</Title>
            <Text type="secondary">This borrower has not uploaded any files yet.</Text>
          </div>
        )}
      </Spin>

      <EditFile
        visible={editModalVisible}
        onCancel={handleEditCancel}
        record={record}
        fileType={editingFileType}
        currentUrl={record?.files?.[editingFileType] || record?.[editingFileType]}
        jwt={jwt}
        onSuccess={handleEditSuccess}
      />
    </Modal>
  );
};

export default ViewBorrowerFiles;
