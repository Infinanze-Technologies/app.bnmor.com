import { useEffect, useState } from "react";
import { Button, Select, Form, Input,InputNumber } from "antd";
const { Option } = Select;
import { URL_UPDATE_BRANCH, URL_UPDATE_DEPARTMENT, URL_UPDATE_EMP_TIMESHEET, URL_UPDATE_TIMESHEET } from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import moment from 'moment'
import { DatePicker } from 'antd';
const dateFormat = 'Y-m-d';
const { TextArea } = Input;



const EditTimeSheet = (props) => {
  const { jwt, setIsModalVisible, record, refetch,qryEmployeeData,employee_id } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [attr_type, setAttrType] = useState(record?.attribute_type);
  const [getDate, setGeDate] = useState( moment().format(dateFormat))


  const handleChangeDate = (date, dateString) => {
    setGeDate(dateString)
  }

  form.setFieldsValue({
    start_date :getDate
 
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
      "start_date": typeof(values?.set_dob) == 'undefined' ? record?.start_date : values?.start_date,
      "remark": values?.remark,
      "employee_id": employee_id,
      "hours": values?.hours,

    }

    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_EMP_TIMESHEET, record?.timesheet_id, { ...data }, jwt)
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
                Date <span className="text-danger">*</span>
              </label>
              <Form.Item
 name="set_dob"
      
      >
        <DatePicker
      onChange={(date, dateString) =>
                    handleChangeDate(date, dateString)
                  }
                  defaultValue={moment(record?.start_date)}
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

export default EditTimeSheet;
