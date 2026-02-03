import React from 'react'
import {URL_GET_GROUP,URL_GET_Qry_BRANCH } from "@/config/api-paths";
import GroupTable from './components/GroupTable';
import usePaginateQuery from '@/hooks/ReactQuery/usePagination';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';

const index = (props) => {

  let jwt = props?.session?.jwt;


  const AttributesDataObject = usePaginateQuery({
    url: URL_GET_GROUP,
    jwt: jwt,
    tableKey  : "Group",
    filter : ''

  })





  const QryBranchDataObject = useSelectQuery({
    url: URL_GET_Qry_BRANCH,
    jwt: jwt,
    tableKey  : "QryBranch",
    filter : ''

  });





  return (
    <>
    <div>


<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<GroupTable jwt={jwt} AttributesDataObject={AttributesDataObject} QryBranchDataObject={QryBranchDataObject}/>
  </div>


  
</div>



            </div>


    </>
  )
}

export default index