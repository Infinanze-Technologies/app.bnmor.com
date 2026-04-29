import React, { useState } from 'react';
import { Modal, Form, Button, message, Typography, Card } from 'antd';
import { PlusOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import ImageUpload from '@/components/form/ImageUpload';
import { postRequest } from '@/hooks/apiService';
import useHandleResponse from '@/hooks/useHandleResponse';
import { URL_ADD_PROPERTY_FILES } from '@/config/api-paths';

const { Text } = Typography;

const AddPropertyImage = ({ propertyId, visible, onCancel, onSuccess, jwt }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();

  const handleImageChange = (newFileList) => {
    setFileList(newFileList);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validate file size (6MB = 6 * 1024 * 1024 bytes)
      if (fileList.length > 0 && fileList[0]?.originFileObj) {
        const fileSize = fileList[0].originFileObj.size;
        const maxSize = 6 * 1024 * 1024; // 6MB in bytes
        
        if (fileSize > maxSize) {
          message.error('File size must not exceed 6MB');
          setLoading(false);
          return;
        }
      }
      
      let newFileBase64 = null;
      
      // If there's a new file uploaded, convert it to base64
      if (fileList.length > 0 && fileList[0]?.originFileObj) {
        const reader = new FileReader();
        newFileBase64 = await new Promise((resolve, reject) => {
          reader.readAsDataURL(fileList[0].originFileObj);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      // Prepare data according to API specification
      const uploadData = {
        property_id: propertyId,
        file: newFileBase64
      };

      setLoading(true);
      // Make API call to add the file
      await postRequest(URL_ADD_PROPERTY_FILES, uploadData, jwt).then((res) => {
        handleRequestResponse(res);
        onCancel(); // Close current modal
        onSuccess?.(); // Trigger parent component success callback
      }).catch((err) => {
        handleRequestError(err);
      }).finally(() => {
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
    setFileList([]);
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusOutlined style={{ color: '#1890ff' }} />
          <span>Add Property Image</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleCancel} icon={<CloseOutlined />}>
          Cancel
        </Button>,
        <Button 
          key="upload" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
          icon={<SaveOutlined />}
          style={{ background: '#1890ff', borderColor: '#1890ff' }}
        >
          Upload Image
        </Button>
      ]}
      style={{ top: 20 }}
    >
      <Card 
        style={{ 
          border: '2px solid #1890ff20',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Form form={form} layout="vertical">
            <Form.Item
              name="file"
              rules={[
                { required: true, message: 'Please upload a property image' }
              ]}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ImageUpload
                  fileList={fileList}
                  onChange={handleImageChange}
                  maxCount={1}
                  uploadText="Upload"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  maxSizeMB={6}
                />
              </div>
            </Form.Item>
          </Form>
        </div>

        <div style={{ marginTop: '16px', padding: '12px', background: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <strong>Supported formats:</strong> JPG, PNG, WebP. Max size: 6MB.
          </Text>
        </div>
      </Card>
    </Modal>
  );
};

export default AddPropertyImage;
