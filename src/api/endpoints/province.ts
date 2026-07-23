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
  GetApiV10Province200
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * @summary Get Vietnam provinces from external API
 */
export const getApiV10Province = (
    
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10Province200>(
      {url: `/api/v1.0/province`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10ProvinceQueryKey = () => {
    return [
    `/api/v1.0/province`
    ] as const;
    }

    
export const getGetApiV10ProvinceQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Province>>, TError = unknown>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Province>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10ProvinceQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Province>>> = ({ signal }) => getApiV10Province(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Province>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10ProvinceQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Province>>>
export type GetApiV10ProvinceQueryError = unknown


export function useGetApiV10Province<TData = Awaited<ReturnType<typeof getApiV10Province>>, TError = unknown>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Province>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Province>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Province>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Province<TData = Awaited<ReturnType<typeof getApiV10Province>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Province>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Province>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Province>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Province<TData = Awaited<ReturnType<typeof getApiV10Province>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Province>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get Vietnam provinces from external API
 */

export function useGetApiV10Province<TData = Awaited<ReturnType<typeof getApiV10Province>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Province>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10ProvinceQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




