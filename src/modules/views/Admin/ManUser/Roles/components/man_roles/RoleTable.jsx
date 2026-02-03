import React, { useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table,Tooltip, Button } from "antd";
import ModalComponent from "@/components/ModalComponent";
import { HiDotsVertical } from "react-icons/hi";
import EditRole from "./EditRole";
import { URL_DELETE_ROLE, URL_GET_ALL_PERMISSION_FOR_EDIT, URL_GET_APP_MODULES, URL_GET_ROLES_WITH_PERMISSIONS, URL_UPDATE_ROLE_STATUS } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { HiViewGridAdd } from "react-icons/hi";
import AddPermission from "./AddPermission";
import EditPermission from "./EditPermission";

import AddRoles from './AddRoles';
import { PlusOutlined } from "@ant-design/icons";
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";
// import Image from "next/image";

const RoleTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { RoleDataObject, jwt,qryData,forceRefetch,isLoading,permissionData } = props;











  // console.log(isFetching)

  const columns = [


    {
      title: 'Name',
      dataIndex: 'name',
      align: "left",
 
    },

 

   

    {
      title: 'Status',
      dataIndex: 'status',
      align: "left",
      render: (text,record,index,boolean)=> 
   
      <>
    
    {

      record?.status === true 
      ?
      (
        <>

        <span style={{ textAlign:'center' }} className="active-status-color">
        Active
      </span>
        </>
      ) 
      :
      (
        <>
        <span className="inactive-status-color">
        Inactive
      </span>
        </>
      )

    }


     </>
     
     
 
    },



    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <>
          <div className="action-button">
         

 <div className="icon">
 <Tooltip placement="topLeft" title="Edit Role" align='center' color="white">
 <a onClick={() => showModal("edit", record)}>
 <FaEdit size={18} color="#1cdbe5 "/>
 
 </a>

 </Tooltip>

</div>

     

     
{record?.role_permissions?.length == 0 
&&
(
  <>
  <div className="icon">
 <Tooltip placement="topLeft" title="Assign Permissions" align='center' color="white">
 <a onClick={() => showModal("add-permission", record)}>
 <HiViewGridAdd size={18} color="#6A510B "/>
 
 </a>

 </Tooltip>

</div>
  </>
)
}
      
{record?.role_permissions?.length > 0 
&&
(
  <>
 <div className="icon">
 <Tooltip placement="topLeft" title="Edit Permissions" align='center' color="white">
 <a onClick={() => showModal("edit-permission", record)}>
 <HiViewGridAdd size={18} color="#1C6A0B "/>
 
 </a>

 </Tooltip>

</div>

  </>
)
}


        
<div className="icon">
          <Tooltip placement="topLeft" title="Delete Role" align='center' color="white">
          <Popconfirm
      title="Are you sure？"
      okText="Yes"
      cancelText="No"
      onConfirm={() => handleDelete(record)}
    >
      <AiFillDelete size={18} color="#A02D10" />
    </Popconfirm>
    </Tooltip>
          
          </div>
          </div>
        </>
        // <Dropdown overlay={menu(record)} trigger={["click"]}>
        //   <Space size="middle">
        //     <AiOutlineMore style={{ fontSize: "1.2rem", cursor: "pointer" }} />
        //   </Space>
        // </Dropdown>
      ),
    },
 

    // {
    //     title: "Action",
    //     key: "action",
    //     align: "center",
    //     render: (text, record) => (
    //       <Dropdown overlay={menu(record)} trigger={["click"]}>
    //         <Space size="middle">
    //           <AiOutlineMore style={{ fontSize: "1.2rem", cursor: "pointer" }} />
    //         </Space>
    //       </Dropdown>
    //     ),
    //   },
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
      setModalTitle(<EditRoleTitle />);
      setModalWidth(400);
      setModalContent(
        <EditRole
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          RoleDataObject={RoleDataObject}
          forceRefetch={forceRefetch}
       
          
        />
      );
    }
    else if (value == "add-role") {
      setIsModalVisible(true);
      setModalTitle(<AddRolesTitle />);
        setModalWidth(400);
        setModalContent(<AddRoles setIsModalVisible={setIsModalVisible} jwt={jwt} RoleDataObject={RoleDataObject}
          forceRefetch={forceRefetch}
          />)
    }
    else if (value == "add-permission") {
      setIsModalVisible(true);
      // setModalTitle(<AddPermissionTitle />);
      setModalWidth(800);
      setModalContent(
        <AddPermission
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
        
          RoleDataObject={RoleDataObject}
          // RoleWithPermissionsDataObject={RoleWithPermissionsDataObject}
          forceRefetch={forceRefetch}
          permissionData={permissionData}
          
        />
      );
    } 

    else if (value == "edit-permission") {
      setIsModalVisible(true);
      // setModalTitle(<EditPermissionTitle />);
      setModalWidth(800);
      setModalContent(
        <EditPermission
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          forceRefetch={forceRefetch}
          RoleDataObject={RoleDataObject}
          permissionData={permissionData}
          // RoleWithPermissionsDataObject={RoleWithPermissionsDataObject}
    
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

  const AddRolesTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700}}>
    <h6>Create New Role</h6>
    </div>
  )

  const EditRoleTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Role Details</h6>
    </div>
  );

  const AddPermissionTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Add Permission</h6>
    </div>
  );
  const EditPermissionTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Edit Permission</h6>
    </div>
  );

  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_ROLE, record?.id, jwt)
      .then(async (res) => {
        handleRequestResponse(res);
        await forceRefetch();

      })
      .catch((err) => {
        handleRequestError(err);
      });
  };


  const handleStatus = (record) => {
    let data = {
      status: record?.status == 1 ? 0 : 1
    }
    updateRequest(URL_UPDATE_ROLE_STATUS, record?.id, { ...data }, jwt)
      .then(async (res) => {
        handleRequestResponse(res);
        await forceRefetch();

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
            Manage Staff
          </h3>
          <Button 
            {...BUTTON_CONFIGS.ADD_BUTTON()}
            onClick={() => showModal("add-role", null)} 
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
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Add Role
          </Button>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
          <UserTableStyleWrapper>
          <TableWrapper>
          <Table
             ClassName="table-striped-rows "
            dataSource={qryData}
            loading={isLoading}
            columns={mergedColumns}
            pagination={false}


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

export default RoleTable;
