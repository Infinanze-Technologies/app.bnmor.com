import { useEffect, useState } from "react";
import { Button, Select, Form, Input,Spin } from "antd";
const { Option } = Select;
import { URL_QRY_DESIGNATION_BY_DEPARTMENT, URL_UPDATE_AWARD, URL_UPDATE_BRANCH, URL_UPDATE_DEPARTMENT, URL_UPDATE_LEAVE, URL_UPDATE_PROMOTION, URL_UPDATE_TIMESHEET } from "@/config/api-paths";
import { updateRequest,getRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import moment from 'moment'
import { DatePicker } from 'antd';
import useToastMessage from "@/hooks/useToastMessage";
const dateFormat = 'Y-m-d';
const { TextArea } = Input;



const EditPromotion = (props) => {
  const { jwt, setIsModalVisible, record, refetch,qryEmployeeData,qryAttrData } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [getStartDate, setGetStartDate] = useState( moment().format(dateFormat))
  const [employeeId, setEmployeeId] = useState(0);
  const [getDesignations, setGetDesignations] = useState([]);
  const [isloadingDepartment, setIsloadingDepartment] = useState(false);
  const { toastError } = useToastMessage();

  const handleChangeStartDate = (date, dateString) => {
    setGetStartDate(dateString)
  }


  form.setFieldsValue({
    start_date :getStartDate,

 
  })


  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
        designation_id: record?.to_designation
        // admin_status: record?.admin_status,
      });
      setEmployeeId(record?.employee_id)
      DesignationById(record?.employee_id)
    } catch (error) {
      console.log(error);
    }
  }, [props?.record]);


  const handleChangeEmployee = (id) => {

    if(id == 0){
      setGetDesignations([])
      form.setFieldsValue({ designation_id: 0 })
      setEmployeeId(0)
    }else{
      setEmployeeId(id)
      DesignationById(id)
    }


  }


  let DesignationById = async (id) => {
    // setGetDepartments([])
    setIsloadingDepartment(true)
    await getRequest(URL_QRY_DESIGNATION_BY_DEPARTMENT+`/${id}`, jwt)
    .then((res) => {
      setIsloadingDepartment(false)
      setGetDesignations(res.data?.data)
      return res.data?.data;
    })
    .catch((err) => {
      console.log(err)
      // return err
    });
  }
 
  // console.log('====================================');
  // console.log(getDesignations);
  // console.log('====================================');
 



 
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);


  return (
    <>





      <Form form={form} name="basic" size="middle">
        <div className="row">

        <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Employee <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="employee_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your employee!",
                  },
                ]}
              >
                               <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Select Employee"
                  optionFilterProp="children"   
                  onChange={(e) => handleChangeEmployee(e)}
                >
                  <Option value={0} key={0} >Select Employee</Option>
                       { qryEmployeeData?.map((item,index)=> 

<>
<Option value={item?.employee_id} key={item?.id}>{item?.fullname}</Option>
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
              Designation <span className="text-danger">*</span>
              </label>
              <Spin spinning={isloadingDepartment}>
              <Form.Item
                name="designation_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your leave type!",
                  },
                ]}
              >
                               <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Select Designation"
                  optionFilterProp="children"   
                >
                  <Option value={0} key={0} disabled >Select Designation</Option>
                       { getDesignations?.map((item,index)=> 

<>
<Option value={item?.designation_id} key={item?.id}>{item?.name}</Option>
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
              Promotion Date <span className="text-danger">*</span>
              </label>
              <Form.Item
 name="date1"
     
      >
        <DatePicker
      onChange={(date, dateString) =>
        handleChangeStartDate(date, dateString)
                  }
                  defaultValue={moment(record?.promotion_date)}
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
              Promotion Title <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please input your title!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            </div>
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

export default EditPromotion;
