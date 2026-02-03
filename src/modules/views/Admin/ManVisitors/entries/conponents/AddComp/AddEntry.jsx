import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form
} from "antd";
import { postRequest, getRequest } from "@/hooks/apiService";
import { URL_ADD_VISITOR_ENTRIES, URL_GET_VISITOR_HOSTS_BY_DEPARTMENT } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
import CustomTextArea from "@/components/form/CustomTextArea";
const AddEntry = (props) => {

  let { QryBranchDataObject, ActiveVisitorsDataObject, HostsDataObject, DepartmentsDataObject, jwt, setIsModalVisible, refetch, setpage, selectedGuest, forceRefetch } = props;

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
        
        // No need to pre-populate guest field since it's handled by the display component
      } catch (error) {
        console.log('Error resetting form:', error);
      }
    }
  }, [form, selectedGuest]);

  const onFinish = (values) => {
    try {
      // Use selectedGuest guest_id if provided, otherwise use form values
      const guestId = selectedGuest ? selectedGuest.guest_id : values?.guest_id;
      const entryType = selectedGuest ? "Walk-in" : values?.entry_type;
      
      if (!guestId) {
        return toastError("Guest is required");
      }

      if (!values?.host_id) {
        return toastError("Host is required");
      }

      if (!values?.department_id) {
        return toastError("Department is required");
      }


      if (!values?.visit_type) {
        return toastError("Visit type is required");
      }

      if (!values?.purpose) {
        return toastError("Purpose is required");
      }

      let entryData = {
        "entry_type": 'Walk-in',
        "visit_type": values?.visit_type,
        "guest_id": guestId,
        "host_id": values?.host_id,
        "department_id": values?.department_id,
        "purpose": values?.purpose
      }

      setIsloadingSubmit(true);
      postRequest(URL_ADD_VISITOR_ENTRIES, entryData, jwt)
        .then(async (res) => {
          setIsloadingSubmit(false);
          handleRequestResponse(res)
          form.resetFields()
          setpage(0);
          ActiveVisitorsDataObject
          await forceRefetch();
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
  const entryTypeOptions = [
    { value: 'Walk-in', label: 'Walk-in' },
    // { value: 'Appointment', label: 'Appointment' }
  ];

  const visitTypeOptions = [
    { value: 'Vendor', label: 'Vendor' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Visitor', label: 'Visitor' },
    { value: 'Business', label: 'Business' },
    { value: 'Other', label: 'Other' }
  ];

  const guestOptions = ActiveVisitorsDataObject?.data?.map(item => ({
    value: item?.guest_id,
    label: item?.name
  })) || [];

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
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Entry Information */}
        <Card type="inner" title="Entry Details" style={{ marginBottom: 24, borderRadius: 8 }}>
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
              {/* <Col xs={24} md={12}>
                {selectedGuest ? (
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '500',
                      color: '#4D4D4D'
                    }}>
                      Entry Type
                    </label>
                    <div style={{
                      padding: '8px 12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      backgroundColor: '#f5f5f5',
                      color: '#4D4D4D',
                      fontWeight: '500'
                    }}>
                      Walk-in
                    </div>
                    <input type="hidden" name="entry_type" value="Walk-in" />
                  </div>
                ) : (
                  <CustomSelect
                    label="Entry Type"
                    name="entry_type"
                    options={entryTypeOptions}
                    rules={[{ required: true, message: "Entry type is required" }]}
                    placeholder="Select entry type"
                  />
                )}
              </Col> */}
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
               <Col xs={24} md={24}>
                 <CustomTextArea
                   label="Purpose"
                   name="purpose"
                   rules={[{ required: true, message: "Purpose is required" }]}
                   placeholder="Enter visit purpose"
                   textAreaProps={{ rows: 6 }}
                   style={{ minHeight: 120 }}
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
    </div>
  );
};

export default AddEntry;