import React, { useState } from 'react'
import {Button,Select,Dropdown, Menu, Space,Popconfirm, Spin } from 'antd'
import { HiDotsVertical } from "react-icons/hi";
import Skeleton from 'react-loading-skeleton';
import useHandleResponse from "@/hooks/useHandleResponse";
import ModalComponent from '@/components/ModalComponent';

import ViewProduct from './ViewProduct';


const ComplaintTable = (props) => {
  let {ComplaintsDataObject,jwt} = props
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
  } = ComplaintsDataObject;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");

  const { handleRequestError, handleRequestResponse } = useHandleResponse()

 

  

  const showModal = (value, record) => {
    if (value == "view") {
      setIsModalVisible(true);
      setModalTitle(<ViewComplaintsTitle record={record} />);
      setModalWidth(800);
      setModalContent(
        <ViewProduct
          setIsModalVisible={setIsModalVisible}
          jwt={jwt}
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
      <a onClick={() =>showModal("view",record)}>View</a>
    </Menu.Item>
  </Menu>
  );

  const handleCancel = () => {
    setIsModalVisible(false);
  };




  const ViewComplaintsTitle = (props) => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
     <h6>View Details</h6>
     
    </div>
  );
  



 

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
            
                <th className="text-left">Complaint Type</th>
                <th className="text-left">Complaint Content</th>
                <th className="text-left">Complaint From</th>
                <th className="text-left">On Prodcut</th>
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
                {item?.complaint_type}
                </td>
               
                <td>
                {item?.complaint_despt}
                </td>
                     
                <td>
                {item?.customer?.[0]?.first_name +' '+ item?.customer?.[0]?.last_name}
                  </td>

                  <td>
                  <a style={{ cursor:"pointer",color:"green" }} onClick={() => showModal('view',item)}>
                  {item?.product?.[0]?.pro_name}
                  </a>
                
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

export default ComplaintTable