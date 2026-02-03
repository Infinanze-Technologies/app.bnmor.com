
import React from 'react'
import  { useState } from 'react'
import {URL_GET_CATEGORIES_WITH_SUB } from "@/config/api-paths";
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import UsersReport from './component/UsersCsvReport';

const index = (props) => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");
  const [filterUserData, setfilterUserData] = useState('ALL');
  let jwt = props?.session?.jwt;

  const CatgoryDataObject = usePaginateQuery({
    url: URL_GET_CATEGORIES_WITH_SUB,
    jwt: jwt,
    tableKey : "Category",
    filter : `?status=${filterUserData == 'ALL' ? '' : filterUserData}`
  })




  return (
    <>
 <UsersReport CatgoryDataObject={CatgoryDataObject} jwt={jwt}/>


        
    </>
  )
}

export default index