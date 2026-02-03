import { useEffect, useState } from "react";
import { Button, Select, Form, Input,InputNumber } from "antd";
const { Option } = Select;
import { URL_UPDATE_AWARD, URL_UPDATE_BRANCH, URL_UPDATE_DEPARTMENT, URL_UPDATE_LEAVE, URL_UPDATE_TIMESHEET } from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;



const EditAward = (props) => {
  const { jwt, setIsModalVisible, record, refetch,qryEmployeeData,qryAttrData } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();

  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
        // Map the created_on field to the date picker
        award_date: record?.created_on ? dayjs(record?.created_on) : null,
      });
    } catch (error) {
      console.log(error);
    }
  }, [props?.record, form]);
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
                Award Type <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="award_type_id"
                rules={[
                  {
                    required: true,
                    message: "Please input your award type!",
                  },
                ]}
              >
                               <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Select Award Type"
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
                 Date <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="award_date"
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
          </div>


            <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Gift <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="gift"
                rules={[
                  {
                    required: true,
                    message: "Please input your gift!",
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

export default EditAward;
