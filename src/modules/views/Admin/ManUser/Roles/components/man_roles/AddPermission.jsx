import { useState, useEffect } from "react";
import { Form, Checkbox, Row, Col, Card, Typography, Button } from "antd";
import { URL_CREATE_PERMISSIONS } from "@/config/api-paths";
import _ from "lodash";
import { postRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
const { Title, Text } = Typography;
const CheckboxGroup = Checkbox.Group;

// Categories (for UI grouping only)
const PERMISSION_CATEGORIES = [
  { key: "User", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Role", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Award", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Transfer", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Resignation", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Promotion", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Complaint", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Termination", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Announcement", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Holiday", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Department", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Designation", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Branch", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Payroll", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Allowance", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Report", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Finance", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Recruitment", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Contract", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Event", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Meeting", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Asset", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Document", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Expense", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Loan", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Settings", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Leave", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Guarantor", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Borrower", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Group", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Audit", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Construction", actions: ["Create", "Read", "Update", "Delete"] },
  // { key: "Visitors", actions: ["Create", "Read", "Update", "Delete"] },
  // { key: "Projects", actions: ["Create", "Read", "Update", "Delete"] },
  // { key: "Documents", actions: ["Create", "Read", "Update", "Delete"] },
  // { key: "Policy", actions: ["Create", "Read", "Update", "Delete"] },
  { key: "Business", actions: ["Read", "Update"] }, // only 2 exist
];


export default function AddPermission(props) {
  const { record, RoleDataObject, jwt, permissionData,setIsModalVisible,forceRefetch } = props;
  const [form] = Form.useForm();
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const { handleRequestError, handleRequestResponse } = useHandleResponse()

// console.log("record",record);
// console.log("permissionData",permissionData);

  // const RolePermissionData = useGetEntity({
  //   url: URL_GET_ROLE_PERMISSION + "/" + record?.id,
  //   jwkToken: props?.jwt
  // });

  // const AllPermissionData = useGetEntity({
  //   url: URL_GET_ALL_PERMISSION_FOR_EDIT,
  //   jwkToken: props?.jwt
  // });


  // let get_role_permission = RolePermissionData?.data?.data?.permissions;
  // let get_all_permission = AllPermissionData?.data?.data;
  





  // function extractPermissions(permissionGroups) {
  //   if (!Array.isArray(permissionGroups)) return [];
  
  //   return permissionGroups.flatMap(group =>
  //     Object.values(group).flat()
  //   );
  // }
  // const ALL_PERMISSIONS = extractPermissions(get_all_permission);
  // console.log("Extracted Permissions:", ALL_PERMISSIONS);


  // On mount → prefill defaults
  useEffect(() => {
    const preSelected = {};

    record?.role_permissions?.forEach((perm) => {
      const [category] = perm.name.split(" "); // "User Create" → "User"
      if (!preSelected[category]) {
        preSelected[category] = [];
      }
      preSelected[category].push(perm.id); // use ID, not string
    });

    setSelected(preSelected);
    form.setFieldsValue(preSelected);
  }, [form]);

  // Sync form values with selected state
  useEffect(() => {
    form.setFieldsValue(selected);
  }, [selected, form]);

  const handlePermissionChange = (categoryKey, list) => {
    // console.log(`Updating ${categoryKey} with:`, list);
    setSelected((prev) => ({
      ...prev,
      [categoryKey]: list,
    }));
    
    // Also update the form field
    form.setFieldValue(categoryKey, list);
  };

  const renderPermissionSection = (category) => {
    try {
      // Find all IDs belonging to this category
      const options = category.actions.map((action) => {
        const perm = permissionData.find(
          (p) => p.name === `${category.key} ${action}`
        );
        return {
          label: `${category.key} ${action}`,
          value: perm?.id || 0, // use ID or fallback to 0 to prevent undefined
        };
      }).filter(option => option.value !== 0); // filter out invalid options

      // Debug logging (remove in production)
      // console.log(`Rendering ${category.key} with options:`, options);
      // console.log(`Current selected for ${category.key}:`, selected[category.key]);

      // If no valid options, don't render the section
      if (options.length === 0) {
        console.warn(`No valid options found for category: ${category.key}`);
        return null;
      }

    return (
      <Card
        size="small"
        style={{
          height: "100%",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          padding: "12px 16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <Title
            level={5}
            style={{
              margin: 0,
              color: "#1890ff",
              fontWeight: 600,
            }}
          >
            {category.key}
          </Title>
        </div>

        <Form.Item name={category.key} style={{ marginBottom: 0 }}>
          <CheckboxGroup
            value={selected[category.key] || []}
            options={options}
            onChange={(list) => {
              // console.log(`Permission change for ${category.key}:`, list);
              handlePermissionChange(category.key, list);
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: "14px",
            }}
          />
        </Form.Item>
      </Card>
    );
    } catch (error) {
      console.error(`Error rendering permission section for ${category.key}:`, error);
      return (
        <Card size="small" style={{ padding: "12px 16px" }}>
          <div style={{ color: "red" }}>
            Error loading permissions for {category.key}
          </div>
        </Card>
      );
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Flatten into single array of IDs
      const permissions = Object.values(selected).flat();
      // console.log("Submit payload:", { permissions });

      const data = {
        role_id: record?.id,
        permissions: permissions
      };
      // console.log("data",data);
      // return;

      postRequest(URL_CREATE_PERMISSIONS, data, jwt)
      .then(async (res) => {
        setLoading(false);
        handleRequestResponse(res);
        await forceRefetch();
        setIsModalVisible(false);
      })
      .catch((err) => {
        handleRequestError(err);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      
      });

    } catch (error) {
      console.error("Error saving permissions:", error);
      handleRequestError(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <div className="form-header" style={{ marginBottom: 24 }}>
        <Title level={3} style={{ color: '#1890ff', marginBottom: 8 }}>
          Add Role Permissions
        </Title>
        <Text type="secondary">
          Manage permissions for role: <strong>{record?.name}</strong>
        </Text>
      </div>

      <div 
        style={{ 
          maxHeight: '70vh', 
          overflowY: 'auto',
          padding: '0 4px',
          marginBottom: '16px'
        }}
      >
        <Row gutter={[16, 16]}>
          {PERMISSION_CATEGORIES.map((category) => (
            <Col span={8} key={category.key}>
              {renderPermissionSection(category)}
            </Col>
          ))}
        </Row>
      </div>

      <Col xs={24} md={24}>
          <div className="d-flex justify-content-end">
            <div className="d-grid">
              <div className="d-flex justify-content-end submit_buttom mt-4 w-100">
                <Form.Item>
                  <Button
                    loading={loading}
                    {...BUTTON_CONFIGS.SAVE_BUTTON()}
                    htmlType="submit"
                    size="small"
                    shape="round"
  
                  >
                   {loading ? "Saving..." : "Save"}
                  </Button>
                </Form.Item>
              </div>
            </div>
          </div>
        </Col>
    </Form>
  );
}
