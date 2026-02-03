import React, { useState, useEffect } from "react";
import { Form, InputNumber, Button, Row, Col, Card, Typography, Divider, Alert, Tooltip } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import { updateRequest } from "@/hooks/apiService";
import { URL_UPDATE_COA } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";

const { Title, Text } = Typography;
const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };
const dateFormat = "YYYY-MM-DD";


    const EditFundingAccountModal = ({ isVisible, onCancel, loading = false, accountData = null, branchData = [], jwt, FundingDataObject, CashFundingDataObject }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  // Fetch cash funding accounts for parent account selection
  const cashFundingData = CashFundingDataObject?.data;
  const cashFundingLoading = CashFundingDataObject?.loading;

   console.log('accountData', accountData);

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
        code: accountData.code,
        name: accountData.name,
        accountType: accountData.acc_type,
        openingBalance: openingBalance,
        openingBalanceDate: openingBalanceDate,
        branch: accountData.branch,
        parentAccount: accountData.parentKey || '',
        description: accountData.acc_description || ''
      });
    }
  }, [accountData, isVisible, form]);

  const handleSubmit = async (values) => {
   
    try {
      // Transform form data to match API format
      const apiPayload = {
        acc_parent_id: values.parentAccount ? parseInt(values.parentAccount) : 0,
        acc_code: values.code,
        acc_name: values.name,
        acc_branch_id: values.branch,
        opening_balance: values.openingBalance || 0,
        opening_balance_date: typeof(values.openingBalanceDate) == 'undefined' ? dayjs(accountData.opening_balance_date).format(dateFormat) : dayjs(values.openingBalanceDate).format(dateFormat),
      }

      // console.log('====================================');
      // console.log(apiPayload);
      // console.log('====================================');
      // return;
      setIsSubmitting(true);

      await updateRequest(URL_UPDATE_COA,Number(accountData?.key),{...apiPayload},jwt)
        .then((res) => {
          setIsSubmitting(false);
          handleRequestResponse(res)
          FundingDataObject?.refetchEntity()
          onCancel()
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



  // Transform cash funding accounts data for parent account selection
  const parentAccounts = [
    ...(cashFundingData || []).map(account => ({
      value: account.id.toString(),
      label: `${account.acc_name} (${account.acc_code})`
    }))
  ];

  // Transform branch data from API to dropdown options
  const branches = branchData && branchData.length > 0 
    ? branchData.map(branch => ({
        value: branch.branch_id || branch.branch_id || branch.code,
        label: branch.name || branch.branch_name || branch.title
      }))
    : [
        { value: 'main', label: 'Main Branch' },
        { value: 'accra', label: 'Accra Branch' },
        { value: 'kumasi', label: 'Kumasi Branch' },
        { value: 'tema', label: 'Tema Branch' }
      ];

  return (
    <div className="edit-funding-account-modal">
      <Card className="mb-3">
        <div className="d-flex align-items-center mb-3">
          <EditOutlined style={{ fontSize: '1.5rem', color: '#52c41a', marginRight: '12px' }} />
          <div>
            <Title level={4} className="mb-1">Edit Funding Account</Title>
            <Text type="secondary">Update account information and settings</Text>
          </div>
        </div>
      </Card>

      {accountData?.isParent && (
        <Alert
          message="Parent Account"
          description="This is a parent account. Only opening balance and date can be modified. Other fields are locked to maintain account hierarchy."
          type="warning"
          icon={<ExclamationCircleOutlined />}
          className="mb-3"
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
        className="funding-account-form"
      >
        {!accountData?.isParent && (
          <>
            <CustomSelect
              label="Parent Account (optional)"
              name="parentAccount"
              placeholder={cashFundingLoading ? "Loading accounts..." : "None"}
              loading={cashFundingLoading}
              options={parentAccounts}
            />

            <CustomInput
              label="Account Name"
              name="name"
              placeholder="account name"
              rules={[
                { required: true, message: 'Please enter account name!' }
              ]}
            />

            <CustomInput
              label="Code"
              name="code"
              placeholder="code"
              rules={[
                { required: true, message: 'Please enter account code!' }
              ]}
            />

            <CustomSelect
              label="Branch"
              name="branch"
              placeholder="Select branch"
              options={branches}
              rules={[
                { required: true, message: 'Please select branch!' }
              ]}
            />
          </>
        )}

        {accountData?.isParent && (
          <>
            <div className="mb-3">
              <Text strong>Account Name: </Text>
              <Text>{accountData.name}</Text>
            </div>
            <div className="mb-3">
              <Text strong>Account Code: </Text>
              <Text>{accountData.code}</Text>
            </div>
            <div className="mb-3">
              <Text strong>Branch: </Text>
              <Text>{accountData.branchName || 'Main Branch'}</Text>
            </div>
          </>
        )}

        <Form.Item
          label="Opening Balance"
          name="openingBalance"
          rules={[
            { required: true, message: 'Please enter opening balance!' }
          ]}
        >
          <InputNumber
            placeholder="0"
            min={0}
            precision={2}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            style={{ width: '100%' }}
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

        <div className="d-flex justify-content-end">
            <div className='submit-button'>
              <Form.Item>
                <Button
                  loading={isSubmitting || loading}
                  type="round"
                  htmlType="submit"
                >
                  Save
                </Button>
              </Form.Item>
              </div>
            </div>
      </Form>

      <style jsx>{`
        .funding-account-form .ant-form-item-label > label {
          font-weight: 600;
          color: #333;
        }
        
        .funding-account-form .ant-input,
        .funding-account-form .ant-select-selector,
        .funding-account-form .ant-picker {
          border-radius: 6px;
          border: 1px solid #d9d9d9;
        }
        
        .funding-account-form .ant-input:focus,
        .funding-account-form .ant-select-focused .ant-select-selector,
        .funding-account-form .ant-picker-focused {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        
        .save-button {
          background: #1890ff;
          border-color: #1890ff;
          border-radius: 6px;
          min-width: 120px;
          height: 40px;
          font-weight: 600;
        }
        
        .save-button:hover {
          background: #40a9ff;
          border-color: #40a9ff;
        }
        
        .funding-account-form .ant-input[disabled],
        .funding-account-form .ant-select-disabled .ant-select-selector {
          background-color: #f5f5f5;
          color: #999;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default EditFundingAccountModal;
