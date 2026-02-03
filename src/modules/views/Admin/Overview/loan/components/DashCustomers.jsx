import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { 
    PAGE_USERS_STATUS,
} from "@/config/page-routes"
import Link from 'next/link'
import Image from 'next/image'
const DashCustomers = (props) => {
    let {DashCustomersDataObject} = props
    let localimagPath = process.env.NEXT_PUBLIC_PUBLIC_IMAGES;

    let {
        loading,
        data
      } = DashCustomersDataObject;
    return (
        <>
             <div className="card card-table flex-fill">
      <div className="card-header">
        <h3 className="card-title mb-0">All Customers</h3>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table custom-table table-nowrap mb-0">
            <thead>
              <tr>
              <th className="text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Status</th>
                {/* <th className="text-left">Address</th>
                <th className="text-left">Is Verify</th> */}
              </tr>
            </thead>
            <tbody>

            {loading && (
                    <>
                      {[1, 2, 3].map((key) => (
                        <>

                          <tr key={key}>
                            <td>
                              <h2 className="table-avatar">
                                <a className="avatar">
                                  <Skeleton height="30px" width="30px" borderRadius="50%" />
                                </a>
                                <a> <Skeleton width="100px" /> </a>
                              </h2>
                            </td>
                            <td>
                              <Skeleton />
                            </td>
                            <td>
                              <Skeleton />
                            </td>
                            {/* <td>
                              <Skeleton />
                            </td>
                            <td>
                              <Skeleton />
                            </td> */}
                           
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
                  <h2 className="d-flex">
                    <a>
                    {
                      item?.image == null &&
                      (
                        <>
                        <div className='logo-image'>

                        {

                        }
                     
                    <Image
                      layout="fill"
                      objectFit='contain'
                      placeholder='blur'
                      blurDataURL="/assets/img/user.jpg" 
                      src='/assets/img/user.jpg'
                      // className='rounded-full'
                       alt={item?.last_nam}/>
                  </div>
                      
                        </>
                      )
                    }

                    {
                      item?.image != null &&
                      (
                        <>
                        <div className='logo-image'>
                        {
                          item?.provider == 'local' 
                          &&(
                            <>
                            <Image
                      layout="fill"
                      objectFit='contain'
                      placeholder='blur'
                      blurDataURL={localimagPath+item?.image}
                      src={localimagPath+item?.image}
                       alt={item?.last_nam}/>
                            </>
                          )
                        }
                        {
                          item?.provider != 'local' 
                          &&(
                            <>
                            <Image
                      layout="fill"
                      objectFit='contain'
                      placeholder='blur'
                      blurDataURL={item?.image}
                      src={item?.image}
                       alt={item?.last_nam}/>
                            </>
                          )
                        }
                  </div>
                      
                        </>
                      )
                    }

                   
                    </a>
                    <a style={{ marginTop:"20px",marginLeft:"10px" }}>
                      {item?.first_name} <span>{item?.last_name}</span>
                    </a>
                  </h2>
                </td>

                <td>
                  <a
                  
                  >
                  
                  {item?.email}
                  </a>
                </td>
                <td>
                
                {
                  item?.status == 'active'
                  &&(
                    <>
                    <span className="active-status-color">
                                  Active
                                </span>
                    </>
                  )

                }

                {
                  item?.status == 'suspense'
                  &&(
                    <>
                    <span className="suspense-status-color">
                    Suspense
                                </span>
                    </>
                  )

                }

                {
                  item?.status == 'ban'
                  &&(
                    <>
                    <span className="inactive-status-color">
                                  Ban
                                </span>
                    </>
                  )

                }
               
                </td>
                {/* <td>
                  {item?.address}
                </td> */}
                {/* <td>

                {item?.is_verified == 0 ? (
                              <>

                                <span className="inactive-status-color">
                                  No
                                </span>
                              </>
                            ) : (
                              <>

                                <span className="active-status-color">
                                  Yes
                                </span>
                              </>
                            )}
               
                  
                </td> */}
               

                        </tr>

                      </>
                    ))}

                    

            </tbody>
          </table>
        </div>
      </div>
      <div className="card-footer">
      {/* <Link href={PAGE_USERS_STATUS}>
      <span style={{ cursor:"pointer" }}>View all Clients</span>
      </Link> */}
      <span style={{ textAlign:'left', fontSize:'1rem' }}>
                          No Data Found
                          </span>
       
      </div>
    </div>   
        </>
    )
}

export default DashCustomers
