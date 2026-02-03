import { useEffect, useState } from "react";
import { Button, Form, InputNumber } from "antd";
import { URL_UPDATE_ALLOWANCE, URL_UPDATE_COMMISSION, URL_UPDATE_OVERTIME, URL_UPDATE_SALARY } from "@/config/api-paths";
import { getRequest, updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import CustomInput from "@/components/form/CustomInput";

const EditOvertime = (props) => {
  const { jwt, setIsModalVisible, record, refetch, qryAttrPalyslipType, employee_id } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const { toastError } = useToastMessage();

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
      
      const response = await updateRequest(URL_UPDATE_OVERTIME, record?.overtime_id, { ...values }, jwt);
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
      <Form onFinish={onFinish} form={form} name="editOvertimeForm" size="middle" layout="vertical">
        
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
              Update Overtime
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default EditOvertime;
