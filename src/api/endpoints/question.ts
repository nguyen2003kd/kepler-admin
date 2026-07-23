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
  GetApiV10QuestionParams,
  QuestionMutate
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * @summary Get question by ID
 */
export const getApiV10QuestionId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/question/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10QuestionIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/question/${id}`
    ] as const;
    }

    
export const getGetApiV10QuestionIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10QuestionId>>, TError = unknown>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuestionId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10QuestionIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10QuestionId>>> = ({ signal }) => getApiV10QuestionId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuestionId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10QuestionIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10QuestionId>>>
export type GetApiV10QuestionIdQueryError = unknown


export function useGetApiV10QuestionId<TData = Awaited<ReturnType<typeof getApiV10QuestionId>>, TError = unknown>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuestionId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10QuestionId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10QuestionId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10QuestionId<TData = Awaited<ReturnType<typeof getApiV10QuestionId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuestionId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10QuestionId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10QuestionId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10QuestionId<TData = Awaited<ReturnType<typeof getApiV10QuestionId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuestionId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get question by ID
 */

export function useGetApiV10QuestionId<TData = Awaited<ReturnType<typeof getApiV10QuestionId>>, TError = unknown>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuestionId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10QuestionIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Update question by ID
 */
export const putApiV10QuestionId = (
    id: string,
    questionMutate: QuestionMutate,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/question/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: questionMutate
    },
      );
    }
  


export const getPutApiV10QuestionIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10QuestionId>>, TError,{id: string;data: QuestionMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10QuestionId>>, TError,{id: string;data: QuestionMutate}, TContext> => {

const mutationKey = ['putApiV10QuestionId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10QuestionId>>, {id: string;data: QuestionMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10QuestionId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10QuestionIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10QuestionId>>>
    export type PutApiV10QuestionIdMutationBody = QuestionMutate
    export type PutApiV10QuestionIdMutationError = unknown

    /**
 * @summary Update question by ID
 */
export const usePutApiV10QuestionId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10QuestionId>>, TError,{id: string;data: QuestionMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10QuestionId>>,
        TError,
        {id: string;data: QuestionMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10QuestionIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Delete question by ID
 */
export const deleteApiV10QuestionId = (
    id: string,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/question/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10QuestionIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10QuestionId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10QuestionId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10QuestionId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10QuestionId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10QuestionId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10QuestionIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10QuestionId>>>
    
    export type DeleteApiV10QuestionIdMutationError = unknown

    /**
 * @summary Delete question by ID
 */
export const useDeleteApiV10QuestionId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10QuestionId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10QuestionId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10QuestionIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Get all questions
 */
export const getApiV10Question = (
    params?: GetApiV10QuestionParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/question`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10QuestionQueryKey = (params?: GetApiV10QuestionParams,) => {
    return [
    `/api/v1.0/question`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10QuestionQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Question>>, TError = unknown>(params?: GetApiV10QuestionParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Question>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10QuestionQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Question>>> = ({ signal }) => getApiV10Question(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Question>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10QuestionQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Question>>>
export type GetApiV10QuestionQueryError = unknown


export function useGetApiV10Question<TData = Awaited<ReturnType<typeof getApiV10Question>>, TError = unknown>(
 params: undefined |  GetApiV10QuestionParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Question>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Question>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Question>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Question<TData = Awaited<ReturnType<typeof getApiV10Question>>, TError = unknown>(
 params?: GetApiV10QuestionParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Question>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Question>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Question>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Question<TData = Awaited<ReturnType<typeof getApiV10Question>>, TError = unknown>(
 params?: GetApiV10QuestionParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Question>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all questions
 */

export function useGetApiV10Question<TData = Awaited<ReturnType<typeof getApiV10Question>>, TError = unknown>(
 params?: GetApiV10QuestionParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Question>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10QuestionQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Create user question
 */
export const postApiV10Question = (
    questionMutate: QuestionMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/question`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: questionMutate, signal
    },
      );
    }
  


export const getPostApiV10QuestionMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Question>>, TError,{data: QuestionMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Question>>, TError,{data: QuestionMutate}, TContext> => {

const mutationKey = ['postApiV10Question'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Question>>, {data: QuestionMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Question(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10QuestionMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Question>>>
    export type PostApiV10QuestionMutationBody = QuestionMutate
    export type PostApiV10QuestionMutationError = unknown

    /**
 * @summary Create user question
 */
export const usePostApiV10Question = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Question>>, TError,{data: QuestionMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Question>>,
        TError,
        {data: QuestionMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10QuestionMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    