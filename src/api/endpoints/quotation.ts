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
  DeleteApiV10QuotationId200,
  GetApiV10QuotationAllParams,
  GetApiV10QuotationId200,
  GetApiV10QuotationParams,
  PostApiV10Quotation200,
  PostApiV10QuotationBody,
  PostApiV10QuotationPublic200,
  PostApiV10QuotationPublicBody,
  PutApiV10QuotationId200,
  PutApiV10QuotationIdBody,
  ResponseGetAllData
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Retrieve a single quotation record by its ID
 * @summary Get quotation by ID
 */
export const getApiV10QuotationId = (
    id: string,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10QuotationId200>(
      {url: `/api/v1.0/quotation/${id}`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10QuotationIdQueryKey = (id?: string,) => {
    return [
    `/api/v1.0/quotation/${id}`
    ] as const;
    }

    
export const getGetApiV10QuotationIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10QuotationId>>, TError = void>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10QuotationIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10QuotationId>>> = ({ signal }) => getApiV10QuotationId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10QuotationIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10QuotationId>>>
export type GetApiV10QuotationIdQueryError = void


export function useGetApiV10QuotationId<TData = Awaited<ReturnType<typeof getApiV10QuotationId>>, TError = void>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10QuotationId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10QuotationId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10QuotationId<TData = Awaited<ReturnType<typeof getApiV10QuotationId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10QuotationId>>,
          TError,
          Awaited<ReturnType<typeof getApiV10QuotationId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10QuotationId<TData = Awaited<ReturnType<typeof getApiV10QuotationId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get quotation by ID
 */

export function useGetApiV10QuotationId<TData = Awaited<ReturnType<typeof getApiV10QuotationId>>, TError = void>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10QuotationIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Update a single quotation record by its ID
 * @summary Update quotation by ID
 */
export const putApiV10QuotationId = (
    id: string,
    putApiV10QuotationIdBody: PutApiV10QuotationIdBody,
 ) => {
      
      const formData = new FormData();
if(putApiV10QuotationIdBody.name !== undefined) {
 formData.append(`name`, putApiV10QuotationIdBody.name)
 }
if(putApiV10QuotationIdBody.post_id !== undefined) {
 formData.append(`post_id`, putApiV10QuotationIdBody.post_id)
 }
if(putApiV10QuotationIdBody.phone_number !== undefined) {
 formData.append(`phone_number`, putApiV10QuotationIdBody.phone_number)
 }
if(putApiV10QuotationIdBody.email !== undefined) {
 formData.append(`email`, putApiV10QuotationIdBody.email)
 }
if(putApiV10QuotationIdBody.price !== undefined) {
 formData.append(`price`, putApiV10QuotationIdBody.price)
 }
if(putApiV10QuotationIdBody.description !== undefined && putApiV10QuotationIdBody.description !== null) {
 formData.append(`description`, putApiV10QuotationIdBody.description)
 }
if(putApiV10QuotationIdBody.organization_name !== undefined && putApiV10QuotationIdBody.organization_name !== null) {
 formData.append(`organization_name`, putApiV10QuotationIdBody.organization_name)
 }
if(putApiV10QuotationIdBody.quotation_status_id !== undefined && putApiV10QuotationIdBody.quotation_status_id !== null) {
 formData.append(`quotation_status_id`, putApiV10QuotationIdBody.quotation_status_id)
 }
if(putApiV10QuotationIdBody.response_time !== undefined && putApiV10QuotationIdBody.response_time !== null) {
 formData.append(`response_time`, putApiV10QuotationIdBody.response_time)
 }
if(putApiV10QuotationIdBody.service_id !== undefined && putApiV10QuotationIdBody.service_id !== null) {
 formData.append(`service_id`, putApiV10QuotationIdBody.service_id)
 }

if(putApiV10QuotationIdBody.files !== undefined) {
 putApiV10QuotationIdBody.files.forEach(value => formData.append(`files`, value));
 }

      return mainInstance<PutApiV10QuotationId200>(
      {url: `/api/v1.0/quotation/${id}`, method: 'PUT',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData
    },
      );
    }
  


export const getPutApiV10QuotationIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10QuotationId>>, TError,{id: string;data: PutApiV10QuotationIdBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiV10QuotationId>>, TError,{id: string;data: PutApiV10QuotationIdBody}, TContext> => {

const mutationKey = ['putApiV10QuotationId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiV10QuotationId>>, {id: string;data: PutApiV10QuotationIdBody}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiV10QuotationId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiV10QuotationIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiV10QuotationId>>>
    export type PutApiV10QuotationIdMutationBody = PutApiV10QuotationIdBody
    export type PutApiV10QuotationIdMutationError = void

    /**
 * @summary Update quotation by ID
 */
export const usePutApiV10QuotationId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiV10QuotationId>>, TError,{id: string;data: PutApiV10QuotationIdBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiV10QuotationId>>,
        TError,
        {id: string;data: PutApiV10QuotationIdBody},
        TContext
      > => {

      const mutationOptions = getPutApiV10QuotationIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Delete a single quotation record by its ID
 * @summary Delete quotation by ID
 */
export const deleteApiV10QuotationId = (
    id: string,
 ) => {
      
      
      return mainInstance<DeleteApiV10QuotationId200>(
      {url: `/api/v1.0/quotation/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiV10QuotationIdMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10QuotationId>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10QuotationId>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteApiV10QuotationId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiV10QuotationId>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiV10QuotationId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiV10QuotationIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiV10QuotationId>>>
    
    export type DeleteApiV10QuotationIdMutationError = void

    /**
 * @summary Delete quotation by ID
 */
export const useDeleteApiV10QuotationId = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiV10QuotationId>>, TError,{id: string}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiV10QuotationId>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteApiV10QuotationIdMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Retrieve a list of all quotations with pagination, filtering and sorting (not filtered by user)
 * @summary Get all quotations (admin)
 */
export const getApiV10QuotationAll = (
    params?: GetApiV10QuotationAllParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/quotation/all`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10QuotationAllQueryKey = (params?: GetApiV10QuotationAllParams,) => {
    return [
    `/api/v1.0/quotation/all`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10QuotationAllQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10QuotationAll>>, TError = unknown>(params?: GetApiV10QuotationAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationAll>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10QuotationAllQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10QuotationAll>>> = ({ signal }) => getApiV10QuotationAll(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10QuotationAllQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10QuotationAll>>>
export type GetApiV10QuotationAllQueryError = unknown


export function useGetApiV10QuotationAll<TData = Awaited<ReturnType<typeof getApiV10QuotationAll>>, TError = unknown>(
 params: undefined |  GetApiV10QuotationAllParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10QuotationAll>>,
          TError,
          Awaited<ReturnType<typeof getApiV10QuotationAll>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10QuotationAll<TData = Awaited<ReturnType<typeof getApiV10QuotationAll>>, TError = unknown>(
 params?: GetApiV10QuotationAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10QuotationAll>>,
          TError,
          Awaited<ReturnType<typeof getApiV10QuotationAll>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10QuotationAll<TData = Awaited<ReturnType<typeof getApiV10QuotationAll>>, TError = unknown>(
 params?: GetApiV10QuotationAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationAll>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all quotations (admin)
 */

export function useGetApiV10QuotationAll<TData = Awaited<ReturnType<typeof getApiV10QuotationAll>>, TError = unknown>(
 params?: GetApiV10QuotationAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10QuotationAll>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10QuotationAllQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Retrieve a list of quotation with pagination, filtering and sorting
 * @summary Get all my quotation
 */
export const getApiV10Quotation = (
    params?: GetApiV10QuotationParams,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<ResponseGetAllData>(
      {url: `/api/v1.0/quotation`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetApiV10QuotationQueryKey = (params?: GetApiV10QuotationParams,) => {
    return [
    `/api/v1.0/quotation`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetApiV10QuotationQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10Quotation>>, TError = unknown>(params?: GetApiV10QuotationParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Quotation>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10QuotationQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10Quotation>>> = ({ signal }) => getApiV10Quotation(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10Quotation>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10QuotationQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10Quotation>>>
export type GetApiV10QuotationQueryError = unknown


export function useGetApiV10Quotation<TData = Awaited<ReturnType<typeof getApiV10Quotation>>, TError = unknown>(
 params: undefined |  GetApiV10QuotationParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Quotation>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Quotation>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Quotation>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Quotation<TData = Awaited<ReturnType<typeof getApiV10Quotation>>, TError = unknown>(
 params?: GetApiV10QuotationParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Quotation>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10Quotation>>,
          TError,
          Awaited<ReturnType<typeof getApiV10Quotation>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10Quotation<TData = Awaited<ReturnType<typeof getApiV10Quotation>>, TError = unknown>(
 params?: GetApiV10QuotationParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Quotation>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get all my quotation
 */

export function useGetApiV10Quotation<TData = Awaited<ReturnType<typeof getApiV10Quotation>>, TError = unknown>(
 params?: GetApiV10QuotationParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10Quotation>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10QuotationQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Create a new quotation record with optional file uploads
 * @summary Create a quotation
 */
export const postApiV10Quotation = (
    postApiV10QuotationBody: PostApiV10QuotationBody,
 signal?: AbortSignal
) => {
      
      const formData = new FormData();
formData.append(`name`, postApiV10QuotationBody.name)
formData.append(`post_id`, postApiV10QuotationBody.post_id)
formData.append(`phone_number`, postApiV10QuotationBody.phone_number)
formData.append(`email`, postApiV10QuotationBody.email)
if(postApiV10QuotationBody.description !== undefined && postApiV10QuotationBody.description !== null) {
 formData.append(`description`, postApiV10QuotationBody.description)
 }
formData.append(`price`, postApiV10QuotationBody.price)
if(postApiV10QuotationBody.organization_name !== undefined && postApiV10QuotationBody.organization_name !== null) {
 formData.append(`organization_name`, postApiV10QuotationBody.organization_name)
 }
if(postApiV10QuotationBody.receive_method_id !== undefined) {
 formData.append(`receive_method_id`, postApiV10QuotationBody.receive_method_id)
 }
if(postApiV10QuotationBody.calibration_id !== undefined && postApiV10QuotationBody.calibration_id !== null) {
 formData.append(`calibration_id`, postApiV10QuotationBody.calibration_id)
 }
if(postApiV10QuotationBody.quotation_status_id !== undefined && postApiV10QuotationBody.quotation_status_id !== null) {
 formData.append(`quotation_status_id`, postApiV10QuotationBody.quotation_status_id)
 }
if(postApiV10QuotationBody.service_id !== undefined && postApiV10QuotationBody.service_id !== null) {
 formData.append(`service_id`, postApiV10QuotationBody.service_id)
 }

if(postApiV10QuotationBody.files !== undefined) {
 postApiV10QuotationBody.files.forEach(value => formData.append(`files`, value));
 }

      return mainInstance<PostApiV10Quotation200>(
      {url: `/api/v1.0/quotation`, method: 'POST',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData, signal
    },
      );
    }
  


export const getPostApiV10QuotationMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Quotation>>, TError,{data: PostApiV10QuotationBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10Quotation>>, TError,{data: PostApiV10QuotationBody}, TContext> => {

const mutationKey = ['postApiV10Quotation'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10Quotation>>, {data: PostApiV10QuotationBody}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10Quotation(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10QuotationMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10Quotation>>>
    export type PostApiV10QuotationMutationBody = PostApiV10QuotationBody
    export type PostApiV10QuotationMutationError = unknown

    /**
 * @summary Create a quotation
 */
export const usePostApiV10Quotation = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10Quotation>>, TError,{data: PostApiV10QuotationBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10Quotation>>,
        TError,
        {data: PostApiV10QuotationBody},
        TContext
      > => {

      const mutationOptions = getPostApiV10QuotationMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Create a new quotation record with optional file uploads without authentication
 * @summary Create a quotation publicly
 */
export const postApiV10QuotationPublic = (
    postApiV10QuotationPublicBody: PostApiV10QuotationPublicBody,
 signal?: AbortSignal
) => {
      
      const formData = new FormData();
formData.append(`name`, postApiV10QuotationPublicBody.name)
formData.append(`post_id`, postApiV10QuotationPublicBody.post_id)
formData.append(`phone_number`, postApiV10QuotationPublicBody.phone_number)
formData.append(`email`, postApiV10QuotationPublicBody.email)
if(postApiV10QuotationPublicBody.description !== undefined && postApiV10QuotationPublicBody.description !== null) {
 formData.append(`description`, postApiV10QuotationPublicBody.description)
 }
formData.append(`price`, postApiV10QuotationPublicBody.price)
if(postApiV10QuotationPublicBody.organization_name !== undefined && postApiV10QuotationPublicBody.organization_name !== null) {
 formData.append(`organization_name`, postApiV10QuotationPublicBody.organization_name)
 }
if(postApiV10QuotationPublicBody.receive_method_id !== undefined) {
 formData.append(`receive_method_id`, postApiV10QuotationPublicBody.receive_method_id)
 }
if(postApiV10QuotationPublicBody.calibration_id !== undefined && postApiV10QuotationPublicBody.calibration_id !== null) {
 formData.append(`calibration_id`, postApiV10QuotationPublicBody.calibration_id)
 }
if(postApiV10QuotationPublicBody.quotation_status_id !== undefined && postApiV10QuotationPublicBody.quotation_status_id !== null) {
 formData.append(`quotation_status_id`, postApiV10QuotationPublicBody.quotation_status_id)
 }
if(postApiV10QuotationPublicBody.service_id !== undefined && postApiV10QuotationPublicBody.service_id !== null) {
 formData.append(`service_id`, postApiV10QuotationPublicBody.service_id)
 }

if(postApiV10QuotationPublicBody.files !== undefined) {
 postApiV10QuotationPublicBody.files.forEach(value => formData.append(`files`, value));
 }

      return mainInstance<PostApiV10QuotationPublic200>(
      {url: `/api/v1.0/quotation/public`, method: 'POST',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData, signal
    },
      );
    }
  


export const getPostApiV10QuotationPublicMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10QuotationPublic>>, TError,{data: PostApiV10QuotationPublicBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10QuotationPublic>>, TError,{data: PostApiV10QuotationPublicBody}, TContext> => {

const mutationKey = ['postApiV10QuotationPublic'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10QuotationPublic>>, {data: PostApiV10QuotationPublicBody}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10QuotationPublic(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10QuotationPublicMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10QuotationPublic>>>
    export type PostApiV10QuotationPublicMutationBody = PostApiV10QuotationPublicBody
    export type PostApiV10QuotationPublicMutationError = unknown

    /**
 * @summary Create a quotation publicly
 */
export const usePostApiV10QuotationPublic = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10QuotationPublic>>, TError,{data: PostApiV10QuotationPublicBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10QuotationPublic>>,
        TError,
        {data: PostApiV10QuotationPublicBody},
        TContext
      > => {

      const mutationOptions = getPostApiV10QuotationPublicMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    