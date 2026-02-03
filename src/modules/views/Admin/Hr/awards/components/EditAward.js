import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card
} from "antd";
import {URL_GET_AWARD_TYPE, URL_GET_Qry_EMPLOYEES, URL_UPDATE_AWARD } from "@/config/api-paths";
import { getRequest, updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs'
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
const dateFormat = 'YYYY-MM-DD';

const EditAward = (props) => {
  const { jwt, setIsModalVisible, record, refetch,forceRefetch,qryEmployeeData,qryAttrData } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
        // Map the created_on field to the date picker
        created_on: record?.created_on ? dayjs(record?.created_on) : dayjs().format(dateFormat),
      });
    } catch (error) {
      console.log(error);
    }
  }, [props?.record, form]);

  const onFinish = async (values) => {
    console.log('EditAward onFinish values:', values);
    
    let data = {
      "created_on": values?.created_on ? dayjs(values.created_on).format(dateFormat) : record?.created_on,
      "gift": values?.gift,
      "description": values?.description,
      "employee_id": values?.employee_id,
      "award_type_id": values?.award_type_id,
    }

    // console.log('EditAward submitting data:', data);

    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_AWARD, record?.award_id, { ...data }, jwt)
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
        name="editAward"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Edit Award" style={{ marginBottom: 24, borderRadius: 8 }}>
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
            selectProps={SELECT_PROPS}
          />
            </Col>

        <Col xs={24} md={24}>
          <CustomSelect
            label="Award Type"
            name="award_type_id"
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
            selectProps={SELECT_PROPS}
          />
        </Col>

        <Col xs={24} md={24}>
          <CustomDatePicker
            label="Date"
            name="created_on"
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

export default EditAward;
