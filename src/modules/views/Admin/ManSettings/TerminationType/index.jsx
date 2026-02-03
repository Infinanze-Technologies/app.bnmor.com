import React from 'react'
import {URL_GET_ATTRIBUTES } from "@/config/api-paths";
import TerminationTypeTable from './components/TerminationTypeTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import ManagementSettingsTabsWrapper from '@/components/ManagementSettingsTabsWrapper';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AttributesDataObject = usePaginateQuery({
    url: URL_GET_ATTRIBUTES,
    jwt: jwt,
    tableKey  : "TerminationType",
    filter : '?attribute_type=Termination Type'

  })




  



  return (
    <>
    <div>


<ManagementSettingsTabsWrapper activeKey="terminationType" />

<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<TerminationTypeTable jwt={jwt} AttributesDataObject={AttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index