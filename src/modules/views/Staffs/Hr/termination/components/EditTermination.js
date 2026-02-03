import { useEffect, useState } from "react";
import { Button, Select, Form, Input,InputNumber } from "antd";
const { Option } = Select;
import { URL_UPDATE_AWARD, URL_UPDATE_BRANCH, URL_UPDATE_DEPARTMENT, URL_UPDATE_LEAVE, URL_UPDATE_TERMINATION, URL_UPDATE_TIMESHEET } from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import moment from 'moment'
import { DatePicker } from 'antd';
const dateFormat = 'Y-m-d';
const { TextArea } = Input;



const EditTermination = (props) => {
  const { jwt, setIsModalVisible, record, refetch,qryEmployeeData,qryAttrData } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
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




             <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Termination Type <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="termination_type_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your termination type!",
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
                Notice Date <span className="text-danger">*</span>
              </label>
              <Form.Item
 name="date1"
      
      >
        <DatePicker
      onChange={(date, dateString) =>
        handleChangeStartDate(date, dateString)
                  }

                  defaultValue={moment(record?.notice_date)}
               
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
                  defaultValue={moment(record?.termination_date)}
               
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

export default EditTermination;
