import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Tag, Button, Pagination } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditEntry from "./EditEntry";
import AddEntry from "./AddEntry";
import VisitorManagementTabs from "./AddComp/VisitorManagementTabs";
import DeleteEntry from "./DeleteEntry";
import ViewEntry from "./ViewEntry";
import EntryStatusUpdate from "./EntryStatusUpdate";
import EntryCkeckIn from "./EntryCkeckIn";
import EntryCheckOut from "./EntryCheckOut";
import { URL_DELETE_VISITOR_ENTRIES, URL_VISITOR_ENTRIES_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper, TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman, formatDateTime, formatTime } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import FilterOptions from "./FilterOptions";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const EntryTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { EntriesDataObject, QryBranchDataObject, GuestsDataObject, HostsDataObject, DepartmentsDataObject, setLoading, loading ,jwt,ActiveVisitorsDataObject} = props;

  let {
    isLoading,
    isError,
    data,
    page,
    totalPages,
    refetch,
    forceRefetch,
    currentPage,
    totalItem,
    setpage,
    setpageSize,
    pageSize,
    statusCode,
    message,
    failed
  } = EntriesDataObject;

  let qry_data = EntriesDataObject?.data || []
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
  }, [EntriesDataObject]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'entry_id',
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
      title: 'Entry Type',
      dataIndex: 'entry',
      align: "center",

      render: (text, record) => {
        if (record.entry_type) {
          const getEntryTypeColor = (entryType) => {
            switch (entryType.toLowerCase()) {
              case 'appointment':
                return 'green';
              case 'walk-in':
                return 'blue';
              case 'scheduled':
                return 'purple';
              case 'emergency':
                return 'red';
              case 'meeting':
                return 'orange';
              default:
                return 'default';
            }
          };

          return (
            <Tag color={getEntryTypeColor(record.entry_type)}>
              {record.entry_type}
            </Tag>
          );
        }
        return 'N/A';
      }
      // render: (text, record) => {
      //   if (record.entry_type && typeof record.entry_type === 'object' && record.entry.entry_type) {
      //     return record.entry.entry_type;
      //   }
      //   return 'N/A';
      // }
    },
    {
      title: 'Visit Type',
      dataIndex: 'entry',
      align: "center",
      render: (text, record) => {
        if (record.visit_type) {
          const getVisitTypeColor = (visitType) => {
            switch (visitType.toLowerCase()) {
              case 'business':
                return 'blue';
              case 'personal':
                return 'green';
              case 'official':
                return 'purple';
              case 'interview':
                return 'orange';
              case 'delivery':
                return 'cyan';
              case 'maintenance':
                return 'magenta';
              case 'inspection':
                return 'red';
              case 'social':
                return 'green';
              default:
                return 'default';
            }
          };

          return (
            <Tag color={getVisitTypeColor(record.visit_type)}>
              {record.visit_type}
            </Tag>
          );
        }
        return 'N/A';
      }
    },
    // {
    //   title: 'Purpose',
    //   dataIndex: 'entry',
    //   align: "center",
    //   render: (text, record) => {
    //     if (record.purpose) {
    //       return record.purpose.length > 30 
    //         ? record.purpose.substring(0, 30) + '...'
    //         : record.purpose;
    //     }
    //     return 'N/A';
    //   }
    // },
    {
      title: 'Date',
      dataIndex: 'entry',
      align: "center",
      render: (text, record) => {
        if (record.check_in_time) {
          return formatDateHuman(record.check_in_time);
        }
        return 'Not Checked In';
      }
    },
    {
      title: 'Check In',
      dataIndex: 'entry',
      align: "center",
      render: (text, record) => {
        if (record.check_in_time) {
          return formatTime(record.check_in_time);
        }
        return 'Not Checked In';
      }
    },
    {
      title: 'Check Out',
      dataIndex: 'entry',
      align: "center",
      render: (text, record) => {
          if (record.check_out_time) {
            return formatTime(record.check_out_time);
        }
        return 'Not Checked Out';
      }
    },
    {
      title: 'Status',
      dataIndex: 'entry',
      align: "center",  
      render: (text, record) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'Pending':
              return 'orange';
            case 'Available':
              return 'blue';
            case 'Unavailable':
              return 'red';
            case 'Waiting':
              return 'purple';
            default:
              return 'default';
          }
        };

        const status = record?.status || 'Pending';
        const isCompleted = status === 'Checked-in' || status === 'Checked-out';

        return (
          <Tag 
            color={getStatusColor(status)}
            style={{ 
              cursor: isCompleted ? 'default' : 'pointer',
              fontWeight: 'bold',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(77, 77, 77, 0.2)',
              color: '#4D4D4D',
              opacity: isCompleted ? 0.7 : 1
            }}
            onClick={() => handleStatusEdit(record)}
          >
            {status === 'Waiting' ? 'Occupied' : status}
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
    if (value == "view") {
      setIsModalVisible(true);
      setModalWidth(1200);
      setModalContent(
        <ViewEntry
          record={record}
        />
      );
    } else if (value == "edit") {
      setIsModalVisible(true);
      setModalWidth(900);
      setModalContent(
        <EditEntry
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          QryBranchDataObject={QryBranchDataObject}
          ActiveVisitorsDataObject={ActiveVisitorsDataObject}
          HostsDataObject={HostsDataObject}
          DepartmentsDataObject={DepartmentsDataObject}
          setpage={setpage}
          record={record}
          refetch={refetch}
          forceRefetch={forceRefetch}
        />
      );
    } else if (value == "add") {
      setIsModalVisible(true);
      setModalWidth(1000);
      setModalContent(
        <VisitorManagementTabs
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          QryBranchDataObject={QryBranchDataObject}
          HostsDataObject={HostsDataObject}
          DepartmentsDataObject={DepartmentsDataObject}
          ActiveVisitorsDataObject={ActiveVisitorsDataObject}
          setpage={setpage}
          refetch={refetch}
          forceRefetch={forceRefetch}
        />
      );
    } else if (value == "delete") {
      setIsModalVisible(true);
      setModalWidth(600);
      setModalContent(
        <DeleteEntry
        setpage={setpage}
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          forceRefetch={forceRefetch}
        />
      );
    } else if (value == "status") {
      setIsModalVisible(true);
      setModalWidth(700);
      setModalContent(
        <EntryStatusUpdate
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          setpage={setpage}
          refetch={refetch}
          forceRefetch={forceRefetch}
        />
      );
    } else if (value == "approve") {
      setIsModalVisible(true);
      setModalWidth(600);
      setModalContent(
        <EntryCkeckIn
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          setpage={setpage}
          refetch={refetch}
          forceRefetch={forceRefetch}
        />
      );
    } else if (value == "checkout") {
      setIsModalVisible(true);
      setModalWidth(600);
      setModalContent(
        <EntryCheckOut
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          setpage={setpage}
          refetch={refetch}
          forceRefetch={forceRefetch}
        />
      );
    } else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // const handleDelete = async (record) => {
  //   deleteRequest(URL_DELETE_VISITOR_ENTRIES, record?.entry_id, jwt)
  //     .then(async (res) => {
  //       handleRequestResponse(res);
  //       await forceRefetch();
  //     })
  //     .catch((err) => {
  //       handleRequestError(err);
  //     });
  // };

  const handleStatusEdit = (record) => {
    const currentStatus = record?.status || 'Pending';
    const isCompleted = currentStatus === 'Checked-in' || currentStatus === 'Checked-out';
    
    if (!isCompleted) {
      showModal("status", record);
    }
  };


  const menu = (record) => {
    const currentStatus = record?.status || 'Pending';
    const isAvailable = currentStatus === 'Available';
    const isPending = currentStatus === 'Pending';
    const isCheckedIn = currentStatus === 'Checked-in';
    const isCompleted = currentStatus === 'Checked-in' || currentStatus === 'Checked-out';
    
    return (
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
          <a onClick={() => showModal("view", record)} style={{ color: '#4D4D4D' }}>Entry Details</a>
        </Menu.Item>
        {isAvailable && (
          <Menu.Item key="approve" style={{
            color: '#52c41a',
            fontWeight: '500',
            padding: '8px 16px',
            borderRadius: '4px',
            margin: '4px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (e.currentTarget && e.currentTarget.style) {
              e.currentTarget.style.background = 'rgba(82, 196, 26, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (e.currentTarget && e.currentTarget.style) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
          >
            <a onClick={() => showModal("approve", record)} style={{ color: '#52c41a' }}>Check In</a>
          </Menu.Item>
        )}
        {currentStatus === 'Checked-in' && (
          <Menu.Item key="checkout" style={{
            color: '#fa8c16',
            fontWeight: '500',
            padding: '8px 16px',
            borderRadius: '4px',
            margin: '4px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (e.currentTarget && e.currentTarget.style) {
              e.currentTarget.style.background = 'rgba(250, 140, 22, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (e.currentTarget && e.currentTarget.style) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
          >
            <a onClick={() => showModal("checkout", record)} style={{ color: '#fa8c16' }}>Check Out</a>
      </Menu.Item>
        )}
        {!isCompleted && (
          <Menu.Item key="status" style={{
            color: '#1890ff',
        fontWeight: '500',
        padding: '8px 16px',
        borderRadius: '4px',
        margin: '4px',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        if (e.currentTarget && e.currentTarget.style) {
              e.currentTarget.style.background = 'rgba(24, 144, 255, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (e.currentTarget && e.currentTarget.style) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
      >
            <a onClick={() => showModal("status", record)} style={{ color: '#1890ff' }}>Update Status</a>
      </Menu.Item>
        )}
        {isPending && (
      <Menu.Item key="3" style={{
            color: '#ff4d4f',
        fontWeight: '500',
        padding: '8px 16px',
        borderRadius: '4px',
        margin: '4px',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        if (e.currentTarget && e.currentTarget.style) {
              e.currentTarget.style.background = 'rgba(255, 77, 79, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (e.currentTarget && e.currentTarget.style) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
      >
            <a onClick={() => showModal("delete", record)} style={{ color: '#ff4d4f' }}>Delete</a>
      </Menu.Item>
        )}
    </Menu>
  );
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
            Manage Entries
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
            HostsDataObject={HostsDataObject}
            DepartmentsDataObject={DepartmentsDataObject}
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
                    emptyText: qry_data?.length === 0 ? 'No entry data found' : 'No data'
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

export default EntryTable;
