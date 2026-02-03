import { useState, useEffect } from "react";
import {
  Button,
  Select,
  Form,
  Input,
  Card,
  Row,
  Col,
  InputNumber,
  message,
  Tooltip,
  Switch
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { updateRequest, getRequest } from "@/hooks/apiService";
import { URL_UPDATE_LOAN_BASIC_DETAILS, URL_GET_ACTIVE_BORROWERS, URL_GET_ACTIVE_GUARANTORS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useFetchQuery from "@/hooks/ReactQuery/useFetchQuery";
import dayjs from 'dayjs';
import CustomDatePicker from "@/components/form/CustomDatePicker";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
const dateFormat = "YYYY-MM-DD";
const { Option } = Select;
const { TextArea } = Input;

const LoanDetailsModal = (props) => {
  let jwt = props?.jwt;
  let record = props?.record;
  let refetch = props?.refetch;
  let setIsModalVisible = props?.setIsModalVisible;

  const [form] = Form.useForm();
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [loading, setLoading] = useState(false);
  const [durationType, setDurationType] = useState('Fixed');
  const [durationPeriod, setDurationPeriod] = useState('Months');
  const [customRepaymentEnabled, setCustomRepaymentEnabled] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [borrowerType, setBorrowerType] = useState('individual');

  // Days of the week for custom repayment schedule
  const daysOfWeek = [
    { key: 'monday', label: 'monday' },
    { key: 'tuesday', label: 'tuesday' },
    { key: 'wednesday', label: 'wednesday' },
    { key: 'thursday', label: 'thursday' },
    { key: 'friday', label: 'friday' },
    { key: 'saturday', label: 'saturday' },
    { key: 'sunday', label: 'sunday' }
  ];

  // Fetch active borrowers using useFetchQuery
  const {
    data: activeBorrowers = [],
    isLoading: loadingBorrowers,
    isError: borrowersError,
    refetch: refetchBorrowers
  } = useFetchQuery({
    url: URL_GET_ACTIVE_BORROWERS,
    jwt: jwt,
    tableKey: 'activeBorrowers'
  });

  // Fetch active guarantors using useFetchQuery
  const {
    data: activeGuarantors = [],
    isLoading: loadingGuarantors,
    isError: guarantorsError,
    refetch: refetchGuarantors
  } = useFetchQuery({
    url: URL_GET_ACTIVE_GUARANTORS,
    jwt: jwt,
    tableKey: 'activeGuarantors'
  });

  // Initialize form with existing record data
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        loan_amount: record.loan_amount,
        loan_period: record.loan_period,
        loan_duration: record.loan_duration,
        interest_rate: record.interest_rate,
        interest_cycle: record.interest_cycle,
        interest_method: record.interest_method,
        repayment_cycle: record.repayment_cycle,
        // installment_amount: record.installment_amount,
        loan_release_date: record.loan_release_date ? dayjs(record.loan_release_date) : dayjs().format(dateFormat),
        enable_custom_installment: record.enable_custom_installment,
        custom_installment_type: record.custom_installment_type || [],
        borrower: record.borrower_id,
        borrower_type: record.borrower_type || 'individual',
        guarantor_id: record.guarantor_id,
        guarantor_relationship: record.guarantor_relationship,
        guarantor_relationship_duration: record.guarantor_relationship_duration,
        loan_status: record.loan_status,
      });
      
      setDurationPeriod(record.loan_period || 'Months');
      setCustomRepaymentEnabled(record.enable_custom_installment || false);
      setSelectedDays(record.custom_installment_type || []);
      setBorrowerType(record.borrower_type || 'individual');
      }
  }, [record, form]);

  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };
  const SELECT_PROPS = {
    showSearch: true,
    filterOption: (input, option) =>
      (option?.children ?? '').toLowerCase().includes(input.toLowerCase()),
    dropdownMatchSelectWidth: true,
    className: 'custom-select-field',
    style: FIELD_STYLE,
  };

  // Handle day toggle for custom repayment schedule
  const handleDayToggle = (dayKey) => {
    setSelectedDays(prev => {
      const newDays = prev.includes(dayKey) 
        ? prev.filter(day => day !== dayKey)
        : [...prev, dayKey];
      
      // Update form field
      form.setFieldsValue({ custom_installment_type: newDays });
      return newDays;
    });
  };

  const onFinish = async values => {
    setLoading(true);

    try {
      // Format/prepare data for API - only basic loan information
      const data = {
        loan_amount: Number(values.loan_amount),
        loan_period: values.loan_period,
        loan_duration: values.loan_duration || 1,
        interest_rate: Number(values.interest_rate),
        interest_cycle: values.interest_cycle,
        loan_status: values.loan_status,
        interest_method: values.interest_method,
        repayment_cycle: values.repayment_cycle,
     //   installment_amount: Number(values.installment_amount),
        loan_release_date: values.loan_release_date ? dayjs(values.loan_release_date).format('YYYY-MM-DD') : "",
        enable_custom_installment: customRepaymentEnabled,
        custom_installment_type: selectedDays,
        borrower_id: values.borrower,
        guarantor_id: values.guarantor_id,
        guarantor_relationship: values.guarantor_relationship,
        guarantor_relationship_duration: Number(values.guarantor_relationship_duration) || 1
      };

      // console.log(data);

      // Update loan via API
      await updateRequest(URL_UPDATE_LOAN_BASIC_DETAILS, record.loan_id, {...data}, jwt)
      .then((res) => {
        handleRequestResponse(res);
        setIsModalVisible(false);
        refetch();
      }).catch((err) => {
        handleRequestError(err);
      })
      .finally(() => {
        setLoading(false);
      });
      
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <Card
        title={<span style={{ fontSize: 20, fontWeight: 700, color: "#2a3f54" }}>Edit Loan Details</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            loan_period: "Months",
            borrower_type: "individual"
          }}
        >
          {/* Basic Loan Information */}
          <Card type="inner" title="Basic Loan Information" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
                <Form.Item
                  label={
                      <span>
                      Principal Amount <span className="text-danger">*</span>
                      </span>
                  }
                  name="loan_amount"
                  rules={[{ required: true, message: "Principal amount is required" }]}
                >
                  <InputNumber
                    className="custom-number-input"
                    placeholder="0"
                    style={FIELD_STYLE}
                    min={0}
                    addonAfter="GHS"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Duration Period <span className="text-danger">*</span>
                    </span>
                  }
                  name="loan_period"
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
                      Loan Duration <span className="text-danger">*</span>
                      </span>
                    }
                    name="loan_duration"
                    rules={[
                      { required: true, message: "Loan duration is required" },
                      { type: 'number', min: 1, max: 360, message: `Duration must be between 1 and 360 ${durationPeriod.toLowerCase()}` }
                    ]}
                  >
                    <InputNumber
                      className="custom-number-input"
                    placeholder="1"
                    style={FIELD_STYLE}
                    min={1}
                    max={360}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Interest Method <span className="text-danger">*</span>
                    </span>
                  }
                  name="interest_method"
                  rules={[{ required: true, message: "Interest method is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select interest method" 
                    className="custom-select"
                  >
                    <Option value="Flat">Flat</Option>
                    <Option value="Reducing Balance">Reducing Balance</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                      <span>
                      Interest Rate <span className="text-danger">*</span>
                      </span>
                  }
                  name="interest_rate"
                  rules={[
                    { required: true, message: "Interest rate is required" },
                    { 
                      validator: (_, value) => {
                        if (value === undefined || value === null || value === '') {
                          return Promise.resolve();
                        }
                        const numValue = Number(value);
                        if (isNaN(numValue)) {
                          return Promise.reject('Interest rate must be a valid number');
                        }
                        if (numValue < 0 || numValue > 100) {
                          return Promise.reject('Interest rate must be between 0 and 100%');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <InputNumber
                    className="custom-number-input"
                    placeholder="0.01"
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
                      <span>
                      Interest Cycle <span className="text-danger">*</span>
                      </span>
                  }
                  name="interest_cycle"
                  rules={[{ required: true, message: "Interest cycle is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select interest cycle" className="custom-select">
                    <Option value="Once">Once</Option>
                    <Option value="Daily">Daily</Option>
                    <Option value="Weekly">Weekly</Option>
                    <Option value="Monthly">Monthly</Option>
                    <Option value="Annually">Annually</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                      <span>
                      Repayment Cycle <span className="text-danger">*</span>
                      </span>
                  }
                  name="repayment_cycle"
                  rules={[{ required: true, message: "Repayment cycle is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select repayment cycle" className="custom-select">
                    <Option value="Once">Once</Option>
                    <Option value="Daily">Daily</Option>
                    <Option value="Weekly">Weekly</Option>
                    <Option value="Monthly">Monthly</Option>
                    <Option value="Yearly">Yearly</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Installment Amount <span className="text-danger">*</span>
                    </span>
                  }
                  name="installment_amount"
                  rules={[{ required: true, message: "Installment amount is required" }]}
                >
                  <InputNumber
                    className="custom-number-input"
                    placeholder="0"
                    style={FIELD_STYLE}
                    min={0}
                    addonAfter="GHS"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col> */}

              <Col xs={24} lg={8}>
              <CustomDatePicker
                label="Loan Release Date"
                name="loan_release_date"
                placeholder="Select loan release date"
                rules={[
                  {
                    required: true,
                    message: "Please input your loan release date!",
                  },
                ]}
                datePickerProps={{
                  format: dateFormat,
                  style: FIELD_STYLE,
                  allowClear: false   
                }}
              />
              </Col>
            </Row>
          </Card>

          {/* Borrower Information */}
          <Card type="inner" title="Borrower Information" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Borrower Type <span className="text-danger">*</span>
                    </span>
                  }
                  name="borrower_type"
                  rules={[{ required: true, message: "Borrower type is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select borrower type" 
                    className="custom-select"
                    defaultValue="individual"
                    onChange={(value) => {
                      setBorrowerType(value);
                      form.setFieldsValue({ borrower: undefined }); // Reset borrower selection when type changes
                    }}
                  >
                    <Option value="individual">Individual</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Borrower <span className="text-danger">*</span>
                    </span>
                  }
                  name="borrower"
                  rules={[{ required: true, message: "Borrower is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder={borrowerType === 'individual' ? "Select Individual" : "Select Group"} 
                    className="custom-select"
                    disabled={!borrowerType}
                    loading={loadingBorrowers}
                    notFoundContent={loadingBorrowers ? "Loading..." : "No borrowers found"}
                  >
                    {borrowerType === 'individual' ? (
                      activeBorrowers.map((borrower) => (
                        <Option key={borrower.borrower_id} value={borrower.borrower_id}>
                          {borrower.fullname}
                        </Option>
                      ))
                    ) : null}
                  </Select>
                </Form.Item>
              </Col>


              {/* // Loan Status */}
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Loan Status <span className="text-danger">*</span>
                    </span>
                  }
                  name="loan_status"
                  rules={[{ required: true, message: "Loan status is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select loan status" className="custom-select">
                    <Option value="Active">Active</Option>
                    <Option value="Requested">Requested</Option>
                    <Option value="Processing">Processing</Option>
                    <Option value="Completed">Completed</Option>
                    <Option value="Defaulted">Defaulted</Option>
                    <Option value="Denied">Denied</Option>
                  </Select>
             
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Guarantor */}
          <Card type="inner" title="Guarantor" style={{ marginBottom: 24, borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: 0, color: '#666' }}>Details of the guarantor</h4>
            </div>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Guarantor <span className="text-danger">*</span>
                    </span>
                  }
                  name="guarantor_id"
                  rules={[{ required: true, message: "Guarantor is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select a guarantor" 
                    className="custom-select"
                    loading={loadingGuarantors}
                    notFoundContent={loadingGuarantors ? "Loading..." : "No guarantors found"}
                  >
                    {activeGuarantors.map((guarantor) => (
                      <Option key={guarantor.guarantor_id} value={guarantor.guarantor_id}>
                        {guarantor.fullname}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Relationship <span className="text-danger">*</span>
                    </span>
                  }
                  name="guarantor_relationship"
                  rules={[{ required: true, message: "Relationship is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select a relationship" className="custom-select">
                    <Option value="Friend">Friend</Option>
                    <Option value="Family">Family</Option>
                    <Option value="Colleague">Colleague</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} lg={8}>
                <Form.Item
                  label={
                    <span>
                      Guarantor Relationship Duration <span className="text-danger">*</span>
                    </span>
                  }
                  name="guarantor_relationship_duration"
                  rules={[{ required: true, message: "Guarantor relationship duration is required" }]}
                >
                  <InputNumber
                    className="custom-number-input"
                    placeholder="Enter guarantor relationship duration"
                    style={FIELD_STYLE}
                    min={1}
                    max={360}
                    addonAfter="years"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Custom Repayment Schedule */}
          <Card type="inner" title="Custom Repayment Schedule" style={{ marginBottom: 24, borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ margin: 0, color: '#666' }}>Configure custom days when repayments can be made</h4>
            </div>
            
            <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
              <Col xs={24} lg={12}>
                <span>Enable Custom Repayment Schedule</span>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item name="enable_custom_installment" valuePropName="checked" style={{ margin: 0 }}>
                  <Switch 
                    checked={customRepaymentEnabled} 
                    onChange={setCustomRepaymentEnabled}
                    style={{ backgroundColor: customRepaymentEnabled ? '#722ed1' : '#d9d9d9' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {customRepaymentEnabled && (
              <div style={{ marginTop: 16 }}>
                <Row gutter={[8, 8]}>
                  {daysOfWeek.map((day) => (
                    <Col xs={12} sm={8} md={6} lg={3} key={day.key}>
                      <div
                        style={{
                          padding: '8px 5px',
                          border: selectedDays.includes(day.key) ? '2px solid #722ed1' : '1px solid #d9d9d9',
                          borderRadius: 6,
                          textAlign: 'center',
                          cursor: 'pointer',
                          backgroundColor: selectedDays.includes(day.key) ? '#f0f0ff' : 'white',
                          color: selectedDays.includes(day.key) ? '#722ed1' : '#666',
                          fontWeight: selectedDays.includes(day.key) ? 'bold' : 'normal'
                        }}
                        onClick={() => handleDayToggle(day.key)}
                      >
                        {day.label}
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Card>

          <Form.Item style={{ textAlign: "right" }}>
          <Button
  {...BUTTON_CONFIGS.SAVE_BUTTON()}
  htmlType="submit"
  loading={loading}
  size="small"
  shape="round"

>
 {loading ? 'Loading...' : 'Save'}
</Button>
         
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoanDetailsModal;
