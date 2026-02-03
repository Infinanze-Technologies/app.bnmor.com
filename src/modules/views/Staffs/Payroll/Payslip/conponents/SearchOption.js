import { useEffect, useState,useRef } from "react";
import { Input, Select } from 'antd'
import { debounce } from "lodash";
const SearchOption = (props) => {
  let { setSearch } = props;

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
    debouncedSearch(e.target.value)
   }

  return (
    <>
      <div className="col-sm-12">
        <div className="form-group custom-select">
          <Input placeholder='Search Here...' style={{ width:'300px' }} onChange={(e) => handleSearchFilter(e)}/>
        </div>
      </div>
    </>
  )
}

export default SearchOption