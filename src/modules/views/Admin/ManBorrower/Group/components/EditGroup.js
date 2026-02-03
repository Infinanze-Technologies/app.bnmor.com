import { useEffect, useState } from "react";
import { Button, Form } from "antd";
import { URL_UPDATE_GROUP } from "@/config/api-paths";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomInput from '@/components/form/CustomInput';
import CustomTextArea from '@/components/form/CustomTextArea';
import CustomSelect from '@/components/form/CustomSelect';
import CustomNumberInput from '@/components/form/CustomNumberInput';
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const EditGroup = (props) => {
  const { jwt, setIsModalVisible, record, refetch,forceRefetch,QryBranchDataObject } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();

  // Debug logging to see what data we're getting
  // console.log("EditGroup props:", props);
  // console.log("QryBranchDataObject:", QryBranchDataObject);
  // console.log("Branch data:", QryBranchDataObject?.data);
  //   console.log("Branch data length:", QryBranchDataObject?.data?.length);
    
  // Transform branch data for CustomSelect
  const branchOptions = (QryBranchDataObject?.data || []).map(branch => ({
    value: branch.branch_id,
    label: branch.name
  }));
  console.log("Transformed branch options:", branchOptions);

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
    updateRequest(URL_UPDATE_GROUP, record?.group_id, { ...values }, jwt)
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
    <>
      <Form onFinish={onFinish} form={form} name="basic" size="middle" layout="vertical" className="mt-4">
        <CustomInput
          label={<span>Group Name </span>}
          name="name"
          rules={[{ required: true, message: "Please input your group name!" }]}
          placeholder="Enter group name"
        />
      
     
          <CustomNumberInput
          label="Max Number of Borrowers"
          name="max_members"
          placeholder="Enter max number of borrowers"
          rules={[{ required: false, message: "Please input your max number of borrowers!" }]}
        />
     
        {/* <CustomNumberInput
          label="Min Number of Borrowers"
          name="min_members"
          placeholder="Enter min number of borrowers"
          rules={[{ required: false, message: "Please input your min number of borrowers!" }]}
        /> */}
        {/* <CustomSelect
          label="Status"
          name="status"
          options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]}
          placeholder="Select status"
        /> */}


        <CustomSelect
          label="Branch"
          name="branch_id"
          options={branchOptions}
          placeholder="Select branch"
        />
        <CustomSelect
          label="Status"
          name="status"
          options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }, { value: 'Suspended', label: 'Suspended' }]}
          placeholder="Select status"
        />

<CustomTextArea
          label="Group Description"
          name="description"
          placeholder="Enter group description"
          rules={[{ required: false, message: "Please input your description!" }]}
        />
          <div className="d-flex justify-content-end submit_buttom mt-4 w-100">
          <Form.Item>
          <Button
  {...BUTTON_CONFIGS.SAVE_BUTTON()}
  htmlType="submit"
  loading={isloadingSubmit}
  size="small"
  shape="round"

>
 Save
</Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default EditGroup;
