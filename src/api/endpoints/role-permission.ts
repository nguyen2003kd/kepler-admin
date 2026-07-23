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
  GetApiV10RolePermissionParams,
  PostApiV10RolePermissionRoleIdAssign200,
  PostApiV10RolePermissionRoleIdAssignBody,
  PutApiV10RolePermissionRoleIdAssign200,
  PutApiV10RolePermissionRoleIdAssignBody,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Assign multiple permissions to a role at once
 * @summary Bulk assign permissions to a role
 */
export const postApiV10RolePermissionRoleIdAssign = (
    roleId: string,
    postApiV10RolePermissionRoleIdAssignBody: PostApiV10RolePermissionRoleIdAssignBody,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10RolePermissionRoleIdAssign200>(
      {url: `/api/v1.0/rolePermission/${roleId}/assign`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: postApiV10RolePermissionRoleIdAssignBody, signal
    },
      );
    }
  


export const getPostApiV10RolePermissionRoleIdAssignMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10RolePermissionRoleIdAssign>>, TError,{roleId: string;data: PostApiV10RolePermissionRoleIdAssignBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10RolePermissionRoleIdAssign>>, TError,{roleId: string;data: PostApiV10RolePermissionRoleIdAssignBody}, TContext> => {

const mutationKey = ['postApiV10RolePermissionRoleIdAssign'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10RolePermissionRoleIdAssign>>, {roleId: string;data: PostApiV10RolePermissionRoleIdAssignBody}> = (props) => {
          const {roleId,data} = props ?? {};

          return  postApiV10RolePermissionRoleIdAssign(roleId,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10RolePermissionRoleIdAssignMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10RolePermissionRoleIdAssign>>>
    export type PostApiV10RolePermissionRoleIdAssignMutationBody = PostApiV10RolePermissionRoleIdAssignBody
    export type PostApiV10RolePermissionRoleIdAssignMutationError = void

    /**
 * @summary Bulk assign permissions to a role
 */
export const usePostApiV10RolePermissionRoleIdAssign = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10RolePermissionRoleIdAssign>>, TError,{roleId: string;data: PostApiV10RolePermissionRoleIdAssignBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10RolePermissionRoleIdAssign>>,
        TError,
        {roleId: string;data: PostApiV10RolePermissionRoleIdAssignBody},
        TContext
      > => {

      const mutationOptions = getPostApiV10RolePermissionRoleIdAssignMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Replace all permissions of a role with a new set of permissions
 * @summary Update role permissions
 */
export const putApiV10RolePermissionRoleIdAssign = (
    roleId: string,
    putApiV10RolePermissionRoleIdAssignBody: PutApiV10RolePermissionRoleIdAssignBody,
 ) => {
      
      
      return mainInstance<PutApiV10RolePermissionRoleIdAssign200>(
      {url: `/api/v1.0/rolePermission/${roleId}/assign`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: putApiV10RolePermissionRoleIdAssignBody
    },
      );
    }
  


export const getPutApiV10RolePermissionRoleIdAssignMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10RolePermissionRoleIdAssign>>, TError,{roleId: string;data: PutApiV10RolePermissionRoleIdAssignBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10RolePermissionRoleIdAssign>>, TError,{roleId: string;data: PutApiV10RolePermissionRoleIdAssignBody}, TContext> => {

const mutationKey = ['putApiV10RolePermissionRoleIdAssign'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10RolePermissionRoleIdAssign>>, {roleId: string;data: PutApiV10RolePermissionRoleIdAssignBody}> = (props) => {
          const {roleId,data} = props ?? {};

          return  putApiV10RolePermissionRoleIdAssign(roleId,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10RolePermissionRoleIdAssignMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10RolePermissionRoleIdAssign>>>
    export type PutApiV10RolePermissionRoleIdAssignMutationBody = PutApiV10RolePermissionRoleIdAssignBody
    export type PutApiV10RolePermissionRoleIdAssignMutationError = void

    /**
 * @summary Update role permissions
 */
export const usePutApiV10RolePermissionRoleIdAssign = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10RolePermissionRoleIdAssign>>, TError,{roleId: string;data: PutApiV10RolePermissionRoleIdAssignBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10RolePermissionRoleIdAssign>>,
        TError,
        {roleId: string;data: PutApiV10RolePermissionRoleIdAssignBody},
        TContext
      > => {

      const mutationOptions = getPutApiV10RolePermissionRoleIdAssignMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of role-permission assignments with pagination, filtering and sorting
 * @summary Get all role-permission assignments
 */
export const getApiV10RolePermission = (
    params?: GetApiV10RolePermissionParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/rolePermission`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10RolePermissionQueryKey = (params?: GetApiV10RolePermissionParams,) => {
    return [
    `/api/v1.0/rolePermission`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10RolePermissionQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10RolePermission>>, TError = void>(params?: GetApiV10RolePermissionParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RolePermission>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10RolePermissionQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10RolePermission>>> = ({ signal }) => getApiV10RolePermission(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10RolePermission>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10RolePermissionQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10RolePermission>>>
export type GetApiV10RolePermissionQueryError = void


export function useGetApiV10RolePermission<TData = Awaited<ReturnType<typeof getApiV10RolePermission>>, TError = void>(
 params: undefined |  GetApiV10RolePermissionParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RolePermission>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10RolePermission>>,
          TError,
          Awaited<ReturnType<typeof getApiV10RolePermission>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10RolePermission<TData = Awaited<ReturnType<typeof getApiV10RolePermission>>, TError = void>(
 params?: GetApiV10RolePermissionParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RolePermission>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10RolePermission>>,
          TError,
          Awaited<ReturnType<typeof getApiV10RolePermission>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10RolePermission<TData = Awaited<ReturnType<typeof getApiV10RolePermission>>, TError = void>(
 params?: GetApiV10RolePermissionParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RolePermission>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all role-permission assignments
 */

export function useGetApiV10RolePermission<TData = Awaited<ReturnType<typeof getApiV10RolePermission>>, TError = void>(
 params?: GetApiV10RolePermissionParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RolePermission>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10RolePermissionQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




