import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Form
} from "antd";
import { updateRequest } from "@/hooks/apiService";
import { URL_UPDATE_VISITOR_ENTRIES } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useToastMessage from "@/hooks/useToastMessage";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const EditEntry = (props) => {
  let { jwt, record, refetch, QryBranchDataObject, GuestsDataObject, HostsDataObject, DepartmentsDataObject, setpage, setIsModalVisible} = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  const [form] = Form.useForm();
  const [isloadingSubmit, setIsloadingSubmit] = useState(false);
  const { toastError } = useToastMessage();

  useEffect(() => {
    if (record) {
      // Set form values
      form.setFieldsValue({
        entry_type: record?.entry?.entry_type,
        visit_type: record?.entry?.visit_type,
        guest_id: record?.guest?.guest_id,
        host_id: record?.host?.employee_id,
        department_id: record?.department?.department_id,
        purpose: record?.entry?.purpose
      });
    }
  }, [record, form]);

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

      if (!values?.entry_type) {
        return toastError("Entry type is required");
      }

      if (!values?.visit_type) {
        return toastError("Visit type is required");
      }

      if (!values?.purpose) {
        return toastError("Purpose is required");
      }

      let entryData = {
        "entry_type": values?.entry_type,
        "visit_type": values?.visit_type,
        "guest_id": values?.guest_id,
        "host_id": values?.host_id,
        "department_id": values?.department_id,
        "purpose": values?.purpose
      }

      setIsloadingSubmit(true);
      updateRequest(URL_UPDATE_VISITOR_ENTRIES, record?.entry_id, entryData, jwt)
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
  const entryTypeOptions = [
    { value: 'Walk-in', label: 'Walk-in' },
    { value: 'Appointment', label: 'Appointment' }
  ];

  const visitTypeOptions = [
    { value: 'Vendor', label: 'Vendor' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Visitor', label: 'Visitor' },
    { value: 'Business', label: 'Business' },
    { value: 'Other', label: 'Other' }
  ];

  const guestOptions = GuestsDataObject?.data?.map(item => ({
    value: item?.guest_id,
    label: item?.type === 'Individual' ? item?.full_name : item?.org_name
  })) || [];

  const hostOptions = HostsDataObject?.data?.map(item => ({
    value: item?.employee_id,
    label: item?.fullname
  })) || [];

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
        title={<span style={{ fontSize: 24, fontWeight: 700, color: "#2a3f54" }}>Edit Entry</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
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
                  label="Entry Type"
                  name="entry_type"
                  options={entryTypeOptions}
                  rules={[{ required: true, message: "Entry type is required" }]}
                  placeholder="Select entry type"
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
                  label="Host"
                  name="host_id"
                  options={hostOptions}
                  rules={[{ required: true, message: "Host is required" }]}
                  placeholder="Select host"
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
                />
              </Col>
              <Col xs={24} md={12}>
                <CustomInput
                  label="Purpose"
                  name="purpose"
                  rules={[{ required: true, message: "Purpose is required" }]}
                  placeholder="Enter visit purpose"
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

export default EditEntry;