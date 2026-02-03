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
import { URL_ADD_EXPENSES, URL_BRANCH_ACCOUNT_LIST, URL_BRANCH_PAYEE } from "@/config/api-paths";

// Constants
const DATE_FORMAT = 'YYYY-MM-DD';

const AddExpense = (props) => {
  // Props destructuring
  const { 
    jwt, 
    setIsModalVisible, 
    refetch, 
    qryBranchData, 
    qryAttrData, 
    qryAttrPaymentType,
    CoaForExpensesData
  } = props;

  // Hooks
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const { toastError } = useToastMessage();
  const [form] = Form.useForm();

  // State management
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [isloadingQry, setIsloadingQry] = useState(false);
  const [branchId, setBranchId] = useState(0);
  const [getAccountList, setGetAccountList] = useState([]);
  const [getPayer, setGetPayers] = useState([]);
  let coaForExpensesData = CoaForExpensesData?.data;
  // ==================== EVENT HANDLERS ====================
  
  /**
   * Handle branch selection change
   * @param {string|number} id - Branch ID
   */
  const handleChangeAccountList = (id) => {
    console.log('Branch ID received:', id, 'Type:', typeof id);

    // Reset form fields
    form.setFieldsValue({ 
      bank_account_id: undefined, 
      payee_id: undefined 
    });

    if (id === 0 || id === '0' || !id) {
      // Clear data when no branch selected
      setGetAccountList([]);
      setGetPayers([]);
      setBranchId(0);
    } else {
      // Fetch data for selected branch
      setBranchId(id);
      fetchAccountListByBranchId(id);
      fetchPayeesByBranchId(id);
    }
  };

  // ==================== API FUNCTIONS ====================
  
  /**
   * Fetch account list by branch ID
   * @param {string|number} id - Branch ID
   */
  const fetchAccountListByBranchId = async (id) => {
    setIsloadingQry(true);
    
    try {
      const response = await getRequest(`${URL_BRANCH_ACCOUNT_LIST}/${id}`, jwt);
      console.log('Account List Response:', response.data);
      
      // Ensure we always set an array
      const accountData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);
      
      setGetAccountList(accountData);
      return accountData;
    } catch (error) {
      console.log('Account List Error:', error);
      setGetAccountList([]);
    } finally {
      setIsloadingQry(false);
    }
  };

  /**
   * Fetch payees by branch ID
   * @param {string|number} id - Branch ID
   */
  const fetchPayeesByBranchId = async (id) => {
    setIsloadingQry(true);
    
    try {
      const response = await getRequest(`${URL_BRANCH_PAYEE}/${id}`, jwt);
      console.log('Payees Response:', response.data);
      
      // Ensure we always set an array
      const payeesData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);
      
      setGetPayers(payeesData);
      return payeesData;
    } catch (error) {
      console.log('Payees Error:', error);
      setGetPayers([]);
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
      const data = {
        paid_on: values?.start_date 
          ? dayjs(values.start_date).format(DATE_FORMAT) 
          : dayjs().format(DATE_FORMAT),
        coa_cash_id: values?.coa_cash_id,
        amount: values?.amount,
        expense_type_id: values?.expense_type_id,
        payee_id: values?.payee_id,
        branch_id: values?.branch_id,
        payment_method_id: values?.payment_method_id,
        ref_code: values?.ref_code,
        description: values?.description
      };

      setIsloadingSubmit(true);
      
      const response = await postRequest(URL_ADD_EXPENSES, data, jwt);
      
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
   * Get account options for dropdown
   */
  const getAccountOptions = () => {
    return Array.isArray(getAccountList) 
      ? getAccountList.map((item) => ({ 
          value: item?.account_id, 
          label: item?.name 
        })) 
      : [];
  };

  /**
   * Get payee options for dropdown
   */
  const getPayeeOptions = () => {
    return Array.isArray(getPayer) 
      ? getPayer.map((item) => ({ 
          value: item?.payee_id, 
          label: item?.name 
        })) 
      : [];
  };

  /**
   * Get category options for dropdown
   */
  const getCategoryOptions = () => {
    return qryAttrData?.map((item) => ({ 
      value: item?.attribute_id, 
      label: item?.name 
    })) || [];
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
      <Card type="inner" title="Add Expense" style={{ marginBottom: 24, borderRadius: 8 }}>
        <Row gutter={16}>
          {/* Branch Selection */}
          <Col span={12} xs={24} md={12}>
            <CustomSelect
              label="Branch"
              name="branch_id"
              placeholder="Select Branch"
              options={getBranchOptions()}
              rules={[{
                required: true,
                message: "Please select a branch!",
              }]}
              onChange={handleChangeAccountList}
            />
          </Col>

          {/* Account Selection */}
          <Col span={12} xs={24} md={12}>
            <CustomSelect
              label="Funding Account"
              name="coa_cash_id"
              placeholder="Select Funding Account"
              options={coaForExpensesData?.map((item) => ({ value: item?.id, label: item?.acc_name }))}
              rules={[{
                required: true,
                message: "Please select a Funding Account!",
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

          {/* Category Selection */}
          <Col span={12} xs={24} md={12}>
            <CustomSelect
              label="Category"
              name="expense_type_id"
              placeholder="Select Category"
              options={getCategoryOptions()}
              rules={[{
                required: true,
                message: "Please select a category!",
              }]}
            />
          </Col>

          {/* Payee Selection */}
          <Col span={12} xs={24} md={12}>
            <CustomSelect
              label="Payee"
              name="payee_id"
              placeholder="Select Payee"
              options={getPayeeOptions()}
              rules={[{
                required: true,
                message: "Please select a payee!",
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

export default AddExpense;