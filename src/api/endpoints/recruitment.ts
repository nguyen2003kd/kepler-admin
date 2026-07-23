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
  GetApiV10RecruitmentParams,
  RecruitmentMutate
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * @summary Get recruitment by ID
 */
export const getApiV10RecruitmentId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/recruitment/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10RecruitmentIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/recruitment/${id}`
    ] as const;
    }

    
export const getGetApiV10RecruitmentIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10RecruitmentId>>, TError = unknown>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RecruitmentId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10RecruitmentIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10RecruitmentId>>> = ({ signal }) => getApiV10RecruitmentId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10RecruitmentId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10RecruitmentIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10RecruitmentId>>>
export type GetApiV10RecruitmentIdQueryError = unknown


export function useGetApiV10RecruitmentId<TData = Awaited<ReturnType<typeof getApiV10RecruitmentId>>, TError = unknown>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RecruitmentId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10RecruitmentId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10RecruitmentId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10RecruitmentId<TData = Awaited<ReturnType<typeof getApiV10RecruitmentId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RecruitmentId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10RecruitmentId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10RecruitmentId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10RecruitmentId<TData = Awaited<ReturnType<typeof getApiV10RecruitmentId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RecruitmentId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get recruitment by ID
 */

export function useGetApiV10RecruitmentId<TData = Awaited<ReturnType<typeof getApiV10RecruitmentId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10RecruitmentId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10RecruitmentIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Update recruitment by ID
 */
export const putApiV10RecruitmentId = (
    id: string,
    recruitmentMutate: RecruitmentMutate,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/recruitment/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: recruitmentMutate
    },
      );
    }
  


export const getPutApiV10RecruitmentIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10RecruitmentId>>, TError,{id: string;data: RecruitmentMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10RecruitmentId>>, TError,{id: string;data: RecruitmentMutate}, TContext> => {

const mutationKey = ['putApiV10RecruitmentId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10RecruitmentId>>, {id: string;data: RecruitmentMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10RecruitmentId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10RecruitmentIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10RecruitmentId>>>
    export type PutApiV10RecruitmentIdMutationBody = RecruitmentMutate
    export type PutApiV10RecruitmentIdMutationError = unknown

    /**
 * @summary Update recruitment by ID
 */
export const usePutApiV10RecruitmentId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10RecruitmentId>>, TError,{id: string;data: RecruitmentMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10RecruitmentId>>,
        TError,
        {id: string;data: RecruitmentMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10RecruitmentIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Delete recruitment by ID
 */
export const deleteApiV10RecruitmentId = (
    id: string,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/recruitment/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10RecruitmentIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10RecruitmentId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10RecruitmentId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10RecruitmentId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10RecruitmentId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10RecruitmentId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10RecruitmentIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10RecruitmentId>>>
    
    export type DeleteApiV10RecruitmentIdMutationError = unknown

    /**
 * @summary Delete recruitment by ID
 */
export const useDeleteApiV10RecruitmentId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10RecruitmentId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10RecruitmentId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10RecruitmentIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Get all recruitment positions
 */
export const getApiV10Recruitment = (
    params?: GetApiV10RecruitmentParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/recruitment`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10RecruitmentQueryKey = (params?: GetApiV10RecruitmentParams,) => {
    return [
    `/api/v1.0/recruitment`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10RecruitmentQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Recruitment>>, TError = unknown>(params?: GetApiV10RecruitmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Recruitment>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10RecruitmentQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Recruitment>>> = ({ signal }) => getApiV10Recruitment(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Recruitment>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10RecruitmentQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Recruitment>>>
export type GetApiV10RecruitmentQueryError = unknown


export function useGetApiV10Recruitment<TData = Awaited<ReturnType<typeof getApiV10Recruitment>>, TError = unknown>(
 params: undefined |  GetApiV10RecruitmentParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Recruitment>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Recruitment>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Recruitment>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Recruitment<TData = Awaited<ReturnType<typeof getApiV10Recruitment>>, TError = unknown>(
 params?: GetApiV10RecruitmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Recruitment>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Recruitment>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Recruitment>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Recruitment<TData = Awaited<ReturnType<typeof getApiV10Recruitment>>, TError = unknown>(
 params?: GetApiV10RecruitmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Recruitment>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all recruitment positions
 */

export function useGetApiV10Recruitment<TData = Awaited<ReturnType<typeof getApiV10Recruitment>>, TError = unknown>(
 params?: GetApiV10RecruitmentParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Recruitment>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10RecruitmentQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Create recruitment position
 */
export const postApiV10Recruitment = (
    recruitmentMutate: RecruitmentMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/recruitment`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: recruitmentMutate, signal
    },
      );
    }
  


export const getPostApiV10RecruitmentMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Recruitment>>, TError,{data: RecruitmentMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Recruitment>>, TError,{data: RecruitmentMutate}, TContext> => {

const mutationKey = ['postApiV10Recruitment'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Recruitment>>, {data: RecruitmentMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Recruitment(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10RecruitmentMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Recruitment>>>
    export type PostApiV10RecruitmentMutationBody = RecruitmentMutate
    export type PostApiV10RecruitmentMutationError = unknown

    /**
 * @summary Create recruitment position
 */
export const usePostApiV10Recruitment = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Recruitment>>, TError,{data: RecruitmentMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Recruitment>>,
        TError,
        {data: RecruitmentMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10RecruitmentMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    