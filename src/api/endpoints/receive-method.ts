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
  DeleteApiV10ReceiveMethodId200,
  GetApiV10ReceiveMethodId200,
  GetApiV10ReceiveMethodParams,
  PostApiV10ReceiveMethod200,
  PutApiV10ReceiveMethodId200,
  ReceiveMethodMutate,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single receiveMethod record by its ID
 * @summary Get receiveMethod by ID
 */
export const getApiV10ReceiveMethodId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10ReceiveMethodId200>(
      {url: `/api/v1.0/receiveMethod/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10ReceiveMethodIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/receiveMethod/${id}`
    ] as const;
    }

    
export const getGetApiV10ReceiveMethodIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10ReceiveMethodIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>> = ({ signal }) => getApiV10ReceiveMethodId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10ReceiveMethodIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>>
export type GetApiV10ReceiveMethodIdQueryError = void


export function useGetApiV10ReceiveMethodId<TData = Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10ReceiveMethodId<TData = Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10ReceiveMethodId<TData = Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get receiveMethod by ID
 */

export function useGetApiV10ReceiveMethodId<TData = Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ReceiveMethodId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10ReceiveMethodIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single receiveMethod record by its ID
 * @summary Update receiveMethod by ID
 */
export const putApiV10ReceiveMethodId = (
    id: string,
    receiveMethodMutate: ReceiveMethodMutate,
 ) => {
      
      
      return mainInstance<PutApiV10ReceiveMethodId200>(
      {url: `/api/v1.0/receiveMethod/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: receiveMethodMutate
    },
      );
    }
  


export const getPutApiV10ReceiveMethodIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10ReceiveMethodId>>, TError,{id: string;data: ReceiveMethodMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10ReceiveMethodId>>, TError,{id: string;data: ReceiveMethodMutate}, TContext> => {

const mutationKey = ['putApiV10ReceiveMethodId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10ReceiveMethodId>>, {id: string;data: ReceiveMethodMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10ReceiveMethodId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10ReceiveMethodIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10ReceiveMethodId>>>
    export type PutApiV10ReceiveMethodIdMutationBody = ReceiveMethodMutate
    export type PutApiV10ReceiveMethodIdMutationError = void

    /**
 * @summary Update receiveMethod by ID
 */
export const usePutApiV10ReceiveMethodId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10ReceiveMethodId>>, TError,{id: string;data: ReceiveMethodMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10ReceiveMethodId>>,
        TError,
        {id: string;data: ReceiveMethodMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10ReceiveMethodIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single receiveMethod record by its ID
 * @summary Delete receiveMethod by ID
 */
export const deleteApiV10ReceiveMethodId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10ReceiveMethodId200>(
      {url: `/api/v1.0/receiveMethod/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10ReceiveMethodIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10ReceiveMethodId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10ReceiveMethodId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10ReceiveMethodId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10ReceiveMethodId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10ReceiveMethodId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10ReceiveMethodIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10ReceiveMethodId>>>
    
    export type DeleteApiV10ReceiveMethodIdMutationError = void

    /**
 * @summary Delete receiveMethod by ID
 */
export const useDeleteApiV10ReceiveMethodId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10ReceiveMethodId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10ReceiveMethodId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10ReceiveMethodIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of receiveMethod with pagination, filtering and sorting
 * @summary Get all receiveMethod
 */
export const getApiV10ReceiveMethod = (
    params?: GetApiV10ReceiveMethodParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/receiveMethod`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10ReceiveMethodQueryKey = (params?: GetApiV10ReceiveMethodParams,) => {
    return [
    `/api/v1.0/receiveMethod`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10ReceiveMethodQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10ReceiveMethod>>, TError = unknown>(params?: GetApiV10ReceiveMethodParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ReceiveMethod>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10ReceiveMethodQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10ReceiveMethod>>> = ({ signal }) => getApiV10ReceiveMethod(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10ReceiveMethod>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10ReceiveMethodQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10ReceiveMethod>>>
export type GetApiV10ReceiveMethodQueryError = unknown


export function useGetApiV10ReceiveMethod<TData = Awaited<ReturnType<typeof getApiV10ReceiveMethod>>, TError = unknown>(
 params: undefined |  GetApiV10ReceiveMethodParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ReceiveMethod>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10ReceiveMethod>>,
          TError,
          Awaited<ReturnType<typeof getApiV10ReceiveMethod>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10ReceiveMethod<TData = Awaited<ReturnType<typeof getApiV10ReceiveMethod>>, TError = unknown>(
 params?: GetApiV10ReceiveMethodParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ReceiveMethod>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10ReceiveMethod>>,
          TError,
          Awaited<ReturnType<typeof getApiV10ReceiveMethod>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10ReceiveMethod<TData = Awaited<ReturnType<typeof getApiV10ReceiveMethod>>, TError = unknown>(
 params?: GetApiV10ReceiveMethodParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ReceiveMethod>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all receiveMethod
 */

export function useGetApiV10ReceiveMethod<TData = Awaited<ReturnType<typeof getApiV10ReceiveMethod>>, TError = unknown>(
 params?: GetApiV10ReceiveMethodParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ReceiveMethod>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10ReceiveMethodQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new receiveMethod record
 * @summary Create a receiveMethod
 */
export const postApiV10ReceiveMethod = (
    receiveMethodMutate: ReceiveMethodMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10ReceiveMethod200>(
      {url: `/api/v1.0/receiveMethod`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: receiveMethodMutate, signal
    },
      );
    }
  


export const getPostApiV10ReceiveMethodMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10ReceiveMethod>>, TError,{data: ReceiveMethodMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10ReceiveMethod>>, TError,{data: ReceiveMethodMutate}, TContext> => {

const mutationKey = ['postApiV10ReceiveMethod'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10ReceiveMethod>>, {data: ReceiveMethodMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10ReceiveMethod(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10ReceiveMethodMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10ReceiveMethod>>>
    export type PostApiV10ReceiveMethodMutationBody = ReceiveMethodMutate
    export type PostApiV10ReceiveMethodMutationError = unknown

    /**
 * @summary Create a receiveMethod
 */
export const usePostApiV10ReceiveMethod = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10ReceiveMethod>>, TError,{data: ReceiveMethodMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10ReceiveMethod>>,
        TError,
        {data: ReceiveMethodMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10ReceiveMethodMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    