import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getRequest } from "@/hooks/apiService";


export default function usePaginateQuery(props) {
  let { url, jwt, tableKey, filter } = props;
  const [page, setpage] = useState(0);
  const [pageSize, setpageSize] = useState(30);
  const isEnabled = Boolean(filter)
  const [loading, setLoading] = useState(false);





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
      setTimeout(() => setLoading(false), 1000);
      
      // Return the structured response that matches the API format
      return {
        data: result.data.data || [],
        currentPage: result.data.currentPage || 1,
        totalItems: result.data.totalItems || 0,
        totalPages: result.data.totalPages || 1,
        statusCode: result.data.statusCode,
        message: result.data.message,
        failed: result.data.failed
      };
    } catch (error) {
      console.log('Fetch error:', error);
      setLoading(false);
      return {
        data: [],
        currentPage: 1,
        totalItems: 0,
        totalPages: 1,
        statusCode: 500,
        message: 'Error fetching data',
        failed: true
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

  } = useQuery([tableKey, page, filter, pageSize], () => fetchData(page, filter, pageSize),
    {
      keepPreviousData: true,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetch: true,
      // staleTime: 0,
      // cacheTime: 0,
      // refetchInterval: 0,
      enabled: filter ? isEnabled : !isEnabled,
      
    }
  );


  const onSearch = useCallback(
    (search) => {
      fetchData({ page: 1, search: search, filter })
    },
    [],
  )


 
  useEffect(() => {
    refetch()
   }, [url,jwt])

  // Reset page to 0 (which becomes page 1 in API) when filter changes
  useEffect(() => {
    const filterContent = filter?.replace('?', '') || '';
    if (filterContent !== '') {
      setpage(0);
    }
  }, [filter])
 

  // Function to reset page to 0
  const resetPage = () => {
    setpage(0);
  };

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
    currentPage: data?.currentPage || 1,
    totalItem: data?.totalItems || 0,
    totalPages: data?.totalPages || 1,
    onSearch,
    setpage,
    setpageSize,
    pageSize,
    loading,
    resetPage,
    // Additional API response data
    statusCode: data?.statusCode,
    message: data?.message,
    failed: data?.failed
  };
}

