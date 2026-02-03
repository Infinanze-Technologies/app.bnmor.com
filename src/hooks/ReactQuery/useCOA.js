import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getRequest, postRequest, updateRequest, deleteRequest } from '../apiService';
import { 
  URL_GET_COA_HIERARCHY, 
  URL_GET_FUNDING_HIERARCHY, 
  URL_GET_CASH_FUNDING_ACCOUNTS,
  URL_ADD_COA, 
  URL_UPDATE_COA, 
  URL_DELETE_COA 
} from '@/config/api-paths';

// Hook to get Chart of Accounts hierarchy
export const useCOAHierarchy = (jwt) => {
  return useQuery(
    ['coa-hierarchy'],
    async () => {
      try {
        console.log('Fetching COA hierarchy...', URL_GET_COA_HIERARCHY);
        const response = await getRequest(URL_GET_COA_HIERARCHY, jwt);
        console.log('COA API Response:', response);
        return response.data;
      } catch (error) {
        console.error('COA API Error:', error);
        throw error;
      }
    },
    {
      enabled: !!jwt,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    }
  );
};

// Hook to get Funding Accounts hierarchy
export const useFundingHierarchy = (jwt) => {
  return useQuery(
    ['funding-hierarchy'],
    async () => {
      try {
        console.log('Fetching funding hierarchy...', URL_GET_FUNDING_HIERARCHY);
        const response = await getRequest(URL_GET_FUNDING_HIERARCHY, jwt);
        console.log('Funding API Response:', response);
        return response.data;
      } catch (error) {
        console.error('Funding API Error:', error);
        throw error;
      }
    },
    {
      enabled: !!jwt,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    }
  );
};

// Hook to get Cash Funding Accounts for parent account selection
export const useCashFundingAccounts = (jwt) => {
  return useQuery(
    ['cash-funding-accounts'],
    async () => {
      try {
        console.log('Fetching cash funding accounts...', URL_GET_CASH_FUNDING_ACCOUNTS);
        const response = await getRequest(URL_GET_CASH_FUNDING_ACCOUNTS, jwt);
        console.log('Cash Funding API Response:', response);
        return response.data;
      } catch (error) {
        console.error('Cash Funding API Error:', error);
        throw error;
      }
    },
    {
      enabled: !!jwt,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    }
  );
};

// Hook to add new COA account
export const useAddCOA = (jwt) => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (accountData) => {
      const response = await postRequest(URL_ADD_COA, accountData, jwt);
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch both hierarchies
        queryClient.invalidateQueries(['coa-hierarchy']);
        queryClient.invalidateQueries(['funding-hierarchy']);
      },
    }
  );
};

// Hook to update COA account
export const useUpdateCOA = (jwt) => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (accountData) => {
      const response = await updateRequest(URL_UPDATE_COA, accountData.id, accountData, jwt);
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch both hierarchies
        queryClient.invalidateQueries(['coa-hierarchy']);
        queryClient.invalidateQueries(['funding-hierarchy']);
      },
    }
  );
};

// Hook to delete COA account
export const useDeleteCOA = (jwt) => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (accountId) => {
      const response = await deleteRequest(URL_DELETE_COA, accountId, jwt);
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch both hierarchies
        queryClient.invalidateQueries(['coa-hierarchy']);
        queryClient.invalidateQueries(['funding-hierarchy']);
      },
    }
  );
};
