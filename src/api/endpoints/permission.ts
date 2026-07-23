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
  DeleteApiV10PermissionId200,
  GetApiV10PermissionId200,
  GetApiV10PermissionParams,
  PermissionMutate,
  PostApiV10Permission200,
  PutApiV10PermissionId200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single permission record by its ID
 * @summary Get permission by ID
 */
export const getApiV10PermissionId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10PermissionId200>(
      {url: `/api/v1.0/permission/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10PermissionIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/permission/${id}`
    ] as const;
    }

    
export const getGetApiV10PermissionIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10PermissionId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PermissionId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PermissionIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10PermissionId>>> = ({ signal }) => getApiV10PermissionId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10PermissionId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PermissionIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10PermissionId>>>
export type GetApiV10PermissionIdQueryError = void


export function useGetApiV10PermissionId<TData = Awaited<ReturnType<typeof getApiV10PermissionId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PermissionId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PermissionId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PermissionId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PermissionId<TData = Awaited<ReturnType<typeof getApiV10PermissionId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PermissionId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PermissionId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PermissionId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PermissionId<TData = Awaited<ReturnType<typeof getApiV10PermissionId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PermissionId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get permission by ID
 */

export function useGetApiV10PermissionId<TData = Awaited<ReturnType<typeof getApiV10PermissionId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PermissionId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PermissionIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single permission record by its ID
 * @summary Update permission by ID
 */
export const putApiV10PermissionId = (
    id: string,
    permissionMutate: PermissionMutate,
 ) => {
      
      
      return mainInstance<PutApiV10PermissionId200>(
      {url: `/api/v1.0/permission/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: permissionMutate
    },
      );
    }
  


export const getPutApiV10PermissionIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10PermissionId>>, TError,{id: string;data: PermissionMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10PermissionId>>, TError,{id: string;data: PermissionMutate}, TContext> => {

const mutationKey = ['putApiV10PermissionId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10PermissionId>>, {id: string;data: PermissionMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10PermissionId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10PermissionIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10PermissionId>>>
    export type PutApiV10PermissionIdMutationBody = PermissionMutate
    export type PutApiV10PermissionIdMutationError = void

    /**
 * @summary Update permission by ID
 */
export const usePutApiV10PermissionId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10PermissionId>>, TError,{id: string;data: PermissionMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10PermissionId>>,
        TError,
        {id: string;data: PermissionMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10PermissionIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single permission record by its ID. Note - This will also remove all role-permission associations.
 * @summary Delete permission by ID
 */
export const deleteApiV10PermissionId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10PermissionId200>(
      {url: `/api/v1.0/permission/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10PermissionIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PermissionId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PermissionId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10PermissionId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10PermissionId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10PermissionId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10PermissionIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10PermissionId>>>
    
    export type DeleteApiV10PermissionIdMutationError = void

    /**
 * @summary Delete permission by ID
 */
export const useDeleteApiV10PermissionId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PermissionId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10PermissionId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10PermissionIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of permissions with pagination, filtering and sorting
 * @summary Get all permissions
 */
export const getApiV10Permission = (
    params?: GetApiV10PermissionParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/permission`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10PermissionQueryKey = (params?: GetApiV10PermissionParams,) => {
    return [
    `/api/v1.0/permission`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10PermissionQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Permission>>, TError = void>(params?: GetApiV10PermissionParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Permission>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PermissionQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Permission>>> = ({ signal }) => getApiV10Permission(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Permission>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PermissionQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Permission>>>
export type GetApiV10PermissionQueryError = void


export function useGetApiV10Permission<TData = Awaited<ReturnType<typeof getApiV10Permission>>, TError = void>(
 params: undefined |  GetApiV10PermissionParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Permission>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Permission>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Permission>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Permission<TData = Awaited<ReturnType<typeof getApiV10Permission>>, TError = void>(
 params?: GetApiV10PermissionParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Permission>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Permission>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Permission>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Permission<TData = Awaited<ReturnType<typeof getApiV10Permission>>, TError = void>(
 params?: GetApiV10PermissionParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Permission>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all permissions
 */

export function useGetApiV10Permission<TData = Awaited<ReturnType<typeof getApiV10Permission>>, TError = void>(
 params?: GetApiV10PermissionParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Permission>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PermissionQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new permission record
 * @summary Create a permission
 */
export const postApiV10Permission = (
    permissionMutate: PermissionMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10Permission200>(
      {url: `/api/v1.0/permission`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: permissionMutate, signal
    },
      );
    }
  


export const getPostApiV10PermissionMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Permission>>, TError,{data: PermissionMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Permission>>, TError,{data: PermissionMutate}, TContext> => {

const mutationKey = ['postApiV10Permission'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Permission>>, {data: PermissionMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Permission(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10PermissionMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Permission>>>
    export type PostApiV10PermissionMutationBody = PermissionMutate
    export type PostApiV10PermissionMutationError = void

    /**
 * @summary Create a permission
 */
export const usePostApiV10Permission = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Permission>>, TError,{data: PermissionMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Permission>>,
        TError,
        {data: PermissionMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10PermissionMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    