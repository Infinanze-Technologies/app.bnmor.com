import { useState, useEffect } from "react";
import {
  Button,
  Select,
  Form,
  Card,
  Row,
  Col,
  message,
  Tooltip,
  Alert,
  Divider
} from "antd";
import { QuestionCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { updateRequest } from "@/hooks/apiService";
import { URL_UPDATE_LOAN_ACCOUNT_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";

const { Option } = Select;

const LoanStatusModal = (props) => {
  let jwt = props?.jwt;
  let record = props?.record;
  let refetch = props?.refetch;
  let setIsModalVisible = props?.setIsModalVisible;

  const [form] = Form.useForm();
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(record?.loan_status);
//   console.log(record);

  // Define available status options
  const statusOptions = [
    { 
      value: 'Requested', 
      label: 'Requested', 
      color: '#1890ff',
      description: 'Loan application has been submitted and is awaiting review'
    },
    { 
      value: 'Processing', 
      label: 'Processing', 
      color: '#faad14',
      description: 'Loan is being reviewed and processed'
    },
    { 
      value: 'Active', 
      label: 'Active', 
      color: '#52c41a',
      description: 'Loan has been approved and is currently active'
    },
    // { 
    //   value: 'Defaulted', 
    //   label: 'Defaulted', 
    //   color: '#ff4d4f',
    //   description: 'Loan has defaulted due to missed payments'
    // },
    { 
      value: 'Denied', 
      label: 'Denied', 
      color: '#ff4d4f',
      description: 'Loan application has been denied'
    },
    // { 
    //   value: 'Completed', 
    //   label: 'Completed', 
    //   color: '#722ed1',
    //   description: 'Loan has been fully repaid and completed'
    // }
  ];

  // Get current status info
  const currentStatus = statusOptions.find(status => status.value === record?.loan_status);
  const selectedStatusInfo = statusOptions.find(status => status.value === selectedStatus);

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        loan_status: record.loan_status
      });
      setSelectedStatus(record.loan_status);
    }
  }, [record, form]);

  const handleSubmit = async (values) => {
    if (values.loan_status === record?.loan_status) {
      message.warning('No changes detected. Please select a different status.');
      return;
    }

    setLoading(true);
    
    const payload = {
      loan_status: values.loan_status
    };

    try {
        await updateRequest(URL_UPDATE_LOAN_ACCOUNT_STATUS,record.loan_id, {...payload}, jwt)
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

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InfoCircleOutlined style={{ color: '#1890ff' }} />
            <span>Update Loan Status</span>
          </div>
        }
        style={{ 
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
      >
        {/* Current Status Display */}
        <Alert
          message="Current Status"
          description={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <div 
                style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: currentStatus?.color || '#d9d9d9' 
                }}
              />
              <span style={{ fontWeight: '500', color: currentStatus?.color || '#666' }}>
                {currentStatus?.label || record?.loan_status}
              </span>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '20px' }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label={
                  <span>
                    New Status
                    <Tooltip title="Select the new status for this loan">
                      <QuestionCircleOutlined style={{ marginLeft: '8px', color: '#999' }} />
                    </Tooltip>
                  </span>
                }
                name="loan_status"
                rules={[
                  { required: true, message: 'Please select a loan status' }
                ]}
              >
                <Select
                  placeholder="Select new status"
                  size="large"
                  style={{ width: '100%' }}
                  onChange={setSelectedStatus}
                  optionLabelProp="children"
                >
                  {statusOptions.map((status) => (
                    <Option key={status.value} value={status.value}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div 
                          style={{ 
                            width: '12px', 
                            height: '12px', 
                            borderRadius: '50%', 
                            backgroundColor: status.color 
                          }}
                        />
                        <span>{status.label}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Status Description */}
          {selectedStatusInfo && (
            <Alert
              message={`Status: ${selectedStatusInfo.label}`}
              description={selectedStatusInfo.description}
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />
          )}

          <Divider />

          {/* Action Buttons */}
          <Row justify="end" gutter={12}>
            <Col>
              <Button 
                size="large" 
                onClick={handleCancel}
                style={{
                  minWidth: '100px',
                  borderRadius: '8px',
                  border: '1px solid #d9d9d9',
                  color: '#595959',
                  fontWeight: '500'
                }}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                style={{
                  minWidth: '120px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)'
                }}
              >
                Update Status
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default LoanStatusModal;
