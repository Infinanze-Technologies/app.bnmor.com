import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card
} from "antd";
import {URL_GET_TIMESHEET_TYPE, URL_GET_Qry_EMPLOYEES, URL_UPDATE_TIMESHEET } from "@/config/api-paths";
import { getRequest, updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs'
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
const dateFormat = 'YYYY-MM-DD';


const EditTimeSheet = (props) => {
  const { jwt, setIsModalVisible, record, refetch,forceRefetch,qryEmployeeData } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();

  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };

  


 



  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
        start_date: record?.start_date ? dayjs(record?.start_date) : dayjs().format(dateFormat),
        // admin_status: record?.admin_status,
      });
    } catch (error) {
      console.log(error);
    }
  }, [props?.record]);
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const onFinish = async (values) => {
    let data = {
      "start_date": typeof(values?.start_date) == 'undefined' ? record?.start_date : values?.start_date,
      "remark": values?.remark,
      "employee_id": values?.employee_id,
      "hours": values?.hours,

    }

    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_TIMESHEET, record?.timesheet_id, { ...data }, jwt)
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
        name="editTimeSheet"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Edit TimeSheet" style={{ marginBottom: 24, borderRadius: 8 }}>
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
                label="Date"
                name="start_date"
                placeholder="Select date"
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
              <CustomInput
                label="Hours"
                name="hours"
                type="number"
                placeholder="Enter hours worked"
                rules={[
                  {
                    required: true,
                    message: "Please input your hours!",
                  },
                ]}
                
              />
            </Col>

            <Col span={24} xs={24} md={24}>
              <CustomTextArea
                label="Remark"
                name="remark"
                placeholder="Enter timesheet remark"
                rules={[
                  {
                    required: true,
                    message: "Please input your remark!",
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

export default EditTimeSheet;
