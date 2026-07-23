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
  BadRequestResponse,
  GetApiV10AuthProfile200,
  LoginRequest,
  PasswordResetRequest,
  PasswordResetSubmit,
  PasswordResetVerify,
  PostApiV10AuthForgotPasswordConfirmReset200,
  PostApiV10AuthForgotPasswordSendOtp200,
  PostApiV10AuthForgotPasswordVerifyOtp200,
  PostApiV10AuthLogin200,
  PostApiV10AuthLogin423,
  PostApiV10AuthLogout200,
  PostApiV10AuthRefresh200,
  PostApiV10AuthRefreshBody,
  PostApiV10AuthRegister200,
  RegisterRequest,
  UnauthorizedResponse
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Reset user password after OTP verification
 * @summary Reset password
 */
export const postApiV10AuthForgotPasswordConfirmReset = (
    passwordResetSubmit: PasswordResetSubmit,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10AuthForgotPasswordConfirmReset200>(
      {url: `/api/v1.0/auth/forgotPassword/confirmReset`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: passwordResetSubmit, signal
    },
      );
    }
  


export const getPostApiV10AuthForgotPasswordConfirmResetMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordConfirmReset>>, TError,{data: PasswordResetSubmit}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordConfirmReset>>, TError,{data: PasswordResetSubmit}, TContext> => {

const mutationKey = ['postApiV10AuthForgotPasswordConfirmReset'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordConfirmReset>>, {data: PasswordResetSubmit}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10AuthForgotPasswordConfirmReset(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10AuthForgotPasswordConfirmResetMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordConfirmReset>>>
    export type PostApiV10AuthForgotPasswordConfirmResetMutationBody = PasswordResetSubmit
    export type PostApiV10AuthForgotPasswordConfirmResetMutationError = void

    /**
 * @summary Reset password
 */
export const usePostApiV10AuthForgotPasswordConfirmReset = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordConfirmReset>>, TError,{data: PasswordResetSubmit}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10AuthForgotPasswordConfirmReset>>,
        TError,
        {data: PasswordResetSubmit},
        TContext
      > => {

      const mutationOptions = getPostApiV10AuthForgotPasswordConfirmResetMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Send 6-digit OTP code to user email (valid for 10 minutes)
 * @summary Request password reset OTP
 */
export const postApiV10AuthForgotPasswordSendOtp = (
    passwordResetRequest: PasswordResetRequest,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10AuthForgotPasswordSendOtp200>(
      {url: `/api/v1.0/auth/forgotPassword/sendOtp`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: passwordResetRequest, signal
    },
      );
    }
  


export const getPostApiV10AuthForgotPasswordSendOtpMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordSendOtp>>, TError,{data: PasswordResetRequest}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordSendOtp>>, TError,{data: PasswordResetRequest}, TContext> => {

const mutationKey = ['postApiV10AuthForgotPasswordSendOtp'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordSendOtp>>, {data: PasswordResetRequest}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10AuthForgotPasswordSendOtp(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10AuthForgotPasswordSendOtpMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordSendOtp>>>
    export type PostApiV10AuthForgotPasswordSendOtpMutationBody = PasswordResetRequest
    export type PostApiV10AuthForgotPasswordSendOtpMutationError = void

    /**
 * @summary Request password reset OTP
 */
export const usePostApiV10AuthForgotPasswordSendOtp = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordSendOtp>>, TError,{data: PasswordResetRequest}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10AuthForgotPasswordSendOtp>>,
        TError,
        {data: PasswordResetRequest},
        TContext
      > => {

      const mutationOptions = getPostApiV10AuthForgotPasswordSendOtpMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Check if password reset OTP code is valid
 * @summary Verify OTP code
 */
export const postApiV10AuthForgotPasswordVerifyOtp = (
    passwordResetVerify: PasswordResetVerify,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10AuthForgotPasswordVerifyOtp200>(
      {url: `/api/v1.0/auth/forgotPassword/verifyOtp`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: passwordResetVerify, signal
    },
      );
    }
  


export const getPostApiV10AuthForgotPasswordVerifyOtpMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordVerifyOtp>>, TError,{data: PasswordResetVerify}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordVerifyOtp>>, TError,{data: PasswordResetVerify}, TContext> => {

const mutationKey = ['postApiV10AuthForgotPasswordVerifyOtp'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordVerifyOtp>>, {data: PasswordResetVerify}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10AuthForgotPasswordVerifyOtp(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10AuthForgotPasswordVerifyOtpMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordVerifyOtp>>>
    export type PostApiV10AuthForgotPasswordVerifyOtpMutationBody = PasswordResetVerify
    export type PostApiV10AuthForgotPasswordVerifyOtpMutationError = void

    /**
 * @summary Verify OTP code
 */
export const usePostApiV10AuthForgotPasswordVerifyOtp = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthForgotPasswordVerifyOtp>>, TError,{data: PasswordResetVerify}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10AuthForgotPasswordVerifyOtp>>,
        TError,
        {data: PasswordResetVerify},
        TContext
      > => {

      const mutationOptions = getPostApiV10AuthForgotPasswordVerifyOtpMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Authenticate user with email and password
 * @summary User login
 */
export const postApiV10AuthLogin = (
    loginRequest: LoginRequest,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10AuthLogin200>(
      {url: `/api/v1.0/auth/login`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: loginRequest, signal
    },
      );
    }
  


export const getPostApiV10AuthLoginMutationOptions = <TError = BadRequestResponse | UnauthorizedResponse | PostApiV10AuthLogin423,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthLogin>>, TError,{data: LoginRequest}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthLogin>>, TError,{data: LoginRequest}, TContext> => {

const mutationKey = ['postApiV10AuthLogin'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10AuthLogin>>, {data: LoginRequest}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10AuthLogin(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10AuthLoginMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10AuthLogin>>>
    export type PostApiV10AuthLoginMutationBody = LoginRequest
    export type PostApiV10AuthLoginMutationError = BadRequestResponse | UnauthorizedResponse | PostApiV10AuthLogin423

    /**
 * @summary User login
 */
export const usePostApiV10AuthLogin = <TError = BadRequestResponse | UnauthorizedResponse | PostApiV10AuthLogin423,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthLogin>>, TError,{data: LoginRequest}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10AuthLogin>>,
        TError,
        {data: LoginRequest},
        TContext
      > => {

      const mutationOptions = getPostApiV10AuthLoginMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Logout user and invalidate current session
 * @summary Logout user
 */
export const postApiV10AuthLogout = (
    
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10AuthLogout200>(
      {url: `/api/v1.0/auth/logout`, method: 'POST', signal
    },
      );
    }
  


export const getPostApiV10AuthLogoutMutationOptions = <TError = UnauthorizedResponse,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthLogout>>, TError,void, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthLogout>>, TError,void, TContext> => {

const mutationKey = ['postApiV10AuthLogout'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10AuthLogout>>, void> = () => {
          

          return  postApiV10AuthLogout()
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10AuthLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10AuthLogout>>>
    
    export type PostApiV10AuthLogoutMutationError = UnauthorizedResponse

    /**
 * @summary Logout user
 */
export const usePostApiV10AuthLogout = <TError = UnauthorizedResponse,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthLogout>>, TError,void, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10AuthLogout>>,
        TError,
        void,
        TContext
      > => {

      const mutationOptions = getPostApiV10AuthLogoutMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Get current authenticated user's profile information
 * @summary Get user profile
 */
export const getApiV10AuthProfile = (
    
 signal?: AbortSignal
) => {
      
      
      return mainInstance<GetApiV10AuthProfile200>(
      {url: `/api/v1.0/auth/profile`, method: 'GET', signal
    },
      );
    }
  



export const getGetApiV10AuthProfileQueryKey = () => {
    return [
    `/api/v1.0/auth/profile`
    ] as const;
    }

    
export const getGetApiV10AuthProfileQueryOptions = <TData = Awaited<ReturnType<typeof getApiV10AuthProfile>>, TError = UnauthorizedResponse>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AuthProfile>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiV10AuthProfileQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiV10AuthProfile>>> = ({ signal }) => getApiV10AuthProfile(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiV10AuthProfile>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiV10AuthProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getApiV10AuthProfile>>>
export type GetApiV10AuthProfileQueryError = UnauthorizedResponse


export function useGetApiV10AuthProfile<TData = Awaited<ReturnType<typeof getApiV10AuthProfile>>, TError = UnauthorizedResponse>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AuthProfile>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10AuthProfile>>,
          TError,
          Awaited<ReturnType<typeof getApiV10AuthProfile>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10AuthProfile<TData = Awaited<ReturnType<typeof getApiV10AuthProfile>>, TError = UnauthorizedResponse>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AuthProfile>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiV10AuthProfile>>,
          TError,
          Awaited<ReturnType<typeof getApiV10AuthProfile>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiV10AuthProfile<TData = Awaited<ReturnType<typeof getApiV10AuthProfile>>, TError = UnauthorizedResponse>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AuthProfile>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get user profile
 */

export function useGetApiV10AuthProfile<TData = Awaited<ReturnType<typeof getApiV10AuthProfile>>, TError = UnauthorizedResponse>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiV10AuthProfile>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiV10AuthProfileQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Get a new access token using refresh token from cookie or body
 * @summary Refresh access token
 */
export const postApiV10AuthRefresh = (
    postApiV10AuthRefreshBody?: PostApiV10AuthRefreshBody,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10AuthRefresh200>(
      {url: `/api/v1.0/auth/refresh`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: postApiV10AuthRefreshBody, signal
    },
      );
    }
  


export const getPostApiV10AuthRefreshMutationOptions = <TError = UnauthorizedResponse,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthRefresh>>, TError,{data: PostApiV10AuthRefreshBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthRefresh>>, TError,{data: PostApiV10AuthRefreshBody}, TContext> => {

const mutationKey = ['postApiV10AuthRefresh'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10AuthRefresh>>, {data: PostApiV10AuthRefreshBody}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10AuthRefresh(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10AuthRefreshMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10AuthRefresh>>>
    export type PostApiV10AuthRefreshMutationBody = PostApiV10AuthRefreshBody
    export type PostApiV10AuthRefreshMutationError = UnauthorizedResponse

    /**
 * @summary Refresh access token
 */
export const usePostApiV10AuthRefresh = <TError = UnauthorizedResponse,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthRefresh>>, TError,{data: PostApiV10AuthRefreshBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10AuthRefresh>>,
        TError,
        {data: PostApiV10AuthRefreshBody},
        TContext
      > => {

      const mutationOptions = getPostApiV10AuthRefreshMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * Register a new user account
 * @summary User registration
 */
export const postApiV10AuthRegister = (
    registerRequest: RegisterRequest,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10AuthRegister200>(
      {url: `/api/v1.0/auth/register`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: registerRequest, signal
    },
      );
    }
  


export const getPostApiV10AuthRegisterMutationOptions = <TError = BadRequestResponse,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthRegister>>, TError,{data: RegisterRequest}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthRegister>>, TError,{data: RegisterRequest}, TContext> => {

const mutationKey = ['postApiV10AuthRegister'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10AuthRegister>>, {data: RegisterRequest}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10AuthRegister(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10AuthRegisterMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10AuthRegister>>>
    export type PostApiV10AuthRegisterMutationBody = RegisterRequest
    export type PostApiV10AuthRegisterMutationError = BadRequestResponse

    /**
 * @summary User registration
 */
export const usePostApiV10AuthRegister = <TError = BadRequestResponse,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10AuthRegister>>, TError,{data: RegisterRequest}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10AuthRegister>>,
        TError,
        {data: RegisterRequest},
        TContext
      > => {

      const mutationOptions = getPostApiV10AuthRegisterMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    