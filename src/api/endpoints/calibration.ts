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
  CalibrationMutate,
  DeleteApiV10CalibrationId200,
  GetApiV10CalibrationId200,
  GetApiV10CalibrationParams,
  PostApiV10Calibration200,
  PutApiV10CalibrationId200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single calibration record by its ID
 * @summary Get calibration by ID
 */
export const getApiV10CalibrationId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10CalibrationId200>(
      {url: `/api/v1.0/calibration/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10CalibrationIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/calibration/${id}`
    ] as const;
    }

    
export const getGetApiV10CalibrationIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10CalibrationId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CalibrationId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10CalibrationIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10CalibrationId>>> = ({ signal }) => getApiV10CalibrationId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10CalibrationId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10CalibrationIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10CalibrationId>>>
export type GetApiV10CalibrationIdQueryError = void


export function useGetApiV10CalibrationId<TData = Awaited<ReturnType<typeof getApiV10CalibrationId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CalibrationId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10CalibrationId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10CalibrationId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10CalibrationId<TData = Awaited<ReturnType<typeof getApiV10CalibrationId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CalibrationId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10CalibrationId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10CalibrationId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10CalibrationId<TData = Awaited<ReturnType<typeof getApiV10CalibrationId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CalibrationId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get calibration by ID
 */

export function useGetApiV10CalibrationId<TData = Awaited<ReturnType<typeof getApiV10CalibrationId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CalibrationId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10CalibrationIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single calibration record by its ID
 * @summary Update calibration by ID
 */
export const putApiV10CalibrationId = (
    id: string,
    calibrationMutate: CalibrationMutate,
 ) => {
      
      
      return mainInstance<PutApiV10CalibrationId200>(
      {url: `/api/v1.0/calibration/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: calibrationMutate
    },
      );
    }
  


export const getPutApiV10CalibrationIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10CalibrationId>>, TError,{id: string;data: CalibrationMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10CalibrationId>>, TError,{id: string;data: CalibrationMutate}, TContext> => {

const mutationKey = ['putApiV10CalibrationId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10CalibrationId>>, {id: string;data: CalibrationMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10CalibrationId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10CalibrationIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10CalibrationId>>>
    export type PutApiV10CalibrationIdMutationBody = CalibrationMutate
    export type PutApiV10CalibrationIdMutationError = void

    /**
 * @summary Update calibration by ID
 */
export const usePutApiV10CalibrationId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10CalibrationId>>, TError,{id: string;data: CalibrationMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10CalibrationId>>,
        TError,
        {id: string;data: CalibrationMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10CalibrationIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single calibration record by its ID
 * @summary Delete calibration by ID
 */
export const deleteApiV10CalibrationId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10CalibrationId200>(
      {url: `/api/v1.0/calibration/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10CalibrationIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10CalibrationId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10CalibrationId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10CalibrationId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10CalibrationId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10CalibrationId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10CalibrationIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10CalibrationId>>>
    
    export type DeleteApiV10CalibrationIdMutationError = void

    /**
 * @summary Delete calibration by ID
 */
export const useDeleteApiV10CalibrationId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10CalibrationId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10CalibrationId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10CalibrationIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of calibration with pagination, filtering and sorting
 * @summary Get all calibration
 */
export const getApiV10Calibration = (
    params?: GetApiV10CalibrationParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/calibration`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10CalibrationQueryKey = (params?: GetApiV10CalibrationParams,) => {
    return [
    `/api/v1.0/calibration`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10CalibrationQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Calibration>>, TError = unknown>(params?: GetApiV10CalibrationParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Calibration>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10CalibrationQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Calibration>>> = ({ signal }) => getApiV10Calibration(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Calibration>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10CalibrationQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Calibration>>>
export type GetApiV10CalibrationQueryError = unknown


export function useGetApiV10Calibration<TData = Awaited<ReturnType<typeof getApiV10Calibration>>, TError = unknown>(
 params: undefined |  GetApiV10CalibrationParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Calibration>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Calibration>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Calibration>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Calibration<TData = Awaited<ReturnType<typeof getApiV10Calibration>>, TError = unknown>(
 params?: GetApiV10CalibrationParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Calibration>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Calibration>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Calibration>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Calibration<TData = Awaited<ReturnType<typeof getApiV10Calibration>>, TError = unknown>(
 params?: GetApiV10CalibrationParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Calibration>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all calibration
 */

export function useGetApiV10Calibration<TData = Awaited<ReturnType<typeof getApiV10Calibration>>, TError = unknown>(
 params?: GetApiV10CalibrationParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Calibration>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10CalibrationQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new calibration record
 * @summary Create a calibration
 */
export const postApiV10Calibration = (
    calibrationMutate: CalibrationMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10Calibration200>(
      {url: `/api/v1.0/calibration`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: calibrationMutate, signal
    },
      );
    }
  


export const getPostApiV10CalibrationMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Calibration>>, TError,{data: CalibrationMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Calibration>>, TError,{data: CalibrationMutate}, TContext> => {

const mutationKey = ['postApiV10Calibration'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Calibration>>, {data: CalibrationMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Calibration(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10CalibrationMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Calibration>>>
    export type PostApiV10CalibrationMutationBody = CalibrationMutate
    export type PostApiV10CalibrationMutationError = unknown

    /**
 * @summary Create a calibration
 */
export const usePostApiV10Calibration = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Calibration>>, TError,{data: CalibrationMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Calibration>>,
        TError,
        {data: CalibrationMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10CalibrationMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    