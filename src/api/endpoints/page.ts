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
  DeleteApiV10PageId200,
  GetApiV10PageId200,
  GetApiV10PageParams,
  PageMutate,
  PostApiV10Page200,
  PutApiV10PageId200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single page record by its ID
 * @summary Get page by ID
 */
export const getApiV10PageId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10PageId200>(
      {url: `/api/v1.0/page/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10PageIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/page/${id}`
    ] as const;
    }

    
export const getGetApiV10PageIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10PageId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PageIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10PageId>>> = ({ signal }) => getApiV10PageId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PageIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10PageId>>>
export type GetApiV10PageIdQueryError = void


export function useGetApiV10PageId<TData = Awaited<ReturnType<typeof getApiV10PageId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PageId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PageId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PageId<TData = Awaited<ReturnType<typeof getApiV10PageId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PageId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PageId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PageId<TData = Awaited<ReturnType<typeof getApiV10PageId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get page by ID
 */

export function useGetApiV10PageId<TData = Awaited<ReturnType<typeof getApiV10PageId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PageIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single page record by its ID
 * @summary Update page by ID
 */
export const putApiV10PageId = (
    id: string,
    pageMutate: PageMutate,
 ) => {
      
      
      return mainInstance<PutApiV10PageId200>(
      {url: `/api/v1.0/page/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: pageMutate
    },
      );
    }
  


export const getPutApiV10PageIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10PageId>>, TError,{id: string;data: PageMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10PageId>>, TError,{id: string;data: PageMutate}, TContext> => {

const mutationKey = ['putApiV10PageId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10PageId>>, {id: string;data: PageMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10PageId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10PageIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10PageId>>>
    export type PutApiV10PageIdMutationBody = PageMutate
    export type PutApiV10PageIdMutationError = void

    /**
 * @summary Update page by ID
 */
export const usePutApiV10PageId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10PageId>>, TError,{id: string;data: PageMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10PageId>>,
        TError,
        {id: string;data: PageMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10PageIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single page record by its ID
 * @summary Delete page by ID
 */
export const deleteApiV10PageId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10PageId200>(
      {url: `/api/v1.0/page/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10PageIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PageId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PageId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10PageId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10PageId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10PageId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10PageIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10PageId>>>
    
    export type DeleteApiV10PageIdMutationError = void

    /**
 * @summary Delete page by ID
 */
export const useDeleteApiV10PageId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PageId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10PageId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10PageIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of page with pagination, filtering and sorting
 * @summary Get all page
 */
export const getApiV10Page = (
    params?: GetApiV10PageParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/page`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10PageQueryKey = (params?: GetApiV10PageParams,) => {
    return [
    `/api/v1.0/page`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10PageQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Page>>, TError = unknown>(params?: GetApiV10PageParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Page>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PageQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Page>>> = ({ signal }) => getApiV10Page(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Page>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PageQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Page>>>
export type GetApiV10PageQueryError = unknown


export function useGetApiV10Page<TData = Awaited<ReturnType<typeof getApiV10Page>>, TError = unknown>(
 params: undefined |  GetApiV10PageParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Page>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Page>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Page>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Page<TData = Awaited<ReturnType<typeof getApiV10Page>>, TError = unknown>(
 params?: GetApiV10PageParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Page>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Page>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Page>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Page<TData = Awaited<ReturnType<typeof getApiV10Page>>, TError = unknown>(
 params?: GetApiV10PageParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Page>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all page
 */

export function useGetApiV10Page<TData = Awaited<ReturnType<typeof getApiV10Page>>, TError = unknown>(
 params?: GetApiV10PageParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Page>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PageQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new page record
 * @summary Create a page
 */
export const postApiV10Page = (
    pageMutate: PageMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10Page200>(
      {url: `/api/v1.0/page`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: pageMutate, signal
    },
      );
    }
  


export const getPostApiV10PageMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Page>>, TError,{data: PageMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Page>>, TError,{data: PageMutate}, TContext> => {

const mutationKey = ['postApiV10Page'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Page>>, {data: PageMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Page(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10PageMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Page>>>
    export type PostApiV10PageMutationBody = PageMutate
    export type PostApiV10PageMutationError = unknown

    /**
 * @summary Create a page
 */
export const usePostApiV10Page = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Page>>, TError,{data: PageMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Page>>,
        TError,
        {data: PageMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10PageMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    