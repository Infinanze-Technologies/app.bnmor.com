import React, { useState } from 'react';
import { Form, Upload, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Text, Link } = Typography;

const CustomMultiFileUpload = ({
  label,
  name,
  rules,
  accept = 'image/png,image/jpeg,image/jpg,image/gif',
  maxSizeMB = 10,
  placeholder = 'Upload files or drag and drop',
  ...rest
}) => {
  const [fileList, setFileList] = useState([]);

  const beforeUpload = file => {
    const isAllowedType = accept.split(',').includes(file.type);
    if (!isAllowedType) {
      file.status = 'error';
      return Upload.LIST_IGNORE;
    }
    const isLtMax = file.size / 1024 / 1024 < maxSizeMB;
    if (!isLtMax) {
      file.status = 'error';
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const onChange = info => {
    setFileList(info.fileList.filter(f => f.status !== 'error'));
  };

  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      valuePropName="fileList"
      getValueFromEvent={() => fileList}
      {...rest.formItemProps}
    >
      <Dragger
        multiple
        accept={accept}
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={onChange}
        listType="picture"
        showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
        {...rest.uploadProps}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          <Text strong>Upload files</Text> or drag and drop
        </p>
        <p className="ant-upload-hint">
          PNG, JPG, GIF up to {maxSizeMB}MB
        </p>
      </Dragger>
    </Form.Item>
  );
};

export default CustomMultiFileUpload; 