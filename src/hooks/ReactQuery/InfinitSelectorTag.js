import React, { useCallback } from "react";
import { Form, Select } from "antd";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { getRequest } from "@/hooks/apiService";

const { Option } = Select;

export default function InfiniteSelectorTag(props) {
  const {
    path,
    jwt,
    name,
    required,
    message,
    placeholder,
    handleChange,
    defaultValue,
    defaultName,
    disabled,
    optionValue = "id",
    optionName = "name",
  } = props;

  const queryClient = useQueryClient();

  // ✅ Pagination-aware fetcher
  const fetchProjects = async ({ pageParam = 1 }) => {
    const result = await getRequest(`${path}?page=${pageParam}&perpage=10`, jwt);
    return result?.data?.data;
  };

  // ✅ Query setup
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetching,
  } = useInfiniteQuery([path], fetchProjects, {
    enabled: Boolean(path && jwt),
    keepPreviousData: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return null;
      const next = lastPage.currentPage + 1;
      const totalPages = Math.ceil(lastPage.totalItems / 10);
      return next <= totalPages ? next : null;
    },
  });

  // ✅ Force full refetch after mutations (e.g. create)
  const forceRefetch = useCallback(async () => {
    await queryClient.invalidateQueries([path]);
    await refetch();
  }, [queryClient, path, refetch]);

  // ✅ Infinite scroll trigger
  const handleScroll = (e) => {
    const { scrollHeight, offsetHeight, scrollTop } = e.target;
    const isBottom = scrollHeight - offsetHeight <= scrollTop + 2;
    if (isBottom && hasNextPage) fetchNextPage();
  };

  return (
    <Form.Item
      name={name}
      rules={[
        {
          required: required,
          message: message,
        },
      ]}
    >
      <Select
        showSearch
        mode="tags"
        tokenSeparators={[","]}
        loading={isFetching || isFetchingNextPage}
        placeholder={placeholder}
        onChange={handleChange}
        onPopupScroll={handleScroll}
        disabled={disabled}
        filterOption={(input, option) =>
          (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
        }
      >
        {defaultValue && (
          <Option value={defaultValue} key="default" disabled={disabled}>
            {defaultName}
          </Option>
        )}
        {data?.pages?.map((page, i) => (
          <React.Fragment key={i}>
            {page?.items?.map((item) => (
              <Option
                key={item.id}
                value={item[optionValue]}
              >
                {item[optionName]}
              </Option>
            ))}
          </React.Fragment>
        ))}
      </Select>
    </Form.Item>
  );
}
