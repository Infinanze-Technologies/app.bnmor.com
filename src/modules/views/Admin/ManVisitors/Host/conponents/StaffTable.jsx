import React, { useEffect, useState } from "react";
import { Space, Popconfirm, Avatar, Spin, Table, Tag, Button, Pagination } from "antd";
import ModalComponent from "@/components/ModalComponent";

import { URL_DELETE_EMPLOYEE, URL_EMPLOYEE_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper, TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineEye } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import FilterOptions from "./FilterOptions";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
import ViewStaff from "./ViewStaff";
const StaffTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { StaffDataObject, QryBranchDataObject, RoleDataObject, DepartmentsDataObject, ActiveDesignationDataObject, setLoading, loading ,jwt} = props;

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
  } = StaffDataObject;

  let qry_data = StaffDataObject?.data || []
  // console.log('====================================');    
  // console.log("StaffDataObject",StaffDataObject);
  // console.log("qry_data",qry_data);


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
    // Any side effects
  }, [StaffDataObject]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'employee_id',
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
      title: 'Full Name',
      dataIndex: 'fullname',
      align: "center",
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: "center",
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      align: "center",
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      align: "center",
      render: (text, record) => {
        // Handle different branch data structures
        if (record.branch && typeof record.branch === 'object' && record.branch.name) {
          return record.branch.name;
        }
        return 'N/A';
      }
    },
    {
      title: 'Department',
      dataIndex: 'department',
      align: "center",
      render: (text, record) => {
        if (record.department && typeof record.department === 'object' && record.department.name) {
          return record.department.name;
        }
        return 'N/A';
      }
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      align: "center",
      render: (text, record) => {
        if (record.designation && typeof record.designation === 'object' && record.designation.name) {
          return record.designation.name;
        }
        return 'N/A';
      }
    },
    {
      title: 'Join Date',
      dataIndex: 'join_date',
      align: "center",
      render: (text, record) => (
        <>
          {formatDateHuman(record?.join_date)}
        </>
      )
    },

  
    {
      title: 'Status',
      dataIndex: 'account_status',
      align: "center",  
      render: (text, record) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'pending':
              return 'pending';
            case 'approved':
              return 'success';
            case 'rejected':
              return 'rejected';
            case 'suspended':
              return 'suspended';
            default:
              return 'default';
          }
        };

        return (
          <Tag 
            color={getStatusColor(record?.account_status)}
            style={{ 
              cursor: 'pointer',
              fontWeight: 'bold',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(77, 77, 77, 0.2)',
              color: '#4D4D4D',
              background: record?.account_status === 'approved' ? '#E8F5E8' : 
                         record?.account_status === 'pending' ? '#FFF3CD' :
                         record?.account_status === 'rejected' ? '#F8D7DA' : '#E8F5E8'
            }}
            onClick={() => handleStatusEdit(record)}
          >
          {record?.account_status == 'approved' ? 'Approved' : record?.account_status == 'pending' ? 'Pending' : record?.account_status == 'rejected' ? 'Rejected' : 'Active'}
          </Tag>
        );
      }
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Button 
          type="text" 
          icon={<AiOutlineEye />}
          onClick={() => showModal("view", record)}
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
      setModalWidth(900);
      setModalContent(
        <ViewStaff
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          setpage={setpage}
          record={record}
          refetch={refetch}
        
        />
      );
    } else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_EMPLOYEE, record?.id, jwt)
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


//     console.log('====================================');    
// console.log("pageSize",pageSize);
// console.log("totalItem",totalItem);
// console.log("currentPage",currentPage);
// console.log("totalPages",totalPages);

// console.log('====================================');



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
            Manage Host
          </h3>
         
        </div>
        <div className="card-body" style={{
          padding: '24px',
          background: '#ffffff',
          borderRadius: '0 0 12px 12px'
        }}>
          
          {/* Advanced Filters */}
          <FilterOptions
            setfilterUserData={props.setfilterUserData}
            QryBranchDataObject={QryBranchDataObject}
            RoleDataObject={RoleDataObject}
            DepartmentsDataObject={DepartmentsDataObject}
            ActiveDesignationDataObject={ActiveDesignationDataObject}
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
                  dataSource={qry_data}
                  loading={isLoading}
                  columns={mergedColumns}
                  locale={{
                  emptyText: qry_data?.length === 0 ? 'No host data found' : 'No data'
                  }}
                  rowKey="id"
                  style={{
                    background: '#ffffff'
                  }}
                  pagination={{
                    current: currentPage || 1,
                    total: totalItem || 0,
                    pageSize: pageSize || 10,
                    // showSizeChanger: true,
                    // showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    onChange: onPageChange,
                    onShowSizeChange: (current, size) => {
                      // console.log('Page size changed to:', size);
                      setpageSize(size);
                      // Reset to first page when page size changes (API expects 0-based)
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

export default StaffTable;
