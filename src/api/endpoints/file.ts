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
  DeleteApiV10FileId200,
  FileUpdate,
  FileUpload,
  GetApiV10FileId200,
  GetApiV10FileParams,
  PostApiV10File200,
  PostApiV10FileBulkBody,
  PutApiV10FileId200,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single file record by its ID
 * @summary Get file by ID
 */
export const getApiV10FileId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10FileId200>(
      {url: `/api/v1.0/file/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10FileIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/file/${id}`
    ] as const;
    }

    
export const getGetApiV10FileIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10FileId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10FileId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10FileIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10FileId>>> = ({ signal }) => getApiV10FileId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10FileId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10FileIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10FileId>>>
export type GetApiV10FileIdQueryError = void


export function useGetApiV10FileId<TData = Awaited<ReturnType<typeof getApiV10FileId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10FileId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10FileId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10FileId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10FileId<TData = Awaited<ReturnType<typeof getApiV10FileId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10FileId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10FileId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10FileId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10FileId<TData = Awaited<ReturnType<typeof getApiV10FileId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10FileId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get file by ID
 */

export function useGetApiV10FileId<TData = Awaited<ReturnType<typeof getApiV10FileId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10FileId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10FileIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update file record and optionally replace the physical file
 * @summary Update file by ID
 */
export const putApiV10FileId = (
    id: string,
    fileUpdate: FileUpdate,
 ) => {
      
      const formData = new FormData();
if(fileUpdate.file !== undefined) {
 formData.append(`file`, fileUpdate.file)
 }
if(fileUpdate.title !== undefined && fileUpdate.title !== null) {
 formData.append(`title`, fileUpdate.title)
 }
if(fileUpdate.description !== undefined && fileUpdate.description !== null) {
 formData.append(`description`, fileUpdate.description)
 }
if(fileUpdate.note !== undefined && fileUpdate.note !== null) {
 formData.append(`note`, fileUpdate.note)
 }
if(fileUpdate.is_in_library !== undefined) {
 formData.append(`is_in_library`, fileUpdate.is_in_library.toString())
 }

      return mainInstance<PutApiV10FileId200>(
      {url: `/api/v1.0/file/${id}`, method: 'PUT',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData
    },
      );
    }
  


export const getPutApiV10FileIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10FileId>>, TError,{id: string;data: FileUpdate}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10FileId>>, TError,{id: string;data: FileUpdate}, TContext> => {

const mutationKey = ['putApiV10FileId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10FileId>>, {id: string;data: FileUpdate}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10FileId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10FileIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10FileId>>>
    export type PutApiV10FileIdMutationBody = FileUpdate
    export type PutApiV10FileIdMutationError = void

    /**
 * @summary Update file by ID
 */
export const usePutApiV10FileId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10FileId>>, TError,{id: string;data: FileUpdate}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10FileId>>,
        TError,
        {id: string;data: FileUpdate},
        TContext
      > => {

      const mutationOptions = getPutApiV10FileIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single file record and its physical files from storage
 * @summary Delete file by ID
 */
export const deleteApiV10FileId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10FileId200>(
      {url: `/api/v1.0/file/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10FileIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10FileId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10FileId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10FileId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10FileId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10FileId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10FileIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10FileId>>>
    
    export type DeleteApiV10FileIdMutationError = void

    /**
 * @summary Delete file by ID
 */
export const useDeleteApiV10FileId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10FileId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10FileId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10FileIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Upload multiple files at once (max 10)
 * @summary Upload multiple files
 */
export const postApiV10FileBulk = (
    postApiV10FileBulkBody: PostApiV10FileBulkBody,
 signal?: AbortSignal
) => {
      
      const formData = new FormData();
if(postApiV10FileBulkBody.files !== undefined) {
 postApiV10FileBulkBody.files.forEach(value => formData.append(`files`, value));
 }
if(postApiV10FileBulkBody.is_in_library_all !== undefined) {
 formData.append(`is_in_library_all`, postApiV10FileBulkBody.is_in_library_all.toString())
 }

      return mainInstance<void>(
      {url: `/api/v1.0/file/bulk`, method: 'POST',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData, signal
    },
      );
    }
  


export const getPostApiV10FileBulkMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10FileBulk>>, TError,{data: PostApiV10FileBulkBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10FileBulk>>, TError,{data: PostApiV10FileBulkBody}, TContext> => {

const mutationKey = ['postApiV10FileBulk'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10FileBulk>>, {data: PostApiV10FileBulkBody}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10FileBulk(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10FileBulkMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10FileBulk>>>
    export type PostApiV10FileBulkMutationBody = PostApiV10FileBulkBody
    export type PostApiV10FileBulkMutationError = unknown

    /**
 * @summary Upload multiple files
 */
export const usePostApiV10FileBulk = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10FileBulk>>, TError,{data: PostApiV10FileBulkBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10FileBulk>>,
        TError,
        {data: PostApiV10FileBulkBody},
        TContext
      > => {

      const mutationOptions = getPostApiV10FileBulkMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of file with pagination, filtering and sorting
 * @summary Get all file
 */
export const getApiV10File = (
    params?: GetApiV10FileParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/file`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10FileQueryKey = (params?: GetApiV10FileParams,) => {
    return [
    `/api/v1.0/file`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10FileQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10File>>, TError = unknown>(params?: GetApiV10FileParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10File>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10FileQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10File>>> = ({ signal }) => getApiV10File(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10File>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10FileQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10File>>>
export type GetApiV10FileQueryError = unknown


export function useGetApiV10File<TData = Awaited<ReturnType<typeof getApiV10File>>, TError = unknown>(
 params: undefined |  GetApiV10FileParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10File>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10File>>,
          TError,
          Awaited<ReturnType<typeof getApiV10File>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10File<TData = Awaited<ReturnType<typeof getApiV10File>>, TError = unknown>(
 params?: GetApiV10FileParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10File>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10File>>,
          TError,
          Awaited<ReturnType<typeof getApiV10File>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10File<TData = Awaited<ReturnType<typeof getApiV10File>>, TError = unknown>(
 params?: GetApiV10FileParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10File>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all file
 */

export function useGetApiV10File<TData = Awaited<ReturnType<typeof getApiV10File>>, TError = unknown>(
 params?: GetApiV10FileParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10File>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10FileQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Upload a file with optional compression for images
 * @summary Upload a file
 */
export const postApiV10File = (
    fileUpload: FileUpload,
 signal?: AbortSignal
) => {
      
      const formData = new FormData();
formData.append(`file`, fileUpload.file)
if(fileUpload.type !== undefined) {
 formData.append(`type`, fileUpload.type)
 }
if(fileUpload.title !== undefined && fileUpload.title !== null) {
 formData.append(`title`, fileUpload.title)
 }
if(fileUpload.description !== undefined && fileUpload.description !== null) {
 formData.append(`description`, fileUpload.description)
 }
if(fileUpload.note !== undefined && fileUpload.note !== null) {
 formData.append(`note`, fileUpload.note)
 }
if(fileUpload.is_in_library !== undefined) {
 formData.append(`is_in_library`, fileUpload.is_in_library.toString())
 }

      return mainInstance<PostApiV10File200>(
      {url: `/api/v1.0/file`, method: 'POST',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData, signal
    },
      );
    }
  


export const getPostApiV10FileMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10File>>, TError,{data: FileUpload}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10File>>, TError,{data: FileUpload}, TContext> => {

const mutationKey = ['postApiV10File'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10File>>, {data: FileUpload}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10File(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10FileMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10File>>>
    export type PostApiV10FileMutationBody = FileUpload
    export type PostApiV10FileMutationError = unknown

    /**
 * @summary Upload a file
 */
export const usePostApiV10File = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10File>>, TError,{data: FileUpload}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10File>>,
        TError,
        {data: FileUpload},
        TContext
      > => {

      const mutationOptions = getPostApiV10FileMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    