import React, { useState } from "react";
import { Form, InputNumber, Button, Row, Col, Card, Typography, Divider, Tooltip } from "antd";
import { BankOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import { postRequest } from "@/hooks/apiService";
import { URL_ADD_COA } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";

const { Title, Text } = Typography;

const AddFundingAccountModal = ({ isVisible, onCancel, loading = false, branchData = [], jwt, FundingDataObject, CashFundingDataObject }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleRequestError,handleRequestResponse} = useHandleResponse()

  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };

  const dateFormat = "YYYY-MM-DD";

  const cashFundingData = CashFundingDataObject?.data;
  const cashFundingLoading = CashFundingDataObject?.loading;
  

  const handleSubmit = async (values) => {
    try {
      // Transform form data to match API format
      const apiPayload = {
        acc_parent_id: values.parentAccount ? parseInt(values.parentAccount) : 0,
        acc_code: values.code,
        acc_name: values.name,
        acc_branch_id: values.branch,
        opening_balance: values.openingBalance || 0,
        opening_balance_date:  values?.openingBalanceDate ? dayjs(values.openingBalanceDate).format(dateFormat) : dayjs().format(dateFormat),
        // acc_description: values.description || '',
      };

      // console.log('apiPayload',apiPayload);
      // return;
      
      setIsSubmitting(true);
      postRequest(URL_ADD_COA,{...apiPayload},jwt)
        .then((res) => {
          setIsSubmitting(false);
          handleRequestResponse(res)
          onCancel()
          FundingDataObject?.refetchEntity()
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
    <div className="add-funding-account-modal">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
        className="funding-account-form"
        initialValues={{
          openingBalance: 0,
          openingBalanceDate: dayjs()
        }}
      >
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

        <CustomSelect
          label="Branch"
          name="branch"
          placeholder="Select branch"
          options={branches}
          rules={[
            { required: true, message: 'Please select branch!' }
          ]}
        />

        {/* <CustomTextArea
          label="Description"
          name="description"
          placeholder="Account description (optional)"
          rows={3}
        /> */}

        
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
      `}</style>
    </div>
  );
};

export default AddFundingAccountModal;
