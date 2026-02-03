import React from 'react';
import { Form, Checkbox } from 'antd';

const CustomCheckbox = ({
  label,
  name,
  rules,
  style,
  ...rest
}) => (
  <Form.Item
    name={name}
    valuePropName="checked"
    rules={rules}
    {...rest.formItemProps}
    style={style}
  >
    <Checkbox {...rest.checkboxProps}>{label}</Checkbox>
  </Form.Item>
);

export default CustomCheckbox; 