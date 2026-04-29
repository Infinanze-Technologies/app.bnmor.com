import React from 'react'
import { URL_GET_ENTITIES } from "@/config/api-paths";
import EntityTable from './components/EntityTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const EntityDataObject = usePaginateQuery({
    url: URL_GET_ENTITIES,
    jwt: jwt,
    tableKey: "Entities",
    filter : ''

  })




  


  return (
    <>
      <div>
  
        
        <div className="d-flex justify-content-center pt-5">
        <div className="col-md-12">
            <EntityTable jwt={jwt} EntityDataObject={EntityDataObject}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default index
