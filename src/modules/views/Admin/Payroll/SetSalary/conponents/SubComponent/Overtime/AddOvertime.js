import { useEffect, useState } from "react";
import { Button, Form, InputNumber } from "antd";
import { getRequest, postRequest } from "@/hooks/apiService";
import { URL_ADD_ALLOWANCE, URL_ADD_COMMISSION, URL_ADD_OVERTIME, URL_ADD_SALARY } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import CustomInput from "@/components/form/CustomInput";

const AddOvertime = (props) => {
  const { jwt, setIsModalVisible, refetch, qryAttrPalyslipType, employee_id } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  const { toastError } = useToastMessage();

  const onFinish = async (values) => {
    try {
      values['employee_id'] = employee_id;
      setIsloadingSubmit(true);
      
      const response = await postRequest(URL_ADD_OVERTIME, { ...values }, jwt);
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
      <Form onFinish={onFinish} form={form} name="addOvertimeForm" size="middle" layout="vertical">
        
        {/* Title */}
        <CustomInput
          label={
            <span>
              Title <span className="text-danger">*</span>
            </span>
          }
          name="title"
          placeholder="Enter overtime title"
          rules={[
            {
              required: true,
              message: "Please enter the overtime title!",
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

        {/* Number of Days */}
        <Form.Item
          label={
            <span>
              Number of Days <span className="text-danger">*</span>
            </span>
          }
          name="num_of_days"
          rules={[
            {
              required: true,
              message: "Please enter the number of days!",
            },
            {
              type: 'number',
              min: 0,
              message: "Number of days must be 0 or greater!",
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%', height: '50px', borderRadius: '10px' }}
            placeholder="Enter number of days"
            min={0}
            step={0.5}
          />
        </Form.Item>

        {/* Hours */}
        <Form.Item
          label={
            <span>
              Hours <span className="text-danger">*</span>
            </span>
          }
          name="hours"
          rules={[
            {
              required: true,
              message: "Please enter the hours!",
            },
            {
              type: 'number',
              min: 0,
              message: "Hours must be 0 or greater!",
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%', height: '50px', borderRadius: '10px' }}
            placeholder="Enter hours"
            min={0}
            step={0.5}
          />
        </Form.Item>

        {/* Rate */}
        <Form.Item
          label={
            <span>
              Rate <span className="text-danger">*</span>
            </span>
          }
          name="amount"
          rules={[
            {
              required: true,
              message: "Please enter the rate!",
            },
            {
              type: 'number',
              min: 0,
              message: "Rate must be 0 or greater!",
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%', height: '50px', borderRadius: '10px' }}
            placeholder="Enter rate per hour"
            min={0}
            step={0.01}
            formatter={value => `₵ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/₵\s?|(,*)/g, '')}
          />
        </Form.Item>

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
              Save Overtime
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default AddOvertime;
