import React, { useCallback } from "react";
import { Form, Select } from "antd";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { getRequest } from "@/hooks/apiService";

const { Option } = Select;

export default function InfinitSelector(props) {
  const {
    path,
    jwt,
    name,
    required,
    message,
    placeholder,
    optionValue = "id",
    optionName = "name",
    handleChange,
    defaultValue,
    defaultName,
    disabled,
  } = props;

  const queryClient = useQueryClient();

  // ✅ Data fetcher
  const fetchProjects = async ({ pageParam = 1 }) => {
    const result = await getRequest(`${path}?page=${pageParam}&perpage=10`, jwt);
    return result.data?.data;
  };

  // ✅ Infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery([path], fetchProjects, {
    enabled: Boolean(path && jwt),
    keepPreviousData: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return null;
      const totalPages = Math.ceil(lastPage.totalItems / 10);
      const nextPage = lastPage.currentPage + 1;
      return nextPage <= totalPages ? nextPage : null;
    },
  });

  // ✅ Scroll trigger (with tolerance)
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, offsetHeight } = e.target;
    const nearBottom = scrollHeight - offsetHeight <= scrollTop + 2;
    if (nearBottom && hasNextPage) fetchNextPage();
  };

  // ✅ Force refetch (for example after create)
  const forceRefetch = useCallback(async () => {
    await queryClient.invalidateQueries([path]);
    await refetch();
  }, [path, queryClient, refetch]);

  // (Optional) expose forceRefetch through props
  if (props.onForceRefetch) props.onForceRefetch(forceRefetch);

  return (
    <Form.Item
      name={name}
      rules={[{ required: required, message: message }]}
    >
      <Select
        showSearch
        allowClear
        mode={props.mode || undefined}
        loading={isFetchingNextPage}
        placeholder={placeholder}
        onChange={handleChange}
        onPopupScroll={handleScroll}
        disabled={disabled}
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.children ?? "")
            .toLowerCase()
            .includes(input.toLowerCase())
        }
      >
        {defaultValue && (
          <Option key="default" value={defaultValue} disabled={disabled}>
            {defaultName}
          </Option>
        )}

        {data?.pages?.map((group, i) => (
          <React.Fragment key={i}>
            {group?.items?.map((item) => (
              <Option key={item.id} value={item[optionValue]}>
                {item[optionName]}
              </Option>
            ))}
          </React.Fragment>
        ))}
      </Select>
    </Form.Item>
  );
}
