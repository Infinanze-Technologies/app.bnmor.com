import React, { useState } from 'react'
import {Button,Select,Dropdown, Menu, Space,Popconfirm, Spin } from 'antd'
import { HiDotsVertical } from "react-icons/hi";
import Skeleton from 'react-loading-skeleton';
import Image from 'next/image';
import ModalComponent from '@/components/ModalComponent';
import ViewCustomer from './ViewCustomer';




const UsersReport = (props) => {
  let {CustomerDataObject} = props
  let {
    isLoading,
    isError,
    data,
    page,
    totalPages,
    handleNextbtn,
    handlePrevbtn,
    pageIncrementBtn,
    pageDecrementBtn,
    renderPageNumbers,
    refetch,
    isFetching
  } = CustomerDataObject;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");

//   const dateFormat = 'YYYY-MM-DD';
//   const handleChangeDate = (date,dateString) => {
//     setstateDate(dateString[0])
//     setendDate(dateString[1])
// }



  const showModal = (value, record) => {
    if (value == "view") {
      setIsModalVisible(true);
      setModalTitle(<ViewCusomterTitle record={record} />);
      setModalWidth(800);
      setModalContent(
        <ViewCustomer
          setIsModalVisible={setIsModalVisible}
         
          record={record}
          refetch={refetch}
        />
      );
    }
   
    else {
      return false;
    }
  };





  const menu = (record) => (
    
    <Menu>
    <Menu.Item key="0">
      {/* <a onClick={() => showModal("view",record)}>View</a> */}
      <a onClick={() =>showModal("view",record)}>View</a>
    </Menu.Item>

   


  </Menu>
  );

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const ViewCusomterTitle = (props) => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
     <h6>View {props?.record?.first_name +' '+ props?.record?.last_name } Details</h6>
     
    </div>
  );
  





  let localimagPath = process.env.NEXT_PUBLIC_PUBLIC_IMAGES;

  return (
    <>

<div className="card card-table flex-fill">
      <div className="card-header">
        <h3 className="card-title mb-0">Report</h3>
      </div>
      <div className="card-body">
          <div className="table-responsive">
            <Spin spinning={isFetching}>
              <table className="table custom-table mb-0">
              <thead>
              <tr>
            
                <th className="text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Status</th>
                <th className="text-left">Contact</th>
                  <th className="text-left">Region</th>
                <th className="text-left">City</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
                <tbody>

                  {isError && <p style={{ textAlign:'center' }}>Something Went Wrong</p>}
                  {isLoading && (
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

                  {data &&
                    data?.items?.map((item, index) => (
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
                <td>
                  {item?.contact_no == null ? "--" : item?.contact_no}
                </td>

                <td>
                  {item?.region?.name == null ? "--" : item?.region?.name}
                </td>

                  <td>
                  {item?.city?.name == null ? "--" : item?.city?.name }
                </td>
             
                <td className="text-center">
                <Dropdown overlay={menu(item)} trigger={["click"]}>
                  <Space size="middle">
                    <HiDotsVertical style={{cursor: "pointer" }} />
                  </Space>
                </Dropdown>
                  
                </td>

                        </tr>

                      </>
                    ))}

                </tbody>
              </table>
            </Spin>
          </div>
        </div>


        <div className="card-footer">
          <div className="col-12 mt-3 text-center">
            <div className="table-filter-info text-center">
              <div className="dt-pagination">
                <ul className="dt-pagination-ul">
                  <li className={`dt-item ${page === 1 ? "d-none" : ""}`}>
                    <a className="dt-link" onClick={handlePrevbtn}>
                      Prev
                    </a>
                  </li>
                  {pageDecrementBtn}
                  {renderPageNumbers}
                  {pageIncrementBtn}
                  <li
                    className={`dt-item ${totalPages <= page ? "d-none" : ""}`}
                  >
                    <a className="dt-link" onClick={handleNextbtn}>
                      Next
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>



    </div>

    <ModalComponent
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        title={modalTitle}
        width={modalWidth}
      >
        {modalContent}
      </ModalComponent>

    </>
  )
}

export default UsersReport