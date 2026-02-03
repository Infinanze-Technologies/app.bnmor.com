import React from "react";
import {useQuery } from "react-query";
import { getRequest } from "@/hooks/apiService";


export default function useCustomDataQuery(props) {
  let { url, jwt,tableKey,filter } = props;
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
          return res.data;
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
    data

  } = useQuery([tableKey,filter], () => fetchData(filter),
    {
      keepPreviousData: true,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
      refetch: true,
      refetchInterval: 0,
      enabled: filter ? isEnabled : !isEnabled,
    }
  );




  return {
    isLoading,
    isError,
    error,
    data,
  };
}

