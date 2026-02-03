import { useEffect, useState } from "react";
import { Button, Select, Form, Input } from "antd";
const { Option } = Select;
const { TextArea } = Input
const ViewCustomer = (props) => {
  const { record } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
        region: record?.region?.name,
        city: record?.city?.name
  
      });
    } catch (error) {
      console.log(error);
    }
  }, [props?.record]);
  
  return (
    <>
            <Form  form={form} name="basic" size="middle">
        <div className="row">

  

          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 First Name 
              </label>
              <Form.Item
                name="first_name"
                rules={[
                  {
                    required: true,
                    message: "Please input your title!",
                  },
                ]}
              >
                <Input className="form-control" type="text"  disabled/>
              </Form.Item>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Last Name 
              </label>
              <Form.Item
                name="last_name"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Email 
              </label>
              <Form.Item
                name="email"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Address 
              </label>
              <Form.Item
                name="address"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>




          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Region 
              </label>
              <Form.Item
                name="region"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Phone Number 
              </label>
              <Form.Item
                name="contact_no"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>



          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              City 
              </label>
              <Form.Item
                name="city"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>



          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Provider 
              </label>
              <Form.Item
                name="provider"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>



          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
             Account Status 
              </label>
              <Form.Item
                name="status"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>
          







        </div>
      </Form>
    </>
  )
}

export default ViewCustomer