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
import { URL_ADD_EMP_RESIGNATION, URL_ADD_RESIGNATION } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;

const AddResignation = (props) => {
  const { jwt, setIsModalVisible, refetch,qryEmployeeData,qryAttrData,employee_id } = props;
   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [getStartDate, setGetStartDate] = useState( dayjs().format(dateFormat))
  const [getEndDate, setGetEndDate] = useState( dayjs().format(dateFormat))

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
        "resignation_date":values?.start_date ? dayjs(values.start_date).format(dateFormat) : dayjs().format(dateFormat),
         "last_working_date":values?.end_date ? dayjs(values.end_date).format(dateFormat) : dayjs().format(dateFormat),
        "description": values?.description,
        "employee_id": employee_id,
        // "termination_type_id": values?.termination_type_id,
  
      }

      setIsloadingSubmit(true);
      postRequest(URL_ADD_EMP_RESIGNATION,{...data},jwt)
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
              Resignation Date <span className="text-danger">*</span>
              </label>
              <Form.Item
 name="start_date"
        rules={[
          {
            required: true,
            message: "Please input your date!",
          },
        ]}
      >
      <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width:'100%',height:'50px' }}
                  allowClear={false}
                />
      </Form.Item>
    </div>
    <Form.Item hidden={true} name="start_date">
              <Input />
            </Form.Item>
            </div>

              <div className="col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Last Working Day <span className="text-danger">*</span>
              </label>
              <Form.Item
 name="end_date"
        rules={[
          {
            required: true,
            message: "Please input your date!",
          },
        ]}
      >
       <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width:'100%',height:'50px' }}
                  allowClear={false}
                />
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

export default AddResignation;
