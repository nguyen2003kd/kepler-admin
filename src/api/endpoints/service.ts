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
  DeleteApiV10ServiceId200,
  GetApiV10ServiceParams,
  PostApiV10Service200,
  PutApiV10ServiceId200,
  ResponseGetAllData,
  ServiceMutate
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Update a single Service record by its ID
 * @summary Update Service by ID
 */
export const putApiV10ServiceId = (
    id: string,
    serviceMutate: ServiceMutate,
 ) => {
      
      
      return mainInstance<PutApiV10ServiceId200>(
      {url: `/api/v1.0/service/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: serviceMutate
    },
      );
    }
  


export const getPutApiV10ServiceIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10ServiceId>>, TError,{id: string;data: ServiceMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10ServiceId>>, TError,{id: string;data: ServiceMutate}, TContext> => {

const mutationKey = ['putApiV10ServiceId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10ServiceId>>, {id: string;data: ServiceMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10ServiceId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10ServiceIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10ServiceId>>>
    export type PutApiV10ServiceIdMutationBody = ServiceMutate
    export type PutApiV10ServiceIdMutationError = void

    /**
 * @summary Update Service by ID
 */
export const usePutApiV10ServiceId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10ServiceId>>, TError,{id: string;data: ServiceMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10ServiceId>>,
        TError,
        {id: string;data: ServiceMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10ServiceIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single Service record by its ID
 * @summary Delete Service by ID
 */
export const deleteApiV10ServiceId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10ServiceId200>(
      {url: `/api/v1.0/Service/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10ServiceIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10ServiceId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10ServiceId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10ServiceId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10ServiceId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10ServiceId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10ServiceIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10ServiceId>>>
    
    export type DeleteApiV10ServiceIdMutationError = void

    /**
 * @summary Delete Service by ID
 */
export const useDeleteApiV10ServiceId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10ServiceId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10ServiceId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10ServiceIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of Service with pagination, filtering and sorting
 * @summary Get all Service
 */
export const getApiV10Service = (
    params?: GetApiV10ServiceParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/Service`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10ServiceQueryKey = (params?: GetApiV10ServiceParams,) => {
    return [
    `/api/v1.0/Service`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10ServiceQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Service>>, TError = unknown>(params?: GetApiV10ServiceParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Service>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10ServiceQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Service>>> = ({ signal }) => getApiV10Service(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Service>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10ServiceQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Service>>>
export type GetApiV10ServiceQueryError = unknown


export function useGetApiV10Service<TData = Awaited<ReturnType<typeof getApiV10Service>>, TError = unknown>(
 params: undefined |  GetApiV10ServiceParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Service>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Service>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Service>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Service<TData = Awaited<ReturnType<typeof getApiV10Service>>, TError = unknown>(
 params?: GetApiV10ServiceParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Service>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Service>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Service>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Service<TData = Awaited<ReturnType<typeof getApiV10Service>>, TError = unknown>(
 params?: GetApiV10ServiceParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Service>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all Service
 */

export function useGetApiV10Service<TData = Awaited<ReturnType<typeof getApiV10Service>>, TError = unknown>(
 params?: GetApiV10ServiceParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Service>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10ServiceQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new Service record
 * @summary Create a Service
 */
export const postApiV10Service = (
    serviceMutate: ServiceMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10Service200>(
      {url: `/api/v1.0/Service`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: serviceMutate, signal
    },
      );
    }
  


export const getPostApiV10ServiceMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Service>>, TError,{data: ServiceMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Service>>, TError,{data: ServiceMutate}, TContext> => {

const mutationKey = ['postApiV10Service'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Service>>, {data: ServiceMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Service(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10ServiceMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Service>>>
    export type PostApiV10ServiceMutationBody = ServiceMutate
    export type PostApiV10ServiceMutationError = unknown

    /**
 * @summary Create a Service
 */
export const usePostApiV10Service = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Service>>, TError,{data: ServiceMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Service>>,
        TError,
        {data: ServiceMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10ServiceMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    