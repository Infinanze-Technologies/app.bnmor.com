import React from "react";
import { useQuery } from "react-query";
import { getRequest } from "@/hooks/apiService";

export default function useSelectQuery(props) {
  const { url, jwt, tableKey, filter, enabled = true } = props;

  const fetchData = async () => {
    try {
      const query = filter ? `${url}${filter}` : url;
      const result = await getRequest(query, jwt);
      return result.data?.data;
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
    isFetching
  } = useQuery(
    [tableKey, filter, url], // Include url in query key for proper cache invalidation
    fetchData,
    {
      enabled: enabled && Boolean(url) && Boolean(jwt), // Only run when all required params are available
      keepPreviousData: true,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes
      retry: 3, // Retry failed requests 3 times
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    }
  );

  return {
    isLoading,
    isError,
    error,
    data,
    refetch,
    isFetching,
    // Additional utility methods
    invalidate: () => refetch(), // Alias for refetch for clarity
    refresh: () => refetch(), // Another alias for better semantics
  };
}

