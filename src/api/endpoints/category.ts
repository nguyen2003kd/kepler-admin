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
  CategoryBulkItem,
  CategoryMutate,
  DeleteApiV10CategoryId200,
  GetApiV10Category200,
  GetApiV10CategoryId200,
  PostApiV10Category200,
  PostApiV10CategoryBulk200,
  PutApiV10CategoryId200
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single category record by its ID
 * @summary Get category by ID
 */
export const getApiV10CategoryId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10CategoryId200>(
      {url: `/api/v1.0/category/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10CategoryIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/category/${id}`
    ] as const;
    }

    
export const getGetApiV10CategoryIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10CategoryId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CategoryId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10CategoryIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10CategoryId>>> = ({ signal }) => getApiV10CategoryId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10CategoryId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10CategoryIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10CategoryId>>>
export type GetApiV10CategoryIdQueryError = void


export function useGetApiV10CategoryId<TData = Awaited<ReturnType<typeof getApiV10CategoryId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CategoryId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10CategoryId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10CategoryId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10CategoryId<TData = Awaited<ReturnType<typeof getApiV10CategoryId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CategoryId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10CategoryId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10CategoryId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10CategoryId<TData = Awaited<ReturnType<typeof getApiV10CategoryId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CategoryId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get category by ID
 */

export function useGetApiV10CategoryId<TData = Awaited<ReturnType<typeof getApiV10CategoryId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10CategoryId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10CategoryIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single category record by its ID
 * @summary Update category by ID
 */
export const putApiV10CategoryId = (
    id: string,
    categoryMutate: CategoryMutate,
 ) => {
      
      
      return mainInstance<PutApiV10CategoryId200>(
      {url: `/api/v1.0/category/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: categoryMutate
    },
      );
    }
  


export const getPutApiV10CategoryIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10CategoryId>>, TError,{id: string;data: CategoryMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10CategoryId>>, TError,{id: string;data: CategoryMutate}, TContext> => {

const mutationKey = ['putApiV10CategoryId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10CategoryId>>, {id: string;data: CategoryMutate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10CategoryId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10CategoryIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10CategoryId>>>
    export type PutApiV10CategoryIdMutationBody = CategoryMutate
    export type PutApiV10CategoryIdMutationError = void

    /**
 * @summary Update category by ID
 */
export const usePutApiV10CategoryId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10CategoryId>>, TError,{id: string;data: CategoryMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10CategoryId>>,
        TError,
        {id: string;data: CategoryMutate},
        TContext
      > => {

      const mutationOptions = getPutApiV10CategoryIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single category record by its ID. When deleting parent categories, all child categories will set their parent_category_id to null. That means they become root categories.
 * @summary Delete category by ID.
 */
export const deleteApiV10CategoryId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10CategoryId200>(
      {url: `/api/v1.0/category/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10CategoryIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10CategoryId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10CategoryId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10CategoryId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10CategoryId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10CategoryId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10CategoryIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10CategoryId>>>
    
    export type DeleteApiV10CategoryIdMutationError = void

    /**
 * @summary Delete category by ID.
 */
export const useDeleteApiV10CategoryId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10CategoryId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10CategoryId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10CategoryIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Create multiple categories at once with nested children structure.
Each category can have a "categories" array containing child categories.
Children will be created recursively with parent_category_id automatically set.

 * @summary Create categories in bulk with nested children. If code is not provided, it will be AUTO-GENERATED.
 */
export const postApiV10CategoryBulk = (
    categoryBulkItem: CategoryBulkItem[],
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10CategoryBulk200>(
      {url: `/api/v1.0/category/bulk`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: categoryBulkItem, signal
    },
      );
    }
  


export const getPostApiV10CategoryBulkMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10CategoryBulk>>, TError,{data: CategoryBulkItem[]}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10CategoryBulk>>, TError,{data: CategoryBulkItem[]}, TContext> => {

const mutationKey = ['postApiV10CategoryBulk'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10CategoryBulk>>, {data: CategoryBulkItem[]}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10CategoryBulk(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10CategoryBulkMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10CategoryBulk>>>
    export type PostApiV10CategoryBulkMutationBody = CategoryBulkItem[]
    export type PostApiV10CategoryBulkMutationError = void

    /**
 * @summary Create categories in bulk with nested children. If code is not provided, it will be AUTO-GENERATED.
 */
export const usePostApiV10CategoryBulk = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10CategoryBulk>>, TError,{data: CategoryBulkItem[]}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10CategoryBulk>>,
        TError,
        {data: CategoryBulkItem[]},
        TContext
      > => {

      const mutationOptions = getPostApiV10CategoryBulkMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve all root categories (parent_category_id is null) with all nested children recursively. Each category contains a "categories" array with its child categories. And order by position.
 * @summary Get all root categories with nested children
 */
export const getApiV10Category = (
    
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10Category200>(
      {url: `/api/v1.0/category`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10CategoryQueryKey = () => {
    return [
    `/api/v1.0/category`
    ] as const;
    }

    
export const getGetApiV10CategoryQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Category>>, TError = void>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Category>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10CategoryQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Category>>> = ({ signal }) => getApiV10Category(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Category>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10CategoryQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Category>>>
export type GetApiV10CategoryQueryError = void


export function useGetApiV10Category<TData = Awaited<ReturnType<typeof getApiV10Category>>, TError = void>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Category>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Category>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Category>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Category<TData = Awaited<ReturnType<typeof getApiV10Category>>, TError = void>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Category>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Category>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Category>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Category<TData = Awaited<ReturnType<typeof getApiV10Category>>, TError = void>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Category>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all root categories with nested children
 */

export function useGetApiV10Category<TData = Awaited<ReturnType<typeof getApiV10Category>>, TError = void>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Category>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10CategoryQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new category record. Note: if code is not provided, it will be AUTO-GENERATED.
 * @summary Create a category. Note: if code is not provided, it will be AUTO-GENERATED.
 */
export const postApiV10Category = (
    categoryMutate: CategoryMutate,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10Category200>(
      {url: `/api/v1.0/category`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: categoryMutate, signal
    },
      );
    }
  


export const getPostApiV10CategoryMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Category>>, TError,{data: CategoryMutate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Category>>, TError,{data: CategoryMutate}, TContext> => {

const mutationKey = ['postApiV10Category'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Category>>, {data: CategoryMutate}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Category(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10CategoryMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Category>>>
    export type PostApiV10CategoryMutationBody = CategoryMutate
    export type PostApiV10CategoryMutationError = unknown

    /**
 * @summary Create a category. Note: if code is not provided, it will be AUTO-GENERATED.
 */
export const usePostApiV10Category = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Category>>, TError,{data: CategoryMutate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Category>>,
        TError,
        {data: CategoryMutate},
        TContext
      > => {

      const mutationOptions = getPostApiV10CategoryMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    