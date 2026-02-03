import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card
} from "antd";
import { getRequest, updateRequest } from "@/hooks/apiService";
import { URL_GET_PROMOTION_TYPE, URL_GET_Qry_EMPLOYEES, URL_GET_DESIGNATIONS_BY_EMPLOYEE_ID, URL_UPDATE_PROMOTION } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs';
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import useToastMessage from "@/hooks/useToastMessage";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
const dateFormat = 'YYYY-MM-DD';

const EditPromotion = (props) => {
  const { jwt, setIsModalVisible, record, refetch,forceRefetch, qryEmployeeData, qryAttrData } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  
  const [employeeId, setEmployeeId] = useState(0);
  const [currentDesignation, setCurrentDesignation] = useState(null);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [availableDesignations, setAvailableDesignations] = useState([]);
  const [isloadingDepartment, setIsloadingDepartment] = useState(false);
  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };
  const { toastError } = useToastMessage();

  useEffect(() => {
    try {
      if (record) {
        form.setFieldsValue({
          ...record,
          to_designation: record?.to_designation,
          promotion_date: record?.promotion_date ? dayjs(record?.promotion_date) : dayjs(),
        });
        setEmployeeId(record?.employee_id)
        getDesignationsByEmployeeId(record?.employee_id)
      }
    } catch (error) {
      console.log(error);
    }
  }, [props?.record]);

  const handleChangeEmployee = (id) => {
    if (id == 0) {
      setAvailableDesignations([])
      setCurrentDesignation(null)
      setCurrentDepartment(null)
      form.setFieldsValue({ 
        to_designation: undefined,
        from_designation: '',
        department: '',
      })
      setEmployeeId(0)
    } else {
      setEmployeeId(id)
      getDesignationsByEmployeeId(id)
    }
  }

  let getDesignationsByEmployeeId = async (id) => {
    setIsloadingDepartment(true)
    await getRequest(URL_GET_DESIGNATIONS_BY_EMPLOYEE_ID + `/${id}`, jwt)
      .then(async (res) => {
        setIsloadingDepartment(false)
        
        if (res.data?.data) {
          const { current_designation, available_designations } = res.data.data;
          
          // Set current designation and department
          setCurrentDesignation(current_designation?.designation_name || '');
          setCurrentDepartment(current_designation?.department_name || '');
          
          // Set available designations for promotion
          setAvailableDesignations(available_designations?.designations || []);
          
          // Update form fields
          form.setFieldsValue({
            from_designation: current_designation?.designation_name || '',
            department: current_designation?.department_name || '',
          });
        }
        
        return res.data?.data;
      })
      .catch((err) => {
        setIsloadingDepartment(false)
        console.log(err)
      });
  }

  const onFinish = async (values) => {
    if (values?.to_designation === null || values?.to_designation == 0)
      return toastError("To Designation is required");

    let data = {
      "promotion_date": typeof (values?.promotion_date) == 'undefined' ? record?.promotion_date : dayjs(values.promotion_date).format(dateFormat),
      "title": values?.title,
      "description": values?.description,
      "employee_id": values?.employee_id,
      "to_designation": values?.to_designation,
    }

    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_PROMOTION, record?.promotion_id, { ...data }, jwt)
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
        name="editPromotion"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Edit Promotion" style={{ marginBottom: 24, borderRadius: 8 }}>
          <Row gutter={16}>
            <Col span={12} xs={24} md={12}>
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
                selectProps={{
                  onChange: (e) => handleChangeEmployee(e)
                }}
              />
            </Col>

            <Col span={12} xs={24} md={12}>
              <CustomInput
                label="Current Department"
                name="department"
                placeholder="Department will appear here"
                readOnly={true}
                disabled={true}
                value={currentDepartment}
                inputProps={{
                  style: { 
                    backgroundColor: '#f5f5f5', 
                    cursor: 'not-allowed',
                    color: '#666'
                  }
                }}
              />
            </Col>
            
            <Col span={12} xs={24} md={12}>
              <CustomInput
                label="Current Designation"
                name="from_designation"
                placeholder="Current designation will appear here"
                readOnly={true}
                disabled={true}
                value={currentDesignation}
                inputProps={{
                  style: { 
                    backgroundColor: '#f5f5f5', 
                    cursor: 'not-allowed',
                    color: '#666'
                  }
                }}
              />
            </Col>

            <Col span={12} xs={24} md={12}>
              <CustomSelect
                label="Promotion To Designation"
                name="to_designation"
                placeholder="Select Designation"
                options={availableDesignations?.map((item) => ({
                  value: item?.designation_id,
                  label: item?.name,
                }))}
                loading={isloadingDepartment}
                rules={[
                  {
                    required: true,
                    message: "Please input your to designation!",
                  },
                ]}
              />
            </Col>

            <Col span={12} xs={24} md={12}>
              <CustomInput
                label="Promotion Title"
                name="title"
                placeholder="Enter promotion title"
                rules={[
                  {
                    required: true,
                    message: "Please input your title!",
                  },
                ]}
              />
            </Col>

            <Col span={12} xs={24} md={12}>
              <CustomDatePicker
                label="Promotion Date"
                name="promotion_date"
                placeholder="Select promotion date"
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

            <Col span={24} xs={24} md={24}>
              <CustomTextArea
                label="Description"
                name="description"
                placeholder="Enter promotion description"
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

export default EditPromotion;
