import React from 'react'
import {URL_GET_CATEGORY } from "@/config/api-paths";
import CategoryTable from './components/CategoryTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const CategoryDataObject = usePaginateQuery({
    url: URL_GET_CATEGORY,
    jwt: jwt,
    tableKey  : "Category",
    filter : ''

  })




  



  return (
    <>
      <div>
        {/* Category Table Content */}
        <div className="row">
          <div className="col-md-12 d-flex">
            <CategoryTable jwt={jwt} CategoryDataObject={CategoryDataObject}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default index