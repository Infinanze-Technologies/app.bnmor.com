import { useEffect, useState } from "react";
import { Button, Select, Form, Input,InputNumber } from "antd";
const { Option } = Select;
import { URL_EMP_LEAVE_STATUS, URL_LEAVE_STATUS} from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";




const TerminationStatus = (props) => {
  const { jwt, setIsModalVisible, record, refetch } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();

 



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


    setIsloadingSubmit(true);
    updateRequest(URL_EMP_LEAVE_STATUS, record?.leave_id, { ...values }, jwt)
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
                Status <span className="text-danger">*</span>
              </label>
              <Form.Item
                name="leave_status"
                rules={[
                  {
                    required: true,
                    message: "Please input your status!",
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
      <Option value="Pending" key={0}>Pending</Option>
      <Option value="Approved" key={1}>Approved</Option>
      <Option value="Reject" key={0}>Reject</Option>
                  
                </Select>
              </Form.Item>
            </div>
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

export default TerminationStatus;
