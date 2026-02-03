import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  DatePicker,
  TimePicker,
  Typography
} from "antd";

const { Text } = Typography;
import { postRequest, getRequest } from "@/hooks/apiService";
import { URL_ADD_VISITOR_APPOINTMENTS, URL_GET_VISITOR_HOSTS_BY_DEPARTMENT, URL_SHOW_VISITOR_HOSTS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import moment from 'moment';
import useToastMessage from "@/hooks/useToastMessage";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomDatePicker from "@/components/form/CustomDatePicker";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
import useSelectQuery from "@/hooks/ReactQuery/useSelectQuery";

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm';

const AddAppointments = (props) => {

  let {DepartmentsDataObject, ActiveVisitorsDataObject, jwt, setIsModalVisible, refetch, setpage } = props;

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

  // Reset form when modal opens
  useEffect(() => {
    if (form) {
      try {
        form.resetFields();
        setSelectedDepartment(null);
        setDepartmentHosts([]);
      } catch (error) {
        console.log('Error resetting form:', error);
      }
    }
  }, [form]);

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
        "scheduled_for": values?.scheduled_for?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        "visit_type": values?.visit_type,
        "purpose": values?.purpose,
        "notes": values?.notes,
        "status": values?.status || 'Scheduled'
      }

      setIsloadingSubmit(true);
      postRequest(URL_ADD_VISITOR_APPOINTMENTS, appointmentData, jwt)
        .then((res) => {
          setIsloadingSubmit(false);
          handleRequestResponse(res)
          form.resetFields()
          setpage(0);
          refetch();
          setIsModalVisible(false);
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
    // { value: 'Rescheduled', label: 'Rescheduled' },
    // { value: 'Cancelled', label: 'Cancelled' },
    // { value: 'Completed', label: 'Completed' },
    // { value: 'Missed', label: 'Missed' }
  ];

  const guestOptions = ActiveVisitorsDataObject?.data?.map(item => ({
    value: item?.guest_id,
    label: item?.name
  })) || [];
  // console.log(ActiveVisitorsDataObject?.data);

  // Use only department-specific hosts
  const hostOptions = departmentHosts.map(item => ({
    value: item?.host_id,
    label: item?.host_name || 'Unknown Host'
  }));

  const departmentOptions = DepartmentsDataObject?.data?.map(item => ({
    value: item?.department_id,
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
        title={<span style={{ fontSize: 24, fontWeight: 700, color: "#2a3f54" }}>Create New Appointment</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Appointment Information */}
          <Card type="inner" title="Appointment Details" style={{ marginBottom: 24, borderRadius: 8 }}>
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
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomSelect
                  label="Visit Type"
                  name="visit_type"
                  options={visitTypeOptions}
                  rules={[{ required: true, message: "Visit type is required" }]}
                  placeholder="Select visit type"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomSelect
                  label="Status"
                  name="status"
                  options={statusOptions}
                  rules={[{ required: true, message: "Status is required" }]}
                  placeholder="Select status"
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomDatePicker
                  label="Scheduled Date & Time"
                  name="scheduled_for"
                  rules={[{ required: true, message: "Scheduled date and time is required" }]}
                  placeholder="Select date and time"
                  datePickerProps={{
                    showTime: true,
                    format: 'YYYY-MM-DD HH:mm',
                    style: { width: '100%' }
                  }}
                />
              </Col>
            </Row>
          </Card>



          {/* Purpose and Notes */}
          <Card type="inner" title="Additional Information" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col xs={24} md={24}>
                <CustomInput
                  label="Purpose"
                  name="purpose"
                  rules={[{ required: true, message: "Purpose is required" }]}
                  placeholder="Enter appointment purpose"
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
    </div>
  );
};

export default AddAppointments;