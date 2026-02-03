import React, { useState } from 'react'
import {Button,Select,Dropdown, Menu, Space,Popconfirm, Spin } from 'antd'
import { HiDotsVertical } from "react-icons/hi";
import Skeleton from 'react-loading-skeleton';
import useHandleResponse from "@/hooks/useHandleResponse";
import ModalComponent from '@/components/ModalComponent';
import ViewAttributes from './ViewAttributes';
import ViewProduct from './ViewProduct';
import ViewImages from './ViewImages';

const SoldItemsTable = (props) => {
  let {ProductDataObject,jwt} = props
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
  } = ProductDataObject;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");



  

  const showModal = (value, record) => {
    if (value == "view") {
      setIsModalVisible(true);
      setModalTitle(<ViewProductTitle record={record} />);
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


      else if (value == "images") {
        setIsModalVisible(true);
        setModalTitle(<ViewProductImageTitle record={record} />);
        setModalWidth(700);
        setModalContent(
          <ViewImages
            setIsModalVisible2={setIsModalVisible}
            jwt={jwt}
            record={record}
            refetch={refetch}
          />
        );
      }

      else if (value == "attributes") {
        setIsModalVisible(true);
        setModalTitle(<ViewProductArttrTitle record={record} />);
        setModalWidth(800);
        setModalContent(
          <ViewAttributes
            setIsModalVisible2={setIsModalVisible}
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
      {/* <a onClick={() => showModal("view",record)}>View</a> */}
      <a onClick={() =>showModal("view",record)}>View</a>
    </Menu.Item>

    <Menu.Item key="1">
      {/* <a onClick={() => showModal("view",record)}>View</a> */}
      <a onClick={() =>showModal("images",record)}>Images</a>
    </Menu.Item>

    <Menu.Item key="2">
      {/* <a onClick={() => showModal("view",record)}>View</a> */}
      <a onClick={() =>showModal("attributes",record)}>Attributes</a>
    </Menu.Item>





  

  </Menu>
  );

  const handleCancel = () => {
    setIsModalVisible(false);
  };

 

  const ViewProductTitle = (props) => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
     <h6>{props?.record?.pro_name} Details</h6>
     
    </div>
  );
  


  const ViewProductImageTitle = (props) => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>{props?.record?.pro_name } Images</h6>
   
    </div>
  );


  const ViewProductArttrTitle = (props) => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>{props?.record?.pro_name } Attributes</h6>
   
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
            
                <th className="text-left">Product</th>
                <th className="text-left">Category</th>
                <th className="text-left">SubCategory</th>
                <th className="text-left">Price</th>
                <th className="text-left">Location</th>
                <th className="text-left">Customer</th>
                <th className="text-left">Status</th>
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
                {item?.pro_name}
                </td>
               
                <td>
                {item?.cat?.title}
                </td>
                     
                <td>
                {item?.sub_cat?.title}
                  </td>

                  <td>
                  {item?.pro_price}
                  </td>

                  <td>
                  {item?.city?.name}
                  </td>

                  <td>
                  {item?.customer?.first_name} {item?.customer?.last_name}
                  </td>
                  <td>
                  <span className="inactive-status-color">
                    {item?.stock}
                    </span>
                  
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

export default SoldItemsTable