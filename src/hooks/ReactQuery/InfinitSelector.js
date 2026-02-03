import React, { useEffect } from "react";
import { Form, Select } from "antd";
import { useInfiniteQuery } from "react-query";
import { getRequest } from "@/hooks/apiService";

const { Option } = Select;

export default function InfiniteSelector(props) {
  const { path, jwt, name, required, message, placeholder, defaultValue, defaultName, disabled, optionValue, optionName } = props;

  const fetchProjects = async ({ pageParam = 1 }) => {
    try {
      const res = await getRequest(`${path}?page=${pageParam}&perpage=10`, jwt);
      return res.data?.data;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    [path, jwt], // ✅ Include jwt in key so query refetches when it changes
    fetchProjects,
    {
      keepPreviousData: false, // ❗ Prevents stale cache
      refetchOnMount: true, // ✅ Ensures new fetch on mount
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        const totalPages = Math.ceil(lastPage?.totalItems / 10);
        const nextPage = lastPage?.currentPage + 1;
        return nextPage <= totalPages ? nextPage : null;
      },
    }
  );

  useEffect(() => {
    refetch(); // ✅ Force refresh every time component mounts or props.path changes
  }, [path]);

  const handleScroll = (event) => {
    const { scrollHeight, scrollTop, offsetHeight } = event.target;
    if (scrollHeight - scrollTop === offsetHeight && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Form.Item
      name={name}
      rules={[{ required, message }]}
    >
      <Select
        loading={isFetchingNextPage}
        showSearch
        placeholder={placeholder}
        onPopupScroll={handleScroll}
        allowClear
        disabled={disabled}
      >
        {defaultValue && (
          <Option value={defaultValue} disabled>
            {defaultName}
          </Option>
        )}
        {data?.pages?.map((group, i) => (
          <React.Fragment key={i}>
            {group?.items?.map((item) => (
              <Option
                key={item?.id}
                value={optionValue ? item?.[optionValue] : item?.id}
              >
                {item?.[optionName] ?? item?.name}
              </Option>
            ))}
          </React.Fragment>
        ))}
      </Select>
    </Form.Item>
  );
}
