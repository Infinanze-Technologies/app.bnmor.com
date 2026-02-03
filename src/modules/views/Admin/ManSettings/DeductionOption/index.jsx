import React from 'react'
import {URL_GET_ATTRIBUTES } from "@/config/api-paths";
import DeductionOptionTable from './components/DeductionOptionTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import ManagementSettingsTabsWrapper from '@/components/ManagementSettingsTabsWrapper';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AttributesDataObject = usePaginateQuery({
    url: URL_GET_ATTRIBUTES,
    jwt: jwt,
    tableKey  : "DeductionOption",
    filter : '?attribute_type=Deduction Option'

  })




  



  return (
    <>
    <div>
<ManagementSettingsTabsWrapper activeKey="deductionOption" />

<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<DeductionOptionTable jwt={jwt} AttributesDataObject={AttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index