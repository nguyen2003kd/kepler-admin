'use client'

import React from 'react'
import { WorkScheduleCalendar } from './components/work-schedule-calendar'
import { DailyAgenda } from './components/daily-agenda'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventFormDialog } from './components/event-form-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  useWorkSchedule,
  useCanCreateWorkSchedule,
  useCanEditWorkSchedule,
  useCanDeleteWorkSchedule,
} from './hooks'
import { FallbackSpinner } from '@/components/shared/fallbackspinner'
import { Header } from '@/components/layout/header'

export default function WorkSchedulePage() {

  const {
    currentDate,
    selectedDate,
    events,
    isFormOpen,
    setIsFormOpen,
    editingEvent,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    isLoading,
    isSubmitting,
    handleSelectDate,
    handleMonthChange,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleFormSubmit,
    handleConfirmDelete,
  } = useWorkSchedule()

  const canCreate = useCanCreateWorkSchedule()
  const canEdit = useCanEditWorkSchedule()
  const canDelete = useCanDeleteWorkSchedule()

  return (
    <>
      <Header title="Lịch Công Tác" />
      <div className="flex h-full min-h-[calc(100vh-theme(spacing.16))] flex-col space-y-8 bg-slate-50/50 p-6 md:p-8 dark:bg-zinc-950 dark:text-zinc-50">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Lịch Công Tác
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Quản lý và theo dõi lịch trình làm việc, sự kiện và cuộc họp.
            </p>
          </div>
          {canCreate && (
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleAddClick}
                className="flex items-center gap-2 bg-blue-600 font-medium hover:bg-blue-700 text-white shadow-sm transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm sự kiện</span>
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex h-[400px] w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/20">
            <FallbackSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-10">
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
              <WorkScheduleCalendar
                currentDate={currentDate}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                onMonthChange={handleMonthChange}
                events={events}
              />
            </div>
            <div className="lg:col-span-7 xl:col-span-8">
              {selectedDate && (
                <DailyAgenda
                  selectedDate={selectedDate}
                  events={events}
                  onEditEvent={handleEditClick}
                  onDeleteEvent={handleDeleteClick}
                  canEditEvent={canEdit}
                  canDeleteEvent={canDelete}
                />
              )}
            </div>
          </div>
        )}

        {/* Event Form Dialog */}
        <EventFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          initialData={editingEvent}
          selectedDate={selectedDate}
          isSubmitting={isSubmitting}
        />

        {/* Delete Confirmation */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent className="bg-white dark:bg-gray-950">
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa sự kiện?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Sự kiện sẽ bị xóa khỏi lịch công tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Xóa sự kiện
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}
