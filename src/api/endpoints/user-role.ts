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
  DeleteApiV10UserRoleId200,
  GetApiV10UserRoleId200,
  GetApiV10UserRoleParams,
  PostApiV10UserRole200,
  PutApiV10UserRoleId200,
  ResponseGetAllData,
  UserRoleMutate
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single user-role assignment by its ID
 * @summary Get user-role assignment by ID
 */
export const getApiV10UserRoleId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10UserRoleId200>(
      {url: `/api/v1.0/userRole/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10UserRoleIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/userRole/${id}`
    ] as const;
    }

    
export const getGetApiV10UserRoleIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10UserRoleId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserRoleId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10UserRoleIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10UserRoleId>>> = ({ signal }) => getApiV10UserRoleId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserRoleId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10UserRoleIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10UserRoleId>>>
export type GetApiV10UserRoleIdQueryError = void


export function useGetApiV10UserRoleId<TData = Awaited<ReturnType<typeof getApiV10UserRoleId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserRoleId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10UserRoleId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10UserRoleId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10UserRoleId<TData = Awaited<ReturnType<typeof getApiV10UserRoleId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserRoleId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10UserRoleId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10UserRoleId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10UserRoleId<TData = Awaited<ReturnType<typeof getApiV10UserRoleId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserRoleId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get user-role assignment by ID
 */

export function useGetApiV10UserRoleId<TData = Awaited<ReturnType<typeof getApiV10UserRoleId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserRoleId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10UserRoleIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a user-role assignment
 * @summary Update user-role assignment by ID
 */
export const putApiV10UserRoleId = (
    id: string,
    userRoleMutate: UserRoleMutate,
 ) => {
      
      
      return mainInstance<PutApiV10UserRoleId200>(
      {url: `/api/v1.0/userRole/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: userRoleMutate
    },
      );
    }
  


export const getPutApiV10UserRoleIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10UserRoleId>>, TError,{id: string;data: UserRoleMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10UserRoleId>>, TError,{id: string;data: UserRoleMutate}, TContext> => {

const mutationKey = ['putApiV10UserRoleId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10UserRoleId>>, {id: string;data: UserRoleMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10UserRoleId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10UserRoleIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10UserRoleId>>>
    export type PutApiV10UserRoleIdMutationBody = UserRoleMutate
    export type PutApiV10UserRoleIdMutationError = void

    /**
 * @summary Update user-role assignment by ID
 */
export const usePutApiV10UserRoleId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10UserRoleId>>, TError,{id: string;data: UserRoleMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10UserRoleId>>,
        TError,
        {id: string;data: UserRoleMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10UserRoleIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a user-role assignment (revoke role from user)
 * @summary Delete user-role assignment by ID
 */
export const deleteApiV10UserRoleId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10UserRoleId200>(
      {url: `/api/v1.0/userRole/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10UserRoleIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10UserRoleId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10UserRoleId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10UserRoleId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10UserRoleId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10UserRoleId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10UserRoleIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10UserRoleId>>>
    
    export type DeleteApiV10UserRoleIdMutationError = void

    /**
 * @summary Delete user-role assignment by ID
 */
export const useDeleteApiV10UserRoleId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10UserRoleId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10UserRoleId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10UserRoleIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of user-role assignments with pagination, filtering and sorting
 * @summary Get all user-role assignments
 */
export const getApiV10UserRole = (
    params?: GetApiV10UserRoleParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/userRole`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10UserRoleQueryKey = (params?: GetApiV10UserRoleParams,) => {
    return [
    `/api/v1.0/userRole`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10UserRoleQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10UserRole>>, TError = void>(params?: GetApiV10UserRoleParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserRole>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10UserRoleQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10UserRole>>> = ({ signal }) => getApiV10UserRole(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserRole>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10UserRoleQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10UserRole>>>
export type GetApiV10UserRoleQueryError = void


export function useGetApiV10UserRole<TData = Awaited<ReturnType<typeof getApiV10UserRole>>, TError = void>(
 params: undefined |  GetApiV10UserRoleParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserRole>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10UserRole>>,
          TError,
          Awaited<ReturnType<typeof getApiV10UserRole>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10UserRole<TData = Awaited<ReturnType<typeof getApiV10UserRole>>, TError = void>(
 params?: GetApiV10UserRoleParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserRole>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10UserRole>>,
          TError,
          Awaited<ReturnType<typeof getApiV10UserRole>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10UserRole<TData = Awaited<ReturnType<typeof getApiV10UserRole>>, TError = void>(
 params?: GetApiV10UserRoleParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserRole>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all user-role assignments
 */

export function useGetApiV10UserRole<TData = Awaited<ReturnType<typeof getApiV10UserRole>>, TError = void>(
 params?: GetApiV10UserRoleParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserRole>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10UserRoleQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new user-role assignment
 * @summary Assign a role to a user
 */
export const postApiV10UserRole = (
    userRoleMutate: UserRoleMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10UserRole200>(
      {url: `/api/v1.0/userRole`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: userRoleMutate, signal
    },
      );
    }
  


export const getPostApiV10UserRoleMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10UserRole>>, TError,{data: UserRoleMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10UserRole>>, TError,{data: UserRoleMutate}, TContext> => {

const mutationKey = ['postApiV10UserRole'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10UserRole>>, {data: UserRoleMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10UserRole(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10UserRoleMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10UserRole>>>
    export type PostApiV10UserRoleMutationBody = UserRoleMutate
    export type PostApiV10UserRoleMutationError = void

    /**
 * @summary Assign a role to a user
 */
export const usePostApiV10UserRole = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10UserRole>>, TError,{data: UserRoleMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10UserRole>>,
        TError,
        {data: UserRoleMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10UserRoleMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    