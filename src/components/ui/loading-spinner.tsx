import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

interface LoadingPageProps {
  timeout?: number
  onTimeout?: () => void
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8",
  xl: "h-12 w-12"
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  )
}

export function LoadingPage({ timeout = 30000, onTimeout }: LoadingPageProps) {
  const [showTimeout, setShowTimeout] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true)
      onTimeout?.()
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout, onTimeout])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary-50/30 to-accent-50/30">
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" className="mx-auto" />
        <p className="text-muted-foreground text-lg">
          {showTimeout ? 'Загрузка занимает больше времени, чем ожидалось...' : 'Загрузка...'}
        </p>
        {showTimeout && (
          <button 
            onClick={() => window.location.reload()}
            className="text-primary hover:text-primary-600 underline text-sm"
          >
            Обновить страницу
          </button>
        )}
      </div>
    </div>
  )
}
