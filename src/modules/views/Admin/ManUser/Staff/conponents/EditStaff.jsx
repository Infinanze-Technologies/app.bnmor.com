import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Spin,
  Modal,
  Upload,
  message
} from "antd";
import { getRequest, updateRequest } from "@/hooks/apiService";
import { URL_UPDATE_EMPLOYEE, URL_GET_ALL_EMP_ROLES, URL_GET_DEPARTMENT_BY_BRANCH, URL_GET_DESIGNATION_BY_DEPARTMENT, URL_GET_Qry_BRANCH } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import moment from 'moment';
import ImgCrop from 'antd-img-crop';
import useSelectQuery from "@/hooks/ReactQuery/useSelectQuery";
import useToastMessage from "@/hooks/useToastMessage";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import CustomNumberInput from "@/components/form/CustomNumberInput";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const dateFormat = 'YYYY-MM-DD';

const toBase64 = file =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const EditStaff = (props) => {
  let { jwt, record, refetch, RoleDataObject, QryBranchDataObject, setpage, setIsModalVisible} = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [profileUpload, setProfileUpload] = useState(null);
  const [certificateUpload, setCertificateUpload] = useState(null);
  const [resumeUpload, setResumeUpload] = useState(null);
  const [pfileList, setProfileFileList] = useState([]);
  const [branchId, setBranchId] = useState(0);
  const [departmentId, setDepartmentId] = useState(0);
  const [getDepartments, setGetDepartments] = useState([]);
  const [getDesignations, setGetDesignations] = useState([]);
  const [isloadingDepartment, setIsloadingDepartment] = useState(false);
  const [isloadingDesignation, setIsloadingDesignation] = useState(false);
  const { toastError } = useToastMessage();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handleProfilefile = async ({ fileList }) => {
    const base64Files = await Promise.all(
      fileList.map(async file => {
        const base64 = await toBase64(file.originFileObj);
        return { ...file, base64 };
      })
    );
    setProfileFileList(base64Files);
  }

  const handleChangeBranch = (id) => {
    if (id == 0) {
      setGetDepartments([])
      setGetDesignations([])
      form.setFieldsValue({ department_id: 0 })
      form.setFieldsValue({ designation_id: 0 })
      setDepartmentId(0)
    } else {
      setBranchId(id)
      DepartmentById(id)
    }
  }

  const handleChangeDepartment = (id) => {
    if (id == 0) {
      setGetDesignations([])
      form.setFieldsValue({ designation_id: 0 })
      setDepartmentId(0)
    } else {
      setDepartmentId(id)
      DesignationById(id)
    }
  }

  let DepartmentById = async (id) => {
    setIsloadingDepartment(true)
    await getRequest(URL_GET_DEPARTMENT_BY_BRANCH + `/${id}`, jwt)
      .then((res) => {
        setIsloadingDepartment(false)
        setGetDepartments(res.data?.data)
        return res.data?.data;
      })
      .catch((err) => {
        console.log(err)
      });
  }

  let DesignationById = async (id) => {
    setIsloadingDesignation(true)
    await getRequest(URL_GET_DESIGNATION_BY_DEPARTMENT + `/${id}`, jwt)
      .then((res) => {
        console.log(res.data?.data);
        setIsloadingDesignation(false)
        setGetDesignations(res.data?.data)
        return res.data?.data;
      })
      .catch((err) => {
        console.log(err)
      });
  }

  useEffect(() => {
    if (record) {
      // Set initial values
      setBranchId(record?.branch_id || 0);
      setDepartmentId(record?.department_id || 0);
      
      // Load departments and designations if branch exists
      if (record?.branch_id) {
        DepartmentById(record.branch_id);
      }
      if (record?.department_id) {
        DesignationById(record.department_id);
      }

      // Set form values
      form.setFieldsValue({
        fullname: record?.fullname,
        email: record?.email,
        phone: record?.phone,
        address: record?.address,
        dob: record?.dob ? moment(record.dob) : null,
        gender: record?.gender,
        role_id: record?.role_id,
        branch_id: record?.branch_id,
        department_id: record?.department_id,
        designation_id: record?.designation_id,
        join_date: record?.join_date ? moment(record.join_date) : null,
        holder_name: record?.bank?.holder_name,
        bank_name: record?.bank?.bank_name,
        branch_location: record?.bank?.branch_location,
        bank_code: record?.bank?.bank_code,
        account_number: record?.bank?.account_number,
        tax_payer_id: record?.bank?.tax_payer_id,
      });
    }
  }, [record, form]);

  // const handleCertificatefile = async (e) => {
  //   const file = e.target.files[0];
  //   await toBase64(file)
  //     .then(result => {
  //       file["base64"] = result;
  //       setCertificateUpload(file["base64"]);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  // const handleResumefile = async (e) => {
  //   const file = e.target.files[0];
  //   await toBase64(file)
  //     .then(result => {
  //       file["base64"] = result;
  //       setResumeUpload(file["base64"]);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  const handleCancel = () => setPreviewOpen(false);
  
  // const onProfilePreview = async (file) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await toBase64(file.originFileObj);
  //   }
  //   setPreviewImage(file.url || file.preview);
  //   setPreviewOpen(true);
  //   setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  // };

  // const beforeProfileUpload = (file) => {
  //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  //   if (!isJpgOrPng) {
  //     message.error('You can only upload JPG/PNG file!');
  //   }
  //   const isLt2M = file.size / 1024 / 1024 < 2;
    
  //   if (!isLt2M) {
  //     message.error('Image must smaller than 2MB!');
  //   }
    
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       file.base64 = reader.result;
  //       setProfileUpload(reader.result)
  //       resolve(file);
  //     };
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  const onFinish = (values) => {
    try {
      if (branchId === null || branchId == 0)
        return toastError("Branch is required");

      if (departmentId === null || departmentId == 0)
        return toastError("Department is required");

      if (values?.designation_id == 0)
        return toastError("Designation is required");

      let employee = {
        "fullname": values?.fullname,
        "email": values?.email,
        "phone": values?.phone,
        "address": values?.address,
        "dob": values?.dob?.format(dateFormat),
        "gender": values?.gender,
        "role_id": values?.role_id,
        "branch_id": branchId,
        "department_id": departmentId,
        "designation_id": values?.designation_id,
        "join_date": values?.join_date?.format(dateFormat)
      }

      let bank_details = {
        "holder_name": values?.holder_name,
        "bank_name": values?.bank_name,
        "branch_location": values?.branch_location,
        "bank_code": values?.bank_code,
        "account_number": values?.account_number,
        "tax_payer_id": values?.tax_payer_id,
      }

      let files = {}
      if (profileUpload) files.profile = profileUpload;
      if (certificateUpload) files.certificate = certificateUpload;
      if (resumeUpload) files.resume = resumeUpload;

      let data = {
        employee,
        bank_details,
        // ...(Object.keys(files).length > 0 && { files })
      }

      // console.log({ ...data });

      setIsloadingSubmit(true);
      updateRequest(URL_UPDATE_EMPLOYEE, record?.employee_id, { ...data }, jwt)
        .then((res) => {
          setIsloadingSubmit(false);
          handleRequestResponse(res)
          refetch();
          setIsModalVisible(false);
          setpage(0);
        }).finally(() => {
          setIsloadingSubmit(false);
        })
        .catch((err) => {
          handleRequestError(err);
        });
      
    } catch (error) {
      setIsloadingSubmit(false);
      console.log(error)
    }
  };

  // Prepare options for custom selects
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  const roleOptions = RoleDataObject?.data?.map(item => ({
    value: item?.id,
    label: item?.name
  })) || [];

  const branchOptions = QryBranchDataObject?.data?.map(item => ({
    value: item?.branch_id,
    label: item?.name
  })) || [];

  const departmentOptions = getDepartments?.map(item => ({
    value: item?.id,
    label: item?.name
  })) || [];

  const designationOptions = getDesignations?.map(item => ({
    value: item?.id,
    label: item?.name
  })) || [];

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
        title={<span style={{ fontSize: 24, fontWeight: 700, color: "#2a3f54" }}>Edit Staff Member</span>}
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
                <CustomInput
                  label="Full Name"
                  name="fullname"
                  rules={[{ required: true, message: "Full name is required" }]}
                  placeholder="Enter full name"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Email"
                  name="email"
                  type="email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Enter a valid email" }
                  ]}
                  placeholder="Enter email address"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Phone Number"
                  name="phone"
                  rules={[{ required: true, message: "Phone number is required" }]}
                  placeholder="Enter phone number"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Address"
                  name="address"
                  rules={[{ required: true, message: "Address is required" }]}
                  placeholder="Enter address"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomSelect
                  label="Gender"
                  name="gender"
                  options={genderOptions}
                  rules={[{ required: true, message: "Gender is required" }]}
                  placeholder="Select gender"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomSelect
                  label="Role"
                  name="role_id"
                  options={roleOptions}
                  rules={[{ required: true, message: "Role is required" }]}
                  placeholder="Select role"
                />
              </Col>
              <Col xs={24} md={24}>
                <CustomDatePicker
                  label="Date of Birth"
                  name="dob"
                  rules={[{ required: true, message: "Date of birth is required" }]}
                  placeholder="Select date of birth"
                  datePickerProps={{
                    format: dateFormat
                  }}
                />
              </Col>
            </Row>
          </Card>

          {/* Company Information */}
          <Card type="inner" title="Company Information" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <CustomSelect
                  label="Branch"
                  name="branch_id"
                  options={branchOptions}
                  rules={[{ required: true, message: "Branch is required" }]}
                  placeholder="Select branch"
                  selectProps={{
                    onChange: handleChangeBranch
                  }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Spin spinning={isloadingDepartment}>
                  <CustomSelect
                    label="Department"
                    name="department_id"
                    options={departmentOptions}
                    rules={[{ required: true, message: "Department is required" }]}
                    placeholder="Select department"
                    selectProps={{
                      onChange: handleChangeDepartment
                    }}
                  />
                </Spin>
              </Col>
              <Col xs={24} md={12}>
                <Spin spinning={isloadingDesignation}>
                  <CustomSelect
                    label="Designation"
                    name="designation_id"
                    options={designationOptions}
                    rules={[{ required: true, message: "Designation is required" }]}
                    placeholder="Select designation"
                  />
                </Spin>
              </Col>
              <Col xs={24} md={12}>
                <CustomDatePicker
                  label="Date of Joining"
                  name="join_date"
                  rules={[{ required: true, message: "Date of joining is required" }]}
                  placeholder="Select date of joining"
                  datePickerProps={{
                    format: dateFormat
                  }}
                />
              </Col>
            </Row>
          </Card>

          {/* Documents */}
          {/* <Card type="inner" title="Documents" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <div className="form-group">
                  <label className="col-form-label">
                    Profile Photo
                  </label>
                  <Form.Item>
                    <ImgCrop rotationSlider>
                      <Upload
                        accept="image/webp,image/jpeg,image/png,image/jpg"
                        listType="picture-card"
                        fileList={pfileList}
                        onChange={handleProfilefile}
                        onPreview={onProfilePreview}
                        beforeUpload={beforeProfileUpload}
                      >
                        {pfileList.length < 1 && '+ Upload'}
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="form-group">
                  <label className="col-form-label">
                    Certificate
                  </label>
                  <Form.Item>
                    <input
                      className="form-control"
                      type="file"
                      accept=".pdf"
                      onChange={handleCertificatefile}
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="form-group">
                  <label className="col-form-label">
                    Resume
                  </label>
                  <Form.Item>
                    <input
                      className="form-control"
                      type="file"
                      accept=".pdf"
                      onChange={handleResumefile}
                    />
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </Card> */}

          {/* Bank Account Information */}
          <Card type="inner" title="Bank Account Information" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Account Holder Name"
                  name="holder_name"
                  rules={[{ required: true, message: "Account holder name is required" }]}
                  placeholder="Enter account holder name"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomNumberInput
                  label="Account Number"
                  name="account_number"
                  rules={[{ required: true, message: "Account number is required" }]}
                  placeholder="Enter account number"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Bank Name"
                  name="bank_name"
                  rules={[{ required: true, message: "Bank name is required" }]}
                  placeholder="Enter bank name"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Bank Code"
                  name="bank_code"
                  rules={[{ required: true, message: "Bank code is required" }]}
                  placeholder="Enter bank code"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Branch Location"
                  name="branch_location"
                  rules={[{ required: true, message: "Branch location is required" }]}
                  placeholder="Enter branch location"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Tax Payer ID"
                  name="tax_payer_id"
                  rules={[{ required: true, message: "Tax payer ID is required" }]}
                  placeholder="Enter tax payer ID"
                />
              </Col>
            </Row>
          </Card>

          {/* Submit Button */}
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button
              {...BUTTON_CONFIGS.SAVE_BUTTON()}
              htmlType="submit"
              loading={isloadingSubmit}
              size="small"
              shape="round"
            >
              Save
            </Button>
          </div>
        </Form>
      </Card>

      {/* Profile Preview Modal */}
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};

export default EditStaff;
