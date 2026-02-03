import React from 'react';
import { Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddDiscountModal from '../AddDiscountModal';
import EditDiscountModal from '../EditDiscountModal';
import DeleteDiscountModal from '../DeleteDiscountModal';

const DiscountTab = ({
  addDiscountModalVisible,
  setAddDiscountModalVisible,
  editDiscountModalVisible,
  setEditDiscountModalVisible,
  selectedDiscount,
  setSelectedDiscount,
  deleteDiscountModalVisible,
  setDeleteDiscountModalVisible,
  selectedDiscountForDelete,
  setSelectedDiscountForDelete,
  message
}) => {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          border: '1px solid #e8e8e8',
          borderRadius: 8,
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#fafafa' }}>
              <th style={{ 
                padding: '16px 12px', 
                textAlign: 'left', 
                borderBottom: '1px solid #e8e8e8',
                borderRight: '1px solid #e8e8e8',
                fontWeight: 600,
                color: '#2a3f54',
                fontSize: 14
              }}>
                Discount Name
              </th>
              <th style={{ 
                padding: '16px 12px', 
                textAlign: 'left', 
                borderBottom: '1px solid #e8e8e8',
                borderRight: '1px solid #e8e8e8',
                fontWeight: 600,
                color: '#2a3f54',
                fontSize: 14
              }}>
                Type
              </th>
              <th style={{ 
                padding: '16px 12px', 
                textAlign: 'right', 
                borderBottom: '1px solid #e8e8e8',
                borderRight: '1px solid #e8e8e8',
                fontWeight: 600,
                color: '#2a3f54',
                fontSize: 14
              }}>
                Value
              </th>
              <th style={{ 
                padding: '16px 12px', 
                textAlign: 'center', 
                borderBottom: '1px solid #e8e8e8',
                fontWeight: 600,
                color: '#2a3f54',
                fontSize: 14
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ 
                padding: '16px 12px', 
                borderBottom: '1px solid #e8e8e8',
                borderRight: '1px solid #e8e8e8',
                color: '#333',
                fontWeight: 500
              }}>
                Group A Discount
              </td>
              <td style={{ 
                padding: '16px 12px', 
                borderBottom: '1px solid #e8e8e8',
                borderRight: '1px solid #e8e8e8',
                color: '#333',
                fontWeight: 500
              }}>
                Fixed Amount
              </td>
              <td style={{ 
                padding: '16px 12px', 
                textAlign: 'right',
                borderBottom: '1px solid #e8e8e8',
                borderRight: '1px solid #e8e8e8',
                color: '#333',
                fontWeight: 600
              }}>
                GH₵ 1,000 GHS
              </td>
              <td style={{ 
                padding: '16px 12px', 
                textAlign: 'center',
                borderBottom: '1px solid #e8e8e8',
                color: '#333'
              }}>
                <Space>
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<EditOutlined />} 
                    onClick={() => {
                      setSelectedDiscount({
                        name: 'Group A Discount',
                        discount_type: 'fixed_amount_discount',
                        value: 1000
                      });
                      setEditDiscountModalVisible(true);
                    }}
                    style={{ color: '#1890ff' }}
                  />
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<DeleteOutlined />} 
                    onClick={() => {
                      setSelectedDiscountForDelete({
                        name: 'Group A Discount',
                        discount_type: 'fixed_amount_discount',
                        value: 1000
                      });
                      setDeleteDiscountModalVisible(true);
                    }}
                    style={{ color: '#ff4d4f' }}
                  />
                </Space>
              </td>
            </tr>
            <tr>
              <td style={{ 
                padding: '16px 12px', 
                borderBottom: '1px solid #e8e8e8',
                borderRight: '1px solid #e8e8e8',
                color: '#333',
                fontWeight: 500
              }}>
                Interest Rate Discount
              </td>
              <td style={{ 
                padding: '16px 12px', 
                borderBottom: '1px solid #e8e8e8',
                borderRight: '1px solid #e8e8e8',
                color: '#333',
                fontWeight: 500
              }}>
                Percentage
              </td>
              <td style={{ 
                padding: '16px 12px', 
                textAlign: 'right',
                borderBottom: '1px solid #e8e8e8',
                borderRight: '1px solid #e8e8e8',
                color: '#333',
                fontWeight: 600
              }}>
                5%
              </td>
              <td style={{ 
                padding: '16px 12px', 
                textAlign: 'center',
                borderBottom: '1px solid #e8e8e8',
                color: '#333'
              }}>
                <Space>
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<EditOutlined />} 
                    onClick={() => {
                      setSelectedDiscount({
                        name: 'Interest Rate Discount',
                        discount_type: 'interest_rate_discount',
                        value: 5
                      });
                      setEditDiscountModalVisible(true);
                    }}
                    style={{ color: '#1890ff' }}
                  />
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<DeleteOutlined />} 
                    onClick={() => {
                      setSelectedDiscountForDelete({
                        name: 'Interest Rate Discount',
                        discount_type: 'interest_rate_discount',
                        value: 5
                      });
                      setDeleteDiscountModalVisible(true);
                    }}
                    style={{ color: '#ff4d4f' }}
                  />
                </Space>
              </td>
            </tr>
            <tr>
              <td style={{ 
                padding: '16px 12px', 
                borderRight: '1px solid #e8e8e8',
                color: '#333',
                fontWeight: 500
              }}>
                Processing Fee Discount
              </td>
              <td style={{ 
                padding: '16px 12px', 
                borderRight: '1px solid #e8e8e8',
                color: '#333',
                fontWeight: 500
              }}>
                Percentage
              </td>
              <td style={{ 
                padding: '16px 12px', 
                textAlign: 'right',
                borderRight: '1px solid #e8e8e8',
                color: '#333',
                fontWeight: 600
              }}>
                2.5%
              </td>
              <td style={{ 
                padding: '16px 12px', 
                textAlign: 'center',
                color: '#333'
              }}>
                <Space>
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<EditOutlined />} 
                    onClick={() => {
                      setSelectedDiscount({
                        name: 'Processing Fee Discount',
                        discount_type: 'fees_discount',
                        value: 2.5
                      });
                      setEditDiscountModalVisible(true);
                    }}
                    style={{ color: '#1890ff' }}
                  />
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<DeleteOutlined />} 
                    onClick={() => {
                      setSelectedDiscountForDelete({
                        name: 'Processing Fee Discount',
                        discount_type: 'fees_discount',
                        value: 2.5
                      });
                      setDeleteDiscountModalVisible(true);
                    }}
                    style={{ color: '#ff4d4f' }}
                  />
                </Space>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Button 
        type="primary" 
        onClick={() => setAddDiscountModalVisible(true)}
        size="small"
        style={{ 
          borderRadius: 4,
          backgroundColor: '#722ed1',
          borderColor: '#722ed1',
          paddingLeft: 16,
          paddingRight: 16,
          height: 28,
          fontSize: 12,
          fontWeight: 500,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}
      >
        Add Discount
      </Button>

      <AddDiscountModal
        visible={addDiscountModalVisible}
        onCancel={() => setAddDiscountModalVisible(false)}
        onSubmit={(values) => {
          console.log('Discount submitted:', values);
          setAddDiscountModalVisible(false);
          message.success('Discount added successfully');
        }}
      />

      <EditDiscountModal
        visible={editDiscountModalVisible}
        discountData={selectedDiscount}
        onCancel={() => {
          setEditDiscountModalVisible(false);
          setSelectedDiscount(null);
        }}
        onSubmit={(values) => {
          console.log('Discount updated:', values);
          setEditDiscountModalVisible(false);
          setSelectedDiscount(null);
          message.success('Discount updated successfully');
        }}
      />

      <DeleteDiscountModal
        visible={deleteDiscountModalVisible}
        discountData={selectedDiscountForDelete}
        onCancel={() => {
          setDeleteDiscountModalVisible(false);
          setSelectedDiscountForDelete(null);
        }}
        onConfirm={() => {
          console.log('Discount deleted:', selectedDiscountForDelete);
          setDeleteDiscountModalVisible(false);
          setSelectedDiscountForDelete(null);
          message.success('Discount deleted successfully');
        }}
      />
    </div>
  );
};

export default DiscountTab; 