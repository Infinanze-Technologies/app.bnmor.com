import { useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
  DatePicker,
  Card,
  Row,
  Col,
  InputNumber,
  Tooltip
} from "antd";
import moment from "moment";
import ImageUpload from '@/components/form/ImageUpload';
import { URL_ADD_GUARANTOR } from "@/config/api-paths";
import { postRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
const { Option } = Select;

const dateFormat = "YYYY-MM-DD";

const getBase64 = file =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const AddGuarantor = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  let { setIsModalVisible, QryBranchDataObject,refetch,jwt,forceRefetch } = props;

  // Handle image upload changes
  const handleImageChange = (newFileList) => {
    setFileList(newFileList);
  };

  // Form submit handler
  const onFinish = async values => {
    // Convert all uploaded images to base64
    let profileImageBase64 = null;
    let idFrontImageBase64 = null;
    let idBackImageBase64 = null;
    
    // Process uploaded files - we'll assign them based on order or add labels
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.originFileObj) {
        const base64 = await getBase64(file.originFileObj);
        
        // Assign images based on order: first = profile, second = ID front, third = ID back
        if (i === 0) {
          profileImageBase64 = base64;
        } else if (i === 1) {
          idFrontImageBase64 = base64;
        } else if (i === 2) {
          idBackImageBase64 = base64;
        }
      }
    }
    
    // Prepare data for API submission
    const data = {
      ...values,
      date_of_birth: values.date_of_birth?.format(dateFormat),
      date_of_registration: values.date_of_registration?.format(dateFormat),
      profile_img: profileImageBase64,
      front_id_img: idFrontImageBase64,
      back_id_img: idBackImageBase64
    };

    setLoading(true);
    postRequest(URL_ADD_GUARANTOR,{...data},jwt)
    .then(async (res) => {
      setLoading(false);
      handleRequestResponse(res)
      form.resetFields();
      setFileList([]);
      await forceRefetch();
      setIsModalVisible(false);

    })
    .catch((err) => {
      handleRequestError(err)
    })
    .finally(() => {
      setLoading(false);
    })
  };

  // Replace all Select, Input, and DatePicker components' style props to use a consistent style
  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };
  const SELECT_PROPS = {
    showSearch: true,
    filterOption: (input, option) =>
      (option?.children ?? '').toLowerCase().includes(input.toLowerCase()),
    dropdownMatchSelectWidth: true,
    className: 'custom-select-field',
    style: FIELD_STYLE,
  };

  return (
    <div style={{ 
      maxWidth: 900, 
      margin: "0 auto", 
      padding: 24,
      maxHeight: '80vh',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      <Card
        title={<span style={{ fontSize: 24, fontWeight: 700, color: "#2a3f54" }}>Create New Guarantor</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Personal Information */}
          <Card type="inner" title="Personal Information" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Full Name"
                  name="fullname"
                  rules={[{ required: true, message: "Full name is required" }]}
                >
                  <Input placeholder="Enter full name" style={FIELD_STYLE} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Enter a valid email" }
                  ]}
                >
                  <Input placeholder="Enter email address" style={FIELD_STYLE} />
                </Form.Item>
              </Col>

             
              <Col xs={24} md={12}>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[{ required: true, message: "Gender is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select gender" className="custom-select">
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>


              <Col xs={24} md={12}>
                <Form.Item
                  label="Phone Number"
                  name="phone_number"
                  rules={[
                    { required: true, message: "Phone number is required" },
                    { pattern: /^\d{7,15}$/, message: "Enter a valid phone number" }
                  ]}
                >
                  <Input placeholder="Enter phone number" style={FIELD_STYLE} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Date of Birth"
                  name="date_of_birth"
                  rules={[{ required: true, message: "Date of birth is required" }]}
                >
                  <DatePicker
                    style={FIELD_STYLE}
                    format={dateFormat}
                    disabledDate={current => current && current > moment().endOf("day")}
                  />
                </Form.Item>
              </Col>
           


              <Col xs={24} md={12}>
                <Form.Item
                  label="City / Town"
                  name="city"
                  rules={[{ required: true, message: "City/Town is required" }]}
                >
                  <Input placeholder="Enter city or town" style={FIELD_STYLE} />
                </Form.Item>
              </Col>


              <Col xs={24} md={24}>
                <Form.Item
                  label="Residential Address"
                  name="residential_address"
                  rules={[{ required: true, message: "Residential address is required" }]}
                >
                <Input placeholder="Enter residential address" style={FIELD_STYLE} /> 
                </Form.Item>
              </Col>

              {/* <Col xs={24} md={12}>
                <Form.Item
                  label="Relationship Type"
                  name="relationship_type"
                  rules={[{ required: true, message: "Relationship type is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select relationship type" className="custom-select">
                    <Option value="Friend">Friend</Option>
                    <Option value="Family">Family</Option>
                    <Option value="Colleague">Colleague</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col> */}
           
             
            </Row>
          </Card>


    

          {/* Employment */}
          <Card type="inner" title="Employment" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
            <Col xs={24} md={12}>
                <Form.Item
                  label="Employment Status"
                  name="employment_status"
                  rules={[{ required: true, message: "Employment status is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select employment status" className="custom-select">
                    <Option value="Employed">Employed</Option>
                    <Option value="Self-employed">Self-employed</Option>
                    <Option value="Unemployed">Unemployed</Option>
                  </Select>
                </Form.Item>
              </Col>
           
         
              <Col xs={24} md={12}>
                <Form.Item
                  label="Monthly Income"
                  name="monthly_income"
                  rules={[{ required: true, message: "Monthly income is required" }]}
                >
                   <InputNumber
                        className="custom-number-input"
                        placeholder="Enter monthly income"
                        style={FIELD_STYLE}
                        min={1}
                        max={360}
                      />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Identification */}
          <Card type="inner" title="Identification" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>

            <Col xs={24} md={12}>
                <Form.Item
                  label="ID Type"
                  name="id_type"
                  rules={[{ required: true, message: "ID type is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select ID type" className="custom-select">
                    <Option value="National ID">National ID</Option>
                    <Option value="Driver's License">Driver's License</Option>
                    <Option value="Passport">Passport</Option>
                    <Option value="Voter's Card">Voter's Card</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="ID Number"
                  name="id_number"
                  rules={[{ required: true, message: "ID number is required" }]}
                >
                  <Input placeholder="Enter ID number" style={FIELD_STYLE} />
                </Form.Item>
              </Col>
            
              {/* <Col xs={24} md={24}>
                <Form.Item
                  label={
                    <Tooltip title="Upload clear images of the front and back of your ID card" color="#ffffff" >
                      Photo of ID (Front and Back)
                    </Tooltip>
                  }
                  name="identification_cards"
                  rules={[
                    { required: true, message: "Please upload both front and back of your ID card" },
                    { validator: (_, value) => (value && value.length === 2 ? Promise.resolve() : Promise.reject('Upload exactly 2 images: front and back')) }
                  ]}
                  valuePropName="fileList"
                  getValueFromEvent={e => e}
                >
                  <CustomMultiFileUpload
                    accept="image/png,image/jpeg,image/jpg,image/gif"
                    maxSizeMB={5}
                    maxCount={2}
                    placeholder="Upload front and back of your ID card (PNG, JPG, GIF, up to 5MB each)"
                  />
                </Form.Item>
              </Col>


              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Tooltip title="Upload a clear passport photo" color="#ffffff" >
                      Passport Photo
                    </Tooltip>
                  }
                  name="profile_image"
                  rules={[{ required: true, message: "Passport photo is required" }]}
                  valuePropName="fileList"
                  getValueFromEvent={() => profileFileList}
                >
                  <ImgCrop rotationSlider>
                    <Upload
                      listType="picture-card"
                      fileList={profileFileList}
                      onPreview={handlePreview}
                      onChange={({ fileList }) => setProfileFileList(fileList)}
                      beforeUpload={beforeImageUpload}
                      maxCount={1}
                    >
                      {profileFileList.length < 1 && "+ Upload"}
                    </Upload>
                  </ImgCrop>
                </Form.Item>
              </Col> */}
              
            </Row>
          </Card>

          {/* Image Upload */}
          <Card type="inner" title="Required Images" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  label={
                    <Tooltip title="Upload Profile Image, ID Front, and ID Back images (3 images total)" color="#ffffff">
                      Upload Images
                    </Tooltip>
                  }
                  rules={[
                    { required: true, message: "Please upload all required images" },
                    { validator: (_, value) => (fileList && fileList.length >= 3 ? Promise.resolve() : Promise.reject('Please upload exactly 3 images: Profile, ID Front, and ID Back')) }
                  ]}
                >
                  <ImageUpload
                    fileList={fileList}
                    onChange={handleImageChange}
                    maxCount={3}
                    uploadText="Upload"
                  />
                </Form.Item>
                <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                  <strong>Upload Order:</strong> 1. Profile Image, 2. ID Front Image, 3. ID Back Image
                </div>
              </Col>
            </Row>
          </Card>

  {/* Other */}
  <Card type="inner" title="Other Details" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              {/* <Col xs={24} md={8}>
              <Form.Item
                  label={
                    <Tooltip title="Upload a clear profile image" color="#ffffff" >
                      Profile Image 
                    </Tooltip>
                  }
                  name="profile_image"
                  rules={[{ required: true, message: "Profile image is required" }]}
                  valuePropName="fileList"
                  getValueFromEvent={() => profileFileList}
                >
                  <ImgCrop rotationSlider>
                    <Upload
                      listType="picture-card"
                      fileList={profileFileList}
                      onPreview={handlePreview}
                      onChange={({ fileList }) => setProfileFileList(fileList)}
                      beforeUpload={beforeImageUpload}
                      maxCount={1}
                    >
                      {profileFileList.length < 1 && "+ Upload"}
                    </Upload>
                  </ImgCrop>
              </Form.Item>
              </Col> */}
              <Col xs={24} md={12}>
              <Form.Item
                  label="Branch"
                  name="branch_id"
                  rules={[{ required: true, message: "Branch is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select branch" className="custom-select">
                    {QryBranchDataObject?.data?.map((branch) => (
                      <Option key={branch.branch_id} value={branch.branch_id}>{branch.name}</Option>
                    ))}
                  </Select>
              </Form.Item>
              </Col>
              <Col xs={24} md={12}>
              <Form.Item
                  label="Date of Registration"
                  name="date_of_registration"
                  rules={[{ required: true, message: "Date of registration is required" }]}
                >
                  <DatePicker
                    style={FIELD_STYLE}
                    format={dateFormat}
                    disabledDate={current => current && current > moment().endOf("day")}
                  />
              </Form.Item>
              </Col>
            </Row>
          </Card>
        

          <Form.Item style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              loading={loading}
              size="large"
              style={{ minWidth: 120 }}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddGuarantor; 