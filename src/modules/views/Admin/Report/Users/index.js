import React from 'react'
import  { useState } from 'react'

import {Button } from 'antd'
import FilterOptions from './component/FilterOptions.jsx';
import {URL_GET_ALL_CLIENT_REPORT } from "@/config/api-paths";
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import UsersReport from './component/UsersReport.jsx';

const index = (props) => {
  let{session} = props;

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('ALL');
  const [stateDate, setstateDate] = useState('')
  const [endDate, setendDate] = useState('')
  let jwt = session?.jwt;

  const CustomerDataObject = usePaginateQuery({
    url: URL_GET_ALL_CLIENT_REPORT,
    jwt: jwt,
    tableKey : "ClientReport",
    filter : `?status=${filterStatus == 'ALL' ? '' : typeof(filterStatus) == 'undefined' ? '' : filterStatus}&search=${search == 'ALL' ? '' : search}&start_date=${stateDate}&end_date=${endDate}`
  })

  

  





  return (
    <>
    <div>
    <div className="page-header">
  <div className="row align-items-center">
    <div className="col">
      <h3 className="page-title">Clients Report</h3>
      <ul className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">Clients</li>
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
  
 
<FilterOptions setFilterStatus={setFilterStatus} setSearch={setSearch} setstateDate={setstateDate} setendDate={setendDate}/>



</div>



<div className="row">
  <div className="col-md-12 d-flex">
<UsersReport CustomerDataObject={CustomerDataObject} />
  </div>
  
</div>



            </div>


    </>
  )
}

export default index