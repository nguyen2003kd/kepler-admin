import React from 'react'
import { cn } from '@/lib/utils'

const CaseSmqProSpinner: React.FC<{ size?: number }> = ({ size = 700 }) => {
  const colors = {
    text: '#342E86',
    swooshStart: '#1ABCF0',
    swooshEnd: '#005f87'
  }

  const aspectRatio = 400 / 220

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size / aspectRatio,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <style>{`
        @keyframes spin-elastic { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .ring-dynamic { transform-origin: center; animation: spin-elastic 2s cubic-bezier(0.55, 0.085, 0.68, 0.53) infinite; }
        .ring-smooth-reverse { transform-origin: center; animation: spin-elastic 3s linear infinite reverse; }
        .glow-effect { filter: drop-shadow(0px 0px 4px rgba(26, 188, 240, 0.5)); }
      `}</style>

      <svg viewBox="0 0 400 220" style={{ width: '100%', height: '100%', overflow: 'visible' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="swooshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.swooshStart} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.swooshEnd} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <text x="200" y="115" dominantBaseline="middle" textAnchor="middle" fill={colors.text}
          style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px', userSelect: 'none' }}>
          CASE-SMQ
        </text>

        <circle className="ring-smooth-reverse" cx="200" cy="110" r="115" fill="none" stroke={colors.swooshStart} strokeWidth="1" strokeDasharray="10 20" opacity="0.2" />

        <circle className="ring-dynamic glow-effect" cx="200" cy="110" r="100" fill="none" stroke="url(#swooshGradient)" strokeWidth="6" strokeLinecap="round" strokeDasharray="150 478" />

        <circle className="ring-dynamic glow-effect" cx="200" cy="110" r="100" fill="none" stroke={colors.swooshStart} strokeWidth="6" strokeLinecap="round" strokeDasharray="100 528" strokeDashoffset="314" opacity="0.8" style={{ animationDuration: '2.2s' }} />
      </svg>
    </div>
  )
}

interface FallbackSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
  fullScreen?: boolean
}

export const FallbackSpinner: React.FC<FallbackSpinnerProps> = ({
  size = 'md',
  className,
  text = '',
  fullScreen = false
}) => {
  // const sizeClasses: Record<string, string> = {
  //   sm: 'w-4 h-4',
  //   md: 'w-6 h-6',
  //   lg: 'w-8 h-8',
  //   xl: 'w-12 h-12'
  // }

  const textSizeClasses: Record<string, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const spinner = (
    <div className="flex items-center gap-3">
      <CaseSmqProSpinner size={{ sm: 120, md: 320, lg: 480, xl: 700 }[size]} />
      <div className="leading-tight">
        <p className={cn('font-semibold text-gray-800 dark:text-gray-100', textSizeClasses[size])}>{text}</p>
        <span className="sr-only">{text}</span>
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" role="status" aria-live="polite">
        <div className="">
          {spinner}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('inline-flex items-center justify-center p-3 bg-white/80 dark:bg-gray-900/60 rounded-lg', className)} role="status" aria-live="polite">
      {spinner}
    </div>
  )
}

// export const InlineSpinner: React.FC<{ className?: string; label?: string }> = ({ className, label = 'Đang tải' }) => {
//   return (
//     <span className={cn('inline-flex items-center', className)} role="status" aria-live="polite">
//       <Loader2 className={cn('animate-spin w-4 h-4 mr-2 text-indigo-600')} aria-hidden="true" />
//       <span className="sr-only">{label}</span>
//     </span>
//   )
// }

// Spinner cho button loading state
// export const ButtonSpinner: React.FC<{ className?: string; label?: string }> = ({ className, label = 'Đang tải' }) => {
//   return (
//     <span className={cn('inline-flex items-center', className)} role="status" aria-live="polite">
//       <Loader2 className={cn('animate-spin w-4 h-4 mr-2 text-white')} aria-hidden="true" />
//       <span className="sr-only">{label}</span>
//     </span>
//   )
// }

export default FallbackSpinner
