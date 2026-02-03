import React, { useState, useEffect } from "react";
import { 
  Button, 
  Form, 
  Table, 
  Checkbox, 
  Input, 
  Space, 
  Typography, 
  Card,
  Row,
  Col,
  message,
  Spin
} from "antd";
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { postRequest } from "@/hooks/apiService";
import { URL_GET_ACTIVE_BORROWERS, URL_ADD_BORROWER_TO_GROUP } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useSelectQuery from '@/hooks/ReactQuery/useSelectQuery';
import { BUTTON_CONFIGS } from "@/utils/buttonStyles";

const { Title, Text } = Typography;

const AddBorrowersToGroup = (props) => {
  const { jwt, setIsModalVisible, groupRecord, refetch,forceRefetch } = props;
  const { handleRequestError, handleRequestResponse } = useHandleResponse();
  const [form] = Form.useForm();
  const [selectedBorrowers, setSelectedBorrowers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch active borrowers data
  const BorrowersDataObject = useSelectQuery({
    url: URL_GET_ACTIVE_BORROWERS,
    jwt: jwt,
    tableKey: "ActiveBorrowers",
    filter: ''
  });

  const borrowersData = BorrowersDataObject?.data || [];
  
  // Filter borrowers based on search text
  const filteredBorrowers = borrowersData.filter(borrower => 
    borrower.fullname?.toLowerCase().includes(searchText.toLowerCase()) ||
    borrower.borrower_id?.toString().includes(searchText)
  );

  // Handle borrower selection
  const handleBorrowerSelect = (borrowerId, checked) => {
    if (checked) {
      setSelectedBorrowers([...selectedBorrowers, borrowerId]);
    } else {
      setSelectedBorrowers(selectedBorrowers.filter(id => id !== borrowerId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBorrowers(filteredBorrowers.map(borrower => borrower.borrower_id));
    } else {
      setSelectedBorrowers([]);
    }
  };

  // Check if all visible borrowers are selected
  const isAllSelected = filteredBorrowers.length > 0 && 
    filteredBorrowers.every(borrower => selectedBorrowers.includes(borrower.borrower_id));

  // Check if some (but not all) visible borrowers are selected
  const isIndeterminate = selectedBorrowers.some(id => 
    filteredBorrowers.some(borrower => borrower.borrower_id === id)
  ) && !isAllSelected;

  // Submit selected borrowers to group
  const onFinish = async (values) => {
    if (selectedBorrowers.length === 0) {
      message.warning('Please select at least two borrowers to add to the group.');
      return;
    }

    if (selectedBorrowers.length < 2) {
      message.warning('Please select at least two borrowers to add to the group.');
      return;
    }

    setIsLoading(true);
    
    try {
      const requestData = {
        group_id: groupRecord.group_id,
        borrower_id: selectedBorrowers
      };
    //   console.log("requestData", requestData);
    //   return;

      await postRequest(URL_ADD_BORROWER_TO_GROUP, requestData, jwt).then(async (res) => {
        handleRequestResponse(res);
        await forceRefetch();
        setIsModalVisible(false);
        setSelectedBorrowers([]);
      }).catch((err) => {
        handleRequestError(err);
      });

      
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Table columns for borrower selection
  const columns = [
    {
      title: (
        <Checkbox
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={(e) => handleSelectAll(e.target.checked)}
          style={{ color: 'white' }}
        >
          Select All
        </Checkbox>
      ),
      key: 'select',
     
      render: (text, record) => (
        <Checkbox
          checked={selectedBorrowers.includes(record.borrower_id)}
          onChange={(e) => handleBorrowerSelect(record.borrower_id, e.target.checked)}
          style={{ color: 'white' }}
        />
      ),
    },
    {
      title: 'Borrower Details',
      dataIndex: 'fullname',
      key: 'fullname',
      render: (text, record) => (
        <div style={{ padding: '8px 0' }}>
          <div style={{ 
            fontWeight: '600', 
            color: '#4D4D4D',
            fontSize: '1rem',
            marginBottom: '4px'
          }}>
            {text}
          </div>
          {/* <div style={{ 
            fontSize: '0.85rem', 
            color: '#8B8B8B',
            fontFamily: 'monospace'
          }}>
            ID: {record.borrower_id}
          </div> */}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card 
        style={{ 
          marginBottom: '20px',
          border: '1px solid rgba(77, 77, 77, 0.1)',
          borderRadius: '8px'
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Title level={4} style={{ margin: 0, color: '#4D4D4D' }}>
              <UserAddOutlined style={{ marginRight: '8px', color: '#6B6B6B' }} />
              Add Borrowers to Group
            </Title>
            <Text type="secondary">
              Select borrowers to add to "{groupRecord?.name}" group
            </Text>
          </Col>
          <Col>
            <Text strong style={{ color: '#4D4D4D' }}>
              {selectedBorrowers.length} selected
            </Text>
          </Col>
        </Row>
      </Card>

      <Card style={{ 
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        border: '1px solid rgba(77, 77, 77, 0.08)',
        borderRadius: '12px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ 
            margin: '0 0 12px 0', 
            color: '#4D4D4D',
            fontWeight: '600'
          }}>
            Search Borrowers
          </Title>
          <Input
            placeholder="Search by borrower name or ID..."
            prefix={<SearchOutlined style={{ color: '#8B8B8B' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ 
              width: '100%',
              height: '45px',
              borderRadius: '8px',
              border: '1px solid rgba(77, 77, 77, 0.15)',
              fontSize: '0.95rem',
              boxShadow: '0 2px 4px rgba(77, 77, 77, 0.05)',
              textAlign: 'left',
              lineHeight: '45px',
              display: 'flex',
              alignItems: 'center'
            }}
            allowClear
            className="centered-search-input"
          />
          <style jsx global>{`
            .centered-search-input .ant-input {
              text-align: left !important;
              line-height: 43px !important;
              height: 45px !important;
              display: flex !important;
              align-items: center !important;
            }
            .centered-search-input .ant-input::placeholder {
              text-align: left !important;
              line-height: 43px !important;
            }
            .centered-search-input input {
              text-align: left !important;
              line-height: 43px !important;
              height: 45px !important;
            }
            .centered-search-input input::placeholder {
              text-align: left !important;
              line-height: 43px !important;
            }
          `}</style>
          {searchText && (
            <Text type="secondary" style={{ 
              fontSize: '0.85rem',
              marginTop: '8px',
              display: 'block'
            }}>
              Showing {filteredBorrowers.length} borrower{filteredBorrowers.length !== 1 ? 's' : ''} matching "{searchText}"
            </Text>
          )}
        </div>

        <div style={{ 
          maxHeight: '400px', 
          overflowY: 'auto',
          borderRadius: '8px',
          border: '1px solid rgba(77, 77, 77, 0.08)',
          background: '#ffffff'
        }}>
          <Table
            dataSource={filteredBorrowers}
            columns={columns}
            rowKey="borrower_id"
            pagination={false}
            loading={BorrowersDataObject?.isLoading}
            locale={{
              emptyText: (
                <div style={{ 
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#8B8B8B'
                }}>
                  <SearchOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                  <div>{searchText ? 'No borrowers found matching your search' : 'No borrowers available'}</div>
                </div>
              )
            }}
            size="middle"
            style={{
              background: '#ffffff'
            }}
            rowStyle={{
              borderBottom: '1px solid rgba(77, 77, 77, 0.05)'
            }}
          />
        </div>
      </Card>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '16px 0',
        borderTop: '1px solid rgba(77, 77, 77, 0.1)'
      }}>
        <Text type="secondary">
          {selectedBorrowers.length} borrower(s) selected {selectedBorrowers.length < 2 && '(minimum 2 required)'}
        </Text>
        
        <Space>
          <Button 
            onClick={() => setIsModalVisible(false)}
            style={{ 
              border: '1px solid #d9d9d9',
              color: '#4D4D4D'
            }}
          >
            Cancel
          </Button>
          <Button
            {...BUTTON_CONFIGS.SAVE_BUTTON()}
            onClick={onFinish}
            loading={isLoading}
            disabled={selectedBorrowers.length < 2}
            icon={<UserAddOutlined />}
          >
            Add {selectedBorrowers.length} Borrower{selectedBorrowers.length !== 1 ? 's' : ''}
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default AddBorrowersToGroup;
