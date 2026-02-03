import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card
} from "antd";
import { getRequest, postRequest } from "@/hooks/apiService";
import { URL_ADD_Announcement, URL_ADD_RESIGNATION, URL_GET_DEPARTMENT_BY_BRANCH, URL_GET_Qry_EMPLOYEES } from "@/config/api-paths";
  import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs'
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomMultiSelect from "@/components/form/CustomMultiSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const dateFormat = 'YYYY-MM-DD';
//  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };

const AddAnnouncement = (props) => {
  const { jwt, setIsModalVisible, refetch,forceRefetch,qryEmployeeData,qryBranchData } = props;
   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  const [branchId, setBranchId] = useState(0);
  const [departmentId, setDepartmentId] = useState(0);
  const [getDepartments, setDepartments] = useState([]);
  const [getEmployees, setEmployees] = useState([]);
  const [isloadingDepartment, setIsloadingDepartment] = useState(false);

  const [isloadingEmployees, setIsloadingEmployees] = useState(false);
  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };


  

  

  const onFinish =  async (values) => {

    try {

if(values?.employees < 0){
return false;
}

      let data = {
        "start_date":values?.start_date ? dayjs(values.start_date).format(dateFormat) : dayjs().format(dateFormat),
        "end_date":values?.end_date ? dayjs(values.end_date).format(dateFormat) : dayjs().format(dateFormat),
        "branch_id":values?.branch_id,
         "department_id":values?.department_id,
        "description": values?.description,
        "title": values?.title,
         "employees": values?.employees,
  
      }


      setIsloadingSubmit(true);
      postRequest(URL_ADD_Announcement,{...data},jwt)
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



  const handleChangeBranch = (id) => {

    if(id == 0){
      setDepartments([])
      setEmployees([])
      // form.setFieldsValue({ department_id: 0 })
      form.resetFields(['department_id']);
      form.resetFields(['employees']);
       setDepartmentId(0)
    }else{
      form.resetFields(['employees']);
      form.resetFields(['department_id']);
      setBranchId(id)
      DepartmentById(id)
    }


  }


  const handleChangeDepartment = (id) => {
    if(id == 0){
      setEmployees([])
      // form.setFieldsValue({ department_id: 0 })
      form.resetFields(['employees']);
      form.resetFields(['department_id']);
       setDepartmentId(0)
    }else{
      form.resetFields(['employees']);
      setDepartmentId(id)
      EmployeeIds(id)
    }
 
  }

  let DepartmentById = async (id) => {
    // setGetDepartments([])
    setIsloadingDepartment(true)
    await getRequest(URL_GET_DEPARTMENT_BY_BRANCH+`/${id}`, jwt)
    .then((res) => {
      setIsloadingDepartment(false)
      setDepartments(res.data?.data)
      return res.data?.data;
    })
    .catch((err) => {
      console.log(err)
      // return err
    });
  }


  let EmployeeIds = async (id) => {
    // setgetEmployees([])
    setIsloadingEmployees(true)
    await getRequest(URL_GET_Qry_EMPLOYEES+`/${id}`, jwt)
    .then((res) => {
      setIsloadingEmployees(false)
      setEmployees(res.data?.data)
      return res.data?.data;
    })
    .catch((err) => {
      console.log(err)
      // return err
    });
  }

  useEffect(() => {
  }, [getDepartments,getEmployees])



  return (
    <>
      <Form
        form={form}
        name="addAnnouncement"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Add Announcement" style={{ marginBottom: 24, borderRadius: 8 }}>
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

export default AddAnnouncement;
