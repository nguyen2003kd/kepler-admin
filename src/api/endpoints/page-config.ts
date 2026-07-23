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
  DeleteApiV10PageConfigId200,
  GetApiV10PageConfigId200,
  GetApiV10PageConfigParams,
  PageConfigMutate,
  PostApiV10PageConfig200,
  PutApiV10PageConfigId200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single PageConfig record by its ID
 * @summary Get PageConfig by ID
 */
export const getApiV10PageConfigId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10PageConfigId200>(
      {url: `/api/v1.0/pageConfig/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10PageConfigIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/pageConfig/${id}`
    ] as const;
    }

    
export const getGetApiV10PageConfigIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10PageConfigId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageConfigId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PageConfigIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10PageConfigId>>> = ({ signal }) => getApiV10PageConfigId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageConfigId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PageConfigIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10PageConfigId>>>
export type GetApiV10PageConfigIdQueryError = void


export function useGetApiV10PageConfigId<TData = Awaited<ReturnType<typeof getApiV10PageConfigId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageConfigId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PageConfigId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PageConfigId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PageConfigId<TData = Awaited<ReturnType<typeof getApiV10PageConfigId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageConfigId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PageConfigId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PageConfigId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PageConfigId<TData = Awaited<ReturnType<typeof getApiV10PageConfigId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageConfigId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get PageConfig by ID
 */

export function useGetApiV10PageConfigId<TData = Awaited<ReturnType<typeof getApiV10PageConfigId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageConfigId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PageConfigIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single PageConfig record by its ID
 * @summary Update PageConfig by ID
 */
export const putApiV10PageConfigId = (
    id: string,
    pageConfigMutate: PageConfigMutate,
 ) => {
      
      
      return mainInstance<PutApiV10PageConfigId200>(
      {url: `/api/v1.0/pageConfig/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: pageConfigMutate
    },
      );
    }
  


export const getPutApiV10PageConfigIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10PageConfigId>>, TError,{id: string;data: PageConfigMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10PageConfigId>>, TError,{id: string;data: PageConfigMutate}, TContext> => {

const mutationKey = ['putApiV10PageConfigId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10PageConfigId>>, {id: string;data: PageConfigMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10PageConfigId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10PageConfigIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10PageConfigId>>>
    export type PutApiV10PageConfigIdMutationBody = PageConfigMutate
    export type PutApiV10PageConfigIdMutationError = void

    /**
 * @summary Update PageConfig by ID
 */
export const usePutApiV10PageConfigId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10PageConfigId>>, TError,{id: string;data: PageConfigMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10PageConfigId>>,
        TError,
        {id: string;data: PageConfigMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10PageConfigIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single PageConfig record by its ID
 * @summary Delete PageConfig by ID
 */
export const deleteApiV10PageConfigId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10PageConfigId200>(
      {url: `/api/v1.0/pageConfig/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10PageConfigIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PageConfigId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PageConfigId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10PageConfigId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10PageConfigId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10PageConfigId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10PageConfigIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10PageConfigId>>>
    
    export type DeleteApiV10PageConfigIdMutationError = void

    /**
 * @summary Delete PageConfig by ID
 */
export const useDeleteApiV10PageConfigId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PageConfigId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10PageConfigId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10PageConfigIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of PageConfig with pagination, filtering and sorting
 * @summary Get all PageConfig
 */
export const getApiV10PageConfig = (
    params?: GetApiV10PageConfigParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/pageConfig`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10PageConfigQueryKey = (params?: GetApiV10PageConfigParams,) => {
    return [
    `/api/v1.0/pageConfig`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10PageConfigQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10PageConfig>>, TError = unknown>(params?: GetApiV10PageConfigParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageConfig>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PageConfigQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10PageConfig>>> = ({ signal }) => getApiV10PageConfig(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageConfig>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PageConfigQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10PageConfig>>>
export type GetApiV10PageConfigQueryError = unknown


export function useGetApiV10PageConfig<TData = Awaited<ReturnType<typeof getApiV10PageConfig>>, TError = unknown>(
 params: undefined |  GetApiV10PageConfigParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageConfig>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PageConfig>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PageConfig>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PageConfig<TData = Awaited<ReturnType<typeof getApiV10PageConfig>>, TError = unknown>(
 params?: GetApiV10PageConfigParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageConfig>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PageConfig>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PageConfig>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PageConfig<TData = Awaited<ReturnType<typeof getApiV10PageConfig>>, TError = unknown>(
 params?: GetApiV10PageConfigParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageConfig>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all PageConfig
 */

export function useGetApiV10PageConfig<TData = Awaited<ReturnType<typeof getApiV10PageConfig>>, TError = unknown>(
 params?: GetApiV10PageConfigParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PageConfig>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PageConfigQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new PageConfig record
 * @summary Create a PageConfig
 */
export const postApiV10PageConfig = (
    pageConfigMutate: PageConfigMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10PageConfig200>(
      {url: `/api/v1.0/pageConfig`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: pageConfigMutate, signal
    },
      );
    }
  


export const getPostApiV10PageConfigMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10PageConfig>>, TError,{data: PageConfigMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10PageConfig>>, TError,{data: PageConfigMutate}, TContext> => {

const mutationKey = ['postApiV10PageConfig'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10PageConfig>>, {data: PageConfigMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10PageConfig(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10PageConfigMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10PageConfig>>>
    export type PostApiV10PageConfigMutationBody = PageConfigMutate
    export type PostApiV10PageConfigMutationError = unknown

    /**
 * @summary Create a PageConfig
 */
export const usePostApiV10PageConfig = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10PageConfig>>, TError,{data: PageConfigMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10PageConfig>>,
        TError,
        {data: PageConfigMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10PageConfigMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    