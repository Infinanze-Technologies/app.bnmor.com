import React from 'react'
import {URL_GET_Announcement, URL_GET_EMP_Announcement, URL_GET_Qry_BRANCH } from "@/config/api-paths";
import useFetchQuery from '@/hooks/ReactQuery/useFetchQuery';
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';
import AnnouncementTable from './components/AnnouncementTable';

const index = (props) => {

  let jwt = props?.session?.jwt;
  let employee_id = props?.session?.user?.employee_id

  const AnnouncementDataObject = useFetchQuery({
    url: URL_GET_EMP_Announcement,
    jwt: jwt,
    tableKey  : "Announcement",
    filter : ''

  })


  const QryBranchDataObject = useSelectQuery({
    url: URL_GET_Qry_BRANCH,
    jwt: jwt,
    tableKey  : "QryBranch",
    filter : ''

  });

  
  // URL_GET_QRY_ATTRIBUTE





  return (
    <>
    <div>


<div className="d-flex justify-content-center pt-5">
  <div className="col-md-12">
<AnnouncementTable jwt={jwt} AnnouncementDataObject={AnnouncementDataObject } QryBranchDataObject={QryBranchDataObject}/>
  </div>

</div>



            </div>


    </>
  )
}

export default index