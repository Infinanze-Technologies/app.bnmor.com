import React from 'react';
import { Descriptions, Tag, Typography, Card, Row, Col, Divider } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, BankOutlined, CalendarOutlined } from '@ant-design/icons';
import { formatDateHuman } from '@/config/DateFormat';

const { Title, Text } = Typography;

const ViewGuarantor = ({ setIsModalVisible, jwt, record }) => {
  const handleClose = () => {
    setIsModalVisible(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '1':
      case 'Active':
        return 'success';
      case '0':
      case 'Inactive':
        return 'warning';
      case 'Suspended':
        return 'error';
      case 'Blacklisted':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case '1':
        return 'Active';
      case '0':
        return 'Inactive';
      default:
        return status;
    }
  };

  if (!record) {
    return (
      <div className="text-center p-4">
        <Text type="secondary">No guarantor data available</Text>
      </div>
    );
  }

  return (
    <div className="view-guarantor-modal">
      <div className="text-center mb-4">
        <UserOutlined style={{ fontSize: '3rem', color: '#1890ff', marginBottom: '1rem' }} />
        <Title level={3}>Guarantor Details</Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Personal Information" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Full Name">
                <Text strong>{record?.fullname || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Text>{record?.email || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number">
                <Text>{record?.phone_number || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                <Text>{record?.gender || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                <Text>{record?.date_of_birth ? formatDateHuman(record.date_of_birth) : 'N/A'}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Professional Information" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Occupation">
                <Text>{record?.occupation || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Monthly Income">
                <Text strong>${parseFloat(record?.monthly_income || 0).toLocaleString()}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Employer">
                <Text>{record?.employer || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Work Phone">
                <Text>{record?.work_phone || 'N/A'}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Relationship & Status" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Relationship Type">
                <Text>{record?.relationship_type || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(record?.status)}>
                  {getStatusText(record?.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Registration Date">
                <Text>{record?.date_of_registration ? formatDateHuman(record.date_of_registration) : 'N/A'}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Address Information" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Address Line 1">
                <Text>{record?.address_line_1 || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Address Line 2">
                <Text>{record?.address_line_2 || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="City">
                <Text>{record?.city || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="State/Province">
                <Text>{record?.state || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Postal Code">
                <Text>{record?.postal_code || 'N/A'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                <Text>{record?.country || 'N/A'}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Divider />

      <div className="text-center">
        <Text type="secondary">
          Guarantor ID: <Text code>{record?.guarantor_code || 'N/A'}</Text>
        </Text>
      </div>

      <style jsx>{`
        .view-guarantor-modal {
          padding: 1rem;
        }
        .ant-descriptions-item-label {
          font-weight: 600;
          color: #666;
        }
        .ant-card-head-title {
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ViewGuarantor;
