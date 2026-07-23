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
  DeleteApiV10OrganizationChartId200,
  GetApiV10OrganizationChart200,
  GetApiV10OrganizationChartId200,
  OrganizationChartMutate,
  PostApiV10OrganizationChart200,
  PutApiV10OrganizationChartId200
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * @summary Get node by ID
 */
export const getApiV10OrganizationChartId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10OrganizationChartId200>(
      {url: `/api/v1.0/organizationChart/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10OrganizationChartIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/organizationChart/${id}`
    ] as const;
    }

    
export const getGetApiV10OrganizationChartIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10OrganizationChartId>>, TError = unknown>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10OrganizationChartId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10OrganizationChartIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10OrganizationChartId>>> = ({ signal }) => getApiV10OrganizationChartId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10OrganizationChartId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10OrganizationChartIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10OrganizationChartId>>>
export type GetApiV10OrganizationChartIdQueryError = unknown


export function useGetApiV10OrganizationChartId<TData = Awaited<ReturnType<typeof getApiV10OrganizationChartId>>, TError = unknown>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10OrganizationChartId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10OrganizationChartId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10OrganizationChartId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10OrganizationChartId<TData = Awaited<ReturnType<typeof getApiV10OrganizationChartId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10OrganizationChartId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10OrganizationChartId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10OrganizationChartId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10OrganizationChartId<TData = Awaited<ReturnType<typeof getApiV10OrganizationChartId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10OrganizationChartId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get node by ID
 */

export function useGetApiV10OrganizationChartId<TData = Awaited<ReturnType<typeof getApiV10OrganizationChartId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10OrganizationChartId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10OrganizationChartIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Update node by ID
 */
export const putApiV10OrganizationChartId = (
    id: string,
    organizationChartMutate: OrganizationChartMutate,
 ) => {
      
      
      return mainInstance<PutApiV10OrganizationChartId200>(
      {url: `/api/v1.0/organizationChart/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: organizationChartMutate
    },
      );
    }
  


export const getPutApiV10OrganizationChartIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10OrganizationChartId>>, TError,{id: string;data: OrganizationChartMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10OrganizationChartId>>, TError,{id: string;data: OrganizationChartMutate}, TContext> => {

const mutationKey = ['putApiV10OrganizationChartId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10OrganizationChartId>>, {id: string;data: OrganizationChartMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10OrganizationChartId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10OrganizationChartIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10OrganizationChartId>>>
    export type PutApiV10OrganizationChartIdMutationBody = OrganizationChartMutate
    export type PutApiV10OrganizationChartIdMutationError = unknown

    /**
 * @summary Update node by ID
 */
export const usePutApiV10OrganizationChartId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10OrganizationChartId>>, TError,{id: string;data: OrganizationChartMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10OrganizationChartId>>,
        TError,
        {id: string;data: OrganizationChartMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10OrganizationChartIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Delete node by ID
 */
export const deleteApiV10OrganizationChartId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10OrganizationChartId200>(
      {url: `/api/v1.0/organizationChart/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10OrganizationChartIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10OrganizationChartId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10OrganizationChartId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10OrganizationChartId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10OrganizationChartId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10OrganizationChartId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10OrganizationChartIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10OrganizationChartId>>>
    
    export type DeleteApiV10OrganizationChartIdMutationError = unknown

    /**
 * @summary Delete node by ID
 */
export const useDeleteApiV10OrganizationChartId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10OrganizationChartId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10OrganizationChartId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10OrganizationChartIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve all organization chart nodes as a flat list sorted by coordinates.x and coordinates.y.
 * @summary Get all nodes sorted by coordinates
 */
export const getApiV10OrganizationChart = (
    
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10OrganizationChart200>(
      {url: `/api/v1.0/organizationChart`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10OrganizationChartQueryKey = () => {
    return [
    `/api/v1.0/organizationChart`
    ] as const;
    }

    
export const getGetApiV10OrganizationChartQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10OrganizationChart>>, TError = unknown>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10OrganizationChart>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10OrganizationChartQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10OrganizationChart>>> = ({ signal }) => getApiV10OrganizationChart(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10OrganizationChart>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10OrganizationChartQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10OrganizationChart>>>
export type GetApiV10OrganizationChartQueryError = unknown


export function useGetApiV10OrganizationChart<TData = Awaited<ReturnType<typeof getApiV10OrganizationChart>>, TError = unknown>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10OrganizationChart>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10OrganizationChart>>,
          TError,
          Awaited<ReturnType<typeof getApiV10OrganizationChart>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10OrganizationChart<TData = Awaited<ReturnType<typeof getApiV10OrganizationChart>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10OrganizationChart>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10OrganizationChart>>,
          TError,
          Awaited<ReturnType<typeof getApiV10OrganizationChart>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10OrganizationChart<TData = Awaited<ReturnType<typeof getApiV10OrganizationChart>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10OrganizationChart>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all nodes sorted by coordinates
 */

export function useGetApiV10OrganizationChart<TData = Awaited<ReturnType<typeof getApiV10OrganizationChart>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10OrganizationChart>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10OrganizationChartQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Create organization chart node
 */
export const postApiV10OrganizationChart = (
    organizationChartMutate: OrganizationChartMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10OrganizationChart200>(
      {url: `/api/v1.0/organizationChart`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: organizationChartMutate, signal
    },
      );
    }
  


export const getPostApiV10OrganizationChartMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10OrganizationChart>>, TError,{data: OrganizationChartMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10OrganizationChart>>, TError,{data: OrganizationChartMutate}, TContext> => {

const mutationKey = ['postApiV10OrganizationChart'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10OrganizationChart>>, {data: OrganizationChartMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10OrganizationChart(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10OrganizationChartMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10OrganizationChart>>>
    export type PostApiV10OrganizationChartMutationBody = OrganizationChartMutate
    export type PostApiV10OrganizationChartMutationError = unknown

    /**
 * @summary Create organization chart node
 */
export const usePostApiV10OrganizationChart = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10OrganizationChart>>, TError,{data: OrganizationChartMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10OrganizationChart>>,
        TError,
        {data: OrganizationChartMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10OrganizationChartMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    