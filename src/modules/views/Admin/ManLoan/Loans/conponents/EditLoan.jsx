import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, DatePicker, Row, Col } from 'antd';
import { URL_UPDATE_LOAN } from '@/config/api-paths';
import { updateRequest } from '@/hooks/apiService';
import useHandleResponse from '@/hooks/useHandleResponse';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const EditLoan = ({ setIsModalVisible, jwt, record, refetch }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        loan_amount: record.loan_amount,
        loan_duration: record.loan_duration,
        interest_rate: record.interest_rate,
        interest_method: record.interest_method,
        installment_amount: record.installment_amount,
        loan_release_date: record.loan_release_date ? moment(record.loan_release_date) : null,
        remarks: record.remarks || ''
      });
    }
  }, [record, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        loan_release_date: values.loan_release_date ? values.loan_release_date.format('YYYY-MM-DD') : null
      };

      const response = await updateRequest(URL_UPDATE_LOAN, record.loan_id, formattedValues, jwt);
      handleRequestResponse(response);
      refetch();
      setIsModalVisible(false);
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Loan Amount"
              name="loan_amount"
              rules={[{ required: true, message: 'Please enter loan amount' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `₵ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/₵\s?|(,*)/g, '')}
                placeholder="Enter loan amount"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Interest Rate (%)"
              name="interest_rate"
              rules={[{ required: true, message: 'Please enter interest rate' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={100}
                step={0.01}
                placeholder="Enter interest rate"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Interest Method"
              name="interest_method"
              rules={[{ required: true, message: 'Please select interest method' }]}
            >
              <Select placeholder="Select interest method">
                <Option value="Flat">Flat Interest</Option>
                <Option value="Reducing Balance">Reducing Balance</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Installment Amount"
              name="installment_amount"
              rules={[{ required: true, message: 'Please enter installment amount' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `₵ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/₵\s?|(,*)/g, '')}
                placeholder="Enter installment amount"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Loan Release Date"
              name="loan_release_date"
              rules={[{ required: true, message: 'Please select release date' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Select release date"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Remarks" name="remarks">
              <TextArea rows={4} placeholder="Enter any additional remarks" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px',
          marginTop: '24px'
        }}>
          <Button 
            onClick={() => setIsModalVisible(false)}
            size="large"
            style={{ minWidth: '100px', height: '40px' }}
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={loading}
            size="large"
            style={{ minWidth: '100px', height: '40px' }}
          >
            Update Loan
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditLoan;