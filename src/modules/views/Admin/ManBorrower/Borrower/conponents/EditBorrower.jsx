import { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Input,
  Upload,
  Modal,
  DatePicker,
  Card,
  Row,
  Col,
  Tooltip,
  message,
  Spin
} from "antd";
import ImgCrop from "antd-img-crop";
import moment from "moment";
import countriesData from '../../../../../../constants/countries.json';
import { postRequest, updateRequest } from "@/hooks/apiService";
import { URL_ADD_BORROWER, URL_GET_Qry_BRANCH, URL_UPDATE_BORROWER } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useSelectQuery from "@/hooks/ReactQuery/useSelectQuery";


const { Option } = Select;

const dateFormat = "YYYY-MM-DD";


const toBase64 = file =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const EditBorrower = (props) => {
  let { record, setIsModalVisible, QryBranchDataObject,refetch,jwt,forceRefetch } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // const [profileFileList, setProfileFileList] = useState([]);
  // const [idFrontFileList, setIdFrontFileList] = useState([]);
  // const [idBackFileList, setIdBackFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  
  // let jwt = session?.jwt;
  let qryBranchData = QryBranchDataObject?.data
  // Image preview handler
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await toBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url?.substring(file.url.lastIndexOf("/") + 1));
  };
  const handleCancel = () => setPreviewOpen(false);


  useEffect(() => {
    try {
      form.setFieldsValue({
        ...record,
        branch_id: record?.branch_id,
        date_of_birth: record?.date_of_birth ? moment(record.date_of_birth) : null,
        date_of_registration: record?.date_of_registration ? moment(record.date_of_registration) : null
      });
     
    } catch (error) {
      console.log(error);
    }
  }, [props,record]);

  // Upload validation
  // const beforeImageUpload = file => {
  //   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp";
  //   if (!isJpgOrPng) {
  //     message.error("You can only upload JPG/PNG/WEBP files!");
  //     return Upload.LIST_IGNORE;
  //   }
  //   const isLt2M = file.size / 1024 / 1024 < 2;
  //   if (!isLt2M) {
  //     message.error("Image must be smaller than 2MB!");
  //     return Upload.LIST_IGNORE;
  //   }
  //   return true;
  // };

  // Form submit handler
  const onFinish = async values => {
    setLoading(true);
    // Convert identification_cards files to base64
    // let identificationCardsBase64 = [];
    // if (values.identification_cards && Array.isArray(values.identification_cards)) {
    //   identificationCardsBase64 = await Promise.all(
    //     values.identification_cards.map(async (fileObj) => {
    //       if (fileObj.originFileObj) {
    //         return await toBase64(fileObj.originFileObj);
    //       }
    //       return null;
    //     })
    //   );
    //   identificationCardsBase64 = identificationCardsBase64.filter(Boolean);
    // }
    // // Convert profile_image file to base64
    // let profileImageBase64 = null;
    // if (values.profile_image && Array.isArray(values.profile_image) && values.profile_image[0]?.originFileObj) {
    //   profileImageBase64 = await toBase64(values.profile_image[0].originFileObj);
    // }
    // Prepare data for API submission
    const data = {
      ...values,
      date_of_birth: values.date_of_birth?.format(dateFormat),
      date_of_registration: values.date_of_registration?.format(dateFormat),
      // profile_image: profileImageBase64,
      // identification_cards: identificationCardsBase64,
      // Remove the original fileList from the payload
    };

    updateRequest(URL_UPDATE_BORROWER, record.borrower_id, { ...data }, jwt)
    .then(async (res) => {
      handleRequestResponse(res)
      await forceRefetch()
      setIsModalVisible(false)
    })
    .catch((err) => {
      handleRequestError(err)
    })
    .finally(() => {
      setLoading(false);
    })
    // TODO: Integrate with API
   /* setTimeout(() => {
      setLoading(false);
      message.success("Borrower created successfully (demo)");
      form.resetFields();
      setProfileFileList([]);
      setIdFrontFileList([]);
      setIdBackFileList([]);
    }, 1200);*/
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
        title={<span style={{ fontSize: 24, fontWeight: 700, color: "#2a3f54" }}>Edit Borrower Account</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Personal Info */}
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
                  label="Email"
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
                  label="Primary Phone Number"
                  name="primary_phone"
                rules={[
                    { required: true, message: "Primary phone number is required" },
                    { pattern: /^\d{7,15}$/, message: "Enter a valid phone number" }
                  ]}
                >
                  <Input placeholder="Enter primary phone number" style={FIELD_STYLE} />
              </Form.Item>
              </Col>
              <Col xs={24} md={12}>
              <Form.Item
                  label="Secondary Phone Number"
                  name="secondary_phone"
                rules={[
                    { pattern: /^\d{7,15}$/, message: "Enter a valid phone number" }
                ]}
              >
                  <Input placeholder="Enter secondary phone number (optional)" style={FIELD_STYLE} />
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
                  label="Nationality"
                  name="nationality"
                  rules={[{ required: true, message: "Nationality is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select nationality" className="custom-select">
                    {countriesData.map(country => (
                      <Option key={country.code} value={country.name}>
                        {country.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Marital Status"
                  name="marital_status"
                  rules={[{ required: true, message: "Marital status is required" }]}
                >
                  <Select {...SELECT_PROPS} placeholder="Select marital status"   className="custom-select">
                    <Option value="Single">Single</Option>
                    <Option value="Married">Married</Option>
                    <Option value="Divorced">Divorced</Option>
                    <Option value="Widowed">Widowed</Option>
                </Select>
              </Form.Item>
              </Col>
              <Col xs={24} md={24}>
              <Form.Item
                  label="Occupation"
                  name="occupation"
                  rules={[{ required: true, message: "Occupation is required" }]}
                >
                  <Input placeholder="Enter occupation" style={FIELD_STYLE} />
              </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Employment / Income */}
          <Card type="inner" title="Employment / Income" style={{ marginBottom: 24, borderRadius: 8 }}>
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
                  <Input 
                    placeholder="Enter monthly income" 
                    style={FIELD_STYLE}
                 
                    type="number"
                    min="0"
                    step="0.01"
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
                  label="Proof of Identification"
                  name="proof_of_identification"
                  rules={[{ required: true, message: "Proof of identification is required" }]}
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
                  label="Identification Number"
                  name="identification_number"
                  rules={[{ required: true, message: "Identification number is required" }]}
                >
                  <Input placeholder="Enter identification number" style={FIELD_STYLE} />
      </Form.Item>
              </Col>
              {/* <Col xs={24} md={24}>
      <Form.Item
                  label={
                    <Tooltip title="Upload clear images of the front and back of your ID card" color="#ffffff" >
                      Identification Card (Front and Back)
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
              </Col> */}
            </Row>
          </Card>

          {/* Address */}
          <Card type="inner" title="Address" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
<Form.Item
                  label="Address"
                  name="address"
                  rules={[{ required: true, message: "Address is required" }]}
                >
                  <Input placeholder="Enter address" style={FIELD_STYLE} />
</Form.Item>
              </Col>
              <Col xs={24} md={12}>
              <Form.Item
                  label="City"
                  name="city"
                  rules={[{ required: true, message: "City is required" }]}
                >
                  <Input placeholder="Enter city" style={FIELD_STYLE} />
              </Form.Item>
              </Col>
              <Col xs={24} md={12}>
              <Form.Item
                  label="State/Province"
                  name="state"
                  rules={[{ required: true, message: "State/Province is required" }]}
                >
                  <Input placeholder="Enter state or province" style={FIELD_STYLE} />
              </Form.Item>
              </Col>
              <Col xs={24} md={12}>
              <Form.Item
                  label="Zipcode"
                  name="zipcode"
                  rules={[{ required: true, message: "Zipcode is required" }, { pattern: /^\d{4,10}$/, message: "Enter a valid zipcode" }]}
                >
                  <Input placeholder="Enter zipcode" style={FIELD_STYLE} />
              </Form.Item>
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
                    {qryBranchData?.map((branch) => (
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
<Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
            </div>
  );
};

export default EditBorrower;
