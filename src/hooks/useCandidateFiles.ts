'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mainInstance } from '@/api/mutator/custom-instance'
import type { CandidateFileBulkMutate } from '@/api/models/candidateFileBulkMutate'
import type { LibraryFile } from '@/types/library-file'

// ─── Response Types ──────────────────────────────────────────────────────────

interface CandidateInfo {
  id: string
  full_name: string
  email: string
}

export interface CandidateFileRow {
  id: string
  candidate_id: string
  file_id: string
  created_at: string | null
  candidate?: CandidateInfo
  file?: LibraryFile
}

interface CandidateFileApiResponse {
  status: string
  responseData: {
    count: number
    rows: CandidateFileRow[]
    page: number
    pageSize: number
    message?: string
  }
  timeStamp?: string
  violations?: unknown
}

interface BulkCreateResponse {
  status: string
  responseData: {
    data: {
      created: CandidateFileRow[]
      skippedFileIds: string[]
    }
    message?: string
  }
}

interface DeleteResponse {
  status: string
  responseData: {
    data: string
    message?: string
  }
}

// ─── API Functions ───────────────────────────────────────────────────────────

const fetchCandidateFiles = async (candidateId: string): Promise<CandidateFileRow[]> => {
  const data = await mainInstance<CandidateFileApiResponse>({
    url: '/api/v1.0/candidateFile',
    method: 'GET',
    params: {
      page: 1,
      pageSize: 100,
      filters: `candidate_id==${candidateId}`,
      sortField: 'created_at',
      sortOrder: 'DESC',
    },
  })
  return data?.responseData?.rows ?? []
}

const bulkAddFiles = async (payload: CandidateFileBulkMutate): Promise<BulkCreateResponse> => {
  return mainInstance<BulkCreateResponse>({
    url: '/api/v1.0/candidateFile/bulk',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: payload,
  })
}

const removeFileFromCandidate = async (candidateId: string, fileId: string): Promise<DeleteResponse> => {
  return mainInstance<DeleteResponse>({
    url: `/api/v1.0/candidateFile/${candidateId}/${fileId}`,
    method: 'DELETE',
  })
}

// ─── Query Key Factory ──────────────────────────────────────────────────────

export const candidateFileKeys = {
  all: ['candidateFiles'] as const,
  byCandidate: (candidateId?: string | null) =>
    candidateId
      ? ([...candidateFileKeys.all, 'candidate', candidateId] as const)
      : ([...candidateFileKeys.all, 'candidate', null] as const),
}

// ─── Query Hook ──────────────────────────────────────────────────────────────

export interface UseCandidateFilesOptions {
  candidateId: string | null | undefined
  enabled?: boolean
}

export const useCandidateFiles = ({
  candidateId,
  enabled = true,
}: UseCandidateFilesOptions) => {
  return useQuery({
    queryKey: candidateFileKeys.byCandidate(candidateId),
    queryFn: () => fetchCandidateFiles(candidateId!),
    enabled: Boolean(enabled && candidateId),
    staleTime: 1000 * 60 * 2,
    retry: 2,
  })
}

// ─── Bulk Add Mutation Hook ─────────────────────────────────────────────────

export const useBulkAddFilesToCandidate = (candidateId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileIds: string[]) =>
      bulkAddFiles({ candidate_id: candidateId, file_ids: fileIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: candidateFileKeys.byCandidate(candidateId),
      })
      if (onSuccess) onSuccess()
    },
  })
}

// ─── Remove File Mutation Hook ───────────────────────────────────────────────

export const useRemoveFileFromCandidate = (candidateId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) =>
      removeFileFromCandidate(candidateId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: candidateFileKeys.byCandidate(candidateId),
      })
    },
  })
}
