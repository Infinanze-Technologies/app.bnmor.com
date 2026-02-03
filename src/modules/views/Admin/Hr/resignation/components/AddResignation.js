import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card
} from "antd";
import { postRequest } from "@/hooks/apiService";
import {URL_ADD_RESIGNATION } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs';
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
  
const dateFormat = 'YYYY-MM-DD';

const AddResignation = (props) => {
  const { jwt, setIsModalVisible, refetch,forceRefetch,qryEmployeeData,qryAttrData } = props;
   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [getStartDate, setGetStartDate] = useState( dayjs().format(dateFormat))
  const [getEndDate, setGetEndDate] = useState( dayjs().format(dateFormat))


  // attribute_id

  const onFinish =  async (values) => {
    try {

      let data = {
        "resignation_date":values?.start_date ? dayjs(values.start_date).format(dateFormat) : dayjs().format(dateFormat),
         "last_working_date":values?.end_date ? dayjs(values.end_date).format(dateFormat) : dayjs().format(dateFormat),
        "description": values?.description,
        "employee_id": values?.employee_id,
        // "termination_type_id": values?.termination_type_id,
  
      }

      setIsloadingSubmit(true);
      postRequest(URL_ADD_RESIGNATION,{...data},jwt)
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

  // Replace all Select, Input, and DatePicker components' style props to use a consistent style
  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };
  const SELECT_PROPS = {
    showSearch: true,
    filterOption: (input, option) =>
      (option?.children ?? '').toLowerCase().includes(input.toLowerCase()),
    dropdownMatchSelectWidth: true,
    className: 'custom-select-field',
    style: FIELD_STYLE,
  };


  return (
    <>
      <Form
        form={form}
        name="addResignation"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Add Resignation" style={{ marginBottom: 24, borderRadius: 8 }}>
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
              <CustomDatePicker
                label="Resignation Date"
                name="start_date"
                placeholder="Select resignation date"
                rules={[
                  {
                    required: true,
                    message: "Please input your date!",
                  },
                ]}
                datePickerProps={{
                  format: dateFormat,
                  style: FIELD_STYLE,
                  allowClear: false
                }}
              />
              <Form.Item hidden={true} name="start_date">
                <input />
              </Form.Item>
            </Col>

            <Col span={12} xs={24} md={24}>
              <CustomDatePicker
                label="Last Working Day"
                name="end_date"
                placeholder="Select last working day"
                rules={[
                  {
                    required: true,
                    message: "Please input your date!",
                  },
                ]}
                datePickerProps={{
                  format: dateFormat,
                  style: FIELD_STYLE,
                  allowClear: false
                }}
                
              />
              <Form.Item hidden={true} name="end_date">
                <input />
              </Form.Item>
            </Col>

            <Col span={24}>
              <CustomTextArea
                label="Reason"
                name="description"
                placeholder="Enter resignation reason"
                rules={[
                  {
                    required: true,
                    message: "Please input your description!",
                  },
                ]}
                textAreaProps={{
                  rows: 6,
                  style: { ...FIELD_STYLE, height: 'auto', minHeight: 120 }
                }}
              />
            </Col>

            <Col span={24}>
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

export default AddResignation;
