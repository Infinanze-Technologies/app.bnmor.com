import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card
} from "antd";
import { updateRequest } from "@/hooks/apiService";
import {URL_GET_RESIGNATION_TYPE, URL_GET_Qry_EMPLOYEES, URL_UPDATE_RESIGNATION } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import dayjs from 'dayjs';
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
const dateFormat = 'YYYY-MM-DD';


const EditResignation = (props) => {
  const { jwt, setIsModalVisible, record, refetch,forceRefetch, qryEmployeeData,qryAttrData } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();



  // Replace all Select, Input, and DatePicker components' style props to use a consistent style
  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };

  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
        resignation_date: record?.resignation_date ? dayjs(record?.resignation_date) : dayjs().format(dateFormat),
        last_working_date: record?.last_working_date ? dayjs(record?.last_working_date) : dayjs().format(dateFormat),
        // admin_status: record?.admin_status,
      });
    } catch (error) {
      console.log(error);
    }
  }, [props?.record]);
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const onFinish = async (values) => {
    let data = {
      "resignation_date": typeof(values?.resignation_date) == 'undefined' ? record?.resignation_date : dayjs(values.resignation_date).format(dateFormat),
      "last_working_date": typeof(values?.last_working_date) == 'undefined' ? record?.last_working_date : dayjs(values.last_working_date).format(dateFormat),
      "description": values?.description,
      "employee_id": values?.employee_id,
      // "termination_type_id": values?.termination_type_id,

    }
    // console.log('====================================');
    // console.log(data);
    // console.log('====================================');
    // console.log(values);
    // console.log('====================================');
    // return;

  

    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_RESIGNATION, record?.resignation_id, { ...data }, jwt)
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
        name="editResignation"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Edit Resignation" style={{ marginBottom: 24, borderRadius: 8 }}>
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
                  name="resignation_date"
                placeholder="Select resignation date"
                datePickerProps={{
                  format: dateFormat,
                  style: FIELD_STYLE,
                  allowClear: false
             
                }}
              />
              {/* <Form.Item hidden={true} name="start_date">
                <input />
              </Form.Item> */}
            </Col>

            <Col span={12} xs={24} md={24}>
              <CustomDatePicker
                label="Last Working Day"
                name="last_working_date"
                placeholder="Select last working day"
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
                  // style: { ...FIELD_STYLE, height: 'auto', minHeight: 120 }
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

export default EditResignation;
