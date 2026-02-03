import { useEffect, useState } from "react";
import { Button, Form } from "antd";
import { URL_UPDATE_ALLOWANCE, URL_UPDATE_COMMISSION, URL_UPDATE_OTHERPAYMENT, URL_UPDATE_SALARY } from "@/config/api-paths";
import { getRequest, updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";

const EditOtherPayment = (props) => {
  const { jwt, setIsModalVisible, record, refetch, qryAttrPalyslipType, employee_id } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const { toastError } = useToastMessage();

  // Define options for payment types
  const paymentTypeOptions = [
    { value: 'Fixed', label: 'Fixed' },
    { value: 'Percentage', label: 'Percentage' }
  ];

  useEffect(() => {
    try {
      if (record) {
        form.setFieldsValue({
          ...record,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [record, form]);

  const onFinish = async (values) => {
    try {
      values['employee_id'] = employee_id;
      setIsloadingSubmit(true);
      
      const response = await updateRequest(URL_UPDATE_OTHERPAYMENT, record?.other_payment_id, { ...values }, jwt);
      setIsloadingSubmit(false);
      handleRequestResponse(response);
      refetch();
      setIsModalVisible(false);
    } catch (error) {
      setIsloadingSubmit(false);
      handleRequestError(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Form onFinish={onFinish} form={form} name="editOtherPaymentForm" size="middle" layout="vertical">
        
        {/* Title */}
        <CustomInput
          label={
            <span>
              Title <span className="text-danger">*</span>
            </span>
          }
          name="title"
          placeholder="Enter payment title"
          rules={[
            {
              required: true,
              message: "Please enter the payment title!",
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

        {/* Payment Type */}
        <CustomSelect
          label={
            <span>
              Type <span className="text-danger">*</span>
            </span>
          }
          name="amount_type"
          placeholder="Select Payment Type"
          options={paymentTypeOptions}
          rules={[
            {
              required: true,
              message: "Please select the payment type!",
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
          placeholder="Enter payment amount"
          rules={[
            {
              required: true,
              message: "Please enter the payment amount!",
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
              Update Payment
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default EditOtherPayment;
