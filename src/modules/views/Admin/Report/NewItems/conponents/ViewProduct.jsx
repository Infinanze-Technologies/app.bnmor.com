import { useEffect, useState } from "react";
import { Button, Select, Form, Input } from "antd";
const { Option } = Select;
const { TextArea } = Input

import { formatDateHuman } from '@/config/DateFormat';

const ViewProduct = (props) => {
  const { record } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
        pro_status : record?.pro_status == 'active' ? 'Approved' : record?.status == 'review' ? 'On Review' : 'Rejected',
        cat: record?.cat?.title,
        subcat: record?.sub_cat?.title,
        region: record?.region?.name,
        city: record?.city?.name,
        created_at: formatDateHuman(record?.created_at),
        subscribe: record?.subscribe?.name,
        customer: record?.customer?.first_name +' '+ record?.customer?.last_name
  
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
                 Prodcut Name 
              </label>
              <Form.Item
                name="pro_name"
             
              >
                <Input className="form-control" type="text"  disabled/>
              </Form.Item>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Prodcut Category 
              </label>
              <Form.Item
                name="cat"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Prodcut SubCategory  
              </label>
              <Form.Item
                name="subcat"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Prodcut Price 
              </label>
              <Form.Item
                name="pro_price"
               
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
                 Prodcut Status 
              </label>
              <Form.Item
                name="pro_status"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>


          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Prodcut Stock 
              </label>
              <Form.Item
                name="stock"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>



          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Subscribe 
              </label>
              <Form.Item
                name="subscribe"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>



          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Youtube Link 
              </label>
              <Form.Item
                name="youtube_link"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>


          
          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
            CreatedBy 
              </label>
              <Form.Item
                name="customer"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>
          
          
          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
              CreatedAt 
              </label>
              <Form.Item
                name="created_at"
               
              >
                <Input className="form-control" type="text" disabled/>
              </Form.Item>
            </div>
          </div>

          <div className="col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
              Description 
              </label>
              <Form.Item
                name="pro_despt"
               
              >
                <TextArea className="form-control" disabled   autoSize={{ minRows: 2, maxRows: 6 }}/>
              </Form.Item>
            </div>
          </div>







        </div>
      </Form>
    </>
  )
}

export default ViewProduct