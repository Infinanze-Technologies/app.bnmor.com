import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getRequest } from "@/hooks/apiService";

export default function useFetchQuery(props) {
  const { url, jwt, tableKey, filter } = props;
  const queryClient = useQueryClient();
  const isEnabled = Boolean(filter);

  const fetchData = async (filter) => {
    try {
      const query = filter ? `${url}${filter}` : url;
      const res = await getRequest(query, jwt);
      return res.data?.data || [];
    } catch (error) {
      console.log("Fetch error:", error);
      return [];
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
  } = useQuery([tableKey, filter], () => fetchData(filter), {
    keepPreviousData: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,
    refetchInterval: 0,
    enabled: filter ? isEnabled : !isEnabled,
  });

  // 👇 Force cache invalidation + refetch
  const forceRefetch = useCallback(async () => {
    await queryClient.invalidateQueries([tableKey]);
    await refetch();
  }, [queryClient, tableKey, refetch]);

  const onSearch = useCallback(
    (search) => {
      fetchData({ search, filter });
    },
    [filter]
  );

  useEffect(() => {
    refetch();
  }, [url, jwt, refetch]);

  return {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
    status,
    refetch,
    forceRefetch, // ✅ added here
    onSearch,
  };
}
