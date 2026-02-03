import React from 'react'
import  { useState } from 'react'
import ModalComponent from "@/components/ModalComponent";
import {Button } from 'antd'
import AddGuarantor from './conponents/AddGuarantor';
import {URL_GET_GUARANTOR,URL_GET_MEMBER_TYPES, URL_GET_Qry_BRANCH } from "@/config/api-paths";
import GuarantorTable from './conponents/GuarantorTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import useGetEntity from '@/hooks/useGetEntity';
import UsersData from "@/components/json/users.json"
import Link from 'next/link';
import { ADD_GUARANTOR_PAGE } from '@/config/page-routes';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {
  const [filterUserData, setfilterUserData] = useState('ALL');
  const [loading, setLoading] = useState(false);
  
  let jwt = props?.session?.jwt;

  const GuarantorDataObject = usePaginateQuery({
    url: URL_GET_GUARANTOR,
    jwt: jwt,
    tableKey : "Guarantor",
    filter : `?${filterUserData}`
  })

  const QryBranchDataObject = useSelectQuery({
    url: URL_GET_Qry_BRANCH,
    jwt: jwt,
    tableKey  : "QryBranch",
    filter : ''

  });




  return (
    <>
    <div>
 
<div className="row">
  <div className="col-md-12 d-flex">
<GuarantorTable 
  AdminDataObject={GuarantorDataObject} 
  jwt={jwt} 
  QryBranchDataObject={QryBranchDataObject} 
  UsersData={UsersData} 
  setLoading={setLoading} 
  loading={loading} 
  setfilterUserData={setfilterUserData}
  forceRefetch={GuarantorDataObject?.refetch}
/>
  </div>
</div>

            </div>

         
    </>
  )
}

export default index 