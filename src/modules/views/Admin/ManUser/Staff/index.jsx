import React from 'react'
import { useState } from 'react'
import ModalComponent from "@/components/ModalComponent";
import { Button } from 'antd'
import AddStaff from './conponents/AddStaff';
import { URL_GET_EMPLOYEES, URL_GET_ALL_EMP_ROLES, URL_GET_Qry_BRANCH, URL_ACTIVE_DESIGNATION, URL_GET_Qry_DEPARTMENT } from "@/config/api-paths";
import StaffTable from './conponents/StaffTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';
import { PlusOutlined } from '@ant-design/icons';

const index = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [filterUserData, setfilterUserData] = useState('');
  const [loading, setLoading] = useState(false);
  
  let jwt = props?.session?.jwt;

  const StaffDataObject = usePaginateQuery({
    url: URL_GET_EMPLOYEES,
    jwt: jwt,
    tableKey: "Staff",
    filter: `?${filterUserData}`
  });

  const QryBranchDataObject = useSelectQuery({
    url: URL_GET_Qry_BRANCH,
    jwt: jwt,
    tableKey: "QryBranch",
    filter: ''
  });

  const RoleDataObject = useSelectQuery({
    url: URL_GET_ALL_EMP_ROLES,
    jwt: jwt,
    tableKey: "QryRoles",
    filter: ''
  });

  const ActiveDesignationDataObject = useSelectQuery({
    url: URL_ACTIVE_DESIGNATION,
    jwt: jwt,
    tableKey: "ActiveDesignation",
    filter: ''
  });

  const DepartmentsDataObject = useSelectQuery({
    url: URL_GET_Qry_DEPARTMENT,
    jwt: jwt,
    tableKey: "Departments",
    filter: ''
  });



  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div>
        <div className="row">
          <div className="col-md-12 d-flex">
            <StaffTable 
              StaffDataObject={StaffDataObject} 
              QryBranchDataObject={QryBranchDataObject} 
              jwt={jwt} 
              RoleDataObject={RoleDataObject} 
              setLoading={setLoading} 
              loading={loading} 
              setfilterUserData={setfilterUserData}
              DepartmentsDataObject={DepartmentsDataObject}
              ActiveDesignationDataObject={ActiveDesignationDataObject}
            />
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
  )
}

export default index