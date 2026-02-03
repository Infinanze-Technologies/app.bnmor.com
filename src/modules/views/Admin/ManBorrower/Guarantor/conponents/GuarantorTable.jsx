import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Tag, Button, Pagination } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditGuarantor from "./EditGuarantor";
import AddGuarantor from "./AddGuarantor";
import DeleteGuarantor from "./DeleteGuarantor";
import ViewGuarantor from "./ViewGuarantor";
import ViewGuarantorFiles from "./ViewGuarantorFiles";
import EditGuarantorStatus from "./EditGuarantorStatus";
import { URL_DELETE_GUARANTOR, URL_GUARANTOR_STATUS } from "@/config/api-paths";
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

const GuarantorTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [filesModalVisible, setFilesModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { AdminDataObject, jwt, setLoading, loading, setfilterUserData, QryBranchDataObject,forceRefetch } = props;

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
  } = AdminDataObject;

  let guarantor_data = AdminDataObject?.data?.data || AdminDataObject?.data?.items || AdminDataObject?.data || []

  // Ensure guarantor_data is an array
  if (!Array.isArray(guarantor_data)) {
    console.warn('guarantor_data is not an array:', guarantor_data)
    guarantor_data = []
  }

  const onPageChange = (page, pageSize) => {
    // console.log('Pagination changed - page:', page, 'pageSize:', pageSize);
    // API uses 1-based page numbers, so we pass the page directly
    setpage(page);
  }

  useEffect(() => {
    // Component mount logic
  }, [AdminDataObject]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'guarantor_id',
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
      title: 'Primary Phone',
      dataIndex: 'phone_number',
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
      title: 'Gender',
      dataIndex: 'gender',
      align: "center",
    },
    {
      title: 'Monthly Income',
      dataIndex: 'monthly_income',
      align: "center",
      render: (text) => `$${parseFloat(text || 0).toLocaleString()}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: "center",
      render: (text, record) => {
        const getStatusColor = (status) => {
          switch (status) {
            case '1':
            case 'Active':
              return 'success';
            case '0':
            case 'Inactive':
              return 'warning';
            case 'Suspended':
              return 'error';
            case 'Blacklisted':
              return 'default';
            default:
              return 'default';
          }
        };

        const getStatusText = (status) => {
          switch (status) {
            case '1':
              return 'Active';
            case '0':
              return 'Inactive';
            default:
              return status;
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
              background: record?.status === '1' || record?.status === 'Active' ? '#E8F5E8' : 
                         record?.status === '0' || record?.status === 'Inactive' ? '#FFF3CD' : '#E8F5E8'
            }}
            onClick={() => handleStatusEdit(record)}
          >
            {getStatusText(record?.status)}
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
      // setModalTitle(<EditGuarantorTitle />);
      setModalWidth(900);
      setModalContent(
        <EditGuarantor
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          QryBranchDataObject={QryBranchDataObject}
          forceRefetch={forceRefetch}
        />
      );
    } else if (value == "add") {
      setIsModalVisible(true);
      setModalWidth(900);
      setModalContent(
        <AddGuarantor
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          refetch={refetch}
          QryBranchDataObject={QryBranchDataObject}
          forceRefetch={forceRefetch}
        />
      );
    } else if (value == "delete") {
      setIsModalVisible(true);
      setModalWidth(600);
      setModalContent(
        <DeleteGuarantor
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          forceRefetch={forceRefetch}
        />
      );
    } else if (value == "view") {
      setIsModalVisible(true);
      setModalWidth(800);
      setModalContent(
        <ViewGuarantor
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
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

  const EditGuarantorTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Guarantor</h6>
    </div>
  );

  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_GUARANTOR, record?.id, jwt)
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

  const handleFilesModalCancel = () => {
    setFilesModalVisible(false);
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
        <a onClick={() => showModal("edit", record)} style={{ color: '#4D4D4D' }}>Edit</a>
      </Menu.Item>
      <Menu.Item key="2" style={{
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
        <a onClick={() => {
          setSelectedRecord(record);
          setFilesModalVisible(true);
        }} style={{ color: '#4D4D4D' }}>View Files</a>
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

  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        <Skeleton count={5} height={50} />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Error loading guarantors. Please try again.</p>
      </div>
    );
  }

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
            Manage Guarantors
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
            setfilterUserData={setfilterUserData}
            QryBranchDataObject={QryBranchDataObject}
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
                  dataSource={guarantor_data}
                  loading={isLoading}
                  columns={mergedColumns}
                  locale={{
                    emptyText: guarantor_data?.length === 0 ? 'No guarantor data found' : 'No data'
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

      <EditGuarantorStatus
        visible={statusModalVisible}
        onCancel={handleStatusModalCancel}
        record={selectedRecord}
        jwt={jwt}
        refetch={refetch}
        forceRefetch={forceRefetch}
      />

      <ViewGuarantorFiles
        visible={filesModalVisible}
        onCancel={handleFilesModalCancel}
        record={selectedRecord}
        jwt={jwt}
        forceRefetch={forceRefetch}
        onFileUpdate={() => {
          // Refresh the guarantor data after file update
          forceRefetch();
        }}
      />
    </>
  );
};

export default GuarantorTable; 