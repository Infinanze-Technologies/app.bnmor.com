import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table } from "antd";
import ModalComponent from "@/components/ModalComponent";
import EditMember from "./EditMember";
import { URL_DELETE_MEMBER, URL_MEMBER_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
// import Image from "next/image";

const AdminTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { AdminDataObject, jwt,RoleDataObject,setLoading,loading } = props;


 

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
    setpage
   
  } = AdminDataObject;

  let admin_data = AdminDataObject?.data?.items



  const handlePaginationChange = (current) => {
    setpage(current)
  };


  useEffect(() => {
       
    
  }, [AdminDataObject]);


  const columns = [
    {
      title: 'M-ID',
      dataIndex: 'member_code',
      align: "left",
      // render: (text,record,index)=> formatDateHuman(record?.join_date)
   
    },


      {
        title: 'Name',
        dataIndex: 'name',
        align: "center",
     
      },
  
      {
        title: 'Email',
        dataIndex: 'email',
        align: "center",
   
      },
      {
          title: 'Mobile',
          dataIndex: 'contact_no',
          align: "center",
     
        },
        {
          title: 'Status',
          dataIndex: 'status',
          align: "center",
          render: (text,record,index)=> 
         record?.status === "0" ? (
            <>

            <span
            // style={{ 
            //   backgroundColor: "#dd4b39",
            //   color: "#fff",
            //   display: "inline",
            //   padding: "0.2em 0.6em 0.3em",
            //   fontSize: "75%",
            //   textAlign:"center",
            //   whiteSpace: "nowrap",
            //   verticalAlign: "baseline",
            //   borderRadius: "0.25em",
            //   cursor:"pointer"


            //  }}
             onClick={() => handleStatus(record)}
            >
                    <Switch
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
      
      
    />
                      </span>
            </>
          )  
          :
          record?.status === "1" ? (
            <>
        
             <span
            // style={{ 
            //   backgroundColor: "#98D973",
            //   color: "#fff",
            //   display: "inline",
            //   padding: "0.2em 0.6em 0.3em",
            //   fontSize: "75%",
            //   textAlign:"center",
            //   whiteSpace: "nowrap",
            //   verticalAlign: "baseline",
            //   borderRadius: "0.25em",
            //   cursor:"pointer"


            //  }}
             onClick={() => handleStatus(record)}
            >
             <Switch
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
      defaultChecked
    />
                      </span>
            </>
          )
          :
          ''
          
          
         
     
        },
     
     



      {
          title: "Action",
          key: "action",
          align: "center",
          render: (text, record) => (
            <Dropdown overlay={menu(record)} trigger={["click"]}>
              <Space size="middle">
                <AiOutlineMore style={{ fontSize: "1.2rem", cursor: "pointer" }} />
              </Space>
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
      setModalTitle(<EditMemberTitle />);
      setModalWidth(800);
      setModalContent(
        <EditMember
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          refetch={refetch}
          RoleDataObject = {RoleDataObject?.data?.data}
        />
      );
    } else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const EditMemberTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Admin</h6>
    </div>
  );

  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_MEMBER, record?.id, jwt)
      .then((res) => {
        handleRequestResponse(res);
        refetch();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };


  const handleStatus = (record) => {
    let data = {
      status: record?.status == 1 ? 0 : 1
    }
    updateRequest(URL_MEMBER_STATUS, record?.id, { ...data }, jwt)
      .then((res) => {
        handleRequestResponse(res);
        refetch();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item key="1">
        <a onClick={() => showModal("edit", record)}>Edit</a>
      </Menu.Item>

      <Menu.Item key="3">
        <Popconfirm
          title="Are you sure？"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(record)}
        >
          <a>Delete</a>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );




  return (
    <>
       <div className="card card-table flex-fill">
      <div className="card-header">
        <h3 className="card-title mb-0">All Members</h3>
      </div>
      <div className="card-body">
        <div className="table-responsive">
        <UserTableStyleWrapper>
          <TableWrapper>
          <Table
           className="table-responsive"
            // rowSelection={rowSelection}
            dataSource={admin_data}
            loading={isLoading}
            columns={mergedColumns}
            
            pagination={{
    size: "small",
    position: ["bottomCenter"],
    onChange: handlePaginationChange,
    total: totalItem,
    current: currentPage
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

export default AdminTable;
