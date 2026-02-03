import React, { useState } from "react";
import { Modal, Form, Select, Button, message } from "antd";
import { updateRequest } from "@/hooks/apiService";
import { URL_BORROWER_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";

const { Option } = Select;

const EditPropertyStatus = ({ visible, onCancel, record, jwt, refetch,forceRefetch }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();

  const statusOptions = [
    { value: 'Active', label: 'Active', color: '#52c41a' },
    { value: 'Inactive', label: 'Inactive', color: '#faad14' },
    { value: 'Suspended', label: 'Suspended', color: '#ff4d4f' },
    { value: 'Blacklisted', label: 'Blacklisted', color: '#000000' }
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    
    const data = {
      status: values.status
    };

    console.log('Updating status from', record?.status, 'to', data.status);

    updateRequest(URL_BORROWER_STATUS, record?.borrower_id, { ...data }, jwt)
      .then(async (res) => {
        handleRequestResponse(res);
        await forceRefetch();
        onCancel();
        form.resetFields();
      })
      .catch((err) => {
        handleRequestError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Edit Borrower Status"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
      maskClosable={false}
      keyboard={false}
      bodyStyle={{
        maxHeight: '70vh',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {/* <div style={{ marginBottom: 16 }}>
        <p><strong>Borrower:</strong> {record?.fullname}</p>
        <p><strong>Current Status:</strong> 
          <span style={{ 
            color: statusOptions.find(s => s.value === record?.status)?.color || '#d9d9d9',
            fontWeight: 'bold',
            marginLeft: 8
          }}>
            {record?.status}
          </span>
        </p>
      </div> */}

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
    </Modal>
  );
};

export default EditPropertyStatus;
