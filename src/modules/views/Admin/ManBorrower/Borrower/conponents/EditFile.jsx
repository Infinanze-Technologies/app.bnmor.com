import React, { useState } from 'react';
import { Modal, Form, Button, message, Typography, Card, Row, Col } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import ImageUpload from '@/components/form/ImageUpload';
import { updateRequest } from '@/hooks/apiService';
import useHandleResponse from '@/hooks/useHandleResponse';
import { URL_UPDATE_BORROWER_IMAGE } from '@/config/api-paths';

const { Title, Text } = Typography;

const EditFile = ({ 
  visible, 
  onCancel, 
  record, 
  fileType, 
  currentUrl, 
  jwt, 
  onSuccess 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();

//   console.log("file_record", fileType);

  // Initialize file list with current image if available
  React.useEffect(() => {
    if (currentUrl && visible) {
      setFileList([{
        uid: '-1',
        name: `${fileType}.webp`,
        status: 'done',
        url: currentUrl,
      }]);
    } else {
      setFileList([]);
    }
  }, [currentUrl, visible, fileType]);

  const handleImageChange = (newFileList) => {
    setFileList(newFileList);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validate file size (2MB = 2 * 1024 * 1024 bytes)
      if (fileList.length > 0 && fileList[0]?.originFileObj) {
        const fileSize = fileList[0].originFileObj.size;
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        
        if (fileSize > maxSize) {
          message.error('File size must not exceed 2MB');
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

      // Prepare update data according to API specification
      const updateData = {
        borrower_id: record?.borrower_id,
        file: newFileBase64,
        image_type: fileType?.key
      };
    //   console.log("updateData", updateData);
    //   return;
      setLoading(true);
      // Make API call to update the file
      await updateRequest(URL_UPDATE_BORROWER_IMAGE, record?.files?.file_id, { ...updateData }, jwt).then((res) => {
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
}

  const getFileTypeInfo = (type) => {
    console.log("type", type);
    if(type?.key === 'profile') {
      return {
        title: 'Profile Image',
        description: 'Upload a clear profile picture',
        color: '#1890ff'
      };
    }
    if(type?.key === 'front_id') {
      return {
        title: 'Front Image',
        description: 'Upload the front side of ID document',
        color: '#52c41a'
      };
    }
    if(type?.key === 'back_id') {
      return {
        title: 'Back Image',
        description: 'Upload the back side of ID document',
        color: '#fa8c16'
      };
    }
    return {
      title: 'Profile Image',
      description: 'Upload a clear profile picture',
      color: '#1890ff'
    };
  };

  const fileInfo = getFileTypeInfo(fileType);

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EditOutlined style={{ color: fileInfo.color }} />
          <span>Edit {fileInfo.title}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel} icon={<CloseOutlined />}>
          Cancel
        </Button>,
        <Button 
          key="save" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
          icon={<SaveOutlined />}
          style={{ background: fileInfo.color, borderColor: fileInfo.color }}
        >
          Save Changes
        </Button>
      ]}
      style={{ top: 20 }}
    >
      <Card 
        style={{ 
          border: `2px solid ${fileInfo.color}20`,
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
                { required: true, message: `Please upload a new ${fileInfo.title.toLowerCase()}` }
              ]}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ImageUpload
                  fileList={fileList}
                  onChange={handleImageChange}
                  maxCount={1}
                  uploadText={`Upload`}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  maxSizeMB={5}
                />
              </div>
            </Form.Item>
          </Form>
        </div>

        {currentUrl && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <strong>Current file:</strong> {currentUrl.split('/').pop()}
            </Text>
          </div>
        )}
      </Card>
    </Modal>
  );
};

export default EditFile;
