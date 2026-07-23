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
  CandidateMutate,
  GetApiV10CandidateExportParams,
  GetApiV10CandidateParams
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * @summary Get candidate by ID
 */
export const getApiV10CandidateId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/candidate/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10CandidateIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/candidate/${id}`
    ] as const;
    }

    
export const getGetApiV10CandidateIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10CandidateId>>, TError = unknown>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10CandidateIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10CandidateId>>> = ({ signal }) => getApiV10CandidateId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10CandidateIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10CandidateId>>>
export type GetApiV10CandidateIdQueryError = unknown


export function useGetApiV10CandidateId<TData = Awaited<ReturnType<typeof getApiV10CandidateId>>, TError = unknown>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10CandidateId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10CandidateId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10CandidateId<TData = Awaited<ReturnType<typeof getApiV10CandidateId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10CandidateId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10CandidateId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10CandidateId<TData = Awaited<ReturnType<typeof getApiV10CandidateId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get candidate by ID
 */

export function useGetApiV10CandidateId<TData = Awaited<ReturnType<typeof getApiV10CandidateId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10CandidateIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Update candidate by ID
 */
export const putApiV10CandidateId = (
    id: string,
    candidateMutate: CandidateMutate,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/candidate/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: candidateMutate
    },
      );
    }
  


export const getPutApiV10CandidateIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10CandidateId>>, TError,{id: string;data: CandidateMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10CandidateId>>, TError,{id: string;data: CandidateMutate}, TContext> => {

const mutationKey = ['putApiV10CandidateId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10CandidateId>>, {id: string;data: CandidateMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10CandidateId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10CandidateIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10CandidateId>>>
    export type PutApiV10CandidateIdMutationBody = CandidateMutate
    export type PutApiV10CandidateIdMutationError = unknown

    /**
 * @summary Update candidate by ID
 */
export const usePutApiV10CandidateId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10CandidateId>>, TError,{id: string;data: CandidateMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10CandidateId>>,
        TError,
        {id: string;data: CandidateMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10CandidateIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Delete candidate by ID
 */
export const deleteApiV10CandidateId = (
    id: string,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/candidate/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10CandidateIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10CandidateId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10CandidateId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10CandidateId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10CandidateId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10CandidateId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10CandidateIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10CandidateId>>>
    
    export type DeleteApiV10CandidateIdMutationError = unknown

    /**
 * @summary Delete candidate by ID
 */
export const useDeleteApiV10CandidateId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10CandidateId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10CandidateId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10CandidateIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Export candidates to Excel file
 */
export const getApiV10CandidateExport = (
    params?: GetApiV10CandidateExportParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/candidate/export`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10CandidateExportQueryKey = (params?: GetApiV10CandidateExportParams,) => {
    return [
    `/api/v1.0/candidate/export`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10CandidateExportQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10CandidateExport>>, TError = unknown>(params?: GetApiV10CandidateExportParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateExport>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10CandidateExportQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10CandidateExport>>> = ({ signal }) => getApiV10CandidateExport(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateExport>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10CandidateExportQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10CandidateExport>>>
export type GetApiV10CandidateExportQueryError = unknown


export function useGetApiV10CandidateExport<TData = Awaited<ReturnType<typeof getApiV10CandidateExport>>, TError = unknown>(
 params: undefined |  GetApiV10CandidateExportParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateExport>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10CandidateExport>>,
          TError,
          Awaited<ReturnType<typeof getApiV10CandidateExport>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10CandidateExport<TData = Awaited<ReturnType<typeof getApiV10CandidateExport>>, TError = unknown>(
 params?: GetApiV10CandidateExportParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateExport>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10CandidateExport>>,
          TError,
          Awaited<ReturnType<typeof getApiV10CandidateExport>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10CandidateExport<TData = Awaited<ReturnType<typeof getApiV10CandidateExport>>, TError = unknown>(
 params?: GetApiV10CandidateExportParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateExport>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Export candidates to Excel file
 */

export function useGetApiV10CandidateExport<TData = Awaited<ReturnType<typeof getApiV10CandidateExport>>, TError = unknown>(
 params?: GetApiV10CandidateExportParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateExport>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10CandidateExportQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Get all candidates
 */
export const getApiV10Candidate = (
    params?: GetApiV10CandidateParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/candidate`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10CandidateQueryKey = (params?: GetApiV10CandidateParams,) => {
    return [
    `/api/v1.0/candidate`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10CandidateQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Candidate>>, TError = unknown>(params?: GetApiV10CandidateParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Candidate>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10CandidateQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Candidate>>> = ({ signal }) => getApiV10Candidate(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Candidate>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10CandidateQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Candidate>>>
export type GetApiV10CandidateQueryError = unknown


export function useGetApiV10Candidate<TData = Awaited<ReturnType<typeof getApiV10Candidate>>, TError = unknown>(
 params: undefined |  GetApiV10CandidateParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Candidate>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Candidate>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Candidate>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Candidate<TData = Awaited<ReturnType<typeof getApiV10Candidate>>, TError = unknown>(
 params?: GetApiV10CandidateParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Candidate>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Candidate>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Candidate>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Candidate<TData = Awaited<ReturnType<typeof getApiV10Candidate>>, TError = unknown>(
 params?: GetApiV10CandidateParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Candidate>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all candidates
 */

export function useGetApiV10Candidate<TData = Awaited<ReturnType<typeof getApiV10Candidate>>, TError = unknown>(
 params?: GetApiV10CandidateParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Candidate>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10CandidateQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Create candidate profile
 */
export const postApiV10Candidate = (
    candidateMutate: CandidateMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/candidate`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: candidateMutate, signal
    },
      );
    }
  


export const getPostApiV10CandidateMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Candidate>>, TError,{data: CandidateMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Candidate>>, TError,{data: CandidateMutate}, TContext> => {

const mutationKey = ['postApiV10Candidate'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Candidate>>, {data: CandidateMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Candidate(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10CandidateMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Candidate>>>
    export type PostApiV10CandidateMutationBody = CandidateMutate
    export type PostApiV10CandidateMutationError = unknown

    /**
 * @summary Create candidate profile
 */
export const usePostApiV10Candidate = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Candidate>>, TError,{data: CandidateMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Candidate>>,
        TError,
        {data: CandidateMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10CandidateMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    