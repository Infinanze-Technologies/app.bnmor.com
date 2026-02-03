import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Tag, Button, Pagination } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditAppointments from "./EditAppointments";
import AddAppointments from "./AddAppointments";
import DeleteAppointments from "./DeleteAppointments";
import StatusUpdate from "./StatusUpdate";
import { URL_DELETE_VISITOR_APPOINTMENTS, URL_VISITOR_APPOINTMENTS_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper, TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import FilterOptions from "./FilterOptions";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const AppointmentsTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { AppointmentsDataObject, QryBranchDataObject, DepartmentsDataObject, ActiveVisitorsDataObject, HostsDataObject,setLoading, loading ,jwt} = props;

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
  } = AppointmentsDataObject;

  let qry_data = AppointmentsDataObject?.data || []
  // console.log('====================================');    
  // console.log("StaffDataObject",StaffDataObject);
  // console.log("qry_data",qry_data);


  // Ensure qry_data is an array
  if (!Array.isArray(qry_data)) {
    console.warn('qry_data is not an array:', qry_data)
    qry_data = []
  }


  const getVisitTypeColor = (type) => {
    switch (type) {
      case 'Business':
        return 'blue';
      case 'Interview':
        return 'orange';
      case 'Visitor':
        return 'green';
      default:
        return 'default';
    }
  };

  const onPageChange = (page, pageSize) => {
    // console.log('Pagination changed - page:', page, 'pageSize:', pageSize);
    // API uses 1-based page numbers, so we pass the page directly
    setpage(page);
  }

  useEffect(() => {
    // Any side effects
  }, [AppointmentsDataObject]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'appointment_id',
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
      title: 'Guest',
      dataIndex: 'guest',
      align: "center",
      render: (text, record) => {
        if (record.guest) {
          return record.guest.full_name;
        }
        return 'N/A';
      }
    },
    {
      title: 'Host',
      dataIndex: 'host',
      align: "center",
      render: (text, record) => {
        if (record.host && typeof record.host === 'object' && record.host.fullname) {
          return record.host.fullname;
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
      title: 'Visit Type',
      dataIndex: 'entry',
      align: "center",
      render: (text, record) => {
        if (record.entry && typeof record.entry === 'object' && record.entry.visit_type) {
          return (
            <Tag 
              color={getVisitTypeColor(record.entry.visit_type)}
              style={{ 
                fontWeight: '500',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              {record.entry.visit_type}
            </Tag>
          );
        }
        return 'N/A';
      }
    },
    {
      title: 'Purpose',
      dataIndex: 'entry',
      align: "center",
      render: (text, record) => {
        if (record.entry && typeof record.entry === 'object' && record.entry.purpose) {
          return record.entry.purpose.length > 30 
            ? record.entry.purpose.substring(0, 30) + '...'
            : record.entry.purpose;
        }
        return 'N/A';
      }
    },
    {
      title: 'Scheduled For',
      dataIndex: 'scheduled_for',
      align: "center",
      render: (text, record) => (
        <>
          {formatDateHuman(record?.scheduled_for)}
        </>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: "center",  
      render: (text, record) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'Scheduled':
              return 'blue';
            case 'Rescheduled':
              return 'orange';
            case 'Cancelled':
              return 'red';
            case 'Completed':
              return 'green';
            case 'Missed':
              return 'red';
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
              color: '#4D4D4D'
            }}
            onClick={() => handleStatusEdit(record)}
          >
            {record?.status || 'Scheduled'}
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
      setModalWidth(900);
      setModalContent(
        <EditAppointments
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          QryBranchDataObject={QryBranchDataObject}
          ActiveVisitorsDataObject={ActiveVisitorsDataObject}
      
          DepartmentsDataObject={DepartmentsDataObject}
          setpage={setpage}
          record={record}
          refetch={refetch}
        />
      );
    } else if (value == "add") {
      setIsModalVisible(true);
      setModalWidth(900);
      setModalContent(
        <AddAppointments
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          QryBranchDataObject={QryBranchDataObject}
     
        
          DepartmentsDataObject={DepartmentsDataObject}
          ActiveVisitorsDataObject={ActiveVisitorsDataObject}
          setpage={setpage}
          refetch={refetch}
        />
      );
    } else if (value == "delete") {
      setIsModalVisible(true);
      setModalWidth(600);
      setModalContent(
            <DeleteAppointments
        setpage={setpage}
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
        />
      );
    } else if (value == "status") {
      setIsModalVisible(true);
      setModalWidth(800);
      setModalContent(
        <StatusUpdate
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refreshAllData={refetch}
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
    deleteRequest(URL_DELETE_VISITOR_APPOINTMENTS, record?.appointment_id, jwt)
      .then((res) => {
        handleRequestResponse(res);
        refetch();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };

  const handleStatusEdit = (record) => {
    showModal("status", record);
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
        <a onClick={() => showModal("edit", record)} style={{ color: '#4D4D4D' }}>Edit</a>
      </Menu.Item>
      <Menu.Item key="3" style={{
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
        <a onClick={() => showModal("delete", record)} style={{ color: '#4D4D4D' }}>Delete</a>
      </Menu.Item>
    </Menu>
  );

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
            Manage Appointments
          </h3>
          <Button 
            {...BUTTON_CONFIGS.ADD_BUTTON()}
            onClick={() => showModal("add", null)} 
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
            ActiveVisitorsDataObject={ActiveVisitorsDataObject}
            DepartmentsDataObject={DepartmentsDataObject}
            HostsDataObject={HostsDataObject}
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
                    emptyText: qry_data?.length === 0 ? 'No appointment data found' : 'No data'
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

export default AppointmentsTable;
