import { useCallback, useEffect, useState } from "react";
import useToastMessage from "@/hooks/useToastMessage";
import { getApiUrl } from "@/config/getApiUrl";
import { getRequest } from "./apiService";

export default function usePagination({ url, size = 10, search = "", jwtToken, filter = "" }) {
  const { toastError } = useToastMessage();
  const domain = getApiUrl();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(size);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onPaginate = useCallback(
    async ({ currentPage: page = 1, pageSize = size, search = "" }) => {
      try {
        if (!url || !jwtToken) return;

        const queryParams = new URLSearchParams({
          search,
          page,
          perpage: pageSize,
        }).toString();

        const fullUrl = `${domain}${url}${filter ? `${filter}&${queryParams}` : `?${queryParams}`}`;

        setLoading(true);
        const res = await getRequest(fullUrl, jwtToken);

        const { result, meta } = res?.data || {};
        const pagination = meta?.pagination || {};

        setCurrentData(result || []);
        setCurrentPage(pagination.page || 1);
        setTotalItems(pagination.total || 0);
        setTotalPages(pagination.totalPages || 0);
      } catch (err) {
        console.error("Pagination fetch error:", err);
        toastError(err?.response?.data?.error || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    },
    [url, jwtToken, domain, filter, size, toastError]
  );

  const refreshPage = useCallback(() => {
    onPaginate({ currentPage, pageSize, search });
  }, [onPaginate, currentPage, pageSize, search]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setTotalPages(0);
    onPaginate({ currentPage: 1, pageSize: size, search });
  }, [onPaginate, size, search]);

  const onSearch = useCallback(
    (newSearch) => {
      setCurrentPage(1);
      onPaginate({ currentPage: 1, pageSize: size, search: newSearch });
    },
    [onPaginate, size]
  );

  const navigate = useCallback(
    (page) => {
      onPaginate({ currentPage: page, pageSize, search });
    },
    [onPaginate, pageSize, search]
  );

  // Initial and dependency-based fetch
  useEffect(() => {
    onPaginate({ currentPage: 1, pageSize: size, search });
  }, [url, size, search, onPaginate]);

  return {
    data: currentData,
    loading,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPaginate,
    refreshPage,
    resetPagination,
    onSearch,
    navigate,
  };
}
