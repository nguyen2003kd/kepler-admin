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
  DeleteApiV10RoleId200,
  GetApiV10RoleId200,
  GetApiV10RoleParams,
  PostApiV10Role200,
  PutApiV10RoleId200,
  ResponseGetAllData,
  RoleMutate
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single role record by its ID
 * @summary Get role by ID
 */
export const getApiV10RoleId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10RoleId200>(
      {url: `/api/v1.0/role/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10RoleIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/role/${id}`
    ] as const;
    }

    
export const getGetApiV10RoleIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10RoleId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RoleId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10RoleIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10RoleId>>> = ({ signal }) => getApiV10RoleId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10RoleId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10RoleIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10RoleId>>>
export type GetApiV10RoleIdQueryError = void


export function useGetApiV10RoleId<TData = Awaited<ReturnType<typeof getApiV10RoleId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RoleId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10RoleId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10RoleId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10RoleId<TData = Awaited<ReturnType<typeof getApiV10RoleId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RoleId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10RoleId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10RoleId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10RoleId<TData = Awaited<ReturnType<typeof getApiV10RoleId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RoleId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get role by ID
 */

export function useGetApiV10RoleId<TData = Awaited<ReturnType<typeof getApiV10RoleId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RoleId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10RoleIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single role record by its ID
 * @summary Update role by ID
 */
export const putApiV10RoleId = (
    id: string,
    roleMutate: RoleMutate,
 ) => {
      
      
      return mainInstance<PutApiV10RoleId200>(
      {url: `/api/v1.0/role/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: roleMutate
    },
      );
    }
  


export const getPutApiV10RoleIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10RoleId>>, TError,{id: string;data: RoleMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10RoleId>>, TError,{id: string;data: RoleMutate}, TContext> => {

const mutationKey = ['putApiV10RoleId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10RoleId>>, {id: string;data: RoleMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10RoleId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10RoleIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10RoleId>>>
    export type PutApiV10RoleIdMutationBody = RoleMutate
    export type PutApiV10RoleIdMutationError = void

    /**
 * @summary Update role by ID
 */
export const usePutApiV10RoleId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10RoleId>>, TError,{id: string;data: RoleMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10RoleId>>,
        TError,
        {id: string;data: RoleMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10RoleIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single role record by its ID. Note - This will also remove all role-permission and user-role associations.
 * @summary Delete role by ID
 */
export const deleteApiV10RoleId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10RoleId200>(
      {url: `/api/v1.0/role/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10RoleIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10RoleId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10RoleId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10RoleId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10RoleId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10RoleId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10RoleIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10RoleId>>>
    
    export type DeleteApiV10RoleIdMutationError = void

    /**
 * @summary Delete role by ID
 */
export const useDeleteApiV10RoleId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10RoleId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10RoleId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10RoleIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of roles with pagination, filtering and sorting
 * @summary Get all roles
 */
export const getApiV10Role = (
    params?: GetApiV10RoleParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/role`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10RoleQueryKey = (params?: GetApiV10RoleParams,) => {
    return [
    `/api/v1.0/role`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10RoleQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Role>>, TError = void>(params?: GetApiV10RoleParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Role>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10RoleQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Role>>> = ({ signal }) => getApiV10Role(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Role>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10RoleQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Role>>>
export type GetApiV10RoleQueryError = void


export function useGetApiV10Role<TData = Awaited<ReturnType<typeof getApiV10Role>>, TError = void>(
 params: undefined |  GetApiV10RoleParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Role>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Role>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Role>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Role<TData = Awaited<ReturnType<typeof getApiV10Role>>, TError = void>(
 params?: GetApiV10RoleParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Role>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Role>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Role>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Role<TData = Awaited<ReturnType<typeof getApiV10Role>>, TError = void>(
 params?: GetApiV10RoleParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Role>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all roles
 */

export function useGetApiV10Role<TData = Awaited<ReturnType<typeof getApiV10Role>>, TError = void>(
 params?: GetApiV10RoleParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Role>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10RoleQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new role record
 * @summary Create a role
 */
export const postApiV10Role = (
    roleMutate: RoleMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10Role200>(
      {url: `/api/v1.0/role`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: roleMutate, signal
    },
      );
    }
  


export const getPostApiV10RoleMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Role>>, TError,{data: RoleMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Role>>, TError,{data: RoleMutate}, TContext> => {

const mutationKey = ['postApiV10Role'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Role>>, {data: RoleMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Role(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10RoleMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Role>>>
    export type PostApiV10RoleMutationBody = RoleMutate
    export type PostApiV10RoleMutationError = void

    /**
 * @summary Create a role
 */
export const usePostApiV10Role = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Role>>, TError,{data: RoleMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Role>>,
        TError,
        {data: RoleMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10RoleMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    