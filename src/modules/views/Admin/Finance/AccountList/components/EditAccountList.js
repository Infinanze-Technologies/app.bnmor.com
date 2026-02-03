import { useEffect, useState } from "react";
import { Button, Form,  Card, Col, Row } from "antd";

import { URL_UPDATE_ACCOUNTLIST, URL_UPDATE_BRANCH, URL_UPDATE_DEPARTMENT, URL_UPDATE_TIMESHEET } from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomInput from "@/components/form/CustomInput";
import CustomNumberInput from "@/components/form/CustomNumberInput";
import CustomSelect from "@/components/form/CustomSelect";

import { BUTTON_CONFIGS } from "@/utils/buttonStyles";


const EditAccountList = (props) => {
  const { jwt, setIsModalVisible, record, refetch,qryBranchData } = props;
  const { handleRequestError,handleRequestResponse} = useHandleResponse()
  const [form] = Form.useForm();
  const [attr_type, setAttrType] = useState(record?.attribute_type);







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
      "initial_balance": values?.initial_balance,
      "account_number": values?.account_number,
      "branch_code": values?.branch_code,
      "bank_branch": values?.bank_branch,
      "account_number": values?.account_number

    }

  

    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_ACCOUNTLIST, record?.account_id, { ...data }, jwt)
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
          <Card type="inner" title="Edit Account List" style={{ marginBottom: 24, borderRadius: 8 }}>
          <Row gutter={16}>


        

<Col span={12} xs={24} md={24}>
<CustomSelect
  label="Branch"
  name="branch_id"
  placeholder="Select Branch"
  options={qryBranchData?.map((item) => ({ value: item?.branch_id, label: item?.name }))}
  rules={[
    {
      required: true,
      message: "Please input your branch!",
    },
  ]}
/>
</Col>



<Col span={12} xs={24} md={24}>
<CustomInput
label="Account Name"
name="name"
placeholder="Enter account name"
rules={[
  {
    required: true,
    message: "Please input your account name!",
  },
]}
/>
</Col>

<Col span={12} xs={24} md={24}>

<CustomNumberInput
label="Initial Balance"
name="initial_balance"
placeholder="Enter initial balance"
rules={[
  {
    required: true,
    message: "Please input your initial balance!",
  },
]}
/>
</Col>



<Col span={12} xs={24} md={24}>
<CustomInput
  label="Account Number"
  name="account_number"
  placeholder="Enter account number"
  rules={[
    {
      required: true,
      message: "Please input your account number!",
    },
  ]}
/>
</Col>


<Col span={12} xs={24} md={24}>
<CustomInput
  label="Branch Code"
  name="branch_code"
  placeholder="Enter branch code"
  rules={[
    {
      required: true,
      message: "Please input your branch code!",
    },
  ]}
/>
</Col>





<Col span={12} xs={24} md={24}>
<CustomInput
  label="Bank Branch"
  name="bank_branch"
  placeholder="Enter bank branch"
  rules={[
    {
      required: true,
      message: "Please input your bank branch!",
    },
  ]}
/>
</Col>



</Row>



          <Col span={12} xs={24} md={24}>
            <div className="d-flex justify-content-end">
                <div className="d-grid">
                  <div className="d-flex justify-content-end submit_buttom mt-4 w-100">
                    <Form.Item>
                      <Button
                        {...BUTTON_CONFIGS.SAVE_BUTTON()}
                        loading={isloadingSubmit}
                        htmlType="submit"
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

export default EditAccountList;
