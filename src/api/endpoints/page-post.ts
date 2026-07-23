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
  DeleteApiV10PagePostId200,
  GetApiV10PagePostId200,
  GetApiV10PagePostParams,
  PagePostMutate,
  PostApiV10PagePost200,
  PutApiV10PagePostId200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single pagePost record by its ID
 * @summary Get pagePost by ID
 */
export const getApiV10PagePostId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10PagePostId200>(
      {url: `/api/v1.0/pagePost/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10PagePostIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/pagePost/${id}`
    ] as const;
    }

    
export const getGetApiV10PagePostIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10PagePostId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PagePostId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PagePostIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10PagePostId>>> = ({ signal }) => getApiV10PagePostId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10PagePostId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PagePostIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10PagePostId>>>
export type GetApiV10PagePostIdQueryError = void


export function useGetApiV10PagePostId<TData = Awaited<ReturnType<typeof getApiV10PagePostId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PagePostId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PagePostId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PagePostId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PagePostId<TData = Awaited<ReturnType<typeof getApiV10PagePostId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PagePostId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PagePostId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PagePostId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PagePostId<TData = Awaited<ReturnType<typeof getApiV10PagePostId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PagePostId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get pagePost by ID
 */

export function useGetApiV10PagePostId<TData = Awaited<ReturnType<typeof getApiV10PagePostId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PagePostId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PagePostIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single pagePost record by its ID
 * @summary Update pagePost by ID
 */
export const putApiV10PagePostId = (
    id: string,
    pagePostMutate: PagePostMutate,
 ) => {
      
      
      return mainInstance<PutApiV10PagePostId200>(
      {url: `/api/v1.0/pagePost/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: pagePostMutate
    },
      );
    }
  


export const getPutApiV10PagePostIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10PagePostId>>, TError,{id: string;data: PagePostMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10PagePostId>>, TError,{id: string;data: PagePostMutate}, TContext> => {

const mutationKey = ['putApiV10PagePostId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10PagePostId>>, {id: string;data: PagePostMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10PagePostId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10PagePostIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10PagePostId>>>
    export type PutApiV10PagePostIdMutationBody = PagePostMutate
    export type PutApiV10PagePostIdMutationError = void

    /**
 * @summary Update pagePost by ID
 */
export const usePutApiV10PagePostId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10PagePostId>>, TError,{id: string;data: PagePostMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10PagePostId>>,
        TError,
        {id: string;data: PagePostMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10PagePostIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single pagePost record by its ID
 * @summary Delete pagePost by ID
 */
export const deleteApiV10PagePostId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10PagePostId200>(
      {url: `/api/v1.0/pagePost/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10PagePostIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PagePostId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PagePostId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10PagePostId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10PagePostId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10PagePostId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10PagePostIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10PagePostId>>>
    
    export type DeleteApiV10PagePostIdMutationError = void

    /**
 * @summary Delete pagePost by ID
 */
export const useDeleteApiV10PagePostId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PagePostId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10PagePostId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10PagePostIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of pagePost with pagination, filtering and sorting
 * @summary Get all pagePost
 */
export const getApiV10PagePost = (
    params?: GetApiV10PagePostParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/pagePost`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10PagePostQueryKey = (params?: GetApiV10PagePostParams,) => {
    return [
    `/api/v1.0/pagePost`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10PagePostQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10PagePost>>, TError = unknown>(params?: GetApiV10PagePostParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PagePost>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PagePostQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10PagePost>>> = ({ signal }) => getApiV10PagePost(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10PagePost>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PagePostQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10PagePost>>>
export type GetApiV10PagePostQueryError = unknown


export function useGetApiV10PagePost<TData = Awaited<ReturnType<typeof getApiV10PagePost>>, TError = unknown>(
 params: undefined |  GetApiV10PagePostParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PagePost>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PagePost>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PagePost>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PagePost<TData = Awaited<ReturnType<typeof getApiV10PagePost>>, TError = unknown>(
 params?: GetApiV10PagePostParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PagePost>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PagePost>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PagePost>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PagePost<TData = Awaited<ReturnType<typeof getApiV10PagePost>>, TError = unknown>(
 params?: GetApiV10PagePostParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PagePost>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all pagePost
 */

export function useGetApiV10PagePost<TData = Awaited<ReturnType<typeof getApiV10PagePost>>, TError = unknown>(
 params?: GetApiV10PagePostParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PagePost>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PagePostQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new pagePost record
 * @summary Create a pagePost
 */
export const postApiV10PagePost = (
    pagePostMutate: PagePostMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10PagePost200>(
      {url: `/api/v1.0/pagePost`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: pagePostMutate, signal
    },
      );
    }
  


export const getPostApiV10PagePostMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10PagePost>>, TError,{data: PagePostMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10PagePost>>, TError,{data: PagePostMutate}, TContext> => {

const mutationKey = ['postApiV10PagePost'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10PagePost>>, {data: PagePostMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10PagePost(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10PagePostMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10PagePost>>>
    export type PostApiV10PagePostMutationBody = PagePostMutate
    export type PostApiV10PagePostMutationError = unknown

    /**
 * @summary Create a pagePost
 */
export const usePostApiV10PagePost = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10PagePost>>, TError,{data: PagePostMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10PagePost>>,
        TError,
        {data: PagePostMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10PagePostMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    