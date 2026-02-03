import React from 'react'
import  { useState } from 'react'
import AdsTable from './conponents/AdsTable'
import FilterOptions from './conponents/FilterOptions';
import {URL_GET_ALL_ADS_REPROT } from "@/config/api-paths";
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';


const index = (props) => {
  let{session} = props;
  let jwt = session?.jwt;
  const [stateDate, setstateDate] = useState('')
  const [endDate, setendDate] = useState('')

  const ProductDataObject = usePaginateQuery({
    url: URL_GET_ALL_ADS_REPROT,
    jwt: jwt,
    tableKey : "AdsReport",
    filter : `?start_date=${stateDate}&end_date=${endDate}`
  })



  return (
    <>
    <div>
    <div className="page-header">
  <div className="row align-items-center">
    <div className="col">
      <h3 className="page-title">Ads Report</h3>
      <ul className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">Report</li>
      </ul>
    </div>
    <div className="col-auto float-end ms-auto">
    <div className='submit-button'>
  
    </div>
   
    </div>
  </div>
</div>


<div className="row filter-row pb-3">
  
 
<FilterOptions setstateDate={setstateDate} setendDate={setendDate}/>



</div>



<div className="row">
  <div className="col-md-12 d-flex">
<AdsTable ProductDataObject={ProductDataObject} jwt={jwt}/>
  </div>
  
</div>



            </div>



          
    </>
  )
}

export default index