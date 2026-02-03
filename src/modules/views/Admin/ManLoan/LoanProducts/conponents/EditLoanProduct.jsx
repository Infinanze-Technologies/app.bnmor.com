import { useState, useEffect } from "react";
import {
  Button,
  Select,
  Form,
  Input,
  Upload,
  Modal,
  DatePicker,
  Card,
  Row,
  Col,
  Tooltip,
  message,
  Spin,
  Switch,
  InputNumber,
  Divider
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import moment from "moment";
import { updateRequest } from "@/hooks/apiService";
import { URL_UPDATE_LOAN_PRODUCT, URL_GET_CASH_FUNDING_ACCOUNTS, URL_GET_COA_FOR_LOANS, URL_GET_FUNDING_BRANCHES } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useFetchQuery from "@/hooks/ReactQuery/useFetchQuery";


const { Option } = Select;
const { TextArea } = Input;

const dateFormat = "YYYY-MM-DD";

const toBase64 = file =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const EditLoanProduct = (props) => {
  let jwt = props?.jwt;
  let record = props?.record;
  let refetch = props?.refetch;
  let setIsModalVisible = props?.setIsModalVisible;
  
  const [form] = Form.useForm();
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [loading, setLoading] = useState(false);
  const [feesModalVisible, setFeesModalVisible] = useState(false);
  const [configuredFees, setConfiguredFees] = useState([]);
  const [editingFee, setEditingFee] = useState(null);
  const [latePenaltyEnabled, setLatePenaltyEnabled] = useState(true);
  const [feeType, setFeeType] = useState('Percentage');
  const [penaltyType, setPenaltyType] = useState('Percentage');
  const [durationType, setDurationType] = useState('Fixed');
  const [durationPeriod, setDurationPeriod] = useState('Months');
  const [selectedFundingAccount, setSelectedFundingAccount] = useState(null);
  const [feeForm] = Form.useForm();

  // Fetch account data
  const CashFundingAccountsData = useFetchQuery({
    url: URL_GET_CASH_FUNDING_ACCOUNTS,
    jwt: jwt,
    tableKey: "CashFundingAccounts"
  });

  const CoaForLoansData = useFetchQuery({
    url: URL_GET_COA_FOR_LOANS,
    jwt: jwt,
    tableKey: "CoaForLoans"
  });

  // Fetch branch funding data based on selected funding account
  const BranchFundingData = useFetchQuery({
    url: selectedFundingAccount ? `${URL_GET_FUNDING_BRANCHES}/${selectedFundingAccount}` : null,
    jwt: jwt,
    tableKey: "BranchFunding",
    enabled: !!selectedFundingAccount
  });

  // Initialize form with existing record data
  useEffect(() => {
    if (record) {
      // Set form values from existing record
      form.setFieldsValue({
        product_title: record.product_title,
        description: record.description,
        duration_period: record.duration_period,
        duration_type: record.duration_type,
        loan_duration_months: record.loan_duration_months,
        min_loan_duration: record.min_loan_duration,
        max_loan_duration: record.max_loan_duration,
        min_principal_amount: record.min_principal_amount,
        max_principal_amount: record.max_principal_amount,
        interest_method: record.interest_method,
        interest_rate: record.interest_rate,
        interest_cycle: record.interest_cycle,
        repayment_cycle: record.repayment_cycle,
        accounts: {
          funding_account: record.accounts?.funding_account,
          funding_branch_id: record.accounts?.funding_branch_id,
          loans_receivable_account: record.accounts?.loans_receivable_account,
          interest_income_account: record.accounts?.interest_income_account,
          fees_income_account: record.accounts?.fees_income_account,
          penalty_income_account: record.accounts?.penalty_income_account,
          overpayment_account: record.accounts?.overpayment_account
        }
      });
      
      // Set other state values
      setLatePenaltyEnabled(record.late_repayment_penalty?.enabled || true);
      setConfiguredFees(record.fees || []);
      setDurationType(record.duration_type || 'Fixed');
      setDurationPeriod(record.duration_period || 'Months');
      
      // Set funding account for branch funding
      if (record.accounts?.funding_account) {
        setSelectedFundingAccount(record.accounts.funding_account);
      }
    }
  }, [record, form]);

  // Replace all Select, Input, and DatePicker components' style props to use a consistent style
  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };
  const SELECT_PROPS = {
    showSearch: true,
    filterOption: (input, option) =>
      (option?.children ?? '').toLowerCase().includes(input.toLowerCase()),
    dropdownMatchSelectWidth: true,
    className: 'custom-select-field',
    style: FIELD_STYLE,
  };

  // Handle fee configuration
  const handleAddFee = () => {
    setEditingFee(null);
    setFeesModalVisible(true);
    feeForm.setFieldsValue({
      calculate_on: "Principal Amount",
      percentage: undefined,
      amount: undefined,
      deduct_from_principal: false,
      spread_across_repayments: false
    });
    setFeeType('Percentage'); // or 'Fixed' if you want
  };

  const handleEditFee = (fee) => {
    setEditingFee(fee);
    setFeesModalVisible(true);
    feeForm.setFieldsValue({
      name: fee.name,
      calculate_on: fee.calculate_on || (fee.type === 'Fixed' ? 'Fixed Amount' : 'Principal Amount'),
      percentage: fee.percentage,
      amount: fee.amount,
      deduct_from_principal: fee.deduct_from_principal,
      spread_across_repayments: fee.spread_across_repayments
    });
    setFeeType(fee.type);
  };

  const handleFeeSave = (values) => {
    // Ensure calculate_on is set for Fixed fees
    const feeData = {
      ...values,
      type: feeType,
      calculate_on: feeType === 'Fixed' ? 'Fixed Amount' : values.calculate_on
    };

    if (editingFee) {
      // Update existing fee
      const updatedFees = configuredFees.map(fee => 
        fee.id === editingFee.id 
          ? { ...fee, ...feeData }
          : fee
      );
      setConfiguredFees(updatedFees);
      message.success('Fee updated successfully');
    } else {
      // Add new fee
      const newFee = {
        id: Date.now(),
        ...feeData
      };
      setConfiguredFees([...configuredFees, newFee]);
      message.success('Fee configured successfully');
    }
    setFeesModalVisible(false);
    feeForm.resetFields();
    setEditingFee(null);
  };

  const handleFeeCancel = () => {
    setFeesModalVisible(false);
    feeForm.resetFields();
    setEditingFee(null);
  };

  const removeFee = (feeId) => {
    setConfiguredFees(configuredFees.filter(fee => fee.id !== feeId));
    message.success('Fee removed successfully');
  };

  // Form submit handler
  const onFinish = async values => {
    setLoading(true);

    try {
      // Additional validation for mutually exclusive fee options
      if (values.deduct_from_principal && values.spread_across_repayments) {
        message.error("You can only select one of 'Deduct from principal amount' or 'Spread across repayments'.");
        setLoading(false);
        return;
      }

      // Format/prepare data for API
      const data = {
        ...values,
        interest_configuration: {
          method: values.interest_method,
          rate: Number(values.interest_rate),
          cycle: values.interest_cycle,
          repayment_cycle: values.repayment_cycle
        },
        fees: configuredFees.map(fee => ({
          ...fee,
          percentage: fee.percentage ? Number(fee.percentage) : undefined,
          amount: fee.amount ? Number(fee.amount) : undefined,
          deduct_from_principal: !!fee.deduct_from_principal,
          spread_across_repayments: !!fee.spread_across_repayments
        })),
        late_repayment_penalty: {
          enabled: latePenaltyEnabled,
          ...values.late_repayment_penalty
        }
      };

      // Final validation (example: min < max)
      if (data.min_principal_amount > data.max_principal_amount) {
        message.error("Minimum principal amount cannot be greater than maximum.");
        setLoading(false);
        return;
      }

      // Update loan product via API
      const response = await updateRequest({
        url: `${URL_UPDATE_LOAN_PRODUCT}/${record.id}`,
        data: data,
        jwt: jwt
      });

      if (response?.statusCode === 200) {
        handleRequestResponse(response);
        message.success("Loan product updated successfully");
        setIsModalVisible(false);
        refetch(); // Refresh the table data
      } else {
        handleRequestError(response);
      }
    } catch (error) {
      console.error("Error updating loan product:", error);
      message.error("Failed to update loan product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Card
        title={<span style={{ fontSize: 24, fontWeight: 700, color: "#2a3f54" }}>Edit Loan Product</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            duration_period: "Months",
            duration_type: "Fixed",
            interest_method: "Flat",
            interest_cycle: "Once",
            repayment_cycle: "Once",
            accounts: {
              funding_account: "",
              funding_branch_id: "",
              loans_receivable_account: "",
              interest_income_account: "",
              fees_income_account: "",
              penalty_income_account: "",
              overpayment_account: ""
            }
          }}
        >
          {/* Basic Product Information */}
          <Card type="inner" title="Basic Product Information" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Product Title <span className="text-danger">*</span>
                    </span>
                  }
                  name="product_title"
                  rules={[{ required: true, message: "Product title is required" }]}
                >
                  <Input placeholder="Enter product title" style={FIELD_STYLE} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Duration Period <span className="text-danger">*</span>
                    </span>
                  }
                  name="duration_period"
                  rules={[{ required: true, message: "Duration period is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select duration period" 
                    className="custom-select"
                    onChange={(value) => setDurationPeriod(value)}
                  >
                    <Option value="Days">Days</Option>
                    <Option value="Weeks">Weeks</Option>
                    <Option value="Months">Months</Option>
                    <Option value="Years">Years</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Duration Type <span className="text-danger">*</span>
                    </span>
                  }
                  name="duration_type"
                  rules={[{ required: true, message: "Duration type is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select duration type" 
                    className="custom-select"
                    onChange={(value) => setDurationType(value)}
                  >
                    <Option value="fixed">Fixed Duration</Option>
                    <Option value="flexible">Flexible Duration</Option>
                  </Select>
                </Form.Item>
              </Col>
              {durationType === 'fixed' ? (
                <Col xs={24} lg={24}>
                  <Form.Item
                    label={
                      <span>
                        Loan Duration in {durationPeriod} <span className="text-danger">*</span>
                      </span>
                    }
                    name="loan_duration_months"
                    rules={[
                      { required: true, message: "Loan duration is required" },
                      { type: 'number', min: 1, max: 360, message: `Duration must be between 1 and 360 ${durationPeriod.toLowerCase()}` }
                    ]}
                  >
                    <InputNumber
                      className="custom-number-input"
                      placeholder={`Enter duration in ${durationPeriod.toLowerCase()}`}
                      style={FIELD_STYLE}
                      min={1}
                      max={360}
                    />
                  </Form.Item>
                </Col>
              ) : (
                <>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      label={
                        <span>
                          Minimum Loan Duration in {durationPeriod} <span className="text-danger">*</span>
                        </span>
                      }
                      name="min_loan_duration"
                      rules={[
                        { required: true, message: "Minimum loan duration is required" },
                        { type: 'number', min: 1, max: 360, message: `Minimum duration must be between 1 and 360 ${durationPeriod.toLowerCase()}` }
                      ]}
                    >
                      <InputNumber
                        className="custom-number-input"
                        placeholder={`Enter minimum duration in ${durationPeriod.toLowerCase()}`}
                        style={FIELD_STYLE}
                        min={1}
                        max={360}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      label={
                        <span>
                          Maximum Loan Duration in {durationPeriod} <span className="text-danger">*</span>
                        </span>
                      }
                      name="max_loan_duration"
                      rules={[
                        { required: true, message: "Maximum loan duration is required" },
                        { type: 'number', min: 1, max: 360, message: `Maximum duration must be between 1 and 360 ${durationPeriod.toLowerCase()}` },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                              const minDuration = getFieldValue('min_loan_duration');
                            if (!value || !minDuration || value >= minDuration) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Maximum duration must be greater than or equal to minimum duration'));
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        className="custom-number-input"
                        placeholder={`Enter maximum duration in ${durationPeriod.toLowerCase()}`}
                        style={FIELD_STYLE}
                        min={1}
                        max={360}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col xs={24}>
                <Form.Item
                  label={
                    <span>
                      Description <span style={{ color: '#999', fontSize: '12px' }}>Optional</span>
                    </span>
                  }
                  name="description"
                >
                  <TextArea 
                    placeholder="Enter product description" 
                    rows={6}
                    style={{ borderRadius: 10 }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Principal Amount */}
          <Card type="inner" title="Principal Amount" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <span>
                      Minimum Principal Amount <span className="text-danger">*</span>
                    </span>
                  }
                  name="min_principal_amount"
                  rules={[{ required: true, message: "Minimum principal amount is required" }]}
                >
                  <InputNumber
                    className="custom-number-input"
                    placeholder="Enter minimum amount"
                    style={FIELD_STYLE}
                    min={1}
                    // addonBefore="GH₵"
                    addonAfter="GHS"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <span>
                      Maximum Principal Amount <span className="text-danger">*</span>
                    </span>
                  }
                  name="max_principal_amount"
                  rules={[{ required: true, message: "Maximum principal amount is required" }]}
                >
                  <InputNumber
                    className="custom-number-input"
                    placeholder="Enter maximum amount"
                    style={FIELD_STYLE}
                    min={1}
                    // addonBefore="GH₵"
                    addonAfter="GHS"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

                    {/* Interest Configuration */}
          <Card type="inner" title="Interest Configuration" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <Tooltip title="The method used to calculate interest on the loan amount" placement="top" color="white">
                      <span>
                        Interest Method <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name="interest_method"
                  rules={[{ required: true, message: "Interest method is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select interest method" 
                    className="custom-select"
                  >
                    <Option value="flat">Flat Interest</Option>
                    <Option value="reducing">Reducing Balance</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <Tooltip title="The annual interest rate percentage applied to the loan" placement="top" color="white">
                      <span>
                        Interest Rate <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name="interest_rate"
                  rules={[
                    { required: true, message: "Interest rate is required" },
                    { type: 'number', min: 0, max: 100, message: "Interest rate must be between 0 and 100%" },
                    { validator: (_, value) => {
                      if (value && value > 50) {
                        return Promise.reject('Interest rate seems unusually high. Please verify.');
                      }
                      return Promise.resolve();
                    }}
                  ]}
                >
                  <InputNumber
                    className="custom-number-input"
                    placeholder="Enter interest rate"
                    style={FIELD_STYLE}
                    min={0}
                    max={100}
                    addonAfter="%"
                    step={0.01}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <Tooltip title="How often interest is calculated and applied to the loan" placement="top" color="white">
                      <span>
                        Interest Cycle <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name="interest_cycle"
                  rules={[{ required: true, message: "Interest cycle is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select interest cycle" className="custom-select">
                    <Option value="once">Once</Option>
                    <Option value="daily">Per Day</Option>
                    <Option value="weekly">Per Week</Option>
                    <Option value="monthly">Per Month</Option>
                    <Option value="annually">Per Year</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <Tooltip title="How often the borrower needs to make repayments" placement="top" color="white">
                      <span>
                        Repayment Cycle <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name="repayment_cycle"
                  rules={[{ required: true, message: "Repayment cycle is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select repayment cycle" className="custom-select">
                    <Option value="once">Once</Option>
                    <Option value="daily">Daily</Option>
                    <Option value="weekly">Weekly</Option>
                    <Option value="monthly">Monthly</Option>
                    <Option value="yearly">Yearly</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Fees Configuration */}
          <Card type="inner" title="Fees" style={{ marginBottom: 24, borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: 0, color: '#666' }}>Configure loan fees</h4>
            </div>
            
            {configuredFees.length === 0 ? (
              <div style={{ 
                border: '2px dashed #d9d9d9', 
                borderRadius: 8, 
                padding: 40, 
                textAlign: 'center',
                backgroundColor: '#fafafa'
              }}>
                <p style={{ color: '#666', marginBottom: 16 }}>No fees configured yet. Add your first fee below.</p>
                <Button type="primary" onClick={handleAddFee} style={{ borderRadius: 8 }}>
                  + Add Fees
                </Button>
              </div>
            ) : (
              <div>
                {configuredFees.map((fee, index) => (
                  <Card 
                    key={fee.id} 
                    size="small" 
                    style={{ marginBottom: 8, borderRadius: 8 }}
                    extra={
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button 
                          type="text" 
                          size="small"
                          onClick={() => handleEditFee(fee)}
                          style={{ color: '#1890ff' }}
                        >
                          Edit
                        </Button>
                        <Button 
                          type="text" 
                          danger 
                          size="small"
                          onClick={() => removeFee(fee.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    }
                  >
                    <Row gutter={[16, 8]} align="middle">
                      <Col xs={24} lg={6}>
                        <strong>{fee.name}</strong>
                      </Col>
                      <Col xs={24} lg={4}>
                        <span style={{ color: '#666' }}>
                          {fee.type === 'percentage' ? `${fee.percentage}%` : `GH₵ ${fee.amount}`}
                        </span>
                      </Col>
                      <Col xs={24} lg={8}>
                        <span style={{ color: '#666' }}>On: {fee.calculate_on}</span>
                      </Col>
                      <Col xs={24} lg={6}>
                        <span style={{ color: '#666' }}>{fee.type === 'percentage' ? 'Percentage' : 'Fixed'}</span>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button type="dashed" onClick={handleAddFee} style={{ width: '100%', marginTop: 8, borderRadius: 8 }}>
                  + Add More Fees
                </Button>
              </div>
            )}
          </Card>

          {/* Late Repayment Penalty */}
          <Card type="inner" title="Late Repayment Penalty" style={{ marginBottom: 24, borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: 0, color: '#666' }}>Configure the penalty for late repayments</h4>
            </div>
            
            <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
              <Col xs={24} lg={12}>
                <span>Enable Late Repayment Penalty</span>
              </Col>
              <Col xs={24} lg={12}>
                <Switch 
                  checked={latePenaltyEnabled} 
                  onChange={setLatePenaltyEnabled}
                  style={{ backgroundColor: latePenaltyEnabled ? '#722ed1' : '#d9d9d9' }}
                />
              </Col>
            </Row>

            {latePenaltyEnabled && (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={8}>
                    <Form.Item
                      label={
                        <span>
                          Penalty Type <span className="text-danger">*</span>
                        </span>
                      }
                      name={['late_repayment_penalty', 'penalty_type']}
                      rules={[{ required: latePenaltyEnabled, message: "Penalty type is required" }]}
                    >
                      <Select 
                        {...SELECT_PROPS} 
                        placeholder="Select penalty type" 
                        className="custom-select"
                        onChange={(value) => setPenaltyType(value)}
                      >
                        <Option value="fixed">Fixed Amount</Option>
                        <Option value="percentage">Percentage Based</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {penaltyType === 'percentage' && (
                    <Col xs={24} lg={8}>
                      <Form.Item
                        label={
                          <span>
                            Calculate Penalty On <span className="text-danger">*</span>
                          </span>
                        }
                        name={['late_repayment_penalty', 'calculate_penalty_on']}
                        rules={[{ required: latePenaltyEnabled, message: "Calculate penalty on is required" }]}
                      >
                        <Select {...SELECT_PROPS} placeholder="Select calculation basis" className="custom-select">
                          <Option value="Interest Amount">Interest Amount</Option>
                          <Option value="Principal Amount">Principal Amount</Option>
                          <Option value="Principal + Interest Amount">Principal + Interest Amount</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  <Col xs={24} lg={8}>
                    <Form.Item
                      label={
                        <span>
                          {penaltyType === 'percentage' ? 'Penalty Percentage' : 'Penalty Amount'} <span className="text-danger">*</span>
                        </span>
                      }
                      name={penaltyType === 'percentage' ? ['late_repayment_penalty', 'penalty_percentage'] : ['late_repayment_penalty', 'penalty_amount']}
                      rules={[{ required: latePenaltyEnabled, message: penaltyType === 'percentage' ? "Penalty percentage is required" : "Penalty amount is required" }]}
                    >
                      {penaltyType === 'percentage' ? (
                        <InputNumber
                          className="custom-number-input"
                          placeholder="Enter penalty percentage"
                          style={FIELD_STYLE}
                          min={0}
                          max={100}
                          addonAfter="%"
                          step={0.01}
                        />
                      ) : (
                        <InputNumber
                          className="custom-number-input"
                          placeholder="Enter penalty amount"
                          style={FIELD_STYLE}
                          min={0}
                          // addonBefore="GHC"
                          addonAfter="GHS"
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Form.Item
                      label={
                        <Tooltip title="The number of days to wait before a penalty fee is applied." placement="top" color="white">
                          <span>
                            Grace Period (Optional) <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                          </span>
                        </Tooltip>
                      }
                      name={['late_repayment_penalty', 'grace_period']}
                    >
                      <InputNumber
                        className="custom-number-input"
                        placeholder="Enter grace period"
                        style={FIELD_STYLE}
                        min={0}
                        addonAfter="days"
                        // addonBefore="Wait"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Form.Item
                      label={
                        <Tooltip title="How often the penalty is to be applied on the loan if overdue on a repayment." placement="top" color="white">
                          <span>
                            Recurring Penalty <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                          </span>
                        </Tooltip>
                      }
                      name={['late_repayment_penalty', 'recurring_penalty']}
                    >
                      <Select {...SELECT_PROPS} placeholder="Select recurring penalty" className="custom-select">
                        <Option value="once">Once</Option>
                        <Option value="daily">Daily</Option>
                        <Option value="weekly">Weekly</Option>
                        <Option value="biweekly">Biweekly</Option>
                        <Option value="monthly">Monthly</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Card>

          {/* Accounts Configuration */}
          <Card type="inner" title="Accounts" style={{ marginBottom: 24, borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: 0, color: '#666' }}>Configure journal accounts</h4>
            </div>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <Tooltip title="The account from which loan funds will be disbursed to borrowers" placement="top" color="white">
                      <span>
                        Funding Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name={['accounts', 'funding_account']}
                  rules={[{ required: true, message: "Funding account is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select funding account" 
                    className="custom-select"
                    loading={CashFundingAccountsData?.isLoading}
                    onChange={(value) => setSelectedFundingAccount(value)}
                  >
                    {CashFundingAccountsData?.data?.map((account) => (
                      <Option key={account.id} value={account.id}>
                        {account.acc_name} ({account.acc_code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {/* <p style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                  Select the source of the Principal Amount to be disbursed.
                </p> */}
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <Tooltip title="The specific branch funding account for loan disbursements" placement="top" color="white">
                      <span>
                        Branch Funding <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name={['accounts', 'funding_branch_id']}
                  rules={[{ required: true, message: "Branch funding is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select branch funding" 
                    className="custom-select"
                    loading={BranchFundingData?.isLoading}
                    disabled={!selectedFundingAccount}
                  >
                    {BranchFundingData?.data?.map((branch) => (
                      <Option key={branch.key} value={branch.key}>
                        {branch.name} - {branch.branch_name} ({branch.code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {/* <p style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                  Select the specific branch funding account for loan disbursements.
                </p> */}
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <Tooltip title="The asset account that tracks outstanding loan amounts owed by borrowers" placement="top" color="white">
                      <span>
                        Loans Receivable Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name={['accounts', 'loans_receivable_account']}
                  rules={[{ required: true, message: "Loans receivable account is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select loans receivable account" 
                    className="custom-select"
                    loading={CoaForLoansData?.isLoading}
                  >
                    {CoaForLoansData?.data?.map((account) => (
                      <Option key={account.id} value={account.id}>
                        {account.acc_name} ({account.acc_code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {/* <p style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                  The account that will be debited in the general ledger when the loan is disbursed.
                </p> */}
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <Tooltip title="The revenue account that records interest income earned from loan repayments" placement="top" color="white">
                      <span>
                        Default Interest Income Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name={['accounts', 'interest_income_account']}
                  rules={[{ required: true, message: "Interest income account is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select interest income account" 
                    className="custom-select"
                    loading={CoaForLoansData?.isLoading}
                  >
                    {CoaForLoansData?.data?.map((account) => (
                      <Option key={account.id} value={account.id}>
                        {account.acc_name} ({account.acc_code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {/* <p style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                  The account that will be credited in the general ledger when interest is received from payments.
                </p> */}
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <Tooltip title="The revenue account that records fee income earned from loan processing and administration" placement="top" color="white">
                      <span>
                        Default Fees Income Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name={['accounts', 'fees_income_account']}
                  rules={[{ required: true, message: "Fees income account is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select fees income account" 
                    className="custom-select"
                    loading={CoaForLoansData?.isLoading}
                  >
                    {CoaForLoansData?.data?.map((account) => (
                      <Option key={account.id} value={account.id}>
                        {account.acc_name} ({account.acc_code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {/* <p style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                  The account that will be credited in the general ledger when fees are received from payments.
                </p> */}
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <Tooltip title="The revenue account that records penalty income from late or missed loan repayments" placement="top" color="white">
                      <span>
                        Default Penalty Income Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name={['accounts', 'penalty_income_account']}
                  rules={[{ required: true, message: "Penalty income account is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select penalty income account" 
                    className="custom-select"
                    loading={CoaForLoansData?.isLoading}
                  >
                    {CoaForLoansData?.data?.map((account) => (
                      <Option key={account.id} value={account.id}>
                        {account.acc_name} ({account.acc_code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {/* <p style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                  The account that will be credited in the general ledger when penalty is received from payments.
                </p> */}
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <Tooltip title="The liability account that tracks excess payments made by borrowers beyond their loan obligations" placement="top" color="white">
                      <span>
                        Default Overpayment Account <span className="text-danger">*</span> <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                      </span>
                    </Tooltip>
                  }
                  name={['accounts', 'overpayment_account']}
                  rules={[{ required: true, message: "Overpayment account is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select overpayment account" 
                    className="custom-select"
                    loading={CoaForLoansData?.isLoading}
                  >
                    {CoaForLoansData?.data?.map((account) => (
                      <Option key={account.id} value={account.id}>
                        {account.acc_name} ({account.acc_code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {/* <p style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                  The account that will be credited in the general ledger when overpayment is received from payments.
                </p> */}
              </Col>
            </Row>
          </Card>

          <Form.Item style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              loading={loading}
              size="large"
              style={{ minWidth: 120 }}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>



      {/* Floating Chat Button */}
      <div style={{
        position: 'fixed',
        bottom: 80,
        right: 24,
        zIndex: 1001
      }}>
        <Button
          type="primary"
          shape="circle"
          size="large"
          style={{
            width: 56,
            height: 56,
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)'
          }}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          }
        />
      </div>

      {/* Configure Fee Modal */}
      <Modal
        title={editingFee ? "Edit Fee" : "Configure Fee"}
        open={feesModalVisible}
        onCancel={handleFeeCancel}
        footer={null}
        width={600}
      >
        <Form
          form={feeForm}
          layout="vertical"
          onFinish={handleFeeSave}
        >
          <Form.Item
            label={
              <span>
                Name <span className="text-danger">*</span>
              </span>
            }
            name="name"
            rules={[{ required: true, message: "Fee name is required" }]}
          >
            <Input placeholder="Enter fee name" style={FIELD_STYLE} />
          </Form.Item>

          <Form.Item label="Fee Type">
            <Row gutter={16}>
              <Col span={12}>
                <Card
                  hoverable
                  style={{
                    border: feeType === 'percentage' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                  onClick={() => setFeeType('percentage')}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, marginBottom: 8 }}>%</div>
                    <div style={{ fontWeight: 'bold' }}>Percentage Based</div>
                    <div style={{ fontSize: 12, color: '#666' }}>Based on principal amount</div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  hoverable
                  style={{
                    border: feeType === 'fixed' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                  onClick={() => setFeeType('fixed')}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, marginBottom: 8 }}>$</div>
                    <div style={{ fontWeight: 'bold' }}>Fixed Amount</div>
                    <div style={{ fontSize: 12, color: '#666' }}>Fixed one-time charge</div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Form.Item>

          {feeType === 'percentage' && (
            <>
              <Form.Item
                label={
                  <span>
                    Calculate Fee On <span className="text-danger">*</span>
                  </span>
                }
                name="calculate_on"
                rules={[{ required: true, message: "Please select what to calculate fee on" }]}
              >
                <Select {...SELECT_PROPS} placeholder="Select calculation basis" className="custom-select">
                  <Option value="Principal Amount">Principal Amount</Option>
                  <Option value="Interest Amount">Interest Amount</Option>
                  <Option value="Principal + Interest Amount">Principal + Interest Amount</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Fee Percentage <span className="text-danger">*</span>
                  </span>
                }
                name="percentage"
                rules={[{ required: true, message: "Fee percentage is required" }]}
              >
                <InputNumber
                  placeholder="Enter percentage"
                  style={FIELD_STYLE}
                  min={0}
                  max={100}
                  addonAfter="%"
                  step={0.01}
                />
              </Form.Item>
            </>
          )}

          {feeType === 'Fixed' && (
            <>
              {/* Hidden field for calculate_on when fee type is Fixed */}
              <Form.Item name="calculate_on" style={{ display: 'none' }}>
                <Input value="Fixed Amount" />
              </Form.Item>
              
              <Form.Item
                label={
                  <span>
                    Fee Amount <span className="text-danger">*</span>
                  </span>
                }
                name="amount"
                rules={[{ required: true, message: "Fee amount is required" }]}
              >
                <InputNumber
                  placeholder="Enter fee amount"
                  style={FIELD_STYLE}
                  min={0}
                  // addonBefore="GHC"
                  addonAfter="GHS"
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            label={
              <Tooltip
               title="i.e if you give a loan for 2,000 and the fee is 100, the fee would be deducted from 2,000 and remaining amount of 1,900 would be given to the borrower."
                placement="top" color="white">
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Deduct from principal amount <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                </span>
              </Tooltip>
            }
            name="deduct_from_principal"
            valuePropName="checked"
          >
            <Switch 
              onChange={checked => {
                if (checked) {
                  feeForm.setFieldsValue({ spread_across_repayments: false });
                }
              }}
              checked={feeForm.getFieldValue('deduct_from_principal') || false}
            />
          </Form.Item>
         

          <Form.Item
            label={
              <Tooltip title="The fee amount will be divided equally and added to each repayment installment." placement="top" color="white">
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Spread across repayments <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999', fontSize: '14px' }} />
                </span>
              </Tooltip>
            }
            name="spread_across_repayments"
            valuePropName="checked"
          >
            <Switch 
              onChange={checked => {
                if (checked) {
                  feeForm.setFieldsValue({ deduct_from_principal: false });
                }
              }}
              checked={feeForm.getFieldValue('spread_across_repayments') || false}
            />
          </Form.Item>
        
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button onClick={handleFeeCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default EditLoanProduct;
