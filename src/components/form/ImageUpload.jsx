import React, { useState } from 'react';
import { Upload, Image, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const ImageUpload = ({
  fileList = [],
  onChange,
  maxCount = 3,
  accept = "image/png,image/jpeg,image/jpg,image/webp",
  maxSizeMB = 2,
  showPreview = true,
  uploadText = "Upload",
  disabled = false
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const beforeUpload = file => {
    const isValidType = accept.split(',').some(type => file.type === type.trim());
    if (!isValidType) {
      message.error(`You can only upload ${accept} files!`);
      return Upload.LIST_IGNORE;
    }
    const isLtMaxSize = file.size / 1024 / 1024 < maxSizeMB;
    if (!isLtMaxSize) {
      message.error(`Image must be smaller than ${maxSizeMB}MB!`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChange = ({ fileList: newFileList }) => {
    // Convert files to base64 and update the fileList
    const updatedFileList = newFileList.map(file => {
      if (file.originFileObj && !file.url && !file.preview) {
        getBase64(file.originFileObj).then(base64 => {
          file.preview = base64;
          file.url = base64;
          // Trigger onChange with updated fileList
          onChange?.(newFileList);
        });
      }
      return file;
    });
    
    onChange?.(updatedFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{uploadText}</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        maxCount={maxCount}
        disabled={disabled}
        accept={accept}
      >
        {fileList.length >= maxCount ? null : uploadButton}
      </Upload>
      
      {showPreview && previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: visible => setPreviewOpen(visible),
            afterOpenChange: visible => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default ImageUpload;
