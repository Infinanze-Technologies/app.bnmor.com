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
import { updateRequest } from "@/hooks/apiService";
import { URL_UPDATE_LOAN_PRODUCT_BASIC_DETAILS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
const { Option } = Select;
const { TextArea } = Input;

const ProductDetailsModal = (props) => {
  let jwt = props?.jwt;
  let record = props?.record;
  let refetch = props?.refetch;
  let setIsModalVisible = props?.setIsModalVisible;

  // console.log(record);
  
  const [form] = Form.useForm();
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [loading, setLoading] = useState(false);
  const [durationType, setDurationType] = useState('Fixed');
  const [durationPeriod, setDurationPeriod] = useState('Months');
  const [latePenaltyEnabled, setLatePenaltyEnabled] = useState(false);

  // Initialize form with existing record data
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        product_title: record.name,
        description: record.description,
        duration_period: record.duration_period,
        duration_type: record.duration_type,
        loan_duration: record.loan_duration,
        min_loan_duration: record.min_loan_duration,
        max_loan_duration: record.max_loan_duration,
        min_principal_amount: record.min_principal_amount,
        max_principal_amount: record.max_principal_amount,
        interest_method: record.interest_method,
        interest_rate: record.interest_rate,
        interest_cycle: record.interest_cycle,
        repayment_cycle: record.repayment_cycle,
      });
      
      setDurationType(record.duration_type || 'Fixed');
      setDurationPeriod(record.duration_period || 'Months');
        setLatePenaltyEnabled(record.late_repayment_penalty_enabled|| false);
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

  const onFinish = async values => {
    setLoading(true);

    try {
      // Format/prepare data for API - only basic product information
      const data = {
        product_title: values.product_title,
        description: values.description,
        duration_period: values.duration_period,
        duration_type: values.duration_type,
        loan_duration: values.loan_duration,
        min_loan_duration: values.min_loan_duration,
        max_loan_duration: values.max_loan_duration,
        min_principal_amount: values.min_principal_amount,
        max_principal_amount: values.max_principal_amount,
        interest_method: values.interest_method,
        interest_rate: values.interest_rate,
        interest_cycle: values.interest_cycle,
        repayment_cycle: values.repayment_cycle,
        // enabled: latePenaltyEnabled
        enabled: false
      };

      // Update loan product via API
    await updateRequest(URL_UPDATE_LOAN_PRODUCT_BASIC_DETAILS,record.product_id, {...data}, jwt)
      .then((res) => {
        handleRequestResponse(res);
        setIsModalVisible(false);
        refetch();
      }).catch((err) => {
        handleRequestError(err);
      })
      .finally(() => {
        setLoading(false);
      })

      
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <Card
        title={<span style={{ fontSize: 20, fontWeight: 700, color: "#2a3f54" }}>Edit Product Details</span>}
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
            duration_type: "Fixed"
          }}
        >
          {/* Basic Product Information */}
          <Card type="inner" title="Basic Product Information" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
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
              <Col xs={24} lg={12}>
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
              <Col xs={24} lg={durationType === 'Fixed' ? 12 : 24}>
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
                    <Option value="Fixed">Fixed Duration</Option>
                    <Option value="Flexible">Flexible Duration</Option>
                  </Select>
                </Form.Item>
              </Col>
              {durationType === 'Fixed' ? (
                <Col xs={24} lg={12}>
                  <Form.Item
                    label={
                      <span>
                        Loan Duration in {durationPeriod} <span className="text-danger">*</span>
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
                    rows={4}
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
                    <Option value="Flat">Flat Interest</Option>
                    <Option value="Reducing Balance">Reducing Balance</Option>
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
                    { validator: (_, value) => {
                      if (value && (value < 0 || value > 100)) {
                        return Promise.reject('Interest rate must be between 0 and 100%');
                      }
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
                    <Option value="Once">Once</Option>
                    <Option value="Daily">Daily</Option>
                    <Option value="Weekly">Weekly</Option>
                    <Option value="Monthly">Monthly</Option>
                    <Option value="Yearly">Yearly</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={24}>
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
                    <Option value="Once">Once</Option>
                    <Option value="Daily">Daily</Option>
                    <Option value="Weekly">Weekly</Option>
                    <Option value="Monthly">Monthly</Option>
                    <Option value="Yearly">Yearly</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Late Repayment Penalty Toggle */}
          {/* <Card type="inner" title="Late Repayment Penalty" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} lg={12}>
                <span style={{ fontSize: 16, fontWeight: 500 }}>Enable Late Repayment Penalty</span>
              </Col>
              <Col xs={24} lg={12}>
                <Switch 
                  checked={latePenaltyEnabled} 
                  onChange={setLatePenaltyEnabled}
                  style={{ backgroundColor: latePenaltyEnabled ? '#722ed1' : '#d9d9d9' }}
                />
              </Col>
            </Row>
          </Card> */}

          <Form.Item style={{ textAlign: "right" }}>
          <Button
  {...BUTTON_CONFIGS.SAVE_BUTTON()}
  htmlType="submit"
  loading={loading}
  size="small"
  shape="round"
  disabled={loading}
>
 {loading ? 'Loading...' : 'Save'}
</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProductDetailsModal;
