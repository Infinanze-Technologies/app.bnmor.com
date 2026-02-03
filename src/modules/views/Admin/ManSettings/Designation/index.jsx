import React from 'react'
import {URL_GET_DESIGNATION,URL_GET_Qry_DEPARTMENT } from "@/config/api-paths";
import DesignationTable from './components/DesignationTable';
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';
import ManagementSettingsTabsWrapper from '@/components/ManagementSettingsTabsWrapper';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const DesignationDataObject = useFetchQuery({
    url: URL_GET_DESIGNATION,
    jwt: jwt,
    tableKey  : "Department",
    filter : ''

  })


  const QryDepartmentDataObject = useSelectQuery({
    url: URL_GET_Qry_DEPARTMENT,
    jwt: jwt,
    tableKey  : "QryDepartment",

  })

  




  return (
    <>
    <div>
<ManagementSettingsTabsWrapper activeKey="designation" />


<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<DesignationTable jwt={jwt} DesignationDataObject={DesignationDataObject } QryDepartmentDataObject={QryDepartmentDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index