import { useEffect, useState } from "react";
import { Button, Select, Form, Input,InputNumber, Spin } from "antd";
const { Option } = Select;
import {URL_GET_DEPARTMENT_BY_BRANCH, URL_GET_Qry_EMPLOYEES, URL_UPDATE_Announcement, URL_UPDATE_RESIGNATION} from "@/config/api-paths";
import { getRequest, updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import moment from 'moment'
import { DatePicker } from 'antd';
const dateFormat = 'Y-m-d';
const { TextArea } = Input;



const EditAnnouncement = (props) => {
  const { jwt, setIsModalVisible, record, refetch,qryBranchData } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [getStartDate, setGetStartDate] = useState( moment().format(dateFormat))
  const [getEndDate, setGetEndDate] = useState( moment().format(dateFormat))
  const [branchId, setBranchId] = useState(0);
  const [departmentId, setDepartmentId] = useState(0);
  const [getDepartments, setDepartments] = useState([]);
  const [getEmployees, setEmployees] = useState([]);
  const [isloadingDepartment, setIsloadingDepartment] = useState(false);

  const [isloadingEmployees, setIsloadingEmployees] = useState(false);


  useEffect(() => {
    let pushArray = []
    try {
      if(record?.employee_list?.length > 0){
        record?.employee_list?.map(item =>{
          return pushArray?.push(item?.employee_id)   
        }
          
          )

      }
  
      form.setFieldsValue({
         ...record,
      
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






  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
 


  const handleChangeBranch = (id) => {

    if(id == 0){
      setDepartments([])
      setEmployees([])
      // form.setFieldsValue({ department_id: 0 })
      // form.setFieldsValue({ employees: 0})
      form.resetFields(['department_id']);
      form.resetFields(['employees']);
      setDepartmentId(0)
    }else{
      setBranchId(id)
      DepartmentById(id)
      // form.setFieldsValue({ employees: 0})
      form.resetFields(['employees']);
      form.resetFields(['department_id']);
      // form.setFieldsValue({ department_id: 0 })
    }


  }


  const handleChangeDepartment = (id) => {
    if(id == 0){
      // form.setFieldsValue({ designation_id: 0 })
      form.resetFields(['department_id']);
      form.resetFields(['employees']);
      // form.setFieldsValue({ employees: 0 })
       setDepartmentId(0)
       setEmployees([])
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
      // setEmployees([])
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













      <Form  form={form} name="basic" size="middle">
        <div className="row">

        <div className="col-sm-12">
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

    

        {/* <div className="col-sm-6">
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
       placeholder="Select Employee"
       showSearch
       style={{
         width: '100%',
       }}
      
     >

         
         { getEmployees?.map((item)=> 

<>
<Option value={item?.employee_id} key={item?.id}>{item?.fullname}</Option>
</>

         )
}
</Select>
  
       
         
              </Form.Item>
            </div>
          </div> */}



    


          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Start Date <span className="text-danger">*</span>
              </label>
              <Form.Item
 name="date1"
      
      >
        <DatePicker
      onChange={(date, dateString) =>
        handleChangeStartDate(date, dateString)
                  }

                  defaultValue={moment(record?.start_date)}
               
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
                
          End Date <span className="text-danger">*</span>
              </label>
              <Form.Item
 name="date2"
      
      >
        <DatePicker
      onChange={(date, dateString) =>
        handleChangeEndDate(date, dateString)
                  }
                  defaultValue={moment(record?.end_date)}
               
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
                Description <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input your description!",
                  },
                ]}
              >
                <TextArea className="form-control" type="text"  rows={6} />
              </Form.Item>
            </div>
          </div>





      </Form>
    </>
  );
};

export default EditAnnouncement;
