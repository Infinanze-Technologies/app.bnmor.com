import React, { useState, useEffect } from "react";
import { Form, InputNumber, Button, Card, Typography, Alert } from "antd";
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import CustomDatePicker from "@/components/form/CustomDatePicker";
import { updateRequest } from "@/hooks/apiService";
import { URL_UPDATE_PARENT_FUNDING_BALANCE } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";

const { Title, Text } = Typography;
const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };
const dateFormat = "YYYY-MM-DD";

const EditParentAccountModal = ({ 
  isVisible, 
  onCancel, 
  loading = false, 
  accountData = null, 
  jwt, 
  FundingDataObject 
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();

  console.log('Parent accountData', accountData);

  useEffect(() => {
    if (accountData && isVisible) {
      // Handle opening balance - convert to number safely
      let openingBalance = 0;
      if (accountData.openingBalance) {
        if (typeof accountData.openingBalance === 'string') {
          openingBalance = parseFloat(accountData.openingBalance.replace(/[GH¢,\s]/g, '') || '0');
        } else if (typeof accountData.openingBalance === 'number') {
          openingBalance = accountData.openingBalance;
        }
      }

      // Handle opening balance date - convert to dayjs safely
      let openingBalanceDate = dayjs();
      if (accountData.openingBalanceDate) {
        openingBalanceDate = dayjs(accountData.openingBalanceDate);
      }

      form.setFieldsValue({
        openingBalance: openingBalance,
        openingBalanceDate: openingBalanceDate,
      });
    }
  }, [accountData, isVisible, form]);

  const handleSubmit = async (values) => {
    try {
      // Transform form data to match API format - only opening balance and date
      const apiPayload = {
        opening_balance: values.openingBalance || 0,
        opening_balance_date: typeof(values.openingBalanceDate) == 'undefined' 
          ? dayjs(accountData.opening_balance_date).format(dateFormat) 
          : dayjs(values.openingBalanceDate).format(dateFormat),
      };

      setIsSubmitting(true);

      await updateRequest(URL_UPDATE_PARENT_FUNDING_BALANCE, Number(accountData?.key), {...apiPayload}, jwt)
        .then((res) => {
          setIsSubmitting(false);
          handleRequestResponse(res);
          FundingDataObject?.refetchEntity();
          onCancel();
        }).finally(() => {
          setIsSubmitting(false);
        })
        .catch((err) => {
          handleRequestError(err);  
          setIsSubmitting(false);
        });
   
    } catch (error) {
      setIsSubmitting(false);
      handleRequestError(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-parent-account-modal">
      <Card className="mb-3">
        <div className="d-flex align-items-center mb-3">
          <EditOutlined style={{ fontSize: '1.5rem', color: '#52c41a', marginRight: '12px' }} />
          <div>
            <Title level={4} className="mb-1">Edit Opening Balance</Title>
            <Text type="secondary">Update opening balance for parent account</Text>
          </div>
        </div>
      </Card>

      <Alert
        message="Parent Account - Limited Editing"
        description="This is a parent account. Only the opening balance and date can be modified to maintain account hierarchy integrity."
        type="info"
        icon={<ExclamationCircleOutlined />}
        className="mb-3"
      />

      {/* Account Information Display */}
      <Card className="mb-3" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="row">
          <div className="col-md-4">
            <Text strong>Account Name:</Text>
            <br />
            <Text>{accountData?.name}</Text>
          </div>
          <div className="col-md-4">
            <Text strong>Account Code:</Text>
            <br />
            <Text>{accountData?.code}</Text>
          </div>
          <div className="col-md-4">
            <Text strong>Account Type:</Text>
            <br />
            <Text>{accountData?.accountType}</Text>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-6">
            <Text strong>Branch:</Text>
            <br />
            <Text>{accountData?.branchName || 'Main Branch'}</Text>
          </div>
          <div className="col-md-6">
            <Text strong>Current Opening Balance:</Text>
            <br />
            <Text className="text-success" strong>
              {accountData?.openingBalance || '0.00'}
            </Text>
          </div>
        </div>
      </Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
        className="parent-account-form"
      >
        <Form.Item
          label="Opening Balance"
          name="openingBalance"
          rules={[
            { required: true, message: 'Please enter opening balance!' },
            { type: 'number', min: 0, message: 'Opening balance must be a positive number!' }
          ]}
        >
          <InputNumber
            placeholder="0.00"
            min={0}
            precision={2}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            style={{ width: '100%' }}
            size="large"
          />
        </Form.Item>

        <CustomDatePicker
          label="Opening Balance Date"
          name="openingBalanceDate"
          placeholder="Select opening balance date"
          format="DD MMMM, YYYY"
          rules={[
            { required: true, message: 'Please select opening balance date!' }
          ]}
          datePickerProps={{
            format: dateFormat,
            style: FIELD_STYLE,
            allowClear: false
          }}
        />

        <div className="d-flex justify-content-end mt-4">
          <div className='submit-button'>
            <Form.Item>
              <Button
                loading={isSubmitting || loading}
                type="primary"
                htmlType="submit"
                size="large"
                style={{ minWidth: 120 }}
              >
                Update Balance
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>

      <style jsx>{`
        .parent-account-form .ant-form-item-label > label {
          font-weight: 600;
          color: #333;
        }
        
        .parent-account-form .ant-input,
        .parent-account-form .ant-input-number,
        .parent-account-form .ant-picker {
          border-radius: 6px;
          border: 1px solid #d9d9d9;
        }
        
        .parent-account-form .ant-input:focus,
        .parent-account-form .ant-input-number:focus,
        .parent-account-form .ant-picker-focused {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        
        .submit-button .ant-btn {
          background: #52c41a;
          border-color: #52c41a;
          border-radius: 6px;
          font-weight: 600;
        }
        
        .submit-button .ant-btn:hover {
          background: #73d13d;
          border-color: #73d13d;
        }
      `}</style>
    </div>
  );
};

export default EditParentAccountModal;
