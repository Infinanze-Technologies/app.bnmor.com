import React from 'react'
import Skeleton from 'react-loading-skeleton'
// import { 
//   PAGE_ALL_CAT_WITH_PRODUCT,
// } from "@/config/page-routes"
import Link from 'next/link'
const DashCategory = (props) => {
  let {ProductCountDataObject} = props
  let {
      loading,
      data
    } = ProductCountDataObject;
    // console.log(data?.data?.items)
  return (
    <>
        <div className="card card-table flex-fill">
      <div className="card-header">
        <h3 className="card-title mb-0">Room Types</h3>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table custom-table mb-0">
            <thead>
              <tr>
              <th className="text-left">Title</th>
                <th className="text-left">Keyword</th>
                <th className="text-center">Number Of Product</th>
                {/* <th className="text-left">On Prodcut</th> */}
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
                {item?.title}
                </td>
               
                <td>
                {item?.keyword}
                </td>
                     
                <td className="text-center">
                {item?.product__cat_count}
                  </td>

               
                

                        </tr>

                      </>
                    ))}

            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer">
      {/* <Link href={PAGE_ALL_CAT_WITH_PRODUCT}>
      <span style={{ cursor:"pointer" }}>View all</span>
      </Link> */}
      <span style={{ textAlign:'left', fontSize:'1rem' }}>
                          No Data Found
                          </span>
      </div>


      
    </div>
    </>
  )
}

export default DashCategory