import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
 Card,
 Col,
 Row
} from "antd";
const { Option } = Select;
import { postRequest } from "@/hooks/apiService";
import {URL_ADD_ACCOUNTLIST, URL_ADD_PAYER } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomSelect from "@/components/form/CustomSelect";
import CustomInput from "@/components/form/CustomInput";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";


const AddPayees = (props) => {
  const { jwt, setIsModalVisible, refetch,qryBranchData } = props;
   const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);




 


  const onFinish =  (values) => {
    try {


      let data = {
        "name":values?.name,
        "branch_id": values?.branch_id,
        "contact_no": values?.contact_no
  
      }
      setIsloadingSubmit(true);
      postRequest(URL_ADD_PAYER,{...data},jwt)
        .then((res) => {
          refetch()
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
    <Form onFinish={onFinish} form={form} name="basic" layout="vertical">
        <Card type="inner" title="Add Payer" style={{ marginBottom: 24, borderRadius: 8 }}>
        <Row gutter={16}>


        

        <Col span={12} xs={24} md={24}>
          <CustomSelect
            label="Branch"
            name="branch_id"
            placeholder="Select Branch"
            options={qryBranchData?.map((item) => ({ value: item?.branch_id, label: item?.name }))}
            rules={[{
              required: true,
              message: "Please input your branch!",
            }]}
          />
         
          </Col>




          <Col span={12} xs={24} md={24}>
           <CustomInput
            label="Payer Name"
            name="name"
            placeholder="Enter Payer Name"
            rules={[{
              required: true,
              message: "Please input your name!",
            }]}
          />
          </Col>



          <Col span={12} xs={24} md={24}>
       <CustomInput
            label="Payer Contact"
            name="contact_no"
            placeholder="Enter Payee Contact"
            rules={[{
              required: true,
              message: "Please input your contact_no!",
            }]}
          />
          </Col>



          </Row>


          <Col span={12} xs={24} md={24}>
            <div className="d-flex justify-content-end">
                <div className="d-grid">
                  <div className="d-flex justify-content-end submit_buttom mt-4 w-100">
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        loading={isloadingSubmit}
                        {...BUTTON_CONFIGS.SAVE_BUTTON()}
                        size="small"
                        shape="round"
                        
                      >
                        {isloadingSubmit ? 'Loading...' : 'Save'}   
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Col>
      </Card>
      </Form>
    </>
  );
};

export default AddPayees;
