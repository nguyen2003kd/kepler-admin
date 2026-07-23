/* eslint-disable */
import {
  useMutation
} from '@tanstack/react-query';
import type {
  MutationFunction,
  QueryClient,
  UseMutationOptions,
  UseMutationResult
} from '@tanstack/react-query';

import type {
  PostApiV10EmailSendQuotation200,
  PostApiV10EmailSendQuotationBody
} from '../models';

import { mainInstance } from '../mutator/custom-instance';





/**
 * Send quota or update email to customer with quotation details
 * @summary Send quotation email
 */
export const postApiV10EmailSendQuotation = (
    postApiV10EmailSendQuotationBody: PostApiV10EmailSendQuotationBody,
 signal?: AbortSignal
) => {
      
      
      return mainInstance<PostApiV10EmailSendQuotation200>(
      {url: `/api/v1.0/email/send-quotation`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: postApiV10EmailSendQuotationBody, signal
    },
      );
    }
  


export const getPostApiV10EmailSendQuotationMutationOptions = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10EmailSendQuotation>>, TError,{data: PostApiV10EmailSendQuotationBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiV10EmailSendQuotation>>, TError,{data: PostApiV10EmailSendQuotationBody}, TContext> => {

const mutationKey = ['postApiV10EmailSendQuotation'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiV10EmailSendQuotation>>, {data: PostApiV10EmailSendQuotationBody}> = (props) => {
          const {data} = props ?? {};

          return  postApiV10EmailSendQuotation(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiV10EmailSendQuotationMutationResult = NonNullable<Awaited<ReturnType<typeof postApiV10EmailSendQuotation>>>
    export type PostApiV10EmailSendQuotationMutationBody = PostApiV10EmailSendQuotationBody
    export type PostApiV10EmailSendQuotationMutationError = void

    /**
 * @summary Send quotation email
 */
export const usePostApiV10EmailSendQuotation = <TError = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiV10EmailSendQuotation>>, TError,{data: PostApiV10EmailSendQuotationBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiV10EmailSendQuotation>>,
        TError,
        {data: PostApiV10EmailSendQuotationBody},
        TContext
      > => {

      const mutationOptions = getPostApiV10EmailSendQuotationMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    