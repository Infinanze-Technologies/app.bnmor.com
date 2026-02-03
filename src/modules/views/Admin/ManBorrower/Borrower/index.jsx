import React from 'react'
import  { useState } from 'react'
import ModalComponent from "@/components/ModalComponent";
import {Button } from 'antd'
import AddBorrower from './conponents/AddBorrower';
import {URL_GET_BORROWER,URL_GET_MEMBER_TYPES, URL_GET_Qry_BRANCH } from "@/config/api-paths";
import BorrowerTable from './conponents/BorrowerTable';
import { URL_GET_MEMBER_TYPES_BORROWER } from "@/config/api-paths";
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import useGetEntity from '@/hooks/useGetEntity';
import UsersData from "@/components/json/users.json"
import Link from 'next/link';
import { ADD_BORROWER_PAGE } from '@/config/page-routes';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [filterUserData, setfilterUserData] = useState('ALL');
  const [loading, setLoading] = useState(false);
  
  let jwt = props?.session?.jwt;

  const BorrowerDataObject = usePaginateQuery({
    url: URL_GET_BORROWER,
    jwt: jwt,
    tableKey : "Borrower",
    filter : `?${filterUserData}`
  })



  const QryBranchDataObject = useSelectQuery({
    url: URL_GET_Qry_BRANCH,
    jwt: jwt,
    tableKey  : "QryBranch",
    filter : ''

  });




  const RoleDataObject = useGetEntity({
    url :URL_GET_MEMBER_TYPES_BORROWER,
    jwkToken:jwt
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
<BorrowerTable BorrowerDataObject={BorrowerDataObject} QryBranchDataObject={QryBranchDataObject} jwt={jwt} RoleDataObject={RoleDataObject} UsersData={UsersData} setLoading={setLoading} loading={loading} setfilterUserData={setfilterUserData}/>
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