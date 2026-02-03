import { useEffect, useState } from "react";
import { Button, Select, Form, Input,InputNumber } from "antd";
const { Option } = Select;
import { URL_UPDATE_BRANCH, URL_UPDATE_DEPARTMENT, URL_UPDATE_EMP_LEAVE, URL_UPDATE_LEAVE, URL_UPDATE_TIMESHEET } from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import moment from 'moment'
import { DatePicker } from 'antd';
const dateFormat = 'Y-m-d';
const { TextArea } = Input;



const EditLeave = (props) => {
  const { jwt, setIsModalVisible, record, refetch,qryEmployeeData,qryAttrData,employee_id } = props;
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
  const onFinish = (values) => {

    let data = {
      "start_date": typeof(values?.date1) == 'undefined' ? record?.start_date : values?.start_date,
      "end_date": typeof(values?.date2) == 'undefined' ? record?.end_date : values?.end_date,
      "reason": values?.reason,
      "remark": values?.remark,
      "employee_id":employee_id,
      "leave_type_id": values?.leave_type_id,

    }

  

    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_EMP_LEAVE, record?.leave_id, { ...data }, jwt)
      .then((res) => {
        setIsloadingSubmit(false);
        handleRequestResponse(res);
        refetch();
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
  <Form onFinish={onFinish} form={form} name="basic" size="middle">
        <div className="row">

        <div className="col-sm-12">
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
          </div>




             <div className="col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Leave Type <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="leave_type_id"
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

export default EditLeave;
