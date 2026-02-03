import { useEffect, useState } from "react";
import { Button, Form } from "antd";
import { getRequest, postRequest } from "@/hooks/apiService";
import { URL_ADD_ALLOWANCE, URL_ADD_COMMISSION, URL_ADD_SALARY } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";

const AddCommission = (props) => {
  const { jwt, setIsModalVisible, refetch, qryAttrPalyslipType, employee_id } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  const { toastError } = useToastMessage();

  // Define options for commission types
  const commissionTypeOptions = [
    { value: 'Fixed', label: 'Fixed' },
    { value: 'Percentage', label: 'Percentage' }
  ];

  const onFinish = async (values) => {
    try {
      values['employee_id'] = employee_id;
      setIsloadingSubmit(true);
      
      const response = await postRequest(URL_ADD_COMMISSION, { ...values }, jwt);
      setIsloadingSubmit(false);
      handleRequestResponse(response);
      setIsModalVisible(false);
      refetch();
    } catch (error) {
      setIsloadingSubmit(false);
      handleRequestError(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Form onFinish={onFinish} form={form} name="addCommissionForm" size="middle" layout="vertical">
        
        {/* Title */}
        <CustomInput
          label={
            <span>
              Title <span className="text-danger">*</span>
            </span>
          }
          name="title"
          placeholder="Enter commission title"
          rules={[
            {
              required: true,
              message: "Please enter the commission title!",
            },
            {
              min: 2,
              message: "Title must be at least 2 characters long!",
            },
            {
              max: 100,
              message: "Title cannot exceed 100 characters!",
            },
          ]}
          inputProps={{ maxLength: 100 }}
        />

        {/* Commission Type */}
        <CustomSelect
          label={
            <span>
              Type <span className="text-danger">*</span>
            </span>
          }
          name="amount_type"
          placeholder="Select Commission Type"
          options={commissionTypeOptions}
          rules={[
            {
              required: true,
              message: "Please select the commission type!",
            },
          ]}
        />

        {/* Amount */}
        <CustomInput
          label={
            <span>
              Amount <span className="text-danger">*</span>
            </span>
          }
          name="amount"
          placeholder="Enter commission amount"
          rules={[
            {
              required: true,
              message: "Please enter the commission amount!",
            },
            {
              pattern: /^\d+(\.\d{1,2})?$/,
              message: "Please enter a valid amount (e.g., 100 or 100.50)!",
            },
          ]}
          inputProps={{ 
            type: "number",
            step: "0.01",
            min: "0"
          }}
        />

        {/* Submit Button */}
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <Form.Item>
            <Button
              loading={isloadingSubmit}
              type="primary"
              htmlType="submit"
              size="large"
              style={{
                borderRadius: '8px',
                height: '40px',
                padding: '0 24px',
                fontWeight: '600'
              }}
            >
              Save Commission
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default AddCommission;
