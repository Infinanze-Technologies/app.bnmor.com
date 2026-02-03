import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card
} from "antd";
import { updateRequest } from "@/hooks/apiService";
import {URL_UPDATE_HOLIDAY } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs';
import CustomInput from "@/components/form/CustomInput";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";


const dateFormat = 'YYYY-MM-DD';


const EditLeave = (props) => {
  const { jwt, setIsModalVisible, record, refetch,forceRefetch } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  
  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };

 
 



  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
        start_date: record?.start_date ? dayjs(record?.start_date) : dayjs().format(dateFormat),
        end_date: record?.end_date ? dayjs(record?.end_date) : dayjs().format(dateFormat),
        description: record?.description,
        // admin_status: record?.admin_status,
      });
    } catch (error) {
      console.log(error);
    }
  }, [props?.record]);
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const onFinish = async (values) => {

    let data = {
      "start_date": typeof(values?.start_date) == 'undefined' ? record?.start_date : dayjs(values.start_date).format(dateFormat),
      "end_date": typeof(values?.end_date) == 'undefined' ? record?.end_date : dayjs(values.end_date).format(dateFormat),
      "title": values?.title,
      "description": values?.description,

    }

  

    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_HOLIDAY, record?.holiday_id, { ...data }, jwt)
      .then(async (res) => {
        setIsloadingSubmit(false);
        handleRequestResponse(res);
        await forceRefetch();
        setIsModalVisible(false);
      })
      .catch((err) => {
        handleRequestError(err);
        setIsloadingSubmit(false);
        console.log(err?.response?.data?.error);
      });
  };

  return (
    <>
  <Form
        form={form}
        name="editHoliday"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Edit Holiday" style={{ marginBottom: 24, borderRadius: 8 }}>
          <Row gutter={16}>
            <Col span={12} xs={24} md={24}>
              <CustomInput
                label="Holiday Name"
                name="title"
                placeholder="Enter holiday name"
                rules={[
                  {
                    required: true,
                    message: "Please input your holiday name!",
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

            <Col span={12} xs={24} md={24}>
              <CustomDatePicker
                label="End Date"
                name="end_date"
                placeholder="Select end date"
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

              <Col span={24} xs={24} md={24} >
              <CustomTextArea
                label="Description"
                name="description"
                placeholder="Enter holiday description"
                rules={[
                  {
                    required: true,
                    message: "Please input your description!",
                  },
                ]}
                textAreaProps={{
                  rows: 6,
                  style: { ...FIELD_STYLE, height: 'auto', minHeight: 120 },
                  allowClear: false
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

export default EditLeave;
