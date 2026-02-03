import React from 'react';
import { Form, DatePicker } from 'antd';

const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };

const CustomDatePicker = ({
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
    <DatePicker
      placeholder={placeholder}
      style={{ ...FIELD_STYLE, ...style }}
      {...rest.datePickerProps}
    />
  </Form.Item>
);

export default CustomDatePicker; 