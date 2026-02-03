import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Card,
  Col,
  Row
} from "antd";
import dayjs from 'dayjs';

// Hooks
import { getRequest, updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";

// Components
import CustomSelect from "@/components/form/CustomSelect";
import CustomInput from "@/components/form/CustomInput";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomTextArea from "@/components/form/CustomTextArea";

// Config
import { URL_BRANCH_ACCOUNT_LIST, URL_BRANCH_PAYER, URL_UPDATE_DEPOSIT } from "@/config/api-paths";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
// Constants
const DATE_FORMAT = 'YYYY-MM-DD';



const EditDeposit = (props) => {
  // Props destructuring
  const { 
    jwt, 
    setIsModalVisible, 
    record, 
    refetch, 
    qryBranchData, 
    qryAttrData, 
    qryAttrPaymentType,
    CoaForDepositsData
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
  let coaForDepositsData = CoaForDepositsData?.data;

  // ==================== EVENT HANDLERS ====================
  
  /**
   * Handle branch selection change
   * @param {string|number} id - Branch ID
   */
  const handleChangeAccountList = (id) => {
    console.log('Branch ID received:', id, 'Type:', typeof id);

    // Reset form fields
    form.setFieldsValue({ 
      payer_id: undefined 
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
      fetchPayersByBranchId(id);
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
   * Fetch payers by branch ID
   * @param {string|number} id - Branch ID
   */
  const fetchPayersByBranchId = async (id) => {
    setIsloadingQry(true);
    
    try {
      const response = await getRequest(`${URL_BRANCH_PAYER}/${id}`, jwt);
      console.log('Payers Response:', response.data);
      
      // Ensure we always set an array
      const payersData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);
      
      setGetPayers(payersData);
      return payersData;
    } catch (error) {
      console.log('Payers Error:', error);
      setGetPayers([]);
    } finally {
      setIsloadingQry(false);
    }
  };



  // ==================== EFFECTS ====================
  
  useEffect(() => {
    if (record) {
      try {
        form.setFieldsValue({
          ...record,
          start_date: record?.paid_on ? dayjs(record.paid_on) : undefined
        });
        setBranchId(record?.branch_id);
        fetchAccountListByBranchId(record?.branch_id);
        fetchPayersByBranchId(record?.branch_id);
      } catch (error) {
        console.log('Error setting form values:', error);
      }
    }
  }, [record]);

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
          : record?.paid_on,
        coa_id: values?.coa_id,
        amount: values?.amount,
        income_type_id: values?.income_type_id,
        payer_id: values?.payer_id,
        branch_id: values?.branch_id,
        payment_method_id: values?.payment_method_id,
        ref_code: values?.ref_code,
        description: values?.description
      };

      setIsloadingSubmit(true);
      
      const response = await updateRequest(URL_UPDATE_DEPOSIT, record?.deposit_id, data, jwt);
      
      // Handle success
      handleRequestResponse(response);
      refetch();
      setIsModalVisible(false);
      
    } catch (error) {
      handleRequestError(error);
      console.log('Update error:', error?.response?.data?.error);
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
   * Get payer options for dropdown
   */
  const getPayerOptions = () => {
    return Array.isArray(getPayer) 
      ? getPayer.map((item) => ({ 
          value: item?.payer_id, 
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
      <Card type="inner" title="Edit Deposit" style={{ marginBottom: 24, borderRadius: 8 }}>
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

          <Col span={12} xs={24} md={12}>
            <CustomSelect
              label="Funding Account"
              name="coa_id"
              placeholder="Select Funding Account"
              options={coaForDepositsData?.map((item) => ({ value: item?.id, label: item?.acc_name }))}
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
              name="income_type_id"
              placeholder="Select Category"
              options={getCategoryOptions()}
              rules={[{
                required: true,
                message: "Please select a category!",
              }]}
            />
          </Col>
   





          {/* Payer Selection */}
          <Col span={12} xs={24} md={12}>
            <CustomSelect
              label="Payer"
              name="payer_id"
              placeholder="Select Payer"
              options={getPayerOptions()}
              rules={[{
                required: true,
                message: "Please select a payer!",
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

export default EditDeposit;
