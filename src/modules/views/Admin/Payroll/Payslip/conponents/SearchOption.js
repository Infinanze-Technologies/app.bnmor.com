import { useEffect, useState, useRef } from "react";
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { debounce } from "lodash";

const SearchOption = (props) => {
  let { setSearch } = props;
  const [searchText, setSearchText] = useState('');

  const debouncedSearch = useRef(
    debounce(async (data) => {
      await setSearch(data);
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchFilter = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleSearch = () => {
    setSearch(searchText);
  };

  const handleClear = () => {
    setSearchText('');
    setSearch('');
  };

  return (
    <div style={{ position: 'relative', display: 'flex' }}>
      <Input
        placeholder="🔎 Search payslips..."
        allowClear
        value={searchText}
        onChange={handleSearchFilter}
        onPressEnter={handleSearch}
        style={{ 
          width: '300px',
          borderRadius: '12px 0 0 12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: 'none',
          height: '40px',
          fontSize: '14px',
          paddingLeft: '16px',
          paddingRight: '16px',
          lineHeight: '40px',
          display: 'flex',
          alignItems: 'center'
        }}
        size="large"
      />
           <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleSearch}
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
  );
};

export default SearchOption;