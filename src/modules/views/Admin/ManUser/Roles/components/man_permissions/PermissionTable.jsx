import React, { useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Typography, Spin } from "antd";
import ModalComponent from "@/components/ModalComponent";
import { HiDotsVertical } from "react-icons/hi";
import AddPermission from "./AddPermission";
import EditPermission from "./EditPermission";
import { URL_DELETE_ROLE, URL_UPDATE_ROLE_STATUS,URL_GET_ALL_PERMISSION,URL_GET_ALL_PERMISSION_FOR_EDIT, URL_GET_APP_MODULES} from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import { deleteRequest, updateRequest } from "@/hooks/apiService";
import Skeleton from 'react-loading-skeleton'
import useCreatePermission from "@/store/AllPermissionStore";
import useEditPermission from "@/store/EditPermissionStore";
import { useEffect } from "react";
// import Image from "next/image";

const PermissionTable = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { RoleWithPermissionsDataObject, jwt } = props;

  let {
    loading,
    refetchEntity,
    data
  
  } = RoleWithPermissionsDataObject;

   const {fetch }  = useCreatePermission((state) => state)
  // const {fetchPerm,Permz }  = useEditPermission((state) => state)

  useEffect(() => {
   fetch(URL_GET_APP_MODULES,jwt)

  }, []);

  useEffect(() => {
    fetchPerm(URL_GET_ALL_PERMISSION_FOR_EDIT,jwt)
 
   }, []);

//   console.log(Permz)

  const showModal = (value, record) => {
    if (value == "add") {
        setIsModalVisible(true);
        setModalTitle(<AddPermissionsTitle />);
        setModalWidth(1200);
        setModalContent(
          <AddPermission
            setIsModalVisible={setIsModalVisible}
            jwt={jwt}
            record={record}
            RoleWithPermissionsDataObject={RoleWithPermissionsDataObject}
            
          />
        );
      }
    else if (value == "edit") {
      setIsModalVisible(true);
      setModalTitle(<EditPermissionTitle />);
      setModalWidth(1200);
      setModalContent(
        <EditPermission
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
          record={record}
          RoleWithPermissionsDataObject={RoleWithPermissionsDataObject}
        />
      );
    } else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const EditPermissionTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
        <h6>Edit Permission Details</h6>
    </div>
  );

  const AddPermissionsTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>Create New Permission</h6>
    </div>
  );


  const handleDelete = (record) => {
    deleteRequest(URL_DELETE_ROLE, record?.id, jwt)
      .then((res) => {
        handleRequestResponse(res);
        refetchEntity();
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
      .then((res) => {
        handleRequestResponse(res);
        refetchEntity();
      })
      .catch((err) => {
        handleRequestError(err);
      });
  };

//   const menu = (record) => (
//     <Menu>
//       <Menu.Item key="1">
//         <a onClick={() => showModal("edit", record)}>Edit</a>
//       </Menu.Item>

//       <Menu.Item key="3">
//         <Popconfirm
//           title="Are you sure？"
//           okText="Yes"
//           cancelText="No"
//           onConfirm={() => handleDelete(record)}
//         >
//           <a>Delete</a>
//         </Popconfirm>
//       </Menu.Item>
//     </Menu>
//   );

  return (
    <>
      <div className="card card-table flex-fill">
        <div className="card-header">
          <h3 className="card-title mb-0">Manage Permissions</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <Spin spinning={loading}>
              <table className="table custom-table mb-0">
                <thead>
                  <tr>
                    <th className="text-left">Permission Name</th>
                  
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>

                 

                  {
                  data?.data?.items?.map((item, index) => (
                      <>

                        <tr key={index}>
                         

                        <td className="text-left">

                            <a> {item?.name} </a>
                          </td>
                         <td className="text-center">
                            {item?.permissions?.length == 0 ?
                            (
                                <>
                                <Typography.Link
                className="mr-2" style={{ color : "red" }}
                // disabled={editingKey !== ""}
                // onClick={() => edit(record)}
                onClick={() =>showModal("add",item)}
              >
                Assign Permission
              </Typography.Link>
                                </>
                            )
                            :
                            (
                                <>
                              

                  <Typography.Link
                            className="mr-2 edit"
                             onClick={() => showModal('edit',item)}
                          >
                            Edit Permission
                          </Typography.Link>
                                </>
                            )
                            }
                          </td>

                        
                        
                        </tr>

                      </>
                    ))}

                </tbody>
              </table>
            </Spin>
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

export default PermissionTable;
