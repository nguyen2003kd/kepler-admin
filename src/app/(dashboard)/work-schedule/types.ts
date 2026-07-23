/**
 * Work Schedule Types
 * Re-exports from centralized src/types/ for backward compatibility
 */

export type {
  WorkPeriod,
  WorkEvent,
  WorkSchedule,
  WorkScheduleMutate,
} from '@/types/work-schedule'

export {
  mapWorkScheduleToWorkEvent,
  mapWorkEventToWorkScheduleMutate,
  formatDate,
  formatTime,
  formatTimeFromISO,
  addHoursToTime,
  getPeriodFromTime,
} from '@/types/work-schedule'
