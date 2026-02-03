import React from 'react'
import  { useState } from 'react'
import ReviewTable from './components/ReviewTable'
import {URL_GET_ALL_REVIEWS } from "@/config/api-paths";
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';


const index = (props) => {
  let{session} = props;
  let jwt = session?.jwt;

  const ReviewsDataObject = usePaginateQuery({
    url: URL_GET_ALL_REVIEWS,
    jwt: jwt,
    tableKey : "Product",
    filter : ''
  })

  return (
    <>
    <div>
    <div className="page-header">
  <div className="row align-items-center">
    <div className="col">
      <h3 className="page-title">Reviews Report</h3>
      <ul className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">Reviews</li>
      </ul>
    </div>
    <div className="col-auto float-end ms-auto">
    <div className='submit-button'>
  
    </div>
   
    </div>
  </div>
</div>





<div className="row">
  <div className="col-md-12 d-flex">
<ReviewTable ReviewsDataObject={ReviewsDataObject} jwt={jwt}/>
  </div>
  
</div>



            </div>


          
    </>
  )
}

export default index