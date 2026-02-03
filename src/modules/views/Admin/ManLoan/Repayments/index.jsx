import React from 'react'
import  { useState } from 'react'
import ModalComponent from "@/components/ModalComponent";

import {URL_GET_LOAN_REPAYMENTS } from "@/config/api-paths";
import RepaymentsTable from './conponents/RepaymentsTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import UsersData from "@/components/json/users.json"


const index = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [filterUserData, setfilterUserData] = useState('ALL');
  const [loading, setLoading] = useState(false);
  
  let jwt = props?.session?.jwt;

  const LoanRepaymentsDataObject = usePaginateQuery({
    url: URL_GET_LOAN_REPAYMENTS,
    jwt: jwt,
    tableKey : "LoanRepayments",
    filter : `?${filterUserData}`
  })



  

  const handleCancel = () => {
    setIsModalVisible(false);
  };








  return (
    <>
    <div>
   






<div className="row">
  <div className="col-md-12 d-flex">
<RepaymentsTable LoanRepaymentsDataObject={LoanRepaymentsDataObject} jwt={jwt} UsersData={UsersData} setLoading={setLoading} loading={loading} setfilterUserData={setfilterUserData}/>
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