import React from 'react'
import NewItemsTable from './conponents/NewItemsTable'
// import FilterOptions from './conponents/FilterOptions';
import {URL_GET_ALL_NEW_ITEMS_REPORT } from "@/config/api-paths";
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';


const index = (props) => {
  let{session} = props;
  let jwt = session?.jwt;
  // const [filterStatus, setFilterStatus] = useState('ALL');
  // const [search, setSearch] = useState('ALL');

  const ProductDataObject = usePaginateQuery({
    url: URL_GET_ALL_NEW_ITEMS_REPORT,
    jwt: jwt,
    tableKey : "NewProduct",
    filter : ``
  })



  return (
    <>
    <div>
    <div className="page-header">
  <div className="row align-items-center">
    <div className="col">
      <h3 className="page-title">New Items</h3>
      <ul className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">Ads</li>
      </ul>
    </div>
    <div className="col-auto float-end ms-auto">
    <div className='submit-button'>
  
    </div>
   
    </div>
  </div>
</div>


{/* <div className="row filter-row">
  
 
<FilterOptions setFilterStatus={setFilterStatus} setSearch={setSearch}/>



</div> */}



<div className="row">
  <div className="col-md-12 d-flex">
<NewItemsTable ProductDataObject={ProductDataObject} jwt={jwt}/>
  </div>
  
</div>



            </div>



          
    </>
  )
}

export default index