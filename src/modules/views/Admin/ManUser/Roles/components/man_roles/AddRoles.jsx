import { useEffect, useState } from "react";
import {
  Button,
  Form,
  message,
} from "antd";
import { postRequest } from "@/hooks/apiService";
import { URL_CREATE_ROLE } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const AddRoles = (props) => {
  const { 
    jwt, 
    setIsModalVisible, 
    RoleDataObject,
    forceRefetch
  } = props;
  
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  // Status options for the select field
  const statusOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" }
  ];

  // Reset form when modal opens
  useEffect(() => {
    form.resetFields();
  }, [form]);

  const onFinish = async (values) => {
  
    try {
      setIsLoadingSubmit(true);
      
      await postRequest(URL_CREATE_ROLE, { data: values }, jwt).then(async (res) => {
        await forceRefetch();
        handleRequestResponse(res);
        setIsModalVisible(false);
        form.resetFields();
      }).catch((err) => {
        handleRequestError(err);
      }).finally(() => {
        setIsLoadingSubmit(false);
      });
      
      
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  return (
    <div className="add-roles-form">
      <Form 
        onFinish={onFinish} 
        form={form} 
        name="addRoleForm" 
        size="middle"
        layout="vertical"
      >
        <div className="row">
          <div className="col-sm-12">
            <CustomInput
              label={
                <span>
                  Name <span className="text-danger">*</span>
                </span>
              }
              name="name"
              placeholder="Enter role name"
              rules={[
                {
                  required: true,
                  message: "Please enter a role name!",
                },
                {
                  min: 2,
                  message: "Role name must be at least 2 characters long!",
                },
                {
                  max: 50,
                  message: "Role name cannot exceed 50 characters!",
                },
              ]}
              inputProps={{
                maxLength: 50,
                type: "text"
              }}
            />
          </div>

          <div className="col-sm-12">
            <CustomSelect
              label={
                <span>
                  Status <span className="text-danger">*</span>
                </span>
              }
              name="status"
              placeholder="Select Status"
              options={statusOptions}
              rules={[
                {
                  required: true,
                  message: "Please select a status!",
                },
              ]}
            />
          </div>

          <div className="col-12">
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              
              <Button
              {...BUTTON_CONFIGS.SAVE_BUTTON()}
              htmlType="submit"
              loading={isLoadingSubmit}
              size="small"
              shape="round"
           
            >
             Save
            </Button>


              
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddRoles;
