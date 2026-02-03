import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Spin,
  Card
} from "antd";
import { postRequest } from "@/hooks/apiService";
import {URL_ADD_AWARD } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs'
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
const dateFormat = 'YYYY-MM-DD';

const AddAward = (props) => {
  const { jwt, setIsModalVisible, refetch,forceRefetch,qryEmployeeData,qryAttrData } = props;
   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

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

  const onFinish = async (values) => {
    console.log('AddAward onFinish values:', values);
    
    try {
      let data = {
        "created_on": values?.award_date ? dayjs(values.award_date).format(dateFormat) : dayjs().format(dateFormat),
        "description": values?.description,
        "gift": values?.gift,
        "employee_id": values?.employee_id,
        "award_type_id": values?.attribute_id,
      }

      console.log('AddAward submitting data:', data);

      setIsloadingSubmit(true);
      postRequest(URL_ADD_AWARD,{...data},jwt)
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
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
               <Card type="inner" title="Add Award" style={{ marginBottom: 24, borderRadius: 8 }}>
         <Row gutter={16}>

          

          <Col xs={24} md={24}>
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

          <Col xs={24} md={24}>
            <CustomSelect
              label="Award Type"
              name="attribute_id"
              placeholder="Select Award Type"
              options={qryAttrData?.map((item) => ({
                value: item?.attribute_id,
                label: item?.name,
              }))}
              rules={[
                {
                  required: true,
                  message: "Please input your award type!",
                },
              ]}
         
            />
          </Col>

          <Col xs={24} md={24}>
            <CustomDatePicker
              label="Date"
              name="award_date"
              placeholder="Select award date"
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
          </Col>

          <Col xs={24} md={24}>
            <CustomInput
              label="Gift"
              name="gift"
              placeholder="Enter gift description"
              rules={[
                {
                  required: true,
                  message: "Please input your gift!",
                },
              ]}
              style={FIELD_STYLE}
            />
          </Col>

            <Col xs={24} md={24}>
          <CustomTextArea
            label="Description"
            name="description"
            placeholder="Enter award description"
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

          <Col xs={24} md={24}>
          <div className="d-flex justify-content-end">
            <div className="d-grid">
              <div className="d-flex justify-content-end submit_buttom mt-4 w-100">
                <Form.Item>
                    <Button
                        loading={isloadingSubmit}
              {...BUTTON_CONFIGS.SAVE_BUTTON()}
              htmlType="submit"
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

export default AddAward;
