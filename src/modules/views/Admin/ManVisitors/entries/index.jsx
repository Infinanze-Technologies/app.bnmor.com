import React from 'react'
import { useState } from 'react'
import ModalComponent from "@/components/ModalComponent";
import { URL_GET_VISITOR_ENTRIES, URL_GET_Qry_BRANCH, URL_GET_VISITOR_GUESTS, URL_GET_EMPLOYEES, URL_GET_DEPARTMENTS, URL_GET_Qry_DEPARTMENT, URL_SHOW_VISITOR_HOSTS, URL_SHOW_VISITOR_ALL_HOSTS } from "@/config/api-paths";
import EntryTable from './conponents/EntryTable';
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

  const EntriesDataObject = usePaginateQuery({
    url: URL_GET_VISITOR_ENTRIES,
    jwt: jwt,
    tableKey: "Entries",
    filter: `?${filterUserData}`
  });

  const QryBranchDataObject = useSelectQuery({
    url: URL_GET_Qry_BRANCH,
    jwt: jwt,
    tableKey: "QryBranch",
    filter: ''
  });



  const HostsDataObject = useSelectQuery({
    url: URL_SHOW_VISITOR_ALL_HOSTS,
    jwt: jwt,
    tableKey  : "VisitorHosts",
    filter : ''

  })

  const DepartmentsDataObject = useSelectQuery({
    url: URL_GET_Qry_DEPARTMENT,
    jwt: jwt,
    tableKey: "Departments",
    filter: ''
  });

  const ActiveVisitorsDataObject = useSelectQuery({
    url: URL_SHOW_VISITOR_HOSTS,
    jwt: jwt,
    tableKey: "ActiveVisitors",
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
            <EntryTable 
              EntriesDataObject={EntriesDataObject} 
              QryBranchDataObject={QryBranchDataObject} 
              ActiveVisitorsDataObject={ActiveVisitorsDataObject}
              HostsDataObject={HostsDataObject}
              DepartmentsDataObject={DepartmentsDataObject}
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