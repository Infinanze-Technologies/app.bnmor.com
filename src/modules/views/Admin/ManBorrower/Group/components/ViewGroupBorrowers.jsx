import React, { useState, useEffect } from "react";
import { 
  Button, 
  Table, 
  Space, 
  Typography, 
  Card,
  Row,
  Col,
  Avatar,
  Tag,
  Spin
} from "antd";
import { UserOutlined, CloseOutlined, TeamOutlined } from '@ant-design/icons';
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const { Title, Text } = Typography;

const ViewGroupBorrowers = (props) => {
  const { setIsModalVisible, groupRecord, borrowersData } = props;

  // Table columns for displaying borrowers
  const columns = [
    {
      title: 'ID',
      key: 'id',
      width: 80,
      render: (text, record, index) => (
        <span style={{ 
          fontFamily: 'monospace', 
          fontSize: '0.8rem',
          color: '#4D4D4D',
          fontWeight: '500'
        }}>
          {index + 1}
        </span>
      ),
    },
    {
      title: 'Borrower Details',
      key: 'borrower',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: '#4D4D4D',
              marginRight: '12px'
            }}
          />
          <div>
            <div style={{ 
              fontWeight: '600', 
              color: '#4D4D4D',
              fontSize: '1rem',
              marginBottom: '2px'
            }}>
              {record.borrower?.fullname || 'N/A'}
            </div>
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#8B8B8B',
              fontFamily: 'monospace'
            }}>
              ID: {record.borrower_id}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Added Date',
      key: 'created_at',
      width: 150,
      render: (text, record) => (
        <Text style={{ fontSize: '0.9rem', color: '#4D4D4D' }}>
          {new Date(record.created_at).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (text, record) => (
        <Tag 
          color="success" 
          style={{ 
            borderRadius: '4px',
            fontWeight: '500'
          }}
        >
          Active
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card 
        style={{ 
          marginBottom: '20px',
          border: '1px solid rgba(77, 77, 77, 0.1)',
          borderRadius: '8px'
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Title level={4} style={{ margin: 0, color: '#4D4D4D' }}>
              <TeamOutlined style={{ marginRight: '8px', color: '#6B6B6B' }} />
              Group Borrowers
            </Title>
            <Text type="secondary">
              Borrowers in "{groupRecord?.name}" group
            </Text>
          </Col>
          <Col>
            <Text strong style={{ color: '#4D4D4D' }}>
              {borrowersData?.length || 0} member{borrowersData?.length !== 1 ? 's' : ''}
            </Text>
          </Col>
        </Row>
      </Card>

      <Card style={{ 
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        border: '1px solid rgba(77, 77, 77, 0.08)',
        borderRadius: '12px'
      }}>
        <div style={{ 
          maxHeight: '400px', 
          overflowY: 'auto',
          borderRadius: '8px',
          border: '1px solid rgba(77, 77, 77, 0.08)',
          background: '#ffffff'
        }}>
          <Table
            dataSource={borrowersData || []}
            columns={columns}
            rowKey="id"
            pagination={false}
            loading={false}
            locale={{
              emptyText: (
                <div style={{ 
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#8B8B8B'
                }}>
                  <TeamOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                  <div>No borrowers in this group</div>
                </div>
              )
            }}
            size="middle"
            style={{
              background: '#ffffff'
            }}
            rowStyle={{
              borderBottom: '1px solid rgba(77, 77, 77, 0.05)'
            }}
          />
        </div>
      </Card>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        padding: '16px 0',
        borderTop: '1px solid rgba(77, 77, 77, 0.1)'
      }}>
        <Button 
          onClick={() => setIsModalVisible(false)}
          style={{ 
            border: '1px solid #d9d9d9',
            color: '#4D4D4D',
            borderRadius: '6px',
            height: '40px',
            padding: '0 20px'
          }}
          icon={<CloseOutlined />}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ViewGroupBorrowers;
