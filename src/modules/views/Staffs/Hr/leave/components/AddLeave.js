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
import {URL_ADD_EMP_LEAVE, URL_ADD_LEAVE, URL_ADD_TIMESHEET } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import moment from 'moment'
import { DatePicker } from 'antd';
const dateFormat = 'Y-m-d';
const { TextArea } = Input;

const AddLeave = (props) => {
  const { jwt, setIsModalVisible, refetch,qryEmployeeData,qryAttrData,employee_id } = props;
   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [getStartDate, setGetStartDate] = useState( moment().format(dateFormat))
  const [getEndDate, setGetEndDate] = useState( moment().format(dateFormat))

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
 

  // attribute_id

  const onFinish =  (values) => {
    try {

      let data = {
        "start_date":values?.start_date,
        "end_date":values?.end_date,
        "reason": values?.reason,
        "remark": values?.remark,
        "employee_id": employee_id,
        "leave_type_id": values?.attribute_id,
  
      }

      setIsloadingSubmit(true);
      postRequest(URL_ADD_EMP_LEAVE,{...data},jwt)
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

    




             <div className="col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Leave Type <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="attribute_id"
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
                       { qryAttrData?.map((item,index)=> 

<>
<Option value={item?.attribute_id} key={index}>{item?.name}</Option>
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
                Start Date <span className="text-danger">*</span>
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
                End Date <span className="text-danger">*</span>
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
                Reason <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="reason"
                rules={[
                  {
                    required: true,
                    message: "Please input your reason!",
                  },
                ]}
              >
                <TextArea className="form-control" type="text"  rows={6} />
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

export default AddLeave;
