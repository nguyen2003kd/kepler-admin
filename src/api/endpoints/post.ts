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
  DeleteApiV10PostId200,
  GetApiV10PostId200,
  GetApiV10PostIdApprovalHistoriesParams,
  GetApiV10PostParams,
  GetApiV10PostSlugSlug200,
  PostApiV10Post200,
  PostApiV10PostIdResult200,
  PostApprovalResult,
  PostMutate,
  PutApiV10PostId200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single post record by its ID
 * @summary Get post by ID
 */
export const getApiV10PostId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10PostId200>(
      {url: `/api/v1.0/post/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10PostIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/post/${id}`
    ] as const;
    }

    
export const getGetApiV10PostIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10PostId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PostIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10PostId>>> = ({ signal }) => getApiV10PostId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PostIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10PostId>>>
export type GetApiV10PostIdQueryError = void


export function useGetApiV10PostId<TData = Awaited<ReturnType<typeof getApiV10PostId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PostId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PostId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PostId<TData = Awaited<ReturnType<typeof getApiV10PostId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PostId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PostId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PostId<TData = Awaited<ReturnType<typeof getApiV10PostId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get post by ID
 */

export function useGetApiV10PostId<TData = Awaited<ReturnType<typeof getApiV10PostId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PostIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single post record by its ID. Replaces all existing post_content and post_content_images with the new data.
 * @summary Update post by ID
 */
export const putApiV10PostId = (
    id: string,
    postMutate: PostMutate,
 ) => {
      
      
      return mainInstance<PutApiV10PostId200>(
      {url: `/api/v1.0/post/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: postMutate
    },
      );
    }
  


export const getPutApiV10PostIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10PostId>>, TError,{id: string;data: PostMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10PostId>>, TError,{id: string;data: PostMutate}, TContext> => {

const mutationKey = ['putApiV10PostId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10PostId>>, {id: string;data: PostMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10PostId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10PostIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10PostId>>>
    export type PutApiV10PostIdMutationBody = PostMutate
    export type PutApiV10PostIdMutationError = void

    /**
 * @summary Update post by ID
 */
export const usePutApiV10PostId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10PostId>>, TError,{id: string;data: PostMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10PostId>>,
        TError,
        {id: string;data: PostMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10PostIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single post record by its ID
 * @summary Delete post by ID
 */
export const deleteApiV10PostId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10PostId200>(
      {url: `/api/v1.0/post/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10PostIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PostId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PostId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10PostId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10PostId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10PostId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10PostIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10PostId>>>
    
    export type DeleteApiV10PostIdMutationError = void

    /**
 * @summary Delete post by ID
 */
export const useDeleteApiV10PostId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10PostId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10PostId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10PostIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Get approval histories by post ID
 */
export const getApiV10PostIdApprovalHistories = (
    id: string,
    params?: GetApiV10PostIdApprovalHistoriesParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/post/${id}/approvalHistories`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10PostIdApprovalHistoriesQueryKey = (id?: string,
    params?: GetApiV10PostIdApprovalHistoriesParams,) => {
    return [
    `/api/v1.0/post/${id}/approvalHistories`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10PostIdApprovalHistoriesQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>, TError = unknown>(id: string,
    params?: GetApiV10PostIdApprovalHistoriesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PostIdApprovalHistoriesQueryKey(id,params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>> = ({ signal }) => getApiV10PostIdApprovalHistories(id,params, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PostIdApprovalHistoriesQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>>
export type GetApiV10PostIdApprovalHistoriesQueryError = unknown


export function useGetApiV10PostIdApprovalHistories<TData = Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>, TError = unknown>(
 id: string,
    params: undefined |  GetApiV10PostIdApprovalHistoriesParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PostIdApprovalHistories<TData = Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>, TError = unknown>(
 id: string,
    params?: GetApiV10PostIdApprovalHistoriesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PostIdApprovalHistories<TData = Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>, TError = unknown>(
 id: string,
    params?: GetApiV10PostIdApprovalHistoriesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get approval histories by post ID
 */

export function useGetApiV10PostIdApprovalHistories<TData = Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>, TError = unknown>(
 id: string,
    params?: GetApiV10PostIdApprovalHistoriesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostIdApprovalHistories>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PostIdApprovalHistoriesQueryOptions(id,params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Approve or reject post
 */
export const postApiV10PostIdResult = (
    id: string,
    postApprovalResult: PostApprovalResult,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10PostIdResult200>(
      {url: `/api/v1.0/post/${id}/result`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: postApprovalResult, signal
    },
      );
    }
  


export const getPostApiV10PostIdResultMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10PostIdResult>>, TError,{id: string;data: PostApprovalResult}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10PostIdResult>>, TError,{id: string;data: PostApprovalResult}, TContext> => {

const mutationKey = ['postApiV10PostIdResult'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10PostIdResult>>, {id: string;data: PostApprovalResult}> = (props) => {
          const {id,data} = props ?? {};

          return  postApiV10PostIdResult(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10PostIdResultMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10PostIdResult>>>
    export type PostApiV10PostIdResultMutationBody = PostApprovalResult
    export type PostApiV10PostIdResultMutationError = unknown

    /**
 * @summary Approve or reject post
 */
export const usePostApiV10PostIdResult = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10PostIdResult>>, TError,{id: string;data: PostApprovalResult}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10PostIdResult>>,
        TError,
        {id: string;data: PostApprovalResult},
        TContext
      > => {

      const mutationOptions = getPostApiV10PostIdResultMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of post with pagination, filtering and sorting. Supports filtering by category_id and page_id. Can sort by view count using sortField=view.
 * @summary Get all post
 */
export const getApiV10Post = (
    params?: GetApiV10PostParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/post`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10PostQueryKey = (params?: GetApiV10PostParams,) => {
    return [
    `/api/v1.0/post`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10PostQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Post>>, TError = unknown>(params?: GetApiV10PostParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Post>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PostQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Post>>> = ({ signal }) => getApiV10Post(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Post>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PostQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Post>>>
export type GetApiV10PostQueryError = unknown


export function useGetApiV10Post<TData = Awaited<ReturnType<typeof getApiV10Post>>, TError = unknown>(
 params: undefined |  GetApiV10PostParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Post>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Post>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Post>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Post<TData = Awaited<ReturnType<typeof getApiV10Post>>, TError = unknown>(
 params?: GetApiV10PostParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Post>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Post>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Post>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Post<TData = Awaited<ReturnType<typeof getApiV10Post>>, TError = unknown>(
 params?: GetApiV10PostParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Post>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all post
 */

export function useGetApiV10Post<TData = Awaited<ReturnType<typeof getApiV10Post>>, TError = unknown>(
 params?: GetApiV10PostParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Post>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PostQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new post record with nested post_content and post_content_images. Note: if code or slug is not provided, they will be AUTO-GENERATED.
 * @summary Create a post with content. Note: if code or slug is not provided, they will be AUTO-GENERATED.
 */
export const postApiV10Post = (
    postMutate: PostMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10Post200>(
      {url: `/api/v1.0/post`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: postMutate, signal
    },
      );
    }
  


export const getPostApiV10PostMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Post>>, TError,{data: PostMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Post>>, TError,{data: PostMutate}, TContext> => {

const mutationKey = ['postApiV10Post'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Post>>, {data: PostMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Post(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10PostMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Post>>>
    export type PostApiV10PostMutationBody = PostMutate
    export type PostApiV10PostMutationError = unknown

    /**
 * @summary Create a post with content. Note: if code or slug is not provided, they will be AUTO-GENERATED.
 */
export const usePostApiV10Post = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Post>>, TError,{data: PostMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Post>>,
        TError,
        {data: PostMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10PostMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a single post record by its slug
 * @summary Get post by slug
 */
export const getApiV10PostSlugSlug = (
    slug: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10PostSlugSlug200>(
      {url: `/api/v1.0/post/slug/${slug}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10PostSlugSlugQueryKey = (slug?: string,) => {
    return [
    `/api/v1.0/post/slug/${slug}`
    ] as const;
    }

    
export const getGetApiV10PostSlugSlugQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10PostSlugSlug>>, TError = void>(slug: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostSlugSlug>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10PostSlugSlugQueryKey(slug);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10PostSlugSlug>>> = ({ signal }) => getApiV10PostSlugSlug(slug, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(slug), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostSlugSlug>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10PostSlugSlugQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10PostSlugSlug>>>
export type GetApiV10PostSlugSlugQueryError = void


export function useGetApiV10PostSlugSlug<TData = Awaited<ReturnType<typeof getApiV10PostSlugSlug>>, TError = void>(
 slug: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostSlugSlug>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PostSlugSlug>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PostSlugSlug>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PostSlugSlug<TData = Awaited<ReturnType<typeof getApiV10PostSlugSlug>>, TError = void>(
 slug: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostSlugSlug>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10PostSlugSlug>>,
          TError,
          Awaited<ReturnType<typeof getApiV10PostSlugSlug>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10PostSlugSlug<TData = Awaited<ReturnType<typeof getApiV10PostSlugSlug>>, TError = void>(
 slug: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostSlugSlug>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get post by slug
 */

export function useGetApiV10PostSlugSlug<TData = Awaited<ReturnType<typeof getApiV10PostSlugSlug>>, TError = void>(
 slug: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10PostSlugSlug>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10PostSlugSlugQueryOptions(slug,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




