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
import {URL_ADD_AWARD } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;

const AddAward = (props) => {
  const { jwt, setIsModalVisible, refetch,qryEmployeeData,qryAttrData } = props;
   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  const onFinish = (values) => {
  
    try {
      let data = {
        "award_date": values?.award_date ? dayjs(values.award_date).format(dateFormat) : dayjs().format(dateFormat),
        "description": values?.description,
        "gift": values?.gift,
        "employee_id": values?.employee_id,
        "award_type_id": values?.attribute_id,
      }

      console.log('Staffs AddAward submitting data:', data);

      setIsloadingSubmit(true);
      postRequest(URL_ADD_AWARD,{...data},jwt)
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
                >
                  { qryEmployeeData?.map((item,index)=> 
                    <Option value={item?.employee_id} key={index}>{item?.fullname}</Option>
                  )}
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
                name="attribute_id"
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
                    <Option value={item?.attribute_id} key={index}>{item?.name}</Option>
                  )}
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

export default AddAward;
