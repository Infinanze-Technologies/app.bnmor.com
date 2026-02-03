import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Avatar, Button, Divider, List, Space, Modal, Image, Tabs, Tag, Switch, message, Select } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, FileImageOutlined, DollarOutlined, PercentageOutlined, CalendarOutlined, BankOutlined, MailOutlined, SafetyCertificateOutlined, FileTextOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import moment from 'moment';
// import AddRepaymentModal from '../AddRepaymentModal';
// import AddDiscountModal from '../AddDiscountModal';
// import EditRepaymentModal from '../EditRepaymentModal';
// import EditDiscountModal from '../EditDiscountModal';
// import DeleteRepaymentModal from '../DeleteRepaymentModal';
// import DeleteDiscountModal from '../DeleteDiscountModal';
import DetailsTab from './Tabs/DetailsTab';
import FeesAndPenaltiesTab from './Tabs/FeesAndPenaltiesTab';
import RepaymentsTab from './Tabs/RepaymentsTab';
import DiscountTab from './Tabs/DiscountTab';
import BorrowerTab from './Tabs/BorrowerTab';
import GuarantorTab from './Tabs/GuarantorTab';
import AccountingTab from './Tabs/AccountingTab';
import UploadsTab from './Tabs/UploadsTab';
import PaymentScheduleModal from '../Edit/PaymentScheduleModal';


const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;



const activityLogs = [
  {
    time: '2 hours ago',
    action: 'create',
    description: 'Loan product created successfully',
  },
  {
    time: '1 day ago',
    action: 'update',
    description: 'Interest rate updated from 10% to 12.5%',
  },
  {
    time: '3 days ago',
    action: 'configure',
    description: 'Late repayment penalty configured',
  },
];

const ViewLoan = (props) => {
    const { session, permissions, SingleLoanData, RepaymentsData, LoanScheduleData, LoanJournalEntriesData, LoanAuditTrailData } = props;
    let jwt = session?.jwt;
    let singleLoanDataObject = SingleLoanData?.data?.data?.data;
   

  const router = useRouter();
  const { id } = router.query;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customRepaymentEnabled, setCustomRepaymentEnabled] = useState(true);
  const [addRepaymentModalVisible, setAddRepaymentModalVisible] = useState(false);
  const [addDiscountModalVisible, setAddDiscountModalVisible] = useState(false);
  const [editRepaymentModalVisible, setEditRepaymentModalVisible] = useState(false);
  const [editDiscountModalVisible, setEditDiscountModalVisible] = useState(false);
  const [selectedRepayment, setSelectedRepayment] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [deleteRepaymentModalVisible, setDeleteRepaymentModalVisible] = useState(false);
  const [deleteDiscountModalVisible, setDeleteDiscountModalVisible] = useState(false);
  const [selectedRepaymentForDelete, setSelectedRepaymentForDelete] = useState(null);
  const [selectedDiscountForDelete, setSelectedDiscountForDelete] = useState(null);

  const daysOfWeek = [
    { key: 'monday', label: 'monday', enabled: true },
    { key: 'tuesday', label: 'tuesday', enabled: true },
    { key: 'wednesday', label: 'wednesday', enabled: true },
    { key: 'thursday', label: 'thursday', enabled: true },
    { key: 'friday', label: 'friday', enabled: true },
    { key: 'saturday', label: 'saturday', enabled: false },
    { key: 'sunday', label: 'sunday', enabled: false }
  ];


  const showDeleteModal = () => setDeleteModalOpen(true);
  const handleCancel = () => setDeleteModalOpen(false);
  const handleDelete = () => {
    // TODO: Implement actual delete logic
    setDeleteModalOpen(false);
  };






  const renderActivityLogs = () => (
    <div style={{ 
      maxHeight: '400px', 
      overflowY: 'auto',
      border: '1px solid #f0f0f0',
      borderRadius: '8px',
      padding: '12px',
      backgroundColor: '#fafafa'
    }}>
      <List
        itemLayout="horizontal"
        dataSource={LoanAuditTrailData?.data?.data}
        renderItem={item => (
          <List.Item style={{ 
            padding: '8px 0',
            borderBottom: '1px solid #f0f0f0',
            marginBottom: '4px'
          }}>
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    color: '#666',
                    fontWeight: '500'
                  }}>
                    {item.timeAgo}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: '#1890ff',
                    backgroundColor: '#e6f7ff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #91d5ff'
                  }}>
                    {item.action}
                  </span>
                </div>
              }
              description={
                <span style={{ 
                  fontSize: '13px', 
                  color: '#333',
                  lineHeight: '1.4',
                  display: 'block',
                  marginTop: '4px'
                }}>
                  {item.description}
                </span>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );

  const renderCustomRepaymentSchedule = (singleLoanDataObject) => {
    // Define the days of week structure
    const daysOfWeek = [
      { key: 'monday', label: 'Monday' },
      { key: 'tuesday', label: 'Tuesday' },
      { key: 'wednesday', label: 'Wednesday' },
      { key: 'thursday', label: 'Thursday' },
      { key: 'friday', label: 'Friday' },
      { key: 'saturday', label: 'Saturday' },
      { key: 'sunday', label: 'Sunday' }
    ];

    // Check if custom installment is enabled and get the selected days
    const isCustomInstallmentEnabled = singleLoanDataObject?.enable_custom_installment;
    const selectedDays = singleLoanDataObject?.custom_installment_type || [];
    
    return (
    <div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>Repayment days</Text>
        {isCustomInstallmentEnabled && selectedDays.length > 0 ? (
      <Row gutter={[8, 8]}>
            {daysOfWeek.map((day) => {
              const isEnabled = selectedDays.includes(day.key);
              return (
          <Col key={day.key}>
            <div
              style={{
                padding: '8px 12px',
                      border: isEnabled ? '2px solid #722ed1' : '1px solid #d9d9d9',
                borderRadius: 6,
                textAlign: 'center',
                cursor: 'pointer',
                      backgroundColor: isEnabled ? '#f0f0ff' : 'white',
                      color: isEnabled ? '#722ed1' : '#666',
                      fontWeight: isEnabled ? 'bold' : 'normal',
                minWidth: '80px'
              }}
            >
              {day.label}
            </div>
          </Col>
              );
            })}
      </Row>
        ) : (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#999',
            backgroundColor: '#fafafa',
            borderRadius: 6,
            border: '1px dashed #d9d9d9'
          }}>
            <Text type="secondary">
              {!isCustomInstallmentEnabled 
                ? 'Custom repayment schedule is not enabled for this loan' 
                : 'No custom repayment days configured for this loan'
              }
            </Text>
          </div>
        )}
    </div>
  );
  };

  return (
    <div style={{ padding: 24, background: '#f7f8fa', minHeight: '100vh' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Loan Details</Title>}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
            bodyStyle={{ padding: 0 }}
          >
            <Tabs defaultActiveKey="basic" style={{ padding: '0 32px 32px' }}>
              <TabPane 
                tab={
                  <span>
                    Details
                  </span>
                } 
                key="basic"
              >
                <DetailsTab singleLoanDataObject={singleLoanDataObject} jwt={jwt}  LoanScheduleData={LoanScheduleData} LoanJournalEntriesData={LoanJournalEntriesData}/>
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    Fees & Penalties
                  </span>
                } 
                key="principal"
              >
                <FeesAndPenaltiesTab singleLoanDataObject={singleLoanDataObject} jwt={jwt}/>
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    Repayments
                  </span>
                } 
                key="interest"
              >
                <RepaymentsTab 
                  addRepaymentModalVisible={addRepaymentModalVisible}
                  setAddRepaymentModalVisible={setAddRepaymentModalVisible}
                  editRepaymentModalVisible={editRepaymentModalVisible}
                  setEditRepaymentModalVisible={setEditRepaymentModalVisible}
                  selectedRepayment={selectedRepayment}
                  setSelectedRepayment={setSelectedRepayment}
                  deleteRepaymentModalVisible={deleteRepaymentModalVisible}
                  setDeleteRepaymentModalVisible={setDeleteRepaymentModalVisible}
                  selectedRepaymentForDelete={selectedRepaymentForDelete}
                  setSelectedRepaymentForDelete={setSelectedRepaymentForDelete}
                  message={message}
                  singleLoanDataObject={singleLoanDataObject}
                  SingleLoanDataRefetch={SingleLoanData}
                  jwt={jwt}
                  repaymentsData={RepaymentsData}
                  LoanScheduleData={LoanScheduleData}
                  LoanJournalEntriesData={LoanJournalEntriesData}
                  LoanAuditTrailData={LoanAuditTrailData}
                />
              </TabPane>
              
              {/* <TabPane 
                tab={
                  <span>
                    Discount
                  </span>
                } 
                key="accounts"
              >
                <DiscountTab 
                  addDiscountModalVisible={addDiscountModalVisible}
                  setAddDiscountModalVisible={setAddDiscountModalVisible}
                  editDiscountModalVisible={editDiscountModalVisible}
                  setEditDiscountModalVisible={setEditDiscountModalVisible}
                  selectedDiscount={selectedDiscount}
                  setSelectedDiscount={setSelectedDiscount}
                  deleteDiscountModalVisible={deleteDiscountModalVisible}
                  setDeleteDiscountModalVisible={setDeleteDiscountModalVisible}
                  selectedDiscountForDelete={selectedDiscountForDelete}
                  setSelectedDiscountForDelete={setSelectedDiscountForDelete}
                  message={message}
                  singleLoanDataObject={singleLoanDataObject}
                  jwt={jwt}
                />
              </TabPane>
               */}
              <TabPane 
                tab={
                  <span>
               
                    Borrower
                  </span>
                } 
                key="borrower"
              >
                <BorrowerTab singleLoanDataObject={singleLoanDataObject} jwt={jwt}/>
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    Guarantor
                  </span>
                } 
                key="guarantor"
              >
                <GuarantorTab singleLoanDataObject={singleLoanDataObject} jwt={jwt}/>
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <FileImageOutlined style={{ marginRight: 8 }} />
                    Uploads
                  </span>
                } 
                key="uploads"
              >
                <UploadsTab singleLoanDataObject={singleLoanDataObject} jwt={jwt}/>
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <FileTextOutlined style={{ marginRight: 8 }} />
                    Accounting
                  </span>
                } 
                key="accounting"
              >
                <AccountingTab 
                  singleLoanDataObject={singleLoanDataObject} 
                  jwt={jwt} 
                  LoanJournalEntriesData={LoanJournalEntriesData}
                />
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                  
                    Repayment Schedule
                  </span>
                } 
                key="repayment_schedule"
              >
                <div style={{ padding: '20px 0' }}>
                  <PaymentScheduleModal
                    setIsModalVisible={() => {}} // No-op since we're showing it inline
                    jwt={jwt}
                    record={singleLoanDataObject}
                    LoanScheduleData={LoanScheduleData}
                  />
                </div>
              </TabPane>
              
       
            </Tabs>
          </Card>
          
          {/* <Card
            title={<Title level={5} style={{ margin: 0 }}>Custom Repayment Schedule</Title>}
            bordered={false}
            style={{ borderRadius: 12, marginTop: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}
            bodyStyle={{ padding: 32 }}
          >
            {renderCustomRepaymentSchedule(singleLoanDataObject)}
          </Card> */}
          
          {/* <Card
            title={<Title level={5} style={{ margin: 0, color: '#d4380d' }}><ExclamationCircleOutlined style={{ color: '#d4380d', marginRight: 8 }} />Danger Zone</Title>}
            bordered={false}
            style={{ borderRadius: 12, marginTop: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}
            bodyStyle={{ padding: 32 }}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Text strong>Modify Loan Product</Text>
                <div style={{ color: '#888', marginBottom: 12 }}>Change details of the loan product.</div>
                <Button icon={<EditOutlined />} type="primary" shape="round" onClick={() => router.push(`/dashboard/loan-management/loan-products/edit/${id}`)}>Edit</Button>
              </Col>
              <Col xs={24} md={12}>
                <Text strong>Delete Loan Product</Text>
                <div style={{ color: '#888', marginBottom: 12 }}>Delete this loan product.</div>
                <Button icon={<DeleteOutlined />} type="danger" danger shape="round" onClick={showDeleteModal}>Delete</Button>
              </Col>
            </Row>
          </Card> */}
        </Col>
        
        <Col xs={24} md={8}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Activity Logs</Title>}
            bordered={false}
            style={{ borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}
            bodyStyle={{ padding: 24 }}
          >
            {renderActivityLogs()}
          </Card>
        </Col>
      </Row>
      
      <Modal
        open={deleteModalOpen}
        title={<span style={{ color: '#d4380d', fontWeight: 600 }}>Delete Loan Product</span>}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDelete}>
            Delete
          </Button>,
        ]}
      >
        <p style={{ fontSize: 16, marginBottom: 0 }}>
          Are you sure you want to delete this loan product? <br />
          <b>All loans associated with this product will be affected and this action cannot be undone.</b>
        </p>
      </Modal>

    </div>
  );
};

export default ViewLoan;