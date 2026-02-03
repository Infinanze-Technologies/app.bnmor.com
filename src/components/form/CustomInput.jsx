import React from 'react';
import { Form, Input } from 'antd';

const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };

const CustomInput = ({
  label,
  name,
  rules,
  placeholder,
  type = 'text',
  style,
  ...rest
}) => (
  <Form.Item
    label={label}
    name={name}
    rules={rules}
    {...rest.formItemProps}
  >
    <Input
      type={type}
      placeholder={placeholder}
      style={{ ...FIELD_STYLE, ...style }}
      {...rest.inputProps}
    />
  </Form.Item>
);

export default CustomInput; 