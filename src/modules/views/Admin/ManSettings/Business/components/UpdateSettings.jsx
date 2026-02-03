import React, { useEffect, useRef, useState } from 'react'
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
import { postRequest, updateRequest } from '@/hooks/apiService';
import { URL_UPDATE_BUSINESS_SETTINGS } from '@/config/api-paths';
import useHandleResponse from "@/hooks/useHandleResponse";
import Image from 'next/image'
import useToastMessage from '@/hooks/useToastMessage';

import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import dayjs from 'dayjs';

const dateFormat = 'YYYY-MM-DD';
const { Title, Text } = Typography;
const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };




const UpdateSettings = (props) => {
    const [form] = Form.useForm();
    const [isloadingSubmit, setIsloadingSubmit] = useState(false);
    const { handleRequestError, handleRequestResponse } = useHandleResponse()
    const { toastError } = useToastMessage();
    let { ProfileObjectData, jwt, currencyObject, user_id } = props

    let { loading, data, refetchEntity } = ProfileObjectData;
    let record = data?.data



    useEffect(() => {
      try {
        form.setFieldsValue({
          ...record,
          email: record?.email == null ? '' : record?.email,
          app_name: record?.app_name == null ? '' : record?.app_name,
          phone: record?.phone == null ? '' : record?.phone,
          short_name: record?.short_name == null ? '' : record?.short_name,
          zip_code: record?.zip_code == null ? '' : record?.zip_code,
          financial_year: record?.financial_year ? dayjs(record?.financial_year) : null,
          timezone: record?.timezone == null ? '' : record?.timezone,
          date_format: record?.date_format == null ? '' : record?.date_format,
          time_format: record?.time_format == null ? '' : record?.time_format,
          address: record?.address === null ? '' : record?.address,
          name: record?.name == null ? '' : record?.name,
          country: record?.country == null ? '' : record?.country,
        });
      } catch (error) {
        console.log(error);
      }
    }, [record]);

    const onFinish = (values) => {
      try {
        let data = {
         email: values.email == null ? '' : values.email,
        //  app_name: values.app_name == null ? '' : values.app_name,
         phone: values.phone == null ? '' : values.phone,
         short_name: values.short_name == null ? '' : values.short_name,
         zip_code: values.zip_code == null ? '' : values.zip_code,
        //  timezone: values.timezone == null ? '' : values.timezone,
        //  date_format: values.date_format == null ? '' : values.date_format,
        //  time_format: values.time_format == null ? '' : values.time_format,
         address: values.address == null ? '' : values.address,
         name: values.name == null ? '' : values.name,
           financial_year: values.financial_year ? dayjs(values.financial_year).format(dateFormat) : "",
           country: values.country == null ? '' : values.country,
        }
        
        setIsloadingSubmit(true);
        updateRequest(URL_UPDATE_BUSINESS_SETTINGS, user_id, { data }, jwt)
          .then((res) => {
            setIsloadingSubmit(false);
            handleRequestResponse(res);
            refetchEntity();
            form.resetFields();
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
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <Card 
          style={{ 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: 'none',
            maxWidth: '900px',
            width: '100%'
          }}
          bodyStyle={{ padding: '32px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ 
              color: '#1890ff', 
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              🏢 Business Settings
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              Update your business information and preferences
            </Text>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          <Spin spinning={loading}>
            <Form 
              onFinish={onFinish} 
              form={form} 
              name="businessSettings" 
              layout="vertical"
              size="large"
            >
              <Row gutter={[24, 24]}>
                {/* Business Information Section */}
                <Col span={24}>
                  <Card 
                    type="inner" 
                    title={
                      <span style={{ 
                        color: '#1890ff', 
                        fontWeight: '600',
                        fontSize: '18px'
                      }}>
                        📋 Business Information
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
                      <Col xs={24} md={12}>
                        <CustomInput
                          label="Business Name"
                          name="name"
                          placeholder="Enter business name"
                          rules={[
                            {
                              required: true,
                              message: "Please input your business name!",
                            },
                          ]}
                        />
                      </Col>

                      <Col xs={24} md={12}>
                        <CustomInput
                          label="Business Short Name"
                          name="short_name"
                          placeholder="Enter short name"
                          rules={[
                            {
                              required: true,
                              message: "Please input your short name!",
                            },
                          ]}
                        />
                      </Col>

                      <Col xs={24} md={12}>
                        <CustomInput
                          label="Email Address"
                          name="email"
                          placeholder="Enter email address"
                          type="email"
                          rules={[
                            {
                              required: true,
                              message: "Please input your email!",
                            },
                          ]}
                        />
                      </Col>

                      <Col xs={24} md={12}>
                        <CustomInput
                          label="Phone Number"
                          name="phone"
                          placeholder="Enter phone number"
                          rules={[
                            {
                              required: true,
                              message: "Please input your phone!",
                            },
                          ]}
                        />
                      </Col>

                      <Col xs={24} md={12}>
                        <CustomInput
                          label="Address"
                          name="address"
                          placeholder="Enter business address"
                          rules={[
                            {
                              required: true,
                              message: "Please input your address!",
                            },
                          ]}
                        />
                      </Col>

                      <Col xs={24} md={12}>
                        <CustomInput
                          label="Country"
                          name="country"
                          placeholder="Enter country"
                          rules={[
                            {
                              required: true,
                              message: "Please input your country!",
                            },
                          ]}
                        />
                      </Col>

                      <Col xs={24} md={12}>
                        <CustomInput
                          label="Zip/Post Code"
                          name="zip_code"
                          placeholder="Enter zip code"
                          rules={[
                            {
                              required: true,
                              message: "Please input your zip code!",
                            },
                          ]}
                        />
                      </Col>

                      <Col xs={24} md={12}>
                      <CustomDatePicker
                label="Financial Year"
                name="financial_year"
                placeholder="Select financial year"
                rules={[
                  {
                    required: true,
                    message: "Please input your financial year!",
                  },
                ]}
                datePickerProps={{
                  format: dateFormat,
                  style: FIELD_STYLE,
                  allowClear: false   
                }}
              />
                      </Col>
                    </Row>
                  </Card>
                </Col>

                {/* System Preferences Section */}
                {/* <Col span={24}>
                  <Card 
                    type="inner" 
                    title={
                      <span style={{ 
                        color: '#52c41a', 
                        fontWeight: '600',
                        fontSize: '18px'
                      }}>
                        ⚙️ System Preferences
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
                      <Col xs={24} md={12}>
                        <CustomSelect
                          label="Time Zone"
                          name="timezone"
                          placeholder="Select timezone"
                          options={timezone?.map((data) => ({
                            value: data?.zone,
                            label: data?.zone
                          }))}
                          rules={[
                            {
                              required: true,
                              message: "Please select your timezone!",
                            },
                          ]}
                        />
                      </Col>

                      <Col xs={24} md={12}>
                        <CustomSelect
                          label="Date Format"
                          name="date_format"
                          placeholder="Select date format"
                          options={dateformat?.map((data) => ({
                            value: data?.name,
                            label: data?.name
                          }))}
                          rules={[
                            {
                              required: true,
                              message: "Please select your date format!",
                            },
                          ]}
                        />
                      </Col>

                      <Col xs={24} md={12}>
                        <CustomSelect
                          label="Time Format"
                          name="time_format"
                          placeholder="Select time format"
                          options={[
                            { value: "12hrs", label: "12 Hours" },
                            { value: "24hrs", label: "24 Hours" }
                          ]}
                          rules={[
                            {
                              required: true,
                              message: "Please select your time format!",
                            },
                          ]}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col> */}

                {/* Submit Button */}
                <Col span={24}>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '24px 0',
                    borderTop: '1px solid #f0f0f0',
                    marginTop: '16px'
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
                        💾 Save Changes
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

export default UpdateSettings