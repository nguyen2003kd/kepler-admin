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
  HealthCheck
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Check the health status of the service, database, and redis connections
 * @summary Health check endpoint
 */
export const getApiV10Health = (
    
 signal?: AbortSignal
) => {
      
      
      return mainInstance<HealthCheck>(
      {url: `/api/v1.0/health`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10HealthQueryKey = () => {
    return [
    `/api/v1.0/health`
    ] as const;
    }

    
export const getGetApiV10HealthQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Health>>, TError = HealthCheck>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Health>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10HealthQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Health>>> = ({ signal }) => getApiV10Health(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Health>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10HealthQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Health>>>
export type GetApiV10HealthQueryError = HealthCheck


export function useGetApiV10Health<TData = Awaited<ReturnType<typeof getApiV10Health>>, TError = HealthCheck>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Health>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Health>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Health>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Health<TData = Awaited<ReturnType<typeof getApiV10Health>>, TError = HealthCheck>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Health>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Health>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Health>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Health<TData = Awaited<ReturnType<typeof getApiV10Health>>, TError = HealthCheck>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Health>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Health check endpoint
 */

export function useGetApiV10Health<TData = Awaited<ReturnType<typeof getApiV10Health>>, TError = HealthCheck>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Health>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10HealthQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




