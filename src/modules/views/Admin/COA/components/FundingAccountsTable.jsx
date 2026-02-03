import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Button, Collapse, Card, Row, Col, Typography, Alert, Skeleton } from "antd";
import ModalComponent from "@/components/ModalComponent";
import { EyeOutlined, EditOutlined, DeleteOutlined, DownOutlined, RightOutlined, BankOutlined, WalletOutlined } from '@ant-design/icons';
import { UserTableStyleWrapper, TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import AddFundingAccountModal from "./Modals/Funding/AddFundingAccountModal";
import EditFundingAccountModal from "./Modals/Funding/EditFundingAccountModal";
import EditParentAccountModal from "./Modals/Funding/EditParentAccountModal";
import ViewFundingAccountModal from "./Modals/Funding/ViewFundingAccountModal";
import { deleteRequest } from "@/hooks/apiService";
import { URL_DELETE_COA } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";

const { Panel } = Collapse;
const { Text, Title } = Typography;

const FundingAccountsTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [expandedKeys, setExpandedKeys] = useState([]);
  
  // Modal states
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditParentModalVisible, setIsEditParentModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  let { jwt, fundingData, branchData, loading, error, FundingDataObject, CashFundingDataObject } = props;


  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_COA, Number(record?.key), jwt)
      .then((res) => {
        handleRequestResponse(res);
        FundingDataObject?.refetchEntity();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };

  
  // Transform API data to component format
  const transformFundingData = (apiData) => {
    console.log('Raw funding data:', apiData);
    
    if (!apiData) {
      console.log('No API data provided');
      return [];
    }
    
    if (!apiData.data) {

      return [];
    }
    
    const transformed = apiData.data.map(account => ({
      key: account.key,
      code: account.code,
      name: account.name,
      accountType: account.accountType,
      openingBalance: account.openingBalance,
      isParent: account.isParent,
      hasChildren: account.hasChildren,
      children: (account.children || []).map(child => ({
        key: child.key,
        code: child.code,
        name: child.name,
        accountType: child.accountType,
        openingBalance: child.openingBalance,
        branchName: child.branch,
        isChild: true,
        parentKey: account.key,
        branch: child.branch_id,
        openingBalanceDate: child.openingBalanceDate
      }))
    }));
    

    return transformed;
  };

  const fundingAccountsData = fundingData ? transformFundingData(fundingData) : [];

  // Skeleton component for loading state
  const FundingAccountsSkeleton = () => (
    <div className="card card-table flex-fill">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Skeleton.Input active size="large" style={{ width: 300, height: 24 }} />
            <Skeleton.Input active size="small" style={{ width: 400, height: 16, marginTop: 8 }} />
          </div>
          <Skeleton.Button active size="large" style={{ width: 120, height: 40 }} />
        </div>
      </div>
      <div className="card-body">
        <div className="accordion-container">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="mb-3" style={{ borderRadius: '8px' }}>
              <div className="p-3">
                <Row align="middle" justify="space-between">
                  <Col span={16}>
                    <div className="d-flex align-items-center">
                      <Skeleton.Avatar active size={40} className="me-3" />
                      <div>
                        <Skeleton.Input active size="small" style={{ width: 200, height: 20, marginBottom: 8 }} />
                        <Skeleton.Input active size="small" style={{ width: 150, height: 14 }} />
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="text-end">
                      <Skeleton.Input active size="small" style={{ width: 100, height: 14, marginBottom: 4 }} />
                      <Skeleton.Input active size="small" style={{ width: 80, height: 16 }} />
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Custom accordion header component
  const AccordionHeader = ({ record }) => (
    <div className="d-flex justify-content-between align-items-center w-100" style={{ paddingRight: '40px' }}>
      <div className="d-flex align-items-center">
        <div className="me-3">
          {record.accountType === 'Asset' ? (
            <BankOutlined style={{ fontSize: '1.5rem', color: '#52c41a' }} />
          ) : (
            <WalletOutlined style={{ fontSize: '1.5rem', color: '#1890ff' }} />
          )}
        </div>
        <div>
          <Title level={5} className="mb-1">
            {record.name}
          </Title>
          <Text type="secondary" className="small">
            Code: {record.code} | Type: {record.accountType}
          </Text>
        </div>
      </div>
      {/* <div className="d-flex align-items-center">
        <div className="me-3 text-end">
          <div>
            <Text type="secondary" className="small d-block">
              Opening Balance
            </Text>
            <Text strong className="text-success">
              {record.openingBalance}
            </Text>
          </div>
        </div>
        <Space size="small">
          <EditOutlined 
            style={{ fontSize: "1.2rem", cursor: "pointer", color: "#52c41a" }} 
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
            title="Edit Opening Balance"
          />
        </Space>
      </div> */}
    </div>
  );

  const handleEdit = (record) => {
    setSelectedAccount(record);
    if (record.isParent) {
      setIsEditParentModalVisible(true);
    } else {
      setIsEditModalVisible(true);
    }
  };

  const handleCloseModals = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setIsEditParentModalVisible(false);
    setIsViewModalVisible(false);
    setSelectedAccount(null);
  };

 

  // Child account row component
  const ChildAccountRow = ({ child }) => (
    <Card 
      size="small" 
      className="mb-2 ms-4 border-start border-3 border-primary"
      style={{ 
        transition: 'all 0.3s ease',
        backgroundColor: '#f8f9fa'
      }}
    >
      <Row align="middle" justify="space-between">
        <Col span={16}>
          <div className="d-flex align-items-center">
            <div className="me-3">
              <BankOutlined style={{ fontSize: '1.2rem', color: '#1890ff' }} />
            </div>
            <div>
              <Text strong>{child.name}</Text>
              <br />
              <Text type="secondary" className="small">
                Code: {child.code} | Type: {child.accountType}
              </Text>
              <br />
              <Text type="secondary" className="small">
                Branch: {child.branchName}
              </Text>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-end">
              <Text type="secondary" className="small d-block">
                Opening Balance
              </Text>
              <Text strong className="text-success">
                GH¢ {child.openingBalance}
              </Text>
            </div>
            <Space size="small">
       
          <EditOutlined 
                style={{ fontSize: "1.1rem", cursor: "pointer", color: "#52c41a" }} 
                onClick={() => handleEdit(child)}
          />
            
            <Popconfirm
          title="Are you sure？"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(child)}
        >
            <DeleteOutlined 
                style={{ fontSize: "1.1rem", cursor: "pointer", color: "#ff4d4f" }} 
               
            />
        </Popconfirm>
        </Space>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const showModal = (value) => {
    if (value === "add") {
      setIsAddModalVisible(true);
    }

  };


  // Show loading state
  if (loading) {
    return <FundingAccountsSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="card card-table flex-fill">
        <div className="card-body">
          <Alert
            message="Error Loading Data"
            description={`Failed to load funding accounts. Error: ${error?.message || 'Unknown error'}`}
            type="error"
            showIcon
          />
          <div className="mt-3">
            <details>
              <summary>Debug Information</summary>
              <pre className="mt-2 p-2 bg-light rounded">
                {JSON.stringify({ error, fundingData }, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card card-table flex-fill">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="card-title mb-1">Funding Accounts for Main Branch</h3>
              <p className="text-muted mb-0">
                Manage your funding accounts with hierarchical organization
              </p>
            </div>
              <div className='submit-button'>
                <Button 
                  onClick={() => showModal("add")}
                  shape="round"
                  loading={loading}
                > 
                  Add Account
                </Button>
              </div>
          </div>
        </div>
        <div className="card-body">
          <div className="accordion-container">
            <Collapse
              activeKey={expandedKeys}
              onChange={setExpandedKeys}
              expandIcon={({ isActive }) => (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#1890ff' : '#f5f5f5',
                  transition: 'all 0.3s ease'
                }}>
                  <RightOutlined 
                    style={{ 
                      transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      color: isActive ? '#fff' : '#666',
                      fontSize: '12px'
                    }} 
                  />
                </div>
              )}
              expandIconPosition="right"
              ghost
              className="funding-accounts-accordion"
            >
              {fundingAccountsData.map((record) => (
                <Panel
                  key={record.key}
                  header={<AccordionHeader record={record} />}
                  showArrow={record.hasChildren}
                  className="accordion-panel"
                  style={{
                    marginBottom: '12px',
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {record.hasChildren && record.children && record.children.length > 0 ? (
                    <div 
                      className="children-container"
                      style={{
                        padding: '16px 0',
                        animation: 'slideDown 0.3s ease-out'
                      }}
                    >
                      <div className="mb-3">
                        <Text type="secondary" className="small">
                          <strong>{record.children.length}</strong> sub-account{record.children.length > 1 ? 's' : ''} under {record.name}
                        </Text>
                      </div>
                      {record.children.map((child) => (
                        <ChildAccountRow key={child.key} child={child} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Text type="secondary">
                        No sub-accounts available
                      </Text>
                    </div>
                  )}
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>
      </div>

      {/* Add Account Modal */}
      <ModalComponent
        isModalVisible={isAddModalVisible}
        handleCancel={() => setIsAddModalVisible(false)}
        title="Add New Funding Account"
        width={500}
      >
        <AddFundingAccountModal
          isVisible={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
 
          branchData={branchData}
          CashFundingDataObject={CashFundingDataObject}
          FundingDataObject={FundingDataObject}
            loading={loading}
          jwt={jwt}
        />
      </ModalComponent>

      {/* Edit Parent Account Modal */}
      <ModalComponent
        isModalVisible={isEditParentModalVisible}
        handleCancel={() => setIsEditParentModalVisible(false)}
        title="Edit Opening Balance"
        width={600}
      >
        <EditParentAccountModal
          isVisible={isEditParentModalVisible}
          onCancel={() => setIsEditParentModalVisible(false)}
          accountData={selectedAccount}
          loading={loading}
          jwt={jwt}
          FundingDataObject={FundingDataObject}
        />
      </ModalComponent>

      {/* Edit Child Account Modal */}
      <ModalComponent
        isModalVisible={isEditModalVisible}
        handleCancel={() => setIsEditModalVisible(false)}
        title="Edit Funding Account"
        width={500}
      >
        <EditFundingAccountModal
          isVisible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          accountData={selectedAccount}
          branchData={branchData}
          CashFundingDataObject={CashFundingDataObject}
          FundingDataObject={FundingDataObject}
          loading={loading}
          jwt={jwt}
        />
      </ModalComponent>


      <style jsx>{`
        .funding-accounts-accordion .ant-collapse-item {
          border-radius: 8px !important;
          margin-bottom: 12px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
          transition: all 0.3s ease !important;
        }
        
        .funding-accounts-accordion .ant-collapse-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
        
        .funding-accounts-accordion .ant-collapse-header {
          padding: 16px 20px !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
          display: flex !important;
          align-items: center !important;
        }
        
        .funding-accounts-accordion .ant-collapse-arrow {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-left: 12px !important;
        }
        
        .funding-accounts-accordion .ant-collapse-content {
          border-radius: 0 0 8px 8px !important;
        }
        
        .funding-accounts-accordion .ant-collapse-content-box {
          padding: 0 20px 20px 20px !important;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .children-container {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default FundingAccountsTable;
