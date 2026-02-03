import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Tag, Button } from "antd";
import ModalComponent from "@/components/ModalComponent";
import { URL_DELETE_BORROWER, URL_BORROWER_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import Pagination from "@/hooks/Pagination";
// import Image from "next/image";
import FilterOptions from "./FilterOptions";
import ViewRepayments from "./ViewRepayments";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const RepaymentsTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { LoanRepaymentsDataObject, jwt, setLoading, loading } = props;

  

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
   
  } = LoanRepaymentsDataObject;

  let qry_data = LoanRepaymentsDataObject?.data?.data || LoanRepaymentsDataObject?.data?.items || LoanRepaymentsDataObject?.data || []

  // Ensure qry_data is an array
  if (!Array.isArray(qry_data)) {
    console.warn('qry_data is not an array:', qry_data)
    qry_data = []
  }





const onPageChange = (page, pageSize) => {
  // console.log('Pagination changed - page:', page, 'pageSize:', pageSize);
  // API uses 1-based page numbers, so we pass the page directly
  setpage(page);
}


  useEffect(() => {
       
    
  }, [LoanRepaymentsDataObject]);


  const columns = [
    {
      title: 'Borrower',
      dataIndex: ['loan', 'borrower', 'fullname'],
      align: "center",
      render: (text, record) => record?.loan?.borrower?.fullname || 'N/A'
    },
    {
      title: 'Loan Amount',
      dataIndex: ['loan', 'loan_amount'],
      align: "center",
      render: (text, record) => {
        const amount = record?.loan?.loan_amount;
        return amount ? `GHS ${parseFloat(amount).toLocaleString()}` : 'N/A';
      }
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amount_paid',
      align: "center",
      render: (text, record) => {
        const amount = record?.amount_paid;
        return amount ? `GHS ${parseFloat(amount).toLocaleString()}` : 'N/A';
      }
    },
    {
      title: 'Applied Principal',
      dataIndex: 'applied_principal',
      align: "center",
      render: (text, record) => {
        const amount = record?.applied_principal;
        return amount ? `GHS ${parseFloat(amount).toLocaleString()}` : 'N/A';
      }
    },
    {
      title: 'Applied Interest',
      dataIndex: 'applied_interest',
      align: "center",
      render: (text, record) => {
        const amount = record?.applied_interest;
        return amount ? `GHS ${parseFloat(amount).toLocaleString()}` : 'N/A';
      }
    },
    {
      title: 'Applied Fees',
      dataIndex: 'applied_fees',
      align: "center",
      render: (text, record) => {
        const amount = record?.applied_fees;
        return amount ? `GHS ${parseFloat(amount).toLocaleString()}` : 'N/A';
      }
    },
    {
      title: 'Payment Date',
      dataIndex: 'payment_date',
      align: "center",
      render: (text, record) => formatDateHuman(record?.payment_date)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: "center",
      render: (text, record) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'CONFIRMED':
              return 'success';
            case 'PENDING':
              return 'warning';
            case 'FAILED':
              return 'error';
            case 'REFUNDED':
              return 'blue';
            case 'REVERSED':
              return 'default';
            default:
              return 'default';
          }
        };

        return (
          <Tag 
            color={getStatusColor(record?.status)}
            style={{ 
              cursor: 'pointer',
              fontWeight: 'bold',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(77, 77, 77, 0.2)',
              color: '#4D4D4D',
              background: record?.status === 'Paid' ? '#E8F5E8' : 
                         record?.status === 'Pending' ? '#FFF3CD' : '#E8F5E8'
            }}
            onClick={() => handleStatusEdit(record)}
          >
            {record?.status}
          </Tag>
        );
      }
    },
    {
      title: 'Creator',
      dataIndex: ['creator', 'fullname'],
      align: "center",
      render: (text, record) => record?.creator?.fullname || 'N/A'
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
    if (value == "view") {
      setIsModalVisible(true);
      // setModalTitle(<EditBorrowerTitle />);
      setModalWidth(900);
      setModalContent(
        <ViewRepayments
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
        />
      );
    }  else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const EditBorrowerTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Borrower</h6>
    </div>
  );

  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_BORROWER, record?.id, jwt)
      .then((res) => {
        handleRequestResponse(res);
        refetch();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };




  const handleStatusEdit = (record) => {
    setSelectedRecord(record);
    setStatusModalVisible(true);
  };

  const handleStatusModalCancel = () => {
    setStatusModalVisible(false);
    setSelectedRecord(null);
  };

  const menu = (record) => (
    <Menu 
    style={{
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      border: '1px solid #f0f0f0',
      minWidth: '150px'
    }}
    >
      <Menu.Item key="1" style={{
        color: '#4D4D4D',
        fontWeight: '500',
        padding: '8px 16px',
        borderRadius: '4px',
        margin: '4px',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        if (e.currentTarget && e.currentTarget.style) {
          e.currentTarget.style.background = 'rgba(77, 77, 77, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (e.currentTarget && e.currentTarget.style) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
      >
        <a onClick={() => showModal("view", record)} style={{ color: '#4D4D4D' }}>View Details</a>
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
        }}>Loan Repayments</h3>
     
      </div>
      <div className="card-body" style={{
        padding: '24px',
        background: '#ffffff',
        borderRadius: '0 0 12px 12px'
      }}>
       
        {/* Advanced Filters */}
        <FilterOptions
          setfilterUserData={props.setfilterUserData}
          
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
            // rowSelection={rowSelection}
            dataSource={qry_data}
            loading={isLoading}
            columns={mergedColumns}
            locale={{
              emptyText: qry_data?.length === 0 ? 'No repayment data found' : 'No data'
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
                setpage(1);
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
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {modalContent}
      </ModalComponent>

      
    </>
  );
};

export default RepaymentsTable;
