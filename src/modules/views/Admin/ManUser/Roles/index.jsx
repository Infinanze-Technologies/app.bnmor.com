import React from 'react'
import  { useState } from 'react'
import ModalComponent from "@/components/ModalComponent";
import {Button } from 'antd'
 import AddRoles from './components/man_roles/AddRoles';
import {URL_GET_ROLES_WITH_PERMISSIONS,URL_GET_ALL_ROLES, URL_GET_APP_MODULES } from "@/config/api-paths";
 import RoleTable from './components/man_roles/RoleTable';

import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;

  

  const RoleDataObject = useFetchQuery({
    url: URL_GET_ALL_ROLES,
    jwt: jwt,
    tableKey  : "Roles",
    filter : ''

  })
  let {
    isLoading,
    refetch,
    forceRefetch
  
  } = RoleDataObject;

  let qryData = RoleDataObject?.data?.roles
  let permissionData = RoleDataObject?.data?.permissions


  // console.log("Permission Data",permissionData);

  






  return (
    <>
    <div>





<div className="row">
  <div className="col-md-12 d-flex">
<RoleTable RoleDataObject={RoleDataObject} jwt={jwt} qryData={qryData} forceRefetch={forceRefetch} isLoading={isLoading} permissionData={permissionData} />
  </div>

  
</div>



            </div>



    </>
  )
}

export default index