import React from 'react'
import  { useState } from 'react'
import ModalComponent from "@/components/ModalComponent";
import {Button } from 'antd'
import AddProperty from './conponents/AddProperty';
import {URL_GET_PROPERTIES} from "@/config/api-paths";
import PropertiesTable from './conponents/PropertiesTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';

const index = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [filterUserData, setfilterUserData] = useState('ALL');
  const [loading, setLoading] = useState(false);
  
  let jwt = props?.session?.jwt;

  const PropertiesDataObject = usePaginateQuery({
    url: URL_GET_PROPERTIES,
    jwt: jwt,
    tableKey : "Properties",
    filter : `?${filterUserData}`
  })






  // console.log(RoleDataObject);
  

  const handleCancel = () => {
    setIsModalVisible(false);
  };








  return (
    <>
    <div>
   






<div className="row">
  <div className="col-md-12 d-flex">
<PropertiesTable PropertiesDataObject={PropertiesDataObject} jwt={jwt} setLoading={setLoading} loading={loading} setfilterUserData={setfilterUserData}/>
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