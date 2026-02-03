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
  Modal,
  message,
  Tooltip,
  Switch
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { updateRequest } from "@/hooks/apiService";
import { URL_UPDATE_LOAN_FEES_DETAILS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
const { Option } = Select;

const LoanFeesModal = (props) => {
  let jwt = props?.jwt;
  let record = props?.record;
  let refetch = props?.refetch;
  let setIsModalVisible = props?.setIsModalVisible;

  // console.log(record?.fees);
  
  const [form] = Form.useForm();
  const [feeForm] = Form.useForm();
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [loading, setLoading] = useState(false);
  const [feesModalVisible, setFeesModalVisible] = useState(false);
  const [configuredFees, setConfiguredFees] = useState([]);
  const [editingFee, setEditingFee] = useState(null);
  const [feeType, setFeeType] = useState('Percentage');

  // Initialize form with existing record data
  useEffect(() => {
    if (record) {
      // Transform API data format to internal format
      const transformedFees = (record.fees || []).map(fee => ({
        ...fee,
        amount: fee.fee_amount,
        percentage: fee.fee_percentage,
        type: fee.fee_type
      }));
      setConfiguredFees(transformedFees);
    }
  }, [record]);

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
    setFeeType('Percentage');
  };

  const handleEditFee = (fee) => {
    setEditingFee(fee);
    setFeesModalVisible(true);
    feeForm.setFieldsValue({
      name: fee.name,
      calculate_on: fee.calculate_on || (fee.type === 'Fixed' ? 'Fixed Amount' : fee.type),
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
        id: 0,
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

  const onFinish = async values => {
    setLoading(true);

    try {
      // Format/prepare data for API
      const data = {
        fees: configuredFees.map(fee => ({
          id: fee.id || 0,
          name: fee.name,
          calculate_on: fee.calculate_on,
          percentage: fee.percentage ? Number(fee.percentage) : 0,
          amount: fee.amount ? Number(fee.amount) : 0,
          deduct_from_principal: !!fee.deduct_from_principal,
          spread_across_repayments: !!fee.spread_across_repayments,
          type: fee.type
        }))
      };
      // console.log(data);  
      // return;

      // Update loan product via API
      await updateRequest(URL_UPDATE_LOAN_FEES_DETAILS,record.loan_id, {...data}, jwt)
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
        title={<span style={{ fontSize: 20, fontWeight: 700, color: "#2a3f54" }}>Edit Loan Fees</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Fees Configuration */}
          <Card type="inner" title="Fees Configuration" style={{ marginBottom: 24, borderRadius: 8 }}>
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
                          {fee.type === 'Percentage' ? `${fee.percentage}%` : `GHS ${fee.amount}`}
                        </span>
                      </Col>
                      <Col xs={24} lg={8}>
                        <span style={{ color: '#666' }}>On: {fee.calculate_on}</span>
                      </Col>
                      <Col xs={24} lg={6}>
                        <span style={{ color: '#666' }}>{fee.type === 'Percentage' ? 'Percentage' : 'Fixed'}</span>
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

          <Form.Item style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              loading={loading}
              size="large"
              style={{ minWidth: 120 }}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>

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
                    border: feeType === 'Percentage' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                  onClick={() => setFeeType('Percentage')}
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
                    border: feeType === 'Fixed' ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                  onClick={() => setFeeType('Fixed')}
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

          {feeType === 'Percentage' && (
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
            <Button
  {...BUTTON_CONFIGS.SAVE_BUTTON()}
  htmlType="submit"
  loading={loading}
  size="small"
  shape="round"

>
 Save
</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default LoanFeesModal;
