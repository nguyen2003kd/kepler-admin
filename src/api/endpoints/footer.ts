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
  FooterMutate,
  GetApiV10FooterId200,
  GetApiV10FooterParams,
  PostApiV10Footer200,
  PutApiV10FooterId200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single footer record by its ID
 * @summary Get footer by ID
 */
export const getApiV10FooterId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10FooterId200>(
      {url: `/api/v1.0/footer/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10FooterIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/footer/${id}`
    ] as const;
    }

    
export const getGetApiV10FooterIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10FooterId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10FooterId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10FooterIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10FooterId>>> = ({ signal }) => getApiV10FooterId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10FooterId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10FooterIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10FooterId>>>
export type GetApiV10FooterIdQueryError = void


export function useGetApiV10FooterId<TData = Awaited<ReturnType<typeof getApiV10FooterId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10FooterId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10FooterId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10FooterId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10FooterId<TData = Awaited<ReturnType<typeof getApiV10FooterId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10FooterId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10FooterId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10FooterId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10FooterId<TData = Awaited<ReturnType<typeof getApiV10FooterId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10FooterId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get footer by ID
 */

export function useGetApiV10FooterId<TData = Awaited<ReturnType<typeof getApiV10FooterId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10FooterId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10FooterIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single footer record by its ID
 * @summary Update footer by ID
 */
export const putApiV10FooterId = (
    id: string,
    footerMutate: FooterMutate,
 ) => {
      
      
      return mainInstance<PutApiV10FooterId200>(
      {url: `/api/v1.0/footer/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: footerMutate
    },
      );
    }
  


export const getPutApiV10FooterIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10FooterId>>, TError,{id: string;data: FooterMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10FooterId>>, TError,{id: string;data: FooterMutate}, TContext> => {

const mutationKey = ['putApiV10FooterId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10FooterId>>, {id: string;data: FooterMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10FooterId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10FooterIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10FooterId>>>
    export type PutApiV10FooterIdMutationBody = FooterMutate
    export type PutApiV10FooterIdMutationError = void

    /**
 * @summary Update footer by ID
 */
export const usePutApiV10FooterId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10FooterId>>, TError,{id: string;data: FooterMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10FooterId>>,
        TError,
        {id: string;data: FooterMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10FooterIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single footer record by its ID
 * @summary Delete footer by ID
 */
export const deleteApiV10FooterId = (
    id: string,
 ) => {
      
      
      return mainInstance<void>(
      {url: `/api/v1.0/footer/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10FooterIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10FooterId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10FooterId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10FooterId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10FooterId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10FooterId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10FooterIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10FooterId>>>
    
    export type DeleteApiV10FooterIdMutationError = void

    /**
 * @summary Delete footer by ID
 */
export const useDeleteApiV10FooterId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10FooterId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10FooterId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10FooterIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of footers with pagination, filtering and sorting
 * @summary Get all footers
 */
export const getApiV10Footer = (
    params?: GetApiV10FooterParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/footer`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10FooterQueryKey = (params?: GetApiV10FooterParams,) => {
    return [
    `/api/v1.0/footer`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10FooterQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Footer>>, TError = unknown>(params?: GetApiV10FooterParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Footer>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10FooterQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Footer>>> = ({ signal }) => getApiV10Footer(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Footer>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10FooterQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Footer>>>
export type GetApiV10FooterQueryError = unknown


export function useGetApiV10Footer<TData = Awaited<ReturnType<typeof getApiV10Footer>>, TError = unknown>(
 params: undefined |  GetApiV10FooterParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Footer>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Footer>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Footer>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Footer<TData = Awaited<ReturnType<typeof getApiV10Footer>>, TError = unknown>(
 params?: GetApiV10FooterParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Footer>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Footer>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Footer>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Footer<TData = Awaited<ReturnType<typeof getApiV10Footer>>, TError = unknown>(
 params?: GetApiV10FooterParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Footer>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all footers
 */

export function useGetApiV10Footer<TData = Awaited<ReturnType<typeof getApiV10Footer>>, TError = unknown>(
 params?: GetApiV10FooterParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Footer>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10FooterQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new footer record
 * @summary Create a footer
 */
export const postApiV10Footer = (
    footerMutate: FooterMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10Footer200>(
      {url: `/api/v1.0/footer`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: footerMutate, signal
    },
      );
    }
  


export const getPostApiV10FooterMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Footer>>, TError,{data: FooterMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Footer>>, TError,{data: FooterMutate}, TContext> => {

const mutationKey = ['postApiV10Footer'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Footer>>, {data: FooterMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Footer(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10FooterMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Footer>>>
    export type PostApiV10FooterMutationBody = FooterMutate
    export type PostApiV10FooterMutationError = unknown

    /**
 * @summary Create a footer
 */
export const usePostApiV10Footer = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Footer>>, TError,{data: FooterMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Footer>>,
        TError,
        {data: FooterMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10FooterMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    