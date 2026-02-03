import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
  InputNumber
} from "antd";
const { Option } = Select;
import { postRequest } from "@/hooks/apiService";
import {URL_ADD_EMP_TIMESHEET, URL_ADD_TIMESHEET } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import moment from 'moment'
import { DatePicker } from 'antd';
const dateFormat = 'Y-m-d';
const { TextArea } = Input;

const AddTimeSheet = (props) => {
  const { jwt, setIsModalVisible, refetch,qryEmployeeData,employee_id } = props;
   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [getDate, setGeDate] = useState( moment().format(dateFormat))


  const handleChangeDate = (date, dateString) => {
    setGeDate(dateString)
  }

  form.setFieldsValue({
    start_date :getDate
 
  })
 
  console.log(employee_id);


  const onFinish =  (values) => {
    try {


      let data = {
        "start_date":values?.start_date,
        "remark": values?.remark,
        "employee_id": employee_id,
        "hours": values?.hours,
  
      }
      setIsloadingSubmit(true);
      postRequest(URL_ADD_EMP_TIMESHEET,{...data},jwt)
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


        

          {/* <div className="col-sm-12">
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
                >
                       { qryEmployeeData?.map((item,index)=> 

<>
<Option value={item?.employee_id} key={index}>{item?.fullname}</Option>
</>
)

}
                  
                </Select>
              </Form.Item>
            </div>
          </div> */}



          <div className="col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Date <span className="text-danger">*</span>
              </label>
              <Form.Item
 name="set_dob"
        rules={[
          {
            required: true,
            message: "Please input your date!",
          },
        ]}
      >
        <DatePicker
      onChange={(date, dateString) =>
                    handleChangeDate(date, dateString)
                  }
               
          style={{ width:'100%',height:'50px' }}/>
      </Form.Item>
    </div>
    <Form.Item hidden={true} name="start_date">
              <Input />
            </Form.Item>
            </div>
          </div>




          <div className="col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Hours <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="hours"
                rules={[
                  {
                    required: true,
                    message: "Please input your hours!",
                  },
                ]}
              >
                <InputNumber className="form-control" type="number" />
              </Form.Item>
            </div>
          </div>


          <div className="col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Remark <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="remark"
                rules={[
                  {
                    required: true,
                    message: "Please input your remark!",
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

export default AddTimeSheet;
