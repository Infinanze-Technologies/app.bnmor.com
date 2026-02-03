import { useEffect, useState } from "react";
import { Button, Row, Col, Card, Typography, Space, Divider, Breadcrumb, Form } from "antd";
import { ArrowLeftOutlined, DollarOutlined, GiftOutlined, ClockCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getRequest, postRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import Router from 'next/router';
import SalaryTable from "./SubComponent/Salary/SalaryTable";
import OvertimeTable from "./SubComponent/Overtime/OvertimeTable";
import AllowanceTable from "./SubComponent/Allowance/AllowanceTable";
import CommissionTable from "./SubComponent/Commission/CommissionTable";
import SaturationDeductionTable from "./SubComponent/SaturationDeduction/SaturationDeductionTable";
import OtherPaymentTable from "./SubComponent/OtherPayment/OtherPaymentTable";

const { Title, Text } = Typography;

const SetSalary = (props) => {
  let { employee_id, session } = props;
  let jwt = session?.jwt;

  const [form] = Form.useForm();

  const handleGoBack = () => {
    Router.back();
  };

  return (
    <div className="set-salary-container">
      {/* Modern Header Section */}
      <div 
        style={{ 
          marginBottom: '32px',
          padding: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(50px, -50px)'
          }}
        />
        
        {/* Header Content */}
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} sm={16} md={18}>
            <div style={{ color: 'white' }}>
              <Title level={2} style={{ color: 'white', margin: '0 0 8px 0', fontWeight: '700' }}>
                💰 Employee Salary Management
              </Title>
              <Text style={{ fontSize: '16px', opacity: 0.9, display: 'block', marginBottom: '8px',color:'white' }}>
                Configure comprehensive salary structure for employee ID: <strong>{employee_id}</strong>
              </Text>
              <Text style={{ fontSize: '14px', opacity: 0.8,color:'white' }}>
                Manage basic salary, allowances, commissions, overtime, deductions, and other payments
              </Text>
            </div>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <div style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<ArrowLeftOutlined />}
                onClick={handleGoBack}
                size="large"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '12px',
                  height: '48px',
                  padding: '0 24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                Go Back
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '24px' }}>
        <Breadcrumb
          items={[
            { title: <a href="#" style={{ color: '#667eea' }}>Dashboard</a> },
            { title: <a href="#" style={{ color: '#667eea' }}>Payroll</a> },
            { title: <a href="#" style={{ color: '#667eea' }}>Salary Management</a> },
            { title: <span style={{ color: '#666' }}>Set Employee Salary</span> }
          ]}
          style={{
            padding: '16px 24px',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}
        />
      </div>

      {/* Salary Configuration Grid */}
      <Row gutter={[24, 24]}>
        {/* Basic Salary Section */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <DollarOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#262626' }}>
                  Basic Salary Configuration
                </span>
              </Space>
            }
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '2px solid #f0f0f0',
              height: '100%'
            }}
            headStyle={{
              background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
              borderBottom: '2px solid #b7eb8f',
              borderRadius: '16px 16px 0 0',
              padding: '20px 24px'
            }}
          >
            <div style={{ minHeight: '300px' }}>
              <SalaryTable employee_id={employee_id} jwt={jwt} />
            </div>
          </Card>
        </Col>

        {/* Allowance Section */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <GiftOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#262626' }}>
                  Allowance Management
                </span>
              </Space>
            }
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '2px solid #f0f0f0',
              height: '100%'
            }}
            headStyle={{
              background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
              borderBottom: '2px solid #91d5ff',
              borderRadius: '16px 16px 0 0',
              padding: '20px 24px'
            }}
          >
            <div style={{ minHeight: '300px' }}>
              <AllowanceTable employee_id={employee_id} jwt={jwt} />
            </div>
          </Card>
        </Col>

        {/* Commission Section */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <PlusOutlined style={{ color: '#722ed1', fontSize: '20px' }} />
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#262626' }}>
                  Commission Structure
                </span>
              </Space>
            }
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '2px solid #f0f0f0',
              height: '100%'
            }}
            headStyle={{
              background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
              borderBottom: '2px solid #d3adf7',
              borderRadius: '16px 16px 0 0',
              padding: '20px 24px'
            }}
          >
            <div style={{ minHeight: '300px' }}>
              <CommissionTable employee_id={employee_id} jwt={jwt} />
            </div>
          </Card>
        </Col>

        {/* Overtime Section */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#fa8c16', fontSize: '20px' }} />
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#262626' }}>
                  Overtime Configuration
                </span>
              </Space>
            }
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '2px solid #f0f0f0',
              height: '100%'
            }}
            headStyle={{
              background: 'linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)',
              borderBottom: '2px solid #ffd591',
              borderRadius: '16px 16px 0 0',
              padding: '20px 24px'
            }}
          >
            <div style={{ minHeight: '300px' }}>
              <OvertimeTable employee_id={employee_id} jwt={jwt} />
            </div>
          </Card>
        </Col>

        {/* Saturation Deduction Section */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <MinusCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#262626' }}>
                  Deduction Management
                </span>
              </Space>
            }
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '2px solid #f0f0f0',
              height: '100%'
            }}
            headStyle={{
              background: 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)',
              borderBottom: '2px solid #ffa39e',
              borderRadius: '16px 16px 0 0',
              padding: '20px 24px'
            }}
          >
            <div style={{ minHeight: '300px' }}>
              <SaturationDeductionTable employee_id={employee_id} jwt={jwt} />
            </div>
          </Card>
        </Col>

        {/* Other Payment Section */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <PlusOutlined style={{ color: '#13c2c2', fontSize: '20px' }} />
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#262626' }}>
                  Additional Payments
                </span>
              </Space>
            }
            style={{
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '2px solid #f0f0f0',
              height: '100%'
            }}
            headStyle={{
              background: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)',
              borderBottom: '2px solid #87e8de',
              borderRadius: '16px 16px 0 0',
              padding: '20px 24px'
            }}
          >
            <div style={{ minHeight: '300px' }}>
              <OtherPaymentTable employee_id={employee_id} jwt={jwt} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Custom CSS for enhanced styling */}
      <style jsx>{`
        .set-salary-container {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }
        
        @media (max-width: 768px) {
          .set-salary-container {
            padding: 16px;
          }
        }
        
        .ant-card {
          transition: all 0.3s ease;
        }
        
        .ant-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12) !important;
        }
      `}</style>


    </div>
  );
};

export default SetSalary;
