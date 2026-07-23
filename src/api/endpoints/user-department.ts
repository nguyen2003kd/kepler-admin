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
  DeleteApiV10UserDepartmentId200,
  GetApiV10UserDepartmentParams,
  PostApiV10UserDepartment200,
  ResponseGetAllData,
  UserDepartmentMutate
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Delete a user-department assignment (remove user from department)
 * @summary Delete user-department assignment by ID
 */
export const deleteApiV10UserDepartmentId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10UserDepartmentId200>(
      {url: `/api/v1.0/userDepartment/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10UserDepartmentIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10UserDepartmentId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10UserDepartmentId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10UserDepartmentId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10UserDepartmentId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10UserDepartmentId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10UserDepartmentIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10UserDepartmentId>>>
    
    export type DeleteApiV10UserDepartmentIdMutationError = void

    /**
 * @summary Delete user-department assignment by ID
 */
export const useDeleteApiV10UserDepartmentId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10UserDepartmentId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10UserDepartmentId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10UserDepartmentIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of user-department assignments with pagination, filtering and sorting
 * @summary Get all user-department assignments
 */
export const getApiV10UserDepartment = (
    params?: GetApiV10UserDepartmentParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/userDepartment`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10UserDepartmentQueryKey = (params?: GetApiV10UserDepartmentParams,) => {
    return [
    `/api/v1.0/userDepartment`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10UserDepartmentQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10UserDepartment>>, TError = void>(params?: GetApiV10UserDepartmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserDepartment>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10UserDepartmentQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10UserDepartment>>> = ({ signal }) => getApiV10UserDepartment(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserDepartment>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10UserDepartmentQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10UserDepartment>>>
export type GetApiV10UserDepartmentQueryError = void


export function useGetApiV10UserDepartment<TData = Awaited<ReturnType<typeof getApiV10UserDepartment>>, TError = void>(
 params: undefined |  GetApiV10UserDepartmentParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserDepartment>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10UserDepartment>>,
          TError,
          Awaited<ReturnType<typeof getApiV10UserDepartment>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10UserDepartment<TData = Awaited<ReturnType<typeof getApiV10UserDepartment>>, TError = void>(
 params?: GetApiV10UserDepartmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserDepartment>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10UserDepartment>>,
          TError,
          Awaited<ReturnType<typeof getApiV10UserDepartment>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10UserDepartment<TData = Awaited<ReturnType<typeof getApiV10UserDepartment>>, TError = void>(
 params?: GetApiV10UserDepartmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserDepartment>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all user-department assignments
 */

export function useGetApiV10UserDepartment<TData = Awaited<ReturnType<typeof getApiV10UserDepartment>>, TError = void>(
 params?: GetApiV10UserDepartmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserDepartment>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10UserDepartmentQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new user-department assignment
 * @summary Assign a department to a user
 */
export const postApiV10UserDepartment = (
    userDepartmentMutate: UserDepartmentMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10UserDepartment200>(
      {url: `/api/v1.0/userDepartment`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: userDepartmentMutate, signal
    },
      );
    }
  


export const getPostApiV10UserDepartmentMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10UserDepartment>>, TError,{data: UserDepartmentMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10UserDepartment>>, TError,{data: UserDepartmentMutate}, TContext> => {

const mutationKey = ['postApiV10UserDepartment'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10UserDepartment>>, {data: UserDepartmentMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10UserDepartment(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10UserDepartmentMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10UserDepartment>>>
    export type PostApiV10UserDepartmentMutationBody = UserDepartmentMutate
    export type PostApiV10UserDepartmentMutationError = void

    /**
 * @summary Assign a department to a user
 */
export const usePostApiV10UserDepartment = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10UserDepartment>>, TError,{data: UserDepartmentMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10UserDepartment>>,
        TError,
        {data: UserDepartmentMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10UserDepartmentMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    