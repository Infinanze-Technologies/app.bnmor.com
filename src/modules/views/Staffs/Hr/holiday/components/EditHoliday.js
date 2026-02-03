import { useEffect, useState } from "react";
import { Button, Select, Form, Input,InputNumber } from "antd";
const { Option } = Select;
import { URL_UPDATE_BRANCH, URL_UPDATE_DEPARTMENT, URL_UPDATE_HOLIDAY, URL_UPDATE_LEAVE, URL_UPDATE_TIMESHEET } from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import moment from 'moment'
import { DatePicker } from 'antd';
const dateFormat = 'Y-m-d';
const { TextArea } = Input;



const EditLeave = (props) => {
  const { jwt, setIsModalVisible, record, refetch,qryEmployeeData,qryAttrData } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [attr_type, setAttrType] = useState(record?.attribute_type);
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
 
 



  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
        // admin_status: record?.admin_status,
      });
    } catch (error) {
      console.log(error);
    }
  }, [props?.record]);
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);


  return (
    <>
  <Form  form={form} name="basic" size="middle">
        <div className="row">


        <div className="col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Occasion <span className="text-danger">*</span>
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

          
         

      
      </Form>
    </>
  );
};

export default EditLeave;
