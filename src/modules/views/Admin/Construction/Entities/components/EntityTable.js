import React, { useEffect, useState } from "react";
import { Space, Popconfirm, Table, Button } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditEntity from "./EditEntity";
import { URL_DELETE_ENTITIES } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest } from "@/hooks/apiService";
import { UserTableStyleWrapper, TableWrapper } from '@/components/TableStyle/table';
import { PlusOutlined } from '@ant-design/icons';
import AddEntity from "./AddEntity";

const EntityTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  let { jwt, EntityDataObject } = props;

  let {
    loading,
    refetch,
    forceRefetch,
    currentPage,
    totalItem,
    setpage,
    setpageSize,
    pageSize
  } = EntityDataObject;

  let qryData = EntityDataObject?.data || [];

  const onPageChange = (page) => {
    setpage(page);
  };

  useEffect(() => {}, [EntityDataObject]);

  const showModal = (value, record) => {

    if (value == "add") {
      setIsModalVisible(true);
      setModalTitle(<AddEntityTitle />);
      setModalWidth(500);
      setModalContent(<AddEntity setIsModalVisible={setIsModalVisible} jwt={jwt} refetch={refetch} forceRefetch={forceRefetch} />);
    }
    else if (value == "edit") {
      setIsModalVisible(true);
      setModalTitle(<EditEntityTitle record={record} />);
      setModalWidth(500);
      setModalContent(
        <EditEntity
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          forceRefetch={forceRefetch}
        />
      );
    }
    else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const EditEntityTitle = ({ record }) => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Entity — {record?.name}</h6>
    </div>
  );

  const AddEntityTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Add Entity</h6>
    </div>
  );

  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_ENTITIES, record?.id, jwt)
      .then(async (res) => {
        handleRequestResponse(res);
        await forceRefetch();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };

  const columns = [
    {
      title: '#',
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
      title: 'NAME',
      dataIndex: 'name',
      align: "left",
      render: (text, record) => (
        <span style={{
          fontWeight: '600',
          color: '#2c3e50',
          fontSize: '14px'
        }}>
          {record?.name}
        </span>
      )
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      align: "left",
      render: (text, record) => (
        <span>{record?.email}</span>
      )
    },
    {
      title: 'PHONE',
      dataIndex: 'phone',
      align: "left",
      render: (text, record) => (
        <span>{record?.phone}</span>
      )
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Space size="small">
          <Button
            size="small"
            type="primary"
            onClick={() => showModal("edit", record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure？"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record)}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
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
            Manage Entities
          </h3>
          <Button
            type="primary"
            ghost
            onClick={() => showModal("add")}
            icon={<PlusOutlined />}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontWeight: '500',
              borderRadius: '8px',
              height: '40px',
              padding: '0 20px',
            }}
          >
            Create
          </Button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <UserTableStyleWrapper>
              <TableWrapper>
                <Table
                  className="table-responsive"
                  dataSource={qryData || []}
                  loading={loading}
                  columns={mergedColumns}
                  locale={{
                    emptyText: qryData?.length === 0 || qryData === null ? 'No data found' : 'No data'
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
      >
        {modalContent}
      </ModalComponent>
    </>
  );
};

export default EntityTable;
