import React from 'react'
import {URL_GET_ATTRIBUTES } from "@/config/api-paths";
import PayslipTable from './components/PayslipTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import ManagementSettingsTabsWrapper from '@/components/ManagementSettingsTabsWrapper';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AttributesDataObject = usePaginateQuery({
    url: URL_GET_ATTRIBUTES,
    jwt: jwt,
    tableKey  : "PayslipType",
    filter : '?attribute_type=Payslip Type'

  })




  



  return (
    <>
    <div>


<ManagementSettingsTabsWrapper activeKey="payslipType" />

<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<PayslipTable jwt={jwt} AttributesDataObject={AttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index