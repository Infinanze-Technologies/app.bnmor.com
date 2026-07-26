import React, { useEffect, useState } from "react";
import { Dropdown, Space, Avatar, Spin, Table, Tag, Button, Pagination, Modal } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditProperty from "./EditProperty";
import EditPropertyStatus from "./EditPropertyStatus";
import AddProperty from "./AddProperty";
import DeleteProperty from "./DeleteProperty";
import ViewPropertyFiles from "./ViewPropertyFiles";
import ViewProperty from "./ViewProperty";
import AddPropertyImage from "./AddPropertyImage";
import { URL_DELETE_PROPERTY, URL_PROPERTY_APPROVAL } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper, TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import FilterOptions from "./FilterOptions";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const MAX_PROPERTY_IMAGES = 6;

const PropertiesTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [filesModalVisible, setFilesModalVisible] = useState(false);
  const [addImageModalVisible, setAddImageModalVisible] = useState(false);
  const [viewPropertyVisible, setViewPropertyVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { PropertiesDataObject, jwt,setLoading,loading } = props;

  

  let {
    isLoading,
    isError,
    data,
    page,
    totalPages,
    refetch,
    forceRefetch,
    isFetching,
    currentPage,
    totalItem,
    setpage,
    setpageSize,
    pageSize,
    statusCode,
    message,
    failed
  } = PropertiesDataObject;

  let qry_data = PropertiesDataObject?.data?.data || PropertiesDataObject?.data?.items || PropertiesDataObject?.data || []

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
       
    
  }, [PropertiesDataObject]);


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
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
      title: 'Title',
      dataIndex: 'title',
      align: "center",
      render: (text) => {
        if (!text) return 'N/A';
        return text.length > 20 ? `${text.substring(0, 20)}...` : text;
      }
    },
    // {
    //   title: 'Description',
    //   dataIndex: 'description',
    //   align: "center",
    //   render: (text) => text ? (text.length > 50 ? text.substring(0, 50) + '...' : text) : 'N/A'
    // },
    {
      title: 'Location',
      dataIndex: 'location',
      align: "center",
      render: (text, record) => {
        return `${record?.region?.name} / ${record?.area?.name}`;
      }
    },
    {
      title: 'Price / Budget',
      dataIndex: 'price',
      align: "center",
      render: (text, record) => {
        const value = record.price || record.budget;
        return value ? `GHC ${parseFloat(value).toLocaleString()}` : 'N/A';
      }
    },
    {
      title: 'Category',
      dataIndex: 'category',
      align: "center",
      render: (text, record) => {
        if (record.category && typeof record.category === 'object' && record.category.name) {
          return record.category.name;
        }
        return 'N/A';
      }
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      align: "center",
      render: (text, record) => {
        if (record.subcategory && typeof record.subcategory === 'object' && record.subcategory.name) {
          return record.subcategory.name;
        }
        return 'N/A';
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: "center",
      render: (text, record) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'Available':
              return 'success';
            case 'Sold':
              return 'error';
            case 'Rented':
              return 'warning';
            case 'Under Maintenance':
              return 'processing';
            case 'Ongoing':
              return 'processing';
            case 'Completed':
              return 'success';
            case 'On Hold':
              return 'warning';
            case 'Upcoming':
              return 'default';
            case 'Leased':
              return 'warning';
            default:
              return 'default';
          }
        };

        return (
          <Tag 
              color={getStatusColor(record?.statuses?.name)}
            style={{ 
              cursor: 'pointer',
              fontWeight: 'bold',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(77, 77, 77, 0.2)',
              color: '#4D4D4D',
              background: record?.statuses?.name === 'Available' ? '#E8F5E8' : 
                         record?.statuses?.name === 'Sold' ? '#F8D7DA' :
                         record?.statuses?.name === 'Rented' ? '#FFF3CD' :
                         record?.statuses?.name === 'Under Maintenance' ? '#E8F5E8' :
                         record?.statuses?.name === 'Ongoing' ? '#E8F5E8' :
                         record?.statuses?.name === 'Completed' ? '#E8F5E8' :
                         record?.statuses?.name === 'On Hold' ? '#E8F5E8' :
                         record?.statuses?.name === 'Upcoming' ? '#E8F5E8' :
                         record?.statuses?.name === 'Leased' ? '#E8F5E8' :
                         '#E8F5E8'
                       
            }}
            // onClick={() => handleStatusEdit(record)}
          >
            {record?.statuses?.name || 'N/A'}
          </Tag>
        );
      }
    },
    {
      title: 'Approval',
      dataIndex: 'approval_status',
      align: "center",
      render: (text, record) => {
        const status = record?.approval_status || 'approved';
        const colorMap = {
          pending: 'gold',
          approved: 'green',
          rejected: 'red',
        };
        const labelMap = {
          pending: 'Pending',
          approved: 'Approved',
          rejected: 'Rejected',
        };
        return (
          <Tag color={colorMap[status] || 'default'}>
            {labelMap[status] || status}
          </Tag>
        );
      }
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      align: "center",
      render: (text,record,index)=> (
        <>
          {formatDateHuman(record?.created_at)}
        </>
      )
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Dropdown
          trigger={['click']}
          placement="bottomRight"
          menu={{
            items: getRowActionMenuItems(record),
            onClick: ({ domEvent }) => domEvent?.stopPropagation?.(),
          }}
        >
          <Button
            type="text"
            icon={<AiOutlineMore />}
            onClick={(e) => e.stopPropagation()}
            style={{
              border: 'none',
              boxShadow: 'none',
              fontSize: '16px',
              color: '#666',
              padding: '4px 8px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
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
      // setModalTitle(<EditBorrowerTitle />);
      setModalWidth(900);
      setModalContent(
        <EditProperty
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          forceRefetch={forceRefetch}
        />
      );
    } else if (value == "add") {
      setIsModalVisible(true);
      setModalWidth(900);
      setModalContent(
        <AddProperty
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          refetch={refetch}
          forceRefetch={forceRefetch}
        />
      );
    } else if (value == "delete") {
      setIsModalVisible(true);
      setModalWidth(600);
      setModalContent(
        <DeleteProperty
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
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

  const EditPropertyTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Property</h6>
    </div>
  );

  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_PROPERTY, record?.id, jwt)
      .then((res) => {
        handleRequestResponse(res);
        refetch();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };

  // updateRequest builds `${url}/${id}` — pass `${uuid}/approval` as id
  const handleApproval = (record, approval_status) => {
    if (!record?.uuid) return;
    updateRequest(
      URL_PROPERTY_APPROVAL,
      `${record.uuid}/approval`,
      { approval_status },
      jwt
    )
      .then(async (res) => {
        handleRequestResponse(res);
        await forceRefetch();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };

  const confirmApprove = (record) => {
    Modal.confirm({
      title: 'Approve this property?',
      content: 'This listing will become visible on the public site.',
      okText: 'Approve',
      cancelText: 'Cancel',
      onOk: () => handleApproval(record, 'approved'),
    });
  };

  const confirmReject = (record) => {
    Modal.confirm({
      title: 'Reject this property?',
      content: 'This property will be marked as rejected and hidden from public listings.',
      okText: 'Reject',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => handleApproval(record, 'rejected'),
    });
  };

  const handleStatusModalCancel = () => {
    setStatusModalVisible(false);
    setSelectedRecord(null);
  };

  const handleFilesModalCancel = () => {
    setFilesModalVisible(false);
    setSelectedRecord(null);
  };

  const handleAddImageModalCancel = () => {
    setAddImageModalVisible(false);
    setSelectedRecord(null);
  };

  const handleAddImageSuccess = () => {
    // Refresh the property data after image upload
    forceRefetch();
  };

  const handleViewPropertyCancel = () => {
    setViewPropertyVisible(false);
    setSelectedRecord(null);
  };

  /**
   * Ant Design 5: use Dropdown `menu={{ items }}` instead of deprecated `overlay={<Menu/>}`.
   * The legacy combo can leave an invisible full-viewport layer that steals clicks (e.g. sidebar).
   */
  const getRowActionMenuItems = (record) => {
    const propertyImageCount = Array.isArray(record?.images) ? record.images.length : 0;
    const canAddMoreImages = propertyImageCount < MAX_PROPERTY_IMAGES;

    const items = [
      {
        key: 'view',
        label: 'View details',
        onClick: () => {
          setSelectedRecord(record);
          setViewPropertyVisible(true);
        },
      },
      {
        key: 'edit',
        label: 'Edit',
        onClick: () => showModal('edit', record),
      },
      {
        key: 'images',
        label: 'View Images',
        onClick: () => {
          setSelectedRecord(record);
          setFilesModalVisible(true);
        },
      },
    ];

    if (canAddMoreImages) {
      items.push({
        key: 'add-image',
        label: 'Add Image',
        onClick: () => {
          setSelectedRecord(record);
          setAddImageModalVisible(true);
        },
      });
    }

    if (record?.approval_status !== 'approved') {
      items.push({
        key: 'approve',
        label: 'Approve',
        onClick: () => confirmApprove(record),
      });
    }

    if (record?.approval_status !== 'rejected') {
      items.push({
        key: 'reject',
        danger: true,
        label: 'Reject',
        onClick: () => confirmReject(record),
      });
    }

    items.push({
      key: 'delete',
      label: 'Delete',
      danger: true,
      onClick: () => showModal('delete', record),
    });

    return items;
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
          }}>
              Manage Properties
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
                  dataSource={qry_data}
                  loading={isLoading}
                  columns={mergedColumns}
                  locale={{
                    emptyText: qry_data?.length === 0 ? 'No property data found' : 'No data'
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
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {modalContent}
      </ModalComponent>

      <EditPropertyStatus
        visible={statusModalVisible}
        onCancel={handleStatusModalCancel}
        record={selectedRecord}
        jwt={jwt}
        refetch={refetch}
        forceRefetch={forceRefetch}
      />

      <ViewProperty
        visible={viewPropertyVisible}
        onCancel={handleViewPropertyCancel}
        record={selectedRecord}
      />

      <ViewPropertyFiles
        visible={filesModalVisible}
        onCancel={handleFilesModalCancel}
        record={selectedRecord}
        jwt={jwt}
        forceRefetch={forceRefetch}
        onFileUpdate={() => {
   
          forceRefetch();
        }}
      />

      <AddPropertyImage
        propertyId={selectedRecord?.uuid}
        visible={addImageModalVisible}
        onCancel={handleAddImageModalCancel}
        onSuccess={handleAddImageSuccess}
        jwt={jwt}
      />
    </>
  );
};

export default PropertiesTable;
