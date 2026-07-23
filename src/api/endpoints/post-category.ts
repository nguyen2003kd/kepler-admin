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
  DeleteApiV10PostCategoryId200,
  GetApiV10PostCategoryId200,
  GetApiV10PostCategoryParams,
  PostApiV10PostCategory200,
  PostCategoryMutate,
  PutApiV10PostCategoryId200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single postCategory record by its ID
 * @summary Get postCategory by ID
 */
export const getApiV10PostCategoryId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10PostCategoryId200>(
      {url: `/api/v1.0/postCategory/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10PostCategoryIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/postCategory/${id}`
    ] as const;
    }

    
export const getGetApiV10PostCategoryIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10PostCategoryId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostCategoryId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PostCategoryIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10PostCategoryId>>> = ({ signal }) => getApiV10PostCategoryId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostCategoryId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PostCategoryIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10PostCategoryId>>>
export type GetApiV10PostCategoryIdQueryError = void


export function useGetApiV10PostCategoryId<TData = Awaited<ReturnType<typeof getApiV10PostCategoryId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostCategoryId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PostCategoryId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PostCategoryId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PostCategoryId<TData = Awaited<ReturnType<typeof getApiV10PostCategoryId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostCategoryId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PostCategoryId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PostCategoryId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PostCategoryId<TData = Awaited<ReturnType<typeof getApiV10PostCategoryId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostCategoryId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get postCategory by ID
 */

export function useGetApiV10PostCategoryId<TData = Awaited<ReturnType<typeof getApiV10PostCategoryId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostCategoryId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PostCategoryIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single postCategory record by its ID
 * @summary Update postCategory by ID
 */
export const putApiV10PostCategoryId = (
    id: string,
    postCategoryMutate: PostCategoryMutate,
 ) => {
      
      
      return mainInstance<PutApiV10PostCategoryId200>(
      {url: `/api/v1.0/postCategory/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: postCategoryMutate
    },
      );
    }
  


export const getPutApiV10PostCategoryIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10PostCategoryId>>, TError,{id: string;data: PostCategoryMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10PostCategoryId>>, TError,{id: string;data: PostCategoryMutate}, TContext> => {

const mutationKey = ['putApiV10PostCategoryId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10PostCategoryId>>, {id: string;data: PostCategoryMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10PostCategoryId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10PostCategoryIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10PostCategoryId>>>
    export type PutApiV10PostCategoryIdMutationBody = PostCategoryMutate
    export type PutApiV10PostCategoryIdMutationError = void

    /**
 * @summary Update postCategory by ID
 */
export const usePutApiV10PostCategoryId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10PostCategoryId>>, TError,{id: string;data: PostCategoryMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10PostCategoryId>>,
        TError,
        {id: string;data: PostCategoryMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10PostCategoryIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single postCategory record by its ID
 * @summary Delete postCategory by ID
 */
export const deleteApiV10PostCategoryId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10PostCategoryId200>(
      {url: `/api/v1.0/postCategory/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10PostCategoryIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PostCategoryId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PostCategoryId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10PostCategoryId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10PostCategoryId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10PostCategoryId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10PostCategoryIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10PostCategoryId>>>
    
    export type DeleteApiV10PostCategoryIdMutationError = void

    /**
 * @summary Delete postCategory by ID
 */
export const useDeleteApiV10PostCategoryId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PostCategoryId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10PostCategoryId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10PostCategoryIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of postCategory with pagination, filtering and sorting
 * @summary Get all postCategory
 */
export const getApiV10PostCategory = (
    params?: GetApiV10PostCategoryParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/postCategory`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10PostCategoryQueryKey = (params?: GetApiV10PostCategoryParams,) => {
    return [
    `/api/v1.0/postCategory`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10PostCategoryQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10PostCategory>>, TError = unknown>(params?: GetApiV10PostCategoryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostCategory>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PostCategoryQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10PostCategory>>> = ({ signal }) => getApiV10PostCategory(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostCategory>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PostCategoryQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10PostCategory>>>
export type GetApiV10PostCategoryQueryError = unknown


export function useGetApiV10PostCategory<TData = Awaited<ReturnType<typeof getApiV10PostCategory>>, TError = unknown>(
 params: undefined |  GetApiV10PostCategoryParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostCategory>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PostCategory>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PostCategory>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PostCategory<TData = Awaited<ReturnType<typeof getApiV10PostCategory>>, TError = unknown>(
 params?: GetApiV10PostCategoryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostCategory>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PostCategory>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PostCategory>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PostCategory<TData = Awaited<ReturnType<typeof getApiV10PostCategory>>, TError = unknown>(
 params?: GetApiV10PostCategoryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostCategory>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all postCategory
 */

export function useGetApiV10PostCategory<TData = Awaited<ReturnType<typeof getApiV10PostCategory>>, TError = unknown>(
 params?: GetApiV10PostCategoryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostCategory>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PostCategoryQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new postCategory record
 * @summary Create a postCategory
 */
export const postApiV10PostCategory = (
    postCategoryMutate: PostCategoryMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10PostCategory200>(
      {url: `/api/v1.0/postCategory`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: postCategoryMutate, signal
    },
      );
    }
  


export const getPostApiV10PostCategoryMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10PostCategory>>, TError,{data: PostCategoryMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10PostCategory>>, TError,{data: PostCategoryMutate}, TContext> => {

const mutationKey = ['postApiV10PostCategory'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10PostCategory>>, {data: PostCategoryMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10PostCategory(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10PostCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10PostCategory>>>
    export type PostApiV10PostCategoryMutationBody = PostCategoryMutate
    export type PostApiV10PostCategoryMutationError = unknown

    /**
 * @summary Create a postCategory
 */
export const usePostApiV10PostCategory = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10PostCategory>>, TError,{data: PostCategoryMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10PostCategory>>,
        TError,
        {data: PostCategoryMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10PostCategoryMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    