import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Tag, Button, Pagination } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditOrganization from "./EditOrganization";
import AddOrganization from "./AddOrganization";
import DeleteOrganization from "./DeleteOrganization";
import { URL_DELETE_VISITOR_ORGANIZATIONS, URL_GET_VISITOR_ORGANIZATIONS } from "@/config/api-paths";
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

const OrganizationTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { OrganizationDataObject, QryBranchDataObject,jwt} = props;

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
  } = OrganizationDataObject;

  let qry_data = OrganizationDataObject?.data || []
  // console.log('====================================');    
  // console.log("OrganizationDataObject",OrganizationDataObject);
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
  }, [OrganizationDataObject]);

  const columns = [
    {
      title: 'Organization ID',
      dataIndex: 'org_id',
      align: "left",
      render: (text, record) => (
        <span style={{ 
          fontFamily: 'monospace', 
          fontSize: '0.8rem',
          color: '#4D4D4D',
          fontWeight: '500'
        }}>
          {text?.substring(0, 8)}...
        </span>
      )
    },
    {
      title: 'Organization Name',
      dataIndex: 'name',
      align: "center",
      render: (text, record) => (
        <span style={{ 
          fontWeight: '500',
          color: '#4D4D4D'
        }}>
          {record.name || 'N/A'}
        </span>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: "center",
      render: (text, record) => (
        <span style={{ 
          color: '#666',
          fontSize: '14px'
        }}>
          {record.email || 'N/A'}
        </span>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      align: "center",
      render: (text, record) => (
        <span style={{ 
          color: '#666',
          fontSize: '14px'
        }}>
          {record.phone || 'N/A'}
        </span>
      )
    },
    {
      title: 'Address',
      dataIndex: 'address',
      align: "center",
      render: (text, record) => (
        <span style={{ 
          color: '#666',
          fontSize: '14px',
          maxWidth: '200px',
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {record.address || 'N/A'}
        </span>
      )
    },
    {
      title: 'Guests Count',
      dataIndex: 'guests',
      align: "center",
      render: (text, record) => (
        <Tag 
          color="blue"
          style={{ 
            fontWeight: '500',
            padding: '4px 8px',
            borderRadius: '4px'
          }}
        >
          {record.guests?.length || 0} guests
        </Tag>
      )
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      align: "center",
      render: (text, record) => (
        <>
          {formatDateHuman(record?.updatedAt)}
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
            case true:
              return 'success';
            case false:
              return 'error';
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
              background: record?.status === true ? '#E8F5E8' : '#F8D7DA'
            }}
            onClick={() => handleStatusEdit(record)}
          >
            {record?.status === true ? 'Active' : 'Inactive'}
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
        <EditOrganization
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          QryBranchDataObject={QryBranchDataObject}
          setpage={setpage}
          record={record}
          refetch={refetch}
        />
      );
    } else if (value == "add") {
      setIsModalVisible(true);
      setModalWidth(900);
      setModalContent(
        <AddOrganization
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          QryBranchDataObject={QryBranchDataObject}
          setpage={setpage}
          refetch={refetch}
        />
      );
    } else if (value == "delete") {
      setIsModalVisible(true);
      setModalWidth(600);
      setModalContent(
        <DeleteOrganization
        setpage={setpage}
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
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
    deleteRequest(URL_DELETE_VISITOR_ORGANIZATIONS, record?.id, jwt)
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
            Manage Organizations
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
                    emptyText: qry_data?.length === 0 ? 'No organization data found' : 'No data'
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

export default OrganizationTable;
