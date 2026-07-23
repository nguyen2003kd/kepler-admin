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
  DeleteApiV10QuotationStatusId200,
  GetApiV10QuotationStatusId200,
  GetApiV10QuotationStatusParams,
  PostApiV10QuotationStatus200,
  PutApiV10QuotationStatusId200,
  QuotationStatusMutate,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single quotationStatus record by its ID
 * @summary Get quotationStatus by ID
 */
export const getApiV10QuotationStatusId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10QuotationStatusId200>(
      {url: `/api/v1.0/quotationStatus/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10QuotationStatusIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/quotationStatus/${id}`
    ] as const;
    }

    
export const getGetApiV10QuotationStatusIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10QuotationStatusId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationStatusId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10QuotationStatusIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10QuotationStatusId>>> = ({ signal }) => getApiV10QuotationStatusId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationStatusId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10QuotationStatusIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10QuotationStatusId>>>
export type GetApiV10QuotationStatusIdQueryError = void


export function useGetApiV10QuotationStatusId<TData = Awaited<ReturnType<typeof getApiV10QuotationStatusId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationStatusId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10QuotationStatusId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10QuotationStatusId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10QuotationStatusId<TData = Awaited<ReturnType<typeof getApiV10QuotationStatusId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationStatusId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10QuotationStatusId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10QuotationStatusId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10QuotationStatusId<TData = Awaited<ReturnType<typeof getApiV10QuotationStatusId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationStatusId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get quotationStatus by ID
 */

export function useGetApiV10QuotationStatusId<TData = Awaited<ReturnType<typeof getApiV10QuotationStatusId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationStatusId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10QuotationStatusIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single quotationStatus record by its ID
 * @summary Update quotationStatus by ID
 */
export const putApiV10QuotationStatusId = (
    id: string,
    quotationStatusMutate: QuotationStatusMutate,
 ) => {
      
      
      return mainInstance<PutApiV10QuotationStatusId200>(
      {url: `/api/v1.0/quotationStatus/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: quotationStatusMutate
    },
      );
    }
  


export const getPutApiV10QuotationStatusIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10QuotationStatusId>>, TError,{id: string;data: QuotationStatusMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10QuotationStatusId>>, TError,{id: string;data: QuotationStatusMutate}, TContext> => {

const mutationKey = ['putApiV10QuotationStatusId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10QuotationStatusId>>, {id: string;data: QuotationStatusMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10QuotationStatusId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10QuotationStatusIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10QuotationStatusId>>>
    export type PutApiV10QuotationStatusIdMutationBody = QuotationStatusMutate
    export type PutApiV10QuotationStatusIdMutationError = void

    /**
 * @summary Update quotationStatus by ID
 */
export const usePutApiV10QuotationStatusId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10QuotationStatusId>>, TError,{id: string;data: QuotationStatusMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10QuotationStatusId>>,
        TError,
        {id: string;data: QuotationStatusMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10QuotationStatusIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single quotationStatus record by its ID
 * @summary Delete quotationStatus by ID
 */
export const deleteApiV10QuotationStatusId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10QuotationStatusId200>(
      {url: `/api/v1.0/quotationStatus/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10QuotationStatusIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10QuotationStatusId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10QuotationStatusId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10QuotationStatusId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10QuotationStatusId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10QuotationStatusId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10QuotationStatusIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10QuotationStatusId>>>
    
    export type DeleteApiV10QuotationStatusIdMutationError = void

    /**
 * @summary Delete quotationStatus by ID
 */
export const useDeleteApiV10QuotationStatusId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10QuotationStatusId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10QuotationStatusId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10QuotationStatusIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of quotationStatus with pagination, filtering and sorting
 * @summary Get all quotationStatus
 */
export const getApiV10QuotationStatus = (
    params?: GetApiV10QuotationStatusParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/quotationStatus`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10QuotationStatusQueryKey = (params?: GetApiV10QuotationStatusParams,) => {
    return [
    `/api/v1.0/quotationStatus`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10QuotationStatusQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10QuotationStatus>>, TError = unknown>(params?: GetApiV10QuotationStatusParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationStatus>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10QuotationStatusQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10QuotationStatus>>> = ({ signal }) => getApiV10QuotationStatus(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationStatus>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10QuotationStatusQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10QuotationStatus>>>
export type GetApiV10QuotationStatusQueryError = unknown


export function useGetApiV10QuotationStatus<TData = Awaited<ReturnType<typeof getApiV10QuotationStatus>>, TError = unknown>(
 params: undefined |  GetApiV10QuotationStatusParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationStatus>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10QuotationStatus>>,
          TError,
          Awaited<ReturnType<typeof getApiV10QuotationStatus>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10QuotationStatus<TData = Awaited<ReturnType<typeof getApiV10QuotationStatus>>, TError = unknown>(
 params?: GetApiV10QuotationStatusParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationStatus>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10QuotationStatus>>,
          TError,
          Awaited<ReturnType<typeof getApiV10QuotationStatus>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10QuotationStatus<TData = Awaited<ReturnType<typeof getApiV10QuotationStatus>>, TError = unknown>(
 params?: GetApiV10QuotationStatusParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationStatus>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all quotationStatus
 */

export function useGetApiV10QuotationStatus<TData = Awaited<ReturnType<typeof getApiV10QuotationStatus>>, TError = unknown>(
 params?: GetApiV10QuotationStatusParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationStatus>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10QuotationStatusQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new quotationStatus record
 * @summary Create a quotationStatus
 */
export const postApiV10QuotationStatus = (
    quotationStatusMutate: QuotationStatusMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10QuotationStatus200>(
      {url: `/api/v1.0/quotationStatus`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: quotationStatusMutate, signal
    },
      );
    }
  


export const getPostApiV10QuotationStatusMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10QuotationStatus>>, TError,{data: QuotationStatusMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10QuotationStatus>>, TError,{data: QuotationStatusMutate}, TContext> => {

const mutationKey = ['postApiV10QuotationStatus'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10QuotationStatus>>, {data: QuotationStatusMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10QuotationStatus(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10QuotationStatusMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10QuotationStatus>>>
    export type PostApiV10QuotationStatusMutationBody = QuotationStatusMutate
    export type PostApiV10QuotationStatusMutationError = unknown

    /**
 * @summary Create a quotationStatus
 */
export const usePostApiV10QuotationStatus = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10QuotationStatus>>, TError,{data: QuotationStatusMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10QuotationStatus>>,
        TError,
        {data: QuotationStatusMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10QuotationStatusMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    