import React, { useCallback, useEffect, useState } from "react";
import { usePaginatedQuery, useQuery,useMutation } from "react-query";
import { getRequest } from "@/hooks/apiService";


export default function useFetchQuery(props) {
  let { url, jwt, tableKey, filter } = props;
  const isEnabled = Boolean(filter)






  const fetchData = async (filter) => {
    try {


      let query = "";
      if (filter) {
        query = url + filter;
      } else {
        query = url;
      }
      
      let result = getRequest(query, jwt)
        .then((res) => {
          return res.data?.data;
        })
        .catch((err) => {
          console.log(err)
          // return err
        });

      return result;
    } catch (error) {
      console.log(error);
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

  } = useQuery([tableKey, filter], () => fetchData(filter),
    {
      keepPreviousData: true,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetch: true,
      staleTime: 0,
      cacheTime: 0,
      refetchInterval: 0,
      enabled: filter ? isEnabled : !isEnabled,
    }
  );



  const handleFilter = (value) => {
    setFilter(value)
  };

  const onSearch = useCallback(
    (search) => {
      fetchData({ page: 1, search: search, filter })
    },
    [],
  )









  useEffect(() => {
    refetch()
   }, [url,jwt])


  return {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
    status,
    refetch,
    onSearch,
    handleFilter,
  
    


  };
}

