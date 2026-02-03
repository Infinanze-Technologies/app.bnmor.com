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
import { URL_UPDATE_LOAN_PENALTY_DETAILS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
const { Option } = Select;

const LoanPenaltyModal = (props) => {
  let jwt = props?.jwt;
  let record = props?.record;
  let refetch = props?.refetch;
  let setIsModalVisible = props?.setIsModalVisible;
  // console.log(record);
  
  
  const [form] = Form.useForm();
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [loading, setLoading] = useState(false);
  const [latePenaltyEnabled, setLatePenaltyEnabled] = useState(true);
  const [penaltyType, setPenaltyType] = useState('Percentage');

  // Initialize form with existing record data
  useEffect(() => {
    if (record) {
      setLatePenaltyEnabled(record.penalties?.enabled || true);
      setPenaltyType(record.penalties?.penalty_type || 'Percentage');
      
      form.setFieldsValue({
        late_repayment_penalty: {
          penalty_type: record.penalties?.penalty_type,
          calculate_penalty_on: record.penalties?.calculate_penalty_on,
          penalty_percentage: record.penalties?.penalty_percentage,
          penalty_amount: record.penalties?.penalty_amount,
          grace_period: record.penalties?.grace_period,
          recurring_penalty: record.penalties?.recurring_penalty
        }
      });
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
      // Format/prepare data for API
      const data = {
          ...values.late_repayment_penalty
      };

      // Update loan product via API
      await updateRequest(URL_UPDATE_LOAN_PENALTY_DETAILS,record.loan_id, {...data}, jwt)
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
        title={<span style={{ fontSize: 20, fontWeight: 700, color: "#2a3f54" }}>Edit Loan Penalty</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
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
                        <Option value="Percentage">Percentage Based</Option>
                        <Option value="Fixed">Fixed Amount</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {penaltyType === 'Percentage' && (
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
                          {penaltyType === 'Percentage' ? 'Penalty Percentage' : 'Penalty Amount'} <span className="text-danger">*</span>
                        </span>
                      }
                      name={penaltyType === 'Percentage' ? ['late_repayment_penalty', 'penalty_percentage'] : ['late_repayment_penalty', 'penalty_amount']}
                      rules={[{ required: latePenaltyEnabled, message: penaltyType === 'Percentage' ? "Penalty percentage is required" : "Penalty amount is required" }]}
                    >
                      {penaltyType === 'Percentage' ? (
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
                        <Option value="Once">Once</Option>
                        <Option value="Daily">Daily</Option>
                        <Option value="Weekly">Weekly</Option>
                        <Option value="Biweekly">Biweekly</Option>
                        <Option value="Monthly">Monthly</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </>
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

export default LoanPenaltyModal;
