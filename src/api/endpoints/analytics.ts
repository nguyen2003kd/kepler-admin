/* eslint-disable */
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  GetApiV10AnalyticsActiveUsers200,
  GetApiV10AnalyticsActiveUsersParams,
  GetApiV10AnalyticsTopPages200,
  GetMonthlyTrafficRequest,
  PostApiV10AnalyticsMonthlyTraffic200
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * @summary Get active users and total page views from Google Analytics
 */
export const getApiV10AnalyticsActiveUsers = (
    params?: GetApiV10AnalyticsActiveUsersParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10AnalyticsActiveUsers200>(
      {url: `/api/v1.0/analytics/activeUsers`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10AnalyticsActiveUsersQueryKey = (params?: GetApiV10AnalyticsActiveUsersParams,) => {
    return [
    `/api/v1.0/analytics/activeUsers`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10AnalyticsActiveUsersQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>, TError = void>(params?: GetApiV10AnalyticsActiveUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10AnalyticsActiveUsersQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>> = ({ signal }) => getApiV10AnalyticsActiveUsers(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10AnalyticsActiveUsersQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>>
export type GetApiV10AnalyticsActiveUsersQueryError = void


export function useGetApiV10AnalyticsActiveUsers<TData = Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>, TError = void>(
 params: undefined |  GetApiV10AnalyticsActiveUsersParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>,
          TError,
          Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10AnalyticsActiveUsers<TData = Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>, TError = void>(
 params?: GetApiV10AnalyticsActiveUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>,
          TError,
          Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10AnalyticsActiveUsers<TData = Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>, TError = void>(
 params?: GetApiV10AnalyticsActiveUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get active users and total page views from Google Analytics
 */

export function useGetApiV10AnalyticsActiveUsers<TData = Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>, TError = void>(
 params?: GetApiV10AnalyticsActiveUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsActiveUsers>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10AnalyticsActiveUsersQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Debug Google Analytics connection and data
 */
export const getApiV10AnalyticsDebug = (
    
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/analytics/debug`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10AnalyticsDebugQueryKey = () => {
    return [
    `/api/v1.0/analytics/debug`
    ] as const;
    }

    
export const getGetApiV10AnalyticsDebugQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>, TError = void>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10AnalyticsDebugQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>> = ({ signal }) => getApiV10AnalyticsDebug(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10AnalyticsDebugQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>>
export type GetApiV10AnalyticsDebugQueryError = void


export function useGetApiV10AnalyticsDebug<TData = Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>, TError = void>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>,
          TError,
          Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10AnalyticsDebug<TData = Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>, TError = void>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>,
          TError,
          Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10AnalyticsDebug<TData = Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>, TError = void>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Debug Google Analytics connection and data
 */

export function useGetApiV10AnalyticsDebug<TData = Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>, TError = void>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsDebug>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10AnalyticsDebugQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Get monthly traffic data for a specific year
 */
export const postApiV10AnalyticsMonthlyTraffic = (
    getMonthlyTrafficRequest: GetMonthlyTrafficRequest,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10AnalyticsMonthlyTraffic200>(
      {url: `/api/v1.0/analytics/monthly-traffic`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: getMonthlyTrafficRequest, signal
    },
      );
    }
  


export const getPostApiV10AnalyticsMonthlyTrafficMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AnalyticsMonthlyTraffic>>, TError,{data: GetMonthlyTrafficRequest}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10AnalyticsMonthlyTraffic>>, TError,{data: GetMonthlyTrafficRequest}, TContext> => {

const mutationKey = ['postApiV10AnalyticsMonthlyTraffic'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10AnalyticsMonthlyTraffic>>, {data: GetMonthlyTrafficRequest}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10AnalyticsMonthlyTraffic(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10AnalyticsMonthlyTrafficMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10AnalyticsMonthlyTraffic>>>
    export type PostApiV10AnalyticsMonthlyTrafficMutationBody = GetMonthlyTrafficRequest
    export type PostApiV10AnalyticsMonthlyTrafficMutationError = void

    /**
 * @summary Get monthly traffic data for a specific year
 */
export const usePostApiV10AnalyticsMonthlyTraffic = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AnalyticsMonthlyTraffic>>, TError,{data: GetMonthlyTrafficRequest}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10AnalyticsMonthlyTraffic>>,
        TError,
        {data: GetMonthlyTrafficRequest},
        TContext
      > => {

      const mutationOptions = getPostApiV10AnalyticsMonthlyTrafficMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Get top viewed pages from Google Analytics
 */
export const getApiV10AnalyticsTopPages = (
    
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10AnalyticsTopPages200>(
      {url: `/api/v1.0/analytics/top-pages`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10AnalyticsTopPagesQueryKey = () => {
    return [
    `/api/v1.0/analytics/top-pages`
    ] as const;
    }

    
export const getGetApiV10AnalyticsTopPagesQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>, TError = void>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10AnalyticsTopPagesQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>> = ({ signal }) => getApiV10AnalyticsTopPages(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10AnalyticsTopPagesQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>>
export type GetApiV10AnalyticsTopPagesQueryError = void


export function useGetApiV10AnalyticsTopPages<TData = Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>, TError = void>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>,
          TError,
          Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10AnalyticsTopPages<TData = Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>, TError = void>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>,
          TError,
          Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10AnalyticsTopPages<TData = Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>, TError = void>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get top viewed pages from Google Analytics
 */

export function useGetApiV10AnalyticsTopPages<TData = Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>, TError = void>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AnalyticsTopPages>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10AnalyticsTopPagesQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




