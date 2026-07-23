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
  AppointmentMutate,
  GetApiV10AppointmentParams,
  PostApiV10Appointment200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * @summary Get appointment by ID
 */
export const getApiV10AppointmentId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/appointment/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10AppointmentIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/appointment/${id}`
    ] as const;
    }

    
export const getGetApiV10AppointmentIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10AppointmentId>>, TError = unknown>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AppointmentId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10AppointmentIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10AppointmentId>>> = ({ signal }) => getApiV10AppointmentId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10AppointmentId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10AppointmentIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10AppointmentId>>>
export type GetApiV10AppointmentIdQueryError = unknown


export function useGetApiV10AppointmentId<TData = Awaited<ReturnType<typeof getApiV10AppointmentId>>, TError = unknown>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AppointmentId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10AppointmentId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10AppointmentId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10AppointmentId<TData = Awaited<ReturnType<typeof getApiV10AppointmentId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AppointmentId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10AppointmentId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10AppointmentId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10AppointmentId<TData = Awaited<ReturnType<typeof getApiV10AppointmentId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AppointmentId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get appointment by ID
 */

export function useGetApiV10AppointmentId<TData = Awaited<ReturnType<typeof getApiV10AppointmentId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AppointmentId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10AppointmentIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Update appointment by ID
 */
export const putApiV10AppointmentId = (
    id: string,
    appointmentMutate: AppointmentMutate,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/appointment/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: appointmentMutate
    },
      );
    }
  


export const getPutApiV10AppointmentIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10AppointmentId>>, TError,{id: string;data: AppointmentMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10AppointmentId>>, TError,{id: string;data: AppointmentMutate}, TContext> => {

const mutationKey = ['putApiV10AppointmentId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10AppointmentId>>, {id: string;data: AppointmentMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10AppointmentId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10AppointmentIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10AppointmentId>>>
    export type PutApiV10AppointmentIdMutationBody = AppointmentMutate
    export type PutApiV10AppointmentIdMutationError = unknown

    /**
 * @summary Update appointment by ID
 */
export const usePutApiV10AppointmentId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10AppointmentId>>, TError,{id: string;data: AppointmentMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10AppointmentId>>,
        TError,
        {id: string;data: AppointmentMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10AppointmentIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Delete appointment by ID
 */
export const deleteApiV10AppointmentId = (
    id: string,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/appointment/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10AppointmentIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10AppointmentId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10AppointmentId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10AppointmentId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10AppointmentId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10AppointmentId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10AppointmentIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10AppointmentId>>>
    
    export type DeleteApiV10AppointmentIdMutationError = unknown

    /**
 * @summary Delete appointment by ID
 */
export const useDeleteApiV10AppointmentId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10AppointmentId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10AppointmentId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10AppointmentIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of appointments with pagination, filtering and sorting
 * @summary Get all appointments
 */
export const getApiV10Appointment = (
    params?: GetApiV10AppointmentParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/appointment`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10AppointmentQueryKey = (params?: GetApiV10AppointmentParams,) => {
    return [
    `/api/v1.0/appointment`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10AppointmentQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Appointment>>, TError = unknown>(params?: GetApiV10AppointmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Appointment>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10AppointmentQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Appointment>>> = ({ signal }) => getApiV10Appointment(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Appointment>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10AppointmentQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Appointment>>>
export type GetApiV10AppointmentQueryError = unknown


export function useGetApiV10Appointment<TData = Awaited<ReturnType<typeof getApiV10Appointment>>, TError = unknown>(
 params: undefined |  GetApiV10AppointmentParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Appointment>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Appointment>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Appointment>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Appointment<TData = Awaited<ReturnType<typeof getApiV10Appointment>>, TError = unknown>(
 params?: GetApiV10AppointmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Appointment>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Appointment>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Appointment>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Appointment<TData = Awaited<ReturnType<typeof getApiV10Appointment>>, TError = unknown>(
 params?: GetApiV10AppointmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Appointment>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all appointments
 */

export function useGetApiV10Appointment<TData = Awaited<ReturnType<typeof getApiV10Appointment>>, TError = unknown>(
 params?: GetApiV10AppointmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Appointment>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10AppointmentQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new appointment request. department_id and role_id are optional
 * @summary Create appointment booking
 */
export const postApiV10Appointment = (
    appointmentMutate: AppointmentMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10Appointment200>(
      {url: `/api/v1.0/appointment`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: appointmentMutate, signal
    },
      );
    }
  


export const getPostApiV10AppointmentMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Appointment>>, TError,{data: AppointmentMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Appointment>>, TError,{data: AppointmentMutate}, TContext> => {

const mutationKey = ['postApiV10Appointment'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Appointment>>, {data: AppointmentMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Appointment(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10AppointmentMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Appointment>>>
    export type PostApiV10AppointmentMutationBody = AppointmentMutate
    export type PostApiV10AppointmentMutationError = unknown

    /**
 * @summary Create appointment booking
 */
export const usePostApiV10Appointment = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Appointment>>, TError,{data: AppointmentMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Appointment>>,
        TError,
        {data: AppointmentMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10AppointmentMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    