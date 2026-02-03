import { useState } from "react";
import {
  Button,
  Form,
  Card,
  Col,
  Row
} from "antd";
import dayjs from 'dayjs';

// Hooks
import { getRequest, postRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";

// Components
import CustomSelect from "@/components/form/CustomSelect";
import CustomInput from "@/components/form/CustomInput";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
// Config
import { URL_ADD_BANK_TRANSFER, URL_BRANCH_ACCOUNT_LIST } from "@/config/api-paths";

// Constants
const DATE_FORMAT = 'YYYY-MM-DD';

const AddBankTransfer = (props) => {
  // Props destructuring
  const { 
    jwt, 
    setIsModalVisible, 
    refetch, 
    qryBranchData, 
    qryAttrPaymentType 
  } = props;

  // Hooks
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const { toastError } = useToastMessage();
  const [form] = Form.useForm();

  // State management
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [isloadingQry, setIsloadingQry] = useState(false);
  const [fromBranchId, setFromBranchId] = useState(0);
  const [toBranchId, setToBranchId] = useState(0);
  const [fromAccountList, setFromAccountList] = useState([]);
  const [toAccountList, setToAccountList] = useState([]);

  // ==================== EVENT HANDLERS ====================
  
  /**
   * Handle from branch selection change
   * @param {string|number} id - Branch ID
   */
  const handleChangeFromAccountList = (id) => {
    console.log('From Branch ID received:', id, 'Type:', typeof id);

    // Reset form fields
    form.setFieldsValue({ 
      from_bank_account: undefined
    });

    if (id === 0 || id === '0' || !id) {
      // Clear data when no branch selected
      setFromAccountList([]);
      setFromBranchId(0);
    } else {
      // Fetch data for selected branch
      setFromBranchId(id);
      fetchFromAccountListByBranchId(id);
    }
  };

  /**
   * Handle to branch selection change
   * @param {string|number} id - Branch ID
   */
  const handleChangeToAccountList = (id) => {
    console.log('To Branch ID received:', id, 'Type:', typeof id);

    // Reset form fields
    form.setFieldsValue({ 
      to_bank_account: undefined
    });

    if (id === 0 || id === '0' || !id) {
      // Clear data when no branch selected
      setToAccountList([]);
      setToBranchId(0);
    } else {
      // Fetch data for selected branch
      setToBranchId(id);
      fetchToAccountListByBranchId(id);
    }
  };

  // ==================== API FUNCTIONS ====================
  
  /**
   * Fetch from account list by branch ID
   * @param {string|number} id - Branch ID
   */
  const fetchFromAccountListByBranchId = async (id) => {
    setIsloadingQry(true);
    
    try {
      const response = await getRequest(`${URL_BRANCH_ACCOUNT_LIST}/${id}`, jwt);
      console.log('From Account List Response:', response.data);
      
      // Ensure we always set an array
      const accountData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);
      
      setFromAccountList(accountData);
      return accountData;
    } catch (error) {
      console.log('From Account List Error:', error);
      setFromAccountList([]);
    } finally {
      setIsloadingQry(false);
    }
  };

  /**
   * Fetch to account list by branch ID
   * @param {string|number} id - Branch ID
   */
  const fetchToAccountListByBranchId = async (id) => {
    setIsloadingQry(true);
    
    try {
      const response = await getRequest(`${URL_BRANCH_ACCOUNT_LIST}/${id}`, jwt);
      console.log('To Account List Response:', response.data);
      
      // Ensure we always set an array
      const accountData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);
      
      setToAccountList(accountData);
      return accountData;
    } catch (error) {
      console.log('To Account List Error:', error);
      setToAccountList([]);
    } finally {
      setIsloadingQry(false);
    }
  };

  // ==================== FORM HANDLERS ====================
  
  /**
   * Handle form submission
   * @param {Object} values - Form values
   */
  const onFinish = async (values) => {
    try {
      // Validation checks
      if (fromBranchId === null || fromBranchId === 0 || fromBranchId === '') {
        return toastError("From Branch is required");
      }

      if (toBranchId === null || toBranchId === 0 || toBranchId === '') {
        return toastError("To Branch is required");
      }

      if (values?.from_branch === null || values?.from_branch === 0 || values?.from_branch === '') {
        return toastError("From branch is required");
      }

      if (values?.to_branch === null || values?.to_branch === 0 || values?.to_branch === '') {
        return toastError("To Branch is required");
      }

      if (values?.from_bank_account === null || values?.from_bank_account === 0 || values?.from_bank_account === '') {
        return toastError("From Account is required");
      }

      if (values?.to_bank_account === null || values?.to_bank_account === 0 || values?.to_bank_account === '') {
        return toastError("To Account is required");
      }

      if (values?.from_branch === values?.to_branch) {
        return toastError("From and To Branch cannot be the same");
      }

      const data = {
        from_branch: values?.from_branch,
        to_branch: values?.to_branch,
        from_bank_account: values?.from_bank_account,
        to_bank_account: values?.to_bank_account,
        paid_on: values?.start_date 
          ? dayjs(values.start_date).format(DATE_FORMAT) 
          : dayjs().format(DATE_FORMAT),
        amount: values?.amount,
        payment_method_id: values?.payment_method_id,
        ref_code: values?.ref_code,
        description: values?.description
      };

      setIsloadingSubmit(true);
      
      const response = await postRequest(URL_ADD_BANK_TRANSFER, data, jwt);
      
      // Handle success
      refetch();
      handleRequestResponse(response);
      setIsModalVisible(false);
      
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsloadingSubmit(false);
    }
  };

  // ==================== RENDER HELPERS ====================
  
  /**
   * Get branch options for dropdown
   */
  const getBranchOptions = () => {
    return qryBranchData?.map((item) => ({ 
      value: item?.branch_id, 
      label: item?.name 
    })) || [];
  };

  /**
   * Get from account options for dropdown
   */
  const getFromAccountOptions = () => {
    return Array.isArray(fromAccountList) 
      ? fromAccountList.map((item) => ({ 
          value: item?.account_id, 
          label: item?.name 
        })) 
      : [];
  };

  /**
   * Get to account options for dropdown
   */
  const getToAccountOptions = () => {
    return Array.isArray(toAccountList) 
      ? toAccountList.map((item) => ({ 
          value: item?.account_id, 
          label: item?.name 
        })) 
      : [];
  };

  /**
   * Get payment method options for dropdown
   */
  const getPaymentMethodOptions = () => {
    return qryAttrPaymentType?.map((item) => ({ 
      value: item?.attribute_id, 
      label: item?.name 
    })) || [];
  };

  // ==================== RENDER ====================
  
  return (
    <Form onFinish={onFinish} form={form} name="basic" layout="vertical">
      <Card type="inner" title="Add Bank Transfer" style={{ marginBottom: 24, borderRadius: 8 }}>
        <Row gutter={16}>
          {/* From Branch Selection */}
          <Col span={12} xs={24} md={12}>
            <CustomSelect
              label="From Branch"
              name="from_branch"
              placeholder="Select From Branch"
              options={getBranchOptions()}
              rules={[{
                required: true,
                message: "Please select a from branch!",
              }]}
              onChange={handleChangeFromAccountList}
            />
          </Col>

          {/* From Account Selection */}
          <Col span={12} xs={24} md={12}>
            <CustomSelect
              label="From Account"
              name="from_bank_account"
              placeholder="Select From Account"
              options={getFromAccountOptions()}
              rules={[{
                required: true,
                message: "Please select a from account!",
              }]}
            />
          </Col>

          {/* To Branch Selection */}
          <Col span={12} xs={24} md={12}>
            <CustomSelect
              label="To Branch"
              name="to_branch"
              placeholder="Select To Branch"
              options={getBranchOptions()}
              rules={[{
                required: true,
                message: "Please select a to branch!",
              }]}
              onChange={handleChangeToAccountList}
            />
          </Col>

          {/* To Account Selection */}
          <Col span={12} xs={24} md={12}>
            <CustomSelect
              label="To Account"
              name="to_bank_account"
              placeholder="Select To Account"
              options={getToAccountOptions()}
              rules={[{
                required: true,
                message: "Please select a to account!",
              }]}
            />
          </Col>

          {/* Amount Input */}
          <Col span={12} xs={24} md={12}>
            <CustomInput
              label="Amount"
              name="amount"
              placeholder="Enter amount"
              rules={[{
                required: true,
                message: "Please enter the amount!",
              }]}
            />
          </Col>

          {/* Date Selection */}
          <Col span={12} xs={24} md={12}>
            <CustomDatePicker
              label="Date"
              name="start_date"
              placeholder="Select date"
              rules={[{
                required: true,
                message: "Please select a date!",
              }]}
            />
          </Col>

          {/* Payment Method Selection */}
          <Col span={12} xs={24} md={12}>
            <CustomSelect
              label="Payment Method"
              name="payment_method_id"
              placeholder="Select Payment Method"
              options={getPaymentMethodOptions()}
              rules={[{
                required: true,
                message: "Please select a payment method!",
              }]}
            />
          </Col>

          {/* Reference Code Input */}
          <Col span={12} xs={24} md={12}>
            <CustomInput
              label="Reference Code"
              name="ref_code"
              placeholder="Enter reference code"
              rules={[{
                required: true,
                message: "Please enter a reference code!",
              }]}
            />
          </Col>

          {/* Description TextArea */}
          <Col span={24} xs={24} md={24}>
            <CustomTextArea
              label="Description"
              name="description"
              placeholder="Enter description (optional)"
              rules={[{
                required: false,
                message: "Please enter a description!",
              }]}
            />
          </Col>

          {/* Submit Button */}
          <Col span={24} xs={24} md={24}>
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
        </Row>
      </Card>
    </Form>
  );
};

export default AddBankTransfer;