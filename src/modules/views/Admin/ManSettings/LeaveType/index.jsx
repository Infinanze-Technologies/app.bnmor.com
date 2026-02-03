import React from 'react'
import {URL_GET_ATTRIBUTES } from "@/config/api-paths";
import LeaveTypeTable from './components/LeaveTypeTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import ManagementSettingsTabsWrapper from '@/components/ManagementSettingsTabsWrapper';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AttributesDataObject = usePaginateQuery({
    url: URL_GET_ATTRIBUTES,
    jwt: jwt,
    tableKey  : "LeaveType",
    filter : '?attribute_type=Leave Type'

  })




  



  return (
    <>
    <div>


<ManagementSettingsTabsWrapper activeKey="leaveType" />

<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<LeaveTypeTable jwt={jwt} AttributesDataObject={AttributesDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index