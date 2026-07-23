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
  DeleteApiV10LogoId200,
  GetApiV10LogoId200,
  GetApiV10LogoParams,
  LogoMutate,
  PostApiV10Logo200,
  PutApiV10LogoId200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single logo record by its ID
 * @summary Get logo by ID
 */
export const getApiV10LogoId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10LogoId200>(
      {url: `/api/v1.0/logo/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10LogoIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/logo/${id}`
    ] as const;
    }

    
export const getGetApiV10LogoIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10LogoId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10LogoId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10LogoIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10LogoId>>> = ({ signal }) => getApiV10LogoId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10LogoId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10LogoIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10LogoId>>>
export type GetApiV10LogoIdQueryError = void


export function useGetApiV10LogoId<TData = Awaited<ReturnType<typeof getApiV10LogoId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10LogoId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10LogoId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10LogoId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10LogoId<TData = Awaited<ReturnType<typeof getApiV10LogoId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10LogoId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10LogoId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10LogoId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10LogoId<TData = Awaited<ReturnType<typeof getApiV10LogoId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10LogoId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get logo by ID
 */

export function useGetApiV10LogoId<TData = Awaited<ReturnType<typeof getApiV10LogoId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10LogoId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10LogoIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single logo record by its ID
 * @summary Update logo by ID
 */
export const putApiV10LogoId = (
    id: string,
    logoMutate: LogoMutate,
 ) => {
      
      
      return mainInstance<PutApiV10LogoId200>(
      {url: `/api/v1.0/logo/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: logoMutate
    },
      );
    }
  


export const getPutApiV10LogoIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10LogoId>>, TError,{id: string;data: LogoMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10LogoId>>, TError,{id: string;data: LogoMutate}, TContext> => {

const mutationKey = ['putApiV10LogoId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10LogoId>>, {id: string;data: LogoMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10LogoId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10LogoIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10LogoId>>>
    export type PutApiV10LogoIdMutationBody = LogoMutate
    export type PutApiV10LogoIdMutationError = void

    /**
 * @summary Update logo by ID
 */
export const usePutApiV10LogoId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10LogoId>>, TError,{id: string;data: LogoMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10LogoId>>,
        TError,
        {id: string;data: LogoMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10LogoIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single logo record by its ID
 * @summary Delete logo by ID
 */
export const deleteApiV10LogoId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10LogoId200>(
      {url: `/api/v1.0/logo/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10LogoIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10LogoId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10LogoId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10LogoId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10LogoId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10LogoId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10LogoIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10LogoId>>>
    
    export type DeleteApiV10LogoIdMutationError = void

    /**
 * @summary Delete logo by ID
 */
export const useDeleteApiV10LogoId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10LogoId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10LogoId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10LogoIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of logo with pagination, filtering and sorting
 * @summary Get all logo
 */
export const getApiV10Logo = (
    params?: GetApiV10LogoParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/logo`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10LogoQueryKey = (params?: GetApiV10LogoParams,) => {
    return [
    `/api/v1.0/logo`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10LogoQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Logo>>, TError = unknown>(params?: GetApiV10LogoParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Logo>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10LogoQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Logo>>> = ({ signal }) => getApiV10Logo(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Logo>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10LogoQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Logo>>>
export type GetApiV10LogoQueryError = unknown


export function useGetApiV10Logo<TData = Awaited<ReturnType<typeof getApiV10Logo>>, TError = unknown>(
 params: undefined |  GetApiV10LogoParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Logo>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Logo>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Logo>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Logo<TData = Awaited<ReturnType<typeof getApiV10Logo>>, TError = unknown>(
 params?: GetApiV10LogoParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Logo>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Logo>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Logo>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Logo<TData = Awaited<ReturnType<typeof getApiV10Logo>>, TError = unknown>(
 params?: GetApiV10LogoParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Logo>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all logo
 */

export function useGetApiV10Logo<TData = Awaited<ReturnType<typeof getApiV10Logo>>, TError = unknown>(
 params?: GetApiV10LogoParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Logo>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10LogoQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new logo record
 * @summary Create a logo
 */
export const postApiV10Logo = (
    logoMutate: LogoMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10Logo200>(
      {url: `/api/v1.0/logo`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: logoMutate, signal
    },
      );
    }
  


export const getPostApiV10LogoMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Logo>>, TError,{data: LogoMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Logo>>, TError,{data: LogoMutate}, TContext> => {

const mutationKey = ['postApiV10Logo'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Logo>>, {data: LogoMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Logo(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10LogoMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Logo>>>
    export type PostApiV10LogoMutationBody = LogoMutate
    export type PostApiV10LogoMutationError = unknown

    /**
 * @summary Create a logo
 */
export const usePostApiV10Logo = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Logo>>, TError,{data: LogoMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Logo>>,
        TError,
        {data: LogoMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10LogoMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    