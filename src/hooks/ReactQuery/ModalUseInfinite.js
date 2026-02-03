import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import { getApiUrl } from "@/config/getApiUrl";

export default function useInfinite(props) {
  let { path, jwkToken } = props;
  let domain = getApiUrl();
  // const [pageParam, setpageParam] = useState(1);
  // const [pageQuery, setpageQuery] = useState('')
  // const [pageSize, setpageSize] = useState(null)
  // const [pageTotal, setpageTotal] = useState(null)


  // useEffect(() => {
  //   fetchProjects();
  // }, [path,jwkToken]);

  const fetchProjects = async ({ pageParam = 1 }) => {
    try {
      let response = await axios.get(
        domain + path + `&page=${pageParam}&size=10`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${jwkToken}`,
          },
        }
      );

      let newData = response?.data;
      return newData;
    } catch (error) {
      console.log(error);
    }
  };



  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch
    
  } = useInfiniteQuery(domain + path, fetchProjects, {
    refetchOnMount: true,
    keepPreviousData: true,
    refetchOnWindowFocus: false,

    getNextPageParam: (lastPage, pages) => {
      let myPgae = Math.ceil(lastPage?.meta?.pagination?.total / 10);
      let getLastPage = lastPage?.meta?.pagination?.page + 1;
      return getLastPage <= myPgae ? getLastPage : null;
    },
  });

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage ,
    isFetching,
    isFetchingNextPage,
    status,
    refetch
 
  };
}
