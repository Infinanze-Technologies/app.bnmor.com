import React from 'react'
import  { useState } from 'react'

import {Button } from 'antd'
import CustomersTable from './conponents/CustomersTable';
import FilterOptions from './conponents/FilterOptions';
import {URL_GET_ALL_CUSTOMTERS } from "@/config/api-paths";
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';

const index = (props) => {
  let{session} = props;

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('ALL');
  let jwt = session?.jwt;

  const CustomerDataObject = usePaginateQuery({
    url: URL_GET_ALL_CUSTOMTERS,
    jwt: jwt,
    tableKey : "Customers",
    filter : `?status=${filterStatus == 'ALL' ? '' : typeof(filterStatus) == 'undefined' ? '' : filterStatus}&search=${search == 'ALL' ? '' : search}`
  })

  

  





  return (
    <>
    <div>
    <div className="page-header">
  <div className="row align-items-center">
    <div className="col">
      <h3 className="page-title"> Manage Customers</h3>
      <ul className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">Customers</li>
      </ul>
    </div>
    <div className="col-auto float-end ms-auto">
    <div className='submit-button'>
    {/* <Button 
onClick={() =>showModal("add")}
      shape="round" 
    > 
    Create  Admin
    </Button> */}
    </div>
   
    </div>
  </div>
</div>


<div className="row filter-row">
  
 
<FilterOptions setFilterStatus={setFilterStatus} setSearch={setSearch}/>



</div>



<div className="row">
  <div className="col-md-12 d-flex">
<CustomersTable CustomerDataObject={CustomerDataObject} jwt={jwt}/>
  </div>
  
</div>



            </div>


    </>
  )
}

export default index