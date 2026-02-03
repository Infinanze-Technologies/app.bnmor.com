import React, { useEffect } from "react";
import { Form,Select } from "antd";
import { useInfiniteQuery } from "react-query";
import { getRequest } from "@/hooks/apiService";

const { Option } = Select;

export default function InfinitSelector(props) {
  let { path,jwt} = props;

  const fetchProjects = async ({ pageParam = 1 }) => {
    try {
        let results = getRequest(path + `?page=${pageParam}&perpage=10`,jwt)
        .then((res) => {
            // console.log(res.data?.data)
          return res.data?.data;
        })
        .catch((err) => {
         console.log(err)

        });
        return results;
    } catch (error) {
        
    }
   
    
  };

  

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery(path, fetchProjects, {
    refetchOnMount: false,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => {
        let myPgae = Math.ceil(lastPage?.totalItems / 10);
        let getLastPage = lastPage?.currentPage + 1;
        return getLastPage <= myPgae ? getLastPage : null;
      },
  });

  const refetchData = () => {
    refetch();
  }

  useEffect(() => {
    refetchData()
  }, []);

  const gotoNext = (event) => {
    let { scrollHeight, offsetHeight, scrollTop } = event.target;

    let shouldLoadMore =
      scrollHeight == offsetHeight + scrollTop ? true : false;
    shouldLoadMore && hasNextPage && fetchNextPage();
  };

//   console.log(isFetching)
  


  return (
    <Form.Item
      {...props}
      name={props?.name}
                rules={[
                  {
                    required: props?.required,
                    message: props?.message,
                  },
                ]}
              >
      <Select
        loading={isFetchingNextPage}
        showSearch
        placeholder={props.placeholder}
        // defaultValue = {props?.selectedValue}
        // filterOption={false}
        // onSearch={this.handleSearch}
        //  onChange={(e) => props.handleChange(e)}
        // notFoundContent={null}
        onPopupScroll={(e) => hasNextPage && gotoNext(e)}
        allowClear
      >
       <Option selected value={props?.defaultValue} key={props?.defaultValue} disabled = {props?.disabled}>{props?.defaultName}</Option>
        {data?.pages?.map((group, i) => (
          <React.Fragment key={i}>
            {group?.items?.map((project) => (
               
              <Option value={props?.optionValue ? project?.[props?.optionValue] : project?.id} key={project?.id}>
              {project?.[props?.optionName] ?? project?.name}
              </Option>
            ))}
          </React.Fragment>
        ))}
      
      </Select>
      </Form.Item>
  );
}