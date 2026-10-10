/* eslint-disable */
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import type {
  ApiResponse,
  DeleteApiV10PropertyId200,
  GetApiV10PropertyId200,
  GetApiV10PropertyIdParams,
  GetApiV10PropertyParams,
  PostApiV10Property200,
  PropertyInquiry,
  PropertyList,
  PropertyMutate,
  PutApiV10PropertyId200,
} from "../models";

import { mainInstance } from "../mutator/custom-instance";

/**
 * Retrieve a single property record by its ID
 * @summary Get property by ID
 */
export const getApiV10PropertyId = (
  id: string,
  params?: GetApiV10PropertyIdParams,
  signal?: AbortSignal,
) => {
  return mainInstance<GetApiV10PropertyId200>({
    url: `/api/v1.0/property/${id}`,
    method: "GET",
    params,
    ...(signal ? { signal } : {}),
  });
};

export const getGetApiV10PropertyIdQueryKey = (
  id?: string,
  params?: GetApiV10PropertyIdParams,
) => {
  return [`/api/v1.0/property/${id}`, ...(params ? [params] : [])] as const;
};

export const getGetApiV10PropertyIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getApiV10PropertyId>>,
  TError = void,
>(
  id: string,
  params?: GetApiV10PropertyIdParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getApiV10PropertyId>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetApiV10PropertyIdQueryKey(id, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getApiV10PropertyId>>
  > = ({ signal }) => getApiV10PropertyId(id, params, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getApiV10PropertyId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetApiV10PropertyIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getApiV10PropertyId>>
>;
export type GetApiV10PropertyIdQueryError = void;

/**
 * @summary Get property by ID
 */

export function useGetApiV10PropertyId<
  TData = Awaited<ReturnType<typeof getApiV10PropertyId>>,
  TError = void,
>(
  id: string,
  params?: GetApiV10PropertyIdParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getApiV10PropertyId>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetApiV10PropertyIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Update a single property record by its ID
 * @summary Update property by ID
 */
export const putApiV10PropertyId = (
  id: string,
  propertyMutate: PropertyMutate,
) => {
  return mainInstance<PutApiV10PropertyId200>({
    url: `/api/v1.0/property/${id}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: propertyMutate,
  });
};

export const getPutApiV10PropertyIdMutationOptions = <
  TError = void,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putApiV10PropertyId>>,
    TError,
    { id: string; data: PropertyMutate },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putApiV10PropertyId>>,
  TError,
  { id: string; data: PropertyMutate },
  TContext
> => {
  const mutationKey = ["putApiV10PropertyId"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putApiV10PropertyId>>,
    { id: string; data: PropertyMutate }
  > = (props) => {
    const { id, data } = props ?? {};

    return putApiV10PropertyId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutApiV10PropertyIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putApiV10PropertyId>>
>;
export type PutApiV10PropertyIdMutationBody = PropertyMutate;
export type PutApiV10PropertyIdMutationError = void;

/**
 * @summary Update property by ID
 */
export const usePutApiV10PropertyId = <
  TError = void,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putApiV10PropertyId>>,
    TError,
    { id: string; data: PropertyMutate },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof putApiV10PropertyId>>,
  TError,
  { id: string; data: PropertyMutate },
  TContext
> => {
  const mutationOptions = getPutApiV10PropertyIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Delete a single property record by its ID
 * @summary Delete property by ID
 */
export const deleteApiV10PropertyId = (id: string) => {
  return mainInstance<DeleteApiV10PropertyId200>({
    url: `/api/v1.0/property/${id}`,
    method: "DELETE",
  });
};

export const getDeleteApiV10PropertyIdMutationOptions = <
  TError = void,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteApiV10PropertyId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteApiV10PropertyId>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationKey = ["deleteApiV10PropertyId"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteApiV10PropertyId>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return deleteApiV10PropertyId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteApiV10PropertyIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteApiV10PropertyId>>
>;

export type DeleteApiV10PropertyIdMutationError = void;

/**
 * @summary Delete property by ID
 */
export const useDeleteApiV10PropertyId = <
  TError = void,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteApiV10PropertyId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteApiV10PropertyId>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getDeleteApiV10PropertyIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Retrieve a list of property with pagination, filtering and sorting
 * @summary Get all property
 */
export const getApiV10Property = (
  params?: GetApiV10PropertyParams,
  signal?: AbortSignal,
) => {
  return mainInstance<PropertyList>({
    url: `/api/v1.0/property`,
    method: "GET",
    params,
    ...(signal ? { signal } : {}),
  });
};

export const getGetApiV10PropertyQueryKey = (
  params?: GetApiV10PropertyParams,
) => {
  return [`/api/v1.0/property`, ...(params ? [params] : [])] as const;
};

export const getGetApiV10PropertyQueryOptions = <
  TData = Awaited<ReturnType<typeof getApiV10Property>>,
  TError = unknown,
>(
  params?: GetApiV10PropertyParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getApiV10Property>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetApiV10PropertyQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getApiV10Property>>
  > = ({ signal }) => getApiV10Property(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getApiV10Property>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetApiV10PropertyQueryResult = NonNullable<
  Awaited<ReturnType<typeof getApiV10Property>>
>;
export type GetApiV10PropertyQueryError = unknown;

/**
 * @summary Get all property
 */

export function useGetApiV10Property<
  TData = Awaited<ReturnType<typeof getApiV10Property>>,
  TError = unknown,
>(
  params?: GetApiV10PropertyParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getApiV10Property>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetApiV10PropertyQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Create a new property record
 * @summary Create a property
 */
export const postApiV10Property = (
  propertyMutate: PropertyMutate,
  signal?: AbortSignal,
) => {
  return mainInstance<PostApiV10Property200>({
    url: `/api/v1.0/property`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: propertyMutate,
    ...(signal ? { signal } : {}),
  });
};

export const getPostApiV10PropertyMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiV10Property>>,
    TError,
    { data: PropertyMutate },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postApiV10Property>>,
  TError,
  { data: PropertyMutate },
  TContext
> => {
  const mutationKey = ["postApiV10Property"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postApiV10Property>>,
    { data: PropertyMutate }
  > = (props) => {
    const { data } = props ?? {};

    return postApiV10Property(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostApiV10PropertyMutationResult = NonNullable<
  Awaited<ReturnType<typeof postApiV10Property>>
>;
export type PostApiV10PropertyMutationBody = PropertyMutate;
export type PostApiV10PropertyMutationError = unknown;

/**
 * @summary Create a property
 */
export const usePostApiV10Property = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiV10Property>>,
    TError,
    { data: PropertyMutate },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postApiV10Property>>,
  TError,
  { data: PropertyMutate },
  TContext
> => {
  const mutationOptions = getPostApiV10PropertyMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Send an order request or message about a published property
 */
export const postApiV10PropertyIdInquiry = (
  id: string,
  propertyInquiry: PropertyInquiry,
  signal?: AbortSignal,
) => {
  return mainInstance<ApiResponse>({
    url: `/api/v1.0/property/${id}/inquiry`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: propertyInquiry,
    ...(signal ? { signal } : {}),
  });
};

export const getPostApiV10PropertyIdInquiryMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiV10PropertyIdInquiry>>,
    TError,
    { id: string; data: PropertyInquiry },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postApiV10PropertyIdInquiry>>,
  TError,
  { id: string; data: PropertyInquiry },
  TContext
> => {
  const mutationKey = ["postApiV10PropertyIdInquiry"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postApiV10PropertyIdInquiry>>,
    { id: string; data: PropertyInquiry }
  > = (props) => {
    const { id, data } = props ?? {};

    return postApiV10PropertyIdInquiry(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostApiV10PropertyIdInquiryMutationResult = NonNullable<
  Awaited<ReturnType<typeof postApiV10PropertyIdInquiry>>
>;
export type PostApiV10PropertyIdInquiryMutationBody = PropertyInquiry;
export type PostApiV10PropertyIdInquiryMutationError = unknown;

/**
 * @summary Send an order request or message about a published property
 */
export const usePostApiV10PropertyIdInquiry = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postApiV10PropertyIdInquiry>>,
    TError,
    { id: string; data: PropertyInquiry },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postApiV10PropertyIdInquiry>>,
  TError,
  { id: string; data: PropertyInquiry },
  TContext
> => {
  const mutationOptions =
    getPostApiV10PropertyIdInquiryMutationOptions(options);

  return useMutation(mutationOptions);
};
