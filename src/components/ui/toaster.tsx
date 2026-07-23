'use client'
import type { ReactNode, ComponentProps } from 'react'
import { Toaster as Sonner, toast as sonner } from 'sonner'
import { extractErrorMessage } from '@utils/error'
// import i18n, { Language } from '@utils/i18n'

type ToasterProps = ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme='light'
      className='toaster group'
      toastOptions={{
        classNames: {
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg'
        }
      }}
      {...props}
    />
  )
}

const ToastLayout = (props: { title?: string; content: ReactNode }) => {
  const { title, content } = props
  return (
    <div>
      <h2 className='font-semibold'>{title || 'Thông báo'}</h2>
      {content}
    </div>
  )
}

const toast = Object.assign((title: (() => ReactNode) | ReactNode, data?: never) => sonner(title, data), {
  success: (props: { title?: string; content: ReactNode }) =>
    sonner.success(<ToastLayout title={props.title || 'Thành công'} content={props.content} />),
  warning: (props: { title?: string; content: ReactNode }) =>
    sonner.warning(<ToastLayout title={props.title || 'Cảnh báo'} content={props.content} />),
  error: (props: { title?: string; content: ReactNode }) =>
    sonner.error(<ToastLayout title={props.title || 'Lỗi'} content={props.content} />)
})

// Toast error message
const toastErrorMessage = (error: unknown) => {
  sonner.error('Thất bại', {
    description: extractErrorMessage(error)
  })
}

export { Toaster, toastErrorMessage, toast, sonner }
