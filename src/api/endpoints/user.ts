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
  DeleteApiV10UserId200,
  GetApiV10UserId200,
  GetApiV10UserParams,
  PostApiV10User200,
  PutApiV10UserId200,
  PutApiV10UserIdResetPassword200,
  ResponseGetAllData,
  UserMutate
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single user record by its ID
 * @summary Get user by ID
 */
export const getApiV10UserId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10UserId200>(
      {url: `/api/v1.0/user/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10UserIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/user/${id}`
    ] as const;
    }

    
export const getGetApiV10UserIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10UserId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10UserIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10UserId>>> = ({ signal }) => getApiV10UserId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10UserIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10UserId>>>
export type GetApiV10UserIdQueryError = void


export function useGetApiV10UserId<TData = Awaited<ReturnType<typeof getApiV10UserId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10UserId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10UserId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10UserId<TData = Awaited<ReturnType<typeof getApiV10UserId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10UserId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10UserId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10UserId<TData = Awaited<ReturnType<typeof getApiV10UserId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get user by ID
 */

export function useGetApiV10UserId<TData = Awaited<ReturnType<typeof getApiV10UserId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10UserId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10UserIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single user record by its ID
 * @summary Update user by ID
 */
export const putApiV10UserId = (
    id: string,
    userMutate: UserMutate,
 ) => {
      
      
      return mainInstance<PutApiV10UserId200>(
      {url: `/api/v1.0/user/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: userMutate
    },
      );
    }
  


export const getPutApiV10UserIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10UserId>>, TError,{id: string;data: UserMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10UserId>>, TError,{id: string;data: UserMutate}, TContext> => {

const mutationKey = ['putApiV10UserId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10UserId>>, {id: string;data: UserMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10UserId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10UserIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10UserId>>>
    export type PutApiV10UserIdMutationBody = UserMutate
    export type PutApiV10UserIdMutationError = void

    /**
 * @summary Update user by ID
 */
export const usePutApiV10UserId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10UserId>>, TError,{id: string;data: UserMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10UserId>>,
        TError,
        {id: string;data: UserMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10UserIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single user record by its ID
 * @summary Delete user by ID
 */
export const deleteApiV10UserId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10UserId200>(
      {url: `/api/v1.0/user/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10UserIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10UserId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10UserId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10UserId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10UserId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10UserId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10UserIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10UserId>>>
    
    export type DeleteApiV10UserIdMutationError = void

    /**
 * @summary Delete user by ID
 */
export const useDeleteApiV10UserId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10UserId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10UserId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10UserIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Reset user password to default value
 * @summary Reset user password to default
 */
export const putApiV10UserIdResetPassword = (
    id: string,
 ) => {
      
      
      return mainInstance<PutApiV10UserIdResetPassword200>(
      {url: `/api/v1.0/user/${id}/resetPassword`, method: 'PUT'
    },
      );
    }
  


export const getPutApiV10UserIdResetPasswordMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10UserIdResetPassword>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10UserIdResetPassword>>, TError,{id: string}, TContext> => {

const mutationKey = ['putApiV10UserIdResetPassword'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10UserIdResetPassword>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  putApiV10UserIdResetPassword(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10UserIdResetPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10UserIdResetPassword>>>
    
    export type PutApiV10UserIdResetPasswordMutationError = void

    /**
 * @summary Reset user password to default
 */
export const usePutApiV10UserIdResetPassword = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10UserIdResetPassword>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10UserIdResetPassword>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getPutApiV10UserIdResetPasswordMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of user with pagination, filtering and sorting
 * @summary Get all user
 */
export const getApiV10User = (
    params?: GetApiV10UserParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/user`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10UserQueryKey = (params?: GetApiV10UserParams,) => {
    return [
    `/api/v1.0/user`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10UserQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10User>>, TError = unknown>(params?: GetApiV10UserParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10User>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10UserQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10User>>> = ({ signal }) => getApiV10User(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10User>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10UserQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10User>>>
export type GetApiV10UserQueryError = unknown


export function useGetApiV10User<TData = Awaited<ReturnType<typeof getApiV10User>>, TError = unknown>(
 params: undefined |  GetApiV10UserParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10User>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10User>>,
          TError,
          Awaited<ReturnType<typeof getApiV10User>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10User<TData = Awaited<ReturnType<typeof getApiV10User>>, TError = unknown>(
 params?: GetApiV10UserParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10User>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10User>>,
          TError,
          Awaited<ReturnType<typeof getApiV10User>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10User<TData = Awaited<ReturnType<typeof getApiV10User>>, TError = unknown>(
 params?: GetApiV10UserParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10User>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all user
 */

export function useGetApiV10User<TData = Awaited<ReturnType<typeof getApiV10User>>, TError = unknown>(
 params?: GetApiV10UserParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10User>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10UserQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new user record
 * @summary Create a user
 */
export const postApiV10User = (
    userMutate: UserMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10User200>(
      {url: `/api/v1.0/user`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: userMutate, signal
    },
      );
    }
  


export const getPostApiV10UserMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10User>>, TError,{data: UserMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10User>>, TError,{data: UserMutate}, TContext> => {

const mutationKey = ['postApiV10User'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10User>>, {data: UserMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10User(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10UserMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10User>>>
    export type PostApiV10UserMutationBody = UserMutate
    export type PostApiV10UserMutationError = unknown

    /**
 * @summary Create a user
 */
export const usePostApiV10User = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10User>>, TError,{data: UserMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10User>>,
        TError,
        {data: UserMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10UserMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    