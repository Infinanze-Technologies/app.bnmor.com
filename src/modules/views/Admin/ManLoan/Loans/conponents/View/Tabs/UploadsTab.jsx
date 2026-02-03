import React, { useState } from 'react';
import { Card, Row, Col, Image, Typography, Tag, Button, Space, Spin, Divider } from 'antd';
import { EyeOutlined, DownloadOutlined, UserOutlined, IdcardOutlined, FileImageOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UploadsTab = ({ singleLoanDataObject, jwt }) => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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


  // Borrower file items
  const borrowerFileItems = [
    {
      key: 'profile',
      title: 'Profile Image',
      url: singleLoanDataObject?.borrower?.files?.profile_img,
      icon: <UserOutlined style={{ fontSize: '18px', color: '#1890ff' }} />,
      description: 'Borrower profile picture',
      color: '#1890ff'
    },
    {
      key: 'front_id',
      title: 'ID Front Image',
      url: singleLoanDataObject?.borrower?.files?.front_id,
      icon: <IdcardOutlined style={{ fontSize: '18px', color: '#52c41a' }} />,
      description: 'Front side of identification document',
      color: '#52c41a'
    },
    {
      key: 'back_id',
      title: 'ID Back Image',
      url: singleLoanDataObject?.borrower?.files?.back_id,
      icon: <IdcardOutlined style={{ fontSize: '18px', color: '#fa8c16' }} />,
      description: 'Back side of identification document',
      color: '#fa8c16'
    }
  ];

  // Guarantor file items
  const guarantorFileItems = [
    {
      key: 'profile',
      title: 'Profile Image',
      url: singleLoanDataObject?.guarantor?.files?.profile_img,
      icon: <UserOutlined style={{ fontSize: '18px', color: '#722ed1' }} />,
      description: 'Guarantor profile picture',
      color: '#722ed1'
    },
    {
      key: 'front_id',
      title: 'ID Front Image',
      url: singleLoanDataObject?.guarantor?.files?.front_id,
      icon: <IdcardOutlined style={{ fontSize: '18px', color: '#13c2c2' }} />,
      description: 'Front side of identification document',
      color: '#13c2c2'
    },
    {
      key: 'back_id',
      title: 'ID Back Image',
      url: singleLoanDataObject?.guarantor?.files?.back_id,
      icon: <IdcardOutlined style={{ fontSize: '18px', color: '#eb2f96' }} />,
      description: 'Back side of identification document',
      color: '#eb2f96'
    }
  ];

  const renderFileSection = (title, fileItems, personType) => (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '24px',
        padding: '16px',
        background: 'linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%)',
        borderRadius: '12px',
        border: '1px solid #d9d9d9'
      }}>
        <FileImageOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
        <div>
          <Title level={4} style={{ margin: 0, color: '#2a3f54' }}>{title}</Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {personType === 'borrower' 
              ? `${singleLoanDataObject?.borrower?.fullname || 'Unknown'} - Borrower Files`
              : `${singleLoanDataObject?.guarantor?.fullname || 'Unknown'} - Guarantor Files`
            }
          </Text>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {fileItems.map((item) => (
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

      {/* No files message for this section */}
      {!fileItems.some(item => item.url) && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#999',
          background: '#fafafa',
          borderRadius: '12px',
          border: '1px dashed #d9d9d9',
          marginTop: '16px'
        }}>
          <FileImageOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <Title level={4} type="secondary">No Files Available</Title>
          <Text type="secondary">
            {personType === 'borrower' 
              ? 'This borrower has not uploaded any files yet.'
              : 'This guarantor has not uploaded any files yet.'
            }
          </Text>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Spin spinning={loading}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#2a3f54' }}>Uploaded Files</Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              View and manage borrower and guarantor documents
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px', borderRadius: '20px' }}>
              Loan ID: {singleLoanDataObject?.loan_id || 'N/A'}
            </Tag>
          </div>
        </div>

        {/* Borrower Files Section */}
        {renderFileSection('Borrower Documents', borrowerFileItems, 'borrower')}

        {/* Divider */}
        <Divider style={{ margin: '48px 0', fontSize: '16px', color: '#666' }}>
          <Text type="secondary">Guarantor Documents</Text>
        </Divider>

        {/* Guarantor Files Section */}
        {renderFileSection('Guarantor Documents', guarantorFileItems, 'guarantor')}

        {/* Overall No Files Message */}
        {!singleLoanDataObject?.borrower?.files?.profile_img && 
         !singleLoanDataObject?.borrower?.files?.front_id && 
         !singleLoanDataObject?.borrower?.files?.back_id &&
         !singleLoanDataObject?.guarantor?.files?.profile_img && 
         !singleLoanDataObject?.guarantor?.files?.front_id && 
         !singleLoanDataObject?.guarantor?.files?.back_id && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999',
            background: '#fafafa',
            borderRadius: '12px',
            border: '1px dashed #d9d9d9',
            marginTop: '32px'
          }}>
            <FileImageOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <Title level={4} type="secondary">No Files Available</Title>
            <Text type="secondary">Neither the borrower nor guarantor has uploaded any files yet.</Text>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default UploadsTab;
