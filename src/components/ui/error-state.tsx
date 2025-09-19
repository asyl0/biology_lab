import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ 
  title = "Произошла ошибка", 
  message = "Не удалось загрузить данные. Попробуйте обновить страницу.",
  onRetry,
  className 
}: ErrorStateProps) {
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary-50/30 to-accent-50/30",
      className
    )}>
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{message}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} className="btn-hover">
              <RefreshCw className="h-4 w-4 mr-2" />
              Попробовать снова
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="btn-hover"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить страницу
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ErrorCardProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorCard({ 
  title = "Ошибка загрузки", 
  message = "Не удалось загрузить данные",
  onRetry,
  className 
}: ErrorCardProps) {
  return (
    <div className={cn(
      "p-8 text-center space-y-4 bg-destructive/5 border border-destructive/20 rounded-lg",
      className
    )}>
      <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button size="sm" onClick={onRetry} className="btn-hover">
          <RefreshCw className="h-4 w-4 mr-2" />
          Попробовать снова
        </Button>
      )}
    </div>
  )
}
