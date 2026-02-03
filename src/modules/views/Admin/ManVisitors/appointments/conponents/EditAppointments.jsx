import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Typography,
  Space,
  Tag
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import { updateRequest, getRequest } from "@/hooks/apiService";
import { URL_UPDATE_VISITOR_APPOINTMENTS, URL_GET_VISITOR_HOSTS_BY_DEPARTMENT } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import dayjs from 'dayjs';
import useToastMessage from "@/hooks/useToastMessage";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const { Text } = Typography;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';


const EditAppointments = (props) => {
  let { jwt, record, refetch, DepartmentsDataObject, ActiveVisitorsDataObject, setpage, setIsModalVisible} = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentHosts, setDepartmentHosts] = useState([]);
  const [isLoadingHosts, setIsLoadingHosts] = useState(false);
  const { toastError } = useToastMessage();

  // Function to fetch hosts by department
  const fetchHostsByDepartment = async (departmentId) => {
    if (!departmentId) {
      setDepartmentHosts([]);
      return;
    }
    // console.log(record);

    setIsLoadingHosts(true);
    try {
      const response = await getRequest(`${URL_GET_VISITOR_HOSTS_BY_DEPARTMENT}/${departmentId}`, jwt);
      setDepartmentHosts(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching hosts by department:', error);
      setDepartmentHosts([]);
    } finally {
      setIsLoadingHosts(false);
    }
  };

  // Handle department change
  const handleDepartmentChange = (departmentId) => {
    setSelectedDepartment(departmentId);
    form.setFieldsValue({ host_id: undefined }); // Clear host selection
    fetchHostsByDepartment(departmentId);
  };

  useEffect(() => {
    if (record) {
      // Set initial department and fetch hosts
      const departmentId = record?.department?.department_id;
      if (departmentId) {
        setSelectedDepartment(departmentId);
        fetchHostsByDepartment(departmentId);
      }

      // Set form values
      form.setFieldsValue({
        guest_id: record?.guest?.guest_id,
        host_id: record?.host_id,
        department_id: departmentId,
        scheduled_for: record?.scheduled_for ? dayjs(record.scheduled_for) : null,
        visit_type: record?.entry?.visit_type,
        purpose: record?.entry?.purpose,
        notes: record?.entry?.notes,
        status: record?.status
      });
    }
  }, [record, form]);

  // Set host_id after hosts are loaded
  useEffect(() => {
    if (record?.host_id) {
      // console.log('Department hosts:', departmentHosts);
      // console.log('Record host_id:', record.host_id);
      
      // Find the host in departmentHosts that matches the host_id from record
      const matchingHost = departmentHosts.find(host => host.host_id === record.host_id);
      // console.log('Matching host:', matchingHost);
      
      if (matchingHost) {
        // Set the form value to the host_id from departmentHosts
        form.setFieldsValue({ host_id: matchingHost.host_id });
        // console.log('Form host_id set to:', matchingHost.host_id);
      } else {
        // If host is not in department hosts, set the original host_id
        form.setFieldsValue({ host_id: record.host_id });
        // console.log('Form host_id set to original:', record.host_id);
      }
    }
  }, [departmentHosts, record, form]);

  const onFinish = (values) => {
    try {
      if (!values?.guest_id) {
        return toastError("Guest is required");
      }

      if (!values?.host_id) {
        return toastError("Host is required");
      }

      if (!values?.department_id) {
        return toastError("Department is required");
      }

      if (!values?.scheduled_for) {
        return toastError("Scheduled date and time is required");
      }

      let appointmentData = {
        "guest_id": values?.guest_id,
        "host_id": values?.host_id,
        "department_id": values?.department_id,
        // "scheduled_for": values?.scheduled_for?.format('YYYY-MM-DD HH:mm:ss'),
        scheduled_for: values?.scheduled_for?.format(dateFormat),
        "visit_type": values?.visit_type,
        "purpose": values?.purpose,
        "notes": values?.notes,
        "status": values?.status
      }

      setIsloadingSubmit(true);
      updateRequest(URL_UPDATE_VISITOR_APPOINTMENTS, record?.appointment_id, appointmentData, jwt)
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
  const visitTypeOptions = [
    { value: 'Vendor', label: 'Vendor' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Visitor', label: 'Visitor' },
    { value: 'Business', label: 'Business' },
    { value: 'Other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'Scheduled', label: 'Schedule' },
    { value: 'Rescheduled', label: 'Reschedule' },
    { value: 'Cancelled', label: 'Cancel' },
    { value: 'Completed', label: 'Complete' },
    { value: 'Missed', label: 'No Show' }
  ];

  const guestOptions = ActiveVisitorsDataObject?.data?.map(item => ({
    value: item?.guest_id,
    label: item?.name
  })) || [];

  // Use department-specific hosts and add current host if not found
  const hostOptions = departmentHosts.map(item => ({
    value: item?.host_id,
    label: item?.host_name || 'Unknown Host'
  }));
  
  // If the current host is not in the department hosts, add them to the options
  if (record?.host && !departmentHosts.find(host => host.host_id === record.host_id)) {
    hostOptions.unshift({
      value: record.host_id,
      label: record.host.fullname || 'Current Host'
    });
  }
  
  // console.log('Host options:', hostOptions);

  const departmentOptions = DepartmentsDataObject?.data?.map(item => ({
    value: item?.department_id,
    label: item?.name
  })) || [];

  return (
    <div style={{ 
      maxWidth: 1000, 
      margin: "0 auto", 
      padding: 24,
      maxHeight: '80vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: 'auto'
    }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
            }}>
              <EditOutlined style={{ color: 'white', fontSize: '14px' }} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                Edit Appointment
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>
                Modify appointment details
              </div>
            </div>
          </div>
        }
        bordered={false}
        style={{ 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', 
          borderRadius: 12,
          border: '1px solid rgba(139, 92, 246, 0.1)'
        }}
        headStyle={{ 
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderRadius: '12px 12px 0 0',
          borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Appointment Information */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Appointment Details</span>
              </div>
            }
            style={{ 
              marginBottom: 24, 
              borderRadius: 8,
              border: '1px solid rgba(24, 144, 255, 0.1)',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            }}
            headStyle={{ 
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              borderRadius: '8px 8px 0 0',
              borderBottom: '1px solid rgba(24, 144, 255, 0.1)'
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <CustomSelect
                  label="Guest"
                  name="guest_id"
                  options={guestOptions}
                  rules={[{ required: true, message: "Guest is required" }]}
                  placeholder="Select guest"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  prefix={<UserOutlined style={{ color: '#6b7280' }} />}
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomSelect
                  label="Department"
                  name="department_id"
                  options={departmentOptions}
                  rules={[{ required: true, message: "Department is required" }]}
                  placeholder="Select department"
                  selectProps={{
                    onChange: handleDepartmentChange
                  }}
                  prefix={<TeamOutlined style={{ color: '#6b7280' }} />}
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomSelect
                  label="Host"
                  name="host_id"
                  options={hostOptions}
                  rules={[{ required: true, message: "Host is required" }]}
                  placeholder={isLoadingHosts ? "Loading hosts..." : "Select host"}
                  showSearch
                  loading={isLoadingHosts}
                  disabled={!selectedDepartment}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  prefix={<UserOutlined style={{ color: '#6b7280' }} />}
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomSelect
                  label="Visit Type"
                  name="visit_type"
                  options={visitTypeOptions}
                  rules={[{ required: true, message: "Visit type is required" }]}
                  placeholder="Select visit type"
                  prefix={<FileTextOutlined style={{ color: '#6b7280' }} />}
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomSelect
                  label="Status"
                  name="status"
                  options={statusOptions}
                  rules={[{ required: true, message: "Status is required" }]}
                  placeholder="Select status"
                  prefix={<CheckCircleOutlined style={{ color: '#6b7280' }} />}
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomDatePicker
                  label="Scheduled Date & Time"
                  name="scheduled_for"
                  rules={[{ required: true, message: "Scheduled date and time is required" }]}
                  placeholder="Select date and time"
                  datePickerProps={{
                    format: dateFormat,
                    showTime: true
                  }}
                  prefix={<ClockCircleOutlined style={{ color: '#6b7280' }} />}
                />
              </Col>
            </Row>
          </Card>

          {/* Purpose and Notes */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExclamationCircleOutlined style={{ color: '#8b5cf6', fontSize: '16px' }} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Additional Information</span>
              </div>
            }
            style={{ 
              marginBottom: 24, 
              borderRadius: 8,
              border: '1px solid rgba(139, 92, 246, 0.1)',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            }}
            headStyle={{ 
              background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
              borderRadius: '8px 8px 0 0',
              borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={24}>
                <CustomInput
                  label="Purpose"
                  name="purpose"
                  rules={[{ required: true, message: "Purpose is required" }]}
                  placeholder="Enter appointment purpose"
                  prefix={<FileTextOutlined style={{ color: '#6b7280' }} />}
                />
              </Col>
              <Col xs={24} md={24}>
                <CustomInput
                  label="Notes"
                  name="notes"
                  rules={[]}
                  placeholder="Enter additional notes (optional)"
                  type="textarea"
                  rows={3}
                  prefix={<ExclamationCircleOutlined style={{ color: '#6b7280' }} />}
                />
              </Col>
            </Row>
          </Card>

          {/* Submit Button */}
          <div style={{ 
            textAlign: 'right', 
            marginTop: 24,
            padding: '20px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <Button
              // {...BUTTON_CONFIGS.SAVE_BUTTON()}
              htmlType="submit"
              loading={isloadingSubmit}
              size="large"
              shape="round"
              style={{
                background: 'linear-gradient(135deg, #4D4D4D 0%, #6B6B6B 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                fontWeight: '600',
                fontSize: '16px',
                color: 'white',
                height: '48px',
                padding: '0 32px'
              }}
              icon={<EditOutlined />}
            >
              Update Appointment
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EditAppointments;