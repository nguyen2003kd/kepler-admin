import { toast as sonner } from 'sonner'

type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export const useToast = () => {
  const toast = ({ title, description, variant = 'default' }: ToastProps) => {
    if (variant === 'destructive') {
      sonner.error(title, {
        description: description
      })
    } else {
      sonner.success(title, {
        description: description
      })
    }
  }

  return { toast }
}

export { useToast as toast }