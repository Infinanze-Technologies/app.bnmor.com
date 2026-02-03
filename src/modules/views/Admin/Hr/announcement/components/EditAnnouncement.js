import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card
} from "antd";
import {URL_GET_DEPARTMENT_BY_BRANCH, URL_GET_Qry_EMPLOYEES, URL_UPDATE_Announcement, URL_UPDATE_RESIGNATION} from "@/config/api-paths";
import { getRequest, updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs'
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomMultiSelect from "@/components/form/CustomMultiSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const dateFormat = 'YYYY-MM-DD';


const EditAnnouncement = (props) => {
  const { jwt, setIsModalVisible, record, refetch,forceRefetch,qryBranchData } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };
  const [branchId, setBranchId] = useState(0);
  const [departmentId, setDepartmentId] = useState(0);
  const [getDepartments, setDepartments] = useState([]);
  const [getEmployees, setEmployees] = useState([]);
  const [isloadingDepartment, setIsloadingDepartment] = useState(false);
  const [isloadingEmployees, setIsloadingEmployees] = useState(false);
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  useEffect(() => {
    let pushArray = []
    try {
      if(record?.employee_list?.length > 0){
        record?.employee_list?.map(item =>{
          return pushArray?.push(item?.employee_id)   
        })
      }
  
      form.setFieldsValue({
         ...record,
        start_date: record?.start_date ? dayjs(record?.start_date) : dayjs(),
        end_date: record?.end_date ? dayjs(record?.end_date) : dayjs(),
         department_id: record?.department?.id,
         employees: pushArray,
      });
      setBranchId(record?.branch_id)
      setDepartmentId(record?.department?.id)
      DepartmentById(record?.branch_id)
      EmployeeIds(record?.department?.id)
    } catch (error) {
      console.log(error);
    }
  }, [props,record]);

  const handleChangeBranch = (id) => {
    if(id == 0){
      setDepartments([])
      setEmployees([])
      form.resetFields(['department_id']);
      form.resetFields(['employees']);
      setDepartmentId(0)
    }else{
      setBranchId(id)
      DepartmentById(id)
      form.resetFields(['employees']);
      form.resetFields(['department_id']);
    }
  }

  const handleChangeDepartment = (id) => {
    if(id == 0){
      form.resetFields(['department_id']);
      form.resetFields(['employees']);
       setDepartmentId(0)
       setEmployees([])
    }else{
      form.resetFields(['employees']);
      setDepartmentId(id)
      EmployeeIds(id)
    }
  }

  let DepartmentById = async (id) => {
    setIsloadingDepartment(true)
    await getRequest(URL_GET_DEPARTMENT_BY_BRANCH+`/${id}`, jwt)
    .then((res) => {
      setIsloadingDepartment(false)
      setDepartments(res.data?.data)
      return res.data?.data;
    })
    .catch((err) => {
      setIsloadingDepartment(false)
      console.log(err)
    });
  }

  let EmployeeIds = async (id) => {
    setIsloadingEmployees(true)
    await getRequest(URL_GET_Qry_EMPLOYEES+`/${id}`, jwt)
    .then((res) => {
      setIsloadingEmployees(false)
      setEmployees(res.data?.data)
      return res.data?.data;
    })
    .catch((err) => {
      setIsloadingEmployees(false)
      console.log(err)
    });
  }

  const onFinish = async (values) => {
    if(values?.employees < 0){
      return false;
    }

    let data = {
      "branch_id":values?.branch_id,
       "department_id":values?.department_id,
      "title": values?.title,
      "start_date": typeof(values?.start_date) == 'undefined' ? dayjs(record?.start_date).format(dateFormat) : dayjs(values.start_date).format(dateFormat),
      "end_date": typeof(values?.end_date) == 'undefined' ? dayjs(record?.end_date).format(dateFormat) : dayjs(values.end_date).format(dateFormat),
      "description": values?.description,
      "employees": values?.employees,
    }

    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_Announcement, record?.announcement_id, { ...data }, jwt)
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
        name="editAnnouncement"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Edit Announcement" style={{ marginBottom: 24, borderRadius: 8 }}>
          <Row gutter={16}>
            <Col span={12} xs={24} md={12}>
              <CustomInput
                label="Title"
                name="title"
                placeholder="Enter announcement title"
                rules={[
                  {
                    required: true,
                    message: "Please input your title!",
                  },
                ]}
              />
            </Col>

            <Col span={12} xs={24} md={12}>
              <CustomSelect
                label="Branch"
                name="branch_id"
                placeholder="Select Branch"
                options={[
                  { value: 0, label: "Select Branch" },
                  ...qryBranchData?.map((item) => ({
                    value: item?.branch_id,
                    label: item?.name,
                  }))
                ]}
                rules={[
                  {
                    required: true,
                    message: "Please select branch!",
                  },
                ]}
                selectProps={{
                  onChange: (e) => handleChangeBranch(e)
                }}
              />
            </Col>

            <Col span={12} xs={24} md={12}>
              <CustomSelect
                label="Department"
                name="department_id"
                placeholder="Select Department"
                options={[
                  { value: 0, label: "Select Department" },
                  ...getDepartments?.map((item) => ({
                    value: item?.id,
                    label: item?.name,
                  }))
                ]}
                loading={isloadingDepartment}
                rules={[
                  {
                    required: true,
                    message: "Please select department!",
                  },
                ]}
                selectProps={{
                  onChange: (e) => handleChangeDepartment(e)
                }}
              />
            </Col>

            <Col span={12} xs={24} md={12}>
              <CustomMultiSelect
                label="Employees"
                name="employees"
                placeholder="Select Employees"
                options={getEmployees?.map((item) => ({
                  value: item?.employee_id,
                  label: item?.fullname,
                }))}
                loading={isloadingEmployees}
                rules={[
                  {
                    required: true,
                    message: "Please select employees!",
                  },
                ]}
              />
            </Col>

            <Col span={12} xs={24} md={12}>
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

            <Col span={12} xs={24} md={12}>
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
                label="Description"
                name="description"
                placeholder="Enter announcement description"
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

export default EditAnnouncement;
