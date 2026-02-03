import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
} from "antd";
const { Option } = Select;
import { postRequest } from "@/hooks/apiService";
import { URL_CREATE_MEMBER } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import moment from 'moment'
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker
const dateFormat = 'Y-m-d';

const AddAdmin = (props) => {
  const { jwt, setIsModalVisible, AdminDataObject,RoleDataObject } = props;
   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [getdob, setGetDob] = useState( moment().format(dateFormat))

  let
   {
data,
loading,
refetchEntity
  } = RoleDataObject


  const handleChangeDate = (date, dateString) => {
    setGetDob(dateString)
  }


  form.setFieldsValue({
    dob: getdob,
 
  })

  const onFinish =  (values) => {
    try {

      // console.log(values);
      // console.log(getdob);
      // return;
      setIsloadingSubmit(true);
      postRequest(URL_CREATE_MEMBER,{...values},jwt)
        .then((res) => {
          // console.log(res?.response)
          setIsloadingSubmit(false);
          handleRequestResponse(res)
     
          setIsModalVisible(false);
        }).finally(() => {
          AdminDataObject.refetch();
          setIsloadingSubmit(false);
        })
        .catch((err) => {
          // console.log(err?.response);
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
                Nane <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            </div>
          </div>

        
          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Email <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <input className="form-control" type="emaill" />
              </Form.Item>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Address <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your address!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Phone Number <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="contact_no"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone_number!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            </div>
          </div>


          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Gender <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Please select gender!",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Select Gender"
                  optionFilterProp="children"   
                >
              <Option value= 'male' key={1}>Male</Option>
              <Option value='female' key={2}>Female</Option>
                  
                </Select>
              </Form.Item>
            </div>
          </div>


     
          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Religion <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="religion"
                rules={[
                  {
                    required: true,
                    message: "Please select religion!",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Select Religion"
                  optionFilterProp="children"   
                >
              <Option value= 'christianity' key={1}>Christianity</Option>
              <Option value='islam' key={2}>Islam</Option>
              <Option value='buddhism' key={3}>Buddhism</Option>
              <Option value='hinduism' key={3}>Binduism</Option>
                  
                </Select>
              </Form.Item>
            </div>
          </div>


          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Username <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone_number!",
                  },
                ]}
              >
                <Input className="form-control" type="text" />
              </Form.Item>
            </div>
          </div>




          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
                Password <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input className="form-control" type="password" />
              </Form.Item>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="form-group custom-select">
              <label className="col-form-label">
               Member Type <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="member_type_id"
                rules={[
                  {
                    required: true,
                    message: "Please select member_type!",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Select Role"
                  optionFilterProp="children"   
                >
                { data?.data?.map((item,index)=> 

                  <>
                  <Option value={item?.id} key={index}>{item?.name}</Option>
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
               Status <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Please select status!",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="Select Status"
                  optionFilterProp="children"   
                >
              <Option value={true} key={1}>Active</Option>
              <Option value={false} key={2}>Inactive</Option>
                  
                </Select>
              </Form.Item>
            </div>
          </div>



          <div className="col-sm-12">
            <div className="form-group custom-select">
              <label className="col-form-label">
                 Date Of Birth <span className="text-danger">*</span>
              </label>
              <Form.Item
             name="date"
                rules={[
                  {
                    required: true,
                    message: "Please input your dob!",
                  },
                ]}
              >
                <DatePicker
              onChange={(date, dateString) =>
                            handleChangeDate(date, dateString)
                          }
                       
                  style={{ width:'100%',height:'50px' }}/>
              </Form.Item>
            </div>
            <Form.Item hidden={true} name="dob">
                      <Input />
                    </Form.Item>
          </div>

     

         

          <div className="col-12">
            <div className="row">
              <div className="col-sm-6 col-md-3 offset-md-9">
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
          </div>
        </div>
      </Form>
    </>
  );
};

export default AddAdmin;
