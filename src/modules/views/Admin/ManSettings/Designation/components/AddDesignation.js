import { useEffect, useState } from "react";
import { Button, Select, Form, Card, Row, Col } from "antd";
import CustomInput from "@/components/form/CustomInput";
import { postRequest } from "@/hooks/apiService";
import { URL_ADD_DESIGNATION } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomSelect from "@/components/form/CustomSelect";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const { Option } = Select;

const AddDesignation = (props) => {
  const { jwt, setIsModalVisible, refetch, qryDepartmentData,forceRefetch } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);

  const onFinish = async (values) => {
    try {
      setIsloadingSubmit(true);
      postRequest(URL_ADD_DESIGNATION, { ...values }, jwt)
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
        name="addDesignation"
        onFinish={onFinish}
        layout="vertical"
      >
        <Card type="inner" title="Add Designation" style={{ marginBottom: 24, borderRadius: 8 }}>

      <Row gutter={16}>
          <Col span={24} md={24}>
           <CustomSelect
              label="Department"
              name="department_id"
              options={qryDepartmentData?.map((item) => ({ value: item?.department_id, label: item?.name }))}
              placeholder="Select department"
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
                  shape="round"
                  {...BUTTON_CONFIGS.SAVE_BUTTON()}
                  size="small"
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

export default AddDesignation;
