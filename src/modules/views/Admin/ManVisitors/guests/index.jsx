import React from 'react'
import { useState } from 'react'
import ModalComponent from "@/components/ModalComponent";
import { URL_GET_VISITOR_GUESTS, URL_GET_Qry_BRANCH, URL_GET_ACTIVE_ORGANIZATIONS, URL_GET_EMPLOYEES, URL_GET_Qry_DEPARTMENT } from "@/config/api-paths";
import GuestTable from './conponents/GuestTable';
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

  const GuestDataObject = usePaginateQuery({
    url: URL_GET_VISITOR_GUESTS,
    jwt: jwt,
    tableKey: "Guests",
    filter: `?${filterUserData}`
  });

  const QryBranchDataObject = useSelectQuery({
    url: URL_GET_Qry_BRANCH,
    jwt: jwt,
    tableKey: "QryBranch",
    filter: '',
    enabled: Boolean(jwt) // Only fetch when JWT is available
  });

  // Fetch active organizations
  const ActiveOrganizationsDataObject = useSelectQuery({
    url: URL_GET_ACTIVE_ORGANIZATIONS,
    jwt: jwt,
    tableKey: "ActiveOrganizations",
    filter: '',
    enabled: Boolean(jwt) // Only fetch when JWT is available
  });

  // Fetch hosts for AddEntry component
  const HostsDataObject = useSelectQuery({
    url: URL_GET_EMPLOYEES,
    jwt: jwt,
    tableKey: "Hosts",
    filter: '',
    enabled: Boolean(jwt)
  });

  // Fetch departments for AddEntry component
  const DepartmentsDataObject = useSelectQuery({
    url: URL_GET_Qry_DEPARTMENT,
    jwt: jwt,
    tableKey: "Departments",
    filter: '',
    enabled: Boolean(jwt)
  });


  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Utility functions for data refresh
  const refreshAllData = () => {
    // Refresh all data sources
    GuestDataObject.refetch();
    QryBranchDataObject.refetch();
    ActiveOrganizationsDataObject.refetch();
    HostsDataObject.refetch();
    DepartmentsDataObject.refetch();
  };

  const refreshOrganizations = () => {
    ActiveOrganizationsDataObject.refetch();
  };

  const refreshBranches = () => {
    QryBranchDataObject.refetch();
  };

  return (
    <>
      <div>
        <div className="row">
          <div className="col-md-12 d-flex">
              <GuestTable 
              GuestDataObject={GuestDataObject} 
              QryBranchDataObject={QryBranchDataObject} 
              ActiveOrganizationsDataObject={ActiveOrganizationsDataObject}
              HostsDataObject={HostsDataObject}
              DepartmentsDataObject={DepartmentsDataObject}
              refreshAllData={refreshAllData}
              refreshOrganizations={refreshOrganizations}
              refreshBranches={refreshBranches}
              jwt={jwt} 
              setLoading={setLoading} 
              loading={loading} 
              setfilterUserData={setfilterUserData}
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