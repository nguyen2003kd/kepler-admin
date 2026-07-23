import type { Service } from '@/api/models/service'
import type { ServiceMutate } from '@/api/models/serviceMutate'

export type { Service, ServiceMutate }

export interface ServiceFormValues {
  name: string
}
