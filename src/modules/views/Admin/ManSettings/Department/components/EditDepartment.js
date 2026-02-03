import { useEffect, useState } from "react";
import { Button, Select, Form, Card, Row, Col } from "antd";
import CustomInput from "@/components/form/CustomInput";
import { URL_UPDATE_DEPARTMENT } from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomSelect from "@/components/form/CustomSelect";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const { Option } = Select;

const EditDepartment = (props) => {
  const { jwt, setIsModalVisible, record, refetch, qryBranchData,forceRefetch } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [attr_type, setAttrType] = useState(record?.attribute_type);

  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
      });
    } catch (error) {
      console.log(error);
    }
  }, [props?.record]);

  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  
  const onFinish = async (values) => {
    setIsloadingSubmit(true);
    updateRequest(URL_UPDATE_DEPARTMENT, record?.id, { ...values }, jwt)
      .then(async (res) => {
        setIsloadingSubmit(false);
        handleRequestResponse(res);
        await forceRefetch();
        setIsModalVisible(false);
      })
      .catch((err) => {
        handleRequestError(err);
        setIsloadingSubmit(false);
      });
  };

  return (
    <Form
        form={form}
        name="editDepartment"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Edit Department" style={{ marginBottom: 24, borderRadius: 8 }}>   
      <Row gutter={16}>
          <Col span={24} md={24}>
          <CustomSelect
              label="Branch"
              name="branch_id"
              options={qryBranchData?.map((item) => ({ value: item?.branch_id, label: item?.name }))}
              placeholder="Select branch"
            />
          </Col>

          <Col span={24} md={24}>
            <CustomInput
              label="Name"
              name="name"
              placeholder="Enter name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            />
          </Col>

          <Col span={24} md={24}>
            <CustomSelect
              label="Status"
              name="status"
              options={[{ value: true, label: 'Active' }, { value: false, label: 'Inactive' }]}
              placeholder="Select status"
            />
          </Col>
          
          <Col span={24} md={24}>
            <div className="d-flex justify-content-end">
              <Form.Item>
                <Button
                  loading={isloadingSubmit}

                  {...BUTTON_CONFIGS.SAVE_BUTTON()}
                  size="small"
                  shape="round"
                  htmlType="submit"
                >
                  {isloadingSubmit ? 'Loading...' : 'Save'}     
                </Button>
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default EditDepartment;
