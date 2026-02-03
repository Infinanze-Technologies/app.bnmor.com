import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Space, Popconfirm, Avatar, Spin, Table, Button,Divider, Tooltip } from "antd";
import { UserTableStyleWrapper,TableWrapper } from '@/components/TableStyle/table';
import { AiOutlineMore } from "react-icons/ai";
import { formatDateHuman } from "@/config/DateFormat";
import {UserOutlined } from '@ant-design/icons';

const DashAnnouncement = (props) => {
  let {AnnouncementDataObject,QryBranchDataObject,setBranch} = props
  let qryBranchData = QryBranchDataObject?.data

  let {
    isLoading,  
  } = AnnouncementDataObject;

  let qryData = AnnouncementDataObject?.data

  useEffect(() => {
       
  }, [AnnouncementDataObject]);

  const changeBranch = (e) => {
    setBranch(e?.target?.value)
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      align: "left",
      render: (text,record,index)=> (
        <div className="announcement-title">
          <div className="title-text">{record?.title}</div>
          {/* <div className="title-badge">
            <i className="fas fa-bullhorn"></i>
          </div> */}
        </div>
      )
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      align: "left",
      render: (text,record,index)=> (
        <div className="branch-info">
          <span className="branch-name">{record?.branch?.name}</span>
        </div>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      align: "left",
      render: (text,record,index)=> (
        <div className="department-info">
          <span className="department-name">{record?.department?.name}</span>
        </div>
      )
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      align: "center",
      render: (text,record,index)=> (
        <div className="date-info">
          {/* <i className="fas fa-calendar-alt"></i> */}
          <span>{formatDateHuman(record?.start_date)}</span>
        </div>
      )
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      align: "center",
      render: (text,record,index)=> (
        <div className="date-info">
          {/* <i className="fas fa-calendar-check"></i> */}
          <span>{formatDateHuman(record?.end_date)}</span>
        </div>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      align: "center",
      render: (text,record,index)=> (
        <div className="description-info">
          <Tooltip title={record?.description}>
            <span className="description-text">
              {record?.description?.length > 50 
                ? `${record?.description?.substring(0, 50)}...` 
                : record?.description}
            </span>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <div className="announcements-container">
      <div className="announcements-header">
        <div className="header-content">
          <h3 className="section-title">
            <i className="fas fa-bullhorn"></i>
            Recent Announcements
          </h3>
          <p className="section-subtitle">Stay updated with the latest company news</p>
        </div>
        <div className="header-controls">
          <select 
            className="branch-filter"
            onChange={changeBranch}
            defaultValue="ALL"
          >
            <option value="ALL">All Branches</option>
            {qryBranchData?.map((branch) => (
              <option key={branch.branch_id} value={branch.branch_id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="announcements-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <p>Loading announcements...</p>
          </div>
        ) : (
          <div className="table-container">
            <Table
              columns={columns}
              dataSource={qryData}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showQuickJumper: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} announcements`,
                itemRender: (page, type, originalElement) => {
                  if (type === 'prev') {
                    return <span className="pagination-btn"><i className="fas fa-chevron-left"></i></span>;
                  }
                  if (type === 'next') {
                    return <span className="pagination-btn"><i className="fas fa-chevron-right"></i></span>;
                  }
                  return originalElement;
                }
              }}
              className="modern-table"
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .announcements-container {
          background: #ffffff;
          border-radius: 0;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(95, 99, 242, 0.1);
        }

        .announcements-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 25px;
          gap: 20px;
        }

        .header-content {
          flex: 1;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 5px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-title i {
          color: #ffc107;
          font-size: 1.1rem;
        }

        .section-subtitle {
          color: #6c757d;
          font-size: 0.9rem;
          margin: 0;
          font-weight: 400;
        }

        .header-controls {
          flex-shrink: 0;
        }

        .branch-filter {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 8px 15px;
          font-size: 0.9rem;
          color: #495057;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 150px;
        }

        .branch-filter:hover {
          border-color: #ffc107;
          background: #ffffff;
        }

        .branch-filter:focus {
          outline: none;
          border-color: #ffc107;
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
        }

        .announcements-content {
          position: relative;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #6c757d;
        }

        .loading-spinner {
          font-size: 2rem;
          color: #ffc107;
          margin-bottom: 15px;
        }

        .loading-container p {
          margin: 0;
          font-size: 0.9rem;
        }

        .table-container {
          overflow: hidden;
          border-radius: 0;
        }

        .modern-table {
          border-radius: 0;
          overflow: hidden;
        }

        .modern-table :global(.ant-table) {
          border-radius: 0;
        }

        .modern-table :global(.ant-table-thead > tr > th) {
          background: linear-gradient(135deg, #4D4D4D 0%, #4347D9 100%);
          color: #ffffff !important;
          font-weight: 600;
          border: none;
          padding: 16px 12px;
        }

        .modern-table :global(.ant-table-tbody > tr > td) {
          border-bottom: 1px solid #f1f3f4;
          padding: 16px 12px;
          transition: all 0.3s ease;
        }

        .modern-table :global(.ant-table-tbody > tr:hover > td) {
          background: rgba(95, 99, 242, 0.05);
        }

        .modern-table :global(.ant-table-pagination) {
          margin: 16px 0 0 0;
          text-align: center;
        }

        .modern-table :global(.ant-pagination-item) {
          border-radius: 8px;
          border: 1px solid #e9ecef;
          margin: 0 2px;
        }

        .modern-table :global(.ant-pagination-item-active) {
          background: #4D4D4D;
          border-color: #4D4D4D;
        }

        .modern-table :global(.ant-pagination-item-active a) {
          color: #ffffff;
        }

        .pagination-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          color: #6c757d;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover {
          border-color: #4D4D4D;
          color: #4D4D4D;
        }

        .announcement-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .title-text {
          font-weight: 500;
          color: #2c3e50;
        }

        .title-badge {
          width: 24px;
          height: 24px;
          background: rgba(255, 193, 7, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffc107;
          font-size: 0.8rem;
        }

        .branch-info, .department-info {
          display: flex;
          align-items: center;
        }

        .branch-name, .department-name {
          font-weight: 500;
          color: #495057;
        }

        .date-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .date-info i {
          color: #4D4D4D;
          font-size: 0.8rem;
        }

        .description-info {
          max-width: 200px;
        }

        .description-text {
          color: #6c757d;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .announcements-container {
            padding: 20px;
          }

          .announcements-header {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }

          .section-title {
            font-size: 1.1rem;
          }

          .branch-filter {
            width: 100%;
            text-align: center;
          }

          .modern-table :global(.ant-table-thead > tr > th),
          .modern-table :global(.ant-table-tbody > tr > td) {
            padding: 12px 8px;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .announcements-container {
            padding: 15px;
          }

          .section-title {
            font-size: 1rem;
          }

          .description-info {
            max-width: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default DashAnnouncement;
