import { useEffect, useState } from "react";
import { Button, Select, Form, Input,InputNumber } from "antd";
const { Option } = Select;
import {URL_UPDATE_EMP_RESIGNATION, URL_UPDATE_RESIGNATION} from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
  import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;



const EditResignation = (props) => {
  const { jwt, setIsModalVisible, record, refetch,qryEmployeeData,qryAttrData,employee_id } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
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
      "resignation_date": typeof(values?.start_date) == 'undefined' ? record?.resignation_date : dayjs(values.start_date).format(dateFormat),
      "last_working_date": typeof(values?.end_date) == 'undefined' ? record?.last_working_date : dayjs(values.end_date).format(dateFormat),
      "description": values?.description,
      "employee_id": employee_id,
      // "termination_type_id": values?.termination_type_id,

    }
    // console.log('====================================');
    // console.log(data);
    // console.log('====================================');

  

    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_EMP_RESIGNATION, record?.resignation_id, { ...data }, jwt)
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

    



             {/* <div className="col-sm-6">
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
    */}


    


          <div className="col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Resignation Date <span className="text-danger">*</span>
              </label>
              <Form.Item
 name="start_date"
      
      >
        <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width:'100%',height:'50px' }}
                  allowClear={false}
                />

                  defaultValue={moment(record?.resignation_date)}
               
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
      
      >
        <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width:'100%',height:'50px' }}
                  allowClear={false}
                />
                  defaultValue={moment(record?.last_working_date)}
               
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

export default EditResignation;
