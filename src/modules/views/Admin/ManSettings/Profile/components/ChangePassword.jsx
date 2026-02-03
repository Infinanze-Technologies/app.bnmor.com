import React, { useState } from 'react'
import {
    Button,
    Form,
    Card,
    Row,
    Col,
    Spin,
    Typography,
    Divider
  } from "antd";
import { URL_CHANGE_USER_PASSWORD } from '@/config/api-paths';
import useHandleResponse from "@/hooks/useHandleResponse";
import { updateRequest } from '@/hooks/apiService';
import useToastMessage from '@/hooks/useToastMessage';
import { LockOutlined, KeyOutlined } from '@ant-design/icons';
import CustomPasswordInput from "@/components/form/CustomPasswordInput";

const { Title, Text } = Typography;

const ChangePassword = (props) => {
    const [form] = Form.useForm();
    const [isloadingSubmit, setIsloadingSubmit] = useState(false);
    const { handleRequestError, handleRequestResponse } = useHandleResponse()
    let { ProfileObjectData, jwt } = props
    let { loading, data, refetchEntity } = ProfileObjectData;
    let record = data?.data
    const { toastError, toastSuccess } = useToastMessage();

    const onFinish = (values) => {
        try {
          setIsloadingSubmit(true);
          updateRequest(URL_CHANGE_USER_PASSWORD, record?.employee_id, { ...values }, jwt)
            .then((res) => {
              setIsloadingSubmit(false);
              handleRequestResponse(res);
              refetchEntity();
              form.resetFields()
            })
            .catch((err) => {
              toastError(err?.response?.data?.message);
              setIsloadingSubmit(false);
            });
          
        } catch (error) {
          setIsloadingSubmit(false);
        }
    };

    return (
      <div style={{ padding: '8px' }}>
           <Card 
          style={{ 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: 'none',
            maxWidth: '600px',
            width: '100%',
            minHeight: '580px'
          }}
          bodyStyle={{ padding: '24px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#52c41a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                border: '4px solid #f0f0f0'
              }}>
                <LockOutlined style={{ fontSize: '32px', color: 'white' }} />
              </div>
            </div>
            <Title level={3} style={{ 
              color: '#52c41a', 
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              🔐 Change Password
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Update your account password securely
            </Text>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          <Spin spinning={loading}>
            <Form 
              onFinish={onFinish} 
              form={form} 
              name="changePassword" 
              layout="vertical"
              size="large"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ width: '100%' }}
            >
              <Row gutter={[24, 24]}>
                {/* Password Fields Section */}
                <Col span={24}>
                  <Card 
                    type="inner" 
                    title={
                      <span style={{ 
                        color: '#fa8c16', 
                        fontWeight: '600',
                        fontSize: '16px'
                      }}>
                        🔑 Password Details
                      </span>
                    }
                    style={{ 
                      marginBottom: 24, 
                      borderRadius: 12,
                      border: '1px solid #f0f0f0'
                    }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <Row gutter={[24, 24]}>
                      <Col span={24}>
                        <CustomPasswordInput
                          label="Old Password"
                          name="old_pass"
                          placeholder="Enter your current password"
                          prefix={<KeyOutlined style={{ color: '#fa8c16' }} />}
                          rules={[
                            {
                              required: true,
                              message: "Please input your old password!",
                            },
                          ]}
                          style={{ 
                            height: '48px', 
                            borderRadius: '8px',
                            paddingLeft: '12px',
                            paddingRight: '12px'
                          }}
                        />
                      </Col>

                      <Col span={24}>
                        <CustomPasswordInput
                          label="New Password"
                          name="new_pass"
                          placeholder="Enter your new password"
                          prefix={<KeyOutlined style={{ color: '#52c41a' }} />}
                          rules={[
                            {
                              required: true,
                              message: "Please input your new password!",
                            },
                          ]}
                          style={{ 
                            height: '48px', 
                            borderRadius: '8px',
                            paddingLeft: '12px',
                            paddingRight: '12px'
                          }}
                        />
                      </Col>

                      <Col span={24}>
                        <CustomPasswordInput
                          label="Confirm New Password"
                          name="confirm_pass"
                          placeholder="Confirm your new password"
                          prefix={<KeyOutlined style={{ color: '#52c41a' }} />}
                          dependencies={['new_pass']}
                          hasFeedback
                          rules={[
                            {
                              required: true,
                              message: "Please confirm your new password!",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue('new_pass') === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                              },
                            }),
                          ]}
                          style={{ 
                            height: '48px', 
                            borderRadius: '8px',
                            paddingLeft: '12px',
                            paddingRight: '12px'
                          }}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>

                {/* Submit Button */}
                <Col span={24}>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '16px 0',
                    borderTop: '1px solid #f0f0f0',
                    marginTop: '12px'
                  }}>
                    <Form.Item>
                      <Button
                        loading={isloadingSubmit}
                        type="primary"
                        htmlType="submit"
                        size="large"
                        shape="round"
                        style={{
                          height: '48px',
                          padding: '0 32px',
                          fontSize: '16px',
                          fontWeight: '600',
                          backgroundColor: '#52c41a',
                          borderColor: '#52c41a',
                          boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)'
                        }}
                      >
                        🔒 Update Password
                      </Button>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Card>
      </div>
    )
}

export default ChangePassword