import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getRequest } from "@/hooks/apiService";

export default function usePaginateQuery(props) {
  const { url, jwt, tableKey, filter } = props;
  const [page, setpage] = useState(0);
  const [pageSize, setpageSize] = useState(30);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const fetchData = async (page = 1, filter, currentPageSize = pageSize) => {
    try {
      let query = "";
      if (filter) {
        query = url + filter + `&page=${page}&size=${currentPageSize}`;
      } else {
        query = url + `?page=${page}&size=${currentPageSize}`;
      }

      setLoading(true);
      const result = await getRequest(query, jwt);
      setTimeout(() => setLoading(false), 500);

      return {
        data: result.data.data || [],
        currentPage: result.data.currentPage || 1,
        totalItems: result.data.totalItems || 0,
        totalPages: result.data.totalPages || 1,
        statusCode: result.data.statusCode,
        message: result.data.message,
        failed: result.data.failed,
      };
    } catch (error) {
      console.log("Fetch error:", error);
      setLoading(false);
      return {
        data: [],
        currentPage: 1,
        totalItems: 0,
        totalPages: 1,
        statusCode: 500,
        message: "Error fetching data",
        failed: true,
      };
    }
  };

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
    status,
    refetch,
  } = useQuery(
    [tableKey, page, filter, pageSize],
    () => fetchData(page, filter, pageSize),
    {
      keepPreviousData: true,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 0, // 👈 always stale, ensures real refetch
      cacheTime: 0, // 👈 no cache reuse
      enabled: !!url && !!jwt,
    }
  );

  const forceRefetch = useCallback(async () => {
    await queryClient.invalidateQueries([tableKey]);
    await refetch({ cancelRefetch: false });
  }, [queryClient, tableKey, refetch]);

  useEffect(() => {
    refetch();
  }, [url, jwt]);

  useEffect(() => {
    const filterContent = filter?.replace("?", "") || "";
    if (filterContent !== "") {
      setpage(0);
    }
  }, [filter]);

  const resetPage = () => setpage(0);

  const onSearch = useCallback(
    (search) => {
      fetchData({ page: 1, search: search, filter });
    },
    [filter]
  );

  return {
    isLoading,
    isError,
    error,
    data: data?.data || [],
    isFetching,
    isPreviousData,
    status,
    page,
    refetch,
    forceRefetch, // 🔥 use this after create/update
    currentPage: data?.currentPage || 1,
    totalItem: data?.totalItems || 0,
    totalPages: data?.totalPages || 1,
    onSearch,
    setpage,
    setpageSize,
    pageSize,
    loading,
    resetPage,
    statusCode: data?.statusCode,
    message: data?.message,
    failed: data?.failed,
  };
}
