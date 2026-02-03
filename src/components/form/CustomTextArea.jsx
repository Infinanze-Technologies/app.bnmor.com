import React from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;
const FIELD_STYLE = { width: '100%',borderRadius: 10 };

const CustomTextArea = ({
  label,
  name,
  rules,
  placeholder,
  style,
  ...rest
}) => (
  <Form.Item
    label={label}
    name={name}
    rules={rules}
    {...rest.formItemProps}
  >
    <TextArea
      placeholder={placeholder}
      style={{ ...FIELD_STYLE, ...style }}
      {...rest.textAreaProps}
    />
  </Form.Item>
);

export default CustomTextArea; 