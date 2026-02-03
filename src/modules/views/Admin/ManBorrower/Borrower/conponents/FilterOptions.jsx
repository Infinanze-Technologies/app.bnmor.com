import React, { useState, useEffect } from 'react'
import { Select, Input, Row, Col, Button, Space, Tag, Modal } from 'antd'
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons'
import { DatePicker } from 'antd';
import moment from 'moment';
import { BUTTON_CONFIGS } from '@/utils/buttonStyles';

const { Option } = Select;
const { Search } = Input;

const FilterOptions = (props) => {
  const { setfilterUserData, QryBranchDataObject, filterData, setFilterData } = props;
  
  const [searchText, setSearchText] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('ALL');
  const [customDateRange, setCustomDateRange] = useState(null);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);

  const handleDateRangeChange = (value) => {
    if (value === 'CUSTOM') {
      // Reset customDateRange when opening the modal
      setCustomDateRange(null);
      setIsDateModalVisible(true);
      // Don't set selectedDateRange to 'CUSTOM' until dates are actually selected
    } else {
      setSelectedDateRange(value);
    }
  };

  const handleCustomDateConfirm = () => {
    // console.log('handleCustomDateConfirm called'); // Debug log
    // console.log('customDateRange in confirm:', customDateRange); // Debug log
    if (customDateRange && customDateRange[0] && customDateRange[1]) {
      console.log('Setting selectedDateRange to CUSTOM'); // Debug log
      setSelectedDateRange('CUSTOM');
      setIsDateModalVisible(false);
      // Automatically apply filters when custom date is confirmed
      setTimeout(() => {
        applyFilters();
      }, 100);
    } else {
      console.log('No valid custom date range selected'); // Debug log
    }
  };

  // console.log('customDateRange in FilterOptions:', customDateRange[0].format('YYYY-MM-DD')); // Debug log
  // console.log('customDateRange in FilterOptions:', customDateRange[1].format('YYYY-MM-DD')); // Debug log


  const handleCustomDateCancel = () => {
    setIsDateModalVisible(false);
    setCustomDateRange(null);
  };

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses', color: '#1890ff' },
    { value: 'Active', label: 'Active', color: '#52c41a' },
    { value: 'Inactive', label: 'Inactive', color: '#faad14' },
    { value: 'Suspended', label: 'Suspended', color: '#ff4d4f' },
    { value: 'Blacklisted', label: 'Blacklisted', color: '#000000' }
  ];

  const branchOptions = QryBranchDataObject?.data || [];

  const applyFilters = () => {
    // Format filters for API
    let apiFilter = '';
    
    if (searchText) {
      apiFilter += `search=${encodeURIComponent(searchText)}&`;
    }
    
    if (selectedBranch !== 'ALL') {
      apiFilter += `branch_id=${selectedBranch}&`;
    }
    
    if (selectedStatus !== 'ALL') {
      apiFilter += `status=${selectedStatus}&`;
    }
    
    // Add date range filter
    if (selectedDateRange !== 'ALL') {
      const dateRange = getDateRange(selectedDateRange);
      console.log('Date range:', dateRange); // Debug log
      if (dateRange && selectedDateRange !== 'CUSTOM') {
        apiFilter += `start_date=${dateRange.start.format('YYYY-MM-DD')}&`;
        apiFilter += `end_date=${dateRange.end.format('YYYY-MM-DD')}&`;
      }else if (selectedDateRange === 'CUSTOM' && customDateRange) {
        apiFilter += `start_date=${customDateRange[0].format('YYYY-MM-DD')}&`;
        apiFilter += `end_date=${customDateRange[1].format('YYYY-MM-DD')}&`;
      }
    }

    // Remove trailing '&' if exists
    if (apiFilter.endsWith('&')) {
      apiFilter = apiFilter.slice(0, -1);
    }
    
    // Apply filters to the data
    if (setfilterUserData) {
      setfilterUserData(apiFilter);
    }
  };

  const getDateRange = (rangeValue) => {
    switch (rangeValue) {
      case 'TODAY':
        const today = moment();
        return { start: today.startOf('day'), end: today.endOf('day') };
      case 'YESTERDAY':
        const yesterday = moment().subtract(1, 'day');
        return { start: yesterday.startOf('day'), end: yesterday.endOf('day') };
      case 'LAST_WEEK':
        const lastWeekStart = moment().subtract(1, 'week').startOf('week');
        const lastWeekEnd = moment().subtract(1, 'week').endOf('week');
        return { start: lastWeekStart, end: lastWeekEnd };
      case 'THIS_WEEK':
        const thisWeekStart = moment().startOf('week');
        const thisWeekEnd = moment().endOf('week');
        return { start: thisWeekStart, end: thisWeekEnd };
      case 'LAST_MONTH':
        const lastMonthStart = moment().subtract(1, 'month').startOf('month');
        const lastMonthEnd = moment().subtract(1, 'month').endOf('month');
        return { start: lastMonthStart, end: lastMonthEnd };
      case 'THIS_MONTH':
        const thisMonthStart = moment().startOf('month');
        const thisMonthEnd = moment().endOf('month');
        return { start: thisMonthStart, end: thisMonthEnd };
      case 'LAST_YEAR':
        const lastYearStart = moment().subtract(1, 'year').startOf('year');
        const lastYearEnd = moment().subtract(1, 'year').endOf('year');
        return { start: lastYearStart, end: lastYearEnd };
      case 'THIS_YEAR':
        const thisYearStart = moment().startOf('year');
        const thisYearEnd = moment().endOf('year');
        return { start: thisYearStart, end: thisYearEnd };
      case 'CUSTOM':
        console.log('Custom date range state:', customDateRange); // Debug log
        console.log('Custom date range type:', typeof customDateRange); // Debug log
        if (customDateRange && Array.isArray(customDateRange) && customDateRange.length === 2) {
          console.log('Custom date range[0]:', customDateRange[0]); // Debug log
          console.log('Custom date range[1]:', customDateRange[1]); // Debug log
          return {
            start: moment(customDateRange[0]),
            end: moment(customDateRange[1])
          };
        }
        return null;
      default:
        return null;
    }
  };

  const getDateRangeDisplay = (rangeValue) => {
    if (rangeValue === 'CUSTOM') {
      if (customDateRange && customDateRange[0] && customDateRange[1]) {
        return `${customDateRange[0].format('MM/DD/YYYY')} - ${customDateRange[1].format('MM/DD/YYYY')}`;
      }
      return 'Select dates...';
    }
    
    const dateRange = getDateRange(rangeValue);
    if (dateRange) {
      return `${dateRange.start.format('MM/DD/YYYY')} - ${dateRange.end.format('MM/DD/YYYY')}`;
    }
    return 'All Time';
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedBranch('ALL');
    setSelectedStatus('ALL');
    setSelectedDateRange('ALL');
    setCustomDateRange(null);
    
    // Clear filters in parent component
    if (setfilterUserData) {
      setfilterUserData('');
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : '#d9d9d9';
  };

  return (
    <>
      <div 
        style={{ 
          marginBottom: 24,
          padding: '24px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(77, 77, 77, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(77, 77, 77, 0.1)'
        }}
      >
        {/* Background Pattern */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(77, 77, 77, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(50px, -50px)'
          }}
        />
        
        {/* Header */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <h3 style={{ 
            color: '#4D4D4D',
            margin: 0, 
            fontSize: '20px',
            fontWeight: '600',
            textShadow: 'none'
          }}>
            🔍 Advanced Filters
          </h3>
        </div>

        <Row gutter={[20, 20]} align="middle">
          {/* Search Input */}
          <Col xs={24} sm={6} md={6}>
            <div style={{ position: 'relative', display: 'flex' }}>
              <Input
                placeholder="🔎 Search borrowers..."
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={applyFilters}
                style={{ 
                  width: '100%',
                  borderRadius: '12px 0 0 12px',
                  boxShadow: '0 2px 8px rgba(77, 77, 77, 0.1)',
                  border: '1px solid rgba(77, 77, 77, 0.2)',
                  height: '40px',
                  fontSize: '14px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  lineHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff'
                }}
                size="large"
              />
               <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={applyFilters}
        size="large"
        style={{
          borderRadius: '0 12px 12px 0',
          background: 'linear-gradient(135deg, #4D4D4D 0%, #6B6B6B 100%)',
          border: 'none',
          height: '40px',
          width: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(77, 77, 77, 0.3)'
        }}
      />
            </div>
          </Col>

          {/* Branch Filter */}
          <Col xs={24} sm={6} md={6}>
            <Select
              value={selectedBranch}
              onChange={setSelectedBranch}
              style={{
                width: '100%',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(77, 77, 77, 0.1)',
                border: '1px solid rgba(77, 77, 77, 0.2)',
                backgroundColor: '#ffffff'
              }}
              placeholder="🏢 Select Branch"
              showSearch
              size="large"
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
              dropdownStyle={{
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(77, 77, 77, 0.15)'
              }}
              optionLabelProp="children"
            >
              <Option value="ALL">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🏢</span>
                  <span style={{ fontWeight: '500' }}>All Branches</span>
                </div>
              </Option>
              {branchOptions.map((branch) => (
                <Option key={branch.branch_id} value={branch.branch_id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>🏢</span>
                    <span>{branch.name}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Col>

          {/* Status Filter */}
          <Col xs={24} sm={6} md={6}>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{
                width: '100%',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(77, 77, 77, 0.1)',
                border: '1px solid rgba(77, 77, 77, 0.2)',
                backgroundColor: '#ffffff'
              }}
              placeholder="📊 Select Status"
              size="large"
              dropdownStyle={{
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(77, 77, 77, 0.15)'
              }}
              optionLabelProp="children"
            >
              {statusOptions.map((status) => (
                <Option key={status.value} value={status.value}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>
                      {status.value === 'Active' ? '✅' : 
                       status.value === 'Inactive' ? '⏸️' : 
                       status.value === 'Suspended' ? '🚫' : 
                       status.value === 'Blacklisted' ? '⛔' : '📊'}
                    </span>
                    <span>{status.label}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Col>

          {/* Date Range Filter */}
          <Col xs={24} sm={6} md={6}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            
              <Select
                value={selectedDateRange}
                onChange={handleDateRangeChange}
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(77, 77, 77, 0.1)',
                  border: '1px solid rgba(77, 77, 77, 0.2)',
                  backgroundColor: '#ffffff'
                }}
                placeholder="📅 Select Date Range"
                size="large"
                dropdownStyle={{
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(77, 77, 77, 0.15)'
                }}
                optionLabelProp="children"
              >
                <Option value="ALL">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📅</span>
                    <span style={{ fontWeight: '500' }}>Date Range</span>
                  </div>
                </Option>
                <Option value="TODAY">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📅</span>
                    <span>Today</span>
                  </div>
                </Option>
                <Option value="YESTERDAY">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📅</span>
                    <span>Yesterday</span>
                  </div>
                </Option>
                <Option value="LAST_WEEK">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📅</span>
                    <span>Last Week</span>
                  </div>
                </Option>
                <Option value="THIS_WEEK">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📅</span>
                    <span>This Week</span>
                  </div>
                </Option>
                <Option value="LAST_MONTH">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📅</span>
                    <span>Last Month</span>
                  </div>
                </Option>
                <Option value="THIS_MONTH">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📅</span>
                    <span>This Month</span>
                  </div>
                </Option>
                <Option value="LAST_YEAR">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📅</span>
                    <span>Last Year</span>
                  </div>
                </Option>
                <Option value="THIS_YEAR">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📅</span>
                    <span>This Year</span>
                  </div>
                </Option>
                <Option value="CUSTOM">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📅</span>
                    <span>Custom Range</span>
                  </div>
                </Option>
              </Select>
              {/* {selectedDateRange !== 'ALL' && (
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'monospace'
                }}>
                  {selectedDateRange === 'CUSTOM' && customDateRange ? 
                    `${customDateRange[0]?.format('MM/DD/YYYY')} - ${customDateRange[1]?.format('MM/DD/YYYY')}` :
                    getDateRangeDisplay(selectedDateRange)
                  }
                </div>
              )} */}
            </div>
          </Col>

       
        </Row>

        <Row style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
             {/* Filter Actions */}
             <Col xs={24} sm={12} md={4}>
            <Space size="small" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <Button 
                {...BUTTON_CONFIGS.APPLY_BUTTON()}
                onClick={applyFilters}
                size="middle"
              >
                Apply
              </Button>
              <Button 
                {...BUTTON_CONFIGS.CLEAR_BUTTON()}
                onClick={clearFilters}
                size="middle"
              >
                Clear
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Active Filters Display */}
        {(searchText || selectedBranch !== 'ALL' || selectedStatus !== 'ALL' || selectedDateRange !== 'ALL') && (
          <div style={{ 
            marginTop: '24px', 
            padding: '16px',
            background: 'rgba(77, 77, 77, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(77, 77, 77, 0.1)'
          }}>
            <div style={{ 
              color: '#4D4D4D', 
              marginBottom: '12px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              🎯 Active Filters:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {searchText && (
                <Tag 
                  closable 
                  onClose={() => setSearchText('')}
                  style={{ 
                    margin: 0,
                    borderRadius: '20px',
                    padding: '6px 12px',
                    background: '#4D4D4D',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '500',
                    fontSize: '13px'
                  }}
                >
                  🔍 Search: {searchText}
                </Tag>
              )}
              {selectedBranch !== 'ALL' && (
                <Tag 
                  closable 
                  onClose={() => setSelectedBranch('ALL')}
                  style={{ 
                    margin: 0,
                    borderRadius: '20px',
                    padding: '6px 12px',
                    background: '#6B6B6B',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '500',
                    fontSize: '13px'
                  }}
                >
                  🏢 Branch: {branchOptions.find(b => b.branch_id === selectedBranch)?.name || selectedBranch}
                </Tag>
              )}
              {selectedStatus !== 'ALL' && (
                <Tag 
                  closable 
                  onClose={() => setSelectedStatus('ALL')}
                  style={{ 
                    margin: 0,
                    borderRadius: '20px',
                    padding: '6px 12px',
                    background: '#8B8B8B',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '500',
                    fontSize: '13px'
                  }}
                >
                  📊 Status: {selectedStatus}
                </Tag>
              )}
              {selectedDateRange !== 'ALL' && (
                <Tag 
                  closable 
                  onClose={() => setSelectedDateRange('ALL')}
                  style={{ 
                    margin: 0,
                    borderRadius: '20px',
                    padding: '6px 12px',
                    background: '#4D4D4D',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '500',
                    fontSize: '13px'
                  }}
                >
                  📅 Date Range: {getDateRangeDisplay(selectedDateRange)}
                </Tag>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom Date Range Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📅</span>
            <span>Select Custom Date Range</span>
          </div>
        }
        open={isDateModalVisible}
        onOk={handleCustomDateConfirm}
        onCancel={handleCustomDateCancel}
        okText="Apply"
        cancelText="Cancel"
        maskClosable={false}
        keyboard={false}
        width={500}
        bodyStyle={{
          padding: '24px',
          textAlign: 'center'
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            Choose your custom date range for filtering borrowers
          </p>
          <DatePicker.RangePicker
            value={customDateRange}
            onChange={setCustomDateRange}
            style={{
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(77, 77, 77, 0.1)',
              border: '1px solid rgba(77, 77, 77, 0.2)'
            }}
            size="large"
            placeholder={['Start Date', 'End Date']}
            format="YYYY-MM-DD"
            allowClear
          />
        </div>
      </Modal>
    </>
  )
}

export default FilterOptions