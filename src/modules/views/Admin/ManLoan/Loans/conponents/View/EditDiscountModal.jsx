import React, { useEffect } from 'react';
import { Modal, Form, Button } from 'antd';
import CustomInput from '@/components/form/CustomInput';
import CustomSelect from '@/components/form/CustomSelect';
import CustomNumberInput from '@/components/form/CustomNumberInput';

const EditDiscountModal = ({ visible, onCancel, onSubmit, discountData }) => {
  const [form] = Form.useForm();

  const discountTypeOptions = [
    { value: 'interest_rate_discount', label: 'Interest Rate Discount' },
    { value: 'principal_discount', label: 'Principal Amount Discount' },
    { value: 'fees_discount', label: 'Fees Discount' },
    { value: 'fixed_amount_discount', label: 'Fixed Amount Discount' }
  ];

  useEffect(() => {
    if (visible && discountData) {
      form.setFieldsValue({
        name: discountData.name,
        discount_type: discountData.discount_type,
        value: discountData.value
      });
    }
  }, [visible, discountData, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={visible}
      title={<span style={{ color: '#2a3f54', fontWeight: 600 }}>Edit Discount</span>}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <Form 
        form={form}
        layout="vertical"
      >
        <CustomInput
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Discount name is required' }]}
          placeholder="Enter discount name"
        />
        
        <CustomSelect
          label="Discount Type"
          name="discount_type"
          rules={[{ required: true, message: 'Discount type is required' }]}
          placeholder="Select discount type"
          options={discountTypeOptions}
        />
        
        <CustomNumberInput
          label="Value"
          name="value"
          rules={[{ required: true, message: 'Discount value is required' }]}
          placeholder="0"
          min={0}
          step={0.01}
          addonAfter="%"
        />
        
        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Update
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditDiscountModal; 