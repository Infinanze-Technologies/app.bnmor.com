import React, { useCallback } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getRequest } from "@/hooks/apiService";

export default function useCustomDataQuery(props) {
  const { url, jwt, tableKey, filter } = props;
  const queryClient = useQueryClient();
  const isEnabled = Boolean(url && jwt); // run only when valid

  const fetchData = async () => {
    try {
      const query = filter ? `${url}${filter}` : url;
      const result = await getRequest(query, jwt);
      return result.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const {
    isLoading,
    isError,
    error,
    data,
    refetch,
    isFetching,
  } = useQuery([tableKey, filter, url], fetchData, {
    enabled: isEnabled,
    keepPreviousData: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,
  });

  // ✅ Force network re-fetch, bypassing cache
  const forceRefetch = useCallback(async () => {
    await queryClient.invalidateQueries([tableKey]);
    await refetch();
  }, [queryClient, tableKey, refetch]);

  return {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    refetch,
    forceRefetch, // ✅ use this after mutations
  };
}
