import React, { useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin } from "antd";
import { Button } from 'antd';
import Skeleton from 'react-loading-skeleton'
import { CSVLink } from 'react-csv'
import {URL_USER_REPORT_EXPORT } from "@/config/api-paths";
import {USER_REPORT_EXPORT} from "./report_url"
import { saveAs } from "file-saver";
import { DownloadOutlined } from '@ant-design/icons';
const UsersReport = (props) => {

  let { CatgoryDataObject, jwt } = props;

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
  } = CatgoryDataObject;


  const saveFile = () => {
    saveAs(USER_REPORT_EXPORT,'user.xls');
  };
 

  return (
    <>
       <div>
    <div className="page-header">
  <div className="row align-items-center">
    <div className="col">
      <h3 className="page-title">Users Report</h3>
      <ul className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">Report</li>
      </ul>
    </div>
    <div className="col-auto float-end ms-auto">
    <div className='submit-button'>
    <Button onClick={() => saveFile()}
      shape="round">    
      Export CSV
    </Button>
    </div>
   
    </div>
  </div>
</div>





<div className="row">
  <div className="col-md-12 d-flex">

  <div className="card card-table flex-fill">
        {/* <div className="card-header">
          <h3 className="card-title mb-0">Categories DataTable</h3>
        </div> */}
        <div className="card-body">
          <div className="table-responsive">
            <Spin spinning={isFetching}>
              <table className="table custom-table mb-0">
                <thead>
                  <tr>
                    <th className="text-left">Title</th>
                    <th className="text-left">Slug</th>
       
                 
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
                           {item?.title}
                          </td>
                          <td>

                            <a> {item?.slug} </a>
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



  
  
  
  
  </div>
  
</div>



            </div>




  


    </>
  );
};

export default UsersReport;
