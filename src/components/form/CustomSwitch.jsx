import React from 'react';
import { Form, Switch } from 'antd';

const CustomSwitch = ({
  label,
  name,
  rules,
  style,
  ...rest
}) => (
  <Form.Item
    label={label}
    name={name}
    valuePropName="checked"
    rules={rules}
    {...rest.formItemProps}
    style={style}
  >
    <Switch {...rest.switchProps} />
  </Form.Item>
);

export default CustomSwitch; 