import { useEffect, useState } from "react";
import { Button, Form } from "antd";
import { URL_UPDATE_SALARY } from "@/config/api-paths";
import { getRequest, updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";

const EditSalary = (props) => {
  const { jwt, setIsModalVisible, record, refetch, qryAttrPalyslipType, employee_id } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const { toastError } = useToastMessage();

  // Generate payslip type options from API data
  const payslipTypeOptions = qryAttrPalyslipType?.map((item, index) => ({
    value: item?.attribute_id,
    label: item?.name
  })) || [];

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
      
      const response = await updateRequest(URL_UPDATE_SALARY, record?.salary_id, { ...values }, jwt);
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
      <Form onFinish={onFinish} form={form} name="editSalaryForm" size="middle" layout="vertical">
        
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
              Update Salary
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default EditSalary;
