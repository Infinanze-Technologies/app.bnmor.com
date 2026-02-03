import React, { useState } from 'react';
import { Card, Row, Col, Typography, Avatar, Button, Divider, List, Space, Modal, Image } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, FileImageOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const { Title, Text } = Typography;

const borrower = {
  name: 'Emma Oppong',
  gender: 'Male',
  dob: '23 May 2006',
  maritalStatus: 'Single',
  identification: 'Licence',
  occupation: 'Employed',
  taxId: '12336',
  address: 'Nungua',
  city: 'Accra',
  email: 'demo477@gmail.com',
  secondaryPhone: '+233245990160',
  profileImage: '', // Use a URL or leave blank for placeholder
  identificationImages: [
    'https://bedrock.trade/assets/logo2.svg',
    'https://infinanza.com/assets/logo_bluewhite-870b42a3617b51357c1f731c6799b9e086849eb978c0a3cb103da70171463067.png',
  ],
};

const activityLogs = [
  {
    time: '1 day ago',
    action: 'create',
    description: 'You created this borrower',
  },
];

const ViewProperty = () => {
  const router = useRouter();
  const { id } = router.query;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);

  const showDeleteModal = () => setDeleteModalOpen(true);
  const handleCancel = () => setDeleteModalOpen(false);
  const handleDelete = () => {
    // TODO: Implement actual delete logic
    setDeleteModalOpen(false);
  };

  const showDocModal = () => setDocModalOpen(true);
  const handleDocModalClose = () => setDocModalOpen(false);

  return (
    <div style={{ padding: 24, background: '#f7f8fa', minHeight: '100vh' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Borrower Details</Title>}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
            bodyStyle={{ padding: 32 }}
          >
            <Row gutter={32} align="middle">
              <Col xs={24} md={16}>
                <Row gutter={[0, 24]}>
                  <Col span={12}><Text strong>Name</Text><br />{borrower.name}</Col>
                  <Col span={12}><Text strong>Address</Text><br />{borrower.address}</Col>
                  <Col span={12}><Text strong>Gender</Text><br />{borrower.gender}</Col>
                  <Col span={12}><Text strong>City</Text><br />{borrower.city}</Col>
                  <Col span={12}><Text strong>Date of Birth</Text><br />{borrower.dob}</Col>
                  <Col span={12}><Text strong>Email</Text><br />{borrower.email}</Col>
                  <Col span={12}><Text strong>Marital Status</Text><br />{borrower.maritalStatus}</Col>
                  <Col span={12}><Text strong>Secondary Phone Number</Text><br />{borrower.secondaryPhone}</Col>
                  <Col span={12}><Text strong>Identification</Text><br />{borrower.identification}</Col>
                  <Col span={12}><Text strong>Occupation</Text><br />{borrower.occupation}</Col>
                  <Col span={12}><Text strong>Tax Identification Number/Reference</Text><br />{borrower.taxId}</Col>
                </Row>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                <Avatar
                  size={120}
                  src={borrower.profileImage}
                  icon={<UserOutlined />}
                  style={{ background: '#e6f7ff', marginBottom: 16, border: '4px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                />
                <div style={{ marginTop: 16 }}>
                  <Button icon={<FileImageOutlined />} onClick={showDocModal} type="dashed" shape="round">
                    View Identification Images
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
          <Card
            title={<Title level={5} style={{ margin: 0, color: '#d4380d' }}><ExclamationCircleOutlined style={{ color: '#d4380d', marginRight: 8 }} />Danger Zone</Title>}
            bordered={false}
            style={{ borderRadius: 12, marginTop: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}
            bodyStyle={{ padding: 32 }}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Text strong>Modify Borrower</Text>
                <div style={{ color: '#888', marginBottom: 12 }}>Change details of the borrower.</div>
                <Button icon={<EditOutlined />} type="primary" shape="round" onClick={() => router.push(`/dashboard/borrower-management/borrowers/edit/${id}`)}>Edit</Button>
              </Col>
              <Col xs={24} md={12}>
                <Text strong>Delete Borrower</Text>
                <div style={{ color: '#888', marginBottom: 12 }}>Delete this borrower.</div>
                <Button icon={<DeleteOutlined />} type="danger" danger shape="round" onClick={showDeleteModal}>Delete</Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Activity Logs</Title>}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}
            bodyStyle={{ padding: 24 }}
          >
            <List
              itemLayout="horizontal"
              dataSource={activityLogs}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<span style={{ fontSize: 13, color: '#888' }}>{item.time} <Button size="small" style={{ marginLeft: 8 }} type="dashed">{item.action}</Button></span>}
                    description={<span style={{ fontSize: 14 }}>{item.description}</span>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        open={deleteModalOpen}
        title={<span style={{ color: '#d4380d', fontWeight: 600 }}>Delete Borrower</span>}
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
          Are you sure you want to delete this borrower? <br />
          <b>All of the borrower's loans, repayments and file data will be permanently deleted and cannot be recovered.</b>
        </p>
      </Modal>
      <Modal
        open={docModalOpen}
        title={<span style={{ fontWeight: 600 }}>Identification Images</span>}
        onCancel={handleDocModalClose}
        footer={[
          <Button key="close" onClick={handleDocModalClose}>
            Close
          </Button>,
        ]}
        width={500}
      >
        <Row gutter={16} justify="center">
          {borrower.identificationImages.map((img, idx) => (
            <Col span={12} key={idx} style={{ textAlign: 'center', marginBottom: 16 }}>
              <Image
                src={img}
                alt={`ID File ${idx + 1}`}
                width={180}
                height={110}
                style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                placeholder
              />
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
};

export default ViewProperty;