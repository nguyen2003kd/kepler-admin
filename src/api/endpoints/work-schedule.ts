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
  GetApiV10WorkScheduleParams,
  WorkScheduleMutate
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * @summary Get work schedule by ID
 */
export const getApiV10WorkScheduleId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/workSchedule/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10WorkScheduleIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/workSchedule/${id}`
    ] as const;
    }

    
export const getGetApiV10WorkScheduleIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10WorkScheduleId>>, TError = unknown>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkScheduleId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10WorkScheduleIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10WorkScheduleId>>> = ({ signal }) => getApiV10WorkScheduleId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkScheduleId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10WorkScheduleIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10WorkScheduleId>>>
export type GetApiV10WorkScheduleIdQueryError = unknown


export function useGetApiV10WorkScheduleId<TData = Awaited<ReturnType<typeof getApiV10WorkScheduleId>>, TError = unknown>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkScheduleId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10WorkScheduleId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10WorkScheduleId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10WorkScheduleId<TData = Awaited<ReturnType<typeof getApiV10WorkScheduleId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkScheduleId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10WorkScheduleId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10WorkScheduleId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10WorkScheduleId<TData = Awaited<ReturnType<typeof getApiV10WorkScheduleId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkScheduleId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get work schedule by ID
 */

export function useGetApiV10WorkScheduleId<TData = Awaited<ReturnType<typeof getApiV10WorkScheduleId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkScheduleId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10WorkScheduleIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Update work schedule by ID
 */
export const putApiV10WorkScheduleId = (
    id: string,
    workScheduleMutate: WorkScheduleMutate,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/workSchedule/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: workScheduleMutate
    },
      );
    }
  


export const getPutApiV10WorkScheduleIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10WorkScheduleId>>, TError,{id: string;data: WorkScheduleMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10WorkScheduleId>>, TError,{id: string;data: WorkScheduleMutate}, TContext> => {

const mutationKey = ['putApiV10WorkScheduleId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10WorkScheduleId>>, {id: string;data: WorkScheduleMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10WorkScheduleId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10WorkScheduleIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10WorkScheduleId>>>
    export type PutApiV10WorkScheduleIdMutationBody = WorkScheduleMutate
    export type PutApiV10WorkScheduleIdMutationError = unknown

    /**
 * @summary Update work schedule by ID
 */
export const usePutApiV10WorkScheduleId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10WorkScheduleId>>, TError,{id: string;data: WorkScheduleMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10WorkScheduleId>>,
        TError,
        {id: string;data: WorkScheduleMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10WorkScheduleIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Delete work schedule by ID
 */
export const deleteApiV10WorkScheduleId = (
    id: string,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/workSchedule/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10WorkScheduleIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10WorkScheduleId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10WorkScheduleId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10WorkScheduleId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10WorkScheduleId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10WorkScheduleId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10WorkScheduleIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10WorkScheduleId>>>
    
    export type DeleteApiV10WorkScheduleIdMutationError = unknown

    /**
 * @summary Delete work schedule by ID
 */
export const useDeleteApiV10WorkScheduleId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10WorkScheduleId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10WorkScheduleId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10WorkScheduleIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve work schedules with pagination, filtering and sorting
 * @summary Get all work schedules
 */
export const getApiV10WorkSchedule = (
    params?: GetApiV10WorkScheduleParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/workSchedule`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10WorkScheduleQueryKey = (params?: GetApiV10WorkScheduleParams,) => {
    return [
    `/api/v1.0/workSchedule`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10WorkScheduleQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10WorkSchedule>>, TError = unknown>(params?: GetApiV10WorkScheduleParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkSchedule>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10WorkScheduleQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10WorkSchedule>>> = ({ signal }) => getApiV10WorkSchedule(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkSchedule>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10WorkScheduleQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10WorkSchedule>>>
export type GetApiV10WorkScheduleQueryError = unknown


export function useGetApiV10WorkSchedule<TData = Awaited<ReturnType<typeof getApiV10WorkSchedule>>, TError = unknown>(
 params: undefined |  GetApiV10WorkScheduleParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkSchedule>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10WorkSchedule>>,
          TError,
          Awaited<ReturnType<typeof getApiV10WorkSchedule>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10WorkSchedule<TData = Awaited<ReturnType<typeof getApiV10WorkSchedule>>, TError = unknown>(
 params?: GetApiV10WorkScheduleParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkSchedule>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10WorkSchedule>>,
          TError,
          Awaited<ReturnType<typeof getApiV10WorkSchedule>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10WorkSchedule<TData = Awaited<ReturnType<typeof getApiV10WorkSchedule>>, TError = unknown>(
 params?: GetApiV10WorkScheduleParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkSchedule>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all work schedules
 */

export function useGetApiV10WorkSchedule<TData = Awaited<ReturnType<typeof getApiV10WorkSchedule>>, TError = unknown>(
 params?: GetApiV10WorkScheduleParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkSchedule>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10WorkScheduleQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Create work schedule
 */
export const postApiV10WorkSchedule = (
    workScheduleMutate: WorkScheduleMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/workSchedule`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: workScheduleMutate, signal
    },
      );
    }
  


export const getPostApiV10WorkScheduleMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10WorkSchedule>>, TError,{data: WorkScheduleMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10WorkSchedule>>, TError,{data: WorkScheduleMutate}, TContext> => {

const mutationKey = ['postApiV10WorkSchedule'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10WorkSchedule>>, {data: WorkScheduleMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10WorkSchedule(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10WorkScheduleMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10WorkSchedule>>>
    export type PostApiV10WorkScheduleMutationBody = WorkScheduleMutate
    export type PostApiV10WorkScheduleMutationError = unknown

    /**
 * @summary Create work schedule
 */
export const usePostApiV10WorkSchedule = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10WorkSchedule>>, TError,{data: WorkScheduleMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10WorkSchedule>>,
        TError,
        {data: WorkScheduleMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10WorkScheduleMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    