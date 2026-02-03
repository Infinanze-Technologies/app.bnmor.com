import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Tag, Button, Pagination } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditLoanProduct from "./EditLoanProduct";
import ViewLoanProduct from "./ViewLoanProduct";
import ProductDetailsModal from "./EditLoanProdcutModal/ProductDetailsModal";
import ProductFeesModal from "./EditLoanProdcutModal/ProductFeesModal";
import ProductPenaltyModal from "./EditLoanProdcutModal/ProductPenaltyModal";
import ProductAccountModal from "./EditLoanProdcutModal/ProductAccountModal";
import { URL_DELETE_LOAN_PRODUCT, URL_LOAN_PRODUCT_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper, TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined, PlusOutlined, EditOutlined, DollarOutlined, ExclamationCircleOutlined, SettingOutlined, DeleteOutlined, EyeOutlined, WarningOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import FilterOptions from "./FilterOptions";
import Link from "next/link";
import { ADD_LOAN_PRODUCT_PAGE } from "@/config/page-routes";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const LoanProductTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  let { LoanProductDataObject, jwt, setLoading, loading } = props;

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
    pageSize,
    statusCode,
    message,
    failed
  } = LoanProductDataObject;

  let loan_products_data = LoanProductDataObject?.data?.data || LoanProductDataObject?.data?.items || LoanProductDataObject?.data || [];

  // Ensure loan_products_data is an array
  if (!Array.isArray(loan_products_data)) {
    loan_products_data = []
  }

  const onPageChange = (page, pageSize) => {
    // console.log('Pagination changed - page:', page, 'pageSize:', pageSize);
    // API uses 1-based page numbers, so we pass the page directly
    setpage(page);
  }

  useEffect(() => {
    // Any initialization logic here
  }, [LoanProductDataObject]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Format duration
  const formatDuration = (record) => {
    if (record.duration_type === 'Fixed') {
      return `${record.loan_duration} ${record.duration_period}`;
    } else {
      return `${record.min_loan_duration || 0} - ${record.max_loan_duration || 0} ${record.duration_period}`;
    }

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

  // Format penalty status
  const formatPenaltyStatus = (penalty,penalties) => {

    if (!penalty) {
      return <Tag color="red">Disabled</Tag>;
    }
    return (
      <Tag color="green">
        {penalties?.penalty_type === 'Percentage' ? 
          `${penalties?.penalty_percentage || 0}%` : 
          formatCurrency(penalties?.penalty_amount || 0)
        }
      </Tag>
    );
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

  // Format account names (if needed for display)
  const formatAccountName = (accountId, accounts) => {
    if (!accountId || !accounts) return 'N/A';
    const account = accounts.find(acc => acc.id === accountId);
    return account ? `${account.acc_name} (${account.acc_code})` : 'Unknown Account';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'product_id',
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
      title: 'Product Name',
      dataIndex: 'name',
      align: "center",
    },
    {
      title: 'Duration Type',
      dataIndex: 'duration_type',
      align: "center",
      render: (text) => (
        <span style={{ fontSize: '0.9rem' }}>
          {text}
        </span>
      )
    },
    {
      title: 'Duration',
      key: 'duration',
      align: "center",
      render: (text, record) => formatDuration(record)
    },
    {
      title: 'Principal Range',
      key: 'principal_range',
      align: "center",
      render: (text, record) => (
        <div>
          <div style={{ fontSize: '0.8rem' }}>
            Min: {formatCurrency(record.min_principal_amount)}
          </div>
          <div style={{ fontSize: '0.8rem' }}>
            Max: {formatCurrency(record.max_principal_amount)}
          </div>
        </div>
      )
    },
    {
      title: 'Interest Rate',
      dataIndex: 'interest_rate',
      align: "center",
      render: (text, record) => (
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
            {text}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            {record.interest_method}
          </div>
        </div>
      )
    },
    {
      title: 'Fees',
      key: 'fees',
      align: "center",
      render: (text, record) => formatFeesCount(record.fees),
    },
    {
      title: 'Penalty',
      key: 'penalty',
      align: "center",
      render: (text, record) => formatPenaltyStatus(record.late_repayment_penalty_enabled,record.late_repayment_penalty),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      align: "center",
      render: (text, record) => {
        const getStatusColor = (status) => {
          switch (status) {
            case true:
              return 'success';
            case false:
              return 'warning';
            default:
              return 'default';
          }
        };

        return (
          <Tag 
            color={getStatusColor(record?.is_active)}
            style={{ 
              cursor: 'pointer',
              fontWeight: 'bold',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(77, 77, 77, 0.2)',
              color: '#4D4D4D',
              background: record?.is_active ? '#E8F5E8' : '#FFF3CD'
            }}
            onClick={() => handleStatus(record)}
          >
            {record?.is_active ? 'Active' : 'Inactive'}
          </Tag>
        );
      }
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
        <EditLoanProduct
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
        <ViewLoanProduct
          setIsModalVisible={setIsModalVisible}
          record={record}
        />
      );
    } else if (value == "product_details") {
      setIsModalVisible(true);
      setModalWidth(1000);
      setModalContent(
        <ProductDetailsModal
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
        />
      );
    } else if (value == "product_fees") {
      setIsModalVisible(true);
      setModalWidth(1000);
      setModalContent(
        <ProductFeesModal
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
        />
      );
    } else if (value == "product_penalty") {
      setIsModalVisible(true);
      setModalWidth(1000);
      setModalContent(
        <ProductPenaltyModal
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
        />
      );
    } else if (value == "product_accounts") {
      setIsModalVisible(true);
      setModalWidth(1000);
      setModalContent(
        <ProductAccountModal
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
        />
      );
    } else if (value == "delete") {
      setIsModalVisible(true);
      setModalWidth(500);
      setModalTitle("Delete Loan Product");
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
            Are you sure you want to delete <strong>"{record?.name}"</strong>?<br/>
            This action cannot be undone and will permanently remove the loan product.
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

    const EditLoanProductTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Loan Product</h6>
    </div>
  );

  const ViewLoanProductTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>View Loan Product Details</h6>
    </div>
  );

  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_LOAN_PRODUCT, record?.product_id, jwt)
      .then((res) => {
        handleRequestResponse(res);
        refetch();
        handleCancel();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };

  const handleStatus = (record) => {
    let data = {
      is_active: !record?.is_active
    };
    updateRequest(URL_LOAN_PRODUCT_STATUS, record?.product_id, { ...data }, jwt)
      .then((res) => {
        handleRequestResponse(res);
        refetch();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };

  const menu = (record) => (
    <Menu
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: '1px solid #f0f0f0',
        minWidth: '200px'
      }}
    >
      {/* <Menu.Item 
        key="1" 
        icon={<EyeOutlined style={{ color: '#1890ff' }} />}
        style={{ 
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        <a onClick={() => showModal("view", record)}>View Details</a>
      </Menu.Item> */}
      
      <Menu.Divider style={{ margin: '4px 0' }} />
      
      <Menu.Item 
        key="2" 
        icon={<EditOutlined style={{ color: '#52c41a' }} />}
        style={{ 
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '4px',
          margin: '2px 4px'
        }}
      >
        <a onClick={() => showModal("product_details", record)}>Product Details</a>
      </Menu.Item>
      
      <Menu.Item 
        key="3" 
        icon={<DollarOutlined style={{ color: '#fa8c16' }} />}
        style={{ 
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '4px',
          margin: '2px 4px'
        }}
      >
        <a onClick={() => showModal("product_fees", record)}>Product Fees</a>
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
          <a onClick={() => showModal("product_penalty", record)}>Product Penalty</a>
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
          margin: '2px 4px'
        }}
      >
        <a onClick={() => showModal("product_accounts", record)}>Product Accounts</a>
      </Menu.Item>
      
      <Menu.Divider style={{ margin: '4px 0' }} />
      
      {/* <Menu.Item 
        key="6" 
        icon={<EditOutlined style={{ color: '#1890ff' }} />}
        style={{ 
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '4px',
          margin: '2px 4px'
        }}
      >
        <a onClick={() => showModal("edit", record)}>Full Edit</a>
      </Menu.Item> */}
      
      <Menu.Item 
        key="7" 
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
        <a onClick={() => showModal("delete", record)} style={{ color: '#ff4d4f' }}>Delete Product</a>
      </Menu.Item>
    </Menu>
  );

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
          }}>
            Manage Loan Products
          </h3>
          <Link href={ADD_LOAN_PRODUCT_PAGE}>
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
                  dataSource={loan_products_data}
                  loading={isLoading}
                  columns={mergedColumns}
                  locale={{
                    emptyText: loan_products_data?.length === 0 ? 'No loan products found' : 'No data'
                  }}
                  rowKey="id"
                  style={{
                    background: '#ffffff'
                  }}
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
          padding: modalTitle === "Delete Loan Product" ? '0' : '24px'
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

export default LoanProductTable;