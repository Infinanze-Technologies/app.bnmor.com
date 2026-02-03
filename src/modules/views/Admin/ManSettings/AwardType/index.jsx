import React from 'react'
import {URL_GET_ATTRIBUTES } from "@/config/api-paths";
import AwardTypeTable from './components/AwardTypeTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import ManagementSettingsTabsWrapper from '@/components/ManagementSettingsTabsWrapper';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AttributesDataObject = usePaginateQuery({
    url: URL_GET_ATTRIBUTES,
    jwt: jwt,
    tableKey  : "AwardTypes",
    filter : '?attribute_type=Award Type'

  })




  



  return (
    <>
    <div>


<ManagementSettingsTabsWrapper activeKey="awardType" />

<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<AwardTypeTable jwt={jwt} AttributesDataObject={AttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index