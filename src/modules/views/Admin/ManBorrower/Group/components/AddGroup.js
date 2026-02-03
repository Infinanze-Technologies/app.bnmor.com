import { useState } from "react";
import { Button, Form } from "antd";
import { postRequest } from "@/hooks/apiService";
  import { URL_ADD_GROUP } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import CustomInput from '@/components/form/CustomInput';
import CustomTextArea from '@/components/form/CustomTextArea';
import CustomSelect from '@/components/form/CustomSelect';
import CustomNumberInput from '@/components/form/CustomNumberInput';
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const AddGroup = (props) => {
  const { jwt, setIsModalVisible, refetch,forceRefetch,QryBranchDataObject } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);


  
  // Transform branch data for CustomSelect
  const branchOptions = (QryBranchDataObject?.data || []).map(branch => ({
    value: branch.branch_id,
    label: branch.name
  }));
  console.log("Transformed branch options:", branchOptions);

  const onFinish = async (values) => {
    try {
     
      setIsloadingSubmit(true);
      postRequest(URL_ADD_GROUP, { ...values }, jwt)
        .then(async (res) => {
          setIsloadingSubmit(false);
          await forceRefetch();
          handleRequestResponse(res);
          setIsModalVisible(false);
        })
        .finally(() => {
         
          setIsloadingSubmit(false);
        })
        .catch((err) => {
          handleRequestError(err);
        });
    } catch (error) {
      setIsloadingSubmit(false);
    
    }
  };

  return (
    <>
      <Form onFinish={onFinish} form={form} name="basic" size="middle" layout="vertical" className="mt-4">
        <CustomInput
          label={<span>Name </span>}
          name="name"
          rules={[{ required: true, message: "Please input your group name!" }]}
          placeholder="Enter group name"
        />
     
      
     {/* <CustomNumberInput
          label="Min Number of Borrowers"
          name="min_members"
          placeholder="Enter min number of borrowers"
          rules={[{ required: false, message: "Please input your min number of borrowers!" }]}
        /> */}


     
        <CustomNumberInput
          label="Max Number of Borrowers"
          name="max_members"
          placeholder="Enter max number of borrowers"
          rules={[{ required: false, message: "Please input your max number of borrowers!" }]}
        />
      

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
          label="Description"
          name="description"
          placeholder="Enter group description (optional)"
          rules={[]}
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

export default AddGroup;
