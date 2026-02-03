import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card
} from "antd";
import { updateRequest } from "@/hooks/apiService";
import {URL_GET_TERMINATION_TYPE, URL_GET_Qry_EMPLOYEES, URL_UPDATE_TERMINATION } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs';
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const dateFormat = 'YYYY-MM-DD';


const EditTermination = (props) => {
  const { jwt, setIsModalVisible, record, refetch,forceRefetch,qryEmployeeData,qryAttrData } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();

  // Replace all Select, Input, and DatePicker components' style props to use a consistent style
  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };


 



  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
        notice_date: record?.notice_date ? dayjs(record?.notice_date) : dayjs().format(dateFormat),
        termination_date: record?.termination_date ? dayjs(record?.termination_date) : dayjs().format(dateFormat),
        // admin_status: record?.admin_status,
      });
    } catch (error) {
      console.log(error);
    }
  }, [props?.record]);
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const onFinish = async (values) => {
    let data = {
      "notice_date": typeof(values?.notice_date) == 'undefined' ? record?.notice_date : values?.notice_date,
      "termination_date": typeof(values?.termination_date) == 'undefined' ? record?.termination_date : values?.termination_date,
      "description": values?.description,
      "employee_id": values?.employee_id,
      "termination_type_id": values?.termination_type_id,

    }
    // console.log('====================================');
    // console.log(data);
    // console.log('====================================');

  

    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_TERMINATION, record?.termination_id, { ...data }, jwt)
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
        name="editTermination"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Edit Termination" style={{ marginBottom: 24, borderRadius: 8 }}>
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
                label="Termination Type"
                name="termination_type_id"
                placeholder="Select Termination Type"
                options={qryAttrData?.map((item) => ({
                  value: item?.attribute_id,
                  label: item?.name,
                }))}
                rules={[
                  {
                    required: true,
                    message: "Please input your termination type!",
                  },
                ]}
               
              />
            </Col>

            <Col span={12} xs={24} md={24}>
              <CustomDatePicker
                label="Notice Date"
                  name="notice_date"
                placeholder="Select notice date"
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
                name="termination_date"
                placeholder="Select end date"
                datePickerProps={{
                  format: dateFormat,
                  style: FIELD_STYLE,
                  allowClear: false
                 
                }}
              />
            </Col>

            <Col span={24} xs={24} md={24}>
              <CustomTextArea
                label="Description"
                name="description"
                placeholder="Enter termination description"
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

export default EditTermination;
