import { useEffect, useState } from "react";
import { Button, Form } from "antd";
import { getRequest, postRequest } from "@/hooks/apiService";
import { URL_ADD_SALARY } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";

const AddSalary = (props) => {
  const { jwt, setIsModalVisible, refetch, qryAttrPalyslipType, employee_id } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  const { toastError } = useToastMessage();

  // Generate payslip type options from API data
  const payslipTypeOptions = qryAttrPalyslipType?.map((item, index) => ({
    value: item?.attribute_id,
    label: item?.name
  })) || [];

  const onFinish = async (values) => {
    try {
      values['employee_id'] = employee_id;
      setIsloadingSubmit(true);
      
      const response = await postRequest(URL_ADD_SALARY, { ...values }, jwt);
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
      <Form onFinish={onFinish} form={form} name="addSalaryForm" size="middle" layout="vertical">
        
        {/* Payslip Type */}
        <CustomSelect
          label={
            <span>
              Payslip Type <span className="text-danger">*</span>
            </span>
          }
          name="payslip_type_id"
          placeholder="Select Payslip Type"
          options={payslipTypeOptions}
          rules={[
            {
              required: true,
              message: "Please select a payslip type!",
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
          placeholder="Enter salary amount"
          rules={[
            {
              required: true,
              message: "Please enter the salary amount!",
            },
            {
              pattern: /^\d+(\.\d{1,2})?$/,
              message: "Please enter a valid amount (e.g., 1000 or 1000.50)!",
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
              Save Salary
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default AddSalary;
