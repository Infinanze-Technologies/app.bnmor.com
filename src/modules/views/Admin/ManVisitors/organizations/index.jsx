import React from 'react'
import { useState } from 'react'
import ModalComponent from "@/components/ModalComponent";
import { URL_GET_VISITOR_ORGANIZATIONS, URL_GET_Qry_BRANCH } from "@/config/api-paths";
import OrganizationTable from './conponents/OrganizationTable';
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

  const OrganizationDataObject = usePaginateQuery({
    url: URL_GET_VISITOR_ORGANIZATIONS,
    jwt: jwt,
    tableKey: "Organizations",
    filter: `?${filterUserData}`
  });

  const QryBranchDataObject = useSelectQuery({
    url: URL_GET_Qry_BRANCH,
    jwt: jwt,
    tableKey: "QryBranch",
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
              <OrganizationTable 
              OrganizationDataObject={OrganizationDataObject} 
              QryBranchDataObject={QryBranchDataObject} 
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