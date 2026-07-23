/* eslint-disable */
import {
  useInfiniteQuery,
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseInfiniteQueryResult,
  DefinedUseQueryResult,
  InfiniteData,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  GetApiV10Notifications200,
  GetApiV10NotificationsParams,
  PostApiV10NotificationsBody,
  PutApiV10NotificationsMarkAsReadParams
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * @summary Subscribe to notification stream (SSE)
 */
export const getApiV10NotificationsStream = (
    
 signal?: AbortSignal
) => {
      
      
      return mainInstance<string>(
      {url: `/api/v1.0/notifications/stream`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10NotificationsStreamInfiniteQueryKey = () => {
    return [
    'infinite', `/api/v1.0/notifications/stream`
    ] as const;
    }

export const getGetApiV10NotificationsStreamQueryKey = () => {
    return [
    `/api/v1.0/notifications/stream`
    ] as const;
    }

    
export const getGetApiV10NotificationsStreamInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getApiV10NotificationsStream>>>, TError = unknown>( options?: { query?:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10NotificationsStreamInfiniteQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10NotificationsStream>>> = ({ signal }) => getApiV10NotificationsStream(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10NotificationsStreamInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10NotificationsStream>>>
export type GetApiV10NotificationsStreamInfiniteQueryError = unknown


export function useGetApiV10NotificationsStreamInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getApiV10NotificationsStream>>>, TError = unknown>(
  options: { query:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10NotificationsStream>>,
          TError,
          Awaited<ReturnType<typeof getApiV10NotificationsStream>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10NotificationsStreamInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getApiV10NotificationsStream>>>, TError = unknown>(
  options?: { query?:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10NotificationsStream>>,
          TError,
          Awaited<ReturnType<typeof getApiV10NotificationsStream>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10NotificationsStreamInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getApiV10NotificationsStream>>>, TError = unknown>(
  options?: { query?:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Subscribe to notification stream (SSE)
 */

export function useGetApiV10NotificationsStreamInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getApiV10NotificationsStream>>>, TError = unknown>(
  options?: { query?:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10NotificationsStreamInfiniteQueryOptions(options)

  const query = useInfiniteQuery(queryOptions, queryClient) as  UseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const getGetApiV10NotificationsStreamQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError = unknown>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10NotificationsStreamQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10NotificationsStream>>> = ({ signal }) => getApiV10NotificationsStream(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10NotificationsStreamQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10NotificationsStream>>>
export type GetApiV10NotificationsStreamQueryError = unknown


export function useGetApiV10NotificationsStream<TData = Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError = unknown>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10NotificationsStream>>,
          TError,
          Awaited<ReturnType<typeof getApiV10NotificationsStream>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10NotificationsStream<TData = Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10NotificationsStream>>,
          TError,
          Awaited<ReturnType<typeof getApiV10NotificationsStream>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10NotificationsStream<TData = Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Subscribe to notification stream (SSE)
 */

export function useGetApiV10NotificationsStream<TData = Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10NotificationsStream>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10NotificationsStreamQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Get notifications of current user
 */
export const getApiV10Notifications = (
    params?: GetApiV10NotificationsParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10Notifications200>(
      {url: `/api/v1.0/notifications`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10NotificationsInfiniteQueryKey = (params?: GetApiV10NotificationsParams,) => {
    return [
    'infinite', `/api/v1.0/notifications`, ...(params ? [params]: [])
    ] as const;
    }

export const getGetApiV10NotificationsQueryKey = (params?: GetApiV10NotificationsParams,) => {
    return [
    `/api/v1.0/notifications`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10NotificationsInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getApiV10Notifications>>, GetApiV10NotificationsParams['page']>, TError = unknown>(params?: GetApiV10NotificationsParams, options?: { query?:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV10Notifications>>, TError, TData, QueryKey, GetApiV10NotificationsParams['page']>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10NotificationsInfiniteQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Notifications>>, QueryKey, GetApiV10NotificationsParams['page']> = ({ signal, pageParam }) => getApiV10Notifications({...params, 'page': pageParam || params?.['page']}, signal);

      

      

   return  { queryKey, queryFn, getNextPageParam: (lastPage: Awaited<ReturnType<typeof getApiV10Notifications>>, _allPages: Awaited<ReturnType<typeof getApiV10Notifications>>[], lastPageParam: GetApiV10NotificationsParams['page']) => {
     const currentPage = (lastPageParam ?? params?.page ?? 1) as number;
     const responseData = (lastPage as any)?.responseData;
     const hasMore = Array.isArray(responseData) ? responseData.length > 0 : false;
     return hasMore ? (currentPage + 1) as GetApiV10NotificationsParams['page'] : undefined;
   }, initialPageParam: (params?.page ?? 1) as GetApiV10NotificationsParams['page'], ...queryOptions} as UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV10Notifications>>, TError, TData, QueryKey, GetApiV10NotificationsParams['page']> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10NotificationsInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Notifications>>>
export type GetApiV10NotificationsInfiniteQueryError = unknown


export function useGetApiV10NotificationsInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getApiV10Notifications>>, GetApiV10NotificationsParams['page']>, TError = unknown>(
 params: undefined |  GetApiV10NotificationsParams, options: { query:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV10Notifications>>, TError, TData, QueryKey, GetApiV10NotificationsParams['page']>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Notifications>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Notifications>>, QueryKey
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10NotificationsInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getApiV10Notifications>>, GetApiV10NotificationsParams['page']>, TError = unknown>(
 params?: GetApiV10NotificationsParams, options?: { query?:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV10Notifications>>, TError, TData, QueryKey, GetApiV10NotificationsParams['page']>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Notifications>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Notifications>>, QueryKey
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10NotificationsInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getApiV10Notifications>>, GetApiV10NotificationsParams['page']>, TError = unknown>(
 params?: GetApiV10NotificationsParams, options?: { query?:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV10Notifications>>, TError, TData, QueryKey, GetApiV10NotificationsParams['page']>>, }
 , queryClient?: QueryClient
  ):  UseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get notifications of current user
 */

export function useGetApiV10NotificationsInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getApiV10Notifications>>, GetApiV10NotificationsParams['page']>, TError = unknown>(
 params?: GetApiV10NotificationsParams, options?: { query?:Partial<UseInfiniteQueryOptions<Awaited<ReturnType<typeof getApiV10Notifications>>, TError, TData, QueryKey, GetApiV10NotificationsParams['page']>>, }
 , queryClient?: QueryClient 
 ):  UseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10NotificationsInfiniteQueryOptions(params,options)

  const query = useInfiniteQuery(queryOptions, queryClient) as  UseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




export const getGetApiV10NotificationsQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Notifications>>, TError = unknown>(params?: GetApiV10NotificationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Notifications>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10NotificationsQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Notifications>>> = ({ signal }) => getApiV10Notifications(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Notifications>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10NotificationsQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Notifications>>>
export type GetApiV10NotificationsQueryError = unknown


export function useGetApiV10Notifications<TData = Awaited<ReturnType<typeof getApiV10Notifications>>, TError = unknown>(
 params: undefined |  GetApiV10NotificationsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Notifications>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Notifications>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Notifications>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Notifications<TData = Awaited<ReturnType<typeof getApiV10Notifications>>, TError = unknown>(
 params?: GetApiV10NotificationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Notifications>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Notifications>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Notifications>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Notifications<TData = Awaited<ReturnType<typeof getApiV10Notifications>>, TError = unknown>(
 params?: GetApiV10NotificationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Notifications>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get notifications of current user
 */

export function useGetApiV10Notifications<TData = Awaited<ReturnType<typeof getApiV10Notifications>>, TError = unknown>(
 params?: GetApiV10NotificationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Notifications>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10NotificationsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Create notification
 */
export const postApiV10Notifications = (
    postApiV10NotificationsBody: PostApiV10NotificationsBody,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/notifications`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: postApiV10NotificationsBody, signal
    },
      );
    }
  


export const getPostApiV10NotificationsMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Notifications>>, TError,{data: PostApiV10NotificationsBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Notifications>>, TError,{data: PostApiV10NotificationsBody}, TContext> => {

const mutationKey = ['postApiV10Notifications'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Notifications>>, {data: PostApiV10NotificationsBody}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Notifications(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10NotificationsMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Notifications>>>
    export type PostApiV10NotificationsMutationBody = PostApiV10NotificationsBody
    export type PostApiV10NotificationsMutationError = unknown

    /**
 * @summary Create notification
 */
export const usePostApiV10Notifications = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Notifications>>, TError,{data: PostApiV10NotificationsBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Notifications>>,
        TError,
        {data: PostApiV10NotificationsBody},
        TContext
      > => {

      const mutationOptions = getPostApiV10NotificationsMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Mark a notification as read
 */
export const putApiV10NotificationsMarkAsReadId = (
    id: string,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/notifications/markAsRead/${id}`, method: 'PUT'
    },
      );
    }
  


export const getPutApiV10NotificationsMarkAsReadIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10NotificationsMarkAsReadId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10NotificationsMarkAsReadId>>, TError,{id: string}, TContext> => {

const mutationKey = ['putApiV10NotificationsMarkAsReadId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10NotificationsMarkAsReadId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  putApiV10NotificationsMarkAsReadId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10NotificationsMarkAsReadIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10NotificationsMarkAsReadId>>>
    
    export type PutApiV10NotificationsMarkAsReadIdMutationError = unknown

    /**
 * @summary Mark a notification as read
 */
export const usePutApiV10NotificationsMarkAsReadId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10NotificationsMarkAsReadId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10NotificationsMarkAsReadId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getPutApiV10NotificationsMarkAsReadIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Mark all notifications as read for current user
 */
export const putApiV10NotificationsMarkAsRead = (
    params?: PutApiV10NotificationsMarkAsReadParams,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/notifications/markAsRead`, method: 'PUT',
        params
    },
      );
    }
  


export const getPutApiV10NotificationsMarkAsReadMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10NotificationsMarkAsRead>>, TError,{params?: PutApiV10NotificationsMarkAsReadParams}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10NotificationsMarkAsRead>>, TError,{params?: PutApiV10NotificationsMarkAsReadParams}, TContext> => {

const mutationKey = ['putApiV10NotificationsMarkAsRead'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10NotificationsMarkAsRead>>, {params?: PutApiV10NotificationsMarkAsReadParams}> = (props) => {
          const {params} = props ?? {};

          return  putApiV10NotificationsMarkAsRead(params,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10NotificationsMarkAsReadMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10NotificationsMarkAsRead>>>
    
    export type PutApiV10NotificationsMarkAsReadMutationError = unknown

    /**
 * @summary Mark all notifications as read for current user
 */
export const usePutApiV10NotificationsMarkAsRead = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10NotificationsMarkAsRead>>, TError,{params?: PutApiV10NotificationsMarkAsReadParams}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10NotificationsMarkAsRead>>,
        TError,
        {params?: PutApiV10NotificationsMarkAsReadParams},
        TContext
      > => {

      const mutationOptions = getPutApiV10NotificationsMarkAsReadMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    