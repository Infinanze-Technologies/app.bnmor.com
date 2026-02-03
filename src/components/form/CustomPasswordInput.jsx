import React from 'react';
import { Form, Input } from 'antd';

const { Password } = Input;

const FIELD_STYLE = { 
  width: '100%', 
  height: 50, 
  borderRadius: 10,
  fontSize: '14px',
  paddingLeft: '12px',
  paddingRight: '12px',
  lineHeight: '50px',
  display: 'flex',
  alignItems: 'center'
};

const CustomPasswordInput = ({
  label,
  name,
  rules,
  placeholder,
  prefix,
  style,
  ...rest
}) => (
  <Form.Item
    label={label}
    name={name}
    rules={rules}
    style={{ marginBottom: '16px' }}
    labelCol={{ span: 24 }}
    wrapperCol={{ span: 24 }}
    {...rest.formItemProps}
  >
    <Password
      placeholder={placeholder}
      prefix={prefix}
      style={{ ...FIELD_STYLE, ...style }}
      {...rest.inputProps}
    />
  </Form.Item>
);

export default CustomPasswordInput;
