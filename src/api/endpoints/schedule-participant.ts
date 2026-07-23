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
  GetApiV10ScheduleParticipantParams,
  ScheduleParticipantBulkMutate
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * @summary Remove a participant from work schedule
 */
export const deleteApiV10ScheduleParticipantScheduleIdUserId = (
    scheduleId: string,
    userId: string,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/scheduleParticipant/${scheduleId}/${userId}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10ScheduleParticipantScheduleIdUserIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10ScheduleParticipantScheduleIdUserId>>, TError,{scheduleId: string;userId: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10ScheduleParticipantScheduleIdUserId>>, TError,{scheduleId: string;userId: string}, TContext> => {

const mutationKey = ['deleteApiV10ScheduleParticipantScheduleIdUserId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10ScheduleParticipantScheduleIdUserId>>, {scheduleId: string;userId: string}> = (props) => {
          const {scheduleId,userId} = props ?? {};

          return  deleteApiV10ScheduleParticipantScheduleIdUserId(scheduleId,userId,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10ScheduleParticipantScheduleIdUserIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10ScheduleParticipantScheduleIdUserId>>>
    
    export type DeleteApiV10ScheduleParticipantScheduleIdUserIdMutationError = unknown

    /**
 * @summary Remove a participant from work schedule
 */
export const useDeleteApiV10ScheduleParticipantScheduleIdUserId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10ScheduleParticipantScheduleIdUserId>>, TError,{scheduleId: string;userId: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10ScheduleParticipantScheduleIdUserId>>,
        TError,
        {scheduleId: string;userId: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10ScheduleParticipantScheduleIdUserIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Add multiple participants to one work schedule in a single request
 * @summary Add participants to a work schedule (bulk)
 */
export const postApiV10ScheduleParticipantBulk = (
    scheduleParticipantBulkMutate: ScheduleParticipantBulkMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/scheduleParticipant/bulk`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: scheduleParticipantBulkMutate, signal
    },
      );
    }
  


export const getPostApiV10ScheduleParticipantBulkMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10ScheduleParticipantBulk>>, TError,{data: ScheduleParticipantBulkMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10ScheduleParticipantBulk>>, TError,{data: ScheduleParticipantBulkMutate}, TContext> => {

const mutationKey = ['postApiV10ScheduleParticipantBulk'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10ScheduleParticipantBulk>>, {data: ScheduleParticipantBulkMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10ScheduleParticipantBulk(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10ScheduleParticipantBulkMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10ScheduleParticipantBulk>>>
    export type PostApiV10ScheduleParticipantBulkMutationBody = ScheduleParticipantBulkMutate
    export type PostApiV10ScheduleParticipantBulkMutationError = unknown

    /**
 * @summary Add participants to a work schedule (bulk)
 */
export const usePostApiV10ScheduleParticipantBulk = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10ScheduleParticipantBulk>>, TError,{data: ScheduleParticipantBulkMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10ScheduleParticipantBulk>>,
        TError,
        {data: ScheduleParticipantBulkMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10ScheduleParticipantBulkMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve participant assignments with pagination, filtering and sorting
 * @summary Get all schedule participants
 */
export const getApiV10ScheduleParticipant = (
    params?: GetApiV10ScheduleParticipantParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/scheduleParticipant`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10ScheduleParticipantQueryKey = (params?: GetApiV10ScheduleParticipantParams,) => {
    return [
    `/api/v1.0/scheduleParticipant`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10ScheduleParticipantQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>, TError = unknown>(params?: GetApiV10ScheduleParticipantParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10ScheduleParticipantQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>> = ({ signal }) => getApiV10ScheduleParticipant(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10ScheduleParticipantQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>>
export type GetApiV10ScheduleParticipantQueryError = unknown


export function useGetApiV10ScheduleParticipant<TData = Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>, TError = unknown>(
 params: undefined |  GetApiV10ScheduleParticipantParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>,
          TError,
          Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10ScheduleParticipant<TData = Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>, TError = unknown>(
 params?: GetApiV10ScheduleParticipantParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>,
          TError,
          Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10ScheduleParticipant<TData = Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>, TError = unknown>(
 params?: GetApiV10ScheduleParticipantParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all schedule participants
 */

export function useGetApiV10ScheduleParticipant<TData = Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>, TError = unknown>(
 params?: GetApiV10ScheduleParticipantParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ScheduleParticipant>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10ScheduleParticipantQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Get participants of a work schedule
 */
export const getApiV10WorkScheduleIdParticipants = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/workSchedule/${id}/participants`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10WorkScheduleIdParticipantsQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/workSchedule/${id}/participants`
    ] as const;
    }

    
export const getGetApiV10WorkScheduleIdParticipantsQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>, TError = unknown>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10WorkScheduleIdParticipantsQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>> = ({ signal }) => getApiV10WorkScheduleIdParticipants(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10WorkScheduleIdParticipantsQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>>
export type GetApiV10WorkScheduleIdParticipantsQueryError = unknown


export function useGetApiV10WorkScheduleIdParticipants<TData = Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>, TError = unknown>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>,
          TError,
          Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10WorkScheduleIdParticipants<TData = Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>,
          TError,
          Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10WorkScheduleIdParticipants<TData = Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get participants of a work schedule
 */

export function useGetApiV10WorkScheduleIdParticipants<TData = Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10WorkScheduleIdParticipants>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10WorkScheduleIdParticipantsQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




