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
  BannerMutate,
  DeleteApiV10BannerId200,
  GetApiV10BannerId200,
  GetApiV10BannerParams,
  PostApiV10Banner200,
  PutApiV10BannerId200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single banner record by its ID
 * @summary Get banner by ID
 */
export const getApiV10BannerId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10BannerId200>(
      {url: `/api/v1.0/banner/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10BannerIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/banner/${id}`
    ] as const;
    }

    
export const getGetApiV10BannerIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10BannerId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10BannerId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10BannerIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10BannerId>>> = ({ signal }) => getApiV10BannerId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10BannerId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10BannerIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10BannerId>>>
export type GetApiV10BannerIdQueryError = void


export function useGetApiV10BannerId<TData = Awaited<ReturnType<typeof getApiV10BannerId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10BannerId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10BannerId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10BannerId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10BannerId<TData = Awaited<ReturnType<typeof getApiV10BannerId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10BannerId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10BannerId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10BannerId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10BannerId<TData = Awaited<ReturnType<typeof getApiV10BannerId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10BannerId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get banner by ID
 */

export function useGetApiV10BannerId<TData = Awaited<ReturnType<typeof getApiV10BannerId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10BannerId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10BannerIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single banner record by its ID
 * @summary Update banner by ID
 */
export const putApiV10BannerId = (
    id: string,
    bannerMutate: BannerMutate,
 ) => {
      
      
      return mainInstance<PutApiV10BannerId200>(
      {url: `/api/v1.0/banner/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: bannerMutate
    },
      );
    }
  


export const getPutApiV10BannerIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10BannerId>>, TError,{id: string;data: BannerMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10BannerId>>, TError,{id: string;data: BannerMutate}, TContext> => {

const mutationKey = ['putApiV10BannerId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10BannerId>>, {id: string;data: BannerMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10BannerId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10BannerIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10BannerId>>>
    export type PutApiV10BannerIdMutationBody = BannerMutate
    export type PutApiV10BannerIdMutationError = void

    /**
 * @summary Update banner by ID
 */
export const usePutApiV10BannerId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10BannerId>>, TError,{id: string;data: BannerMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10BannerId>>,
        TError,
        {id: string;data: BannerMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10BannerIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single banner record by its ID
 * @summary Delete banner by ID
 */
export const deleteApiV10BannerId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10BannerId200>(
      {url: `/api/v1.0/banner/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10BannerIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10BannerId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10BannerId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10BannerId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10BannerId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10BannerId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10BannerIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10BannerId>>>
    
    export type DeleteApiV10BannerIdMutationError = void

    /**
 * @summary Delete banner by ID
 */
export const useDeleteApiV10BannerId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10BannerId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10BannerId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10BannerIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of banner with pagination, filtering and sorting
 * @summary Get all banner
 */
export const getApiV10Banner = (
    params?: GetApiV10BannerParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/banner`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10BannerQueryKey = (params?: GetApiV10BannerParams,) => {
    return [
    `/api/v1.0/banner`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10BannerQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Banner>>, TError = unknown>(params?: GetApiV10BannerParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Banner>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10BannerQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Banner>>> = ({ signal }) => getApiV10Banner(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Banner>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10BannerQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Banner>>>
export type GetApiV10BannerQueryError = unknown


export function useGetApiV10Banner<TData = Awaited<ReturnType<typeof getApiV10Banner>>, TError = unknown>(
 params: undefined |  GetApiV10BannerParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Banner>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Banner>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Banner>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Banner<TData = Awaited<ReturnType<typeof getApiV10Banner>>, TError = unknown>(
 params?: GetApiV10BannerParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Banner>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Banner>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Banner>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Banner<TData = Awaited<ReturnType<typeof getApiV10Banner>>, TError = unknown>(
 params?: GetApiV10BannerParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Banner>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all banner
 */

export function useGetApiV10Banner<TData = Awaited<ReturnType<typeof getApiV10Banner>>, TError = unknown>(
 params?: GetApiV10BannerParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Banner>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10BannerQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new banner record
 * @summary Create a banner
 */
export const postApiV10Banner = (
    bannerMutate: BannerMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10Banner200>(
      {url: `/api/v1.0/banner`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: bannerMutate, signal
    },
      );
    }
  


export const getPostApiV10BannerMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Banner>>, TError,{data: BannerMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Banner>>, TError,{data: BannerMutate}, TContext> => {

const mutationKey = ['postApiV10Banner'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Banner>>, {data: BannerMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Banner(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10BannerMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Banner>>>
    export type PostApiV10BannerMutationBody = BannerMutate
    export type PostApiV10BannerMutationError = unknown

    /**
 * @summary Create a banner
 */
export const usePostApiV10Banner = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Banner>>, TError,{data: BannerMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Banner>>,
        TError,
        {data: BannerMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10BannerMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    