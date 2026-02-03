import React from 'react'
import {URL_GET_ATTRIBUTES } from "@/config/api-paths";
import IncomeTypeTable from './components/IncomeTypeTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import ManagementSettingsTabsWrapper from '@/components/ManagementSettingsTabsWrapper';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AttributesDataObject = usePaginateQuery({
    url: URL_GET_ATTRIBUTES,
    jwt: jwt,
    tableKey  : "IncomeType",
    filter : '?attribute_type=Income Type'

  })




  



  return (
    <>
    <div>


<ManagementSettingsTabsWrapper activeKey="incomeType" />

<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<IncomeTypeTable jwt={jwt} AttributesDataObject={AttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index