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
  CandidateFileBulkMutate,
  GetApiV10CandidateFileParams
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Remove a specific file from a candidate
 * @summary Remove file from candidate
 */
export const deleteApiV10CandidateFileCandidateIdFileId = (
    candidateId: string,
    fileId: string,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/candidateFile/${candidateId}/${fileId}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10CandidateFileCandidateIdFileIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10CandidateFileCandidateIdFileId>>, TError,{candidateId: string;fileId: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10CandidateFileCandidateIdFileId>>, TError,{candidateId: string;fileId: string}, TContext> => {

const mutationKey = ['deleteApiV10CandidateFileCandidateIdFileId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10CandidateFileCandidateIdFileId>>, {candidateId: string;fileId: string}> = (props) => {
          const {candidateId,fileId} = props ?? {};

          return  deleteApiV10CandidateFileCandidateIdFileId(candidateId,fileId,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10CandidateFileCandidateIdFileIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10CandidateFileCandidateIdFileId>>>
    
    export type DeleteApiV10CandidateFileCandidateIdFileIdMutationError = unknown

    /**
 * @summary Remove file from candidate
 */
export const useDeleteApiV10CandidateFileCandidateIdFileId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10CandidateFileCandidateIdFileId>>, TError,{candidateId: string;fileId: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10CandidateFileCandidateIdFileId>>,
        TError,
        {candidateId: string;fileId: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10CandidateFileCandidateIdFileIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Add multiple files to one candidate in a single request
 * @summary Add files to a candidate (bulk)
 */
export const postApiV10CandidateFileBulk = (
    candidateFileBulkMutate: CandidateFileBulkMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/candidateFile/bulk`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: candidateFileBulkMutate, signal
    },
      );
    }
  


export const getPostApiV10CandidateFileBulkMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10CandidateFileBulk>>, TError,{data: CandidateFileBulkMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10CandidateFileBulk>>, TError,{data: CandidateFileBulkMutate}, TContext> => {

const mutationKey = ['postApiV10CandidateFileBulk'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10CandidateFileBulk>>, {data: CandidateFileBulkMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10CandidateFileBulk(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10CandidateFileBulkMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10CandidateFileBulk>>>
    export type PostApiV10CandidateFileBulkMutationBody = CandidateFileBulkMutate
    export type PostApiV10CandidateFileBulkMutationError = unknown

    /**
 * @summary Add files to a candidate (bulk)
 */
export const usePostApiV10CandidateFileBulk = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10CandidateFileBulk>>, TError,{data: CandidateFileBulkMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10CandidateFileBulk>>,
        TError,
        {data: CandidateFileBulkMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10CandidateFileBulkMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve candidate file assignments with pagination, filtering and sorting
 * @summary Get all candidate files
 */
export const getApiV10CandidateFile = (
    params?: GetApiV10CandidateFileParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/candidateFile`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10CandidateFileQueryKey = (params?: GetApiV10CandidateFileParams,) => {
    return [
    `/api/v1.0/candidateFile`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10CandidateFileQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10CandidateFile>>, TError = unknown>(params?: GetApiV10CandidateFileParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateFile>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10CandidateFileQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10CandidateFile>>> = ({ signal }) => getApiV10CandidateFile(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateFile>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10CandidateFileQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10CandidateFile>>>
export type GetApiV10CandidateFileQueryError = unknown


export function useGetApiV10CandidateFile<TData = Awaited<ReturnType<typeof getApiV10CandidateFile>>, TError = unknown>(
 params: undefined |  GetApiV10CandidateFileParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateFile>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10CandidateFile>>,
          TError,
          Awaited<ReturnType<typeof getApiV10CandidateFile>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10CandidateFile<TData = Awaited<ReturnType<typeof getApiV10CandidateFile>>, TError = unknown>(
 params?: GetApiV10CandidateFileParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateFile>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10CandidateFile>>,
          TError,
          Awaited<ReturnType<typeof getApiV10CandidateFile>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10CandidateFile<TData = Awaited<ReturnType<typeof getApiV10CandidateFile>>, TError = unknown>(
 params?: GetApiV10CandidateFileParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateFile>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all candidate files
 */

export function useGetApiV10CandidateFile<TData = Awaited<ReturnType<typeof getApiV10CandidateFile>>, TError = unknown>(
 params?: GetApiV10CandidateFileParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CandidateFile>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10CandidateFileQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




