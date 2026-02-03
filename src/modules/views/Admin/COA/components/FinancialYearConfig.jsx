import React, { useState } from "react";
import { Button, DatePicker, Form, Card, Row, Col, Alert } from "antd";
import { CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const FinancialYearConfig = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  
  const { jwt } = props;

  const handleSave = async (values) => {
    setIsLoading(true);
    try {
      console.log('Financial Year Config:', values);
      // Implement API call to save financial year configuration
      // await saveFinancialYearConfig(values, jwt);
    } catch (error) {
      console.error('Error saving financial year config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <Row justify="center">
        <Col xs={24} sm={24} md={20} lg={16} xl={12}>
          <Card 
            title={
              <div className="d-flex align-items-center">
                <CalendarOutlined className="me-2" />
                <span>Financial Year Configuration</span>
              </div>
            }
            className="shadow-sm"
          >
            <Alert
              message="Important Notice"
              description="This configuration will apply across all branches and affect accounting and reporting periods."
              type="info"
              icon={<InfoCircleOutlined />}
              showIcon
              className="mb-4"
            />
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={{
                financialYear: dayjs('2025-01-01')
              }}
              size="large"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={16}>
                  <Form.Item
                    label="Financial Year Start Date"
                    name="financialYear"
                    rules={[
                      { required: true, message: 'Please select financial year start date!' }
                    ]}
                    tooltip="Select the date when your financial year begins"
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD MMMM, YYYY"
                      placeholder="Select Financial Year Start Date"
                      suffixIcon={<CalendarOutlined />}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={24} md={8} className="d-flex align-items-end">
                  <Form.Item className="w-100">
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      loading={isLoading}
                      size="large"
                      className="w-100"
                      icon={<CalendarOutlined />}
                    >
                      {isLoading ? 'Saving...' : 'Save Configuration'}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
      
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FinancialYearConfig;
