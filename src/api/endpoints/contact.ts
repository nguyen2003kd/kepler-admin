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
  ContactMutate,
  DeleteApiV10ContactId200,
  GetApiV10ContactId200,
  GetApiV10ContactParams,
  PostApiV10Contact200,
  PutApiV10ContactId200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single contact record by its ID
 * @summary Get contact by ID
 */
export const getApiV10ContactId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10ContactId200>(
      {url: `/api/v1.0/contact/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10ContactIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/contact/${id}`
    ] as const;
    }

    
export const getGetApiV10ContactIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10ContactId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ContactId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10ContactIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10ContactId>>> = ({ signal }) => getApiV10ContactId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10ContactId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10ContactIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10ContactId>>>
export type GetApiV10ContactIdQueryError = void


export function useGetApiV10ContactId<TData = Awaited<ReturnType<typeof getApiV10ContactId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ContactId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10ContactId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10ContactId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10ContactId<TData = Awaited<ReturnType<typeof getApiV10ContactId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ContactId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10ContactId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10ContactId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10ContactId<TData = Awaited<ReturnType<typeof getApiV10ContactId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ContactId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get contact by ID
 */

export function useGetApiV10ContactId<TData = Awaited<ReturnType<typeof getApiV10ContactId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10ContactId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10ContactIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single contact record by its ID
 * @summary Update contact by ID
 */
export const putApiV10ContactId = (
    id: string,
    contactMutate: ContactMutate,
 ) => {
      
      
      return mainInstance<PutApiV10ContactId200>(
      {url: `/api/v1.0/contact/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: contactMutate
    },
      );
    }
  


export const getPutApiV10ContactIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10ContactId>>, TError,{id: string;data: ContactMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10ContactId>>, TError,{id: string;data: ContactMutate}, TContext> => {

const mutationKey = ['putApiV10ContactId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10ContactId>>, {id: string;data: ContactMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10ContactId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10ContactIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10ContactId>>>
    export type PutApiV10ContactIdMutationBody = ContactMutate
    export type PutApiV10ContactIdMutationError = void

    /**
 * @summary Update contact by ID
 */
export const usePutApiV10ContactId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10ContactId>>, TError,{id: string;data: ContactMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10ContactId>>,
        TError,
        {id: string;data: ContactMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10ContactIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single contact record by its ID
 * @summary Delete contact by ID
 */
export const deleteApiV10ContactId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10ContactId200>(
      {url: `/api/v1.0/contact/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10ContactIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10ContactId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10ContactId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10ContactId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10ContactId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10ContactId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10ContactIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10ContactId>>>
    
    export type DeleteApiV10ContactIdMutationError = void

    /**
 * @summary Delete contact by ID
 */
export const useDeleteApiV10ContactId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10ContactId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10ContactId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10ContactIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of contact with pagination, filtering and sorting
 * @summary Get all contact
 */
export const getApiV10Contact = (
    params?: GetApiV10ContactParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/contact`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10ContactQueryKey = (params?: GetApiV10ContactParams,) => {
    return [
    `/api/v1.0/contact`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10ContactQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Contact>>, TError = unknown>(params?: GetApiV10ContactParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Contact>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10ContactQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Contact>>> = ({ signal }) => getApiV10Contact(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Contact>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10ContactQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Contact>>>
export type GetApiV10ContactQueryError = unknown


export function useGetApiV10Contact<TData = Awaited<ReturnType<typeof getApiV10Contact>>, TError = unknown>(
 params: undefined |  GetApiV10ContactParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Contact>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Contact>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Contact>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Contact<TData = Awaited<ReturnType<typeof getApiV10Contact>>, TError = unknown>(
 params?: GetApiV10ContactParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Contact>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Contact>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Contact>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Contact<TData = Awaited<ReturnType<typeof getApiV10Contact>>, TError = unknown>(
 params?: GetApiV10ContactParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Contact>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all contact
 */

export function useGetApiV10Contact<TData = Awaited<ReturnType<typeof getApiV10Contact>>, TError = unknown>(
 params?: GetApiV10ContactParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Contact>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10ContactQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new contact record
 * @summary Create a contact
 */
export const postApiV10Contact = (
    contactMutate: ContactMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10Contact200>(
      {url: `/api/v1.0/contact`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: contactMutate, signal
    },
      );
    }
  


export const getPostApiV10ContactMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Contact>>, TError,{data: ContactMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Contact>>, TError,{data: ContactMutate}, TContext> => {

const mutationKey = ['postApiV10Contact'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Contact>>, {data: ContactMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Contact(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10ContactMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Contact>>>
    export type PostApiV10ContactMutationBody = ContactMutate
    export type PostApiV10ContactMutationError = unknown

    /**
 * @summary Create a contact
 */
export const usePostApiV10Contact = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Contact>>, TError,{data: ContactMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Contact>>,
        TError,
        {data: ContactMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10ContactMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    