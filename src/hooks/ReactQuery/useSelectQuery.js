import React, { useCallback } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getRequest } from "@/hooks/apiService";

export default function useSelectQuery({
  url,
  jwt,
  tableKey,
  filter = "",
  enabled = true,
}) {
  const queryClient = useQueryClient();

  const fetchData = async () => {
    if (!url || !jwt) return [];
    try {
      const query = filter ? `${url}${filter}` : url;
      const result = await getRequest(query, jwt);
      return result?.data?.data ?? result?.data ?? [];
    } catch (error) {
      console.error(`[useSelectQuery] Fetch error:`, error);
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
    isSuccess,
  } = useQuery([tableKey, url, filter, jwt], fetchData, {
    enabled: enabled && Boolean(url) && Boolean(jwt),
    keepPreviousData: false, // 🔄 ensures we don’t reuse stale cache when filters change
    refetchOnMount: "always", // ✅ guarantees fresh load when component mounts
    refetchOnWindowFocus: false,
    staleTime: 0, // forces freshness
    cacheTime: 5 * 60 * 1000, // 5 mins cache
    retry: 2,
    retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 10000),
  });

  // 🔁 True refetch — bypasses cache and re-triggers fetch
  const forceRefetch = useCallback(async () => {
    await queryClient.invalidateQueries([tableKey]);
    await refetch({ cancelRefetch: false });
  }, [queryClient, tableKey, refetch]);

  return {
    isLoading,
    isFetching,
    isError,
    isSuccess,
    error,
    data,
    refetch,
    // ✅ Extra helpers
    refresh: refetch,
    invalidate: () => queryClient.invalidateQueries([tableKey]),
    forceRefetch,
  };
}
