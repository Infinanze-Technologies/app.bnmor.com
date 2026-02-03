import { useEffect, useState } from "react";
import { Button, Select, Form, Input,InputNumber,Col,Card,Row } from "antd";
const { Option } = Select;
import { URL_LEAVE_STATUS} from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomSelect from "@/components/form/CustomSelect";



const LeaveStatus = (props) => {
  const { jwt, setIsModalVisible, record, refetch,forceRefetch } = props;
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
  const onFinish = async (values) => {


    setIsloadingSubmit(true);
    updateRequest(URL_LEAVE_STATUS, record?.leave_id, { ...values }, jwt)
      .then(async (res) => {
        setIsloadingSubmit(false);
        handleRequestResponse(res);
        await forceRefetch();
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
  <Card type="inner" title="Leave Status" style={{ marginBottom: 24, borderRadius: 8 }}>  
    <Row gutter={16}>

<Col span={12} xs={24} md={24}>
<CustomSelect
      
        name="holiday_status"
        placeholder="Select Status"
        options={[
          { value: "Pending", label: "Pending" },
          { value: "Approved", label: "Approved" },
          { value: "Reject", label: "Reject" },
        ]}
        rules={[
          {
            required: true,
            message: "Please input your status!",
          },
        ]}
     
      />


     </Col>




 </Row>





       




        


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
        </Card>
      </Form>
    </>
  );
};

export default LeaveStatus;
