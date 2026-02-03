import React from 'react'
import {URL_GET_ATTRIBUTES } from "@/config/api-paths";
import AllowanceOptionTable from './components/AllowanceOptionTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import ManagementSettingsTabsWrapper from '@/components/ManagementSettingsTabsWrapper';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AttributesDataObject = usePaginateQuery({
    url: URL_GET_ATTRIBUTES,
    jwt: jwt,
    tableKey  : "Attributes",
    filter : '?attribute_type=Allowance Option'

  })




  



  return (
    <>
    <div>


<ManagementSettingsTabsWrapper activeKey="allowanceOption" />

<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<AllowanceOptionTable jwt={jwt} AttributesDataObject={AttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index