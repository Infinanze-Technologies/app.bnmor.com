import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
  InputNumber
} from "antd";
const { Option } = Select;
import { getRequest, postRequest } from "@/hooks/apiService";
import {URL_ADD_AWARD, URL_ADD_PROMOTION, URL_QRY_DESIGNATION_BY_DEPARTMENT } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import moment from 'moment'
import { DatePicker } from 'antd';
import useToastMessage from "@/hooks/useToastMessage";
const dateFormat = 'Y-m-d';
const { TextArea } = Input;

const AddPromotion = (props) => {
  const { jwt, setIsModalVisible, refetch,qryEmployeeData,qryAttrData } = props;
   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [getStartDate, setGetStartDate] = useState( moment().format(dateFormat))
  const [employeeId, setEmployeeId] = useState(0);
  const [getDesignations, setGetDesignations] = useState([]);
  const [isloadingDepartment, setIsloadingDepartment] = useState(false);
  // const [isloadingDesignation, setIsloadingDesignation] = useState(false);
  const { toastError } = useToastMessage();

  const handleChangeStartDate = (date, dateString) => {
    setGetStartDate(dateString)
  }



  form.setFieldsValue({
    start_date :getStartDate,

  })
 

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

  // attribute_id

  const onFinish =  (values) => {
    try {


      if(values?.designation_id === null || values?.designation_id == 0)
      return toastError("Designation is required");

      let data = {
        "promotion_date":values?.start_date,
        // "end_date":values?.end_date,
        "description": values?.description,
        "title": values?.title,
        "employee_id": values?.employee_id,
        "to_designation": values?.designation_id,
  
      }


      // console.log('====================================');
      // console.log(data);
      // console.log('====================================');


      // return;

      setIsloadingSubmit(true);
      postRequest(URL_ADD_PROMOTION,{...data},jwt)
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





  return (
    <>
      <Form onFinish={onFinish} form={form} name="basic" size="middle">
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
                  <Option value={0} key={0} disabled>Select Employee</Option>
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
                  placeholder="Select Leave Type"
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
            </div>
          </div>
   


    


          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Promotion Date <span className="text-danger">*</span>
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

export default AddPromotion;
