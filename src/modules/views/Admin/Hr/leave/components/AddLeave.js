import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card
} from "antd";
import { postRequest } from "@/hooks/apiService";
import {URL_ADD_LEAVE } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs'

import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const dateFormat = 'YYYY-MM-DD';

const AddLeave = (props) => {
  const { jwt, setIsModalVisible, refetch,forceRefetch,qryEmployeeData,qryAttrData } = props;
   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };

  // attribute_id

  const onFinish =  async (values) => {
    try {

      let data = {
        "start_date":values?.start_date ? dayjs(values.start_date).format(dateFormat) : dayjs().format(dateFormat),
        "end_date":values?.end_date ? dayjs(values.end_date).format(dateFormat) : dayjs().format(dateFormat),
        "reason": values?.reason,
        "employee_id": values?.employee_id,
        "leave_type_id": values?.leave_type_id,
  
      }

      setIsloadingSubmit(true);
      postRequest(URL_ADD_LEAVE,{...data},jwt)
        .then(async (res) => {
          setIsloadingSubmit(false);
          handleRequestResponse(res)
          setIsModalVisible(false);
          await forceRefetch()
        }).finally(() => {
       
          setIsloadingSubmit(false);
        })
        .catch((err) => {
          handleRequestError(err);
        
          
        });
      
    } catch (error) {
      setIsloadingSubmit(false);
      console.log(error)
      
    }
  
  };





  return (
    <>
      <Form
        form={form}
        name="addLeave"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Add Leave" style={{ marginBottom: 24, borderRadius: 8 }}>
          <Row gutter={16}>
            <Col span={12} xs={24} md={24}>
              <CustomSelect
                label="Employee"
                name="employee_id"
                placeholder="Select Employee"
                options={qryEmployeeData?.map((item) => ({
                  value: item?.employee_id,
                  label: item?.fullname,
                }))}
                rules={[
                  {
                    required: true,
                    message: "Please input your employee!",
                  },
                ]}
             
              />
            </Col>

            <Col span={12} xs={24} md={24}>
              <CustomSelect
                label="Leave Type"
                name="leave_type_id"
                placeholder="Select Leave Type"
                options={qryAttrData?.map((item) => ({
                  value: item?.attribute_id,
                  label: item?.name,
                }))}
                rules={[
                  {
                    required: true,
                    message: "Please input your leave type!",
                  },
                ]}
              
              />
            </Col>

            <Col span={12} xs={24} md={24}>
              <CustomDatePicker
                label="Start Date"
                name="start_date"
                placeholder="Select start date"
                rules={[
                  {
                    required: true,
                    message: "Please input your start date!",
                  },
                ]}
                datePickerProps={{
                  format: dateFormat,
                  style: FIELD_STYLE,
                  allowClear: false
                
                }}
              />

            </Col>

            <Col span={12} xs={24} md={24}>
              <CustomDatePicker
                label="End Date"
                name="end_date"
                placeholder="Select end date"
                rules={[
                  {
                    required: true,
                    message: "Please input your end date!",
                  },
                ]}
                datePickerProps={{
                  format: dateFormat,
                  style: FIELD_STYLE,
                  allowClear: false
                }}
              />
          
            </Col>

            <Col span={24} xs={24} md={24}>
              <CustomTextArea
                label="Reason"
                name="reason"
                placeholder="Enter leave reason"
                rules={[
                  {
                    required: true,
                    message: "Please input your reason!",
                  },
                ]}
                textAreaProps={{
                  rows: 6,
              
                }}
              />
            </Col>

            <Col span={24} xs={24} md={24}>
              <div className="d-flex justify-content-end">
                <div className="d-grid">
                  <div className="d-flex justify-content-end submit_buttom mt-4 w-100">
                    <Form.Item>
                    
                    <Button
              {...BUTTON_CONFIGS.SAVE_BUTTON()}
              htmlType="submit"
              loading={isloadingSubmit}
              size="small"
              shape="round"
           
            >
             Save
            </Button>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Form>
    </>
  );
};

export default AddLeave;
