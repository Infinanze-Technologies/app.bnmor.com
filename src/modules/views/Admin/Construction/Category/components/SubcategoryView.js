import React from 'react';
import { Card, Row, Col, Tag, Statistic, Divider, Typography, Space, Table } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, FolderOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SubcategoryView = ({ record, setIsModalVisible }) => {
  const subcategories = record?.subcategories || [];
  const activeSubcategories = subcategories.filter(subcategory => subcategory.status);
  const inactiveSubcategories = subcategories.filter(subcategory => !subcategory.status);

  return (
    <div style={{ padding: '20px' }}>
      {/* Summary Cards */}
      {/* <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ textAlign: 'center', background: '#f0f9ff', border: '1px solid #0ea5e9' }}>
            <Statistic
              title="Total Subcategories"
              value={subcategories.length}
              prefix={<FolderOutlined style={{ color: '#0ea5e9' }} />}
              valueStyle={{ color: '#0ea5e9' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ textAlign: 'center', background: '#f0fdf4', border: '1px solid #22c55e' }}>
            <Statistic
              title="Active Subcategories"
              value={activeSubcategories.length}
              prefix={<CheckCircleOutlined style={{ color: '#22c55e' }} />}
              valueStyle={{ color: '#22c55e' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ textAlign: 'center', background: '#fef2f2', border: '1px solid #ef4444' }}>
            <Statistic
              title="Inactive Subcategories"
              value={inactiveSubcategories.length}
              prefix={<CloseCircleOutlined style={{ color: '#ef4444' }} />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
      </Row> */}

      {/* <Divider /> */}

      {/* Subcategory Table */}
      {/* <Title level={4} style={{ marginBottom: '16px', color: '#374151' }}>
        Subcategory Details
      </Title> */}

      <Table
        dataSource={subcategories}
        columns={[
        //   {
        //     title: 'ID',
        //     dataIndex: 'id',
        //     key: 'id',
        //     width: 80,
        //     align: 'center',
        //     render: (text) => (
        //       <span style={{ 
        //         fontFamily: 'monospace', 
        //         fontSize: '12px',
        //         color: '#6b7280',
        //         fontWeight: '500'
        //       }}>
        //         {text}
        //       </span>
        //     )
        //   },
          {
            title: 'Subcategory Name',
            dataIndex: 'subcategory_name',
            key: 'subcategory_name',
            render: (text) => (
              <Text strong style={{ fontSize: '14px', color: '#374151' }}>
                {text}
              </Text>
            )
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            align: 'center',
            render: (status) => (
              <Tag color={status ? 'green' : 'red'}>
                {status ? 'Active' : 'Inactive'}
              </Tag>
            )
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
            render: (text) => (
              <Text style={{ fontSize: '13px', color: '#6b7280' }}>
                {text || 'No description available'}
              </Text>
            )
          },
         
        ]}
        rowKey="id"
        scroll={{ x: 700 }}
        pagination={false}
        size="small"
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}
        locale={{
          emptyText: (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px dashed #d1d5db'
            }}>
              <FolderOutlined style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '16px' }} />
              <Title level={4} style={{ color: '#6b7280', margin: 0 }}>
                No Subcategories Found
              </Title>
              <Text type="secondary">
                This category doesn't have any subcategories defined yet.
              </Text>
            </div>
          )
        }}
      />
    </div>
  );
};

export default SubcategoryView;
