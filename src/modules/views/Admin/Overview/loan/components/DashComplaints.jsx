import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { 
  PAGE_COMPLAINT,
} from "@/config/page-routes"
import Link from 'next/link'
const DashComplaints = (props) => {
  let {DashComplaintsDataObject} = props
  let {
      loading,
      data
    } = DashComplaintsDataObject;
  return (
    <>
        <div className="card card-table flex-fill">
      <div className="card-header">
        <h3 className="card-title mb-0">Complaint</h3>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table custom-table mb-0">
            <thead>
              <tr>
             
              <th className="text-left">Complaint Type</th>
                <th className="text-left">Complaint Content</th>
                <th className="text-left">Complaint From</th>
                <th className="text-left">Prodcut</th>
              </tr>
            </thead>
            <tbody>
           
            {loading && (
                    <>
                      {[1, 2, 3].map((key) => (
                        <>

                          <tr key={key}>
                            <td>
                            <Skeleton /> 
                            </td>
                            <td>
                              <Skeleton />
                            </td>
                            <td>
                              <Skeleton />
                            </td>
                            <td>
                              <Skeleton />
                            </td>
                            
                        
                          </tr>

                        </>
                      )
                      )}
                    </>
                  )}

                  {data?.data &&
                    data?.data?.items?.map((item, index) => (
                      <>

                        <tr key={index}>

                        <td>
                {item?.complaint_type}
                </td>
               
                <td>
                {item?.complaint_despt}
                </td>
                     
                <td>
                {item?.customer?.[0]?.first_name +' '+ item?.customer?.[0]?.last_name}
                  </td>

                  <td>
                  <a style={{ cursor:"pointer"}}>
                  {item?.product?.[0]?.pro_name}
                  </a>
                
                  </td>

                

                        </tr>

                      </>
                    ))}

            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer">
      <Link href={PAGE_COMPLAINT}>
      <span style={{ cursor:"pointer" }}>View all Complaints</span>
      </Link>
       
      </div>


      
    </div>
    </>
  )
}

export default DashComplaints