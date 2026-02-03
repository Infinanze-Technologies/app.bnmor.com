import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card
} from "antd";
import { updateRequest } from "@/hooks/apiService";
import {URL_UPDATE_LEAVE } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
import dayjs from 'dayjs'

const dateFormat = 'YYYY-MM-DD';



const EditLeave = (props) => {
  const { jwt, setIsModalVisible, record, refetch,forceRefetch,qryEmployeeData,qryAttrData } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };




  



  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
        start_date: record?.start_date ? dayjs(record?.start_date) : dayjs().format(dateFormat),
        end_date: record?.end_date ? dayjs(record?.end_date) : dayjs().format(dateFormat),
        // admin_status: record?.admin_status,
      });
    } catch (error) {
      console.log(error);
    }
  }, [props?.record]);
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const onFinish = async (values) => {

    let data = {
      "start_date": typeof(values?.start_date) == 'undefined' ? dayjs(record?.start_date).format(dateFormat) : values?.start_date,
      "end_date": typeof(values?.end_date) == 'undefined' ? dayjs(record?.end_date).format(dateFormat) : values?.end_date,
      "reason": values?.reason,
      "remark": values?.remark,
      "employee_id": values?.employee_id,
      "leave_type_id": values?.leave_type_id,

    }

  

    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_LEAVE, record?.leave_id, { ...data }, jwt)
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
        name="editLeave"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Edit Leave" style={{ marginBottom: 24, borderRadius: 8 }}>
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

export default EditLeave;
