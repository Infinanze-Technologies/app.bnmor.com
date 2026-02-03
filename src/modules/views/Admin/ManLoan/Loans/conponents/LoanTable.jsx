import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Tag, Button, Tooltip } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditLoan from "./EditLoan";
import LoanDetailsModal from "./Edit/LoanDetailsModal";
import LoanFeesModal from "./Edit/LoanFeesModal";
import LoanPenaltyModal from "./Edit/LoanPenaltyModal";
import LoanAccountModal from "./Edit/LoanAccountModal";
import PaymentScheduleModal from "./Edit/PaymentScheduleModal";
import LoanStatusModal from "./Edit/LoanStatusModal";
import { URL_DELETE_LOAN, URL_LOAN_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper, TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined, PlusOutlined, EditOutlined, DollarOutlined, ExclamationCircleOutlined, SettingOutlined, DeleteOutlined, EyeOutlined, WarningOutlined, UserOutlined, CreditCardOutlined, CalendarOutlined, PercentageOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import Pagination from "@/hooks/Pagination";
import FilterOptions from "./FilterOptions";
import Link from "next/link";
import { useRouter } from "next/router";
import { ADD_LOAN_PAGE, VIEW_LOAN_PAGE } from "@/config/page-routes";
import moment from 'moment';
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const LoanTable = (props) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  
  let { LoanDataObject, jwt, setLoading, loading } = props;

  let {
    isLoading,
    isError,
    data,
    page,
    totalPages,
    refetch,
    isFetching,
    currentPage,
    totalItem,
    setpage,
    setpageSize,
    pageSize
  } = LoanDataObject;

  let loans_data = LoanDataObject?.data?.data || LoanDataObject?.data?.items || LoanDataObject?.data || [];

  // Ensure loans_data is an array
  if (!Array.isArray(loans_data)) {
    loans_data = []
  }



  const onPageChange = (page, pageSize) => {
    // console.log('Pagination changed - page:', page, 'pageSize:', pageSize);
    // API uses 1-based page numbers, so we pass the page directly
    setpage(page);
  }

  // Handle row click to navigate to loan view page
  const handleRowClick = (record) => {
    router.push(`${VIEW_LOAN_PAGE}/${record.loan_id}`);
  };

  useEffect(() => {
    // Any initialization logic here
  }, [LoanDataObject]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Format loan status
  const formatLoanStatus = (status) => {
    const statusConfig = {
      'Requested': { color: 'blue', text: 'Requested' },
      'Processing': { color: 'orange', text: 'Processing' },
      'Active': { color: 'green', text: 'Active' },
      'Defaulted': { color: 'red', text: 'Defaulted' },
      'Denied': { color: 'red', text: 'Denied' },
      'Completed': { color: 'purple', text: 'Completed' }
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Format interest method
  const formatInterestMethod = (method) => {
    const methods = {
      'Flat': { color: 'blue', text: 'Flat' },
      'Reducing Balance': { color: 'green', text: 'Reducing Balance' }
    };
    const config = methods[method] || { color: 'default', text: method };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Format fees count
  const formatFeesCount = (fees) => {
    if (!fees || fees.length === 0) {
      return <Tag color="default">No Fees</Tag>;
    }
    
    const activeFees = fees.filter(fee => fee.is_active);
    if (activeFees.length === 0) {
      return <Tag color="default">No Active Fees</Tag>;
    }
    
    return <Tag color="orange">{activeFees.length} Fee{activeFees.length > 1 ? 's' : ''}</Tag>;
  };

  // Format penalties count
  const formatPenaltiesCount = (penalties) => {
    if (!penalties || penalties.length === 0) {
      return <Tag color="default">No Penalties</Tag>;
    }
    
    const activePenalties = penalties.filter(penalty => penalty.is_active);
    if (activePenalties.length === 0) {
      return <Tag color="default">No Active Penalties</Tag>;
    }
    
    return <Tag color="red">{activePenalties.length} Penalty{activePenalties.length > 1 ? 'ies' : ''}</Tag>;
  };

  // Calculate loan duration in months
  const calculateLoanDuration = (record) => {
    if (record.loan_duration && record.loan_period) {
      const duration = record.loan_duration;
      const period = record.loan_period.toLowerCase();
      
      if (period === 'months') return `${duration} months`;
      if (period === 'weeks') return `${Math.round(duration / 4)} months`;
      if (period === 'days') return `${Math.round(duration / 30)} months`;
      if (period === 'years') return `${duration * 12} months`;
      return `${duration} ${period}`;
    }
    return 'N/A';
  };

  // Calculate total amount due
  const calculateTotalAmountDue = (record) => {
    const principal = parseFloat(record.loan_amount) || 0;
    const interestRate = parseFloat(record.interest_rate) || 0;
    
    if (record.interest_method === 'Flat') {
      const interest = principal * (interestRate / 100);
      return principal + interest;
    } else {
      // For reducing balance, this is a simplified calculation
      const interest = principal * (interestRate / 100);
      return principal + interest;
    }
  };

  // Detailed loan modal component
  const LoanDetailModal = ({ record, visible, position }) => {
    if (!visible || !record) return null;

    return (
      <div
        style={{
          position: 'fixed',
          left: position.x + 20,
          top: position.y - 50,
          zIndex: 1000,
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          padding: '20px',
          minWidth: '300px',
          maxWidth: '400px',
          border: '1px solid #e5e7eb'
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid #f3f4f6'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            <UserOutlined style={{ fontSize: '20px', color: '#6b7280' }} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
              {record.borrower?.fullname}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              backgroundColor: '#f3f4f6',
              padding: '2px 8px',
              borderRadius: '12px',
              display: 'inline-block',
              marginTop: '4px'
            }}>
              Loan #{loans_data.findIndex(loan => loan.id === record.id) + 1}
            </div>
          </div>
        </div>

        {/* Loan Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CreditCardOutlined style={{ fontSize: '16px', color: '#10b981' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                Total Amount Due
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#10b981' }}>
                {formatCurrency(calculateTotalAmountDue(record))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CreditCardOutlined style={{ fontSize: '16px', color: '#6b7280' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                Total Amount Paid
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280' }}>
                --
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CalendarOutlined style={{ fontSize: '16px', color: '#6b7280' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                Loan Duration
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                {calculateLoanDuration(record)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PercentageOutlined style={{ fontSize: '16px', color: '#6b7280' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                Interest
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                {record.interest_rate}% once ({record.interest_method?.toLowerCase()})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CalendarOutlined style={{ fontSize: '16px', color: '#6b7280' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                Repayment Cycle
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                {record.repayment_cycle || 'Once'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const columns = [
    {
      title: 'ID',
      dataIndex: 'loan_id',
      align: "left",
      render: (text, record, index) => {
        const currentPageNum = currentPage || 1;
        const pageSizeNum = pageSize || 10;
        const actualRowNumber = (currentPageNum - 1) * pageSizeNum + index + 1;
        
        return (
          <span style={{ 
            fontFamily: 'monospace', 
            fontSize: '0.8rem',
            color: '#4D4D4D',
            fontWeight: '500'
          }}>
            {actualRowNumber}
          </span>
        );
      }
    },
      {
        title: 'Name',
      key: 'borrower',
      align: "left",
      render: (text, record) => (
        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
          {record.borrower?.fullname}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'loan_status',
      align: "center",
      render: (text, record) => formatLoanStatus(record.loan_status)
    },
    {
      title: 'Principal',
      dataIndex: 'loan_amount',
          align: "center",
      render: (text, record) => (
        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
          {formatCurrency(record.loan_amount)}
        </span>
      )
    },
    {
      title: 'Next Payment Amount',
      dataIndex: 'installment_amount',
          align: "center",
      render: (text, record) => (
        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
          {formatCurrency(record.installment_amount)}
                      </span>
      )
    },
    {
      title: 'Next Payment Date',
      dataIndex: 'loan_release_date',
      align: "center",
      render: (text, record) => {
        // Calculate next payment date based on loan release date and duration
        const releaseDate = moment(record.loan_release_date);
        const nextPaymentDate = releaseDate.add(1, 'month'); // Assuming monthly payments
        return (
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
            {nextPaymentDate.format('DD MMM YYYY')}
                      </span>
        );
      }
    },
    {
      title: 'Released',
      dataIndex: 'loan_release_date',
          align: "center",
          render: (text, record) => (
        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
          {moment(record.loan_release_date).format('DD MMM YYYY')}
        </span>
      )
        },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Dropdown overlay={menu(record)} trigger={["click"]} placement="bottomRight">
          <Button 
            type="text" 
            icon={<AiOutlineMore />}
            style={{ 
              border: 'none',
              boxShadow: 'none',
              fontSize: '16px',
              color: '#666',
              padding: '4px 8px',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
              e.target.style.color = '#1890ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#666';
            }}
          />
        </Dropdown>
      ),
    },
    ];



    const mergedColumns = columns.map((col) => {
        
        
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.dataIndex,
          dataIndex: col.dataIndex,
          title: col.title,
     
        }),
      };
    });



  const showModal = (value, record) => {
    if (value == "edit") {
      setIsModalVisible(true);
      setModalWidth(1200);
      setModalContent(
        <EditLoan
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
        />
      );
    } else if (value == "loan_details") {
      setIsModalVisible(true);
      setModalWidth(1000);
      setModalTitle("Loan Details");
      setModalContent(
        <LoanDetailsModal
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
        />
      );
    } else if (value == "loan_fees") {
      setIsModalVisible(true);
      setModalWidth(1000);
      setModalTitle("Loan Fees");
      setModalContent(
        <LoanFeesModal
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
        />
      );
    } else if (value == "loan_penalty") {
      setIsModalVisible(true);
      setModalWidth(800);
      setModalTitle("Loan Penalty");
      setModalContent(
        <LoanPenaltyModal
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
        />
      );
    } else if (value == "loan_accounts") {
      setIsModalVisible(true);
      setModalWidth(1000);
      setModalTitle("Loan Accounts");
      setModalContent(
        <LoanAccountModal
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
        />
      );
    } else if (value == "payment_schedule") {
      setIsModalVisible(true);
      setModalWidth(1000);
      setModalTitle("Payment Schedule");
      setModalContent(
        <PaymentScheduleModal
        setIsModalVisible={setIsModalVisible}
        jwt={jwt}
        record={record}
        refetch={refetch}
      
        />
      );
    } else if (value == "loan_status") {
      setIsModalVisible(true);
      setModalWidth(600);
      setModalTitle("Update Loan Status");
      setModalContent(
        <LoanStatusModal
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
        />
      );
    } else if (value == "view") {
      setIsModalVisible(true);
      setModalWidth(1000);
      setModalContent(
        <div style={{ padding: '20px' }}>
          <h3>Loan Details</h3>
          <p>Loan ID: {record.loan_id}</p>
          <p>Borrower: {record.borrower?.fullname}</p>
          <p>Amount: {formatCurrency(record.loan_amount)}</p>
          <p>Status: {record.loan_status}</p>
        </div>
      );
    } else if (value == "delete") {
      setIsModalVisible(true);
      setModalWidth(500);
      setModalTitle("Delete Loan");
      setModalContent(
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ 
            fontSize: '48px', 
            color: '#ff4d4f', 
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <WarningOutlined />
          </div>
          
          <h3 style={{ 
            color: '#262626', 
            marginBottom: '8px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Confirm Deletion
          </h3>
          
          <p style={{ 
            color: '#8c8c8c', 
            marginBottom: '24px',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            Are you sure you want to delete this loan?<br/>
            This action cannot be undone and will permanently remove the loan.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center',
            marginTop: '24px'
          }}>
            <Button 
              onClick={handleCancel}
              style={{
                minWidth: '100px',
                height: '36px',
                borderRadius: '6px',
                border: '1px solid #d9d9d9',
                color: '#595959',
                fontWeight: '500'
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleDelete(record)} 
              type="primary" 
              danger
              style={{
                minWidth: '100px',
                height: '36px',
                borderRadius: '6px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(255, 77, 79, 0.2)'
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      );
    } else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_LOAN, record?.loan_id, jwt)
      .then((res) => {
        handleRequestResponse(res);
        refetch();
        handleCancel();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };

  const menu = (record) => {
    const allowedStatuses = ["Completed", "Defaulted", "Active", "Denied"];
    const pendingStatuses = ["Requested", "Processing"];

    return (
    <Menu
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid #f0f0f0',
        minWidth: '200px'
      }}
    >
      
      
 {allowedStatuses.includes(record.loan_status) && (
        <>
      <Menu.Item 
        key="1" 
        icon={<EyeOutlined style={{ color: '#1890ff' }} />}
        style={{ 
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        <a onClick={() => handleRowClick(record)}>View Details</a>
        {/* <a onClick={() => showModal("view", record)}>View Details</a> */}
      </Menu.Item>

      <Menu.Divider style={{ margin: '4px 0' }} />
         </>
      )}

          {/* Case 2: Requested, Processing */}
          {pendingStatuses.includes(record.loan_status) && (
        <>
      
      <Menu.Item 
        key="2" 
        icon={<EditOutlined style={{ color: '#52c41a' }} />}
        style={{ 
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '4px',
          margin: '2px 4px',
          transition: 'all 0.3s ease'
        }}
      >
        <a onClick={() => showModal("loan_details", record)}>Loan Details</a>
      </Menu.Item>
      
      <Menu.Item 
        key="3" 
        icon={<DollarOutlined style={{ color: '#fa8c16' }} />}
        style={{ 
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '4px',
          margin: '2px 4px',
          transition: 'all 0.3s ease'
        }}
      >
        <a onClick={() => showModal("loan_fees", record)}>Loan Fees</a>
      </Menu.Item>
      
      {record.late_repayment_penalty_enabled && (
        <Menu.Item 
          key="4" 
          icon={<ExclamationCircleOutlined style={{ color: '#f5222d' }} />}
          style={{ 
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '4px',
            margin: '2px 4px'
          }}
        >
          <a onClick={() => showModal("loan_penalty", record)}>Loan Penalty</a>
        </Menu.Item>
      )}
      
      <Menu.Item 
        key="5" 
        icon={<SettingOutlined style={{ color: '#722ed1' }} />}
        style={{ 
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '4px',
          margin: '2px 4px',
          transition: 'all 0.3s ease'
        }}
      >
        <a onClick={() => showModal("loan_accounts", record)}>Loan Accounts</a>
      </Menu.Item>
      
      <Menu.Item 
        key="6" 
        icon={<CalendarOutlined style={{ color: '#13c2c2' }} />}
        style={{ 
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '4px',
          margin: '2px 4px',
          transition: 'all 0.3s ease'
        }}
      >
        <a onClick={() => showModal("payment_schedule", record)}>Payment Schedule</a>
      </Menu.Item>
      
      <Menu.Item 
        key="7" 
        icon={<ExclamationCircleOutlined style={{ color: '#fa8c16' }} />}
        style={{ 
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '4px',
          margin: '2px 4px',
          transition: 'all 0.3s ease'
        }}
      >
        <a onClick={() => showModal("loan_status", record)}>Update Status</a>
      </Menu.Item>
      
      <Menu.Divider style={{ margin: '4px 0' }} />
      
      {/* <Menu.Item 
        key="6" 
        icon={<EyeOutlined style={{ color: '#1890ff' }} />}
        style={{ 
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '4px',
          margin: '2px 4px',
          transition: 'all 0.3s ease'
        }}
      >
        <a onClick={() => handleRowClick(record)}>Full View</a>
      </Menu.Item>
       */}
      <Menu.Divider style={{ margin: '4px 0' }} />
      
      <Menu.Item 
        key="8" 
        icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
        style={{ 
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '4px',
          margin: '2px 4px',
          color: '#ff4d4f'
        }}
      >
        <a onClick={() => showModal("delete", record)} style={{ color: '#ff4d4f' }}>Delete Loan</a>
      </Menu.Item>
      </>
      )}
    </Menu>
    )
    
  };




  return (
    <>
       <div className="card card-table flex-fill" style={{ 
        background: '#ffffff',
        border: '1px solid rgba(77, 77, 77, 0.1)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(77, 77, 77, 0.08)'
      }}>
      <div className="card-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #4D4D4D 0%, #6B6B6B 100%)',
        borderBottom: '1px solid rgba(77, 77, 77, 0.2)',
        borderRadius: '12px 12px 0 0',
        padding: '20px 24px'
      }}>
        <h3 className="card-title mb-0" style={{ 
          color: '#ffffff',
          fontSize: '20px',
          fontWeight: '600',
          margin: 0,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>Manage Loans</h3>
        <Link href={ADD_LOAN_PAGE}>
          <Button 
            {...BUTTON_CONFIGS.ADD_BUTTON()}
            icon={<PlusOutlined />}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontWeight: '500',
              borderRadius: '8px',
              height: '40px',
              padding: '0 20px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (e.currentTarget && e.currentTarget.style) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (e.currentTarget && e.currentTarget.style) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
         Create
          </Button>
        </Link>
      </div>
      <div className="card-body" style={{
        padding: '24px',
        background: '#ffffff',
        borderRadius: '0 0 12px 12px'
      }}>
       
        {/* Advanced Filters */}
        <FilterOptions
          setfilterUserData={props.setfilterUserData}
          setFilters={props.setFilters}
          jwt={jwt}
        />
     
        <div className="table-responsive" style={{
          marginTop: '20px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(77, 77, 77, 0.1)'
        }}>
        
       
          
        <UserTableStyleWrapper>
          <TableWrapper style={{
            '--primary-color': '#4D4D4D',
            '--secondary-color': '#6B6B6B',
            '--accent-color': '#8B8B8B'
          }}>
          <Table
           className="table-responsive"
            dataSource={loans_data}
            loading={isLoading}
            columns={mergedColumns}
            locale={{
              emptyText: loans_data?.length === 0 ? 'No loans found' : 'No data'
            }}
            rowKey="id"
            style={{
              background: '#ffffff'
            }}
            onRow={(record, index) => ({
              // onClick: () => handleRowClick(record),
              // onMouseEnter: (event) => {
              //   setHoveredRow(record);
              //   setHoverPosition({ x: event.clientX, y: event.clientY });
              // },
              // onMouseLeave: () => {
              //   setHoveredRow(null);
              // },
              style: {
                cursor: 'pointer',
                backgroundColor: hoveredRow?.id === record.id ? '#f8fafc' : 'transparent',
                transition: 'background-color 0.2s ease'
              }
            })}
            pagination={{
              current: currentPage || 1,
              total: totalItem || 0,
              pageSize: pageSize || 10,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              onChange: onPageChange,
              onShowSizeChange: (current, size) => {
                setpageSize(size);
                setpage(0);
              },
              pageSizeOptions: ['10', '20', '50', '100'],
              style: {
                marginTop: '16px',
                textAlign: 'center',
                background: '#ffffff',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(77, 77, 77, 0.1)'
              }
            }}
          />
          </TableWrapper>

        </UserTableStyleWrapper>
        </div>
      </div>
      
    
    </div>

 


      {/* Hover Modal */}
      <LoanDetailModal 
        record={hoveredRow} 
        visible={!!hoveredRow} 
        position={hoverPosition} 
      />

      <ModalComponent
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        title={modalTitle}
        width={modalWidth}
        maskClosable={false}
        keyboard={false}
        centered
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: modalTitle === "Delete Loan" ? '0' : '24px'
        }}
        style={{
          borderRadius: '12px',
          overflow: 'hidden'
        }}
        maskStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)'
        }}
      >
        {modalContent}
      </ModalComponent>
    </>
  );
};

export default LoanTable;
