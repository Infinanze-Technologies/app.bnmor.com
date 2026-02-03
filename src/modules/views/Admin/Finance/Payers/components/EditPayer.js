import { useEffect, useState } from "react";
import { Button, Select, Form, Card, Col, Row } from "antd";
const { Option } = Select;
import { URL_UPDATE_ACCOUNTLIST, URL_UPDATE_BRANCH, URL_UPDATE_DEPARTMENT, URL_UPDATE_PAYER, URL_UPDATE_TIMESHEET } from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomSelect from "@/components/form/CustomSelect";
import CustomInput from "@/components/form/CustomInput";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
  



const EditPayees = (props) => {
  const { jwt, setIsModalVisible, record, refetch,qryBranchData } = props;
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


    let data = {
      "name":values?.name,
      "branch_id": values?.branch_id,
      "contact_no": values?.contact_no,
    }

  

    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_PAYER, record?.payer_id, { ...data }, jwt)
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
         <Form onFinish={onFinish} form={form} name="basic" layout="vertical">
        <Card type="inner" title="Edit Payer" style={{ marginBottom: 24, borderRadius: 8 }}>
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
            placeholder="Enter Payer Contact"
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

export default EditPayees;
