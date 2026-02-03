import React from 'react'
import {URL_GET_ATTRIBUTES } from "@/config/api-paths";
import PaymentTypeTable from './components/PaymentTypeTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import ManagementSettingsTabsWrapper from '@/components/ManagementSettingsTabsWrapper';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AttributesDataObject = usePaginateQuery({
    url: URL_GET_ATTRIBUTES,
    jwt: jwt,
    tableKey  : "PaymentType",
    filter : '?attribute_type=Payment Type'

  })




  



  return (
    <>
    <div>
<ManagementSettingsTabsWrapper activeKey="paymentType" />

<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<PaymentTypeTable jwt={jwt} AttributesDataObject={AttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index