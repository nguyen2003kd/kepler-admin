/**
 * Work Schedule Types
 * Types for work schedule and calendar management
 * Aligned with backend API:
 *   - GET/POST/PUT/DELETE /api/v1.0/workSchedule
 *   - GET /api/v1.0/workSchedule/{id}
 */

export type WorkPeriod = 'morning' | 'afternoon'

// ------------------------------------------------------------------
// Backend API types
// ------------------------------------------------------------------

export interface WorkSchedule {
  id?: string
  title?: string
  description?: string | null
  tasks?: string | null
  /** Free-text name of the host */
  host?: string | null
  /** Free-text list of participants */
  participants?: string | null
  schedule_time?: string
  end_time?: string | null
  status?: string | null
  created_by?: string
  created_at?: string | null
}

export interface WorkScheduleMutate {
  title: string
  description?: string | null
  tasks?: string | null
  host?: string | null
  participants?: string | null
  schedule_time: string
  end_time?: string | null
  status?: string
}

// ------------------------------------------------------------------
// FE UI types
// ------------------------------------------------------------------

export interface WorkEvent {
  id: string
  title: string
  description: string
  tasks: string
  host: string
  participants: string
  startTime: string   // h:mm a — for calendar display
  endTime: string
  date: string        // YYYY-MM-DD — for calendar display
  period: WorkPeriod
  location?: string
  schedule_time?: string
  end_time?: string | null
}

// ------------------------------------------------------------------
// Mapping helpers
// ------------------------------------------------------------------

/**
 * Convert backend WorkSchedule to FE WorkEvent
 */
export function mapWorkScheduleToWorkEvent(ws: WorkSchedule): WorkEvent {
  let dateStr = formatDate(new Date())
  let hours = 8

  if (ws.schedule_time) {
    dateStr = ws.schedule_time.split('T')[0] ?? formatDate(new Date())
    const timePart = ws.schedule_time.split('T')[1] ?? '08:00:00'
    hours = parseInt(timePart.split(':')[0] ?? '08', 10)
  }

  const period: WorkPeriod = hours < 12 ? 'morning' : 'afternoon'
  const startTime = formatTimeFromISO(ws.schedule_time)
  const endTime = ws.end_time ? formatTimeFromISO(ws.end_time) : addHoursToTime(startTime, 2)

  return {
    id: ws.id ?? '',
    title: ws.title ?? '',
    description: ws.description ?? '',
    tasks: ws.tasks ?? '',
    host: ws.host ?? '',
    participants: ws.participants ?? '',
    startTime,
    endTime,
    date: dateStr,
    period,
    location: undefined,
    schedule_time: ws.schedule_time,
    end_time: ws.end_time,
  }
}

/**
 * Convert FE WorkEvent to backend WorkScheduleMutate payload
 */
export function mapWorkEventToWorkScheduleMutate(
  event: WorkEvent,
  status = 'pending'
): WorkScheduleMutate {
  const schedule_time = event.schedule_time
    ? toISOString(event.schedule_time)
    : `${event.date}T08:00:00.000Z`

  const end_time = event.end_time ? toISOString(event.end_time) : null

  return {
    title: event.title,
    description: event.description || null,
    tasks: event.tasks || null,
    host: event.host || null,
    participants: event.participants || null,
    schedule_time,
    end_time,
    status,
  }
}

// ------------------------------------------------------------------
// Utility helpers
// ------------------------------------------------------------------

function toISOString(datetimeLocal: string): string {
  const [datePart, timePart] = datetimeLocal.split('T')
  if (!datePart || !timePart) return `${datetimeLocal}:00.000Z`
  return `${datePart}T${timePart}:00.000Z`
}

export function formatTimeFromISO(isoString: string | undefined): string {
  if (!isoString) return '8:00 AM'
  const timePart = isoString.split('T')[1] ?? '08:00:00'
  const parts = timePart.split(':')
  const hours = parseInt(parts[0] ?? '8', 10)
  const minutes = parseInt(parts[1] ?? '0', 10)
  const period = hours < 12 ? 'AM' : 'PM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatTime(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours < 12 ? 'AM' : 'PM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`
}

export function addHoursToTime(time: string, hours: number): string {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return time

  let h = parseInt(match[1], 10)
  const m = parseInt(match[2], 10)
  const period = match[3].toUpperCase()

  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0

  const totalMinutes = h * 60 + m + hours * 60
  const newH = Math.floor(totalMinutes / 60) % 24
  const newM = totalMinutes % 60
  const newPeriod = newH < 12 ? 'AM' : 'PM'
  const displayH = newH % 12 || 12
  return `${displayH}:${String(newM).padStart(2, '0')} ${newPeriod}`
}

export function getPeriodFromTime(startTime: string): WorkPeriod {
  const match = startTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (match) {
    let h = parseInt(match[1], 10)
    const period = match[3].toUpperCase()
    if (period === 'PM' && h !== 12) h += 12
    if (period === 'AM' && h === 12) h = 0
    return h < 12 ? 'morning' : 'afternoon'
  }
  const hour = parseInt(startTime.split(':')[0], 10)
  return hour < 12 ? 'morning' : 'afternoon'
}
