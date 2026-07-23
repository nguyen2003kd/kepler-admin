'use client';

import React from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WorkEvent } from '../types';

interface WorkScheduleCalendarProps {
  currentDate: Date;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  events: WorkEvent[];
}

export function WorkScheduleCalendar({
  currentDate,
  selectedDate,
  onSelectDate,
  onMonthChange,
  events,
}: WorkScheduleCalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const handlePrevMonth = () => {
    onMonthChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentDate, 1));
  };

  // Helper to check if a day has events
  const getEventsForDay = (day: Date) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    return events.filter((e) => e.date === formattedDay);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:ring-zinc-800/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-zinc-800/50">
        <h2 className="text-lg font-semibold capitalize tracking-tight text-slate-900 dark:text-zinc-100">
          {format(currentDate, 'MMMM yyyy', { locale: vi })}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-8 w-8 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* Week days header */}
        <div className="mb-4 grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const hasMorning = dayEvents.some((e) => e.period === 'morning');
            const hasAfternoon = dayEvents.some((e) => e.period === 'afternoon');
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isDayToday = isToday(day);

            return (
              <div
                key={day.toString()}
                onClick={() => onSelectDate(day)}
                className={cn(
                  'group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl text-sm font-medium transition-colors',
                  !isCurrentMonth && 'text-slate-300 dark:text-zinc-700',
                  isCurrentMonth && !isSelected && !isDayToday && 'text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
                  isDayToday && !isSelected && 'bg-blue-50/50 text-blue-600 hover:bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20',
                  isSelected && 'bg-blue-600 text-white shadow-md shadow-blue-500/25 dark:bg-blue-600 dark:shadow-blue-900/20'
                )}
              >
                <span className={cn('z-10', isDayToday && !isSelected && 'font-bold')}>{format(day, 'd')}</span>

                {/* Event Dots Container */}
                {(hasMorning || hasAfternoon) && (
                  <div className="absolute bottom-1.5 md:bottom-2 left-0 right-0 flex justify-center gap-[3px]">
                    {hasMorning && (
                      <div
                        className={cn(
                          'h-1 w-1 md:h-1.5 md:w-1.5 rounded-full',
                          isSelected ? 'bg-white/90' : 'bg-orange-400 dark:bg-orange-500'
                        )}
                      />
                    )}
                    {hasAfternoon && (
                      <div
                        className={cn(
                          'h-1 w-1 md:h-1.5 md:w-1.5 rounded-full',
                          isSelected ? 'bg-white/90' : 'bg-blue-500 dark:bg-blue-400'
                        )}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-8 flex items-center justify-center gap-6 rounded-xl bg-slate-50 py-3 text-[11px] font-medium text-slate-500 dark:bg-zinc-800/20 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-400 dark:bg-orange-500"></div>
            <span>Lịch Sáng</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
            <span>Lịch Chiều</span>
          </div>
        </div>
      </div>
    </div>
  );
}
