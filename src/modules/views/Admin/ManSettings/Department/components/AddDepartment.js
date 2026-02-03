import { useEffect, useState } from "react";
import { Button, Select, Form, Card, Row, Col } from "antd";
import CustomInput from "@/components/form/CustomInput";
import { postRequest } from "@/hooks/apiService";
import { URL_ADD_DEPARTMENT } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomSelect from "@/components/form/CustomSelect";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const { Option } = Select;

const AddDepartment = (props) => {
  const { jwt, setIsModalVisible, refetch, qryBranchData,forceRefetch } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  const onFinish = async (values) => {
    try {
      setIsloadingSubmit(true);
      postRequest(URL_ADD_DEPARTMENT, { ...values }, jwt)
        .then(async (res) => {
          await forceRefetch()
          setIsloadingSubmit(false);
          handleRequestResponse(res)
          setIsModalVisible(false);
          await forceRefetch()
        }).finally(() => {
        
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
          <Form
        form={form}
        name="addDepartment"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Add Department" style={{ marginBottom: 24, borderRadius: 8 }}>
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

export default AddDepartment;
