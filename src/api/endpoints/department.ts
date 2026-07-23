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
  DeleteApiV10DepartmentId200,
  DepartmentMutate,
  GetApiV10DepartmentId200,
  GetApiV10DepartmentParams,
  PostApiV10Department200,
  PutApiV10DepartmentId200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single department by its ID
 * @summary Get department by ID
 */
export const getApiV10DepartmentId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10DepartmentId200>(
      {url: `/api/v1.0/department/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10DepartmentIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/department/${id}`
    ] as const;
    }

    
export const getGetApiV10DepartmentIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10DepartmentId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10DepartmentId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10DepartmentIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10DepartmentId>>> = ({ signal }) => getApiV10DepartmentId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10DepartmentId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10DepartmentIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10DepartmentId>>>
export type GetApiV10DepartmentIdQueryError = void


export function useGetApiV10DepartmentId<TData = Awaited<ReturnType<typeof getApiV10DepartmentId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10DepartmentId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10DepartmentId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10DepartmentId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10DepartmentId<TData = Awaited<ReturnType<typeof getApiV10DepartmentId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10DepartmentId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10DepartmentId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10DepartmentId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10DepartmentId<TData = Awaited<ReturnType<typeof getApiV10DepartmentId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10DepartmentId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get department by ID
 */

export function useGetApiV10DepartmentId<TData = Awaited<ReturnType<typeof getApiV10DepartmentId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10DepartmentId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10DepartmentIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a department with the provided information
 * @summary Update department by ID
 */
export const putApiV10DepartmentId = (
    id: string,
    departmentMutate: DepartmentMutate,
 ) => {
      
      
      return mainInstance<PutApiV10DepartmentId200>(
      {url: `/api/v1.0/department/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: departmentMutate
    },
      );
    }
  


export const getPutApiV10DepartmentIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10DepartmentId>>, TError,{id: string;data: DepartmentMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10DepartmentId>>, TError,{id: string;data: DepartmentMutate}, TContext> => {

const mutationKey = ['putApiV10DepartmentId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10DepartmentId>>, {id: string;data: DepartmentMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10DepartmentId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10DepartmentIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10DepartmentId>>>
    export type PutApiV10DepartmentIdMutationBody = DepartmentMutate
    export type PutApiV10DepartmentIdMutationError = void

    /**
 * @summary Update department by ID
 */
export const usePutApiV10DepartmentId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10DepartmentId>>, TError,{id: string;data: DepartmentMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10DepartmentId>>,
        TError,
        {id: string;data: DepartmentMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10DepartmentIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a department from the system
 * @summary Delete department by ID
 */
export const deleteApiV10DepartmentId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10DepartmentId200>(
      {url: `/api/v1.0/department/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10DepartmentIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10DepartmentId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10DepartmentId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10DepartmentId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10DepartmentId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10DepartmentId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10DepartmentIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10DepartmentId>>>
    
    export type DeleteApiV10DepartmentIdMutationError = void

    /**
 * @summary Delete department by ID
 */
export const useDeleteApiV10DepartmentId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10DepartmentId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10DepartmentId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10DepartmentIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of departments with pagination, filtering and sorting
 * @summary Get all departments
 */
export const getApiV10Department = (
    params?: GetApiV10DepartmentParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/department`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10DepartmentQueryKey = (params?: GetApiV10DepartmentParams,) => {
    return [
    `/api/v1.0/department`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10DepartmentQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Department>>, TError = void>(params?: GetApiV10DepartmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Department>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10DepartmentQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Department>>> = ({ signal }) => getApiV10Department(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Department>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10DepartmentQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Department>>>
export type GetApiV10DepartmentQueryError = void


export function useGetApiV10Department<TData = Awaited<ReturnType<typeof getApiV10Department>>, TError = void>(
 params: undefined |  GetApiV10DepartmentParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Department>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Department>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Department>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Department<TData = Awaited<ReturnType<typeof getApiV10Department>>, TError = void>(
 params?: GetApiV10DepartmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Department>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Department>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Department>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Department<TData = Awaited<ReturnType<typeof getApiV10Department>>, TError = void>(
 params?: GetApiV10DepartmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Department>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all departments
 */

export function useGetApiV10Department<TData = Awaited<ReturnType<typeof getApiV10Department>>, TError = void>(
 params?: GetApiV10DepartmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Department>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10DepartmentQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new department with the provided information
 * @summary Create a new department
 */
export const postApiV10Department = (
    departmentMutate: DepartmentMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10Department200>(
      {url: `/api/v1.0/department`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: departmentMutate, signal
    },
      );
    }
  


export const getPostApiV10DepartmentMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Department>>, TError,{data: DepartmentMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Department>>, TError,{data: DepartmentMutate}, TContext> => {

const mutationKey = ['postApiV10Department'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Department>>, {data: DepartmentMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Department(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10DepartmentMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Department>>>
    export type PostApiV10DepartmentMutationBody = DepartmentMutate
    export type PostApiV10DepartmentMutationError = void

    /**
 * @summary Create a new department
 */
export const usePostApiV10Department = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Department>>, TError,{data: DepartmentMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Department>>,
        TError,
        {data: DepartmentMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10DepartmentMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    