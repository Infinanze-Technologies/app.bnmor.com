import React, { useEffect, useState } from 'react'
import {
    Button,
    Form,
    Card,
    Row,
    Col,
    Spin,
    Upload,
    Typography,
    Divider,
    Avatar
  } from "antd";
import { updateRequest } from '@/hooks/apiService';
import { URL_UPDATE_PROFILE_BY_ID } from '@/config/api-paths';
import useHandleResponse from "@/hooks/useHandleResponse";
import ImgCrop from 'antd-img-crop';
import CustomInput from "@/components/form/CustomInput";
import { UserOutlined, CameraOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const EditProfile = (props) => {
    const [form] = Form.useForm();
    const [isloadingSubmit, setIsloadingSubmit] = useState(false);
    const { handleRequestError, handleRequestResponse } = useHandleResponse()
    let { ProfileObjectData, jwt } = props

    let { loading, data, refetchEntity } = ProfileObjectData;
    let record = data?.data
    const [fileList, setFileList] = useState([]);
    const [fileUpload, setFileUpload] = useState(null);

    useEffect(() => {
      try {
        form.setFieldsValue({
          fullname: record?.fullname,
          ...record
        });
      } catch (error) {
        console.log(error);
      }
    }, [record]);

    const onChange = ({ fileList: newFileList }) => {
      setFileList(newFileList);
    };

    const onPreview = async (file) => {
      let src = file.url;
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow?.document.write(image.outerHTML);
    };

    const beforeUpload = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
          file.base64 = reader.result;
          setFileUpload(reader.result)
          resolve(file);
        };
        reader.onerror = (error) => reject(error);
      });
    };

    const onFinish = (values) => {
      try {
        values['file'] = fileUpload
        setIsloadingSubmit(true);
        updateRequest(URL_UPDATE_PROFILE_BY_ID, record?.employee_id, { ...values }, jwt)
          .then((res) => {
            refetchEntity();
            setIsloadingSubmit(false);
            handleRequestResponse(res);
            setFileUpload(null)
          })
          .catch((err) => {
            handleRequestError(err);
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
              <Avatar 
                size={80} 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: '#1890ff',
                  border: '4px solid #f0f0f0'
                }}
              />
            </div>
            <Title level={3} style={{ 
              color: '#1890ff', 
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              👤 Edit Profile
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Update your personal information and profile picture
            </Text>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          <Spin spinning={loading}>
            <Form 
              onFinish={onFinish} 
              form={form} 
              name="editProfile" 
              layout="vertical"
              size="large"
            >
              <Row gutter={[24, 24]}>
                {/* Profile Picture Section */}
                {/* <Col span={24}>
                  <Card 
                    type="inner" 
                    title={
                      <span style={{ 
                        color: '#722ed1', 
                        fontWeight: '600',
                        fontSize: '16px'
                      }}>
                        📸 Profile Picture
                      </span>
                    }
                    style={{ 
                      marginBottom: 24, 
                      borderRadius: 12,
                      border: '1px solid #f0f0f0'
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <ImgCrop rotationSlider>
                        <Upload
                          listType="picture-card"
                          fileList={fileList}
                          onChange={onChange}
                          onPreview={onPreview}
                          beforeUpload={beforeUpload}
                          style={{ margin: '0 auto' }}
                        >
                          {fileList.length < 1 && (
                            <div style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              color: '#1890ff'
                            }}>
                              <CameraOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                              <span>Upload Photo</span>
                            </div>
                          )}
                        </Upload>
                      </ImgCrop>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                        Click to upload or drag and drop
                      </Text>
                    </div>
                  </Card>
                </Col> */}

                {/* Personal Information Section */}
                <Col span={24}>
                  <Card 
                    type="inner" 
                    title={
                      <span style={{ 
                        color: '#52c41a', 
                        fontWeight: '600',
                        fontSize: '16px'
                      }}>
                        📝 Personal Information
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
                        <CustomInput
                          label="Full Name"
                          name="fullname"
                          placeholder="Enter your full name"
                          rules={[
                            {
                              required: true,
                              message: "Please input your fullname!",
                            },
                          ]}
                        />
                      </Col>

                      <Col span={24}>
                        <CustomInput
                          label="Email Address"
                          name="email"
                          placeholder="Enter your email address"
                          type="email"
                          rules={[
                            {
                              required: true,
                              message: "Please input your email!",
                            },
                          ]}
                        />
                      </Col>

                      <Col span={24}>
                        <CustomInput
                          label="Phone Number"
                          name="phone"
                          placeholder="Enter your phone number"
                          rules={[
                            {
                              required: true,
                              message: "Please input your phone number!",
                            },
                          ]}
                        />
                      </Col>

                      <Col span={24}>
                        <CustomInput
                          label="Address"
                          name="address"
                          placeholder="Enter your address"
                          rules={[
                            {
                              required: true,
                              message: "Please input your address!",
                            },
                          ]}
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
                          boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                        }}
                      >
                        💾 Save Profile
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

export default EditProfile