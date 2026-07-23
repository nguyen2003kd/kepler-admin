/* eslint-disable */
import {
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  GetApiV10PostApprovalHistoryParams,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a list of post approval histories with pagination, filtering and sorting
 * @summary Get all post approval histories
 */
export const getApiV10PostApprovalHistory = (
    params?: GetApiV10PostApprovalHistoryParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/postApprovalHistory`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10PostApprovalHistoryQueryKey = (params?: GetApiV10PostApprovalHistoryParams,) => {
    return [
    `/api/v1.0/postApprovalHistory`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10PostApprovalHistoryQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>, TError = unknown>(params?: GetApiV10PostApprovalHistoryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PostApprovalHistoryQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>> = ({ signal }) => getApiV10PostApprovalHistory(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PostApprovalHistoryQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>>
export type GetApiV10PostApprovalHistoryQueryError = unknown


export function useGetApiV10PostApprovalHistory<TData = Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>, TError = unknown>(
 params: undefined |  GetApiV10PostApprovalHistoryParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PostApprovalHistory<TData = Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>, TError = unknown>(
 params?: GetApiV10PostApprovalHistoryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PostApprovalHistory<TData = Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>, TError = unknown>(
 params?: GetApiV10PostApprovalHistoryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all post approval histories
 */

export function useGetApiV10PostApprovalHistory<TData = Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>, TError = unknown>(
 params?: GetApiV10PostApprovalHistoryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostApprovalHistory>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PostApprovalHistoryQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




