'use client';

import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { WorkEvent, WorkPeriod, formatTimeFromISO } from '../types';
import { MapPin, Clock, User, Calendar as CalendarIcon, FileText, Users, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DailyAgendaProps {
  selectedDate: Date;
  events: WorkEvent[];
  onEditEvent?: (event: WorkEvent) => void;
  onDeleteEvent?: (id: string) => void;
  canEditEvent?: boolean;
  canDeleteEvent?: boolean;
}

export function DailyAgenda({
  selectedDate,
  events,
  onEditEvent,
  onDeleteEvent,
  canEditEvent = false,
  canDeleteEvent = false,
}: DailyAgendaProps) {
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const dayEvents = events.filter((e) => e.date === formattedDate);

  const morningEvents = dayEvents.filter((e) => e.period === 'morning').sort((a, b) => a.startTime.localeCompare(b.startTime));
  const afternoonEvents = dayEvents.filter((e) => e.period === 'afternoon').sort((a, b) => a.startTime.localeCompare(b.startTime));

  const renderEventCard = (event: WorkEvent, periodType: WorkPeriod) => {
    const isMorning = periodType === 'morning';

    return (
      <div
        key={event.id}
        className={cn(
          'group relative flex w-full flex-col overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 hover:shadow-md dark:hover:shadow-black/50 bg-white dark:bg-zinc-900/40',
          isMorning? 'border-orange-100 hover:border-orange-300 dark:border-orange-900/20 dark:hover:border-orange-800/40': 'border-blue-100 hover:border-blue-300 dark:border-blue-900/20 dark:hover:border-blue-800/40',
        )}
      >
        <div
          className={cn(
            'absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-20',
            isMorning ? 'bg-orange-500' : 'bg-blue-500',
          )}
        />

        <div className="relative z-10 flex flex-col md:flex-row gap-4 md:items-center">
          {/* Time column */}
          <div className="flex md:flex-col md:w-32 shrink-0 items-center md:items-start gap-3 md:gap-1">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl md:h-14 md:w-14',
                isMorning
                  ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400'
                  : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
              )}
            >
              <Clock className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 dark:text-zinc-500 uppercase font-medium">Bắt đầu</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100 text-base md:text-lg">
                  {formatTimeFromISO(event.schedule_time)}
                </span>
              </div>
              {event.end_time && (
                <div className="flex flex-col pt-1 border-t border-slate-200 dark:border-zinc-700">
                  <span className="text-xs text-slate-500 dark:text-zinc-500 uppercase font-medium">Kết thúc</span>
                  <span className="font-bold text-slate-900 dark:text-zinc-100 text-base md:text-lg">
                    {formatTimeFromISO(event.end_time)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                {event.title}
              </h4>

              {(canEditEvent || canDeleteEvent) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 outline-none transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {canEditEvent && (
                      <DropdownMenuItem onClick={() => onEditEvent?.(event)} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Sửa sự kiện</span>
                      </DropdownMenuItem>
                    )}
                    {canDeleteEvent && (
                      <DropdownMenuItem onClick={() => onDeleteEvent?.(event.id)} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Xóa sự kiện</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {event.description && (
              <p className="text-sm text-slate-600 dark:text-zinc-400 md:text-base leading-relaxed">
                {event.description}
              </p>
            )}

            {event.tasks && (
              <div className="flex items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 px-3 py-2 text-sm">
                <span className="shrink-0 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mt-0.5">
                  Công việc:
                </span>
                <span className="text-slate-700 dark:text-blue-200 leading-relaxed">{event.tasks}</span>
              </div>
            )}

            <div className="flex flex-col gap-2 text-sm font-medium text-slate-600 dark:text-zinc-400 pt-2">
              {event.host && (
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-md">
                  <User className="h-4 w-4 shrink-0 text-slate-400" />
                  <span>
                    Chủ trì:{' '}
                    <span className="font-semibold text-slate-900 dark:text-zinc-200">{event.host}</span>
                  </span>
                </div>
              )}

              {event.participants && (
                <div className="flex items-start gap-1.5 bg-slate-50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-md">
                  <Users className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                  <span className="break-words">
                    Người tham gia:{' '}
                    <span className="text-blue-600 dark:text-blue-400">{event.participants}</span>
                  </span>
                </div>
              )}

              {event.location && (
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-md">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate max-w-[200px]">{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={formattedDate}
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex w-full flex-col"
      >
        {/* Header */}
        <div className="mb-8 flex items-center space-x-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 dark:bg-blue-600/20 dark:text-blue-400 dark:shadow-none">
            <CalendarIcon className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: vi })}
            </h3>
          </div>
        </div>

        <div className="space-y-10">
          {/* Sáng Section */}
          <div className="relative pl-6 sm:pl-8">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-orange-100 dark:bg-orange-900/30" />
            <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full ring-4 ring-orange-50 bg-orange-500 dark:ring-orange-900/20" />
            <h4 className="mb-6 text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest flex items-center gap-2">
              Sáng{' '}
              {morningEvents.length > 0 && (
                <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full text-xs">
                  {morningEvents.length}
                </span>
              )}
            </h4>
            <div className="grid gap-4">
              {morningEvents.length > 0 ? (
                morningEvents.map((event) => renderEventCard(event, 'morning'))
              ) : (
                <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/60 bg-white/50 py-10 text-slate-400 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:text-zinc-500">
                  <FileText className="mb-3 h-8 w-8 opacity-40" />
                  <span className="text-sm font-medium">Không có sự kiện buổi sáng</span>
                </div>
              )}
            </div>
          </div>

            {/* Chiều Section */}
          <div className="relative pl-6 sm:pl-8">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-100 dark:bg-blue-900/30" />
            <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full ring-4 ring-blue-50 bg-blue-500 dark:ring-blue-900/20" />
            <h4 className="mb-6 text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
              Chiều{' '}
              {afternoonEvents.length > 0 && (
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                  {afternoonEvents.length}
                </span>
              )}
            </h4>        
            <div className="grid gap-4">
              {afternoonEvents.length > 0 ? (
                afternoonEvents.map((event) => renderEventCard(event, 'afternoon'))
              ) : (
                <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/60 bg-white/50 py-10 text-slate-400 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:text-zinc-500">
                  <FileText className="mb-3 h-8 w-8 opacity-40" />
                  <span className="text-sm font-medium">Không có sự kiện buổi chiều</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
