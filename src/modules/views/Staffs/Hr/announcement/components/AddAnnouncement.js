import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
  InputNumber,
  Spin
} from "antd";
const { Option } = Select;
import { getRequest, postRequest } from "@/hooks/apiService";
import { URL_ADD_Announcement, URL_ADD_RESIGNATION, URL_GET_DEPARTMENT_BY_BRANCH, URL_GET_Qry_EMPLOYEES } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import moment from 'moment'
import { DatePicker } from 'antd';
const dateFormat = 'Y-m-d';
const { TextArea } = Input;

const AddAnnouncement = (props) => {
  const { jwt, setIsModalVisible, refetch,qryEmployeeData,qryBranchData } = props;
   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [getStartDate, setGetStartDate] = useState( moment().format(dateFormat))
  const [getEndDate, setGetEndDate] = useState( moment().format(dateFormat))
  const [branchId, setBranchId] = useState(0);
  const [departmentId, setDepartmentId] = useState(0);
  const [getDepartments, setDepartments] = useState([]);
  const [getEmployees, setEmployees] = useState([]);
  const [isloadingDepartment, setIsloadingDepartment] = useState(false);

  const [isloadingEmployees, setIsloadingEmployees] = useState(false);
  const handleChangeStartDate = (date, dateString) => {
    setGetStartDate(dateString)
  }
  const handleChangeEndDate = (date, dateString) => {
    setGetEndDate(dateString)
  }


  

  form.setFieldsValue({
    start_date :getStartDate,
    end_date :getEndDate,
 
  })

  const onFinish =  (values) => {

    try {

if(values?.employees < 0){
return false;
}

      let data = {
        "start_date":values?.start_date,
        "end_date":values?.end_date,
        "branch_id":values?.branch_id,
         "department_id":values?.department_id,
        "description": values?.description,
        "title": values?.title,
         "employees": values?.employees,
  
      }


      setIsloadingSubmit(true);
      postRequest(URL_ADD_Announcement,{...data},jwt)
        .then((res) => {
          setIsloadingSubmit(false);
          handleRequestResponse(res)
          setIsModalVisible(false);
          // refetch()
        }).finally(() => {
          refetch()
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
      <Form onFinish={onFinish} form={form} name="basic" size="middle">
        <div className="row">



        <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Announcement Title <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please input your occasion!",
                  },
                ]}
              >
                <Input className="form-control" type="text"  rows={6} />
              </Form.Item>
            </div>
          </div>




          <div className="col-sm-6">
    <div className="form-group custom-select">
      <label className="col-form-label">
       Branch <span className="text-danger">*</span>
      </label>
      <Form.Item
        name="branch_id"
        rules={[
          {
            required: true,
            message: "Please select branch!",
          },
        ]}
      >
        <Select
          showSearch
          style={{
            width: 200,
          
          }}
          placeholder="Select Branch"
          optionFilterProp="children"   
          onChange={(e) => handleChangeBranch(e)}
        >
         <Option value={0} key={0} >Select Branch</Option>
         { qryBranchData?.map((item,index)=> 

<>
<Option value={item?.branch_id} key={item?.id}>{item?.name}</Option>
</>
)

}
          
        </Select>
      </Form.Item>
    </div>
  </div>


  <div className="col-sm-6">
    <div className="form-group custom-select">
      <label className="col-form-label">
      Department <span className="text-danger">*</span>
      </label>
      <Spin spinning={isloadingDepartment}>
      <Form.Item
        name="department_id"
        rules={[
          {
            required: true,
            message: "Please select department!",
          },
        ]}
      >
        <Select
          showSearch
          style={{
            width: 200,
          }}
          placeholder="Select Department"
          optionFilterProp="children"
          onChange={(e) => handleChangeDepartment(e)}
      
        >
         <Option value={0} key={0} >Select Department</Option>
         
         { getDepartments?.map((item,index)=> 

<>
<Option value={item?.id} key={item?.id}>{item?.name}</Option>
</>
)

}

          
        </Select>
      </Form.Item>
      </Spin>
    </div>
  </div>

    

        <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Employee <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="employees"
            
                rules={[
                  {
                    required: true,
                    message: "Please input your employee!",
                  },
                ]}
              >

<Select
       mode="multiple"
       maxTagCount = 'responsive'
       placeholder="Inserted are removed"
       style={{
         width: '100%',
       }}
       options={getEmployees?.map((item) => ({
         value: item?.employee_id,
         label: item?.fullname,
       }))}
     />
            
              </Form.Item>
            </div>
          </div>





    


          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Announcement start Date <span className="text-danger">*</span>
              </label>
              <Form.Item
 name="date1"
        rules={[
          {
            required: true,
            message: "Please input your date!",
          },
        ]}
      >
        <DatePicker
      onChange={(date, dateString) =>
        handleChangeStartDate(date, dateString)
                  }
               
          style={{ width:'100%',height:'50px' }}/>
      </Form.Item>
    </div>
    <Form.Item hidden={true} name="start_date">
              <Input />
            </Form.Item>
            </div>

            <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Announcement End Date <span className="text-danger">*</span>
              </label>
              <Form.Item
 name="date2"
        rules={[
          {
            required: true,
            message: "Please input your date!",
          },
        ]}
      >
        <DatePicker
      onChange={(date, dateString) =>
        handleChangeEndDate(date, dateString)
                  }
               
          style={{ width:'100%',height:'50px' }}/>
      </Form.Item>
    </div>
    <Form.Item hidden={true} name="end_date">
              <Input />
            </Form.Item>
            </div>


          </div>

          
          



          <div className="col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Announcement Description <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Announcement Description!",
                  },
                ]}
              >
                <TextArea className="form-control" type="text"  rows={6} />
              </Form.Item>
            </div>
          </div>





        


          <div className="col-12">
            <div className="d-flex justify-content-end">
                <div className="d-grid">
                  <div className="d-flex justify-content-end submit_buttom mt-4 w-100">
                    <Form.Item>
                      <Button
                        loading={isloadingSubmit}
                        type="primary"
                        htmlType="submit"
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
      
      </Form>
    </>
  );
};

export default AddAnnouncement;
