import React, { useState } from 'react';
import { Modal, Form, Select, Button, message, Typography } from 'antd';
import { updateRequest } from '@/hooks/apiService';
import { URL_GUARANTOR_STATUS } from '@/config/api-paths';
import useHandleResponse from '@/hooks/useHandleResponse';

const { Option } = Select;
const { Title } = Typography;

const EditGuarantorStatus = ({ visible, onCancel, record, jwt, refetch,forceRefetch }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();

  const statusOptions = [
    { value: 'Active', label: 'Active', color: '#52c41a' },
    { value: 'Inactive', label: 'Inactive', color: '#faad14' },
    { value: 'Suspended', label: 'Suspended', color: '#ff4d4f' },
    { value: 'Blacklisted', label: 'Blacklisted', color: '#000000' }
  ];
  // console.log("record", record?.guarantor_id);

  const handleSubmit = async (values) => {
    if (!record?.guarantor_id) {
      message.error('Invalid guarantor record');
      return;
    }

    setLoading(true);
    try {
      const response = await updateRequest(URL_GUARANTOR_STATUS, record.guarantor_id, {
        status: values.status
      }, jwt);
      
      handleRequestResponse(response);
      onCancel();
      await forceRefetch();
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="text-center">
          <Title level={4}>Update Guarantor Status</Title>
          <p className="text-muted mb-0">
            {record?.fullname ? `Updating status for ${record.fullname}` : 'Update guarantor status'}
          </p>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
    >
 
 <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: record?.status
        }}
      >
        <Form.Item
          label="New Status"
          name="status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select
            placeholder="Select new status"
            style={{ width: '100%' }}
            size="large"
          >
            {statusOptions.map(option => (
              <Option key={option.value} value={option.value}>
                <span style={{ color: option.color, fontWeight: 'bold' }}>
                  {option.label}
                </span>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button 
            onClick={handleCancel} 
            style={{ marginRight: 8 }}
            size="large"
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
          >
            Update Status
          </Button>
        </Form.Item>
      </Form>

      <style jsx>{`
        .current-status-display {
          padding: 8px 12px;
          background-color: #f5f5f5;
          border-radius: 6px;
          border: 1px solid #d9d9d9;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .status-active {
          background-color: #f6ffed;
          color: #52c41a;
          border: 1px solid #b7eb8f;
        }
        .status-inactive {
          background-color: #fff7e6;
          color: #faad14;
          border: 1px solid #ffd591;
        }
        .text-center {
          text-align: center;
        }
        .text-muted {
          color: #6c757d;
        }
        .mb-0 {
          margin-bottom: 0;
        }
        .d-flex {
          display: flex;
        }
        .justify-content-end {
          justify-content: flex-end;
        }
        .gap-2 {
          gap: 0.5rem;
        }
      `}</style>
    </Modal>
  );
};

export default EditGuarantorStatus;
